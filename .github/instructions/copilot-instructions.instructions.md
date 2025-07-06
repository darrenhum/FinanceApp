---
applyTo: '**'
---

# FinanceApp Development Guidelines

## 📋 Documentation Policy

### CRITICAL RULE: NEVER Update docs/DESIGN.md

- **docs/DESIGN.md is manually maintained** - AI should NEVER edit this file
- Always READ docs/DESIGN.md to understand current project state and roadmap
- Reference docs/DESIGN.md for sprint planning, architecture decisions, and domain model
- If design updates are needed, suggest changes but let human update manually

### Documentation Approach

- **docs/README.md** is the primary documentation target for AI updates
- **README.md** (root) should contain project overview and quick start only
- Update docs/README.md to reflect current state of:
  - Tech stack and architecture
  - Application flow and features
  - Test setup and coverage
  - Infrastructure and deployment
  - Development workflow
  - Getting started guides

## 🏗️ Project Architecture

### Tech Stack (Phase I - Personal Edition)

- **Frontend**: React/Next.js + Tailwind CSS (PWA)
- **Backend**: NestJS + TypeORM/Prisma
- **Database**: PostgreSQL (AWS RDS Free Tier)
- **Infrastructure**: AWS Serverless (API Gateway + Lambda)
- **Deployment**: Pulumi (Infrastructure as Code)
- **CI/CD**: GitHub Actions

### Core Domain Entities

- Household (single household for Phase I)
- User (exactly 2 users per household)
- Transaction (manual entry + CSV import)
- Category (hierarchical budgeting categories)
- Budget (monthly limits with rollover)
- Account (bank accounts/credit cards)

## 💻 Development Standards

### Code Quality

- **ESLint**: Use flat config format, enforce consistent styling
- **Prettier**: Single quotes, semicolons, 2-space indentation
- **Husky**: Pre-commit hooks are mandatory
- **TypeScript**: Prefer TypeScript for new backend code
- **Testing**: Use custom test runner (transitioning to Jest later)

### File Organization

```
FinanceApp/
├── .github/                    # GitHub Actions and workflows
│   ├── workflows/             # CI/CD pipelines
│   └── instructions/          # AI development guidelines
├── .husky/                    # Git hooks (pre-commit automation)
├── docs/                      # Project documentation
├── pulumi/                    # Infrastructure as Code
├── src/                       # Application source code
│   ├── index.js              # Main application entry point
│   ├── test/                 # Test files
│   │   └── test.js           # Custom test runner
│   ├── components/           # React components (future)
│   ├── api/                  # API routes/controllers (future)
│   └── utils/                # Shared utilities (future)
├── .gitignore                # Git ignore patterns
├── .lintstagedrc.js          # Lint-staged configuration
├── .prettierrc               # Prettier formatting rules
├── .prettierignore           # Files to exclude from formatting
├── eslint.config.js          # ESLint configuration (flat config)
├── package.json              # Project dependencies and scripts
├── docs/                     # Project documentation
│   ├── DESIGN.md            # Project roadmap (NEVER EDIT)
│   └── README.md            # Detailed documentation (AI updates here)
└── README.md                 # Project overview and quick start
```

### Naming Conventions

- **Files**: kebab-case for configs, camelCase for JS/TS
- **Functions**: camelCase
- **Classes**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Database**: snake_case tables/columns

## 🧪 Testing Strategy

### Current Test Setup

- Custom test runner at `src/test/test.js`
- Tests validate project structure, configs, and basic functionality
- Run with `npm test`
- All tests must pass before commits (enforced by pre-commit hooks)

### Future Testing (Sprint 2+)

- Jest for unit tests
- Supertest for API integration tests
- React Testing Library for frontend tests
- Minimum 80% code coverage target

## 🚀 Infrastructure & Deployment

### Current Infrastructure (Sprint 0 Complete)

- **API Gateway**: RESTful endpoints
- **Lambda**: Serverless compute (hello-world deployed)
- **RDS PostgreSQL**: Free tier database
- **Region**: us-east-1
- **Environment**: dev stack

### Deployment Workflow

1. Code changes → GitHub
2. CI/CD pipeline runs (lint, test, security scan)
3. Infrastructure validation (Pulumi preview)
4. Auto-deploy to dev on main branch push
5. Manual promotion to production (future)

## 📝 Development Workflow

### Git Workflow

- **main**: Production-ready code
- **develop**: Integration branch (future)
- Feature branches for new development
- Conventional commit messages (feat:, fix:, docs:, etc.)

### Sprint Methodology

- Follow sprint plan in docs/DESIGN.md
- Each sprint has specific tasks and completion criteria
- Update docs/README.md with completed features
- Never mark sprints complete in docs/DESIGN.md (human-only)

## 🔐 Security & Privacy

### Phase I Security

- HTTPS everywhere
- Password hashing (bcrypt, 12 salt rounds)
- JWT tokens for session management
- Input validation and sanitization
- Regular dependency audits (npm audit)

### Future Security (Phase II)

- SOC 2 compliance preparation
- Row-level security for multi-tenancy
- Secret rotation
- Encryption at rest

## 💰 Cost Management

### Phase I Target: $0 Monthly Cost

- Stay within AWS Free Tier limits
- Monitor usage in AWS console
- Use free tier PostgreSQL (20GB storage)
- Lambda free tier: 1M requests/month
- API Gateway free tier: 1M API calls/month

## 🔧 Common Development Tasks

### Adding New Features

1. Reference DESIGN.md for requirements
2. Create feature branch
3. Implement with tests
4. Update README.md with new functionality
5. Submit PR with comprehensive description

### Database Changes

1. Create TypeORM migrations
2. Update entity definitions
3. Test migration rollback
4. Document schema changes in README.md

### Infrastructure Changes

1. Update Pulumi configuration
2. Test with `pulumi preview`
3. Deploy with `pulumi up`
4. Update README.md with new resources

## 🎯 Phase I Objectives (Reference Only)

### Completed (Sprint 0)

- ✅ Development environment setup
- ✅ Code quality automation (ESLint, Prettier, Husky)
- ✅ Basic infrastructure (API Gateway, Lambda, RDS)
- ✅ CI/CD pipeline (GitHub Actions)

### Next Steps (Read docs/DESIGN.md for details)

- Sprint 1: Core Backend (NestJS, Auth, Database)
- Sprint 2: Transaction Flow (CRUD, CSV import)
- Sprint 3: Budget Engine (Monthly budgets, rollover)
- Sprint 4: Frontend Dashboards (React, charts)
- Sprint 5: Polish & Deploy (Domain, backups)

## 🚨 Important Reminders

1. **NEVER edit docs/DESIGN.md** - Always read it, never write to it
2. **Always update docs/README.md** when adding features or infrastructure
3. **Keep root README.md** focused on project overview and quick start only
4. **Follow the established folder structure** (src/test/, pulumi/, docs/, etc.)
5. **Run tests before committing** (enforced by pre-commit hooks)
6. **Keep costs at $0** - monitor AWS usage
7. **Reference current sprint** in docs/DESIGN.md for context
8. **Use conventional commit messages** for clear change tracking
9. **Maintain backwards compatibility** during Phase I development
