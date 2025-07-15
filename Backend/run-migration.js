#!/usr/bin/env node

// Migration runner script for Playmate application
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Playmate Database Migration Runner');
console.log('=====================================\n');

// Check if Node.js dependencies are installed
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('📦 Checking dependencies...');
  try {
    execSync('npm ls mongoose', { stdio: 'ignore' });
    console.log('✅ Dependencies are installed\n');
  } catch (error) {
    console.log('⚠️  Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed\n');
  }
} else {
  console.log('❌ package.json not found. Please run this script from the Backend directory.');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env file not found. Using default MongoDB connection.');
} else {
  console.log('✅ .env file found\n');
}

// Run the migration
console.log('🏃 Running database migrations...\n');
try {
  execSync('node migrate.js', { stdio: 'inherit' });
  console.log('\n✅ Migration completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
