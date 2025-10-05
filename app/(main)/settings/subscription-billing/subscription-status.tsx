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
  nextBillingDate: 'February 15, 2024',
  nextBillingAmount: 29,
  usage: {
    familiesManaged: 8,
    teamMembers: 3,
    totalCareEvents: 247,
  },
  billingHistory: {
    totalInvoices: 12,
    lastPayment: 'January 15, 2024',
    lastAmount: 29,
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
    <div className='flex w-full max-w-none flex-col gap-6'>
      {/* Header */}
      <div>
        <div className='text-label-md'>Subscription Status</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          View your current subscription details and manage your CareSupport plan
        </p>
      </div>

      {/* Current Plan Card - WIDER */}
      <WidgetBox.Root className='ring-2 ring-primary-500 max-w-none'>
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
                <p className='text-paragraph-xs text-text-sub-600'>/{mockSubscriptionData.plan.billingCycle}</p>
              </div>
            </div>
          </div>
        </WidgetBox.Header>

        {/* Billing Information - WIDER HORIZONTAL LAYOUT */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <div className='flex items-center gap-3 p-4 rounded-lg bg-bg-soft-200'>
            <RiCalendarLine className='size-6 text-primary-500 flex-shrink-0' />
            <div>
              <p className='text-paragraph-xs text-text-sub-600'>Next Billing Date</p>
              <p className='text-label-sm font-medium'>{mockSubscriptionData.nextBillingDate}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-4 rounded-lg bg-bg-soft-200'>
            <RiBankCardLine className='size-6 text-primary-500 flex-shrink-0' />
            <div>
              <p className='text-paragraph-xs text-text-sub-600'>Next Billing Amount</p>
              <p className='text-label-sm font-medium'>${mockSubscriptionData.nextBillingAmount}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-4 rounded-lg bg-bg-soft-200'>
            <RiSparklingLine className='size-6 text-primary-500 flex-shrink-0' />
            <div>
              <p className='text-paragraph-xs text-text-sub-600'>Families Managed</p>
              <p className='text-label-sm font-medium'>{mockSubscriptionData.usage.familiesManaged}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 p-4 rounded-lg bg-bg-soft-200'>
            <RiCheckLine className='size-6 text-primary-500 flex-shrink-0' />
            <div>
              <p className='text-paragraph-xs text-text-sub-600'>Team Members</p>
              <p className='text-label-sm font-medium'>{mockSubscriptionData.usage.teamMembers}</p>
            </div>
          </div>
        </div>

        {/* Plan Features - WIDER LAYOUT */}
        <div>
          <h4 className='text-label-sm font-medium mb-4'>Plan Features</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
            {mockSubscriptionData.plan.features.map((feature, index) => (
              <div key={index} className='flex items-center gap-2 text-paragraph-sm'>
                <RiCheckLine className='size-4 text-green-500 flex-shrink-0' />
                <span>{feature}</span>
              </div>
            ))}
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

        {/* Billing History Summary - WIDER LAYOUT */}
        <div className='p-6 rounded-lg bg-bg-soft-100'>
          <h4 className='text-label-sm font-medium mb-4'>Billing History</h4>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center'>
            <div className='p-4 rounded-lg bg-bg-white-0'>
              <p className='text-title-h4 text-text-strong-950'>{mockSubscriptionData.billingHistory.totalInvoices}</p>
              <p className='text-paragraph-xs text-text-sub-600'>Total Invoices</p>
            </div>
            <div className='p-4 rounded-lg bg-bg-white-0'>
              <p className='text-title-h4 text-text-strong-950'>{mockSubscriptionData.billingHistory.lastPayment}</p>
              <p className='text-paragraph-xs text-text-sub-600'>Last Payment</p>
            </div>
            <div className='p-4 rounded-lg bg-bg-white-0'>
              <p className='text-title-h4 text-text-strong-950'>${mockSubscriptionData.billingHistory.lastAmount}</p>
              <p className='text-paragraph-xs text-text-sub-600'>Last Amount</p>
            </div>
          </div>
        </div>
      </WidgetBox.Root>

      {/* Additional Information - WIDER LAYOUT */}
      <div className='p-6 rounded-lg bg-bg-soft-100 max-w-none'>
        <h4 className='text-label-sm font-medium mb-3'>Need Help?</h4>
        <p className='text-paragraph-sm text-text-sub-600 mb-4'>
          If you need to upgrade, downgrade, or have questions about your subscription, 
          you can manage everything through the Stripe Customer Portal or contact our support team.
        </p>
        <div className='flex flex-col sm:flex-row gap-3'>
          <Button.Root variant='neutral' mode='stroke' size='small' className='flex-1'>
            Contact Support
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' size='small' className='flex-1'>
            View Billing History
          </Button.Root>
        </div>
      </div>
    </div>
  );
}