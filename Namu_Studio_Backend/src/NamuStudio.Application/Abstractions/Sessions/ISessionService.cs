using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Sessions;
using NamuStudio.Core.Enums;

namespace NamuStudio.Application.Abstractions.Sessions;

public interface ISessionService
{
    Task<Result<PagedResult<SessionDto>>> GetSessionsAsync(Guid userId, PaginationParams pagination, StudioMode? mode, CancellationToken cancellationToken);

    Task<Result<SessionDto>> CreateSessionAsync(Guid userId, CreateSessionRequest request, CancellationToken cancellationToken);

    Task<Result<SessionDto>> GetSessionAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken);

    Task<Result<SessionDto>> UpdateSessionAsync(Guid userId, Guid sessionId, UpdateSessionRequest request, CancellationToken cancellationToken);

    Task<Result> DeleteSessionAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken);

    Task<Result<PagedResult<MessageDto>>> GetMessagesAsync(Guid userId, Guid sessionId, PaginationParams pagination, CancellationToken cancellationToken);

    Task<Result<MessageDto>> CreateMessageAsync(Guid userId, Guid sessionId, CreateMessageRequest request, CancellationToken cancellationToken);
}
