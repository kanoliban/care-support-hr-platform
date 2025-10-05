'use client';

import * as React from 'react';
import { RiCheckLine, RiCloseLine, RiSparklingLine, RiCalendarLine, RiBankCardLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as WidgetBox from '@/components/widget-box';

// Mock subscription data
const mockSubscriptionData = {
  plan: {
    name: 'CareGiver OS',
    description: 'Professional care management for caregivers',
    price: 29,
    billingCycle: 'monthly',
    features: [
      'All features of the Family Plan',
      'Management of unlimited families',
      'Professional dashboard',
      'Visit documentation and billing tools',
      'Priority support',
      'Free trial included',
    ],
  },
  status: 'active',
  trialEndsAt: null, // No trial - active subscription
  nextBillingDate: '2024-02-15',
  nextBillingAmount: 29,
  billingHistory: {
    totalInvoices: 12,
    lastPayment: '2024-01-15',
    lastAmount: 29,
  },
  usage: {
    familiesManaged: 8,
    maxFamilies: 'unlimited',
    teamMembers: 3,
    maxTeamMembers: 'unlimited',
  },
};

export default function SubscriptionStatus() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleManageSubscription = async () => {
    setIsLoading(true);
    // Simulate API call to Stripe Customer Portal
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, this would redirect to Stripe Customer Portal
      console.log('Redirecting to Stripe Customer Portal...');
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge.Root variant='light' color='green' size='medium'>
            <RiCheckLine className='size-3' />
            Active
          </Badge.Root>
        );
      case 'trial':
        return (
          <Badge.Root variant='light' color='blue' size='medium'>
            <RiSparklingLine className='size-3' />
            Trial
          </Badge.Root>
        );
      case 'cancelled':
        return (
          <Badge.Root variant='light' color='red' size='medium'>
            <RiCloseLine className='size-3' />
            Cancelled
          </Badge.Root>
        );
      default:
        return (
          <Badge.Root variant='light' color='neutral' size='medium'>
            Unknown
          </Badge.Root>
        );
    }
  };

  return (
    <div className='flex w-full flex-col gap-6'>
      {/* Header */}
      <div>
        <div className='text-label-md'>Subscription Status</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          View your current subscription details and manage your CareSupport plan
        </p>
      </div>

      {/* Current Plan Card */}
      <WidgetBox.Root className='ring-2 ring-primary-500'>
        <WidgetBox.Header>
          <div className='flex justify-between items-start w-full'>
            <div className='flex flex-col gap-1 flex-1'>
              <div className='flex items-center gap-2'>
                <WidgetBox.HeaderIcon 
                  as={RiSparklingLine} 
                  style={{ color: '#8b5cf6' }} 
                />
                {mockSubscriptionData.plan.name}
              </div>
              <p className='text-paragraph-sm text-text-sub-600'>{mockSubscriptionData.plan.description}</p>
            </div>
            <div className='flex flex-col items-end gap-2'>
              {getStatusBadge(mockSubscriptionData.status)}
              <div className='text-right'>
                <span className='text-title-h4 text-text-strong-950'>${mockSubscriptionData.plan.price}</span>
                <p className='text-paragraph-xs text-text-sub-600'>per month</p>
              </div>
            </div>
          </div>
        </WidgetBox.Header>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Billing Information & Plan Features */}
          <div className='lg:col-span-2 space-y-4'>
            {/* Billing Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-bg-soft-200'>
                <RiCalendarLine className='size-5 text-primary-500' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Date</p>
                  <p className='text-label-sm font-medium'>{mockSubscriptionData.nextBillingDate}</p>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 rounded-lg bg-bg-soft-200'>
                <RiBankCardLine className='size-5 text-primary-500' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Amount</p>
                  <p className='text-label-sm font-medium'>${mockSubscriptionData.nextBillingAmount}</p>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <h4 className='text-label-sm font-medium mb-3'>Plan Features</h4>
              <ul className='space-y-2 rounded-xl bg-bg-soft-100 p-4 text-paragraph-sm text-text-strong-950'>
                {mockSubscriptionData.plan.features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    <RiCheckLine className='size-4 text-primary-500' />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Usage Statistics */}
          <div className='space-y-4'>
            <div>
              <h4 className='text-label-sm font-medium mb-3'>Usage Statistics</h4>
              <div className='space-y-4'>
                <div className='p-4 rounded-lg border border-stroke-soft-200'>
                  <p className='text-paragraph-xs text-text-sub-600'>Families Managed</p>
                  <p className='text-title-h5 text-text-strong-950'>
                    {mockSubscriptionData.usage.familiesManaged}
                    <span className='text-paragraph-sm text-text-sub-600 ml-1'>
                      / {mockSubscriptionData.usage.maxFamilies}
                    </span>
                  </p>
                </div>
                <div className='p-4 rounded-lg border border-stroke-soft-200'>
                  <p className='text-paragraph-xs text-text-sub-600'>Team Members</p>
                  <p className='text-title-h5 text-text-strong-950'>
                    {mockSubscriptionData.usage.teamMembers}
                    <span className='text-paragraph-sm text-text-sub-600 ml-1'>
                      / {mockSubscriptionData.usage.maxTeamMembers}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Full Width */}
        <div className='flex flex-col sm:flex-row gap-3'>
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              className='flex-1 justify-center gap-2'
              onClick={handleManageSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='inline-flex size-4 animate-spin rounded-full border-[2px] border-primary-base/40 border-t-transparent' />
                  Loading...
                </>
              ) : (
                <>
                  <RiBankCardLine className='size-4' />
                  Manage Subscription
                </>
              )}
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='medium'
              className='flex-1 justify-center gap-2'
            >
              <RiSparklingLine className='size-4' />
              View All Plans
            </Button.Root>
          </div>

        {/* Billing History Summary */}
        <div className='p-4 rounded-lg bg-bg-soft-100'>
          <h4 className='text-label-sm font-medium mb-2'>Billing History</h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-center'>
              <div>
                <p className='text-title-h5 text-text-strong-950'>{mockSubscriptionData.billingHistory.totalInvoices}</p>
                <p className='text-paragraph-xs text-text-sub-600'>Total Invoices</p>
              </div>
              <div>
                <p className='text-title-h5 text-text-strong-950'>{mockSubscriptionData.billingHistory.lastPayment}</p>
                <p className='text-paragraph-xs text-text-sub-600'>Last Payment</p>
              </div>
              <div>
                <p className='text-title-h5 text-text-strong-950'>${mockSubscriptionData.billingHistory.lastAmount}</p>
                <p className='text-paragraph-xs text-text-sub-600'>Last Amount</p>
              </div>
            </div>
          </div>
        </div>
      </WidgetBox.Root>

      {/* Additional Information */}
      <div className='p-4 rounded-lg bg-bg-soft-100'>
        <h4 className='text-label-sm font-medium mb-2'>Need Help?</h4>
        <p className='text-paragraph-sm text-text-sub-600 mb-3'>
          If you need to upgrade, downgrade, or have questions about your subscription, 
          you can manage everything through the Stripe Customer Portal or contact our support team.
        </p>
        <div className='flex flex-col sm:flex-row gap-2'>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            Contact Support
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            View Billing History
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
