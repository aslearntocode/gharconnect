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

// Function to fix getUser patterns
function fixGetUserPatterns(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains incorrect getUser patterns
    if (content.includes('await supabase.auth.getUser()') && 
        (content.includes('const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()') ||
         content.includes('const { data: { user }, error: userError } = await supabase.auth.getUser()') ||
         content.includes('const { data: { user } } = await supabase.auth.getUser(); if (!user)'))) {
      console.log(`Processing: ${filePath}`);
      
      // Fix the getUser patterns
      const patterns = [
        // Pattern 1: const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
        {
          regex: /const\s+currentUser\s*=\s*await\s+supabase\.auth\.getUser\(\)/g,
          replacement: 'const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()'
        },
        // Pattern 2: const { data: { user }, error: userError } = await supabase.auth.getUser()
        {
          regex: /const\s+user\s*=\s*await\s+supabase\.auth\.getUser\(\)/g,
          replacement: 'const { data: { user }, error: userError } = await supabase.auth.getUser()'
        },
        // Pattern 3: const { data: { user } } = await supabase.auth.getUser(); if (!user)
        {
          regex: /if\s*\(\s*!await\s+supabase\.auth\.getUser\(\)\s*\)/g,
          replacement: 'const { data: { user } } = await supabase.auth.getUser(); if (!user)'
        }
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern.regex)) {
          content = content.replace(pattern.regex, pattern.replacement);
          modified = true;
        }
      });
      
      // Fix the null checks
      if (content.includes('if (userError || !currentUser)')) {
        content = content.replace(/if\s*\(\s*!currentUser\s*\)/g, 'if (userError || !currentUser)');
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

// Main function to fix all getUser patterns
function fixAllGetUserPatterns() {
  console.log('Starting getUser pattern fix...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (fixGetUserPatterns(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nFix complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Fixed const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser() → proper destructuring');
  console.log('2. Fixed const { data: { user }, error: userError } = await supabase.auth.getUser() → proper destructuring');
  console.log('3. Fixed const { data: { user } } = await supabase.auth.getUser(); if (!user) → proper destructuring');
  console.log('4. Updated null checks to include error handling');
}

// Run the fix
if (require.main === module) {
  fixAllGetUserPatterns();
}

module.exports = { fixAllGetUserPatterns, fixGetUserPatterns }; 