# CareSupport Landing Page Implementation Prompt for Cursor

*Complete implementation guide for building the CareSupport marketing landing page*

---

## Project Context

You are building the marketing landing page for **CareSupport**, a family-first care coordination platform. This is NOT the main application—it's a marketing site designed to convert visitors into free trial signups.

**Core Differentiator**: Families are not users of care coordination—they ARE the care coordination. CareSupport gives them the operating system to lead with power, simplicity, and dignity.

---

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (already configured in project)
- **UI Components**: Use existing component library from `/components/ui/`
- **TypeScript**: Strict mode enabled
- **Deployment**: Vercel (optimized for Next.js)

---

## File Structure

```
/Users/libankano/care-support-hr-platform/
├── app/
│   ├── (marketing)/                    # NEW: Marketing pages layout group
│   │   ├── layout.tsx                  # Marketing-specific layout
│   │   ├── page.tsx                    # Landing page (root)
│   │   ├── pricing/
│   │   │   └── page.tsx                # Pricing page
│   │   ├── demo/
│   │   │   └── page.tsx                # Demo request page
│   │   └── success-stories/
│   │       ├── page.tsx                # Success stories index
│   │       ├── rob/page.tsx            # Rob's story
│   │       ├── marta/page.tsx          # Marta's story
│   │       └── jennifer/page.tsx       # Jennifer's story
│   └── (main)/                         # EXISTING: Main application
├── components/
│   ├── marketing/                      # NEW: Marketing-specific components
│   │   ├── hero-section.tsx
│   │   ├── problem-statement.tsx
│   │   ├── coverage-intelligence.tsx
│   │   ├── how-it-works.tsx
│   │   ├── comparison-table.tsx
│   │   ├── testimonials.tsx
│   │   ├── pricing-cards.tsx
│   │   ├── faq-section.tsx
│   │   └── cta-section.tsx
│   └── ui/                             # EXISTING: Reusable UI components
└── public/
    └── marketing/                      # NEW: Marketing assets
        ├── screenshots/
        ├── videos/
        └── graphics/
```

---

## Implementation Steps

### **Phase 1: Setup Marketing Layout (30 minutes)**

#### **Step 1.1: Create Marketing Layout Group**

Create `/app/(marketing)/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CareSupport - Family-First Care Coordination',
  description: 'The operating system for family care coordination. Desktop command center for coordination. Mobile remote for your team. One system for perfect clarity.',
  keywords: ['care coordination', 'family caregiving', 'caregiver support', 'care management'],
  openGraph: {
    title: 'CareSupport - Family-First Care Coordination',
    description: 'Enterprise-grade care coordination that feels effortless',
    type: 'website',
    url: 'https://caresupport.com',
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Marketing-specific header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">CareSupport</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium hover:text-primary">Features</a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-primary">How It Works</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary">Pricing</a>
              <a href="#stories" className="text-sm font-medium hover:text-primary">Stories</a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/login" className="text-sm font-medium hover:text-primary">Sign In</a>
              <a href="/register" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Start Free Trial
              </a>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Marketing-specific footer */}
        <footer className="border-t bg-muted/50">
          <div className="container py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">CareSupport</h3>
                <p className="text-sm text-muted-foreground">
                  The operating system for family care coordination.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#features" className="hover:text-primary">Features</a></li>
                  <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
                  <li><a href="/demo" className="hover:text-primary">Request Demo</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/about" className="hover:text-primary">About</a></li>
                  <li><a href="/stories" className="hover:text-primary">Success Stories</a></li>
                  <li><a href="/contact" className="hover:text-primary">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/privacy" className="hover:text-primary">Privacy</a></li>
                  <li><a href="/terms" className="hover:text-primary">Terms</a></li>
                  <li><a href="/security" className="hover:text-primary">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © 2025 CareSupport. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

---

### **Phase 2: Build Core Components (2-3 hours)**

#### **Step 2.1: Hero Section Component**

Create `/components/marketing/hero-section.tsx`:

```typescript
'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="container py-24 md:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Headline & CTA */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Families are the heroes.
            </h1>
            <p className="text-xl text-muted-foreground">
              But at 2am when coverage falls through, you need more than heroism—you need a command center.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              CareSupport is the family operating system for care.
            </h2>
            <p className="text-lg text-muted-foreground">
              Desktop command center for coordination. Mobile remote for your team. One system for perfect clarity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8">
              See CareSupport in Action
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Start Free Trial
            </Button>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30 days free</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Set up in 15 minutes</span>
            </div>
          </div>
        </div>

        {/* Right: Product Visual */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Desktop Command Center */}
            <div className="bg-card border rounded-lg p-4 shadow-lg">
              <div className="text-xs font-semibold text-muted-foreground mb-2">DESKTOP COMMAND CENTER</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Coverage Today</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gaps</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Team Available</span>
                  <span className="font-bold">20</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <div className="font-semibold text-red-800">Gap Alert</div>
                <div className="text-red-700">Saturday 6pm-12am</div>
                <div className="text-red-600">Backup: Jim, Lucy, Annie</div>
              </div>
            </div>

            {/* Mobile Remote */}
            <div className="bg-card border rounded-lg p-4 shadow-lg">
              <div className="text-xs font-semibold text-muted-foreground mb-2">MOBILE REMOTE</div>
              <div className="space-y-2 text-sm">
                <div className="font-semibold">Current Shift</div>
                <div>Jim Nelson</div>
                <div className="text-muted-foreground">9am - 5pm</div>
                <div className="flex items-center gap-2 text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Checked in</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="p-2 bg-primary/10 rounded text-xs font-medium">Voice Note</button>
                <button className="p-2 bg-primary/10 rounded text-xs font-medium">Photo</button>
                <button className="p-2 bg-primary/10 rounded text-xs font-medium">Handoff</button>
                <button className="p-2 bg-primary/10 rounded text-xs font-medium">Check Out</button>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-sm font-medium text-muted-foreground">
            One System, Perfect Clarity
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### **Step 2.2: Problem Statement Component**

Create `/components/marketing/problem-statement.tsx`:

```typescript
export function ProblemStatement() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold">
            You're Not Failing. You're Managing Complexity Without the Right Tools.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Before CareSupport */}
            <div className="bg-background border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-red-600">Before CareSupport</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📱</span>
                  <span>15 unread texts about coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📧</span>
                  <span>23 emails from caregivers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📊</span>
                  <span>3 spreadsheets open</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❓</span>
                  <span>"Is Saturday covered?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">❓</span>
                  <span>"Did Jennifer confirm?"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">😰</span>
                  <span className="font-semibold">Constant anxiety</span>
                </li>
              </ul>
            </div>

            {/* With CareSupport */}
            <div className="bg-background border rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-green-600">With CareSupport</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Saturday: Jennifer confirmed (8pm-8am)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Sunday: Sarah confirmed (8pm-8am)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">🟡</span>
                  <span>Monday: Ella tentative (needs confirmation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">🔴</span>
                  <span>Tuesday: GAP 9am-12pm (Jim's appointment)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  <span>Backup available: Marta, Isabela, Lucy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">😌</span>
                  <span className="font-semibold">Peace of mind</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

#### **Step 2.3: Coverage Intelligence Component**

Create `/components/marketing/coverage-intelligence.tsx`:

```typescript
import { Button } from '@/components/ui/button';

export function CoverageIntelligence() {
  return (
    <section id="features" className="container py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">See Gaps Before They Become Crises</h2>
          <p className="text-xl text-muted-foreground">
            The most powerful feature in CareSupport is <strong>automatic gap detection</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Real-time Coverage Status</h3>
                <p className="text-muted-foreground">85% covered today, 2 gaps, 18 confirmed, 6 unconfirmed</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Automatic Gap Detection</h3>
                <p className="text-muted-foreground">Saturday 6pm-12am (Ella called out), Tuesday 9am-12pm (Jim's appointment)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backup Suggestions</h3>
                <p className="text-muted-foreground">Uncle Jim, Lucy, Annie available for gaps</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No More 2am Scrambles</h3>
                <p className="text-muted-foreground">Know who's confirmed, who's tentative, who needs follow-up</p>
              </div>
            </div>
          </div>

          {/* Visual representation */}
          <div className="bg-card border rounded-lg p-6 shadow-lg">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Coverage Dashboard</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-green-700">Coverage Today</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <div className="text-2xl font-bold text-red-600">2</div>
                  <div className="text-sm text-red-700">Gaps Detected</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="text-2xl font-bold text-blue-600">18</div>
                  <div className="text-sm text-blue-700">Confirmed</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="text-2xl font-bold text-yellow-600">6</div>
                  <div className="text-sm text-yellow-700">Unconfirmed</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold">Coverage Gaps</div>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                  <div className="font-semibold text-red-800">Saturday 6pm-12am</div>
                  <div className="text-red-700">Ella called out</div>
                  <div className="text-red-600 mt-1">Backup: Uncle Jim, Lucy, Annie</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
                  <div className="font-semibold text-red-800">Tuesday 9am-12pm</div>
                  <div className="text-red-700">Jim's appointment</div>
                  <div className="text-red-600 mt-1">Backup: Marta, Isabela, Lucy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg">Watch How It Works →</Button>
        </div>
      </div>
    </section>
  );
}
```

---

### **Phase 3: Build Landing Page (1 hour)**

Create `/app/(marketing)/page.tsx`:

```typescript
import { HeroSection } from '@/components/marketing/hero-section';
import { ProblemStatement } from '@/components/marketing/problem-statement';
import { CoverageIntelligence } from '@/components/marketing/coverage-intelligence';
// Import other components as you build them

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemStatement />
      <CoverageIntelligence />
      {/* Add other sections as you build them */}
    </>
  );
}
```

---

## Design Specifications

### **Color Palette**
```css
/* Primary Colors */
--primary: #2563EB;        /* CareSupport Blue */
--success: #10B981;        /* Success Green */
--warning: #F59E0B;        /* Warning Yellow */
--error: #EF4444;          /* Error Red */

/* Neutral Colors */
--neutral-gray: #6B7280;   /* Text, borders */
--light-gray: #F3F4F6;     /* Backgrounds */
--dark-gray: #1F2937;      /* Headers */
```

### **Typography**
- **Headings**: Inter, Bold (700), Semibold (600)
- **Body**: Inter, Regular (400)
- **Sizes**: H1 (48px), H2 (36px), H3 (24px), Body (16px)

### **Spacing**
- **Base Unit**: 8px
- **Margins**: 16px, 24px, 32px, 48px
- **Padding**: 8px, 16px, 24px

---

## Key Implementation Notes

### **Performance Optimization**
1. Use Next.js Image component for all images
2. Lazy load below-the-fold content
3. Implement proper meta tags for SEO
4. Add structured data for rich snippets

### **Accessibility**
1. Proper heading hierarchy (h1 → h2 → h3)
2. Alt text for all images
3. ARIA labels for interactive elements
4. Keyboard navigation support
5. Color contrast WCAG AA compliant

### **Conversion Optimization**
1. Multiple CTAs throughout the page
2. Social proof indicators (testimonials, metrics)
3. Risk reversal (free trial, no credit card)
4. Clear value proposition in every section

### **Mobile Responsiveness**
1. Mobile-first design approach
2. Touch-friendly button sizes (min 44px)
3. Readable text sizes (min 16px)
4. Proper spacing for thumb navigation

---

## Testing Checklist

- [ ] Desktop view (1920x1080)
- [ ] Tablet view (768x1024)
- [ ] Mobile view (375x667)
- [ ] All CTAs functional
- [ ] Navigation smooth scroll works
- [ ] Forms validate properly
- [ ] Images load optimized
- [ ] Page load < 3 seconds
- [ ] Lighthouse score > 90
- [ ] Accessibility audit passed

---

## Deployment Steps

1. **Build for production**: `npm run build`
2. **Test production build**: `npm start`
3. **Deploy to Vercel**: `vercel --prod`
4. **Set up custom domain**: Configure DNS in Vercel
5. **Enable analytics**: Add Vercel Analytics
6. **Set up monitoring**: Configure error tracking

---

## Next Steps After Landing Page

1. **A/B Testing**: Test headline variations
2. **Video Production**: Add product demo video
3. **Blog Setup**: Create content marketing foundation
4. **Email Integration**: Connect to email service provider
5. **Analytics**: Set up conversion tracking

---

*This implementation guide provides everything needed to build the CareSupport marketing landing page using Cursor AI. Follow the phases sequentially for best results.*


