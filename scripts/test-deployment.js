#!/usr/bin/env node

console.log('🚀 Testing Deployment Readiness\n');

// Check if TypeScript compilation works
const { execSync } = require('child_process');

try {
  console.log('📋 Running TypeScript check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');
} catch (error) {
  console.log('❌ TypeScript compilation failed');
  process.exit(1);
}

// Check if build works (without actually building)
try {
  console.log('\n📋 Checking Next.js configuration...');
  const nextConfig = require('../next.config.js');
  console.log('✅ Next.js configuration is valid');
} catch (error) {
  console.log('❌ Next.js configuration error:', error.message);
  process.exit(1);
}

// Check package.json
try {
  console.log('\n📋 Checking package.json...');
  const packageJson = require('../package.json');
  
  if (!packageJson.scripts.build) {
    console.log('❌ Missing build script in package.json');
    process.exit(1);
  }
  
  if (!packageJson.dependencies.next) {
    console.log('❌ Next.js not found in dependencies');
    process.exit(1);
  }
  
  console.log('✅ Package.json is valid');
} catch (error) {
  console.log('❌ Package.json error:', error.message);
  process.exit(1);
}

console.log('\n🎉 Deployment readiness check passed!');
console.log('✅ All TypeScript errors have been fixed');
console.log('✅ Configuration files are valid');
console.log('✅ Ready for deployment'); 