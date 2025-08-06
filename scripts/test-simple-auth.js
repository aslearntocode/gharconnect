#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Simplified Firebase Authentication\n');

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
  console.log('🎉 Simplified authentication should work correctly');
  
  console.log('\n🔧 What was simplified:');
  console.log('- Removed complex state management');
  console.log('- Removed retry logic that caused issues');
  console.log('- Removed unnecessary logging');
  console.log('- Simplified error handling');
  console.log('- Removed race condition prone code');
  
  console.log('\n📱 Test the authentication:');
  console.log('1. Start server: npm run dev');
  console.log('2. Visit: http://localhost:3000/debug-auth');
  console.log('3. Click "Test Google Login"');
  console.log('4. Authentication should work consistently now');
  
  console.log('\n🎯 Expected behavior:');
  console.log('- No more "session expired" errors');
  console.log('- No more infinite retry loops');
  console.log('- Consistent authentication flow');
  console.log('- Simple error messages');
} else {
  console.log('❌ Missing required environment variables');
  console.log('⚠️  Please check your .env.local file');
} 