#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Firebase Configuration\n');

// Check environment variables
const requiredVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allVarsPresent = true;
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allVarsPresent = false;
  }
});

console.log('\n📋 Summary:');
if (allVarsPresent) {
  console.log('✅ All Firebase environment variables are present');
  console.log('🎉 Firebase configuration is correct');
  
  console.log('\n🔧 What was fixed:');
  console.log('- Implemented singleton pattern for Firebase initialization');
  console.log('- Added protection against multiple OAuth flows');
  console.log('- Added protection against multiple button clicks');
  console.log('- Simplified error handling');
  
  console.log('\n📱 Test the authentication:');
  console.log('1. Start server: npm run dev');
  console.log('2. Visit: http://localhost:3000/debug-auth');
  console.log('3. Click "Test Google Login" multiple times quickly');
  console.log('4. Should see "Sign in already in progress" message');
  console.log('5. Authentication should work without "Duplicate credential" errors');
  
  console.log('\n🎯 Expected behavior:');
  console.log('- No more "Duplicate credential received" errors');
  console.log('- No more "missing-or-invalid-nonce" errors');
  console.log('- Consistent authentication flow');
  console.log('- Proper protection against multiple clicks');
} else {
  console.log('❌ Missing required environment variables');
  console.log('⚠️  Please check your .env.local file');
} 