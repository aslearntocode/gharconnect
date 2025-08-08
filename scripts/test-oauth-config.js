#!/usr/bin/env node

/**
 * Test OAuth Configuration Script
 * 
 * This script helps verify that the OAuth configuration is set up correctly
 * for both development and production environments.
 */

const https = require('https');
const http = require('http');

console.log('🔍 OAuth Configuration Test');
console.log('============================\n');

// Test URLs
const testUrls = [
  'https://gharconnect.in',
  'https://www.gharconnect.in',
  'http://localhost:3000'
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const testPath = '/auth/callback';
    
    const req = client.request(url + testPath, { method: 'HEAD' }, (res) => {
      resolve({
        url: url + testPath,
        status: res.statusCode,
        accessible: res.statusCode < 400
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url + testPath,
        status: 'ERROR',
        accessible: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url: url + testPath,
        status: 'TIMEOUT',
        accessible: false,
        error: 'Request timeout'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('Testing OAuth callback endpoints...\n');
  
  for (const url of testUrls) {
    const result = await testUrl(url);
    const status = result.accessible ? '✅' : '❌';
    console.log(`${status} ${result.url} - ${result.status}${result.error ? ` (${result.error})` : ''}`);
  }
  
  console.log('\n📋 Configuration Checklist:');
  console.log('==========================');
  console.log('1. ✅ Code changes applied');
  console.log('2. ⏳ Supabase redirect URLs configured');
  console.log('3. ⏳ Google OAuth redirect URIs configured');
  console.log('4. ⏳ Environment variables set');
  console.log('5. ⏳ Production deployment completed');
  
  console.log('\n🔧 Next Steps:');
  console.log('==============');
  console.log('1. Configure Supabase Dashboard:');
  console.log('   - Go to Authentication → URL Configuration');
  console.log('   - Add: https://gharconnect.in/auth/callback');
  console.log('   - Add: https://www.gharconnect.in/auth/callback');
  console.log('   - Add: http://localhost:3000/auth/callback');
  
  console.log('\n2. Configure Google Cloud Console:');
  console.log('   - Go to APIs & Services → Credentials');
  console.log('   - Find your OAuth 2.0 Client ID');
  console.log('   - Add authorized redirect URIs:');
  console.log('     * https://your-project-ref.supabase.co/auth/v1/callback');
  console.log('     * https://gharconnect.in/auth/callback');
  console.log('     * https://www.gharconnect.in/auth/callback');
  console.log('     * http://localhost:3000/auth/callback');
  
  console.log('\n3. Deploy and test:');
  console.log('   - Deploy the updated code');
  console.log('   - Test login at: https://gharconnect.in/mumbai/community/login');
  console.log('   - Verify redirect back to gharconnect.in');
  
  console.log('\n4. Debug if needed:');
  console.log('   - Visit: https://gharconnect.in/debug-oauth');
  console.log('   - Check browser console for errors');
  console.log('   - Review Supabase authentication logs');
}

runTests().catch(console.error); 