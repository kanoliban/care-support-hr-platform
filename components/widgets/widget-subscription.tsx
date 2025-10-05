'use client';

import { RiSparklingLine, RiStarSmileLine } from '@remixicon/react';

import ButtonCheckout from '@/components/saas/ButtonCheckout';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as WidgetBox from '@/components/widget-box';
import saasConfig from '@/lib/saas/saas-config';

export default function WidgetSubscription() {
  const plans = saasConfig.stripe.plans;

  if (!plans || plans.length === 0) {
    return null;
  }

  return (
    <div className='space-y-6'>
      {plans.map((plan, index) => (
        <WidgetBox.Root key={plan.name} className={`flex flex-col gap-4 ${plan.isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
          <WidgetBox.Header>
            <div className='flex justify-between items-start w-full'>
              <div className='flex flex-col gap-1 flex-1'>
                <div className='flex items-center gap-2'>
                  <WidgetBox.HeaderIcon 
                    as={RiSparklingLine} 
                    style={plan.isFeatured ? { color: '#3b82f6' } : {}} 
                  />
                  {plan.name}
                </div>
                <p className='text-paragraph-sm text-text-sub-600'>{plan.description}</p>
              </div>
              <div className='text-right ml-4'>
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
          </WidgetBox.Header>

          <Divider.Root />

          <div className='flex flex-col gap-3'>

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
              <>
                <Button.Root
                  variant="primary"
                  mode="filled"
                  size="medium"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    // TODO: Implement contact sales functionality
                    console.log('Contact Sales clicked');
                  }}
                >
                  Contact Sales
                </Button.Root>
                <p className='text-center text-paragraph-xs text-text-sub-600'>
                  Custom pricing available for enterprise needs
                </p>
              </>
            )}
          </div>
        </WidgetBox.Root>
      ))}
    </div>
  );
}
