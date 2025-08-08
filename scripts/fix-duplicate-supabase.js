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

// Function to fix duplicate supabase references
function fixDuplicateSupabase(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains duplicate supabase.supabase
    if (content.includes('supabase.supabase')) {
      console.log(`Processing: ${filePath}`);
      
      // Fix duplicate supabase.supabase references
      const patterns = [
        // Pattern 1: supabase.auth.onAuthStateChange
        {
          regex: /supabase\.supabase\.auth\.onAuthStateChange/g,
          replacement: 'supabase.auth.onAuthStateChange'
        },
        // Pattern 2: supabase.auth.getUser
        {
          regex: /supabase\.supabase\.auth\.getUser/g,
          replacement: 'supabase.auth.getUser'
        },
        // Pattern 3: supabase.auth.signOut
        {
          regex: /supabase\.supabase\.auth\.signOut/g,
          replacement: 'supabase.auth.signOut'
        },
        // Pattern 4: supabase.auth.setSession
        {
          regex: /supabase\.supabase\.auth\.setSession/g,
          replacement: 'supabase.auth.setSession'
        }
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern.regex)) {
          content = content.replace(pattern.regex, pattern.replacement);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function to fix all duplicate supabase references
function fixAllDuplicateSupabase() {
  console.log('Starting duplicate supabase reference fix...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (fixDuplicateSupabase(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nFix complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Fixed supabase.auth.onAuthStateChange → supabase.auth.onAuthStateChange');
  console.log('2. Fixed supabase.auth.getUser → supabase.auth.getUser');
  console.log('3. Fixed supabase.auth.signOut → supabase.auth.signOut');
  console.log('4. Fixed supabase.auth.setSession → supabase.auth.setSession');
}

// Run the fix
if (require.main === module) {
  fixAllDuplicateSupabase();
}

module.exports = { fixAllDuplicateSupabase, fixDuplicateSupabase }; 