using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using NamuStudio.Application.Abstractions.Email;
using NamuStudio.Infrastructure.Options;

namespace NamuStudio.Infrastructure.Services;

public class SmtpEmailService(IOptions<EmailSettings> emailOptions, IOptions<FrontendSettings> frontendOptions) : IEmailService
{
    private readonly EmailSettings _emailSettings = emailOptions.Value;
    private readonly FrontendSettings _frontendSettings = frontendOptions.Value;

    public Task SendVerificationEmailAsync(string to, string name, string token, CancellationToken cancellationToken)
        => SendEmailAsync(to, "Tabbatar da imel dinka — Namu", BuildVerificationHtml(name, token), cancellationToken);

    public Task SendPasswordResetEmailAsync(string to, string name, string token, CancellationToken cancellationToken)
        => SendEmailAsync(to, "Sake saita kalmar sirri — Namu", BuildPasswordResetHtml(name, token), cancellationToken);

    public Task SendWelcomeEmailAsync(string to, string name, CancellationToken cancellationToken)
        => SendEmailAsync(to, "Barka da zuwa Namu", $"<p>Sannu {name},</p><p>Barka da zuwa Namu AI-Studio.</p>", cancellationToken);

    private async Task SendEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_emailSettings.FromName, _emailSettings.FromAddress));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(_emailSettings.SmtpHost, _emailSettings.SmtpPort, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }

    private string BuildVerificationHtml(string name, string token)
        => BuildEmailTemplate(name, "Ka danna mabudin don tabbatar da asusunka.", "Tabbatar da Imel", $"{_frontendSettings.BaseUrl}/auth/verify?token={token}", "Mabudin zai kare bayan sa'o'i 24.");

    private string BuildPasswordResetHtml(string name, string token)
        => BuildEmailTemplate(name, "Ka nemi sake saita kalmar sirri.", "Sake Saita Kalmar Sirri", $"{_frontendSettings.BaseUrl}/auth/reset?token={token}", "Mabudin zai kare bayan awa 1. Idan ba kai ba, ka yi watsi da wannan.");

    private static string BuildEmailTemplate(string name, string body, string buttonText, string link, string footerMessage)
        => $"""
           <div style="font-family:Arial,sans-serif;background:#fff7ed;padding:24px;">
             <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:16px;">
               <div style="width:48px;height:48px;background:#f97316;color:#ffffff;font-weight:bold;font-size:28px;display:flex;align-items:center;justify-content:center;border-radius:12px;">N</div>
               <p>Sannu {System.Net.WebUtility.HtmlEncode(name)},</p>
               <p>{body}</p>
               <p style="margin:24px 0;">
                 <a href="{link}" style="background:#f97316;color:#ffffff;padding:14px 24px;text-decoration:none;border-radius:10px;display:inline-block;">{buttonText}</a>
               </p>
               <p>{footerMessage}</p>
               <p style="color:#6b7280;">© 2026 Namu</p>
             </div>
           </div>
           """;
}
