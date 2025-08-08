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

// Function to standardize Supabase client usage
function standardizeSupabaseClient(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file contains createClientComponentClient
    if (content.includes('createClientComponentClient')) {
      console.log(`Processing: ${filePath}`);
      
      // Remove createClientComponentClient import
      content = content.replace(
        /import\s*{\s*createClientComponentClient\s*}\s*from\s*['"]@supabase\/auth-helpers-nextjs['"];?\n?/g,
        ''
      );
      
      // Remove createClientComponentClient usage
      content = content.replace(
        /const\s+supabase\s*=\s*createClientComponentClient\(\)/g,
        ''
      );
      
      // Add centralized supabase import if not already present
      if (!content.includes('@/lib/supabase-auth')) {
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
      
      modified = true;
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

// Main function to standardize all Supabase client usage
function standardizeAllSupabaseClients() {
  console.log('Starting Supabase client standardization...');
  
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (standardizeSupabaseClient(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nStandardization complete! Updated ${updatedCount} files.`);
  console.log('\nChanges made:');
  console.log('1. Removed createClientComponentClient imports');
  console.log('2. Removed createClientComponentClient usage');
  console.log('3. Added centralized supabase import from @/lib/supabase-auth');
}

// Run the standardization
if (require.main === module) {
  standardizeAllSupabaseClients();
}

module.exports = { standardizeAllSupabaseClients, standardizeSupabaseClient }; 