// Script to set up admin users in the database
// Run this script after creating a Firebase user account

const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  // Replace these with actual values
  const adminUserId = 'YOUR_FIREBASE_USER_ID'; // Get this from Firebase Auth
  const adminEmail = 'admin@gharconnect.com';
  const adminName = 'Admin User';
  const adminRole = 'super_admin'; // or 'admin'

  try {
    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          user_id: adminUserId,
          email: adminEmail,
          name: adminName,
          role: adminRole,
          is_active: true
        }
      ])
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }

    console.log('Admin user created successfully:', data);
    console.log('You can now login to /admin with your Firebase credentials');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Instructions for usage:
console.log(`
To set up an admin user:

1. Create a Firebase user account through Firebase Console or your app
2. Get the user ID from Firebase Auth
3. Update the variables in this script:
   - adminUserId: Your Firebase user ID
   - adminEmail: Your admin email
   - adminName: Your admin name
   - adminRole: 'super_admin' or 'admin'

4. Set your environment variables:
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

5. Run this script:
   node scripts/setup-admin.js

6. Login to /admin/login with your Firebase credentials
`);

// Uncomment the line below to run the setup
// setupAdmin(); 