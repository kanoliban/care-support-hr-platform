'use client';

import * as React from 'react';
import { RiCheckLine, RiCalendarLine, RiBankCardLine, RiRefreshLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import * as WidgetBox from '@/components/widget-box';
import ButtonCheckout from '@/components/saas/ButtonCheckout';
import saasConfig from '@/lib/saas/saas-config';

export default function CurrentSubscription() {
  const [isManaging, setIsManaging] = React.useState(false);

  const handleManageSubscription = async () => {
    setIsManaging(true);
    try {
      // TODO: Implement Stripe Customer Portal redirect
      console.log('Opening Stripe Customer Portal...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Subscription Status</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          View your current subscription details and manage your billing
        </p>
      </div>

      {/* Current Subscription Status */}
      <WidgetBox.Root>
        <WidgetBox.Header>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <WidgetBox.HeaderIcon as={RiCheckLine} />
              Current Subscription
            </div>
            <Badge.Root variant='light' color='green' size='medium'>Active</Badge.Root>
          </div>
        </WidgetBox.Header>

        <div className='space-y-4'>
          {/* Plan Details */}
          <div className='rounded-xl bg-bg-soft-100 p-4'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <h3 className='text-label-md font-medium text-text-strong-950'>CareGiver OS</h3>
                <p className='text-paragraph-sm text-text-sub-600'>Professional care management for caregivers</p>
              </div>
              <div className='text-right'>
                <span className='text-title-h4 text-text-strong-950'>$29</span>
                <p className='text-paragraph-xs text-text-sub-600'>per month</p>
              </div>
            </div>

            {/* Billing Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Date</p>
                  <p className='text-label-sm font-medium'>February 15, 2024</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <RiBankCardLine className='size-4 text-text-sub-600' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Billing Cycle</p>
                  <p className='text-label-sm font-medium'>Monthly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Management Actions */}
          <div className='flex flex-col gap-3'>
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              className='w-full justify-center gap-2'
              onClick={handleManageSubscription}
              disabled={isManaging}
            >
              {isManaging ? (
                <>
                  <RiRefreshLine className='size-4 animate-spin' />
                  Opening Portal...
                </>
              ) : (
                <>
                  <RiBankCardLine className='size-4' />
                  Manage Subscription
                </>
              )}
            </Button.Root>
            <p className='text-center text-paragraph-xs text-text-sub-600'>
              Update payment methods, download invoices, or cancel your subscription
            </p>
          </div>
        </div>
      </WidgetBox.Root>

      {/* Available Plans */}
      <div className='space-y-4'>
        <h3 className='text-label-md text-text-strong-950'>Available Plans</h3>
        <p className='text-paragraph-sm text-text-sub-600'>
          Need different features? Choose from our available plans.
        </p>
        
        <div className='space-y-3'>
          {saasConfig.stripe.plans.map((plan) => (
            <WidgetBox.Root key={plan.name} className={`flex flex-col gap-4 ${plan.isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
              <WidgetBox.Header>
                <div className='flex justify-between items-start w-full'>
                  <div className='flex flex-col gap-1 flex-1'>
                    <div className='flex items-center gap-2'>
                      <WidgetBox.HeaderIcon 
                        as={RiBankCardLine} 
                        style={plan.isFeatured ? { color: '#8b5cf6' } : {}} 
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

              <div className='flex flex-col gap-3'>
                <ul className='space-y-2 rounded-xl bg-bg-soft-100 p-4 text-paragraph-sm text-text-strong-950'>
                  {plan.features.slice(0, 3).map((feature) => (
                    <li key={feature.name} className='flex items-center gap-2'>
                      <RiCheckLine className='size-4 text-success-base' />
                      {feature.name}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className='text-paragraph-xs text-text-sub-600'>
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>

                {plan.price ? (
                  <ButtonCheckout
                    priceId={plan.priceId}
                    mode='subscription'
                  />
                ) : (
                  <Button.Root
                    variant="primary"
                    mode="filled"
                    size="medium"
                    className="w-full justify-center gap-2"
                    onClick={() => console.log('Contact Sales clicked')}
                  >
                    Contact Sales
                  </Button.Root>
                )}
              </div>
            </WidgetBox.Root>
          ))}
        </div>
      </div>
    </div>
  );
}
