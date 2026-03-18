using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Outputs;

namespace NamuStudio.Application.Abstractions.Outputs;

public interface ICreateOutputService
{
    Task<Result<List<CreateOutputDto>>> GetOutputsAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken);

    Task<Result<CreateOutputDto>> CreateOutputAsync(Guid userId, Guid sessionId, CreateOutputRequest request, CancellationToken cancellationToken);

    Task<Result> DeleteOutputAsync(Guid userId, Guid sessionId, Guid outputId, CancellationToken cancellationToken);
}
