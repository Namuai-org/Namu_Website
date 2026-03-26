# Namu

Namu is an AI product ecosystem focused on building useful, trustworthy tools for African communities in their own languages, starting with Hausa speakers in Niger and West Africa.

This repository contains the main public website plus separate studio frontend and backend applications that support the broader Namu product.

## Repository Overview

- `namu-website/`
  Public marketing website built with Next.js.
- `Namu_Studio_Frontend/`
  Product frontend for the Namu Studio experience.
- `Namu_Studio_Backend/`
  .NET 8 backend API for authentication, sessions, code, outputs, and supporting services.

## Project Breakdown

### `namu-website/`

The public-facing marketing and brand website.

Highlights:

- Next.js 15 + React 19
- Landing pages for product, team, research, pitch, and solutions
- Localized copy and custom interactive sections
- Demo export script for generating showcase assets

Useful commands:

```bash
cd namu-website
npm install
npm run dev
npm run build
```

### `Namu_Studio_Frontend/`

The application frontend for Namu Studio.

Highlights:

- Next.js 14 + React 18
- Auth flows, onboarding, workspace, session history, and studio UI
- Supabase helpers and shared studio state/context
- Hausa and English i18n support

Useful commands:

```bash
cd Namu_Studio_Frontend
npm install
npm run dev
npm run build
```

### `Namu_Studio_Backend/`

The backend API for Namu Studio.

Highlights:

- .NET 8 Web API
- PostgreSQL-backed persistence
- JWT auth with refresh rotation
- Swagger, Docker, validation, logging, and automated tests

Useful commands:

```bash
cd Namu_Studio_Backend
dotnet restore
dotnet run --project src/NamuStudio.API
dotnet test
```

For backend environment variables and API details, see:
[`Namu_Studio_Backend/README.md`](/Users/mouhamad/Desktop/Namu/Namu-/Namu_Studio_Backend/README.md)

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- .NET 8 SDK for the backend
- PostgreSQL 15+ for local backend development

### Common Local Setup

1. Clone the repository.
2. Install dependencies inside each project you want to run.
3. Configure environment variables where needed.
4. Start the relevant app from its own folder.

Example:

```bash
git clone <your-repo-url>
cd Namu-

cd namu-website
npm install
npm run dev
```

## Recommended Development Flow

- Use `namu-website/` for public site and brand work.
- Use `Namu_Studio_Frontend/` for product UI and studio experience changes.
- Use `Namu_Studio_Backend/` for API, auth, sessions, and persistence changes.

These projects are kept in the same repository, but they are run independently.

## High-Level Structure

```text
Namu-/
├── README.md
├── namu-website/
├── Namu_Studio_Frontend/
└── Namu_Studio_Backend/
```

## Notes

- The root of the repository is an overview layer, not a runnable app by itself.
- Each project has its own dependencies, scripts, and runtime requirements.
- If you are only working on the public site, start in `namu-website/`.
