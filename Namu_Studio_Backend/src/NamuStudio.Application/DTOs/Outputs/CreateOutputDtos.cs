namespace NamuStudio.Application.DTOs.Outputs;

public record CreateOutputRequest(string Prompt, string Output, string? Template, string Tone, string Length);

public record CreateOutputDto(
    Guid Id,
    Guid SessionId,
    Guid UserId,
    string Prompt,
    string Output,
    string? Template,
    string Tone,
    string Length,
    int? WordCount,
    DateTime CreatedAt);
