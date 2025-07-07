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

   The pre-commit hooks ensure that all committed code follows the project's style guidelines and is free of common issues.

## Development Environment Setup

### Mac Prerequisites

1. **Install Homebrew** (if not already installed):

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js** (using Node Version Manager for better version control):

   ```bash
   # Install nvm
   brew install nvm

   # Add nvm to your shell profile (.zshrc or .bash_profile)
   echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
   echo '[ -s "/opt/homebrew/share/nvm/nvm.sh" ] && \. "/opt/homebrew/share/nvm/nvm.sh"' >> ~/.zshrc
   echo '[ -s "/opt/homebrew/share/nvm/bash_completion" ] && \. "/opt/homebrew/share/nvm/bash_completion"' >> ~/.zshrc

   # Restart your terminal or source your profile
   source ~/.zshrc

   # Install and use Node.js 20.x (recommended)
   nvm install 20
   nvm use 20
   nvm alias default 20
   ```

3. **Install Git and VS Code**:
   ```bash
   brew install git
   brew install --cask visual-studio-code
   ```

### Windows Prerequisites

1. **Install Node.js via Node Version Manager (nvm-windows)**:

   Download and install nvm-windows from the [official repository](https://github.com/coreybutler/nvm-windows/releases):

   ```powershell
   # Download the latest nvm-setup.zip from GitHub releases
   # Extract and run nvm-setup.exe as Administrator
   ```

   After installation, restart your terminal and run:

   ```powershell
   # Verify nvm installation
   nvm version

   # Install and use Node.js 20.x (recommended)
   nvm install 20.12.2
   nvm use 20.12.2

   # Set as default
   nvm alias default 20.12.2

   # Verify installation
   node --version
   npm --version
   ```

2. **Install Git and VS Code**:

   Download and install from their official websites:
   - Git: [git-scm.com](https://git-scm.com/download/win)
   - VS Code: [code.visualstudio.com](https://code.visualstudio.com/)

3. **Optional: Package Manager Installation**:

   ```powershell
   # Using Chocolatey (run as Administrator)
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   choco install nodejs-lts git vscode -y

   # Or using Winget (Windows Package Manager)
   winget install OpenJS.NodeJS.LTS
   winget install Git.Git
   winget install Microsoft.VisualStudioCode
   ```

4. **PowerShell Configuration**:

   ```powershell
   # Enable script execution (if needed)
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

   # Optional: Configure PowerShell profile with useful aliases
   if (!(Test-Path $PROFILE)) {
       New-Item -Type File -Path $PROFILE -Force
   }

   # Add useful aliases to profile
   Add-Content $PROFILE "function ll { Get-ChildItem -Force }"
   Add-Content $PROFILE "function la { Get-ChildItem -Force -Hidden }"
   Add-Content $PROFILE "Set-Alias -Name grep -Value Select-String"
   ```

### Project Setup (All Platforms)

1. **Clone the repository**:

   ```bash
   git clone https://github.com/darrenhum/FinanceApp.git
   cd FinanceApp
   ```

2. **Install project dependencies**:

   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..

   # Install Pulumi dependencies (optional, for infrastructure work)
   cd pulumi
   npm install
   cd ..
   ```

3. **Verify installation**:

   ```bash
   # Run integration tests
   npm test

   # Run backend tests
   npm run test:backend

   # Check code quality
   npm run lint
   ```

### Backend Development Setup

1. **Environment variables**: The backend `.env` file is already configured with AWS RDS credentials. No changes needed unless working with a local database.

2. **Database setup**: The database is already seeded with initial data. To re-run the seed script (script is idempotent):

   ```bash
   cd backend
   npm run seed
   ```

3. **Start the backend server**:

   ```bash
   cd backend
   npm run start:dev  # Development mode with hot reload
   # or
   npm start          # Production mode
   ```

   The backend will be available at `http://localhost:3000`

### Recommended VS Code Extensions

Install these extensions for the best development experience:

```bash
# Install via command line (Mac/Linux)
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
```

```powershell
# Install via command line (Windows PowerShell)
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-json
```

Or install via VS Code Extensions panel:

- **Prettier** - Code formatter
- **ESLint** - JavaScript/TypeScript linter
- **TypeScript Importer** - Auto import for TypeScript
- **Tailwind CSS IntelliSense** - For future frontend work
- **Thunder Client** - API testing (alternative to Postman)

### Development Workflow

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the project structure:
   - Backend code: `backend/src/`
   - Tests: `backend/test/` for backend-specific, `test/` for integration
   - Documentation: `docs/README.md` (this file)

3. **Test your changes**:

   ```bash
   # Run all tests
   npm test
   npm run test:backend

   # Check code quality
   npm run lint
   npm run format:check
   ```

4. **Commit changes** (pre-commit hooks will run automatically):

   ```bash
   git add .
   git commit -m "feat: your descriptive commit message"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   # Then create a Pull Request on GitHub
   ```

### Common Development Commands

```bash
# Root level (all platforms)
npm test                   # Run integration tests
npm run lint               # Check code quality
npm run format             # Format all files with Prettier

# Backend development
cd backend
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm test                   # Run backend tests
npm run seed               # Seed database with initial data

# Infrastructure (optional)
cd pulumi
pulumi preview             # Preview infrastructure changes
pulumi up                  # Deploy infrastructure changes
```

**Note**: All npm commands work identically on Windows, Mac, and Linux. Windows users can use `Set-Location` instead of `cd` in PowerShell if preferred.

The project follows conventional commit messages and has automated code quality checks. All commits must pass linting and tests before being accepted.

## Project Structure

The project follows modern Node.js industry standards with a clean, organized structure:

```
FinanceApp/
├── .github/                    # GitHub Actions and workflows
│   ├── workflows/             # CI/CD pipelines
│   └── instructions/          # AI development guidelines
├── .husky/                    # Git hooks (pre-commit automation)
├── backend/                   # NestJS API Application
│   ├── src/                   # Source code
│   │   ├── auth/              # Authentication module
│   │   ├── entities/          # TypeORM entities
│   │   ├── app.module.ts      # Main application module
│   │   └── main.ts            # Application entry point
│   ├── test/                  # Backend-specific tests
│   ├── .env                   # Backend environment variables
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript configuration
├── docs/                      # Project documentation
│   ├── DESIGN.md              # Architecture and roadmap
│   └── README.md              # Detailed documentation
├── pulumi/                    # Infrastructure as Code
│   ├── index.ts               # AWS infrastructure definition
│   └── package.json           # Pulumi dependencies
├── test/                      # Integration tests
│   └── integration.js         # Project-wide integration tests
├── .gitignore                 # Git ignore patterns
├── .lintstagedrc.js           # Lint-staged configuration
├── .prettierrc                # Prettier formatting rules
├── eslint.config.js           # ESLint configuration
├── package.json               # Root project configuration
└── README.md                  # Project overview and quick start
```

### Backend Architecture (Sprint 1 Complete) ✅

**NestJS API with TypeORM:**

- **Authentication**: JWT-based auth with bcrypt password hashing (12 salt rounds)
- **Database Entities**: Household, User, Category, Account entities with proper relationships
- **Environment Configuration**: Centralized config with validation
- **TypeScript**: Fully typed with strict TypeScript configuration
- **Testing**: Jest integration tests and E2E testing setup

### Database Schema

**Core Entities:**

- `households`: Single household for Phase I (supports multi-tenant expansion)
- `users`: Exactly 2 users per household with secure password storage
- `categories`: Hierarchical budget categories with parent-child relationships
- `accounts`: Bank accounts and credit cards with balance tracking
- `transactions`: ✅ **Transaction records with category assignment (Sprint 2, Step 2.0 Complete)**
- `budgets`: (Coming in Sprint 3) Monthly budget limits with rollover capabilities

**Sprint 2 Progress:**

- **Step 2.0 Complete** ✅: Transaction entity and database schema created with proper foreign key relationships to accounts, categories, and users
- **Step 2.1 Complete** ✅: Transaction API endpoints implemented (`POST /transactions` and `GET /transactions?month=`) with JWT authentication, proper service layer, and TypeORM repository integration

### Design Principles

- **Clean Root Directory**: Only essential configuration files in project root
- **Logical Grouping**: Related files organized into appropriate directories
- **Industry Standards**: Follows Node.js and modern JavaScript project conventions
- **Scalability**: Structure supports future growth and additional features
- **Developer Experience**: Clear organization for easy navigation and onboarding
