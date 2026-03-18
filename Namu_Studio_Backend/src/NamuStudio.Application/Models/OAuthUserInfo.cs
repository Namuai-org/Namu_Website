using NamuStudio.Core.Enums;

namespace NamuStudio.Application.Models;

public record OAuthUserInfo(
    AuthProvider Provider,
    string ExternalProviderId,
    string Email,
    string FullName,
    string? AvatarUrl);
