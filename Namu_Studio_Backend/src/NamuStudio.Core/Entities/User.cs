using NamuStudio.Core.Common;
using NamuStudio.Core.Enums;

namespace NamuStudio.Core.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;

    public string FullName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }

    public string Theme { get; set; } = "namu";

    public string Language { get; set; } = "en";

    public bool OnboardingComplete { get; set; }

    public bool IsEmailVerified { get; set; }

    public string? EmailVerificationToken { get; set; }

    public DateTime? EmailVerificationExpiry { get; set; }

    public string? PasswordResetToken { get; set; }

    public DateTime? PasswordResetExpiry { get; set; }

    public AuthProvider AuthProvider { get; set; }

    public string? ExternalProviderId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? LastLoginAt { get; set; }

    public ICollection<Session> Sessions { get; set; } = [];

    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
