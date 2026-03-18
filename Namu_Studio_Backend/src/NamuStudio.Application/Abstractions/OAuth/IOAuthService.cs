using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.Models;

namespace NamuStudio.Application.Abstractions.OAuth;

public interface IOAuthService
{
    Task<Result<AuthResponse>> HandleGoogleCallbackAsync(string code, AuthContext context, CancellationToken cancellationToken);

    Task<Result<AuthResponse>> HandleGitHubCallbackAsync(string code, AuthContext context, CancellationToken cancellationToken);

    Task<Result<AuthResponse>> HandleAppleCallbackAsync(string idToken, AuthContext context, CancellationToken cancellationToken);
}
