# FOUNDERS BETA STEP 2 - DEPLOYMENT INSTRUCTIONS

## STATUS: CODE COMPLETE - AWAITING VERCEL CONFIGURATION

All backend code has been developed and committed to GitHub. The following Vercel configuration is required before the system can go live.

---

## 1. VERCEL ENVIRONMENT VARIABLES REQUIRED

Log into Vercel Dashboard → Project: `cashflow-visionaries` → Settings → Environment Variables

Add the following (Production + Preview):

```
CFV_POSTGRES_PRISMA_URL
```
**Value:** The PostgreSQL connection string from CFV Content Engine project  
(Copy from cfv-content-engine project environment variables)

```
STRIPE_SECRET_KEY
```
**Value:** Your Stripe Secret Key (`sk_live_...` or `sk_test_...`)  
Find at: https://dashboard.stripe.com/apikeys

```
STRIPE_WEBHOOK_SECRET
```
**Value:** Webhook signing secret (will be created in step 2 below)

```
STRIPE_CITIZEN_PRICE_ID
```
**Value:** Stripe Price ID for Citizen Founder-Beta ($1,497)  
Create at: https://dashboard.stripe.com/products

```
STRIPE_ENTERPRISE_PRICE_ID
```
**Value:** Stripe Price ID for Enterprise Founder-Beta ($1,997)  
Create at: https://dashboard.stripe.com/products

```
NEXT_PUBLIC_SITE_URL
```
**Value:** `https://cashflowvisionaries.com`

---

## 2. CREATE STRIPE PRODUCTS & PRICES

### Citizen Founder-Beta
1. Go to: https://dashboard.stripe.com/products
2. Click "+ Add product"
3. **Name:** Citizen Founder-Beta
4. **Description:** Cash Flow Visionaries Founder-Beta - Citizen Level
5. **Price:** $1,497.00 USD (one-time payment)
6. **Save product**
7. **Copy the Price ID** (starts with `price_...`) → use for `STRIPE_CITIZEN_PRICE_ID`

### Enterprise Founder-Beta
1. Click "+ Add product"
2. **Name:** Enterprise Founder-Beta
3. **Description:** Cash Flow Visionaries Founder-Beta - Enterprise Level
4. **Price:** $1,997.00 USD (one-time payment)
5. **Save product**
6. **Copy the Price ID** (starts with `price_...`) → use for `STRIPE_ENTERPRISE_PRICE_ID`

---

## 3. CREATE STRIPE PAYMENT LINKS

### Citizen Founder-Beta Payment Link
1. Go to: https://dashboard.stripe.com/payment-links
2. Click "+ New"
3. Select the **Citizen Founder-Beta** product
4. **After payment:** Redirect to a page  
   URL: `https://cashflowvisionaries.com/founders-beta/confirmed?session_id={CHECKOUT_SESSION_ID}`
5. **Collect:** Customer's billing address (required)
6. **Save payment link**
7. **Copy the payment link URL** → Update `/public/participate.html` line 797:
   ```javascript
   const STRIPE_LINKS = {
     citizen: 'https://buy.stripe.com/...', // ← Paste here
   ```

### Enterprise Founder-Beta Payment Link
1. Click "+ New"
2. Select the **Enterprise Founder-Beta** product
3. **After payment:** `https://cashflowvisionaries.com/founders-beta/confirmed?session_id={CHECKOUT_SESSION_ID}`
4. **Collect:** Customer's billing address (required)
5. **Save payment link**
6. **Copy the payment link URL** → Update `/public/participate.html` line 798:
   ```javascript
   const STRIPE_LINKS = {
     citizen: '...',
     enterprise: 'https://buy.stripe.com/...', // ← Paste here
   }
   ```

---

## 4. CREATE STRIPE WEBHOOK

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. **Endpoint URL:** `https://cashflowvisionaries.com/api/webhook`
4. **Events to send:** Select `checkout.session.completed`
5. **Add endpoint**
6. **Click to reveal** the Signing secret (starts with `whsec_...`)
7. **Copy the signing secret** → use for `STRIPE_WEBHOOK_SECRET` environment variable in Vercel

---

## 5. RUN DATABASE MIGRATION

After all environment variables are set in Vercel:

1. Go to Vercel Dashboard → cashflow-visionaries → Deployments
2. Trigger a new deployment (will use the new env vars)
3. Once deployed, connect to the database and run:

```bash
npx prisma migrate deploy
```

Or via Vercel's production environment:
```bash
vercel env pull
npx prisma migrate deploy
```

This will create the `FounderBeta` table in the shared CFV PostgreSQL database.

---

## 6. TEST THE SYSTEM

### Test Stripe Webhook (Stripe CLI method)
```bash
stripe listen --forward-to https://cashflowvisionaries.com/api/webhook
stripe trigger checkout.session.completed
```

### Test Full Flow
1. Visit: https://cashflowvisionaries.com/founders-beta/participate.html
2. Check the acknowledgment checkbox
3. Click "Become a Citizen Founder-Beta" (or Enterprise)
4. Complete Stripe checkout with **test card:** `4242 4242 4242 4242`
5. Verify redirect to: `/founders-beta/confirmed?session_id=...`
6. Verify Founder-Beta Level displays correctly
7. Click "Complete Your Founder Intake"
8. Fill out intake form
9. Submit and verify redirect to `/founders-beta/intake-complete`
10. Check database for new `FounderBeta` record:
    ```sql
    SELECT * FROM "FounderBeta" ORDER BY "createdAt" DESC LIMIT 1;
    ```

---

## 7. VERCEL DEPLOYMENT SETTINGS

Ensure these settings in Vercel:

- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** (leave default)
- **Install Command:** `npm install`
- **Node.js Version:** 18.x or 20.x

---

## PRODUCTION URLS (After Deployment)

- **Participation Page:** https://cashflowvisionaries.com/founders-beta/participate.html
- **Webhook Endpoint:** https://cashflowvisionaries.com/api/webhook
- **Confirmation Page:** https://cashflowvisionaries.com/founders-beta/confirmed
- **Intake Form:** https://cashflowvisionaries.com/founders-beta/intake
- **Intake Complete:** https://cashflowvisionaries.com/founders-beta/intake-complete
- **Orientation (Placeholder):** https://cashflowvisionaries.com/founders-beta/orientation

---

## SECURITY CHECKLIST

✅ All Stripe secrets stored in Vercel environment variables (not in code)  
✅ Webhook signature verification implemented  
✅ Server-side verification before showing confirmation page  
✅ Founder-Beta Level cannot be modified via intake form  
✅ Payment status verified from database (not URL params)  
✅ Duplicate webhook events prevented (unique `stripeCheckoutSessionId`)  
✅ No secrets committed to GitHub

---

## NEXT STEPS

1. Complete Vercel environment variable configuration
2. Deploy to production
3. Run database migration
4. Create Stripe products, prices, payment links
5. Configure Stripe webhook
6. Test full purchase flow
7. Monitor webhook logs for first real purchase

**Once deployed and tested, STEP 2 is COMPLETE.**
