namespace NamuStudio.Application.DTOs.Code;

public record CreateProjectRequest(string? Name);

public record UpsertFileRequest(string Language, string Content);

public record CodeFileDto(
    Guid Id,
    Guid ProjectId,
    Guid UserId,
    string Filename,
    string Language,
    string Content,
    bool IsActive,
    DateTime UpdatedAt);

public record CodeProjectDto(
    Guid Id,
    Guid SessionId,
    Guid UserId,
    string Name,
    List<CodeFileDto> Files,
    DateTime UpdatedAt);
