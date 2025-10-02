
# NestJS Clean Architecture Demo 🏗️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/NestJS-8.x-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-20.x-blue.svg)](https://www.docker.com/)

A production-ready backend application demonstrating Clean Architecture principles in NestJS. This project showcases how to build scalable, maintainable, and testable applications using Domain-Driven Design (DDD) and SOLID principles.

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## 🎯 Project Overview

This project implements a coaching platform backend that demonstrates:

- **Clean Architecture** implementation in NestJS
- **Domain-Driven Design** (DDD) principles
- **SOLID** principles application
- **Enterprise-grade** project structure
- **Production-ready** configurations
- **Docker** containerization
- **Comprehensive testing** setup

## 🌟 Key Features

### Architecture & Design
- Clean Architecture with clear separation of concerns
- Domain-driven design with rich domain models
- Use-case driven development
- Repository pattern implementation
- SOLID principles adherence

### Technical Implementation
- Advanced authentication & authorization (JWT)
- Comprehensive error handling
- Environment-based configurations
- Swagger API documentation
- Database migrations
- Logging & monitoring setup

### Core Domain Features
- Comprehensive user management (Coaches, Players)
- Program & Training management
- Diet & Exercise tracking
- Membership & Enrollment system
- Rating & Feedback system
- Media handling
- Transaction processing

## System Architecture

### Clean Architecture Layers

```mermaid
graph TB
    subgraph External["External Layer (Infrastructure)"]
        C[Controllers]
        R[Repositories Impl]
        S[Services]
        D[(Database)]
        style C fill:#e1bee7,stroke:#333
        style R fill:#e1bee7,stroke:#333
        style S fill:#e1bee7,stroke:#333
        style D fill:#e1bee7,stroke:#333
    end

    subgraph Application["Application Layer (Use Cases)"]
        UC[Use Cases]
        style UC fill:#bbdefb,stroke:#333
    end

    subgraph Domain["Domain Layer (Core)"]
        E[Entities]
        I[Interfaces]
        V[Value Objects]
        style E fill:#c8e6c9,stroke:#333
        style I fill:#c8e6c9,stroke:#333
        style V fill:#c8e6c9,stroke:#333
    end

    C --> UC
    UC --> E
    UC --> I
    R --> I
    S --> UC
    R --> D

    classDef default fill:#fff,stroke:#333,stroke-width:2px;
```

### System Architecture Overview

```mermaid
flowchart TB
    Client[Client Applications] --> Gateway[API Gateway/Controllers]
    Gateway --> Auth[Authentication/JWT]
    Gateway --> Services[Domain Services]
    Auth --> Services
    Services --> Repos[Repositories]
    Repos --> DB[(PostgreSQL Database)]
    
    subgraph Clean Architecture
        Gateway --> |Request/Response| Services
        Services --> |Domain Logic| Repos
        Repos --> |Data Access| DB
    end

    subgraph Security Layer
        Auth --> |Validate Token| Services
        Auth --> |Secure Routes| Gateway
    end

    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Gateway fill:#bbf,stroke:#333,stroke-width:2px
    style Auth fill:#fb7,stroke:#333,stroke-width:2px
    style Services fill:#bfb,stroke:#333,stroke-width:2px
    style Repos fill:#fbb,stroke:#333,stroke-width:2px
    style DB fill:#fff,stroke:#333,stroke-width:2px
```

### Database Entity Relationship Diagram

```mermaid
erDiagram
    Account ||--o| Coach : has
    Account ||--o| Player : has
    Coach ||--|{ Program : creates
    Coach ||--|{ Gym : owns
    Player ||--|{ Enrollment : has
    Player ||--|{ Membership : has
    Player ||--|{ Diet : follows
    Player ||--|{ Training : performs
    Program ||--|{ Exercise : contains
    Program ||--|{ Enrollment : has
    Exercise ||--|{ Training : included_in
    Player ||--|{ Rating : gives
    Coach ||--|{ Rating : receives
    Player ||--|{ Transaction : makes
    Gym ||--|{ Membership : offers

    Account {
        uuid id PK
        string username
        string email
        string password
        timestamp created_at
        timestamp updated_at
    }

    Coach {
        uuid id PK
        uuid account_id FK
        string specialization
        string bio
    }

    Player {
        uuid id PK
        uuid account_id FK
        integer age
        string gender
    }

    Program {
        uuid id PK
        uuid coach_id FK
        string title
        string description
    }

    Exercise {
        uuid id PK
        uuid program_id FK
        string name
        integer duration
    }

    Training {
        uuid id PK
        uuid player_id FK
        uuid exercise_id FK
        date date
        string feedback
    }
```

### Code Structure Example

```typescript
// Domain Layer - Entity
// src/domain/entities/coach.entity.ts
export class Coach {
    private readonly id: string;
    private readonly specialization: string;
    private readonly bio: string;

    constructor(props: CoachProps) {
        this.id = props.id;
        this.specialization = props.specialization;
        this.bio = props.bio;
    }

    // Domain logic and business rules
    canCreateProgram(): boolean {
        // Business validation
        return true;
    }
}

// Application Layer - Use Case
// src/use-cases/coach.usecases.ts
export class CreateCoachUseCase {
    constructor(
        private readonly coachRepository: ICoachRepository,
    ) {}

    async execute(data: CreateCoachDto): Promise<Coach> {
        const coach = new Coach(data);
        return this.coachRepository.save(coach);
    }
}

// Infrastructure Layer - Controller
// src/infrastructure/controllers/coach.controller.ts
@Controller('coaches')
export class CoachController {
    constructor(
        private readonly createCoachUseCase: CreateCoachUseCase,
    ) {}

    @Post()
    async createCoach(@Body() data: CreateCoachDto) {
        return this.createCoachUseCase.execute(data);
    }
}
```



## 🛠️ Technology Stack

### Core
- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[TypeScript](https://www.typescriptlang.org/)** - Static typing and ECMAScript features
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database

### Infrastructure
- **[Docker](https://www.docker.com/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration

### Security
- **[JWT](https://jwt.io/)** - Authentication & Authorization
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing

### Development & Testing
- **[Jest](https://jestjs.io/)** - Testing framework
- **[ESLint](https://eslint.org/)** - Code quality
- **[Prettier](https://prettier.io/)** - Code formatting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher) or Yarn
- Docker & Docker Compose
- PostgreSQL (if running locally)

## 🚀 Getting Started

### Local Development Setup

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

## 📁 Project Structure

The project follows Clean Architecture principles with a clear separation of concerns:

```
src/
├── domain/                 # Enterprise business rules
│   ├── entities/          # Enterprise business entities
│   ├── repositories/      # Repository interfaces
│   ├── adapters/         # Interface adapters
│   └── models/           # Domain models & value objects
├── infrastructure/        # Frameworks & tools
│   ├── common/           # Shared utilities
│   ├── config/           # Configuration
│   ├── controllers/      # REST API controllers
│   ├── repositories/     # Repository implementations
│   └── services/         # External service implementations
├── use-cases/            # Application business rules
├── app.module.ts         # Main application module
└── main.ts              # Application entry point
```

## ⚙️ Environment Configuration

Configure your environment in `env/local.env`:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=youruser
DB_PASS=yourpass
DB_NAME=mycoach

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 📚 API Documentation

The API documentation is available through Swagger UI at `/api/docs` when running the application. The endpoints are organized by domain entities:

- `/api/v1/accounts` - Account management
- `/api/v1/coaches` - Coach profiles and management
- `/api/v1/players` - Player profiles and management
- `/api/v1/programs` - Training programs
- `/api/v1/memberships` - Membership management
- `/api/v1/enrollments` - Program enrollments
- `/api/v1/diets` - Diet plans
- `/api/v1/exercises` - Exercise library
- `/api/v1/trainings` - Training sessions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

Created by [Yazan Zebak](https://github.com/YazanZebak)
