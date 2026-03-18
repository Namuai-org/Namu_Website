using FluentValidation;
using NamuStudio.Application.DTOs.Users;

namespace NamuStudio.Application.Validators;

public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
{
    private static readonly string[] Themes = ["namu", "gece", "daji", "sahara", "dare"];
    private static readonly string[] Languages = ["en", "ha"];

    public UpdateProfileRequestValidator()
    {
        RuleFor(x => x.Theme).Must(theme => theme is null || Themes.Contains(theme)).WithMessage("Theme must be one of: namu, gece, daji, sahara, dare.");
        RuleFor(x => x.Language).Must(language => language is null || Languages.Contains(language)).WithMessage("Language must be en or ha.");
        RuleFor(x => x.FullName).Must(name => name is null || (name.Length >= 2 && name.Length <= 100)).WithMessage("FullName must be between 2 and 100 characters.");
    }
}

public class DeleteAccountRequestValidator : AbstractValidator<DeleteAccountRequest>
{
    public DeleteAccountRequestValidator()
    {
        RuleFor(x => x.Password).NotEmpty();
    }
}
