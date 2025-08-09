# Fix Google OAuth Display Name

## Problem
Google OAuth consent screen shows "to continue to fgjrzebkqccsbnizcmrq.supabase.co" instead of "GharConnect".

## Root Cause
- Google shows the App Name only if the OAuth app is verified
- If unverified, Google defaults to showing the redirect URI domain (Supabase)
- Current OAuth app doesn't have proper branding configuration

## Solution

### Step 1: Update Google Cloud Console OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the one with your OAuth credentials)
3. Navigate to **APIs & Services** → **OAuth consent screen**

### Step 2: Configure App Information

In the **App Information** section, update:

```
App name: GharConnect
User support email: [your-support-email@gharconnect.in]
App logo: [Upload GharConnect logo - optional but recommended]
```

### Step 3: Configure App Domain

In the **App Domain** section, add:

```
Application home page: https://gharconnect.in
Application privacy policy link: https://gharconnect.in/privacy  
Application terms of service link: https://gharconnect.in/terms
```

### Step 4: Add Authorized Domains

In the **Authorized domains** section, add:

```
gharconnect.in
www.gharconnect.in
```

### Step 5: Save Configuration

1. Click **SAVE AND CONTINUE**
2. Review the **Scopes** section (can use defaults for now)
3. Click **SAVE AND CONTINUE**

## Expected Result

After configuration:
- **Before**: "to continue to fgjrzebkqccsbnizcmrq.supabase.co"
- **After**: "to continue to GharConnect" 

## Notes

### For Immediate Effect (Unverified Apps)
- Changes should take effect within a few minutes to hours
- The app name will show even without verification for internal/testing apps

### For Production (Verified Apps)  
- For external production apps, you may need to submit for verification
- Verification can take several days to weeks
- Verified apps get additional benefits like custom logo display

### Verification Requirements (If Needed)
- Valid home page at gharconnect.in
- Privacy policy accessible at gharconnect.in/privacy
- Terms of service accessible at gharconnect.in/terms
- Domain ownership verification via Google Search Console

## Testing

After making changes:

1. Clear browser cache
2. Go to login page: `https://gharconnect.in/mumbai/community/login`
3. Click "Sign in with Google"
4. Verify the consent screen now shows "GharConnect"

## Troubleshooting

### If still showing Supabase domain:
1. Check that you're editing the correct Google Cloud project
2. Verify the OAuth client ID matches what's used in your app
3. Wait up to 24 hours for changes to propagate
4. Clear browser cache and cookies

### If getting domain verification errors:
1. Add domains to **Authorized domains** first
2. Verify domain ownership via Google Search Console
3. Ensure all URLs (home page, privacy, terms) are publicly accessible

## Alternative Quick Fix

If you need an immediate change without Google Console access:

1. **Use Custom Redirect**: Modify OAuth to redirect through gharconnect.in first
2. **Change OAuth Provider**: Consider alternative OAuth configurations
3. **Contact Google Support**: For urgent branding issues

## Related Files Modified
- No code changes needed
- This is purely a Google Cloud Console configuration change