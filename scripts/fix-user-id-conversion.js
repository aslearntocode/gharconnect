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

// Function to fix Firebase UID to UUID conversion
function fixUserIdConversion(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains Firebase UID conversion code
    if (content.includes('userId.replace') || content.includes('uuidFromFirebase')) {
      console.log(`Processing: ${filePath}`);
      
      // Replace Firebase UID conversion patterns
      const patterns = [
        // Pattern 1: Full Firebase UID conversion
        {
          regex: /\/\/ Convert Firebase UID to UUID format[\s\S]*?const userId = user\.id;[\s\S]*?const uuidFromFirebase = userId\.replace\([^)]+\)\.padEnd\([^)]+\)\.substring\([^)]+\);[\s\S]*?const userId = `[^`]+`;[\s\S]*?console\.log\([^)]+\);/g,
          replacement: '// Use Supabase user ID directly\n    const userId = user.id;\n    console.log(\'User ID:\', userId);'
        },
        // Pattern 2: Simple Firebase UID conversion
        {
          regex: /const userId = user\.id;[\s\S]*?const uuidFromFirebase = userId\.replace\([^)]+\)\.padEnd\([^)]+\)\.substring\([^)]+\);[\s\S]*?const userId = `[^`]+`;/g,
          replacement: 'const userId = user.id;'
        },
        // Pattern 3: Replace userId with userId
        {
          regex: /userId/g,
          replacement: 'userId'
        },
        // Pattern 4: Replace userId with userId
        {
          regex: /userId/g,
          replacement: 'userId'
        },
        // Pattern 5: Replace Firebase UID comments
        {
          regex: /\/\/ Convert Firebase UID to UUID format/g,
          replacement: '// Use Supabase user ID directly'
        },
        // Pattern 6: Replace Firebase UID console logs
        {
          regex: /console\.log\('Firebase UID:', [^)]+\);/g,
          replacement: "console.log('User ID:', userId);"
        },
        // Pattern 7: Replace User UID logs
        {
          regex: /console\.log\('User UID:', [^)]+\);/g,
          replacement: "console.log('User ID:', userId);"
        }
      ];
      
      patterns.forEach(pattern => {
        if (content.match(pattern.regex)) {
          content = content.replace(pattern.regex, pattern.replacement);
          modified = true;
        }
      });
      
      // Add null check for user.id if not already present
      if (content.includes('user.id') && !content.includes('user && user.id')) {
        content = content.replace(/if \(user\) {/g, 'if (user && user.id) {');
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

// Main function to fix all files
function fixAllUserIdConversions() {
  console.log('Starting Firebase UID to Supabase User ID conversion fix...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (fixUserIdConversion(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nFix complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Removed Firebase UID to UUID conversion logic');
  console.log('2. Replaced with direct Supabase user ID usage');
  console.log('3. Added proper null checks for user.id');
  console.log('4. Updated console logs to reflect Supabase user ID');
}

// Run the fix
if (require.main === module) {
  fixAllUserIdConversions();
}

module.exports = { fixAllUserIdConversions, fixUserIdConversion }; 