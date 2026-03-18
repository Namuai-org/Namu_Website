using Mapster;
using Microsoft.EntityFrameworkCore;
using NamuStudio.Application.Abstractions.Outputs;
using NamuStudio.Application.Abstractions.Persistence;
using NamuStudio.Application.Common;
using NamuStudio.Application.DTOs.Outputs;
using NamuStudio.Core.Entities;

namespace NamuStudio.Infrastructure.Services;

public class CreateOutputService(INamuDbContext dbContext) : ICreateOutputService
{
    public async Task<Result<List<CreateOutputDto>>> GetOutputsAsync(Guid userId, Guid sessionId, CancellationToken cancellationToken)
    {
        if (!await dbContext.Sessions.AnyAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken))
        {
            return Result<List<CreateOutputDto>>.NotFound("Session not found.");
        }

        var outputs = await dbContext.CreateOutputs.AsNoTracking()
            .Where(x => x.SessionId == sessionId && x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ProjectToType<CreateOutputDto>()
            .ToListAsync(cancellationToken);

        return Result<List<CreateOutputDto>>.Success(outputs);
    }

    public async Task<Result<CreateOutputDto>> CreateOutputAsync(Guid userId, Guid sessionId, CreateOutputRequest request, CancellationToken cancellationToken)
    {
        if (!await dbContext.Sessions.AnyAsync(x => x.Id == sessionId && x.UserId == userId, cancellationToken))
        {
            return Result<CreateOutputDto>.NotFound("Session not found.");
        }

        var output = new CreateOutput
        {
            SessionId = sessionId,
            UserId = userId,
            Prompt = request.Prompt.Trim(),
            Output = request.Output.Trim(),
            Template = request.Template?.Trim(),
            Tone = request.Tone.Trim(),
            Length = request.Length.Trim(),
            WordCount = request.Output.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length
        };

        dbContext.CreateOutputs.Add(output);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result<CreateOutputDto>.Success(output.Adapt<CreateOutputDto>());
    }

    public async Task<Result> DeleteOutputAsync(Guid userId, Guid sessionId, Guid outputId, CancellationToken cancellationToken)
    {
        var output = await dbContext.CreateOutputs.SingleOrDefaultAsync(x => x.Id == outputId && x.SessionId == sessionId && x.UserId == userId, cancellationToken);
        if (output is null)
        {
            return Result.NotFound("Output not found.");
        }

        dbContext.CreateOutputs.Remove(output);
        await dbContext.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
