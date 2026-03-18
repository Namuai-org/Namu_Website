using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace NamuStudio.Infrastructure.Persistence.Initializers;

public class DatabaseInitializer(NamuDbContext dbContext, IHostEnvironment environment, ILogger<DatabaseInitializer> logger)
{
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        if (environment.IsDevelopment())
        {
            logger.LogInformation("Applying pending database migrations in development.");
            await dbContext.Database.MigrateAsync(cancellationToken);
            return;
        }

        var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
        logger.LogInformation("Database connection verification in production completed. CanConnect={CanConnect}", canConnect);
    }
}
