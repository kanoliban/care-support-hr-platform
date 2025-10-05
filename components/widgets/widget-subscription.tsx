'use client';

import { RiSparklingLine, RiStarSmileLine } from '@remixicon/react';

import ButtonCheckout from '@/components/saas/ButtonCheckout';
import * as Divider from '@/components/ui/divider';
import * as WidgetBox from '@/components/widget-box';
import saasConfig from '@/lib/saas/saas-config';

export default function WidgetSubscription() {
  const plans = saasConfig.stripe.plans;

  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      {plans.map((plan, index) => (
        <WidgetBox.Root key={plan.name} className={`flex flex-col gap-4 flex-1 ${plan.isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
          <WidgetBox.Header>
            <WidgetBox.HeaderIcon as={RiSparklingLine} />
            {plan.name}
            {plan.isFeatured && (
              <span className='ml-2 rounded-full bg-primary-500 px-2 py-1 text-xs font-medium text-white'>
                Popular
              </span>
            )}
          </WidgetBox.Header>

          <Divider.Root />

          <div className='flex flex-col gap-3'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-paragraph-sm text-text-sub-600'>{plan.description}</p>
              </div>
              <div className='text-right'>
                {plan.price ? (
                  <>
                    <span className='text-title-h4 text-text-strong-950'>${plan.price}</span>
                    <p className='text-paragraph-xs text-text-sub-600'>per month</p>
                  </>
                ) : (
                  <span className='text-title-h4 text-text-strong-950'>Custom</span>
                )}
              </div>
            </div>

            <ul className='space-y-2 rounded-xl bg-bg-soft-100 p-4 text-paragraph-sm text-text-strong-950'>
              {plan.features.map((feature) => (
                <li key={feature.name} className='flex items-center gap-2'>
                  <RiStarSmileLine className='size-4 text-primary-500' />
                  {feature.name}
                </li>
              ))}
            </ul>

            {plan.price ? (
              <>
                <ButtonCheckout
                  priceId={plan.priceId}
                  mode='subscription'
                />
                <p className='text-center text-paragraph-xs text-text-sub-600'>
                  Your card will be charged via Stripe. Cancel anytime through the billing portal.
                </p>
              </>
            ) : (
              <div className='text-center'>
                <button className='rounded-lg bg-primary-500 px-6 py-3 text-white font-medium hover:bg-primary-600 transition-colors'>
                  Contact Sales
                </button>
                <p className='mt-2 text-paragraph-xs text-text-sub-600'>
                  Custom pricing available for enterprise needs
                </p>
              </div>
            )}
          </div>
        </WidgetBox.Root>
      ))}
    </div>
  );
}
