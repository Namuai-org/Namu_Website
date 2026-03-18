using FluentValidation;
using NamuStudio.Application.DTOs.Code;
using NamuStudio.Application.DTOs.Outputs;

namespace NamuStudio.Application.Validators;

public class UpsertFileRequestValidator : AbstractValidator<UpsertFileRequest>
{
    public UpsertFileRequestValidator()
    {
        RuleFor(x => x.Language).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Content).MaximumLength(500000);
    }
}

public class CreateProjectRequestValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(x => x.Name).MaximumLength(100);
    }
}

public class CreateOutputRequestValidator : AbstractValidator<CreateOutputRequest>
{
    public CreateOutputRequestValidator()
    {
        RuleFor(x => x.Prompt).NotEmpty();
        RuleFor(x => x.Output).NotEmpty();
        RuleFor(x => x.Tone).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Length).NotEmpty().MaximumLength(20);
    }
}
