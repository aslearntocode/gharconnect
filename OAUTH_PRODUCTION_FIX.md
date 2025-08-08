# OAuth Production Redirect Fix

## Problem
Users trying to login on gharconnect.in are being redirected to localhost instead of the production domain.

## Root Cause
The OAuth configuration was not properly set up for production environments, causing redirects to default to localhost.

## Solution

### 1. Code Changes Made

#### Updated `lib/supabase-auth.ts`
- Added proper `redirectTo` parameter to OAuth call
- Uses `window.location.origin` to determine the correct domain
- Falls back to production URL for server-side rendering

#### Updated `app/auth/callback/page.tsx`
- Added domain detection logic
- Uses `window.location.href` for production redirects
- Uses Next.js router for development redirects

### 2. Supabase Configuration

#### Required Redirect URLs in Supabase Dashboard
Go to your Supabase project dashboard → Authentication → URL Configuration and add:

```
https://gharconnect.in/auth/callback
https://www.gharconnect.in/auth/callback
http://localhost:3000/auth/callback (for development)
```

### 3. Google OAuth Configuration

#### Required Redirect URIs in Google Cloud Console
Go to Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs and add these Authorized redirect URIs:

```
https://your-project-ref.supabase.co/auth/v1/callback
https://gharconnect.in/auth/callback
https://www.gharconnect.in/auth/callback
http://localhost:3000/auth/callback (for development)
```

Replace `your-project-ref` with your actual Supabase project reference.

### 4. Environment Variables

Ensure these environment variables are set in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Testing

#### Test in Development
1. Run `npm run dev`
2. Go to `http://localhost:3000/mumbai/community/login`
3. Click "Sign in with Google"
4. Verify redirect back to localhost

#### Test in Production
1. Deploy the changes
2. Go to `https://gharconnect.in/mumbai/community/login`
3. Click "Sign in with Google"
4. Verify redirect back to gharconnect.in

### 6. Debug Page

Use the debug page to verify configuration:
- Development: `http://localhost:3000/debug-oauth`
- Production: `https://gharconnect.in/debug-oauth`

This page shows:
- Current OAuth configuration
- Required redirect URIs
- Test OAuth flow functionality

## Verification Steps

1. **Check Supabase Dashboard**: Verify redirect URLs are configured
2. **Check Google Console**: Verify authorized redirect URIs include production domain
3. **Test OAuth Flow**: Use debug page to test authentication
4. **Monitor Logs**: Check browser console and Supabase logs for errors

## Common Issues

### Issue: Still redirecting to localhost
**Solution**: Check that both Supabase and Google Console have the correct redirect URLs

### Issue: OAuth error "redirect_uri_mismatch"
**Solution**: The redirect URI in the OAuth request doesn't match any authorized redirect URIs in Google Console

### Issue: Session not persisting
**Solution**: Check that Supabase client is properly configured with correct URL and key

## Rollback Plan

If issues persist, you can temporarily revert to the previous configuration:

1. Remove the `options.redirectTo` parameter from `signInWithGoogle()`
2. Revert the callback page changes
3. Test authentication flow

## Support

If you continue to experience issues:
1. Check browser console for errors
2. Review Supabase authentication logs
3. Verify all redirect URLs are correctly configured
4. Test with the debug page to isolate the issue 