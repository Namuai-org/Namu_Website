using NamuStudio.Core.Common;

namespace NamuStudio.Core.Entities;

public class CodeFile : BaseEntity
{
    public Guid ProjectId { get; set; }

    public Guid UserId { get; set; }

    public string Filename { get; set; } = string.Empty;

    public string Language { get; set; } = "html";

    public string Content { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public CodeProject Project { get; set; } = null!;

    public User User { get; set; } = null!;
}
