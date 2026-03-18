using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NamuStudio.Application.Abstractions.Auth;
using NamuStudio.Application.Abstractions.Email;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.DTOs.Users;
using NamuStudio.Application.Models;
using NamuStudio.Core.Entities;
using NamuStudio.Core.Enums;
using NamuStudio.Infrastructure.Options;

namespace NamuStudio.Infrastructure.Services;

public class AuthService(
    INamuDbContext dbContext,
    IJwtService jwtService,
    IEmailService emailService,
    IOptions<JwtSettings> jwtOptions,
    IOptions<SecuritySettings> securityOptions,
    ILogger<AuthService> logger) : IAuthService
{
    private readonly JwtSettings _jwtSettings = jwtOptions.Value;
    private readonly SecuritySettings _securitySettings = securityOptions.Value;

    public async Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, AuthContext context, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await dbContext.Users.AnyAsync(x => x.Email == email, cancellationToken))
        {
            return Result<AuthResponse>.Failure("Email is already registered.");
        }

        var user = new User
        {
            Email = email,
            FullName = request.FullName.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, _securitySettings.BCryptWorkFactor),
            AuthProvider = AuthProvider.Email,
            EmailVerificationToken = Guid.NewGuid().ToString("N"),
            EmailVerificationExpiry = DateTime.UtcNow.AddHours(24)
        };

        dbContext.Users.Add(user);
        var refreshToken = CreateRefreshToken(user.Id, context.IpAddress);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        _ = Task.Run(() => emailService.SendVerificationEmailAsync(user.Email, user.FullName, user.EmailVerificationToken!, CancellationToken.None), CancellationToken.None);
        logger.LogInformation("User registered {UserId}", user.Id);
        return Result<AuthResponse>.Success(CreateAuthResponse(user, refreshToken.Token));
    }

    public async Task<Result<AuthResponse>> LoginAsync(LoginRequest request, AuthContext context, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await dbContext.Users.Include(x => x.RefreshTokens).SingleOrDefaultAsync(x => x.Email == email, cancellationToken);
        if (user is null || string.IsNullOrWhiteSpace(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            logger.LogWarning("Failed login attempt for {Email}", email);
            return Result<AuthResponse>.Unauthorized("Invalid credentials.");
        }

        if (!user.IsActive)
        {
            return Result<AuthResponse>.Unauthorized("Account is inactive.");
        }

        foreach (var token in user.RefreshTokens.Where(x => x.IsActive))
        {
            token.IsRevoked = true;
            token.RevokedByIp = context.IpAddress;
            token.RevokedAt = DateTime.UtcNow;
        }

        user.LastLoginAt = DateTime.UtcNow;
        var refreshToken = CreateRefreshToken(user.Id, context.IpAddress);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("User logged in {UserId}", user.Id);
        return Result<AuthResponse>.Success(CreateAuthResponse(user, refreshToken.Token));
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(RefreshRequest request, AuthContext context, CancellationToken cancellationToken)
    {
        var refreshToken = await dbContext.RefreshTokens.Include(x => x.User).SingleOrDefaultAsync(x => x.Token == request.RefreshToken, cancellationToken);
        if (refreshToken is null || !refreshToken.IsActive)
        {
            return Result<AuthResponse>.Unauthorized("Refresh token is invalid.");
        }

        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = context.IpAddress;

        var replacement = CreateRefreshToken(refreshToken.UserId, context.IpAddress);
        refreshToken.ReplacedByToken = replacement.Token;
        dbContext.RefreshTokens.Add(replacement);
        await dbContext.SaveChangesAsync(cancellationToken);

        logger.LogDebug("Token refreshed for {UserId}", refreshToken.UserId);
        return Result<AuthResponse>.Success(CreateAuthResponse(refreshToken.User, replacement.Token));
    }

    public async Task<Result> RevokeTokenAsync(string token, string ipAddress, CancellationToken cancellationToken)
    {
        var refreshToken = await dbContext.RefreshTokens.SingleOrDefaultAsync(x => x.Token == token, cancellationToken);
        if (refreshToken is null || !refreshToken.IsActive)
        {
            return Result.Failure("Refresh token is invalid.");
        }

        refreshToken.IsRevoked = true;
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Token revoked for {UserId}", refreshToken.UserId);
        return Result.Success();
    }

    public async Task<Result> ForgotPasswordAsync(string email, CancellationToken cancellationToken)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
        if (user is null)
        {
            return Result.Success();
        }

        user.PasswordResetToken = Guid.NewGuid().ToString("N");
        user.PasswordResetExpiry = DateTime.UtcNow.AddHours(1);
        await dbContext.SaveChangesAsync(cancellationToken);
        _ = Task.Run(() => emailService.SendPasswordResetEmailAsync(user.Email, user.FullName, user.PasswordResetToken!, CancellationToken.None), CancellationToken.None);
        logger.LogInformation("Password reset requested for {UserId}", user.Id);
        return Result.Success();
    }

    public async Task<Result> ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.Include(x => x.RefreshTokens)
            .SingleOrDefaultAsync(x => x.PasswordResetToken == request.Token && x.PasswordResetExpiry > DateTime.UtcNow, cancellationToken);
        if (user is null)
        {
            return Result.Failure("Reset token is invalid or expired.");
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, _securitySettings.BCryptWorkFactor);
        user.PasswordResetToken = null;
        user.PasswordResetExpiry = null;
        foreach (var token in user.RefreshTokens.Where(x => !x.IsRevoked))
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    public async Task<Result<bool>> VerifyEmailAsync(string token, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(x => x.EmailVerificationToken == token && x.EmailVerificationExpiry > DateTime.UtcNow, cancellationToken);
        if (user is null)
        {
            return Result<bool>.Failure("Verification token is invalid or expired.");
        }

        user.IsEmailVerified = true;
        user.EmailVerificationToken = null;
        user.EmailVerificationExpiry = null;
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Email verified for {UserId}", user.Id);
        return Result<bool>.Success(true);
    }

    internal async Task<Result<AuthResponse>> SignInOAuthUserAsync(OAuthUserInfo userInfo, AuthContext context, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.Include(x => x.RefreshTokens)
            .SingleOrDefaultAsync(x => x.ExternalProviderId == userInfo.ExternalProviderId && x.AuthProvider == userInfo.Provider, cancellationToken);

        if (user is null)
        {
            user = await dbContext.Users.SingleOrDefaultAsync(x => x.Email == userInfo.Email, cancellationToken);
            if (user is null)
            {
                user = new User
                {
                    Email = userInfo.Email.Trim().ToLowerInvariant(),
                    FullName = string.IsNullOrWhiteSpace(userInfo.FullName) ? userInfo.Email : userInfo.FullName.Trim(),
                    AvatarUrl = userInfo.AvatarUrl,
                    AuthProvider = userInfo.Provider,
                    ExternalProviderId = userInfo.ExternalProviderId,
                    IsEmailVerified = true,
                    PasswordHash = string.Empty
                };
                dbContext.Users.Add(user);
            }
            else
            {
                user.AuthProvider = userInfo.Provider;
                user.ExternalProviderId = userInfo.ExternalProviderId;
                user.IsEmailVerified = true;
            }
        }

        user.LastLoginAt = DateTime.UtcNow;
        var refreshToken = CreateRefreshToken(user.Id, context.IpAddress);
        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result<AuthResponse>.Success(CreateAuthResponse(user, refreshToken.Token));
    }

    private RefreshToken CreateRefreshToken(Guid userId, string ipAddress) => new()
    {
        UserId = userId,
        Token = jwtService.GenerateRefreshToken(),
        ExpiresAt = DateTime.UtcNow.AddDays(_jwtSettings.RefreshTokenExpiryDays),
        CreatedByIp = ipAddress
    };

    private AuthResponse CreateAuthResponse(User user, string refreshToken)
    {
        var expiry = jwtService.GetAccessTokenExpiryUtc();
        return new AuthResponse(jwtService.GenerateAccessToken(user), refreshToken, expiry, user.Adapt<UserDto>());
    }
}
