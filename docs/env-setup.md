# Environment Setup Guide

This guide helps non-technical teammates set up the CareSupportCodex development environment with the required credentials for authentication and billing features.

## Prerequisites

Before starting, ensure you have the following accounts set up:

### Required Setup & Accounts
1. **Node.js 18 LTS or Node.js 20** – Next.js 14 is not compatible with Node 22 (lint/build will fail). Use nvm or Volta to pin the version.
2. **Google Cloud Console** – OAuth authentication
3. **MongoDB Atlas** – Database (or local MongoDB)
4. **Stripe** – Payment processing (Phase 4)

### Optional Accounts
5. **Resend** – Email services (magic links)
6. **Crisp** – Customer support chat

## Step-by-Step Setup

### 1. Create Environment File

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env.local
```

### 2. Required Environment Variables

Open `.env.local` and fill in the following **required** variables:

#### NextAuth Configuration
```bash
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

#### Google OAuth (Required for Login)
```bash
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
```

#### Database Connection
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/caresupport
```

#### Stripe (Required for subscription billing)
```bash
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 3. Getting Your Credentials

#### Google OAuth Setup
1. Visit the [Google Cloud Console](https://console.developers.google.com/)
2. Create or select a project
3. Enable OAuth consent screen and Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID/Secret into `.env.local`

#### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster and database user
3. Get the connection string and replace `<password>` with your actual password
4. Add to `.env.local`

#### Stripe Setup
1. Open the [Stripe Dashboard](https://dashboard.stripe.com/)
2. Grab your test secret key (starts with `sk_test_`)
3. Create/lookup your webhook secret (starts with `whsec_`)
4. Add both to `.env.local`

### 4. Optional Services

#### Resend (Email authentication)
- Email-based login is optional. Only set these when you want to enable magic links.
```bash
RESEND_API_KEY=re_your_api_key
```
- If left blank, the app simply skips email login.

#### Crisp (Live chat support)
- Provide a Website ID to enable in-app chat. Otherwise the support button falls back to email.
```bash
CRISP_WEBSITE_ID=your_crisp_website_id
```

### 5. Verify Setup

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Visit `http://localhost:3000/login`
4. Click “Sign in with Google” and confirm you return to the app

## Troubleshooting

- **“Invalid redirect URI”**: Double-check the Google OAuth redirect URL
- **Mongo errors**: Ensure your IP is whitelisted and credentials are correct
- **Stripe webhook**: For local testing, you can use the Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhook/stripe`)
- **NextAuth secret missing**: Generate one with `openssl rand -base64 32`

## Security Notes

- Never commit `.env.local` or real credentials
- Use test keys in development
- Rotate secrets regularly in production

Once your environment is configured, you can continue with the integration phases, including Stripe billing and optional support services.

---

*Updated: Phase 5 decisions retain Resend as optional and require a Crisp Website ID to enable chat.*
