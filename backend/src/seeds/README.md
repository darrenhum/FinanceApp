# Database Seed Scripts

This directory contains scripts for populating the database with initial data.

## Available Seeds

### Initial Seed (`initial-seed.ts`)

Creates the foundational data for the FinanceApp:

- **Household**: "Family" household
- **Users**: Two users (John and Jane Doe) with hashed passwords
- **Categories**: 7 main categories with 19 subcategories:
  - Income (Salary, Freelance, Investment)
  - Housing (Rent/Mortgage, Utilities, Maintenance)
  - Food (Groceries, Dining Out)
  - Transportation (Gas, Public Transit, Car Maintenance)
  - Entertainment (Streaming Services, Movies & Events, Games & Hobbies)
  - Healthcare (Insurance, Medical Bills)
  - Savings (Emergency Fund, Retirement, Vacation)

## Usage

### Run the Initial Seed

```bash
# From the backend directory
npm run seed
```

### Prerequisites

- AWS RDS database must be running and accessible
- Environment variables must be configured in `.env`
- Required environment variables:
  - `DATABASE_HOST`
  - `DATABASE_PORT`
  - `DATABASE_NAME`
  - `DATABASE_USERNAME`
  - `DATABASE_PASSWORD`

### Safety Features

- **Idempotent**: Can be run multiple times without creating duplicates
- **Validation**: Checks for existing records before creation
- **Logging**: Provides detailed console output during execution
- **Error Handling**: Graceful error handling with proper cleanup

## Development Notes

- The seed script uses TypeORM repositories for data creation
- Passwords are hashed with bcrypt (12 salt rounds)
- SSL connections are automatically configured for AWS RDS
- Database schema is synchronized automatically in development mode

## Adding New Seeds

To add new seed data:

1. Create a new seed class in this directory
2. Follow the pattern of `InitialSeed` class
3. Add the seed to the `run-seed.ts` file
4. Update this README with documentation
