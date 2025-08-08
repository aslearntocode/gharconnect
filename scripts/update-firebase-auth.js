#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need to be updated (based on the grep search results)
const filesToUpdate = [
  'components/Marketplace.tsx',
  'components/Poll.tsx',
  'components/RentalHeader.tsx',
  'components/DoctorCard.tsx',
  'components/VendorHeader.tsx',
  'components/DomesticHelpPage.tsx',
  'app/vendor/page.tsx',
  'app/pune/list-apartment/page.tsx',
  'app/pune/community/connect/[postId]/page.tsx',
  'app/pune/community/page.tsx',
  'app/debug-auth/page.tsx',
  'app/pune/community/connect/page.tsx',
  'app/apply-for-rent/[id]/page.tsx',
  'app/admin/page.tsx',
  'app/admin/login/page.tsx',
  'app/delhi/list-apartment/page.tsx',
  'app/chennai/list-apartment/page.tsx',
  'app/hyderabad/list-apartment/page.tsx',
  'app/parel/rent-apartment/page.tsx',
  'app/bangalore/list-apartment/page.tsx',
  'app/bangalore/community/connect/page.tsx',
  'app/bangalore/community/page.tsx',
  'app/parel/list-apartment/page.tsx',
  'app/mumbai/community/my-posts/page.tsx',
  'app/mumbai/community/my-reviews/page.tsx',
  'app/mumbai/community/connect/[postId]/page.tsx',
  'app/mumbai/community/connect/page.tsx',
  'app/mumbai/community/my-comments/page.tsx',
  'app/mumbai/community/apply-for-rent/[id]/page.tsx',
  'app/mumbai/community/marketplace/sell/page.tsx',
  'app/mumbai/list-apartment/page.tsx'
];

console.log('Files that need to be updated to use the new Firebase Auth utility:');
filesToUpdate.forEach(file => {
  console.log(`- ${file}`);
});

console.log('\nTo update each file, you need to:');
console.log('1. Add import: import { initializeFirebaseAuth } from \'@/lib/authUtils\'
import { supabase } from '@/lib/supabase-auth'');
console.log('2. Replace: supabase.auth.onAuthStateChange( with: initializeFirebaseAuth(');
console.log('\nThe Header.tsx, AuthContext.tsx, and mumbai/community/page.tsx have already been updated.'); 