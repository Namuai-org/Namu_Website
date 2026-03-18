namespace NamuStudio.Application.Constants;

public static class CacheKeys
{
    public static string User(Guid userId) => $"user:{userId}";

    public static string Sessions(Guid userId) => $"sessions:{userId}";
}
