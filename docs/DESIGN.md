# Finance Tracker Application – Dual‑Phase Design Roadmap

A staged plan for building a privacy‑first finance tracker for personal use (Phase I) and then evolving it into a secure, multi‑tenant product (Phase II).

---

## 0. Roadmap at a Glance

| Phase | Intended Users | Primary Goal | Core Architecture |
| ----- | -------------- | ------------ | ----------------- |
|       |                |              |                   |

|   |
| - |

| **Phase I — Personal Edition**      | You and your wife | Ship a self‑hosted MVP with zero running cost and minimal DevOps overhead. | **Simplified Serverless Stack** (see § 1.3) |
| ----------------------------------- | ----------------- | -------------------------------------------------------------------------- | ------------------------------------------- |
| **Phase II — Multi‑Tenant Edition** | Public users      | Add tenant isolation, scalability, and compliance for a paid SaaS launch.  | **Full Cloud‑Native Stack** (see § 2.3)     |

---

# Phase I — Personal Edition (Private Beta)

## 1. Key Scope Decisions

* **Single household:** exactly two user accounts.
* **Authentication:** basic email + password, no social logins.
* **Feature set:** manual transaction entry, CSV import, dashboards, per‑category budgets.
* **Hosting:** AWS Free Tier (or a single VPS).
* **Security:** HTTPS and hashed passwords, but no enterprise controls.
* **Cost target:** **Free** (stay within free tiers or self‑hosting).
* **Development environment:** Windows 11 + Visual Studio Code (WSL 2 optional). All shell commands reference **PowerShell** or **Git Bash** equivalents, and Docker Desktop (WSL 2 backend) is assumed for container tasks.

### 1.1 Core Features

1. **Transaction input** – manual form and CSV upload.
2. **Budgets** – monthly limits with optional rollover.
3. **Dashboards** – spend vs. budget, category pie, monthly trends.
4. **Shared visibility** – both users can view, enter, and edit transactions.
5. **Mobile access** – responsive PWA (native app postponed until Phase II).

### 1.2 Non‑Functional Targets

| Concern     | Target                                                  |
| ----------- | ------------------------------------------------------- |
| Security    | HTTPS; periodic DB backups; no tenant isolation needed. |
| Performance | P95 < 500 ms (single‑digit users).                      |
| Cost        | Remain inside AWS/GitHub free tiers or < USD 5 VPS.     |
| Operations  | Docker Compose or a simple CI/CD pipeline.              |

### 1.3 Simplified Serverless Architecture

```
┌──────────────┐  HTTPS / GraphQL   ┌────────────────┐
│ React (PWA)  │ ─────────────────▶ │  API Gateway   │
└──────────────┘                   └────────┬───────┘
                                           │
                                    AWS Lambda
                                           ▼
                                  ┌──────────────┐
                                  │ PostgreSQL   │
                                  └──────────────┘
```

* **Deployment:** Pulumi or Serverless Framework provisions API Gateway, Lambda, and an RDS Free‑Tier PostgreSQL (or SQLite if using a VPS).
* **Bulk import:** Parse CSV in the browser and send JSON to the API, avoiding an S3/Lambda ETL pipeline for the MVP.

### 1.4 Sprint Plan and Task Breakdown

> **Timeline:** \~3 weeks of part‑time work (17 planned days), followed by continuous dog‑fooding.

#### Sprint 0 — Environment Setup (1 day)

| Step | Task                                                                                                                                           | Status      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 0.0  | Create a private GitHub repo; add `README.md` and `.gitignore`.                                                                                | ✅ Completed |
| 0.1  | Install Node 20 via **nvm‑windows** (or Volta); run `npm init -y`. Install recommended VS Code extensions (ESLint, Prettier, Docker, GitLens). | ✅ Completed |
| 0.2  | Configure ESLint, Prettier, and Husky pre‑commit hooks.                                                                                        | ✅ Completed |
| 0.3  | Install Pulumi; create a **dev** stack with a placeholder API Gateway, a hello‑world Lambda, and RDS Free‑Tier Postgres (or local SQLite).     | ✅ Completed |
| 0.4  | Add a GitHub Actions workflow: checkout → setup‑node → `npm ci` → lint + unit tests.                                                           | ✅ Completed |

#### Sprint 1 — Core Backend (3 days)

| Step | Task                                                                    |
| ---- | ----------------------------------------------------------------------- |
| 1.0  | Run `nest new backend` (monorepo preset).                               |
| 1.1  | Install `@nestjs/terminus`, `class‑validator`, and `class‑transformer`. |
| 1.2  | Connect TypeORM/Prisma to Postgres via `.env`.                          |
| 1.3  | Create entities & migrations: Household, User, Category, Account.       |
| 1.4  | Build `AuthModule` with bcrypt (12 salt rounds) and JWT guards.         |
| 1.5  | Seed script: Household **Family**, two users, default categories.       |

#### Sprint 2 — Transaction Flow (4 days)

| Step | Task                                                            |
| ---- | --------------------------------------------------------------- |
| 2.0  | Add the `Transaction` entity and migration.                     |
| 2.1  | Implement `POST /transactions` and `GET /transactions?month=`.  |
| 2.2  | Add DTO validation; write Jest unit tests.                      |
| 2.3  | Build `pages/transactions/new.tsx` with React Hook Form + Zod.  |
| 2.4  | Add CSV importer (Papa Parse) → batch POST ≈ 100 rows per call. |
| 2.5  | Trigger budget recalculation after each insert.                 |

#### Sprint 3 — Budget Engine (3 days)

| Step | Task                                                                 |
| ---- | -------------------------------------------------------------------- |
| 3.0  | Add the `Budget` entity and migration.                               |
| 3.1  | CRUD endpoints: `GET/POST/PUT /budgets`.                             |
| 3.2  | Implement rollover helper.                                           |
| 3.3  | Schedule a `monthly‑budget‑rollover` Lambda (cron @ first‑of‑month). |
| 3.4  | Integration tests for overspend and unused‑rollover cases.           |

#### Sprint 4 — Front‑End Dashboards (4 days)

| Step | Task                                                 |
| ---- | ---------------------------------------------------- |
| 4.0  | Install Recharts and React Query.                    |
| 4.1  | Build `DashboardLayout` with Tailwind CSS grid.      |
| 4.2  | Implement spend‑over‑time line chart.                |
| 4.3  | Implement category‑breakdown pie chart.              |
| 4.4  | Implement budget‑vs‑actual bar chart.                |
| 4.5  | Add dark‑mode toggle; verify WCAG contrast.          |
| 4.6  | Enable keyboard navigation & ARIA labels for charts. |

#### Sprint 5 — Polish & Deploy (2 days)

| Step | Task                                                                                           |
| ---- | ---------------------------------------------------------------------------------------------- |
| 5.0  | Add a global `ErrorBoundary` and loading skeletons.                                            |
| 5.1  | Finalize the Tailwind theme (colors, fonts).                                                   |
| 5.2  | Register a custom domain; obtain an ACM cert; deploy static Next.js export to S3 + CloudFront. |
| 5.3  | Nightly `pg_dump` to S3 via Lambda; set lifecycle rules to Glacier after 30 days.              |
| 5.4  | Update README with onboarding guide and GIF demo.                                              |

#### Sprint 6 — Dog‑Food & Iterate (ongoing)

| Step | Task                                               |
| ---- | -------------------------------------------------- |
| 6.0  | Use the app daily; log bugs and enhancement ideas. |
| 6.1  | Triage backlog weekly.                             |
| 6.2  | Release weekly patches via GitHub Actions.         |
| 6.3  | Curate the feature backlog for Phase II.           |

---

# Phase II — Multi‑Tenant Edition (Public SaaS)

## 2. Expanded Objectives

* **Unlimited households** with member invitations.
* **Native mobile app** (React Native + push notifications).
* **Custom dashboards** with a widget builder.
* **Institution sync** via Plaid/Flinks.
* **Compliance:** SOC 2 roadmap, GDPR, PIPEDA, OWASP Top‑10.

### 2.1 Non‑Functional Targets

| Concern               | Target                                                 |
| --------------------- | ------------------------------------------------------ |
| Security & Compliance | SOC 2 Type II, secret rotation, encryption at rest.    |
| Scalability           | 10 000+ households, P95 < 200 ms.                      |
| Reliability           | 99.9 % uptime, point‑in‑time DB recovery.              |
| Observability         | Distributed tracing, central logs, proactive alerting. |

### 2.2 Incremental Feature Roadmap

1. **User management & billing** – Stripe integration.
2. **Queues & workers** – migrate imports/analytics to SQS + Lambda consumers.
3. **Caching layer** – Redis for heavy dashboard queries.
4. **Full mobile parity** – offline drafts, biometric auth.
5. **Marketplace add‑ons** – premium reports, AI‑powered spend insights.

### 2.3 Full Cloud‑Native Architecture

```
┌──────────────┐                ┌──────────────┐
│ React/Next.js│  HTTPS / WS    │              │
│  (PWA)       │ ─────────────▶ │              │
└──────────────┘                │  API Gateway │
                                │              │
┌──────────────┐  HTTPS / WS    │              │
│ React Native │ ─────────────▶ │              │
│ (iOS/Android)│                └──────┬───────┘
└──────────────┘                       │
                       (REST / GraphQL │ WebSocket)
                                       ▼
                              ┌────────────────┐
                              │  App Service   │
                              │ (NestJS Node)  │
                              └───┬────────────┘
                                  │ TypeORM
                     bulk CSV     ▼
                      upload  ┌──────────────┐
                              │ PostgreSQL   │
┌──────────────────────────┐   │ (RDS/Aurora)│
│  S3 / Object Storage     │   └──────────────┘
└──────────────────────────┘
     ▲      │ Lambda ETL │
     │      └────────────┘
     │                      async tasks
     │                          │
     ▼                          ▼
┌──────────────────────────┐  ┌──────────────┐
│   Event Queue (SQS)      │  │  Redis Cache │
└──────────────────────────┘  └──────────────┘
```

### 2.4 Migration Strategy

| Area     | Phase I Approach       | Phase II Upgrade Path                                                              |
| -------- | ---------------------- | ---------------------------------------------------------------------------------- |
| Auth     | Email + password       | Migrate to Auth0/Cognito; add social logins and SSO.                               |
| Database | Single‑tenant Postgres | Add `household_id`; enable row‑level security; migrate to Aurora v2 with replicas. |
| Hosting  | Lambda + Free Tier     | Containerize hot paths; deploy to ECS/Fargate or Kubernetes.                       |
| Backups  | Nightly `pg_dump`      | Introduce point‑in‑time recovery and cross‑region replicas.                        |
| CI/CD    | Basic GitHub Actions   | Adopt blue‑green or canary deployments via CodeDeploy.                             |

---

# 3. Unified Domain Model

*(Phase I uses a single pre‑seeded household; Phase II enables multi‑tenant isolation.)*

| Entity              | Key Fields (excerpt)                                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Household**       | `id`, `name`, `created_at`                                                                                      |
| **User**            | `id`, `household_id`, `email`, `password_hash`, `settings`                                                      |
| **Card**            | `id`, `household_id`, `issuing_bank`, `last4`, `nickname`, `owner_user_id`                                      |
| **Account**         | `id`, `household_id`, `name`, `institution`, `type`                                                             |
| **Transaction**     | `id`, `account_id`, `date`, `amount`, `merchant`, `category_id`, `added_by_user_id`, `owner_user_id`, `card_id` |
| **Category**        | `id`, `household_id`, `name`, `parent_id?`                                                                      |
| **Budget**          | `id`, `household_id`, `category_id`, `month`, `limit`, `rollover_strategy`, `carry_over_amount`                 |
| **StatementUpload** | `id`, `household_id`, `uploaded_by_user_id`, `file_url`, `status`, `parsed_rows`                                |

---

# 4. Enterprise Edition Work Items (Placeholder)

Detailed planning will begin once the Personal Edition reaches feature‑complete status.

---

*Document proof‑read, grammar‑checked, and headings unified for clarity.*
