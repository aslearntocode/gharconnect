# Supabase Storage Setup Guide

## Issue
The add-service page is failing to upload images to Supabase Storage with the error: "Cannot access storage. Please check your authentication."

## Root Cause
The Supabase Storage bucket `neighborhood-service-providers` either doesn't exist or doesn't have the correct policies set up for Firebase authentication.

## Solution

### Step 1: Create the Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **Create a new bucket**
5. Enter the following details:
   - **Name**: `neighborhood-service-providers`
   - **Public bucket**: ✅ Check this
   - **File size limit**: `5MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`

### Step 2: Set Up Storage Policies

After creating the bucket, go to **Storage > Policies** and add the following policies:

#### 1. Public Read Access
```sql
-- Allow public read access to all files
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'neighborhood-service-providers');
```

#### 2. Authenticated Upload
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'neighborhood-service-providers');
```

#### 3. User Update Own Files
```sql
-- Allow users to update their own files
CREATE POLICY "User Update Own Files" ON storage.objects
FOR UPDATE USING (bucket_id = 'neighborhood-service-providers');
```

#### 4. User Delete Own Files
```sql
-- Allow users to delete their own files
CREATE POLICY "User Delete Own Files" ON storage.objects
FOR DELETE USING (bucket_id = 'neighborhood-service-providers');
```

### Step 3: Alternative Setup via SQL Editor

If the above doesn't work, you can run this SQL in the Supabase SQL Editor:

```sql
-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'neighborhood-service-providers',
  'neighborhood-service-providers',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create policies
CREATE POLICY "Public Read Access" ON storage.objects
FOR SELECT USING (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "Authenticated Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "User Update Own Files" ON storage.objects
FOR UPDATE USING (bucket_id = 'neighborhood-service-providers');

CREATE POLICY "User Delete Own Files" ON storage.objects
FOR DELETE USING (bucket_id = 'neighborhood-service-providers');
```

### Step 4: Test the Setup

1. Go to your add-service page: `/add-service`
2. Log in with Google
3. Try uploading an image
4. Check the browser console for any errors

### Step 5: Fallback Option

If storage upload still doesn't work, users can:
1. Provide image URLs instead of uploading files
2. The form will accept URLs in the "Or provide main image URL" field
3. Additional images can also be provided as URLs

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Make sure the bucket name is exactly `neighborhood-service-providers`
   - Check that the bucket is created in the correct project

2. **"Permission denied" error**
   - Verify that the storage policies are set up correctly
   - Check that the user is properly authenticated

3. **"Authentication failed" error**
   - Ensure Firebase authentication is working
   - Check that the user is logged in

### Debug Steps

1. Open browser console
2. Click the "Debug Auth" button on the add-service page
3. Check the console output for detailed error information
4. Look for Firebase token and Supabase client creation logs

### Manual Testing

You can test the storage setup manually:

1. Go to Supabase Dashboard > Storage
2. Navigate to the `neighborhood-service-providers` bucket
3. Try uploading a test file manually
4. Check if the file appears in the bucket

## Environment Variables

Make sure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

After setting up storage:

1. Test the add-service page
2. Verify that images upload successfully
3. Check that uploaded images appear in the Supabase Storage bucket
4. Test the neighborhood talent pages to ensure images display correctly

If you continue to have issues, consider:
- Using image URLs as a fallback
- Checking Supabase logs for more detailed error information
- Verifying Firebase authentication is working correctly 