
# My Coach Backend

This is the backend API for the My Coach platform, built with NestJS. It provides endpoints and business logic for managing coaches, players, gyms, memberships, programs, diets, enrollments, and more. The project follows clean architecture principles and is containerized with Docker for easy deployment.

## Features

- Modular domain-driven design
- RESTful API endpoints for all core entities (Account, Coach, Player, Gym, etc.)
- Authentication and authorization (JWT, bcrypt)
- Database configuration via environment variables
- Docker support for local and production environments
- Extensible infrastructure for services, repositories, and controllers

## Tech Stack

- NestJS (TypeScript)
- Docker & Docker Compose
- PostgreSQL (default, configurable)
- JWT & bcrypt for authentication

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Yarn or npm
- Docker & Docker Compose (for containerized setup)

### Local Development

1. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```
2. Configure environment variables in `env/local.env`.
3. Start the server:
   ```bash
   yarn start:dev
   # or
   npm run start:dev
   ```

### Docker Setup

1. Copy and edit environment variables in `env/local.env` as needed.
2. Build and start containers:
   ```bash
   docker-compose up --build
   ```

### Running Tests

```bash
yarn test:e2e
# or
npm run test:e2e
```

## Folder Structure

```
src/
  domain/         # Core domain entities, interfaces, adapters
  infrastructure/ # Controllers, services, repositories, configuration
  use-cases/      # Application use cases
  app.module.ts   # Main NestJS module
  main.ts         # Entry point
env/              # Environment variable files
public/           # Static files
test/             # End-to-end tests
docker-compose.yml
```

## Environment Variables

Configure your environment variables in `env/local.env`. Example:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=youruser
DB_PASS=yourpass
DB_NAME=mycoach
JWT_SECRET=your_jwt_secret
```

## API Documentation

API endpoints are organized by entity (e.g., `/account`, `/coach`, `/gym`, etc.). See controller files in `src/infrastructure/controllers/` for details.

## License

This project is licensed under the MIT License.
