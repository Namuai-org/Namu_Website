using NamuStudio.Core.Common;
using NamuStudio.Core.Enums;

namespace NamuStudio.Core.Entities;

public class Session : BaseEntity
{
    public Guid UserId { get; set; }

    public string Title { get; set; } = "Sabon Zama";

    public StudioMode Mode { get; set; }

    public bool IsArchived { get; set; }

    public User User { get; set; } = null!;

    public ICollection<Message> Messages { get; set; } = [];

    public ICollection<CreateOutput> CreateOutputs { get; set; } = [];

    public CodeProject? CodeProject { get; set; }
}
