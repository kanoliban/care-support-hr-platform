'use client';

import { RiSparklingLine, RiStarSmileLine, RiCheckLine } from '@remixicon/react';

import ButtonCheckout from '@/components/saas/ButtonCheckout';
import * as Badge from '@/components/ui/badge';
import * as Divider from '@/components/ui/divider';
import * as WidgetBox from '@/components/widget-box';
import saasConfig from '@/lib/saas/saas-config';

export default function PricingPlansGrid() {
  const plans = saasConfig.stripe.plans;

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='text-center'>
        <h2 className='text-title-h3 text-text-strong-950'>Choose Your Plan</h2>
        <p className='mt-2 text-paragraph-md text-text-sub-600'>
          Select the perfect plan for your care coordination needs
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
        {plans.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}

interface PricingCardProps {
  plan: typeof saasConfig.stripe.plans[0];
}

function PricingCard({ plan }: PricingCardProps) {
  const isFeatured = plan.isFeatured;
  const isAgency = plan.name === 'Agency Plan';

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
        isFeatured
          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100'
          : 'border-stroke-soft-200 bg-bg-white-0 hover:border-stroke-soft-300'
      }`}
    >
      {isFeatured && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
          <Badge.Root variant='solid' color='blue' size='medium'>
            <Badge.Icon as={RiSparklingLine} />
            Most Popular
          </Badge.Root>
        </div>
      )}

      <div className='mb-6 text-center'>
        <h3 className='text-title-h4 text-text-strong-950'>{plan.name}</h3>
        <p className='mt-2 text-paragraph-sm text-text-sub-600'>
          {plan.description}
        </p>
        
        <div className='mt-4'>
          {isAgency ? (
            <div>
              <span className='text-title-h2 text-text-strong-950'>Custom</span>
              <p className='text-paragraph-sm text-text-sub-600'>Contact us for pricing</p>
            </div>
          ) : (
            <div>
              <span className='text-title-h2 text-text-strong-950'>${plan.price}</span>
              <span className='text-paragraph-md text-text-sub-600'>/month</span>
              {plan.priceAnchor && (
                <p className='mt-1 text-paragraph-sm text-text-sub-400 line-through'>
                  ${plan.priceAnchor}/month
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Divider.Root className='mb-6' />

      <div className='flex flex-1 flex-col'>
        <ul className='space-y-3 mb-6'>
          {plan.features.map((feature) => (
            <li key={feature.name} className='flex items-start gap-3'>
              <RiCheckLine className='mt-0.5 size-4 shrink-0 text-primary-500' />
              <span className='text-paragraph-sm text-text-strong-950'>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>

        <div className='mt-auto'>
          {isAgency ? (
            <button className='w-full rounded-lg bg-primary-500 px-6 py-3 text-label-sm font-medium text-white transition-colors hover:bg-primary-600'>
              Contact Sales
            </button>
          ) : (
            <ButtonCheckout
              priceId={plan.priceId}
              mode='subscription'
            />
          )}
          <p className='mt-2 text-center text-paragraph-xs text-text-sub-600'>
            {isAgency 
              ? 'Get a custom quote for your organization'
              : 'Cancel anytime through the billing portal'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
