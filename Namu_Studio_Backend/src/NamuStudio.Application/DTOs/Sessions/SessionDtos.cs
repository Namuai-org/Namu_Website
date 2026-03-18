using NamuStudio.Core.Enums;

namespace NamuStudio.Application.DTOs.Sessions;

public record SessionDto(
    Guid Id,
    string Title,
    StudioMode Mode,
    bool IsArchived,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int MessageCount);

public record CreateSessionRequest(string? Title, StudioMode Mode);

public record UpdateSessionRequest(string? Title, bool? IsArchived);

public record CreateMessageRequest(MessageRole Role, string Content);

public record MessageDto(
    Guid Id,
    Guid SessionId,
    Guid UserId,
    MessageRole Role,
    string Content,
    DateTime CreatedAt);
