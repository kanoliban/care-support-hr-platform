# Testing Checklist

Use this as a guide when validating CareSupportCodex locally or in staging.

## 1. Environment Sanity
- Node version is 18.x or 20.x (`node -v`)
- Dependencies installed (`npm install`)
- `.env.local` populated with:
  - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
  - Google OAuth client ID/secret
  - `MONGODB_URI`
  - Stripe test keys (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
  - Optional: `RESEND_API_KEY`, `CRISP_WEBSITE_ID`

## 2. Auth Flow
- `npm run dev`
- Navigate to `http://localhost:3000/login`
- Click "Sign in with Google" → authenticate → redirected to `/`
- Dashboard header shows account menu and avatar/initials

## 3. Billing Flow (Stripe Test Mode)
- On the home dashboard, locate the "Subscription & Billing" widget
- Click "Get CareSupport" → redirected to Stripe Checkout
- Complete test purchase (4242 4242 4242 4242)
- Webhook updates `User.hasAccess` to `true` (check Mongo or logs)
- From the header menu, open Billing → Stripe customer portal loads

## 4. Support & Notifications
- If `CRISP_WEBSITE_ID` set: open Support button → chat loads
- Without Crisp ID: Support button opens default mail client to the configured support address
- Toast notifications appear styled correctly (e.g., trigger an error by cancelling checkout)

## 5. Lint & Build
- `npm run lint` (requires Node 18/20; fails on Node 22)
- `npm run build`

## 6. Regression Smoke
- Widgets render without layout shifts (Time Off, Current Project, Schedule, Status Tracker, Subscription)
- Account dropdown → "Logout" returns to `/login`
- (Optional) Resend email sign-in works when `RESEND_API_KEY` provided

Log any failures or unexpected behavior in the integration roadmap under Phase 7.
