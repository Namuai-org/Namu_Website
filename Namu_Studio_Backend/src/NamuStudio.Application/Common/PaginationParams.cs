namespace NamuStudio.Application.Common;

public record PaginationParams(int Page = 1, int RequestedPageSize = 20)
{
    public int Page { get; init; } = Math.Max(Page, 1);

    public int PageSize { get; } = Math.Min(Math.Max(RequestedPageSize, 1), 100);
}
