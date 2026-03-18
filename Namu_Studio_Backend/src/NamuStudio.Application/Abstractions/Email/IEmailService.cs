namespace NamuStudio.Application.Abstractions.Email;

public interface IEmailService
{
    Task SendVerificationEmailAsync(string to, string name, string token, CancellationToken cancellationToken);

    Task SendPasswordResetEmailAsync(string to, string name, string token, CancellationToken cancellationToken);

    Task SendWelcomeEmailAsync(string to, string name, CancellationToken cancellationToken);
}
