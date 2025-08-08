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

// Function to cleanup Firebase imports
function cleanupFirebaseImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains Firebase imports
    if (content.includes('@/lib/firebase') || content.includes('firebase/auth')) {
      console.log(`Processing: ${filePath}`);
      
      // Remove Firebase imports
      const patterns = [
        // Pattern 1: Remove Firebase auth import
        {
          regex: /import\s*{\s*[^}]*}\s*from\s*['"]firebase\/auth['"];?\n?/g,
          replacement: ''
        },
        // Pattern 2: Remove Firebase lib import
        {
          regex: /import\s*{\s*[^}]*}\s*from\s*['"]@\/lib\/firebase['"];?\n?/g,
          replacement: ''
        },
        // Pattern 3: Remove standalone Firebase import
        {
          regex: /import\s+[^;]*\s+from\s*['"]@\/lib\/firebase['"];?\n?/g,
          replacement: ''
        }
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern.regex)) {
          content = content.replace(pattern.regex, pattern.replacement);
          modified = true;
        }
      });
      
      // Add Supabase import if not already present and file uses auth
      if (modified && content.includes('auth') && !content.includes('@/lib/supabase-auth')) {
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
      
      // Replace auth references with supabase
      if (content.includes('supabase.auth.')) {
        content = content.replace(/auth\./g, 'supabase.supabase.auth.');
        modified = true;
      }
      
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

// Main function to cleanup all Firebase imports
function cleanupAllFirebaseImports() {
  console.log('Starting Firebase imports cleanup...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (cleanupFirebaseImports(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nCleanup complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Removed Firebase auth imports');
  console.log('2. Removed Firebase lib imports');
  console.log('3. Added Supabase imports where needed');
  console.log('4. Replaced auth references with supabase.auth');
}

// Run the cleanup
if (require.main === module) {
  cleanupAllFirebaseImports();
}

module.exports = { cleanupAllFirebaseImports, cleanupFirebaseImports }; 