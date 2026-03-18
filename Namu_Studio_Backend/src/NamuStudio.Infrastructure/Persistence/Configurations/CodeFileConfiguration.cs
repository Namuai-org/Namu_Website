using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Persistence.Configurations;

public class CodeFileConfiguration : IEntityTypeConfiguration<CodeFile>
{
    public void Configure(EntityTypeBuilder<CodeFile> builder)
    {
        builder.ToTable("code_files");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Filename).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Language).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Content).IsRequired().HasColumnType("text");
        builder.HasIndex(x => new { x.ProjectId, x.Filename }).IsUnique();
        builder.HasOne(x => x.Project)
            .WithMany(x => x.Files)
            .HasForeignKey(x => x.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
