namespace NamuStudio.Application.Common;

public class Result
{
    protected Result(bool isSuccess, string? error, bool isNotFound = false, bool isUnauthorized = false, bool isForbidden = false)
    {
        IsSuccess = isSuccess;
        Error = error;
        IsNotFound = isNotFound;
        IsUnauthorized = isUnauthorized;
        IsForbidden = isForbidden;
    }

    public bool IsSuccess { get; }

    public string? Error { get; }

    public bool IsNotFound { get; }

    public bool IsUnauthorized { get; }

    public bool IsForbidden { get; }

    public static Result Success() => new(true, null);

    public static Result Failure(string error) => new(false, error);

    public static Result NotFound(string error) => new(false, error, isNotFound: true);

    public static Result Unauthorized(string error) => new(false, error, isUnauthorized: true);

    public static Result Forbidden(string error) => new(false, error, isForbidden: true);
}

public sealed class Result<T> : Result
{
    private Result(bool isSuccess, T? value, string? error, bool isNotFound = false, bool isUnauthorized = false, bool isForbidden = false)
        : base(isSuccess, error, isNotFound, isUnauthorized, isForbidden)
    {
        Value = value;
    }

    public T? Value { get; }

    public static Result<T> Success(T value) => new(true, value, null);

    public static new Result<T> Failure(string error) => new(false, default, error);

    public static new Result<T> NotFound(string error) => new(false, default, error, isNotFound: true);

    public static new Result<T> Unauthorized(string error) => new(false, default, error, isUnauthorized: true);

    public static new Result<T> Forbidden(string error) => new(false, default, error, isForbidden: true);
}
