using System.Security.Claims;
using NamuStudio.Core.Entities;

namespace NamuStudio.Application.Abstractions.Auth;

public interface IJwtService
{
    string GenerateAccessToken(User user);

    DateTime GetAccessTokenExpiryUtc();

    string GenerateRefreshToken();

    ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
