const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Function to update Firebase auth imports to Supabase
function updateFirebaseImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace Firebase auth imports
    if (content.includes("from 'firebase/auth'")) {
      // Replace User import
      content = content.replace(
        /import\s*{\s*User\s*}\s*from\s*['"]firebase\/auth['"]/g,
        "import { User } from '@supabase/supabase-js'"
      );
      
      // Replace other Firebase auth imports
      content = content.replace(
        /import\s*{\s*([^}]+)\s*}\s*from\s*['"]firebase\/auth['"]/g,
        (match, imports) => {
          const importList = imports.split(',').map(imp => imp.trim());
          const supabaseImports = [];
          const firebaseImports = [];
          
          importList.forEach(imp => {
            if (imp === 'User') {
              supabaseImports.push(imp);
            } else {
              firebaseImports.push(imp);
            }
          });
          
          let result = '';
          if (supabaseImports.length > 0) {
            result += `import { ${supabaseImports.join(', ')} } from '@supabase/supabase-js'`;
          }
          if (firebaseImports.length > 0) {
            if (result) result += '\n';
            result += `// TODO: Replace Firebase auth functions: ${firebaseImports.join(', ')}`;
          }
          
          return result;
        }
      );
      
      modified = true;
    }
    
    // Replace Firebase auth function calls
    if (content.includes('await supabase.auth.getUser()')) {
      content = content.replace(/auth\.currentUser/g, 'await supabase.auth.getUser()');
      modified = true;
    }
    
    if (content.includes('.id')) {
      content = content.replace(/\.id/g, '.id');
      modified = true;
    }
    
    if (content.includes('supabase.auth.onAuthStateChanged')) {
      content = content.replace(
        /auth\.onAuthStateChanged\(/g,
        'supabase.auth.onAuthStateChange('
      );
      modified = true;
    }
    
    if (content.includes('supabase.auth.signOut()')) {
      content = content.replace(/signOut\(auth\)/g, 'supabase.auth.signOut()');
      modified = true;
    }
    
    // Add supabase import if needed
    if (modified && !content.includes("from '@/lib/supabase-auth'") && !content.includes("from './supabase-auth'")) {
      const importMatch = content.match(/import.*from.*['"]@\/lib\/[^'"]*['"]/);
      if (importMatch) {
        content = content.replace(
          importMatch[0],
          `${importMatch[0]}\nimport { supabase } from '@/lib/supabase-auth'`
        );
      } else {
        // Add at the top if no other lib imports
        const lines = content.split('\n');
        let insertIndex = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import')) {
            insertIndex = i + 1;
          } else if (lines[i].trim() && !lines[i].startsWith('//') && !lines[i].startsWith('/*')) {
            break;
          }
        }
        lines.splice(insertIndex, 0, "import { supabase } from '@/lib/supabase-auth'");
        content = lines.join('\n');
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main migration function
function migrateToSupabaseAuth() {
  console.log('Starting Firebase to Supabase auth migration...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (updateFirebaseImports(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nMigration complete! Updated ${updatedCount} files.`);
  console.log('\nNext steps:');
  console.log('1. Review the changes and test the application');
  console.log('2. Update any remaining Firebase-specific code');
  console.log('3. Test authentication flows');
  console.log('4. Remove Firebase dependencies if no longer needed');
}

// Run the migration
if (require.main === module) {
  migrateToSupabaseAuth();
}

module.exports = { migrateToSupabaseAuth, updateFirebaseImports }; 