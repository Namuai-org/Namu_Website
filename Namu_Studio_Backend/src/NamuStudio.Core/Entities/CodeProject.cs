using NamuStudio.Core.Common;

namespace NamuStudio.Core.Entities;

public class CodeProject : BaseEntity
{
    public Guid SessionId { get; set; }

    public Guid UserId { get; set; }

    public string Name { get; set; } = "namu-project";

    public Session Session { get; set; } = null!;

    public User User { get; set; } = null!;

    public ICollection<CodeFile> Files { get; set; } = [];
}
