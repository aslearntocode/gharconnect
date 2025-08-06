#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Firebase Authentication Configuration...\n');

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

console.log('\n📋 Configuration Summary:');
if (allVarsPresent) {
  console.log('✅ All required environment variables are present');
  console.log('🎉 Firebase configuration looks correct');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Visit http://localhost:3000/debug-auth');
  console.log('3. Click "Test Google Login" to test authentication');
  console.log('4. Check browser console for any errors');
  
  console.log('\n⚠️  Common Issues:');
  console.log('- Make sure localhost is in Firebase Console authorized domains');
  console.log('- Clear browser cache and cookies if authentication fails');
  console.log('- Check if popups are blocked in browser');
  console.log('- Ensure Google OAuth is enabled in Firebase Console');
} else {
  console.log('❌ Missing required environment variables');
  console.log('⚠️  Please check your .env.local file');
}

console.log('\n🔍 Debugging Tips:');
console.log('- Open browser developer tools (F12)');
console.log('- Check Console tab for error messages');
console.log('- Check Network tab for failed requests');
console.log('- Try incognito/private browsing mode'); 