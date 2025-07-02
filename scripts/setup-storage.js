// Script to set up Supabase Storage bucket for Home Service Providers
// Run this script to create the storage bucket and set up proper permissions

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage...');

    // Create the storage bucket
    const { data: bucketData, error: bucketError } = await supabase.storage
      .createBucket('home-service-providers', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880, // 5MB
      });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('Storage bucket already exists');
      } else {
        console.error('Error creating storage bucket:', bucketError);
        return;
      }
    } else {
      console.log('Storage bucket created successfully');
    }

    // Set up storage policies
    console.log('Setting up storage policies...');

    // Allow public read access to all files
    const { error: readPolicyError } = await supabase.storage
      .from('home-service-providers')
      .createPolicy('Public Read Access', {
        name: 'Public Read Access',
        definition: {
          role: 'anon',
          operation: 'select',
        },
      });

    if (readPolicyError) {
      if (readPolicyError.message.includes('already exists')) {
        console.log('Read policy already exists');
      } else {
        console.error('Error creating read policy:', readPolicyError);
      }
    } else {
      console.log('Read policy created successfully');
    }

    // Allow authenticated users to upload files
    const { error: uploadPolicyError } = await supabase.storage
      .from('home-service-providers')
      .createPolicy('Authenticated Upload', {
        name: 'Authenticated Upload',
        definition: {
          role: 'authenticated',
          operation: 'insert',
        },
      });

    if (uploadPolicyError) {
      if (uploadPolicyError.message.includes('already exists')) {
        console.log('Upload policy already exists');
      } else {
        console.error('Error creating upload policy:', uploadPolicyError);
      }
    } else {
      console.log('Upload policy created successfully');
    }

    // Allow users to update their own files
    const { error: updatePolicyError } = await supabase.storage
      .from('home-service-providers')
      .createPolicy('User Update Own Files', {
        name: 'User Update Own Files',
        definition: {
          role: 'authenticated',
          operation: 'update',
        },
      });

    if (updatePolicyError) {
      if (updatePolicyError.message.includes('already exists')) {
        console.log('Update policy already exists');
      } else {
        console.error('Error creating update policy:', updatePolicyError);
      }
    } else {
      console.log('Update policy created successfully');
    }

    // Allow users to delete their own files
    const { error: deletePolicyError } = await supabase.storage
      .from('home-service-providers')
      .createPolicy('User Delete Own Files', {
        name: 'User Delete Own Files',
        definition: {
          role: 'authenticated',
          operation: 'delete',
        },
      });

    if (deletePolicyError) {
      if (deletePolicyError.message.includes('already exists')) {
        console.log('Delete policy already exists');
      } else {
        console.error('Error creating delete policy:', deletePolicyError);
      }
    } else {
      console.log('Delete policy created successfully');
    }

    console.log('Storage setup completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure your Firebase authentication is properly configured');
    console.log('2. Test the add-service page to ensure uploads work');
    console.log('3. Check that the talents table has the user_id field');

  } catch (error) {
    console.error('Error setting up storage:', error);
  }
}

// Instructions for usage:
console.log(`
To set up Supabase Storage:

1. Set your environment variables:
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

2. Run this script:
   node scripts/setup-storage.js

3. The script will:
   - Create the 'home-service-providers' storage bucket
   - Set up public read access
   - Set up authenticated upload/update/delete policies
   - Configure file size and type restrictions

4. After running this script, test the add-service page
`);

setupStorage(); 