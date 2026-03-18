FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY NamuStudio.sln ./
COPY src/NamuStudio.API/NamuStudio.API.csproj src/NamuStudio.API/
COPY src/NamuStudio.Application/NamuStudio.Application.csproj src/NamuStudio.Application/
COPY src/NamuStudio.Core/NamuStudio.Core.csproj src/NamuStudio.Core/
COPY src/NamuStudio.Infrastructure/NamuStudio.Infrastructure.csproj src/NamuStudio.Infrastructure/
COPY tests/NamuStudio.API.Tests/NamuStudio.API.Tests.csproj tests/NamuStudio.API.Tests/
COPY tests/NamuStudio.Application.Tests/NamuStudio.Application.Tests.csproj tests/NamuStudio.Application.Tests/
RUN dotnet restore NamuStudio.sln

COPY . .
RUN dotnet publish src/NamuStudio.API/NamuStudio.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
RUN adduser --disabled-password --gecos "" namu && chown -R namu /app
USER namu
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "NamuStudio.API.dll"]
