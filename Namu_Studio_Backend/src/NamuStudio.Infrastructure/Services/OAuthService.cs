using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using NamuStudio.Application.Abstractions.OAuth;
using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.Models;
using NamuStudio.Core.Enums;
using NamuStudio.Infrastructure.Options;

namespace NamuStudio.Infrastructure.Services;

public class OAuthService(
    IHttpClientFactory httpClientFactory,
    AuthService authService,
    ILogger<OAuthService> logger,
    IOptions<OAuthSettings> options) : IOAuthService
{
    private readonly OAuthSettings _settings = options.Value;

    public async Task<Result<AuthResponse>> HandleGoogleCallbackAsync(string code, AuthContext context, CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient("oauth");
        var tokenResponse = await client.PostAsync("https://oauth2.googleapis.com/token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = _settings.Google.ClientId,
                ["client_secret"] = _settings.Google.ClientSecret,
                ["redirect_uri"] = _settings.Google.RedirectUri,
                ["grant_type"] = "authorization_code"
            }),
            cancellationToken);

        if (!tokenResponse.IsSuccessStatusCode)
        {
            return Result<AuthResponse>.Failure("Google authentication failed.");
        }

        using var tokenJson = JsonDocument.Parse(await tokenResponse.Content.ReadAsStringAsync(cancellationToken));
        var accessToken = tokenJson.RootElement.GetProperty("access_token").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        using var response = await client.GetAsync("https://www.googleapis.com/oauth2/v3/userinfo", cancellationToken);
        using var userJson = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));

        var userInfo = new OAuthUserInfo(
            AuthProvider.Google,
            userJson.RootElement.GetProperty("sub").GetString() ?? string.Empty,
            userJson.RootElement.GetProperty("email").GetString() ?? string.Empty,
            userJson.RootElement.GetProperty("name").GetString() ?? string.Empty,
            userJson.RootElement.TryGetProperty("picture", out var picture) ? picture.GetString() : null);

        return await authService.SignInOAuthUserAsync(userInfo, context, cancellationToken);
    }

    public async Task<Result<AuthResponse>> HandleGitHubCallbackAsync(string code, AuthContext context, CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient("oauth");
        client.DefaultRequestHeaders.UserAgent.ParseAdd("NamuStudio");
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var tokenResponse = await client.PostAsync("https://github.com/login/oauth/access_token",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = _settings.GitHub.ClientId,
                ["client_secret"] = _settings.GitHub.ClientSecret,
                ["redirect_uri"] = _settings.GitHub.RedirectUri
            }),
            cancellationToken);

        if (!tokenResponse.IsSuccessStatusCode)
        {
            return Result<AuthResponse>.Failure("GitHub authentication failed.");
        }

        using var tokenJson = JsonDocument.Parse(await tokenResponse.Content.ReadAsStringAsync(cancellationToken));
        var accessToken = tokenJson.RootElement.GetProperty("access_token").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

        using var userResponse = await client.GetAsync("https://api.github.com/user", cancellationToken);
        using var userJson = JsonDocument.Parse(await userResponse.Content.ReadAsStringAsync(cancellationToken));
        var email = userJson.RootElement.TryGetProperty("email", out var directEmail) ? directEmail.GetString() : null;

        if (string.IsNullOrWhiteSpace(email))
        {
            using var emailsResponse = await client.GetAsync("https://api.github.com/user/emails", cancellationToken);
            using var emailsJson = JsonDocument.Parse(await emailsResponse.Content.ReadAsStringAsync(cancellationToken));
            foreach (var element in emailsJson.RootElement.EnumerateArray())
            {
                if (element.GetProperty("primary").GetBoolean() && element.GetProperty("verified").GetBoolean())
                {
                    email = element.GetProperty("email").GetString();
                    break;
                }
            }
        }

        var userInfo = new OAuthUserInfo(
            AuthProvider.GitHub,
            userJson.RootElement.GetProperty("id").GetInt64().ToString(),
            email ?? string.Empty,
            userJson.RootElement.TryGetProperty("name", out var name) ? name.GetString() ?? string.Empty : string.Empty,
            userJson.RootElement.TryGetProperty("avatar_url", out var avatar) ? avatar.GetString() : null);

        return await authService.SignInOAuthUserAsync(userInfo, context, cancellationToken);
    }

    public async Task<Result<AuthResponse>> HandleAppleCallbackAsync(string idToken, AuthContext context, CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient("oauth");
        using var response = await client.GetAsync("https://appleid.apple.com/auth/keys", cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            return Result<AuthResponse>.Failure("Unable to validate Apple identity.");
        }

        using var keysJson = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
        var handler = new JwtSecurityTokenHandler();
        var token = handler.ReadJwtToken(idToken);
        var matchingKey = keysJson.RootElement.GetProperty("keys").EnumerateArray()
            .FirstOrDefault(x => x.GetProperty("kid").GetString() == token.Header.Kid);

        if (matchingKey.ValueKind == JsonValueKind.Undefined)
        {
            return Result<AuthResponse>.Failure("Apple signing key not found.");
        }

        var rsa = System.Security.Cryptography.RSA.Create();
        rsa.ImportParameters(new System.Security.Cryptography.RSAParameters
        {
            Exponent = Base64UrlEncoder.DecodeBytes(matchingKey.GetProperty("e").GetString()),
            Modulus = Base64UrlEncoder.DecodeBytes(matchingKey.GetProperty("n").GetString())
        });

        var principal = handler.ValidateToken(idToken, new TokenValidationParameters
        {
            ValidIssuer = "https://appleid.apple.com",
            ValidAudience = _settings.Apple.ClientId,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new RsaSecurityKey(rsa)
        }, out _);

        var email = principal.FindFirstValue("email") ?? string.Empty;
        var sub = principal.FindFirstValue("sub") ?? string.Empty;
        logger.LogInformation("Apple OAuth sign-in attempted for {Email}", email);
        return await authService.SignInOAuthUserAsync(new OAuthUserInfo(AuthProvider.Apple, sub, email, email, null), context, cancellationToken);
    }
}
