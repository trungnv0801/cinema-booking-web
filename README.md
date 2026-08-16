# Cinema Booking Web

Frontend web application for cinema ticket booking, built with React, TypeScript, and Vite.

## Prerequisites

- Node.js 20+
- npm

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment file and adjust values as needed:

   ```bash
   cp .env.example .env
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Development Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type checking without emitting files |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without writing changes |
| `npm run test` | Run the test suite once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run generate:api` | Generate TypeScript types from the backend OpenAPI schema |
| `npm run check:api` | Check the local API schema against the backend |

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API |
| `VITE_PORT` | Local dev server port |
| `VITE_API_TIMEOUT` | API request timeout (ms) |
| `VITE_API_WITH_CREDENTIALS` | Whether to send credentials with API requests |
| `VITE_ENABLE_MOCKS` | Toggle MSW API mocking |
| `VITE_SUPPORT_EMAIL` | Support contact email shown in the UI |

## API Type Generation

`npm run generate:api` fetches the OpenAPI spec (default: `http://localhost:8080/api/v1/api-docs`) and generates types into `src/shared/api/schema.d.ts`. Override the source with the `OPENAPI_URL` environment variable if the backend runs elsewhere:

```bash
OPENAPI_URL=http://localhost:9090/api/v1/api-docs npm run generate:api
```
