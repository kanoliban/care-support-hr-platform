# CareSupportCodex Deployment Plan

## Pre-Deployment Checklist

### Environment Requirements
- [ ] **Node.js**: Use Node 18 LTS or Node 20 (Next.js 14 incompatible with Node 22+)
- [ ] **Environment Variables**: All required credentials populated in production `.env.local`
- [ ] **Database**: MongoDB Atlas cluster configured and accessible
- [ ] **External Services**: Google OAuth, Stripe webhooks, optional Resend/Crisp configured

### Code Quality Gates
- [ ] `npm run lint` passes (requires Node 18/20)
- [ ] `npm run build` succeeds
- [ ] All smoke tests from `docs/testing-checklist.md` pass

## Deployment Options

### Option 1: Vercel (Recommended)
**Pros**: Zero-config Next.js deployment, automatic SSL, edge functions
**Cons**: Serverless limitations, vendor lock-in

**Setup Steps**:
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set Node.js version to 18.x or 20.x
4. Deploy automatically on git push

**Environment Variables to Set**:
```
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
GOOGLE_ID=<production-google-client-id>
GOOGLE_SECRET=<production-google-client-secret>
MONGODB_URI=<production-mongodb-uri>
STRIPE_SECRET_KEY=<production-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<production-stripe-webhook-secret>
RESEND_API_KEY=<optional-resend-key>
CRISP_WEBSITE_ID=<optional-crisp-id>
NODE_ENV=production
SITE_URL=https://your-domain.vercel.app
```

### Option 2: Railway
**Pros**: Full-stack platform, database included, simple deployment
**Cons**: Less Next.js optimization than Vercel

**Setup Steps**:
1. Connect GitHub repository
2. Configure environment variables
3. Set Node.js version in `package.json` engines field
4. Deploy with automatic builds

### Option 3: DigitalOcean App Platform
**Pros**: Managed infrastructure, good pricing, flexible
**Cons**: More configuration required

**Setup Steps**:
1. Create new app from GitHub repository
2. Configure build settings (Node.js 18/20)
3. Set environment variables
4. Configure custom domain and SSL

### Option 4: Self-Hosted (VPS/Cloud)
**Pros**: Full control, cost-effective for large scale
**Cons**: More maintenance, security responsibilities

**Requirements**:
- Ubuntu 20.04+ or similar
- Node.js 18/20 LTS
- PM2 or similar process manager
- Nginx reverse proxy
- SSL certificate (Let's Encrypt)

## Production Configuration

### Required Changes for Production

1. **Google OAuth Redirect URIs**:
   - Add production domain: `https://your-domain.com/api/auth/callback/google`
   - Update OAuth consent screen with production domain

2. **Stripe Webhooks**:
   - Create production webhook endpoint: `https://your-domain.com/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Update webhook secret in production environment

3. **MongoDB Atlas**:
   - Whitelist production server IP addresses
   - Use production database (not test database)
   - Ensure proper backup strategy

4. **Domain & SSL**:
   - Configure custom domain
   - Ensure SSL certificate is valid
   - Update `NEXTAUTH_URL` and `SITE_URL` with production domain

### Security Checklist
- [ ] All environment variables are secure (no test keys in production)
- [ ] MongoDB connection uses strong authentication
- [ ] Stripe webhook signature verification is enabled
- [ ] NextAuth secret is cryptographically secure
- [ ] CORS settings are properly configured
- [ ] Rate limiting is implemented (if using custom server)

## Monitoring & Maintenance

### Health Checks
- [ ] Authentication flow works end-to-end
- [ ] Stripe checkout and webhooks function correctly
- [ ] Database connections are stable
- [ ] Optional services (Resend/Crisp) work when configured

### Monitoring Setup
- **Application**: Built-in Next.js error reporting or Sentry
- **Infrastructure**: Platform-specific monitoring (Vercel Analytics, Railway metrics)
- **Database**: MongoDB Atlas monitoring
- **External Services**: Stripe dashboard, Google Cloud Console monitoring

### Backup Strategy
- **Database**: MongoDB Atlas automated backups
- **Code**: GitHub repository (already in place)
- **Environment**: Store secure backup of production environment variables

## Rollback Plan

### If Deployment Fails
1. **Immediate**: Revert to previous deployment (platform-specific)
2. **Database**: Restore from MongoDB Atlas backup if needed
3. **Environment**: Verify all environment variables are correct
4. **Dependencies**: Check for Node.js version compatibility issues

### Post-Deployment Validation
1. Run full testing checklist on production environment
2. Verify all external integrations (Google OAuth, Stripe, MongoDB)
3. Test user registration and authentication flow
4. Validate billing/subscription functionality
5. Check support chat/email fallback functionality

## Cost Estimation

### Vercel (Recommended)
- **Hobby Plan**: Free (limited bandwidth)
- **Pro Plan**: $20/month (unlimited bandwidth, team features)
- **Database**: MongoDB Atlas M0 (free) or M2 ($9/month)

### Railway
- **Starter**: $5/month per service
- **Database**: Included or separate pricing
- **Total**: ~$10-15/month

### DigitalOcean App Platform
- **Basic**: $5/month
- **Database**: Separate droplet or managed database
- **Total**: ~$15-25/month

## Next Steps

1. **Choose deployment platform** based on team needs and budget
2. **Set up staging environment** for testing before production
3. **Configure production environment variables**
4. **Execute deployment** following platform-specific instructions
5. **Run post-deployment validation** using the testing checklist
6. **Set up monitoring and alerting**

---

**Note**: This deployment plan assumes Phase 7 testing checklist has been completed successfully on a Node 18/20 environment. All manual tasks from the integration roadmap should be resolved before proceeding with deployment.
