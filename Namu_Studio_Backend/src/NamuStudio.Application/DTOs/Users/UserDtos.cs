namespace NamuStudio.Application.DTOs.Users;

public record UserDto(
    Guid Id,
    string Email,
    string FullName,
    string? AvatarUrl,
    string Theme,
    string Language,
    bool OnboardingComplete);

public record UpdateProfileRequest(string? FullName, string? Theme, string? Language, bool? OnboardingComplete);

public record DeleteAccountRequest(string Password);
