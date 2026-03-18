using Microsoft.Extensions.Caching.Memory;

namespace NamuStudio.Application.Extensions;

public static class MemoryCacheExtensions
{
    public static async Task<T> GetOrSetAsync<T>(
        this IMemoryCache cache,
        object key,
        Func<ICacheEntry, Task<T>> factory)
    {
        if (cache.TryGetValue(key, out T? existing) && existing is not null)
        {
            return existing;
        }

        using var entry = cache.CreateEntry(key);
        var value = await factory(entry);
        entry.Value = value;
        return value;
    }
}
