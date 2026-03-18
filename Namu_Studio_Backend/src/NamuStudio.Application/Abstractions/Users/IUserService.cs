using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Users;

namespace NamuStudio.Application.Abstractions.Users;

public interface IUserService
{
    Task<Result<UserDto>> GetMeAsync(Guid userId, CancellationToken cancellationToken);

    Task<Result<UserDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken cancellationToken);

    Task<Result> DeleteMeAsync(Guid userId, string password, CancellationToken cancellationToken);
}
