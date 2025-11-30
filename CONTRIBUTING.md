# Contributing to Orbis Website

Thank you for your interest in contributing to the Orbis Website project! This document provides guidelines and specifications for contributing to this monorepo.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## Project Overview

Orbis Website is a full-stack application built using a Turborepo monorepo architecture. The project combines a Next.js frontend with a NestJS backend API, using Prisma for database management and Better Auth for authentication.

## Tech Stack

### Frontend (Web App)
- **Framework**: Next.js 15.4.2
- **React**: 19.1.0
- **TypeScript**: 5.8.2
- **UI Components**: Shared component library (`@repo/ui`)

### Backend (API)
- **Framework**: NestJS 11.0.0
- **Runtime**: Node.js >=18
- **Authentication**: Better Auth with NestJS integration
- **TypeScript**: 5.9.3

### Database
- **ORM**: Prisma 6.19.0
- **Database**: PostgreSQL (via Prisma adapter)

### Monorepo Tools
- **Build System**: Turborepo 2.6.1
- **Package Manager**: pnpm 8.15.5
- **Linting**: ESLint 9.31.0
- **Formatting**: Prettier 3.2.5
- **Testing**: Jest & Playwright

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 8.15.5

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Orbis-Website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
cd packages/database
pnpm db:generate
pnpm db:migrate
```

4. Start development servers:
```bash
# From the root directory
pnpm dev
```

This will start:
- Web app on `http://localhost:3001` (Next.js with Turbopack)
- API on the default NestJS port

## Development Workflow

### Available Scripts

From the root directory:

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps and packages
- `pnpm test` - Run all test suites
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm lint` - Lint all projects
- `pnpm format` - Format code with Prettier

### Package-Specific Scripts

#### Web App (`apps/web`)
```bash
cd apps/web
pnpm dev          # Start Next.js dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Lint with max warnings set to 0
pnpm check-types  # Type-check without emitting files
```

#### API (`apps/api`)
```bash
cd apps/api
pnpm dev          # Start NestJS in watch mode
pnpm build        # Build the API
pnpm start:prod   # Start in production mode
pnpm test         # Run unit tests
pnpm test:e2e     # Run e2e tests
pnpm test:watch   # Run tests in watch mode
```

#### Database (`packages/database`)
```bash
cd packages/database
pnpm db:generate  # Generate Prisma client
pnpm db:migrate   # Create and apply migrations
pnpm db:deploy    # Deploy migrations to production
```

## Project Structure

```
.
├── apps/
│   ├── api/                      # NestJS API application
│   └── web/                      # Next.js web application
├── packages/
│   ├── @repo/auth               # Better Auth configuration
│   ├── @repo/db                 # Prisma database layer
│   ├── @repo/ui                 # Shared UI components
│   ├── @repo/eslint-config      # Shared ESLint configuration
│   ├── @repo/jest-config        # Shared Jest configuration
│   └── @repo/typescript-config  # Shared TypeScript configuration
├── turbo.json                   # Turborepo configuration
└── package.json                 # Root package configuration
```

## Code Standards

### TypeScript

- All code must be written in TypeScript
- Maintain strict type safety
- Use proper type definitions; avoid `any` when possible
- Run `pnpm check-types` before committing

### Linting

- Follow the ESLint configuration in `@repo/eslint-config`
- Fix all linting errors before submitting
- Maximum warnings allowed: 0 (strict mode)
- Run `pnpm lint` to check for issues

### Code Formatting

- Use Prettier for consistent code formatting
- Supported file types: `.ts`, `.tsx`, `.md`
- Run `pnpm format` before committing
- Configuration is in `@repo/eslint-config/prettier-base.js`

### Best Practices

1. **Component Organization**: Keep components small and focused
2. **Error Handling**: Implement proper error boundaries and API error handling
3. **Authentication**: Use Better Auth patterns consistently
4. **Database**: Always use Prisma for database operations
5. **API Design**: Follow RESTful principles and document with Swagger
6. **Performance**: Utilize Next.js optimization features and NestJS best practices

## Testing

### Unit Tests

Run unit tests across all packages:
```bash
pnpm test
```

For specific packages:
```bash
cd apps/api
pnpm test
```

### End-to-End Tests

Run e2e tests:
```bash
pnpm test:e2e
```

### Writing Tests

- Write tests for new features and bug fixes
- Maintain or improve code coverage
- Use Jest for unit tests
- Use Playwright for e2e tests
- Mock external dependencies appropriately

## Commit Guidelines

### Commit Message Format

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add email verification flow

Implemented email verification using Better Auth
- Added verification endpoint
- Updated user schema
- Added email templates

Closes #123
```

```
fix(api): resolve CORS configuration issue

Updated CORS settings to allow credentials
```

## Pull Request Process

1. **Create a Branch**
   - Use descriptive branch names: `feature/add-user-profile`, `fix/login-redirect`
   - Branch from `development` (or main branch as configured)

2. **Make Your Changes**
   - Follow the code standards outlined above
   - Write or update tests as needed
   - Update documentation if required

3. **Before Submitting**
   - Run `pnpm lint` and fix all issues
   - Run `pnpm format` to format code
   - Run `pnpm test` to ensure all tests pass
   - Run `pnpm build` to verify the build works

4. **Submit Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Request review from maintainers
   - Respond to feedback promptly

5. **After Approval**
   - Ensure CI/CD passes
   - Squash commits if requested
   - Maintainers will merge when ready

## Questions or Issues?

If you have questions or run into issues:

- Check existing issues in the repository
- Create a new issue with detailed information
- Reach out to the maintainers

Thank you for contributing to Orbis Website!
