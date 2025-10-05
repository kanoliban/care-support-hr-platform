'use client';

import { RiSparklingLine, RiStarSmileLine, RiCheckLine } from '@remixicon/react';

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
    <div className='flex w-full flex-col gap-6'>
      <div>
        <div className='flex items-center gap-2 text-label-md'>
          <RiSparklingLine className='size-5' />
          Available Plans
        </div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Choose the perfect plan for your care coordination needs
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-6 ${
              plan.isFeatured
                ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                : 'border-stroke-soft-200 bg-bg-white-0'
            }`}
          >
            {/* Plan Header */}
            <div className='mb-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-label-lg font-semibold text-text-strong-950'>
                  {plan.name}
                </h3>
                {plan.isFeatured && (
                  <span className='rounded-full bg-primary-500 px-2 py-1 text-paragraph-xs font-medium text-white'>
                    Popular
                  </span>
                )}
              </div>
              <p className='mt-1 text-paragraph-sm text-text-sub-600'>
                {plan.description}
              </p>
            </div>

            {/* Pricing */}
            <div className='mb-6'>
              <div className='flex items-baseline gap-2'>
                {plan.price !== null ? (
                  <>
                    <span className='text-title-h3 font-bold text-text-strong-950'>
                      ${plan.price}
                    </span>
                    <span className='text-paragraph-sm text-text-sub-600'>/month</span>
                  </>
                ) : (
                  <span className='text-title-h3 font-bold text-text-strong-950'>
                    Custom
                  </span>
                )}
              </div>
              {plan.priceAnchor && (
                <p className='text-paragraph-xs text-text-sub-600 line-through'>
                  ${plan.priceAnchor}/month
                </p>
              )}
            </div>

            {/* Features */}
            <ul className='mb-6 space-y-3'>
              {plan.features.map((feature) => (
                <li key={feature.name} className='flex items-start gap-3'>
                  <RiCheckLine className='mt-0.5 size-4 shrink-0 text-primary-500' />
                  <span className='text-paragraph-sm text-text-strong-950'>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className='mt-auto'>
              {plan.price !== null ? (
                <ButtonCheckout
                  priceId={plan.priceId}
                  mode='subscription'
                  className='w-full'
                />
              ) : (
                <button className='w-full rounded-lg bg-primary-500 px-4 py-2 text-paragraph-sm font-medium text-white transition-colors hover:bg-primary-600'>
                  Contact Sales
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='rounded-lg bg-bg-soft-100 p-4'>
        <p className='text-center text-paragraph-sm text-text-sub-600'>
          <strong>Secure billing:</strong> All plans are processed securely through Stripe. 
          Cancel anytime through the billing portal. Free trials available for all paid plans.
        </p>
      </div>
    </div>
  );
}
