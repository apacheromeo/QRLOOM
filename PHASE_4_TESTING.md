# Phase 4: Subscription & Payment Integration - Testing Guide

This guide will walk you through testing all Phase 4 features including Stripe integration, subscription management, and usage limits.

## Prerequisites

Before testing, ensure you have:
- ✅ Phase 3 is working (QR generation, dashboard, authentication)
- ✅ A Stripe account (use test mode for testing)
- ✅ Supabase project with Phase 2 migration completed

---

## Step 1: Run Database Migration

### 1.1 Apply the Subscription Schema Migration

```bash
# Navigate to your project directory
cd /path/to/QRLOOM

# Run the migration
npx supabase db push
```

**Expected Output:**
```
Applying migration 20241106000003_add_subscriptions.sql...
✓ Migration applied successfully
```

### 1.2 Verify Tables Created

Go to Supabase Dashboard → Table Editor and verify these tables exist:
- `user_subscriptions`
- `usage_records`
- `payment_history`

### 1.3 Test Auto-Initialization

1. Create a new test user via signup
2. Check `user_subscriptions` table - should have a row with:
   - `tier = 'free'`
   - `status = 'active'`
3. Check `usage_records` table - should have a row for current month with all counters at 0

---

## Step 2: Configure Stripe (Test Mode)

### 2.1 Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Ensure you're in **Test Mode** (toggle in top right)
3. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### 2.2 Create Products & Prices

1. Go to Stripe Dashboard → [Products](https://dashboard.stripe.com/test/products)
2. Click **+ Add product**

**For Pro Plan:**
- Name: `Pro Plan`
- Description: `Professional plan with advanced features`
- Pricing:
  - Monthly: $19.00 USD recurring every month
  - Yearly: $190.00 USD recurring every year
- Copy the Price IDs (starts with `price_`)

**For Enterprise Plan:**
- Name: `Enterprise Plan`
- Description: `Enterprise plan with unlimited access`
- Pricing:
  - Monthly: $99.00 USD recurring every month
  - Yearly: $990.00 USD recurring every year
- Copy the Price IDs

### 2.3 Configure Environment Variables

Update `.env.local`:

```bash
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # We'll get this in Step 3

# Stripe Price IDs
STRIPE_PRICE_MONTHLY=price_xxxxx           # Pro monthly
STRIPE_PRICE_YEARLY=price_xxxxx            # Pro yearly
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx
STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx
```

### 2.4 Update Vercel Environment Variables

Add the same variables to Vercel:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all the Stripe variables above
3. Select all environments (Production, Preview, Development)
4. **Redeploy** after adding variables

---

## Step 3: Set Up Stripe Webhooks (for Production)

### 3.1 Start Local Webhook Listener (for local testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 3.2 Configure Production Webhook

1. Go to Stripe Dashboard → [Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **+ Add endpoint**
3. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** and add to Vercel environment variables

---

## Step 4: Test Pricing Page

### 4.1 Access Pricing Page

1. Start your development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/en/pricing`

### 4.2 Verify Page Content

**Expected to see:**
- ✅ Three pricing cards (Free, Pro, Enterprise)
- ✅ "Most Popular" badge on Pro plan
- ✅ Correct prices displayed
- ✅ Feature lists for each plan
- ✅ "Get Started Free" button on Free plan
- ✅ "Upgrade to Pro/Enterprise" buttons on paid plans
- ✅ FAQ section
- ✅ CTA section at bottom

### 4.3 Test Responsive Design

- Test on mobile viewport (375px width)
- Test on tablet viewport (768px width)
- Test on desktop viewport (1920px width)

**Expected:** Pricing cards should stack vertically on mobile, display properly on all screen sizes.

---

## Step 5: Test Subscription Checkout Flow

### 5.1 Test Free Plan Signup

1. Click "Get Started Free" on Free plan
2. Should redirect to `/auth/signup`
3. Sign up with a new email
4. After signup, verify in Supabase:
   - `user_subscriptions` has tier = 'free'
   - `usage_records` has a record for current month

### 5.2 Test Pro Plan Checkout

1. **Log in** as an existing user
2. Go to `/en/pricing`
3. Click "Upgrade to Pro"
4. Should redirect to Stripe Checkout

**Expected Stripe Checkout Page:**
- ✅ Shows "Pro Plan - $19.00/month"
- ✅ Shows your email pre-filled
- ✅ Card input form visible
- ✅ "Subscribe" button visible

5. **Use Stripe test card:**
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

6. Click "Subscribe"

**Expected Result:**
- ✅ Redirects to `/dashboard?success=true`
- ✅ Check Supabase `user_subscriptions`:
  - `tier` changed to 'pro'
  - `status` = 'active'
  - `stripe_customer_id` populated
  - `stripe_subscription_id` populated
  - `current_period_start` and `current_period_end` set

### 5.3 Test Subscription Cancellation

1. In Stripe Dashboard, go to [Subscriptions](https://dashboard.stripe.com/test/subscriptions)
2. Find the test subscription
3. Click "Cancel subscription"
4. Choose "Cancel immediately"

**Expected Result:**
- ✅ Webhook fires `customer.subscription.deleted`
- ✅ In Supabase, `user_subscriptions`:
  - `tier` changes back to 'free'
  - `status` = 'canceled'

---

## Step 6: Test Usage Limits

### 6.1 Test Free Tier Limit (10 QR Codes)

1. Log in as a user with Free tier
2. Go to home page `/en`
3. Generate and save 10 QR codes

**For each QR code:**
- Enter URL
- Click "Generate QR Code"
- Click "Save to Library"

**After 10th QR code:**
4. Try to save an 11th QR code

**Expected Error:**
```
QR code limit reached. You've created 10 of 10 QR codes this month.
Upgrade to Pro for 1,000 QR codes per month.
```

### 6.2 Verify Usage in Database

Check `usage_records` table:
```sql
SELECT * FROM usage_records
WHERE user_id = 'your-user-id'
AND period_start >= date_trunc('month', now());
```

**Expected:**
- `qr_codes_created` = 10

### 6.3 Test Pro Tier Limit (1,000 QR Codes)

1. Upgrade user to Pro (via Stripe checkout or manually in database)
2. Try saving more QR codes
3. Should allow up to 1,000 QR codes this month

### 6.4 Test Enterprise Unlimited

1. Upgrade user to Enterprise
2. Should be able to create unlimited QR codes (no limit check)

---

## Step 7: Test Subscription Status API

### 7.1 Test GET /api/subscription

```bash
# Get your auth token from browser DevTools
# Application → Cookies → sb-access-token

curl -X GET http://localhost:3000/api/subscription \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "subscription": {
    "tier": "pro",
    "status": "active",
    "currentPeriodEnd": "2024-12-06T07:00:00.000Z",
    "cancelAtPeriodEnd": false
  },
  "plan": {
    "id": "pro",
    "name": "Pro",
    "price": {
      "monthly": 19,
      "yearly": 190
    },
    "limits": {
      "qrCodes": 1000,
      "scans": 100000,
      ...
    }
  },
  "usage": {
    "qr_codes_generated": 0,
    "qr_codes_created": 10,
    "scans_tracked": 0
  }
}
```

---

## Step 8: Test Billing Portal

### 8.1 Create Billing Portal Session

This feature allows users to manage their subscription (update payment method, cancel, etc.)

**Note:** The settings page with billing portal hasn't been created yet. To test the API:

```bash
curl -X POST http://localhost:3000/api/stripe/portal \
  -H "Cookie: sb-access-token=YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "url": "https://billing.stripe.com/session/xxxxx"
}
```

Visit that URL - should see Stripe Customer Portal with:
- Current subscription details
- Update payment method option
- Cancel subscription option
- Invoice history

---

## Step 9: Test Webhook Events

### 9.1 Trigger Test Webhook (Local)

With Stripe CLI running:

```bash
# Trigger subscription created event
stripe trigger customer.subscription.created

# Trigger payment succeeded event
stripe trigger invoice.payment_succeeded

# Trigger payment failed event
stripe trigger invoice.payment_failed
```

Check your terminal logs for webhook processing.

### 9.2 Verify Webhook Handler

Check console logs for:
```
Webhook received: customer.subscription.created
Subscription updated for user: xxxxx
```

### 9.3 Test Payment Failed Scenario

1. In Stripe Dashboard, create subscription with test card `4000000000000341` (payment fails)
2. Webhook should fire with `invoice.payment_failed`
3. Check `user_subscriptions`:
   - `status` should change to 'past_due'

---

## Step 10: Test Complete User Journey

### 10.1 End-to-End Flow

1. **Sign up** as new user → Should get Free tier
2. **Create 5 QR codes** → Should work fine
3. **Go to pricing page** → See upgrade options
4. **Upgrade to Pro** → Stripe checkout → Success
5. **Create 20 more QR codes** → Should work (total 25, under 1,000 limit)
6. **Check usage** via API → Should show 25 QR codes created
7. **Open billing portal** → Manage subscription
8. **Cancel subscription** → Should downgrade to Free at period end
9. **Try to create 11th new QR** (in new month) → Should fail (Free limit)

---

## Common Issues & Troubleshooting

### Issue: "STRIPE_SECRET_KEY is not set"
**Solution:** Make sure `.env.local` has the Stripe keys and restart dev server

### Issue: Webhook signature verification failed
**Solution:**
- For local: Make sure Stripe CLI is running and webhook secret matches
- For production: Check webhook secret from Stripe dashboard matches Vercel env var

### Issue: Subscription not updating in database
**Solution:**
- Check webhook is firing (Stripe Dashboard → Webhooks → Events)
- Check server logs for errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set (webhooks need service role)

### Issue: Can't access billing portal
**Solution:** Make sure user has `stripe_customer_id` in `user_subscriptions` table

### Issue: Usage limit not enforcing
**Solution:**
- Verify `increment_usage` function exists in database
- Check `usage_records` table is being updated
- Ensure subscription tier is correctly set

---

## Testing Checklist

- [ ] Database migration applied successfully
- [ ] All three tables created (user_subscriptions, usage_records, payment_history)
- [ ] Auto-initialization works (new users get free tier)
- [ ] Pricing page displays correctly
- [ ] Stripe checkout works with test card
- [ ] Subscription status syncs to database
- [ ] Usage limits enforced for Free tier (10 QR codes)
- [ ] Usage limits enforced for Pro tier (1,000 QR codes)
- [ ] Enterprise tier has unlimited access
- [ ] Subscription API returns correct data
- [ ] Billing portal accessible
- [ ] Webhooks processing correctly
- [ ] Payment failed handling works
- [ ] Subscription cancellation works
- [ ] End-to-end user journey completes successfully

---

## Next Steps

Once testing is complete:
1. Deploy to production with production Stripe keys
2. Set up production webhook endpoint
3. Test with real payment method (small amount)
4. Create settings page with subscription management UI
5. Add email notifications for payment events
6. Implement Phase 5 features

---

## Notes

- Always use Stripe **test mode** for development/testing
- Use test card numbers from [Stripe docs](https://stripe.com/docs/testing)
- Monitor Stripe Dashboard → Logs for webhook delivery
- Check Supabase logs for database errors
- Usage resets monthly automatically (based on `period_start`)

Happy testing! 🚀
