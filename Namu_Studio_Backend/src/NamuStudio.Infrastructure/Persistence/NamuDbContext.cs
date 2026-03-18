using Microsoft.EntityFrameworkCore;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Core.Common;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Persistence;

public class NamuDbContext(DbContextOptions<NamuDbContext> options) : DbContext(options), INamuDbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<Session> Sessions => Set<Session>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<CreateOutput> CreateOutputs => Set<CreateOutput>();
    public DbSet<CodeProject> CodeProjects => Set<CodeProject>();
    public DbSet<CodeFile> CodeFiles => Set<CodeFile>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(NamuDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>().Where(entry => entry.State == EntityState.Modified))
        {
            entry.Entity.UpdatedAt = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
