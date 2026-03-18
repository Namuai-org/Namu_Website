using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Abstractions.Users;
using NamuStudio.Application.Common;
using NamuStudio.Application.Constants;
using NamuStudio.Application.DTOs.Users;
using NamuStudio.Application.Extensions;

namespace NamuStudio.Infrastructure.Services;

public class UserService(INamuDbContext dbContext, IMemoryCache cache) : IUserService
{
    public async Task<Result<UserDto>> GetMeAsync(Guid userId, CancellationToken cancellationToken)
    {
        var user = await cache.GetOrSetAsync(CacheKeys.User(userId), async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);
            return await dbContext.Users.AsNoTracking().SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        });

        return user is null ? Result<UserDto>.NotFound("User not found.") : Result<UserDto>.Success(user.Adapt<UserDto>());
    }

    public async Task<Result<UserDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is null)
        {
            return Result<UserDto>.NotFound("User not found.");
        }

        if (!string.IsNullOrWhiteSpace(request.FullName))
        {
            user.FullName = request.FullName.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Theme))
        {
            user.Theme = request.Theme.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Language))
        {
            user.Language = request.Language.Trim();
        }

        if (request.OnboardingComplete.HasValue)
        {
            user.OnboardingComplete = request.OnboardingComplete.Value;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.User(userId));
        return Result<UserDto>.Success(user.Adapt<UserDto>());
    }

    public async Task<Result> DeleteMeAsync(Guid userId, string password, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users.SingleOrDefaultAsync(x => x.Id == userId, cancellationToken);
        if (user is null)
        {
            return Result.NotFound("User not found.");
        }

        if (string.IsNullOrWhiteSpace(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return Result.Unauthorized("Password confirmation failed.");
        }

        dbContext.Users.Remove(user);
        await dbContext.SaveChangesAsync(cancellationToken);
        cache.Remove(CacheKeys.User(userId));
        cache.Remove(CacheKeys.Sessions(userId));
        return Result.Success();
    }
}
