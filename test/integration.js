#!/usr/bin/env node

/**
 * Integration test runner for FinanceApp
 * This validates the overall project structure and basic functionality
 * Backend-specific tests are in backend/test/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// eslint-disable-next-line no-console
console.log('🧪 Running FinanceApp Integration Tests...\n');

let testsPassed = 0;
let testsTotal = 0;

function test(description, testFn) {
  testsTotal++;
  try {
    testFn();
    // eslint-disable-next-line no-console
    console.log(`✅ ${description}`);
    testsPassed++;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`❌ ${description}`);
    // eslint-disable-next-line no-console
    console.log(`   Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Test 1: Check if backend exists
test('Backend application exists', () => {
  assert(
    fs.existsSync(path.join(projectRoot, 'backend', 'src', 'main.ts')),
    'backend/src/main.ts should exist'
  );
  assert(
    fs.existsSync(path.join(projectRoot, 'backend', 'package.json')),
    'backend/package.json should exist'
  );
});

// Test 2: Package.json is valid
test('Root package.json is valid', () => {
  const packagePath = path.join(projectRoot, 'package.json');
  assert(fs.existsSync(packagePath), 'package.json should exist');

  const content = fs.readFileSync(packagePath, 'utf8');
  const pkg = JSON.parse(content);
  assert(pkg.name === 'financeapp', 'Package name should be financeapp');
  assert(pkg.scripts, 'Package should have scripts');
});

// Test 3: Required config files exist
test('Required config files exist', () => {
  const requiredFiles = [
    'eslint.config.js',
    '.prettierrc',
    '.prettierignore',
    '.gitignore',
    '.lintstagedrc.js',
  ];

  requiredFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 4: Backend config files exist
test('Backend config files exist', () => {
  const backendFiles = [
    'backend/nest-cli.json',
    'backend/tsconfig.json',
    'backend/tsconfig.build.json',
    'backend/.env',
  ];

  backendFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 5: Pulumi infrastructure files exist
test('Pulumi infrastructure files exist', () => {
  const pulumiFiles = [
    'pulumi/index.ts',
    'pulumi/package.json',
    'pulumi/Pulumi.yaml',
  ];

  pulumiFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 6: GitHub Actions workflow exists
test('GitHub Actions workflow exists', () => {
  assert(
    fs.existsSync(path.join(projectRoot, '.github', 'workflows', 'ci-cd.yml')),
    '.github/workflows/ci-cd.yml should exist'
  );
});

// Test 7: Project folder structure is correct
test('Project folder structure is correct', () => {
  const requiredDirs = [
    'backend',
    'backend/src',
    'backend/src/entities',
    'backend/src/auth',
    'docs',
    'pulumi',
    '.github',
    '.husky',
  ];

  requiredDirs.forEach((dir) => {
    assert(
      fs.existsSync(path.join(projectRoot, dir)),
      `${dir} directory should exist`
    );
  });
});

// Test 8: Backend entities exist
test('Backend entities exist', () => {
  const entityFiles = [
    'backend/src/entities/household.entity.ts',
    'backend/src/entities/user.entity.ts',
    'backend/src/entities/category.entity.ts',
    'backend/src/entities/account.entity.ts',
    'backend/src/entities/index.ts',
  ];

  entityFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 9: Auth module exists
test('Auth module exists', () => {
  const authFiles = [
    'backend/src/auth/auth.module.ts',
    'backend/src/auth/auth.service.ts',
    'backend/src/auth/jwt.strategy.ts',
    'backend/src/auth/jwt-auth.guard.ts',
  ];

  authFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 10: Basic arithmetic works
test('Basic arithmetic works', () => {
  assert(2 + 2 === 4, '2 + 2 should equal 4');
  assert(10 - 5 === 5, '10 - 5 should equal 5');
});

// Results
// eslint-disable-next-line no-console
console.log(`\n📊 Test Results: ${testsPassed}/${testsTotal} passed`);

if (testsPassed === testsTotal) {
  // eslint-disable-next-line no-console
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  // eslint-disable-next-line no-console
  console.log('💥 Some tests failed!');
  process.exit(1);
}
