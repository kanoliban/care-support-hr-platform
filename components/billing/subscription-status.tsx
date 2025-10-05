'use client';

import * as React from 'react';
import { RiCheckLine, RiCalendarLine, RiBankCardLine, RiRefreshLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import * as WidgetBox from '@/components/widget-box';
import ButtonCheckout from '@/components/saas/ButtonCheckout';
import saasConfig from '@/lib/saas/saas-config';

// Mock subscription data - replace with real API call later
const mockSubscriptionData = {
  hasSubscription: true,
  plan: {
    name: 'CareGiver OS',
    price: 29,
    description: 'Professional care management for caregivers',
    priceId: 'price_caregiver_os_prod'
  },
  status: 'active',
  nextBillingDate: '2024-02-15',
  billingCycle: 'monthly',
  trialEndsAt: null,
  customerId: 'cus_mock_customer_id'
};

const mockNoSubscriptionData = {
  hasSubscription: false,
  plan: null,
  status: null,
  nextBillingDate: null,
  billingCycle: null,
  trialEndsAt: null,
  customerId: null
};

interface SubscriptionStatusProps {
  subscriptionData?: typeof mockSubscriptionData | typeof mockNoSubscriptionData;
  isLoading?: boolean;
}

export default function SubscriptionStatus({ 
  subscriptionData = mockSubscriptionData, 
  isLoading = false 
}: SubscriptionStatusProps) {
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

  if (isLoading) {
    return (
      <WidgetBox.Root className='animate-pulse'>
        <WidgetBox.Header>
          <div className='flex items-center gap-2'>
            <div className='h-6 w-6 bg-bg-soft-200 rounded'></div>
            <div className='h-6 w-32 bg-bg-soft-200 rounded'></div>
          </div>
        </WidgetBox.Header>
        <div className='space-y-3'>
          <div className='h-4 w-full bg-bg-soft-200 rounded'></div>
          <div className='h-4 w-3/4 bg-bg-soft-200 rounded'></div>
        </div>
      </WidgetBox.Root>
    );
  }

  // No subscription state
  if (!subscriptionData.hasSubscription) {
    return (
      <div className='space-y-6'>
        <WidgetBox.Root className='border-dashed border-2 border-stroke-soft-200'>
          <WidgetBox.Header>
            <div className='flex items-center gap-2'>
              <WidgetBox.HeaderIcon as={RiBankCardLine} />
              No Active Subscription
            </div>
          </WidgetBox.Header>
          
          <div className='space-y-4'>
            <p className='text-paragraph-sm text-text-sub-600'>
              You don't have an active subscription. Choose a plan below to get started with CareSupport.
            </p>
            
            <div className='flex flex-col gap-3'>
              <Button.Root variant='primary' mode='filled' size='medium' className='w-full'>
                View Available Plans
              </Button.Root>
              <p className='text-center text-paragraph-xs text-text-sub-600'>
                All plans include a free trial
              </p>
            </div>
          </div>
        </WidgetBox.Root>

        {/* Show available plans */}
        <div className='space-y-4'>
          <h3 className='text-label-md text-text-strong-950'>Available Plans</h3>
          {saasConfig.stripe.plans.map((plan) => (
            <WidgetBox.Root key={plan.name} className={`flex flex-col gap-4 ${plan.isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
              <WidgetBox.Header>
                <div className='flex justify-between items-start w-full'>
                  <div className='flex flex-col gap-1 flex-1'>
                    <div className='flex items-center gap-2'>
                      <WidgetBox.HeaderIcon 
                        as={RiCreditCardLine} 
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
                  {plan.features.map((feature) => (
                    <li key={feature.name} className='flex items-center gap-2'>
                      <RiCheckLine className='size-4 text-success-base' />
                      {feature.name}
                    </li>
                  ))}
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
    );
  }

  // Active subscription state
  const { plan, status, nextBillingDate, billingCycle, trialEndsAt } = subscriptionData;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge.Root variant='light' color='green' size='medium'>Active</Badge.Root>;
      case 'trialing':
        return <Badge.Root variant='light' color='blue' size='medium'>Trial</Badge.Root>;
      case 'past_due':
        return <Badge.Root variant='light' color='orange' size='medium'>Past Due</Badge.Root>;
      case 'canceled':
        return <Badge.Root variant='light' color='red' size='medium'>Canceled</Badge.Root>;
      default:
        return <Badge.Root variant='light' color='neutral' size='medium'>{status}</Badge.Root>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className='space-y-6'>
      {/* Current Subscription Status */}
      <WidgetBox.Root>
        <WidgetBox.Header>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              <WidgetBox.HeaderIcon as={RiCheckLine} />
              Current Subscription
            </div>
            {getStatusBadge(status)}
          </div>
        </WidgetBox.Header>

        <div className='space-y-4'>
          {/* Plan Details */}
          <div className='rounded-xl bg-bg-soft-100 p-4'>
            <div className='flex justify-between items-start mb-3'>
              <div>
                <h3 className='text-label-md font-medium text-text-strong-950'>{plan.name}</h3>
                <p className='text-paragraph-sm text-text-sub-600'>{plan.description}</p>
              </div>
              <div className='text-right'>
                <span className='text-title-h4 text-text-strong-950'>${plan.price}</span>
                <p className='text-paragraph-xs text-text-sub-600'>per {billingCycle}</p>
              </div>
            </div>

            {/* Trial Notice */}
            {trialEndsAt && (
              <div className='mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                <p className='text-paragraph-sm text-blue-700'>
                  <strong>Free Trial:</strong> Your trial ends on {formatDate(trialEndsAt)}
                </p>
              </div>
            )}

            {/* Billing Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-2'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Date</p>
                  <p className='text-label-sm font-medium'>{formatDate(nextBillingDate)}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <RiBankCardLine className='size-4 text-text-sub-600' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Billing Cycle</p>
                  <p className='text-label-sm font-medium capitalize'>{billingCycle}</p>
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

      {/* Upgrade Options */}
      <div className='space-y-4'>
        <h3 className='text-label-md text-text-strong-950'>Upgrade Options</h3>
        <p className='text-paragraph-sm text-text-sub-600'>
          Need more features? Consider upgrading to a higher plan.
        </p>
        
        {/* Show other available plans */}
        <div className='space-y-3'>
          {saasConfig.stripe.plans
            .filter(p => p.name !== plan.name)
            .map((upgradePlan) => (
              <WidgetBox.Root key={upgradePlan.name} className={`flex flex-col gap-4 ${upgradePlan.isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
                <WidgetBox.Header>
                  <div className='flex justify-between items-start w-full'>
                    <div className='flex flex-col gap-1 flex-1'>
                      <div className='flex items-center gap-2'>
                        <WidgetBox.HeaderIcon 
                          as={RiCreditCardLine} 
                          style={upgradePlan.isFeatured ? { color: '#8b5cf6' } : {}} 
                        />
                        {upgradePlan.name}
                      </div>
                      <p className='text-paragraph-sm text-text-sub-600'>{upgradePlan.description}</p>
                    </div>
                    <div className='text-right ml-4'>
                      {upgradePlan.price ? (
                        <>
                          <span className='text-title-h4 text-text-strong-950'>${upgradePlan.price}</span>
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
                    {upgradePlan.features.slice(0, 3).map((feature) => (
                      <li key={feature.name} className='flex items-center gap-2'>
                        <RiCheckLine className='size-4 text-success-base' />
                        {feature.name}
                      </li>
                    ))}
                    {upgradePlan.features.length > 3 && (
                      <li className='text-paragraph-xs text-text-sub-600'>
                        +{upgradePlan.features.length - 3} more features
                      </li>
                    )}
                  </ul>

                  {upgradePlan.price ? (
                    <ButtonCheckout
                      priceId={upgradePlan.priceId}
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
