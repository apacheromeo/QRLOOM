# QRLOOM Deployment Guide

## Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/apacheromeo/QRLOOM&project-name=qrloom&repository-name=qrloom)

### Manual Deployment Steps

1. **Sign in to Vercel**
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select the QRLOOM repository
   - Click "Import"

3. **Configure Build Settings**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Install Command: `npm install --legacy-peer-deps`
   - Output Directory: `.next`

4. **Add Environment Variables**

   For Phase 1 (QR Generator only), these placeholder values will work:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder_key
   SUPABASE_SERVICE_ROLE_KEY=placeholder_service_key
   STRIPE_SECRET_KEY=sk_test_placeholder
   NEXT_PUBLIC_APP_NAME=QRLoom
   ```

   **Note:** For production use in later phases, you'll need to replace these with real values from:
   - Supabase: https://supabase.com
   - Upstash Redis: https://upstash.com
   - Stripe: https://stripe.com

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

6. **Custom Domain (Optional)**
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain

## Automatic Deployments

Once connected to Vercel:
- **Production**: Pushes to `main` branch auto-deploy to production
- **Preview**: Pushes to any other branch create preview deployments
- **Pull Requests**: Each PR gets its own preview URL

## Environment Variables for Future Phases

### Phase 2 (Authentication)
Add real Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
```

### Phase 3 (Redis/Rate Limiting)
Add Upstash credentials:
```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Phase 5 (Payments)
Add real Stripe credentials:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_MONTHLY=price_...
STRIPE_PRICE_YEARLY=price_...
```

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure `npm install --legacy-peer-deps` is used as install command
- Check build logs in Vercel dashboard

### 404 Errors
- The app uses locale-based routing
- Access pages at `/en` or `/th` (e.g., `https://your-app.vercel.app/en`)
- Root path `/` redirects to `/en` automatically

### Preview Not Updating
- Ensure your branch is pushed to GitHub
- Vercel auto-deploys on push
- Check deployment status in Vercel dashboard

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Issues: https://github.com/apacheromeo/QRLOOM/issues
