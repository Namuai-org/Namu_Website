using Mapster;
using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Abstractions.Sessions;
using NamuStudio.Application.Common;
using NamuStudio.Application.Constants;
using NamuStudio.Application.DTOs.Sessions;
using NamuStudio.Application.Extensions;
using NamuStudio.Core.Entities;
using NamuStudio.Core.Enums;

namespace NamuStudio.Infrastructure.Services;

public class SessionService(INamuDbContext dbContext, IMemoryCache cache, ILogger<SessionService> logger, IMapper mapper) : ISessionService
{
    public async Task<Result<PagedResult<SessionDto>>> GetSessionsAsync(Guid userId, PaginationParams pagination, StudioMode? mode, CancellationToken cancellationToken)
    {
        var cacheKey = $"{CacheKeys.Sessions(userId)}:{pagination.Page}:{pagination.PageSize}:{mode}";
        var result = await cache.GetOrSetAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2);
            var query = dbContext.Sessions.AsNoTracking()
                .Include(x => x.Messages)
                .Where(x => x.UserId == userId && !x.IsArchived);

            if (mode.HasValue)
            {
                query = query.Where(x => x.Mode == mode.Value);
            }

            return await query.OrderByDescending(x => x.UpdatedAt)
                .Select(x => mapper.Map<SessionDto>(x))
                .AsQueryable()
                .ToPagedResultAsync(pagination, cancellationToken);
        });

        return Result<PagedResult<SessionDto>>.Success(result);
    }

    public async Task<Result<SessionDto>> CreateSessionAsync(Guid userId, CreateSessionRequest request, CancellationToken cancellationToken)
    {
        var session = new Session
        {
            UserId = userId,
            Mode = request.Mode,
            Title = string.IsNullOrWhiteSpace(request.Title) ? "Sabon Zama" : request.Title.Trim()
        };

        dbContext.Sessions.Add(session);
        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.Sessions(userId));
        logger.LogDebug("Session created {SessionId}", session.Id);
        return Result<SessionDto>.Success(mapper.Map<SessionDto>(session) with { MessageCount = 0 });
    }

    public async Task<Result<SessionDto>> GetSessionAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions.AsNoTracking().Include(x => x.Messages)
            .SingleOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken);
        return session is null ? Result<SessionDto>.NotFound("Session not found.") : Result<SessionDto>.Success(mapper.Map<SessionDto>(session));
    }

    public async Task<Result<SessionDto>> UpdateSessionAsync(Guid userId, Guid sessionId, UpdateSessionRequest request, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions.Include(x => x.Messages).SingleOrDefaultAsync(x => x.Id == sessionId, cancellationToken);
        if (session is null)
        {
            return Result<SessionDto>.NotFound("Session not found.");
        }

        if (session.UserId != userId)
        {
            return Result<SessionDto>.Forbidden("You do not own this session.");
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            session.Title = request.Title.Trim();
        }

        if (request.IsArchived.HasValue)
        {
            session.IsArchived = request.IsArchived.Value;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.Sessions(userId));
        return Result<SessionDto>.Success(mapper.Map<SessionDto>(session));
    }

    public async Task<Result> DeleteSessionAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions.SingleOrDefaultAsync(x => x.Id == sessionId, cancellationToken);
        if (session is null)
        {
            return Result.NotFound("Session not found.");
        }

        if (session.UserId != userId)
        {
            return Result.Forbidden("You do not own this session.");
        }

        dbContext.Sessions.Remove(session);
        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.Sessions(userId));
        return Result.Success();
    }

    public async Task<Result<PagedResult<MessageDto>>> GetMessagesAsync(Guid userId, Guid sessionId, PaginationParams pagination, CancellationToken cancellationToken)
    {
        if (!await dbContext.Sessions.AnyAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken))
        {
            return Result<PagedResult<MessageDto>>.NotFound("Session not found.");
        }

        var query = dbContext.Messages.AsNoTracking()
            .Where(x => x.SessionId == sessionId)
            .OrderBy(x => x.CreatedAt)
            .ProjectToType<MessageDto>();

        return Result<PagedResult<MessageDto>>.Success(await query.ToPagedResultAsync(pagination, cancellationToken));
    }

    public async Task<Result<MessageDto>> CreateMessageAsync(Guid userId, Guid sessionId, CreateMessageRequest request, CancellationToken cancellationToken)
    {
        var session = await dbContext.Sessions.SingleOrDefaultAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken);
        if (session is null)
        {
            return Result<MessageDto>.NotFound("Session not found.");
        }

        var content = request.Content.Trim();
        var message = new Message
        {
            SessionId = sessionId,
            UserId = userId,
            Role = request.Role,
            Content = content
        };

        if (session.Title == "Sabon Zama" && request.Role == MessageRole.User)
        {
            session.Title = content[..Math.Min(content.Length, 50)];
        }

        session.UpdatedAt = DateTime.UtcNow;
        dbContext.Messages.Add(message);
        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.Sessions(userId));
        return Result<MessageDto>.Success(message.Adapt<MessageDto>());
    }
}
