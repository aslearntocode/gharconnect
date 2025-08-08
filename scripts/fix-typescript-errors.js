import { supabase } from '@/lib/supabase-auth'
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing TypeScript errors for onAuthStateChanged...\n');

// Files that need the User import and typing fix
const filesToFix = [
  'components/AuthWrapper.tsx',
  'components/Poll.tsx',
  'components/Header.tsx',
  'components/VendorCard.tsx',
  'components/RentalHeader.tsx',
  'components/DoctorCard.tsx',
  'components/VendorHeader.tsx',
  'components/DomesticHelpPage.tsx',
  'app/vendor/page.tsx',
  'app/pune/list-apartment/page.tsx',
  'app/pune/community/connect/[postId]/page.tsx',
  'app/debug-auth/page.tsx',
  'app/pune/community/page.tsx',
  'app/pune/community/connect/page.tsx',
  'app/apply-for-rent/[id]/page.tsx',
  'app/admin/page.tsx',
  'app/delhi/list-apartment/page.tsx',
  'app/chennai/list-apartment/page.tsx',
  'app/hyderabad/list-apartment/page.tsx',
  'app/parel/list-apartment/page.tsx',
  'app/mumbai/community/page.tsx',
  'app/mumbai/community/my-reviews/page.tsx',
  'app/mumbai/community/connect/[postId]/page.tsx',
  'app/mumbai/community/connect/page.tsx',
  'app/mumbai/community/profile/page.tsx',
  'app/mumbai/community/my-comments/page.tsx',
  'app/mumbai/community/apply-for-rent/[id]/page.tsx',
  'app/mumbai/community/my-posts/page.tsx',
  'app/mumbai/community/marketplace/sell/page.tsx',
  'app/mumbai/list-apartment/page.tsx',
  'app/parel/rent-apartment/page.tsx',
  'app/bangalore/list-apartment/page.tsx',
  'app/bangalore/community/page.tsx',
  'app/bangalore/community/connect/[postId]/page.tsx',
  'app/bangalore/community/connect/page.tsx',
  'context/AuthContext.tsx'
];

function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if User import is needed
    const needsUserImport = content.includes('onAuthStateChanged') && 
                           !content.includes('import.*User.*from.*firebase/auth') &&
                           !content.includes('import.*{.*User.*}.*from.*firebase/auth');

    // Add User import if needed
    if (needsUserImport) {
      // Find the firebase/auth import line
      const firebaseAuthImportRegex = /import\s+{([^}]*)}\s+from\s+['"]firebase\/auth['"]/;
      const match = content.match(firebaseAuthImportRegex);
      
      if (match) {
        // Add User to existing import
        const imports = match[1].split(',').map(imp => imp.trim());
        if (!imports.includes('User')) {
          imports.push('User');
          const newImport = `import { ${imports.join(', ')} } from 'firebase/auth'`;
          content = content.replace(firebaseAuthImportRegex, newImport);
          modified = true;
        }
      } else {
        // Add new import line
        const importLine = "import { User } from '@supabase/supabase-js';";
        const lines = content.split('\n');
        let inserted = false;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('import') && lines[i].includes('firebase/auth')) {
            lines.splice(i + 1, 0, importLine);
            inserted = true;
            break;
          }
        }
        
        if (!inserted) {
          // Add after the first import
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('import')) {
              lines.splice(i + 1, 0, importLine);
              break;
            }
          }
        }
        
        content = lines.join('\n');
        modified = true;
      }
    }

    // Fix onAuthStateChanged user parameter typing
    const onAuthStateChangedRegex = /onAuthStateChanged\(\s*\(user\)\s*=>/g;
    if (onAuthStateChangedRegex.test(content)) {
      content = content.replace(onAuthStateChangedRegex, 'onAuthStateChanged((user: User | null) =>');
      modified = true;
    }

    // Fix async onAuthStateChanged user parameter typing
    const asyncOnAuthStateChangedRegex = /onAuthStateChanged\(\s*async\s*\(user\)\s*=>/g;
    if (asyncOnAuthStateChangedRegex.test(content)) {
      content = content.replace(asyncOnAuthStateChangedRegex, 'onAuthStateChanged(async (user: User | null) =>');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

let fixedCount = 0;
let totalFiles = filesToFix.length;

filesToFix.forEach(file => {
  if (fixFile(file)) {
    fixedCount++;
  }
});

console.log(`\n📋 Summary:`);
console.log(`✅ Fixed ${fixedCount} out of ${totalFiles} files`);
console.log(`🎉 TypeScript errors should be resolved!`); 