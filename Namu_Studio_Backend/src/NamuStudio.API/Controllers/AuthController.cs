using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NamuStudio.API.Common;
using NamuStudio.API.Extensions;
using NamuStudio.Application.Abstractions.Auth;
using NamuStudio.Application.Abstractions.OAuth;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.Models;
using NamuStudio.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace NamuStudio.API.Controllers;

 [EnableRateLimiting("auth")]
public class AuthController(
    IAuthService authService,
    IOAuthService oauthService,
    IOptions<JwtSettings> jwtOptions,
    IOptions<OAuthSettings> oauthOptions,
    IOptions<FrontendSettings> frontendOptions) : ApiController
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.RegisterAsync(request, new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        SetRefreshCookie(result.Value.RefreshToken);
        return CreatedAtAction(nameof(Register), result.Value);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await authService.LoginAsync(request, new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        SetRefreshCookie(result.Value.RefreshToken);
        return Ok(result.Value);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequest? request, CancellationToken cancellationToken)
    {
        var refreshToken = request?.RefreshToken ?? Request.Cookies["refreshToken"] ?? string.Empty;
        var result = await authService.RefreshTokenAsync(new RefreshRequest(refreshToken), new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        SetRefreshCookie(result.Value.RefreshToken);
        return Ok(result.Value);
    }

    [Authorize]
    [HttpPost("revoke")]
    public async Task<IActionResult> Revoke([FromBody] RevokeTokenRequest request, CancellationToken cancellationToken)
        => HandleResult(await authService.RevokeTokenAsync(request.RefreshToken, HttpContext.GetClientIpAddress(), cancellationToken));

    [HttpPost("forgot-password")]
    [EnableRateLimiting("strict")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        await authService.ForgotPasswordAsync(request.Email, cancellationToken);
        return Ok(new { message = "If the email exists, a reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
        => HandleResult(await authService.ResetPasswordAsync(request, cancellationToken));

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token, CancellationToken cancellationToken)
    {
        var result = await authService.VerifyEmailAsync(token, cancellationToken);
        var path = result.IsSuccess ? "/auth/email-verified" : "/auth/email-error";
        return Redirect($"{frontendOptions.Value.BaseUrl}{path}");
    }

    [HttpGet("oauth/google")]
    public IActionResult Google()
    {
        var settings = oauthOptions.Value.Google;
        var url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={Uri.EscapeDataString(settings.ClientId)}&redirect_uri={Uri.EscapeDataString(settings.RedirectUri)}&response_type=code&scope=openid%20email%20profile";
        return Redirect(url);
    }

    [HttpGet("oauth/google/callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string code, CancellationToken cancellationToken)
        => await HandleOAuthRedirectAsync(oauthService.HandleGoogleCallbackAsync(code, new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken));

    [HttpGet("oauth/github")]
    public IActionResult GitHub()
    {
        var settings = oauthOptions.Value.GitHub;
        var url = $"https://github.com/login/oauth/authorize?client_id={Uri.EscapeDataString(settings.ClientId)}&redirect_uri={Uri.EscapeDataString(settings.RedirectUri)}&scope=read:user%20user:email";
        return Redirect(url);
    }

    [HttpGet("oauth/github/callback")]
    public async Task<IActionResult> GitHubCallback([FromQuery] string code, CancellationToken cancellationToken)
        => await HandleOAuthRedirectAsync(oauthService.HandleGitHubCallbackAsync(code, new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken));

    [HttpPost("oauth/apple")]
    public async Task<IActionResult> Apple([FromBody] AppleOAuthRequest request, CancellationToken cancellationToken)
    {
        var result = await oauthService.HandleAppleCallbackAsync(request.IdToken, new AuthContext(HttpContext.GetClientIpAddress()), cancellationToken);
        if (!result.IsSuccess || result.Value is null)
        {
            return HandleResult(result);
        }

        SetRefreshCookie(result.Value.RefreshToken);
        return Ok(result.Value);
    }

    private async Task<IActionResult> HandleOAuthRedirectAsync(Task<NamuStudio.Application.Common.Result<AuthResponse>> resultTask)
    {
        var result = await resultTask;
        if (!result.IsSuccess || result.Value is null)
        {
            return Redirect($"{frontendOptions.Value.BaseUrl}/auth/oauth-error");
        }

        SetRefreshCookie(result.Value.RefreshToken);
        return Redirect($"{frontendOptions.Value.BaseUrl}/auth/oauth-success?accessToken={Uri.EscapeDataString(result.Value.AccessToken)}");
    }

    private void SetRefreshCookie(string refreshToken)
    {
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = !HttpContext.RequestServices.GetRequiredService<IHostEnvironment>().IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            MaxAge = TimeSpan.FromDays(jwtOptions.Value.RefreshTokenExpiryDays),
            Path = "/api/v1/auth/refresh"
        });
    }
}
