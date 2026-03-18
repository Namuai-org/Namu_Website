using NamuStudio.Core.Common;
using NamuStudio.Core.Enums;

namespace NamuStudio.Core.Entities;

public class Message : BaseEntity
{
    public Guid SessionId { get; set; }

    public Guid UserId { get; set; }

    public MessageRole Role { get; set; }

    public string Content { get; set; } = string.Empty;

    public Session Session { get; set; } = null!;

    public User User { get; set; } = null!;
}
