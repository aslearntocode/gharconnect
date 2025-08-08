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

// Function to fix displayName references
function fixDisplayNameReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains displayName references (excluding UI component displayName properties)
    if (content.includes('user.user_metadata?.full_name || user.user_metadata?.name') || content.includes('?.displayName')) {
      console.log(`Processing: ${filePath}`);
      
      // Replace displayName references with Supabase user metadata
      const patterns = [
        // Pattern 1: user.user_metadata?.full_name || user.user_metadata?.name
        {
          regex: /user\.displayName/g,
          replacement: 'user.user_metadata?.full_name || user.user_metadata?.name'
        },
        // Pattern 2: user?.user_metadata?.full_name || user?.user_metadata?.name
        {
          regex: /user\?\.displayName/g,
          replacement: 'user?.user_metadata?.full_name || user?.user_metadata?.name'
        },
        // Pattern 3: (await supabase.auth.getUser())?.data?.user?.user_metadata?.full_name || (await supabase.auth.getUser())?.data?.user?.user_metadata?.name
        {
          regex: /await supabase\.auth\.getUser\(\)\?\.displayName/g,
          replacement: '(await supabase.auth.getUser())?.data?.user?.user_metadata?.full_name || (await supabase.auth.getUser())?.data?.user?.user_metadata?.name'
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

// Main function to fix all displayName references
function fixAllDisplayNameReferences() {
  console.log('Starting displayName to Supabase user metadata conversion...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (fixDisplayNameReferences(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nFix complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Replaced user.user_metadata?.full_name || user.user_metadata?.name with user.user_metadata?.full_name || user.user_metadata?.name');
  console.log('2. Updated user?.user_metadata?.full_name || user?.user_metadata?.name with proper null checking');
  console.log('3. Fixed supabase.auth.getUser()?.displayName references');
}

// Run the fix
if (require.main === module) {
  fixAllDisplayNameReferences();
}

module.exports = { fixAllDisplayNameReferences, fixDisplayNameReferences }; 