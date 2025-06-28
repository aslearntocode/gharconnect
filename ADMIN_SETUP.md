# Admin Verification System Setup

This document explains how to set up the vendor verification system for GharConnect.

## Overview

The system allows admins to verify vendors who have scheduled their availability (temporary or permanent). Verified vendors will display a green tick (✓) on the frontend pages like `/parel/services/domestic-help`.

## Database Changes

The following database changes have been made:

1. **Added `is_verified` column** to both `vendor_permanent_availability` and `vendor_weekly_availability` tables
2. **Created `admin_users` table** to manage admin access
3. **Created `admin_verification_log` table** to track verification changes
4. **Created `update_vendor_verification` function** to handle verification updates

## Setup Instructions

### 1. Run Database Migration

First, run the database migration to add the verification fields:

```sql
-- This migration is in: supabase/migrations/20241201000002_add_vendor_verification.sql
-- Run this in your Supabase SQL editor or via your migration system
```

### 2. Create Admin User

#### Option A: Using the Setup Script

1. Create a Firebase user account through Firebase Console or your app
2. Get the user ID from Firebase Auth
3. Update the variables in `scripts/setup-admin.js`:
   - `adminUserId`: Your Firebase user ID
   - `adminEmail`: Your admin email
   - `adminName`: Your admin name
   - `adminRole`: 'super_admin' or 'admin'

4. Set your environment variables:
   ```bash
   export NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

5. Run the setup script:
   ```bash
   node scripts/setup-admin.js
   ```

#### Option B: Manual Database Insert

```sql
INSERT INTO admin_users (user_id, email, name, role, is_active) 
VALUES ('your-firebase-user-id', 'admin@gharconnect.com', 'Admin User', 'super_admin', true);
```

### 3. Access Admin Dashboard

1. Navigate to `/admin/login`
2. Login with your Firebase credentials
3. You'll be redirected to `/admin` if you have admin privileges

## Admin Dashboard Features

The admin dashboard (`/admin`) provides:

- **View all vendors** (both permanent and temporary)
- **Toggle verification status** for each vendor
- **Track verification changes** in the log
- **Filter by vendor type** (permanent vs temporary)

## Frontend Changes

The frontend has been updated to:

- **Fetch verification status** from the database
- **Display green tick (✓)** for verified vendors
- **Show verification status** in vendor cards

## API Endpoints

The system uses the following Supabase functions:

- `update_vendor_verification()` - Updates vendor verification status and logs the change

## Security

- Only users in the `admin_users` table can access the admin dashboard
- All verification changes are logged with admin details
- Row Level Security (RLS) policies protect the data

## Usage Flow

1. **Vendor registers** and schedules availability
2. **Admin reviews** vendors in the admin dashboard
3. **Admin verifies** vendors by clicking the "Verify" button
4. **Verified vendors** show green ticks on frontend pages
5. **All changes** are logged for audit purposes

## Troubleshooting

### Common Issues

1. **Admin access denied**: Make sure the user is added to the `admin_users` table
2. **Verification not updating**: Check if the `update_vendor_verification` function exists
3. **Green tick not showing**: Verify that `is_verified` field is being fetched in the frontend

### Database Queries

Check admin users:
```sql
SELECT * FROM admin_users WHERE is_active = true;
```

Check verification logs:
```sql
SELECT * FROM admin_verification_log ORDER BY created_at DESC;
```

Check vendor verification status:
```sql
SELECT vendor_id, name, is_verified FROM vendor_permanent_availability WHERE is_verified = true;
SELECT vendor_id, name, is_verified FROM vendor_weekly_availability WHERE is_verified = true;
```

## Support

For issues or questions, please check:
1. Database migration status
2. Admin user setup
3. Firebase authentication
4. Supabase RLS policies 