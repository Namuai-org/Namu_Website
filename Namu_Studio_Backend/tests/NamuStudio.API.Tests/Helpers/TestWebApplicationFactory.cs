using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NamuStudio.Application.Abstractions.Email;
using NamuStudio.Infrastructure.Persistence;

namespace NamuStudio.API.Tests.Helpers;

public class TestWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        _connection.Open();
        builder.UseEnvironment("Development");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<NamuDbContext>));
            services.RemoveAll(typeof(NamuDbContext));
            services.RemoveAll(typeof(IEmailService));

            services.AddDbContext<NamuDbContext>(options => options.UseSqlite(_connection));
            services.AddScoped<IEmailService, TestEmailService>();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing)
        {
            _connection.Dispose();
        }
    }

    private sealed class TestEmailService : IEmailService
    {
        public Task SendPasswordResetEmailAsync(string to, string name, string token, CancellationToken cancellationToken) => Task.CompletedTask;
        public Task SendVerificationEmailAsync(string to, string name, string token, CancellationToken cancellationToken) => Task.CompletedTask;
        public Task SendWelcomeEmailAsync(string to, string name, CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
