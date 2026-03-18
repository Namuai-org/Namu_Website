using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Persistence.Configurations;

public class CodeProjectConfiguration : IEntityTypeConfiguration<CodeProject>
{
    public void Configure(EntityTypeBuilder<CodeProject> builder)
    {
        builder.ToTable("code_projects");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(100);
        builder.HasIndex(x => x.SessionId).IsUnique();
        builder.HasOne(x => x.Session)
            .WithOne(x => x.CodeProject)
            .HasForeignKey<CodeProject>(x => x.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
