using FluentValidation;
using System.Text;
using System.Threading.RateLimiting;
using FluentValidation.AspNetCore;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NamuStudio.API.Extensions;
using NamuStudio.API.Filters;
using NamuStudio.API.Health;
using NamuStudio.API.Middleware;
using NamuStudio.Application.Abstractions.Auth;
using NamuStudio.Application.Abstractions.Code;
using NamuStudio.Application.Abstractions.Email;
using NamuStudio.Application.Abstractions.OAuth;
using NamuStudio.Application.Abstractions.Outputs;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Abstractions.Sessions;
using NamuStudio.Application.Abstractions.Users;
using NamuStudio.Application.Common;
using NamuStudio.Application.Extensions;
using NamuStudio.Application.Validators;
using NamuStudio.Infrastructure.Extensions;
using NamuStudio.Infrastructure.Options;
using NamuStudio.Infrastructure.Persistence;
using NamuStudio.Infrastructure.Persistence.Initializers;
using NamuStudio.Infrastructure.Services;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", Serilog.Events.LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore", Serilog.Events.LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithMachineName()
    .Enrich.WithEnvironmentName()
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File("logs/namu-.log", rollingInterval: RollingInterval.Day, retainedFileCountLimit: 30, outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Email"));
builder.Services.Configure<OAuthSettings>(builder.Configuration.GetSection("OAuth"));
builder.Services.Configure<FrontendSettings>(builder.Configuration.GetSection("Frontend"));
builder.Services.Configure<SecuritySettings>(builder.Configuration.GetSection("Security"));

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? builder.Configuration["ConnectionStrings__DefaultConnection"]
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is required.");

builder.Services.AddDbContext<NamuDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<INamuDbContext>(provider => provider.GetRequiredService<NamuDbContext>());

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("frontend", policy =>
    {
        var origins = builder.Environment.IsDevelopment()
            ? new[] { "http://localhost:3000" }
            : new[] { builder.Configuration["Frontend:BaseUrl"] ?? string.Empty };

        policy.WithOrigins(origins)
            .WithMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .WithHeaders("Authorization", "Content-Type", "X-Requested-With")
            .AllowCredentials();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.OnRejected = async (context, cancellationToken) =>
    {
        if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
        {
            context.HttpContext.Response.Headers.RetryAfter = ((int)retryAfter.TotalSeconds).ToString();
        }

        await context.HttpContext.Response.WriteAsJsonAsync(new { type = "RateLimitExceeded", message = "Too many requests." }, cancellationToken);
    };

    options.AddPolicy("auth", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(httpContext.GetClientIpAddress(), _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 0
        }));

    options.AddPolicy("strict", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(httpContext.GetClientIpAddress(), _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 3,
            Window = TimeSpan.FromHours(1),
            QueueLimit = 0
        }));

    options.AddPolicy("api", httpContext =>
        RateLimitPartition.GetSlidingWindowLimiter(
            httpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? httpContext.GetClientIpAddress(),
            _ => new SlidingWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                SegmentsPerWindow = 4,
                QueueLimit = 0
            }));
});

builder.Services.AddControllers(options => options.Filters.Add<ValidationFilter>());
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<ValidationFilter>();

var typeAdapterConfig = TypeAdapterConfig.GlobalSettings;
typeAdapterConfig.RegisterMappings();
builder.Services.AddSingleton(typeAdapterConfig);
builder.Services.AddScoped<IMapper, ServiceMapper>();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IAuthService>(provider => provider.GetRequiredService<AuthService>());
builder.Services.AddScoped<IOAuthService, OAuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISessionService, SessionService>();
builder.Services.AddScoped<ICreateOutputService, CreateOutputService>();
builder.Services.AddScoped<ICodeService, CodeService>();
builder.Services.AddScoped<DatabaseInitializer>();
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<IEmailService, MockEmailService>();
}
else
{
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
}

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "NamuStudio API", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        [new OpenApiSecurityScheme { Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" } }] = Array.Empty<string>()
    });
});
builder.Services.AddHttpClient("oauth");

var app = builder.Build();
app.Services.ValidateStartupConfiguration();

app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors("frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<RequestLoggingMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.MapGet("/health", async (NamuDbContext dbContext, CancellationToken cancellationToken) =>
{
    var isHealthy = await dbContext.Database.CanConnectAsync(cancellationToken);
    return Results.Ok(new HealthResponse(
        isHealthy ? "healthy" : "unhealthy",
        DateTime.UtcNow,
        new Dictionary<string, string> { ["database"] = isHealthy ? "healthy" : "unhealthy" },
        "1.0.0"));
});

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
    await initializer.InitializeAsync();
}

app.Run();

public partial class Program;
