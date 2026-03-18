using System.Security.Claims;
using NamuStudio.Application.Constants;

namespace NamuStudio.Application.Common;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirst(ClaimNames.Subject)?.Value ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(value, out var id) ? id : null;
    }
}
