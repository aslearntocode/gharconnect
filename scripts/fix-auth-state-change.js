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

// Function to fix auth state change usage
function fixAuthStateChange(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains old Firebase pattern onAuthStateChange
    if (content.includes('onAuthStateChange((user: User | null)') || 
        content.includes('onAuthStateChange(async (user: User | null)')) {
      console.log(`Processing: ${filePath}`);
      
      // Fix the onAuthStateChange pattern
      const patterns = [
        // Pattern 1: const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
        {
          regex: /const\s+unsubscribe\s*=\s*supabase\.auth\.onAuthStateChange\(\s*\(\s*user:\s*User\s*\|\s*null\s*\)\s*=>\s*\{/g,
          replacement: 'const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {\n      const user = session?.user || null;'
        },
        // Pattern 2: const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null;
        {
          regex: /const\s+unsubscribe\s*=\s*supabase\.auth\.onAuthStateChange\(\s*async\s*\(\s*user:\s*User\s*\|\s*null\s*\)\s*=>\s*\{/g,
          replacement: 'const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {\n      const user = session?.user || null;'
        },
        // Pattern 3: const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => setUser(session?.user || null));
        {
          regex: /const\s+unsubscribe\s*=\s*supabase\.auth\.onAuthStateChange\(\s*\(\s*user:\s*User\s*\|\s*null\s*\)\s*=>\s*setUser\(user\)\)/g,
          replacement: 'const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => setUser(session?.user || null))'
        }
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern.regex)) {
          content = content.replace(pattern.regex, pattern.replacement);
          modified = true;
        }
      });
      
      // Fix the return statement
      if (content.includes('return () => subscription.unsubscribe()')) {
        content = content.replace(/return\s*\(\s*\)\s*=>\s*unsubscribe\(\)/g, 'return () => subscription.unsubscribe()');
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

// Main function to fix all auth state change usage
function fixAllAuthStateChange() {
  console.log('Starting auth state change pattern fix...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (fixAuthStateChange(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nFix complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Fixed onAuthStateChange to use (event, session) pattern');
  console.log('2. Added const user = session?.user || null;');
  console.log('3. Fixed return statement to use subscription.unsubscribe()');
}

// Run the fix
if (require.main === module) {
  fixAllAuthStateChange();
}

module.exports = { fixAllAuthStateChange, fixAuthStateChange }; 