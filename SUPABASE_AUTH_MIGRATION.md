# Firebase to Supabase Authentication Migration

## Overview
This document outlines the migration from Firebase Authentication to Supabase Authentication for the GharConnect application.

## What Was Changed

### 1. Core Authentication Files
- **Created**: `lib/supabase-auth.ts` - New Supabase authentication utilities
- **Updated**: `context/AuthContext.tsx` - Now uses Supabase instead of Firebase
- **Updated**: `components/AuthWrapper.tsx` - Updated to use Supabase auth state
- **Created**: `app/auth/callback/page.tsx` - OAuth callback handler for Supabase

### 2. Authentication Functions
The following functions have been migrated from Firebase to Supabase:

| Firebase Function | Supabase Equivalent | Location |
|------------------|-------------------|----------|
| `signInWithGoogle()` | `supabase.auth.signInWithOAuth({ provider: 'google' })` | `lib/supabase-auth.ts` |
| `signOut(auth)` | `supabase.auth.signOut()` | `lib/supabase-auth.ts` |
| `auth.currentUser` | `supabase.auth.getUser()` | `lib/supabase-auth.ts` |
| `auth.onAuthStateChanged()` | `supabase.auth.onAuthStateChange()` | `lib/supabase-auth.ts` |
| `signInWithEmailAndPassword()` | `supabase.auth.signInWithPassword()` | `lib/supabase-auth.ts` |

### 3. User Object Changes
Firebase User properties have been mapped to Supabase User properties:

| Firebase Property | Supabase Property | Notes |
|------------------|------------------|-------|
| `user.uid` | `user.id` | User ID |
| `user.photoURL` | `user.user_metadata.avatar_url` | Profile picture |
| `user.displayName` | `user.user_metadata.full_name` | Display name |
| `user.email` | `user.email` | Email (same) |
| `user.emailVerified` | `user.email_confirmed_at` | Email verification status |

### 4. Updated Components
- `components/Header.tsx` - Updated to use Supabase auth
- `components/ProfileDropdown.tsx` - Updated user profile handling
- `components/LoginModal.tsx` - Updated to use Supabase Google OAuth
- `app/debug-auth/page.tsx` - Updated debug page for Supabase
- `app/logout/page.tsx` - Simplified logout process
- `app/admin/login/page.tsx` - Updated admin login
- `app/admin/page.tsx` - Updated admin dashboard auth

### 5. Database Integration
- Updated `lib/supabase.ts` to remove Firebase dependencies
- All database queries now use native Supabase authentication
- Session management is handled automatically by Supabase client

## Environment Variables Required

Make sure you have the following environment variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Google OAuth Setup

1. **Supabase Dashboard**: Go to Authentication > Providers > Google
2. **Enable Google Provider**: Toggle it on
3. **Configure OAuth**: Add your Google OAuth credentials
4. **Redirect URLs**: Add your domain to the redirect URLs list

## Testing the Migration

### 1. Test Google Sign-In
1. Navigate to any login page (e.g., `/mumbai/community/login`)
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. Verify you're redirected back to the application

### 2. Test Authentication State
1. Use the debug page: `/debug-auth`
2. Check that user information is displayed correctly
3. Test sign-out functionality

### 3. Test Protected Routes
1. Try accessing protected pages while logged out
2. Verify you're redirected to login
3. Access the same pages while logged in
4. Verify you can access the content

### 4. Test Admin Authentication
1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Verify you can access the admin dashboard

## Known Issues and Fixes

### 1. User Profile Data
If you have existing user profiles in your database that reference Firebase UIDs, you'll need to migrate them to use Supabase user IDs.

### 2. Session Persistence
Supabase handles session persistence automatically. If you experience issues with sessions not persisting, check your Supabase configuration.

### 3. OAuth Redirect
Make sure your OAuth redirect URL is correctly configured in both Supabase and Google Console.

## Rollback Plan

If you need to rollback to Firebase authentication:

1. Restore the original Firebase configuration files
2. Update all imports back to Firebase
3. Restore the original authentication context
4. Test all authentication flows

## Next Steps

1. **Test thoroughly** in development environment
2. **Deploy to staging** and test with real users
3. **Monitor authentication logs** in Supabase dashboard
4. **Remove Firebase dependencies** once migration is confirmed working
5. **Update documentation** for team members

## Support

If you encounter issues during the migration:

1. Check the Supabase documentation: https://supabase.com/docs
2. Review the authentication logs in Supabase dashboard
3. Test with the debug page: `/debug-auth`
4. Check browser console for any errors

## Files Modified

The migration script updated 46 files across the codebase. Key files include:

- All page components that use authentication
- All UI components that display user information
- Authentication utilities and helpers
- Database integration files
- Admin pages and components

## Benefits of Supabase Authentication

1. **Unified Platform**: Authentication and database in one place
2. **Better Performance**: No need to sync Firebase tokens with Supabase
3. **Simplified Code**: Single authentication system
4. **Better Security**: Row Level Security (RLS) integration
5. **Cost Effective**: No separate Firebase billing 