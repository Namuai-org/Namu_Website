using Mapster;
using Microsoft.EntityFrameworkCore;
using NamuStudio.Application.Abstractions.Code;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Code;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Services;

public class CodeService(INamuDbContext dbContext) : ICodeService
{
    public async Task<Result<CodeProjectDto>> GetOrCreateProjectAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken)
    {
        if (!await dbContext.Sessions.AnyAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken))
        {
            return Result<CodeProjectDto>.NotFound("Session not found.");
        }

        var project = await dbContext.CodeProjects.Include(x => x.Files).SingleOrDefaultAsync(x => x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (project is null)
        {
            project = new CodeProject
            {
                SessionId = sessionId,
                UserId = userId
            };
            dbContext.CodeProjects.Add(project);
            await dbContext.SaveChangesAsync(cancellationToken);
            project = await dbContext.CodeProjects.Include(x => x.Files).SingleAsync(x => x.Id == project.Id, cancellationToken);
        }

        return Result<CodeProjectDto>.Success(project.Adapt<CodeProjectDto>());
    }

    public async Task<Result<CodeProjectDto>> CreateProjectAsync(Guid userId, Guid sessionId, CreateProjectRequest request, CancellationToken cancellationToken)
    {
        var existing = await dbContext.CodeProjects.Include(x => x.Files).SingleOrDefaultAsync(x => x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (existing is not null)
        {
            return Result<CodeProjectDto>.Success(existing.Adapt<CodeProjectDto>());
        }

        if (!await dbContext.Sessions.AnyAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken))
        {
            return Result<CodeProjectDto>.NotFound("Session not found.");
        }

        var project = new CodeProject
        {
            SessionId = sessionId,
            UserId = userId,
            Name = string.IsNullOrWhiteSpace(request.Name) ? "namu-project" : request.Name.Trim()
        };

        dbContext.CodeProjects.Add(project);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result<CodeProjectDto>.Success(project.Adapt<CodeProjectDto>() with { Files = [] });
    }

    public async Task<Result<List<CodeFileDto>>> GetFilesAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken)
    {
        var project = await dbContext.CodeProjects.SingleOrDefaultAsync(x => x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (project is null)
        {
            return Result<List<CodeFileDto>>.NotFound("Project not found.");
        }

        var files = await dbContext.CodeFiles.AsNoTracking()
            .Where(x => x.ProjectId == project.Id)
            .OrderBy(x => x.Filename)
            .ProjectToType<CodeFileDto>()
            .ToListAsync(cancellationToken);

        return Result<List<CodeFileDto>>.Success(files);
    }

    public async Task<Result<CodeFileDto>> UpsertFileAsync(Guid userId, Guid sessionId, string filename, UpsertFileRequest request, CancellationToken cancellationToken)
    {
        var project = await dbContext.CodeProjects.SingleOrDefaultAsync(x => x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (project is null)
        {
            return Result<CodeFileDto>.NotFound("Project not found.");
        }

        var normalizedFileName = filename.Trim();
        var file = await dbContext.CodeFiles.SingleOrDefaultAsync(x => x.ProjectId == project.Id && x.Filename == normalizedFileName, cancellationToken);
        if (file is null)
        {
            file = new CodeFile
            {
                ProjectId = project.Id,
                UserId = userId,
                Filename = normalizedFileName,
                Language = request.Language.Trim(),
                Content = request.Content.Trim(),
                IsActive = true
            };
            dbContext.CodeFiles.Add(file);
        }
        else
        {
            file.Language = request.Language.Trim();
            file.Content = request.Content.Trim();
            file.IsActive = true;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return Result<CodeFileDto>.Success(file.Adapt<CodeFileDto>());
    }

    public async Task<Result> DeleteFileAsync(Guid userId, Guid sessionId, string filename, CancellationToken cancellationToken)
    {
        var project = await dbContext.CodeProjects.SingleOrDefaultAsync(x => x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (project is null)
        {
            return Result.NotFound("Project not found.");
        }

        var file = await dbContext.CodeFiles.SingleOrDefaultAsync(x => x.ProjectId == project.Id && x.Filename == filename, cancellationToken);
        if (file is null)
        {
            return Result.NotFound("File not found.");
        }

        dbContext.CodeFiles.Remove(file);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
