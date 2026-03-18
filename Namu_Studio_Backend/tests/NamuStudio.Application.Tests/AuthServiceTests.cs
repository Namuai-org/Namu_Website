using FluentAssertions;
using Mapster;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Moq;
using NamuStudio.Application.DTOs.Auth;
using NamuStudio.Application.Extensions;
using NamuStudio.Application.Models;
using NamuStudio.Application.Tests.Helpers;
using NamuStudio.Core.Entities;
using NamuStudio.Infrastructure.Options;
using NamuStudio.Infrastructure.Services;

namespace NamuStudio.Application.Tests;

public class AuthServiceTests
{
    private readonly JwtSettings _jwtSettings = new()
    {
        Secret = "TEST_SECRET_KEY_12345678901234567890",
        Issuer = "namu-ai-studio",
        Audience = "namu-ai-studio-client",
        AccessTokenExpiryMinutes = 15,
        RefreshTokenExpiryDays = 30
    };

    [Fact]
    public async Task RegisterAsync_WithValidData_CreatesUser()
    {
        using var fixture = CreateFixture();
        var result = await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
        fixture.DbContext.Users.Count().Should().Be(1);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsError()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var result = await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsSuccess.Should().BeFalse();
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsTokens()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var result = await fixture.Service.LoginAsync(new LoginRequest("test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
        result.Value!.AccessToken.Should().NotBeEmpty();
    }

    [Fact]
    public async Task LoginAsync_WithWrongPassword_ThrowsError()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var result = await fixture.Service.LoginAsync(new LoginRequest("test@example.com", "WrongPass1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsUnauthorized.Should().BeTrue();
    }

    [Fact]
    public async Task LoginAsync_WithInactiveUser_ThrowsError()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var user = fixture.DbContext.Users.Single();
        user.IsActive = false;
        await fixture.DbContext.SaveChangesAsync();
        var result = await fixture.Service.LoginAsync(new LoginRequest("test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsUnauthorized.Should().BeTrue();
    }

    [Fact]
    public async Task RefreshToken_WithValidToken_RotatesToken()
    {
        using var fixture = CreateFixture();
        var register = await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var result = await fixture.Service.RefreshTokenAsync(new RefreshRequest(register.Value!.RefreshToken), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
        result.Value!.RefreshToken.Should().NotBe(register.Value.RefreshToken);
    }

    [Fact]
    public async Task RefreshToken_WithExpiredToken_ThrowsError()
    {
        using var fixture = CreateFixture();
        var register = await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var token = fixture.DbContext.RefreshTokens.Single(x => x.Token == register.Value!.RefreshToken);
        token.ExpiresAt = DateTime.UtcNow.AddMinutes(-1);
        await fixture.DbContext.SaveChangesAsync();
        var result = await fixture.Service.RefreshTokenAsync(new RefreshRequest(token.Token), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsUnauthorized.Should().BeTrue();
    }

    [Fact]
    public async Task RefreshToken_WithRevokedToken_ThrowsError()
    {
        using var fixture = CreateFixture();
        var register = await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        var token = fixture.DbContext.RefreshTokens.Single(x => x.Token == register.Value!.RefreshToken);
        token.IsRevoked = true;
        await fixture.DbContext.SaveChangesAsync();
        var result = await fixture.Service.RefreshTokenAsync(new RefreshRequest(token.Token), new AuthContext("127.0.0.1"), CancellationToken.None);
        result.IsUnauthorized.Should().BeTrue();
    }

    [Fact]
    public async Task ForgotPassword_WithValidEmail_SendsEmail()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        await fixture.Service.ForgotPasswordAsync("test@example.com", CancellationToken.None);
        fixture.EmailService.Verify(x => x.SendPasswordResetEmailAsync("test@example.com", "Test User", It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ForgotPassword_WithUnknownEmail_StillSucceeds()
    {
        using var fixture = CreateFixture();
        var result = await fixture.Service.ForgotPasswordAsync("missing@example.com", CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task ResetPassword_WithValidToken_UpdatesPassword()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        await fixture.Service.ForgotPasswordAsync("test@example.com", CancellationToken.None);
        var user = fixture.DbContext.Users.Single();
        var result = await fixture.Service.ResetPasswordAsync(new ResetPasswordRequest(user.PasswordResetToken!, "NewPassword1"), CancellationToken.None);
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public async Task ResetPassword_WithExpiredToken_ThrowsError()
    {
        using var fixture = CreateFixture();
        await fixture.Service.RegisterAsync(new RegisterRequest("Test User", "test@example.com", "Password1"), new AuthContext("127.0.0.1"), CancellationToken.None);
        await fixture.Service.ForgotPasswordAsync("test@example.com", CancellationToken.None);
        var user = fixture.DbContext.Users.Single();
        user.PasswordResetExpiry = DateTime.UtcNow.AddMinutes(-1);
        await fixture.DbContext.SaveChangesAsync();
        var result = await fixture.Service.ResetPasswordAsync(new ResetPasswordRequest(user.PasswordResetToken!, "NewPassword1"), CancellationToken.None);
        result.IsSuccess.Should().BeFalse();
    }

    private TestFixture CreateFixture()
    {
        TypeAdapterConfig.GlobalSettings.RegisterMappings();
        var (connection, dbContext) = SqliteDbContextFactory.CreateContext();
        var emailService = new Mock<NamuStudio.Application.Abstractions.Email.IEmailService>();
        var jwtService = new JwtService(Options.Create(_jwtSettings));
        var authService = new AuthService(
            dbContext,
            jwtService,
            emailService.Object,
            Options.Create(_jwtSettings),
            Options.Create(new SecuritySettings { BCryptWorkFactor = 4 }),
            NullLogger<AuthService>.Instance);
        return new TestFixture(connection, dbContext, authService, emailService);
    }

    private sealed class TestFixture(SqliteConnection connection, NamuStudio.Infrastructure.Persistence.NamuDbContext dbContext, AuthService service, Mock<NamuStudio.Application.Abstractions.Email.IEmailService> emailService) : IDisposable
    {
        public SqliteConnection Connection { get; } = connection;
        public NamuStudio.Infrastructure.Persistence.NamuDbContext DbContext { get; } = dbContext;
        public AuthService Service { get; } = service;
        public Mock<NamuStudio.Application.Abstractions.Email.IEmailService> EmailService { get; } = emailService;

        public void Dispose()
        {
            DbContext.Dispose();
            Connection.Dispose();
        }
    }
}
