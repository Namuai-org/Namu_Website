using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using NamuStudio.API.Tests.Helpers;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.DTOs.Users;

namespace NamuStudio.API.Tests;

public class AuthControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Add("X-Forwarded-For", $"10.0.0.{Random.Shared.Next(2, 250)}");
    }

    [Fact]
    public async Task PostRegister_Returns201()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("Test User", "register@example.com", "Password1"));
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task PostRegister_WithBadData_Returns400()
    {
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("", "bad", "short"));
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task PostLogin_Returns200WithTokens()
    {
        await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("Login User", "login@example.com", "Password1"));
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("login@example.com", "Password1"));
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<AuthResponse>();
        payload!.AccessToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task PostLogin_WrongPassword_Returns401()
    {
        await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("Wrong User", "wrong@example.com", "Password1"));
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest("wrong@example.com", "WrongPass1"));
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task PostRefresh_WithValidToken_Returns200()
    {
        var registerResponse = await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("Refresh User", "refresh@example.com", "Password1"));
        var auth = await registerResponse.Content.ReadFromJsonAsync<AuthResponse>();
        var response = await _client.PostAsJsonAsync("/api/v1/auth/refresh", new RefreshRequest(auth!.RefreshToken));
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUsersMe_WithoutAuth_Returns401()
    {
        var response = await _client.GetAsync("/api/v1/users/me");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetUsersMe_WithAuth_Returns200()
    {
        var auth = await RegisterAndLoginAsync("me@example.com");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        var response = await _client.GetAsync("/api/v1/users/me");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task PatchUsersMe_WithInvalidTheme_Returns400()
    {
        var auth = await RegisterAndLoginAsync("theme@example.com");
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth.AccessToken);
        var response = await _client.PatchAsJsonAsync("/api/v1/users/me", new UpdateProfileRequest("Theme User", "invalid", "en", true));
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    private async Task<AuthResponse> RegisterAndLoginAsync(string email)
    {
        await _client.PostAsJsonAsync("/api/v1/auth/register", new RegisterRequest("API User", email, "Password1"));
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", new LoginRequest(email, "Password1"));
        return (await response.Content.ReadFromJsonAsync<AuthResponse>())!;
    }
}
