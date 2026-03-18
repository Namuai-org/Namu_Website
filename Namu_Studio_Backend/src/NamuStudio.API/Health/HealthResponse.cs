namespace NamuStudio.API.Health;

public record HealthResponse(string Status, DateTime Timestamp, Dictionary<string, string> Checks, string Version);
