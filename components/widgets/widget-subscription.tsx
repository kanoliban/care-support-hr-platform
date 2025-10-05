'use client';

import { RiSparklingLine, RiStarSmileLine } from '@remixicon/react';

import ButtonCheckout from '@/components/saas/ButtonCheckout';
import * as Divider from '@/components/ui/divider';
import * as WidgetBox from '@/components/widget-box';
import saasConfig from '@/lib/saas/saas-config';

const featuredPlan =
  saasConfig.stripe.plans.find((plan) => plan.isFeatured) ??
  saasConfig.stripe.plans[0];

export default function WidgetSubscription() {
  if (!featuredPlan) {
    return null;
  }

  return (
    <WidgetBox.Root className='flex flex-col gap-4'>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiSparklingLine} />
        Subscription & Billing
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-label-md text-text-strong-950'>{featuredPlan.name}</p>
            <p className='text-paragraph-sm text-text-sub-600'>{featuredPlan.description}</p>
          </div>
          <div className='text-right'>
            <span className='text-title-h4 text-text-strong-950'>${featuredPlan.price}</span>
            <p className='text-paragraph-xs text-text-sub-600'>per month</p>
          </div>
        </div>

        <ul className='space-y-2 rounded-xl bg-bg-soft-100 p-4 text-paragraph-sm text-text-strong-950'>
          {featuredPlan.features.map((feature) => (
            <li key={feature.name} className='flex items-center gap-2'>
              <RiStarSmileLine className='size-4 text-primary-500' />
              {feature.name}
            </li>
          ))}
        </ul>

        <ButtonCheckout
          priceId={featuredPlan.priceId}
          mode='subscription'
        />
        <p className='text-center text-paragraph-xs text-text-sub-600'>
          Your card will be charged via Stripe. Cancel anytime through the billing portal.
        </p>
      </div>
    </WidgetBox.Root>
  );
}
