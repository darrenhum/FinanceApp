# FinanceApp

[![CI/CD Pipeline](https://github.com/darrenhum/FinanceApp/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/darrenhum/FinanceApp/actions/workflows/ci-cd.yml)

A privacy-first finance tracker built in two phases: **Personal Edition** (MVP for personal use) and **Multi-Tenant Edition** (public SaaS).

## Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd FinanceApp
npm install

# Run tests
npm test

# Start development
npm run lint
npm run format
```

## What's This?

**Phase I**: Self-hosted MVP for personal household finance tracking  
**Phase II**: Secure, multi-tenant SaaS product for public users

### Current Status

**Sprint 0 Complete** ✅ - Development environment, infrastructure, and CI/CD pipeline ready

### Tech Stack

- **Frontend**: React/Next.js + Tailwind CSS (PWA)
- **Backend**: NestJS + TypeORM/Prisma
- **Database**: PostgreSQL (AWS RDS Free Tier)
- **Infrastructure**: AWS Serverless (API Gateway + Lambda)
- **Deployment**: Pulumi + GitHub Actions

## Documentation

📚 **[Complete Documentation](./docs/README.md)** - Setup guide, architecture, development workflow

📋 **[Project Roadmap](./docs/DESIGN.md)** - Sprint planning, architecture decisions, domain model

## Development

All code quality is automated:

- ESLint + Prettier formatting
- Pre-commit hooks via Husky
- Multi-node testing (Node.js 18.x, 20.x)
- Automated security scanning

```bash
npm run lint      # Check code quality
npm run format    # Format all files
npm test          # Run test suite
```

## Contributing

1. Follow the sprint plan in [docs/DESIGN.md](./docs/DESIGN.md)
2. Use conventional commit messages (`feat:`, `fix:`, `docs:`)
3. All commits must pass automated quality checks

---

**Target Cost**: $0 (AWS Free Tier) | **Next**: Sprint 1 (Core Backend)
