#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Check Firebase configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔍 Checking Firebase Configuration...\n');

let allPresent = true;

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${envVar}: MISSING`);
    allPresent = false;
  }
});

console.log('\n📋 Summary:');
if (allPresent) {
  console.log('✅ All Firebase environment variables are present');
  console.log('🎉 Firebase should work correctly');
} else {
  console.log('❌ Some Firebase environment variables are missing');
  console.log('⚠️  Please check your .env.local file');
}

console.log('\n🔧 Next steps:');
console.log('1. Make sure your .env.local file exists in the project root');
console.log('2. Verify all Firebase environment variables are set');
console.log('3. Restart your development server after making changes');
console.log('4. Test authentication at /debug-auth'); 