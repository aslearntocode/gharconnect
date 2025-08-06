#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Comprehensive Firebase Authentication Test\n');

// Test 1: Environment Variables
console.log('📋 Test 1: Environment Variables');
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let envTestPassed = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    envTestPassed = false;
  }
});

// Test 2: Server Status
console.log('\n📋 Test 2: Server Status');
const http = require('http');

function checkServer() {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/debug-auth',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      if (res.statusCode === 200) {
        console.log('  ✅ Server is running on http://localhost:3000');
        resolve(true);
      } else {
        console.log(`  ❌ Server returned status: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log('  ❌ Server is not running or not accessible');
      resolve(false);
    });

    req.on('timeout', () => {
      console.log('  ❌ Server request timed out');
      resolve(false);
    });

    req.end();
  });
}

// Test 3: Firebase Configuration Validation
console.log('\n📋 Test 3: Firebase Configuration Validation');
function validateFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };

  // Basic validation
  const isValid = Object.values(config).every(value => value && value.length > 0);
  
  if (isValid) {
    console.log('  ✅ Firebase configuration appears valid');
    console.log(`  📍 Project ID: ${config.projectId}`);
    console.log(`  🌐 Auth Domain: ${config.authDomain}`);
  } else {
    console.log('  ❌ Firebase configuration has missing values');
  }
  
  return isValid;
}

// Test 4: Browser Testing Instructions
console.log('\n📋 Test 4: Browser Testing Instructions');
function printBrowserInstructions() {
  console.log('  🔍 Manual Testing Steps:');
  console.log('    1. Open browser and go to: http://localhost:3000/debug-auth');
  console.log('    2. Open Developer Tools (F12)');
  console.log('    3. Check Console tab for Firebase initialization logs');
  console.log('    4. Click "Get Debug Info" button');
  console.log('    5. Click "Test Google Login" button');
  console.log('    6. Look for any error messages');
  console.log('');
  console.log('  🎯 Expected Results:');
  console.log('    ✅ Firebase initialized successfully');
  console.log('    ✅ No "Duplicate credential received" errors');
  console.log('    ✅ Google OAuth popup opens');
  console.log('    ✅ Authentication completes successfully');
  console.log('');
  console.log('  ⚠️  Common Issues to Check:');
  console.log('    - Browser popup blocker enabled');
  console.log('    - Incognito mode (try regular browsing mode)');
  console.log('    - Browser cache/cookies (try clearing them)');
  console.log('    - Network connectivity to Google services');
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Running Authentication Tests...\n');
  
  // Test 1: Environment Variables
  if (!envTestPassed) {
    console.log('❌ Environment variables test failed. Please check your .env.local file.');
    return;
  }
  
  // Test 2: Server Status
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ Server test failed. Please start the development server with: npm run dev');
    return;
  }
  
  // Test 3: Firebase Configuration
  const configValid = validateFirebaseConfig();
  if (!configValid) {
    console.log('❌ Firebase configuration test failed.');
    return;
  }
  
  // Test 4: Browser Instructions
  printBrowserInstructions();
  
  console.log('\n🎉 All automated tests passed!');
  console.log('📱 Now test the authentication manually in your browser.');
  console.log('🔗 Debug URL: http://localhost:3000/debug-auth');
}

// Run the tests
runAllTests().catch(console.error); 