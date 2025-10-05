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

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-6'>
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
      className={`relative flex h-full flex-col rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
        isFeatured
          ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100'
          : 'border-stroke-soft-200 bg-bg-white-0 hover:border-stroke-soft-300'
      }`}
    >
      {isFeatured && (
        <div className='absolute -top-2 left-1/2 -translate-x-1/2'>
          <Badge.Root variant='solid' color='blue' size='small'>
            <Badge.Icon as={RiSparklingLine} />
            Most Popular
          </Badge.Root>
        </div>
      )}

      {/* Header */}
      <div className='mb-4 text-center'>
        <h3 className='text-title-h5 text-text-strong-950'>{plan.name}</h3>
        <p className='mt-1 text-paragraph-xs text-text-sub-600'>
          {plan.description}
        </p>
        
        <div className='mt-3'>
          {isAgency ? (
            <div>
              <span className='text-title-h3 text-text-strong-950'>Custom</span>
              <p className='text-paragraph-xs text-text-sub-600'>Contact us for pricing</p>
            </div>
          ) : (
            <div>
              <span className='text-title-h3 text-text-strong-950'>${plan.price}</span>
              <span className='text-paragraph-sm text-text-sub-600'>/month</span>
              {plan.priceAnchor && (
                <p className='mt-1 text-paragraph-xs text-text-sub-400 line-through'>
                  ${plan.priceAnchor}/month
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <Divider.Root className='mb-4' />

      {/* Features */}
      <div className='flex flex-1 flex-col'>
        <ul className='mb-4 space-y-2'>
          {plan.features.slice(0, 5).map((feature) => (
            <li key={feature.name} className='flex items-start gap-2'>
              <RiCheckLine className='mt-0.5 size-3 shrink-0 text-primary-500' />
              <span className='text-paragraph-xs text-text-strong-950 leading-relaxed'>
                {feature.name}
              </span>
            </li>
          ))}
          {plan.features.length > 5 && (
            <li className='text-paragraph-xs text-text-sub-600 pl-5'>
              +{plan.features.length - 5} more features
            </li>
          )}
        </ul>

        {/* CTA Button */}
        <div className='mt-auto'>
          {isAgency ? (
            <button className='w-full rounded-lg bg-primary-500 px-4 py-2.5 text-label-xs font-medium text-white transition-colors hover:bg-primary-600'>
              Contact Sales
            </button>
          ) : (
            <ButtonCheckout
              priceId={plan.priceId}
              mode='subscription'
            />
          )}
          <p className='mt-1.5 text-center text-paragraph-xs text-text-sub-600'>
            {isAgency 
              ? 'Get a custom quote'
              : 'Cancel anytime'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
