using FluentValidation;
using NamuStudio.Application.DTOs.Sessions;
using NamuStudio.Core.Enums;

namespace NamuStudio.Application.Validators;

public class CreateSessionRequestValidator : AbstractValidator<CreateSessionRequest>
{
    public CreateSessionRequestValidator()
    {
        RuleFor(x => x.Mode).IsInEnum().Must(mode => Enum.IsDefined(typeof(StudioMode), mode));
        RuleFor(x => x.Title).MaximumLength(100);
    }
}

public class UpdateSessionRequestValidator : AbstractValidator<UpdateSessionRequest>
{
    public UpdateSessionRequestValidator()
    {
        RuleFor(x => x.Title).MaximumLength(100);
    }
}

public class CreateMessageRequestValidator : AbstractValidator<CreateMessageRequest>
{
    public CreateMessageRequestValidator()
    {
        RuleFor(x => x.Role).IsInEnum();
        RuleFor(x => x.Content).NotEmpty().MaximumLength(50000);
    }
}
