using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using NamuStudio.Infrastructure.Persistence;

namespace NamuStudio.Application.Tests.Helpers;

public static class SqliteDbContextFactory
{
    public static (SqliteConnection Connection, NamuDbContext DbContext) CreateContext()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();
        var options = new DbContextOptionsBuilder<NamuDbContext>()
            .UseSqlite(connection)
            .Options;
        var dbContext = new NamuDbContext(options);
        dbContext.Database.EnsureCreated();
        return (connection, dbContext);
    }
}
