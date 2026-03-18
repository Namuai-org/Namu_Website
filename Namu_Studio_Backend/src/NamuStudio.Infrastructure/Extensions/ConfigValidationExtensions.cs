using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using NamuStudio.Infrastructure.Options;

namespace NamuStudio.Infrastructure.Extensions;

public static class ConfigValidationExtensions
{
    public static void ValidateStartupConfiguration(this IServiceProvider serviceProvider)
    {
        var environment = serviceProvider.GetRequiredService<IHostEnvironment>();
        var jwt = serviceProvider.GetRequiredService<IOptions<JwtSettings>>().Value;
        var frontend = serviceProvider.GetRequiredService<IOptions<FrontendSettings>>().Value;

        if (string.IsNullOrWhiteSpace(jwt.Issuer) || string.IsNullOrWhiteSpace(jwt.Audience))
        {
            throw new InvalidOperationException("Jwt configuration is missing Issuer or Audience.");
        }

        if (jwt.Secret.Length < 32)
        {
            throw new InvalidOperationException("Jwt:Secret must be at least 32 characters long.");
        }

        if (string.IsNullOrWhiteSpace(frontend.BaseUrl))
        {
            throw new InvalidOperationException("Frontend:BaseUrl is required.");
        }

        if (!environment.IsDevelopment())
        {
            var email = serviceProvider.GetRequiredService<IOptions<EmailSettings>>().Value;
            if (string.IsNullOrWhiteSpace(email.SmtpHost) || string.IsNullOrWhiteSpace(email.Username) || string.IsNullOrWhiteSpace(email.Password))
            {
                throw new InvalidOperationException("Production email settings are incomplete.");
            }
        }
    }
}
