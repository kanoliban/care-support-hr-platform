# CareSupport SaaS Integration Roadmap

## Integration Plan
- Assess Compatibility: verify App Router provider nesting; reconcile Tailwind setups.
- Extract ShipFast Infrastructure: migrate NextAuth, Mongo/Mongoose, API client, Stripe, Resend, SEO helpers, and supporting components under new aliases.
- Set Up Environment & Dependencies: add library deps, document `.env` variables, align TypeScript paths.
- Integrate Authentication: stand up NextAuth route, wrap layouts with session provider, surface sign-in controls, guard protected routes.
- Integrate Billing: wire Stripe checkout/portal routes, webhook updates, pricing config, and billing UI.
- Wire Database: ensure Mongo connection for API routes, validate models, plan data onboarding.
- Email & Support: configure Resend flows (magic links, transactional mail); optionally add Crisp after approval.
- SEO & Utilities: adopt `getSEOTags` where useful, drop marketing routes, keep reusable utilities.
- UI Harmonization: restyle imported components to CareSupport theme, maintain existing contexts and widgets.
- Testing & Documentation: lint/typecheck, run auth/billing smoke tests, update README and rollout notes.

## Implementation Phases
1. **Phase 0 – Prep & Alignment**: Confirm provider nesting, Tailwind strategy, current state dependencies.
2. **Phase 1 – Pull Core Libraries**: Copy libs, models, UI components, and config into CareSupport with new namespaces.
3. **Phase 2 – Environment & Dependencies**: Update dependencies, configure `.env`, adjust TS paths.
4. **Phase 3 – Authentication Integration**: Implement NextAuth handlers, wrap layouts, add sign-in UX, protect routes.
5. **Phase 4 – Billing & User Data**: Add Stripe routes/webhooks, integrate billing UI, finalize pricing config.
6. **Phase 5 – Ancillary Services**: Configure Resend, decide on Crisp, align SEO helpers.
7. **Phase 6 – Theming & UX Harmonization**: Restyle imported components, remove unused marketing assets.
8. **Phase 7 – Verification & Documentation**: Execute tests, update docs, plan staging rollout and monitoring.

## Phase Progress
- **Phase 0 – Prep & Alignment** ✅
 - Root layout renders `<Providers>` (`app/layout.tsx:24`) which wraps Jotai and `SimplePermissionProvider`; `(main)/layout.tsx:1` wraps children with another `SimplePermissionProvider` plus `CareSupportProvider`. We will consolidate to a single permission provider when adding `SessionProvider`.
  - Current Tailwind stack remains v3.4 with custom tokens in `tailwind.config.ts`; keep this config and restyle imported ShipFast components rather than upgrading to Tailwind 4 now.
  - Domain state layers rely on `SimplePermissionProvider`, `CareSupportProvider`, and feature-level providers like `CareEventsProvider`. No other global stores conflict with the upcoming auth session context.
- **Phase 1 – Pull Core Libraries** ✅
  - Created `lib/saas`, `models/saas`, and `components/saas` namespaces; imported NextAuth/Mongo/Stripe/Resend utilities as `api-client`, `next-auth`, `mongo`, `mongoose`, `stripe`, `resend`, `seo`, plus SaaS config scaffolding (`lib/saas/saas-config.ts`, `types/saas-config.ts`).
  - Ported ShipFast user/lead mongoose models (with plugin) into `models/saas/` and UI shell components (`LayoutClient`, `ButtonSignin`, `ButtonAccount`, `ButtonCheckout`, `ButtonSupport`) with imports rewritten to use the new `saas` modules.
  - Deferred optional GPT helper per decision; will revisit if/when required.
- **Phase 2 – Environment & Dependencies** ✅
  - Added core SaaS dependencies (`next-auth`, `@auth/mongodb-adapter`, `mongodb`, `mongoose`, `axios`, `stripe`, `resend`, `react-hot-toast`, `nextjs-toploader`, `react-tooltip`) to `package.json`; npm install blocked by sandbox timeout, so lockfile update pending once network access is available.
  - Extended `tsconfig.json` with path aliases for `@/lib/saas/*`, `@/models/saas/*`, and `@/components/saas/*`.
  - Created `.env.example` outlining required credentials (NextAuth, Google OAuth, MongoDB, Stripe, Resend, optional Crisp) for onboarding.
- **Phase 3 – Authentication Integration** ✅
  - Added NextAuth route handler at `app/api/auth/[...nextauth]/route.ts` wired to `lib/saas/next-auth`.
  - Wrapped the root layout with `ClientLayout` (`components/saas/LayoutClient`) so the session provider, top loader, toasts, and optional Crisp chat are globally available.
  - Protected the `(main)` route group via server-side `auth()` with redirect to `/login?callbackUrl=/`, ensuring the Care Coordination Center requires authentication.
  - Updated `/login` to surface the new `ButtonSignin` for Google/NextAuth sign-in, simplifying previous placeholder form UI and aligning the UX with the new auth flow.
  - Added account controls to the main header via `ButtonAccount` for quick access to billing and sign-out actions.
- **Phase 4 – Billing & User Data** ✅
  - Created Stripe API routes: checkout (`app/api/stripe/create-checkout/route.ts`), customer portal (`app/api/stripe/create-portal/route.ts`), and webhook handler (`app/api/webhook/stripe/route.ts`) with Mongo persistence via `models/saas/User`.
  - Introduced `components/widgets/widget-subscription.tsx` and surfaced it on the dashboard home to highlight the featured plan and launch checkout flows.
  - Reused `ButtonAccount` for billing portal access and documented Stripe secrets in `.env.example`; webhook handler toggles `hasAccess` based on subscription lifecycle events.
  - Pending manual step: supply real `priceId` values in `lib/saas/saas-config.ts` and register the Stripe webhook endpoint before going live.
- **Phase 5 – Ancillary Services** ✅
  - Kept Resend email login optional by guarding the provider on `RESEND_API_KEY`; app no longer attempts to configure SMTP when the key is absent.
  - Updated `LayoutClient` and `ButtonSupport` to activate Crisp chat only when a Website ID is present, redirecting to email support otherwise.
  - Refreshed `docs/env-setup.md` to flag Resend/Crisp as optional and note the Phase 5 decisions.
- **Phase 6 – Theming & UX Harmonization** ✅
  - Migrated SaaS buttons (`ButtonSignin`, `ButtonCheckout`, `ButtonAccount`, `ButtonSupport`) to the AlignUI button primitives, ensuring spacing, focus states, and color tokens match the CareSupport design language.
  - Replaced ad-hoc DaisyUI classes and loaders with theme-aligned styling and lightweight spinners.
  - Polished `WidgetSubscription` layout to fit existing widget patterns while keeping plan details intact.
- **Phase 7 – Verification & Documentation** ✅
  - Added `docs/testing-checklist.md` covering environment requirements, auth, billing, support, and regression steps.
  - Attempted `npm run lint`; failed on Node 22 (`MODULE_NOT_FOUND ../server/require-hook`). Documented Node 18/20 requirement in `docs/env-setup.md`.
  - Outstanding manual tasks: populate `.env.local`, rerun `npm run lint` and `npm run build` on supported Node versions, execute the testing checklist.

## Decisions
- Remain on Next.js 14 / React 18 and Tailwind 3; backport ShipFast modules instead of upgrading frameworks immediately.
- Adopt Mongo/Mongoose for SaaS features; introduce a `saasConfig` namespace to avoid conflicts with existing utilities.
- Defer optional services (Crisp, GPT client) until core auth/billing flow is stable and credentials exist.
- Nest NextAuth `SessionProvider` ahead of current CareSupport providers; monitor hydration behavior.
- Phase 5 pre-call: keep Resend optional (degrade gracefully), plan to enable Crisp once a Website ID is provided, and retain the existing lightweight metadata setup instead of adopting ShipFast SEO helpers.

## Immediate Actions
- Embed the above decisions into ongoing implementation tasks and tracking.
- Prepare development prerequisites: Mongo instance (local or Atlas) and Stripe test credentials/CLI for webhook testing.
- Continue updating this roadmap as phases progress or assumptions change.

## Pre-Phase 4 Readiness
- **Environment Scaffolding Complete** ✅
  - Created `.env.example` with placeholder values and detailed comments for all required credentials
  - Added comprehensive setup guide at `docs/env-setup.md` with step-by-step instructions for non-technical teammates
  - Environment variables documented: NextAuth, Google OAuth, MongoDB, Stripe, Resend, Crisp
  - Team can now copy `.env.example` to `.env.local`, fill in credentials, and verify auth flow before Phase 4 billing work

## Deployment Readiness
- **Deployment Planning Complete** ✅
  - Created comprehensive deployment guide at `docs/deployment-plan.md` covering Vercel, Railway, DigitalOcean, and self-hosted options
  - Documented production configuration requirements, security checklist, and monitoring setup
  - Outlined cost estimation and rollback procedures
  - Ready for production deployment once manual testing is completed on Node 18/20 environment

## Outstanding Manual Actions

### Immediate Testing Requirements
- [ ] **Node Environment Setup**: Install Node 18 LTS or Node 20 (current host has Node 24.5.0 which is incompatible with Next.js 14)
- [ ] **Environment Configuration**: Copy `.env.example` to `.env.local` and populate with real credentials:
  - NextAuth secret and URL
  - Google OAuth client ID/secret
  - MongoDB Atlas connection string
  - Stripe test keys and webhook secret
  - Optional: Resend API key, Crisp website ID
- [ ] **Code Quality Validation**: Run `npm run lint` and `npm run build` on supported Node version
- [ ] **Smoke Testing**: Execute complete testing checklist from `docs/testing-checklist.md`

### Deployment Actions
- [ ] **Platform Selection**: Choose deployment platform (Vercel recommended)
- [ ] **Staging Environment**: Set up staging deployment for testing
- [ ] **Production Configuration**: Configure production environment variables and external service settings
- [ ] **Domain & SSL**: Set up custom domain and SSL certificate
- [ ] **External Service Updates**: Update Google OAuth redirect URIs and Stripe webhook endpoints for production
- [ ] **Post-Deployment Validation**: Run production smoke tests and monitor system health

### Optional Enhancements
- [ ] **Error Handling**: Review and improve error boundaries and user feedback
- [ ] **Performance Optimization**: Analyze bundle size and optimize loading states
- [ ] **UI/UX Polish**: Enhance user experience based on testing feedback
- [ ] **Feature Extensions**: Add advanced billing features, user management, or notification systems

## Implementation Plan
- **Detailed Implementation Plan Created** ✅
  - Created comprehensive step-by-step guide at `docs/implementation-plan.md`
  - Structured into 5 phases: Environment Setup, Testing, Staging, Production, and Monitoring
  - Includes timeline estimates, success criteria, risk mitigation, and rollback procedures
  - Provides specific commands and configuration steps for each phase
  - Ready for team execution with clear assignments and deliverables
