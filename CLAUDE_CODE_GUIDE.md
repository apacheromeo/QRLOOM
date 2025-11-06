# QRLoom - Claude Code Development Guide

Welcome! This guide will help you continue building QRLoom using Claude Code. The foundation has been laid with a complete, production-ready architecture. Now it's time to implement the core features.

## 🎯 Quick Start

### 1. Setup Your Environment

```bash
# Navigate to project
cd qrloom

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your credentials
# You'll need:
# - Supabase project URL and keys
# - Upstash Redis URL and token
# - Stripe keys (for payments)
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Run the migration:
   ```bash
   # Copy the SQL from supabase/migrations/20240101000000_initial_schema.sql
   # Run it in your Supabase SQL Editor
   ```
3. Generate TypeScript types:
   ```bash
   npm run db:types
   ```

### 3. Set Up Upstash Redis

1. Go to [Upstash](https://upstash.com) and create a Redis database
2. Copy the REST URL and token to `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📋 Development Roadmap

### Phase 1: Core QR Generator (Start Here!) 🎨

**Priority: CRITICAL**

This is the heart of the application. Start with this.

#### Files to Create:

1. **QR Generator Page** (`src/app/[locale]/page.tsx`)
```typescript
// Home page with QR generator
// Features:
// - Hero section
// - QR generator form
// - Live preview
// - Download options
// - Feature highlights
```

2. **QR Generator Component** (`src/components/qr/qr-generator.tsx`)
```typescript
// Main QR generation interface
// Inputs:
// - URL/text input
// - Format selector (PNG/SVG/PDF)
// - Color pickers (foreground/background)
// - Logo uploader
// - Dynamic QR toggle
// Actions:
// - Generate QR code
// - Download
// - Save (if authenticated)
```

3. **QR Preview Component** (`src/components/qr/qr-preview.tsx`)
```typescript
// Real-time QR code preview
// Shows generated QR with customizations
// Includes download button
```

4. **Generate API Endpoint** (`src/app/api/qr/generate/route.ts`)
```typescript
// POST endpoint
// Takes: data_url, format, colors, logo
// Returns: generated QR code blob or URL
// Handles: guest users and authenticated users differently
```

**Testing Checklist:**
- [ ] Can enter URL and generate QR
- [ ] Can change colors
- [ ] Can upload logo
- [ ] Can download as PNG
- [ ] Can download as SVG
- [ ] Can download as PDF
- [ ] Preview updates in real-time

---

### Phase 2: Authentication System 🔐

**Priority: HIGH**

Users need accounts to save QR codes and access premium features.

#### Files to Create:

1. **Auth API Routes** (`src/app/api/auth/`)
   - `signin/route.ts` - Sign in endpoint
   - `signup/route.ts` - Sign up endpoint
   - `signout/route.ts` - Sign out endpoint
   - `user/route.ts` - Get current user

2. **Auth Pages** (`src/app/[locale]/(auth)/`)
   - `signin/page.tsx` - Sign in page
   - `signup/page.tsx` - Sign up page
   - `forgot-password/page.tsx` - Password reset

3. **Auth Components** (`src/components/auth/`)
   - `signin-form.tsx` - Sign in form
   - `signup-form.tsx` - Sign up form
   - `oauth-buttons.tsx` - Google OAuth button

4. **Auth Hook** (`src/hooks/use-auth.ts`)
```typescript
// Custom hook for authentication
// Methods: signIn, signUp, signOut, resetPassword
// State: user, loading, error
```

5. **Auth Store** (`src/stores/auth-store.ts`)
```typescript
// Zustand store for auth state
// Persists user session
```

**Testing Checklist:**
- [ ] Can create account with email
- [ ] Can sign in with email
- [ ] Can sign out
- [ ] Can reset password
- [ ] Protected routes redirect to signin
- [ ] Session persists on refresh

---

### Phase 3: Dashboard & QR Management 📊

**Priority: HIGH**

Users need to view, manage, and analyze their QR codes.

#### Files to Create:

1. **Dashboard Page** (`src/app/[locale]/(dashboard)/dashboard/page.tsx`)
```typescript
// Main dashboard
// Shows:
// - Statistics cards (total QRs, scans, etc.)
// - Recent QR codes
// - Recent scans
// - Quick actions
```

2. **QR Codes Page** (`src/app/[locale]/(dashboard)/qr-codes/page.tsx`)
```typescript
// List of user's QR codes
// Features:
// - Grid/List view
// - Search and filter
// - Sort options
// - Pagination
```

3. **QR Detail Page** (`src/app/[locale]/(dashboard)/qr-codes/[id]/page.tsx`)
```typescript
// Single QR code view
// Shows:
// - QR code preview
// - Metadata
// - Analytics
// - Edit/Delete actions
```

4. **Dashboard Components** (`src/components/dashboard/`)
   - `stats-card.tsx` - Statistics display
   - `recent-qr.tsx` - Recent QR codes list
   - `recent-scans.tsx` - Recent scans list

5. **QR Components** (`src/components/qr/`)
   - `qr-card.tsx` - QR code card component
   - `qr-list.tsx` - List of QR codes
   - `qr-actions.tsx` - Edit/Delete actions

6. **QR API Endpoints** (`src/app/api/qr/`)
   - `list/route.ts` - GET: List user's QR codes
   - `[id]/route.ts` - GET/PUT/DELETE: Single QR operations

**Testing Checklist:**
- [ ] Dashboard shows user statistics
- [ ] Can view list of QR codes
- [ ] Can search QR codes
- [ ] Can view single QR details
- [ ] Can edit QR code
- [ ] Can delete QR code
- [ ] Can archive QR code

---

### Phase 4: Analytics & Tracking 📈

**Priority: MEDIUM**

Track QR code scans and provide insights.

#### Files to Create:

1. **Redirect Handler** (`src/app/r/[code]/route.ts`)
```typescript
// Handles QR code scans
// Steps:
// 1. Look up QR code by short code
// 2. Record scan with analytics data
// 3. Redirect to destination URL
```

2. **Analytics API** (`src/app/api/analytics/`)
   - `[id]/route.ts` - GET: Analytics for specific QR
   - `dashboard/route.ts` - GET: Dashboard statistics

3. **Analytics Components** (`src/components/qr/`)
   - `qr-analytics.tsx` - Main analytics display
   - `charts/scans-chart.tsx` - Scans over time chart
   - `charts/location-chart.tsx` - Geographic chart
   - `charts/device-chart.tsx` - Device breakdown

4. **Analytics Hook** (`src/hooks/use-analytics.ts`)
```typescript
// Hook for fetching and managing analytics
```

**Features to Implement:**
- Scan counting
- Geographic data collection
- Device type detection
- Referrer tracking
- Time-series charts
- Export analytics data

**Testing Checklist:**
- [ ] Scan is recorded when QR is accessed
- [ ] Analytics data is collected
- [ ] Charts display correctly
- [ ] Can filter by date range
- [ ] Can export analytics data

---

### Phase 5: Payment Integration 💳

**Priority: MEDIUM**

Monetize with Pro subscriptions.

#### Files to Create:

1. **Pricing Page** (`src/app/[locale]/pricing/page.tsx`)
```typescript
// Displays pricing plans
// Free vs Pro comparison
// FAQ section
// Call-to-action buttons
```

2. **Payment API** (`src/app/api/payment/`)
   - `checkout/route.ts` - POST: Create Stripe checkout
   - `portal/route.ts` - POST: Create billing portal session
   - `webhook/route.ts` - POST: Handle Stripe webhooks

3. **Pricing Components** (`src/components/pricing/`)
   - `pricing-card.tsx` - Individual plan card
   - `pricing-table.tsx` - Comparison table
   - `faq.tsx` - FAQ accordion

4. **Subscription Hook** (`src/hooks/use-subscription.ts`)
```typescript
// Hook for subscription management
// Methods: createCheckout, manageBilling
// State: subscription, loading
```

**Stripe Setup:**
1. Create products and prices in Stripe Dashboard
2. Set up webhook endpoint
3. Add price IDs to environment variables

**Testing Checklist:**
- [ ] Can view pricing page
- [ ] Can initiate checkout (test mode)
- [ ] Webhook handles subscription events
- [ ] User plan updates after payment
- [ ] Can access billing portal
- [ ] Pro features are restricted to Pro users

---

### Phase 6: Admin Dashboard 👨‍💼

**Priority: LOW**

Administrative interface for managing the platform.

#### Files to Create:

1. **Admin Page** (`src/app/[locale]/(admin)/admin/page.tsx`)
```typescript
// Admin dashboard
// Requires admin role
// Shows system-wide statistics
```

2. **Admin API** (`src/app/api/admin/`)
   - `users/route.ts` - GET: List users, POST: Update user
   - `stats/route.ts` - GET: System statistics
   - `content/route.ts` - GET/POST: Content management

3. **Admin Components** (`src/components/admin/`)
   - `users-table.tsx` - User management table
   - `admin-stats.tsx` - System statistics
   - `content-editor.tsx` - Content editor

**Testing Checklist:**
- [ ] Only admins can access admin routes
- [ ] Can view user list
- [ ] Can update user plans
- [ ] Can view system statistics
- [ ] Can manage content

---

### Phase 7: Polish & Optimization ✨

**Priority: ONGOING**

#### Tasks:

1. **Layout Components** (`src/components/layout/`)
   - `header.tsx` - Main navigation
   - `footer.tsx` - Footer with links
   - `sidebar.tsx` - Dashboard sidebar
   - `mobile-nav.tsx` - Mobile navigation

2. **Shared Components** (`src/components/shared/`)
   - `theme-toggle.tsx` - Dark/light mode switcher
   - `locale-switcher.tsx` - Language selector
   - `loading.tsx` - Loading states
   - `error-boundary.tsx` - Error handling
   - `ad-banner.tsx` - Advertisement display

3. **Root Layouts** (`src/app/`)
   - `layout.tsx` - Root layout with providers
   - `[locale]/layout.tsx` - Locale layout

4. **Settings Page** (`src/app/[locale]/(dashboard)/settings/page.tsx`)
```typescript
// User settings
// Tabs: Profile, Account, Preferences
```

5. **Error Pages**
   - `not-found.tsx` - 404 page
   - `error.tsx` - Error page

**Optimization Tasks:**
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Add skeleton loaders
- [ ] Optimize images
- [ ] Implement caching strategies
- [ ] Add SEO meta tags
- [ ] Set up sitemap
- [ ] Add robots.txt

---

## 🛠 Development Tips

### Working with Supabase

```typescript
// Always use the server client in API routes
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('qrcodes')
    .select('*');
  // ...
}

// Use the browser client in components
import { createClient } from '@/lib/supabase/client';

export function MyComponent() {
  const supabase = createClient();
  // ...
}
```

### Working with i18n

```typescript
// In server components
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('common');
  return <h1>{t('appName')}</h1>;
}

// In client components
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('appName')}</h1>;
}
```

### Working with Forms

```typescript
// Use React Hook Form + Zod for validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  });
  // ...
}
```

### Rate Limiting

```typescript
// In API routes
import { rateLimit } from '@/lib/redis';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await rateLimit(ip, 10, 60); // 10 requests per minute
  
  if (!success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  // ...
}
```

## 🐛 Debugging Tips

1. **Check Supabase Logs**: Supabase Dashboard > Logs
2. **Check Redis**: Use Upstash Console to view cache
3. **Check Stripe Events**: Stripe Dashboard > Events
4. **Use React DevTools**: For component inspection
5. **Console Logging**: Liberal use during development

## 📦 Adding shadcn/ui Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
# etc.
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in Vercel
- [ ] Database migrations run in production Supabase
- [ ] Stripe webhooks configured for production
- [ ] Redis configured for production
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics set up
- [ ] Error tracking configured (Sentry)
- [ ] SEO meta tags added
- [ ] Sitemap generated
- [ ] Robots.txt configured

## 🆘 Need Help?

### Common Issues:

**"Module not found"**
- Run `npm install` again
- Check import paths

**"Supabase connection error"**
- Verify environment variables
- Check Supabase project status
- Ensure RLS policies are correct

**"Stripe webhook not working"**
- Use Stripe CLI for local testing
- Verify webhook secret
- Check webhook signature

**"i18n not working"**
- Ensure locale is in URL
- Check translation keys exist
- Verify i18n configuration

### Documentation:
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Stripe: https://stripe.com/docs
- shadcn/ui: https://ui.shadcn.com

## 🎉 Success Metrics

Your MVP is complete when:
- [ ] Users can generate QR codes
- [ ] Users can sign up and sign in
- [ ] Users can save and manage QR codes
- [ ] Scans are tracked
- [ ] Users can upgrade to Pro
- [ ] Admin can view statistics

---

**Good luck building QRLoom! You have a solid foundation. Start with Phase 1 and work your way through. Each phase builds on the previous one. Happy coding! 🚀**
