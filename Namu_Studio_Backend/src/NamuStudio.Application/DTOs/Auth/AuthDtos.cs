using NamuStudio.Application.DTOs.Users;

namespace NamuStudio.Application.DTOs.Auth;

public record RegisterRequest(string FullName, string Email, string Password);

public record LoginRequest(string Email, string Password);

public record RefreshRequest(string RefreshToken);

public record ResetPasswordRequest(string Token, string NewPassword);

public record ForgotPasswordRequest(string Email);

public record RevokeTokenRequest(string RefreshToken);

public record AppleOAuthRequest(string IdToken);

public record AuthResponse(string AccessToken, string RefreshToken, DateTime AccessTokenExpiry, UserDto User);
