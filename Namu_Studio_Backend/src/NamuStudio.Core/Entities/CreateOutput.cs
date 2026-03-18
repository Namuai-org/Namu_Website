using NamuStudio.Core.Common;

namespace NamuStudio.Core.Entities;

public class CreateOutput : BaseEntity
{
    public Guid SessionId { get; set; }

    public Guid UserId { get; set; }

    public string Prompt { get; set; } = string.Empty;

    public string Output { get; set; } = string.Empty;

    public string? Template { get; set; }

    public string Tone { get; set; } = "professional";

    public string Length { get; set; } = "medium";

    public int? WordCount { get; set; }

    public Session Session { get; set; } = null!;

    public User User { get; set; } = null!;
}
