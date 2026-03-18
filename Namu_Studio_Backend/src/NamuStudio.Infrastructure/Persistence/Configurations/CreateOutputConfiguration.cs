using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Persistence.Configurations;

public class CreateOutputConfiguration : IEntityTypeConfiguration<CreateOutput>
{
    public void Configure(EntityTypeBuilder<CreateOutput> builder)
    {
        builder.ToTable("create_outputs");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Prompt).IsRequired().HasColumnType("text");
        builder.Property(x => x.Output).IsRequired().HasColumnType("text");
        builder.Property(x => x.Tone).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Length).IsRequired().HasMaxLength(20);
        builder.HasOne(x => x.Session)
            .WithMany(x => x.CreateOutputs)
            .HasForeignKey(x => x.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
