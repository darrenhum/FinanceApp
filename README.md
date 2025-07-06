# FinanceApp

A modern JavaScript finance application with automated code quality tools.

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
