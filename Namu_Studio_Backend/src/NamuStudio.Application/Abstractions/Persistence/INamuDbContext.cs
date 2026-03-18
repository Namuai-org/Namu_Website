using Microsoft.EntityFrameworkCore;
using NamuStudio.Core.Entities;

namespace NamuStudio.Application.Abstractions.Persistence;

public interface INamuDbContext
{
    DbSet<User> Users { get; }

    DbSet<RefreshToken> RefreshTokens { get; }

    DbSet<Session> Sessions { get; }

    DbSet<Message> Messages { get; }

    DbSet<CreateOutput> CreateOutputs { get; }

    DbSet<CodeProject> CodeProjects { get; }

    DbSet<CodeFile> CodeFiles { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
