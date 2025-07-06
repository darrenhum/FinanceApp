# FinanceApp

[![CI/CD Pipeline](https://github.com/darrenhum/FinanceApp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/darrenhum/FinanceApp/actions/workflows/ci-cd.yml)

A privacy-first finance tracker built in two phases: **Personal Edition** (MVP for personal use) and **Multi-Tenant Edition** (public SaaS).

## Project Overview

This is a **dual-phase finance application** designed to:

- **Phase I**: Create a self-hosted MVP for personal household finance tracking (you and your wife)
- **Phase II**: Evolve into a secure, multi-tenant SaaS product for public users

### Key Features (Phase I)

- Manual transaction entry and CSV import
- Budget management with rollover capabilities
- Interactive dashboards (spend vs budget, category breakdowns, trends)
- Shared visibility for household members
- Mobile-responsive PWA

### Architecture

- **Frontend**: React/Next.js with Tailwind CSS
- **Backend**: NestJS with TypeORM/Prisma
- **Database**: PostgreSQL
- **Hosting**: AWS Free Tier (serverless stack)
- **Target Cost**: Free (within AWS free tier limits)

📋 **[View Full Design Document](./DESIGN.md)** - Detailed roadmap, architecture, and sprint planning

## Current Infrastructure Setup

**Sprint 0 Complete** ✅

The development environment and basic infrastructure are now set up and ready for application development:

### Code Quality & Automation

- **ESLint** with Prettier integration for consistent code formatting
- **Husky** pre-commit hooks to ensure code quality before commits
- **lint-staged** for efficient linting of only changed files
- All configuration files properly set up and tested

### Infrastructure as Code (Pulumi)

- **AWS API Gateway** with RESTful endpoint structure
- **AWS Lambda** function for serverless compute (hello-world endpoint deployed and tested)
- **AWS RDS PostgreSQL** instance (free tier) for persistent data storage
- Infrastructure provisioned in `us-east-1` region with dev stack

### CI/CD Pipeline (GitHub Actions)

- **Multi-node testing** strategy (Node.js 18.x and 20.x)
- **Automated testing** with custom test runner (validates project structure, dependencies, and basic functionality)
- **Code quality checks** (ESLint and Prettier validation)
- **Security scanning** with npm audit
- **Infrastructure validation** with Pulumi preview/deployment on main branch
- **Status badges** in README for build visibility

### Current Endpoints

- **API Gateway**: `https://1l9nqnfhq5.execute-api.us-east-1.amazonaws.com/dev/hello`
- **Lambda Function**: Successfully deployed and responds with "Hello, World!"
- **Database**: PostgreSQL RDS instance ready for application schema

### Development Tools

- VS Code workspace configured with recommended extensions
- Git hooks for automated code quality enforcement
- Package.json scripts for common development tasks (lint, format, test)

## Code Quality Setup

This project includes a comprehensive code quality setup with:

### ESLint

- **Configuration**: Modern flat config format (`eslint.config.js`)
- **Rules**: Includes recommended rules plus Prettier integration
- **Features**:
  - ES2022 support
  - Module syntax
  - Prettier conflict resolution

### Prettier

- **Configuration**: `.prettierrc` with consistent formatting rules
- **Settings**:
  - Single quotes
  - Semicolons
  - 2-space indentation
  - Trailing commas (ES5)
  - Auto line endings

### Husky + lint-staged

- **Pre-commit hooks**: Automatically runs linting and formatting before commits
- **File filtering**: Only processes relevant files (excludes node_modules)
- **Auto-fix**: Attempts to fix linting issues automatically

## Available Scripts

```bash
# Lint all files
npm run lint

# Lint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without making changes
npm run format:check
```

## Development Workflow

1. Make your code changes
2. Stage your files with `git add`
3. Commit with `git commit -m "your message"`
4. The pre-commit hook will automatically:
   - Run ESLint with auto-fix
   - Format code with Prettier
   - Only allow the commit if no unfixable issues remain

## Getting Started

```bash
# Install dependencies
npm install

# Start developing - the pre-commit hooks are already set up!
```

The pre-commit hooks ensure that all committed code follows the project's style guidelines and is free of common issues.
