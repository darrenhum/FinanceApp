#!/usr/bin/env node

/**
 * Basic test runner for FinanceApp
 * This is a simple test suite until we implement proper testing with Jest
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');

// eslint-disable-next-line no-console
console.log('🧪 Running FinanceApp Tests...\n');

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

// Test 1: Check if main entry point exists
test('Main entry point exists', () => {
  assert(
    fs.existsSync(path.join(projectRoot, 'src', 'index.js')),
    'src/index.js should exist'
  );
});

// Test 2: Check if package.json is valid
test('Package.json is valid', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
  );
  assert(
    packageJson.name === 'financeapp',
    'Package name should be financeapp'
  );
  assert(packageJson.version, 'Package should have a version');
  assert(packageJson.scripts, 'Package should have scripts');
});

// Test 3: Check if required config files exist
test('Required config files exist', () => {
  const requiredFiles = [
    'eslint.config.js',
    '.prettierrc',
    '.gitignore',
    'DESIGN.md',
    'README.md',
  ];

  requiredFiles.forEach((file) => {
    assert(fs.existsSync(path.join(projectRoot, file)), `${file} should exist`);
  });
});

// Test 4: Check if Pulumi infrastructure files exist
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

// Test 5: Check if GitHub Actions workflow exists
test('GitHub Actions workflow exists', () => {
  assert(
    fs.existsSync(path.join(projectRoot, '.github/workflows/ci-cd.yml')),
    'CI/CD workflow should exist'
  );
});

// Test 6: Check project folder structure
test('Project folder structure is correct', () => {
  const expectedFolders = ['src', 'src/test', 'pulumi', '.github/workflows'];

  expectedFolders.forEach((folder) => {
    assert(
      fs.existsSync(path.join(projectRoot, folder)),
      `${folder} directory should exist`
    );
  });

  // Verify test file is in correct location
  assert(
    fs.existsSync(path.join(projectRoot, 'src/test/test.js')),
    'Test file should be in src/test directory'
  );
});

// Test 7: Simple arithmetic test (placeholder for future unit tests)
test('Basic arithmetic works', () => {
  assert(2 + 2 === 4, '2 + 2 should equal 4');
  assert(10 - 5 === 5, '10 - 5 should equal 5');
});

// Test Results
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
