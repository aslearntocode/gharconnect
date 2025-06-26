# Supabase Storage Setup Guide

## Fix for "row-level security policy" Error

The error you're encountering is due to missing or incorrect Row Level Security (RLS) policies for your Supabase storage bucket. Follow these steps to fix it:

## 1. Supabase Dashboard Setup

### Step 1: Go to Storage in Supabase Dashboard
1. Open your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on **Buckets**

### Step 2: Create or Configure the Bucket
1. If the `product-images` bucket doesn't exist, create it:
   - Click **"New bucket"**
   - Name: `product-images`
   - **Public bucket**: ✅ Enable this
   - **File size limit**: 10MB (or higher)
   - **Allowed MIME types**: `image/*`

2. If the bucket exists, click on it and go to **Settings**:
   - Ensure **Public bucket** is enabled
   - Set **File size limit** to 10MB or higher
   - Add `image/*` to **Allowed MIME types**

### Step 3: Set Up RLS Policies

#### Policy 1: Allow Authenticated Users to Upload
1. Go to **Storage** → **Policies**
2. Find your `product-images` bucket
3. Click **"New Policy"**
4. Choose **"Create a policy from scratch"**
5. Configure:
   - **Policy name**: `Allow authenticated uploads`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images'::text)
   ```
6. Click **"Review"** and **"Save policy"**

#### Policy 2: Allow Public Read Access
1. Click **"New Policy"** again
2. Choose **"Create a policy from scratch"**
3. Configure:
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `*` (public)
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images'::text)
   ```
4. Click **"Review"** and **"Save policy"**

#### Policy 3: Allow Users to Delete Their Own Files
1. Click **"New Policy"** again
2. Choose **"Create a policy from scratch"**
3. Configure:
   - **Policy name**: `Allow users to delete own files`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **Policy definition**:
   ```sql
   (bucket_id = 'product-images'::text) AND (auth.uid()::text = (storage.foldername(name))[1])
   ```
4. Click **"Review"** and **"Save policy"**

## 2. Alternative: Disable RLS (Quick Fix)

If you want a quick fix for testing:

1. Go to **Storage** → **Buckets**
2. Click on your `product-images` bucket
3. Go to **Settings**
4. **Disable Row Level Security** (toggle off)
5. Click **"Save"**

⚠️ **Warning**: This disables all security for the bucket. Only use for testing.

## 3. Verify Setup

After setting up the policies:

1. Try uploading an image through your marketplace
2. Check the browser console for any remaining errors
3. Verify the image appears in your Supabase storage bucket
4. Confirm the image displays correctly on the marketplace page

## 4. Troubleshooting

### If you still get RLS errors:

1. **Check Authentication**: Ensure the user is properly logged in
2. **Verify Bucket Name**: Make sure the bucket name in your code matches exactly
3. **Check Policy Syntax**: Ensure the SQL policies are correctly formatted
4. **Clear Browser Cache**: Sometimes cached authentication can cause issues

### Common Issues:

- **"bucket not found"**: Check if the bucket name is correct
- **"permission denied"**: Ensure RLS policies are properly configured
- **"authentication required"**: Make sure the user is logged in before uploading

## 5. Security Best Practices

For production:

1. **Keep RLS enabled** with proper policies
2. **Limit file types** to only images
3. **Set reasonable file size limits**
4. **Use user-specific folders** (which the code already does)
5. **Regularly audit** storage usage and policies

## 6. Code Verification

The updated code now includes:
- ✅ Proper authentication checks
- ✅ Better error handling for RLS issues
- ✅ Explicit session management
- ✅ Detailed error logging

If you follow these steps, the image upload should work correctly! 