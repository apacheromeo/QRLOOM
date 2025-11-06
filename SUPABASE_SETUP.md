# Running the Supabase Migration

This guide will help you set up the database schema for QRLOOM.

## Method 1: Using Supabase Dashboard (Recommended for Beginners)

### Step 1: Create a Supabase Project

1. Go to **https://supabase.com**
2. Click "Start your project" or "New Project"
3. Sign in with GitHub (recommended)
4. Create a new organization (if you don't have one)
5. Click "New Project"
6. Fill in:
   - **Project Name**: qrloom
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
7. Click "Create new project" and wait 2-3 minutes

### Step 2: Run the Migration

1. In your Supabase project dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy the entire contents of `/home/user/QRLOOM/supabase/migrations/20240101000000_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" - that's good!

### Step 3: Verify the Migration

1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - `profiles` - User profiles
   - `qrcodes` - QR codes data
   - `scans` - Analytics/scan data
   - `plans` - Subscription plans
   - `subscriptions` - User subscriptions

### Step 4: Get Your API Keys

1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`
   - **service_role key**: Another long string (keep this secret!)

### Step 5: Update Your Environment Variables

**For Local Development:**

Update `/home/user/QRLOOM/.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**For Vercel Deployment:**

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Update these variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
   SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
   ```
4. Click **"Save"**
5. Redeploy your application

---

## Method 2: Using Supabase CLI (Advanced)

### Step 1: Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Windows (PowerShell)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux
brew install supabase/tap/supabase
# or
npm install -g supabase
```

### Step 2: Initialize Supabase

```bash
cd /home/user/QRLOOM
supabase init
```

### Step 3: Link to Your Project

```bash
supabase link --project-ref your-project-id
```

### Step 4: Push Migration

```bash
supabase db push
```

---

## What the Migration Creates

### Tables:
1. **profiles** - User information (extends Supabase auth)
2. **plans** - Subscription plans (Free & Pro)
3. **qrcodes** - QR code data and customization
4. **scans** - Analytics and tracking data
5. **subscriptions** - Stripe subscription info

### Features:
- ✅ Row Level Security (RLS) enabled
- ✅ User can only see their own data
- ✅ Automatic profile creation on signup
- ✅ Automatic scan count increment
- ✅ Storage buckets for QR codes and logos
- ✅ Indexes for performance
- ✅ Triggers for updated_at timestamps

### Default Data:
- 2 plans inserted (Free and Pro)
- Storage buckets created (qr-codes, logos)

---

## Testing the Migration

After running the migration, test it:

1. **Check Tables**: Go to Table Editor and verify all tables exist
2. **Check Plans**: Click on `plans` table, you should see 2 rows (Free and Pro)
3. **Check Storage**: Go to Storage, you should see `qr-codes` and `logos` buckets
4. **Test Auth**: Try signing up at `/auth/signup` in your app

---

## Common Issues

### Issue: "extension uuid-ossp does not exist"
**Solution**: Enable the extension manually:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Issue: "permission denied for schema auth"
**Solution**: You're running as the wrong user. Use the SQL Editor in Supabase Dashboard instead of a database client.

### Issue: "relation auth.users does not exist"
**Solution**: Supabase creates this automatically. Make sure you're running the migration in a Supabase project, not a regular PostgreSQL database.

### Issue: Storage policies fail
**Solution**: Run just the storage bucket creation first, then the policies:
```sql
-- First
INSERT INTO storage.buckets (id, name, public) VALUES
    ('qr-codes', 'qr-codes', true),
    ('logos', 'logos', true);

-- Then run the policy statements
```

---

## Next Steps

After successfully running the migration:

1. ✅ Update environment variables (local and Vercel)
2. ✅ Test signup at `/auth/signup`
3. ✅ Test signin at `/auth/signin`
4. ✅ Verify profile is created in `profiles` table
5. ✅ Ready for Phase 3: Dashboard & QR Management!

---

## Optional: Enable Google OAuth

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Google**
3. Follow instructions to create Google OAuth credentials
4. Add credentials to Supabase
5. OAuth will work automatically in your app!

---

Need help? Check the Supabase docs: https://supabase.com/docs/guides/database/migrations
