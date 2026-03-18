# NamuStudio Backend

NamuStudio is a production-oriented .NET 8 Web API backend for Namu AI-Studio, an AI workspace for Hausa-speaking users across Niger and West Africa. It replaces Supabase with a layered architecture built around PostgreSQL, JWT auth with refresh rotation, structured logging, validation, Swagger, Docker, and automated tests.

## Prerequisites

- .NET 8 SDK
- PostgreSQL 15+
- Docker (optional)

## Quick Start

1. Clone the repo.
2. Review `src/NamuStudio.API/appsettings.json` and `src/NamuStudio.API/appsettings.Development.json`.
3. Set `ConnectionStrings__DefaultConnection` and `Jwt__Secret`.
4. Run migrations with `dotnet dotnet-ef database update --project src/NamuStudio.Infrastructure --startup-project src/NamuStudio.API`.
5. Start the API with `dotnet run --project src/NamuStudio.API`.

## Environment Variables

| Variable | Description |
| --- | --- |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `Jwt__Secret` | 32+ character signing key |
| `Jwt__Issuer` | JWT issuer override |
| `Jwt__Audience` | JWT audience override |
| `Frontend__BaseUrl` | Frontend origin used for CORS and redirects |
| `Email__SmtpHost` | SMTP host |
| `Email__SmtpPort` | SMTP port |
| `Email__Username` | SMTP username |
| `Email__Password` | SMTP password |
| `OAuth__Google__ClientId` | Google OAuth client id |
| `OAuth__Google__ClientSecret` | Google OAuth client secret |
| `OAuth__GitHub__ClientId` | GitHub OAuth client id |
| `OAuth__GitHub__ClientSecret` | GitHub OAuth client secret |
| `OAuth__Apple__ClientId` | Apple OAuth client id |

## API Summary

| Area | Endpoint Prefix |
| --- | --- |
| Auth | `/api/v1/auth` |
| Users | `/api/v1/users` |
| Sessions | `/api/v1/sessions` |
| Outputs | `/api/v1/sessions/{sessionId}/outputs` |
| Code | `/api/v1/sessions/{sessionId}/code` |
| Health | `/health` |

## Running With Docker

Run `docker-compose up --build`.

## Running Tests

Run `dotnet test`.

## Project Structure

- `src/NamuStudio.API`: controllers, middleware, host configuration
- `src/NamuStudio.Application`: DTOs, validators, shared contracts
- `src/NamuStudio.Core`: domain entities and enums
- `src/NamuStudio.Infrastructure`: EF Core, services, integrations, migrations
- `tests/NamuStudio.Application.Tests`: service-level tests with SQLite
- `tests/NamuStudio.API.Tests`: integration tests with `WebApplicationFactory`
