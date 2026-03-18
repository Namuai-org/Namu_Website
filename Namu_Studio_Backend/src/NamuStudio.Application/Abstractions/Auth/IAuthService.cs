using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.Models;

namespace NamuStudio.Application.Abstractions.Auth;

public interface IAuthService
{
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, AuthContext context, CancellationToken cancellationToken);

    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, AuthContext context, CancellationToken cancellationToken);

    Task<Result<AuthResponse>> RefreshTokenAsync(RefreshRequest request, AuthContext context, CancellationToken cancellationToken);

    Task<Result> RevokeTokenAsync(string token, string ipAddress, CancellationToken cancellationToken);

    Task<Result> ForgotPasswordAsync(string email, CancellationToken cancellationToken);

    Task<Result> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken);

    Task<Result<bool>> VerifyEmailAsync(string token, CancellationToken cancellationToken);
}
