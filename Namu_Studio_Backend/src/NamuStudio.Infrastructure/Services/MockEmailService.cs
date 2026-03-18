using Microsoft.Extensions.Logging;
using NamuStudio.Application.Abstractions.Email;

namespace NamuStudio.Infrastructure.Services;

public class MockEmailService(ILogger<MockEmailService> logger) : IEmailService
{
    public Task SendVerificationEmailAsync(string to, string name, string token, CancellationToken cancellationToken)
    {
        logger.LogInformation("Mock verification email to {To} for {Name} token {Token}", to, name, token);
        return Task.CompletedTask;
    }

    public Task SendPasswordResetEmailAsync(string to, string name, string token, CancellationToken cancellationToken)
    {
        logger.LogInformation("Mock password reset email to {To} for {Name} token {Token}", to, name, token);
        return Task.CompletedTask;
    }

    public Task SendWelcomeEmailAsync(string to, string name, CancellationToken cancellationToken)
    {
        logger.LogInformation("Mock welcome email to {To} for {Name}", to, name);
        return Task.CompletedTask;
    }
}
