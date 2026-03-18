using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Code;

namespace NamuStudio.Application.Abstractions.Code;

public interface ICodeService
{
    Task<Result<CodeProjectDto>> GetOrCreateProjectAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken);

    Task<Result<CodeProjectDto>> CreateProjectAsync(Guid userId, Guid sessionId, CreateProjectRequest request, CancellationToken cancellationToken);

    Task<Result<List<CodeFileDto>>> GetFilesAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken);

    Task<Result<CodeFileDto>> UpsertFileAsync(Guid userId, Guid sessionId, string filename, UpsertFileRequest request, CancellationToken cancellationToken);

    Task<Result> DeleteFileAsync(Guid userId, Guid sessionId, string filename, CancellationToken cancellationToken);
}
