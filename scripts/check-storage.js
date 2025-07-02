// Script to check Supabase Storage setup
const { createClient } = require('@supabase/supabase-js');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  try {
    console.log('🔍 Checking Supabase Storage setup...\n');

    // Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('talents')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // List all storage buckets
    console.log('2. Checking existing storage buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Failed to list buckets:', bucketsError.message);
      return;
    }

    console.log('📦 Found buckets:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (public: ${bucket.public})`);
    });

    // Check if our bucket exists
    const targetBucket = buckets.find(b => b.name === 'neighborhood-service-providers');
    
    if (!targetBucket) {
      console.log('\n❌ Target bucket "neighborhood-service-providers" not found');
      console.log('\n📋 To create the bucket, run this SQL in your Supabase SQL Editor:');
      console.log(`
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'neighborhood-service-providers',
  'neighborhood-service-providers',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;
      `);
    } else {
      console.log('\n✅ Target bucket "neighborhood-service-providers" exists');
      console.log(`   - Public: ${targetBucket.public}`);
      console.log(`   - File size limit: ${targetBucket.file_size_limit} bytes`);
      
      // Check bucket policies
      console.log('\n3. Checking storage policies...');
      const { data: policies, error: policiesError } = await supabase.storage
        .from('neighborhood-service-providers')
        .list('', { limit: 1 });

      if (policiesError) {
        console.log('❌ Cannot access bucket policies:', policiesError.message);
        console.log('\n📋 You need to set up storage policies. Run this SQL:');
        console.log(`
-- Create policies
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "User Update Own Files" ON storage.objects
FOR UPDATE USING (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "User Delete Own Files" ON storage.objects
FOR DELETE USING (bucket_id = 'neighborhood-service-providers');
        `);
      } else {
        console.log('✅ Bucket policies appear to be working');
      }
    }

    console.log('\n📖 Manual Setup Instructions:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project');
    console.log('3. Go to Storage > Buckets');
    console.log('4. Create a new bucket named "neighborhood-service-providers"');
    console.log('5. Set it as public with 5MB file size limit');
    console.log('6. Go to Storage > Policies and add the policies shown above');

  } catch (error) {
    console.error('❌ Error checking storage:', error);
  }
}

console.log('🚀 Supabase Storage Check Tool\n');
checkStorage(); 