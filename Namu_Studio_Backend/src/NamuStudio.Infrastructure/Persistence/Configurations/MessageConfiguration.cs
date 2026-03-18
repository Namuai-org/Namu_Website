using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Persistence.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.ToTable("messages");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Content).IsRequired().HasColumnType("text");
        builder.Property(x => x.Role).HasConversion<string>().IsRequired();
        builder.HasIndex(x => new { x.SessionId, x.CreatedAt });
        builder.HasOne(x => x.Session)
            .WithMany(x => x.Messages)
            .HasForeignKey(x => x.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
