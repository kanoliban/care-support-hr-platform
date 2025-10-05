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

        <div className='space-y-6'>
          {/* Billing Information */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='flex items-center gap-4 p-4 rounded-lg bg-bg-soft-200'>
              <RiCalendarLine className='size-6 text-primary-500' />
              <div>
                <p className='text-paragraph-sm text-text-sub-600'>Next Billing Date</p>
                <p className='text-label-md font-medium'>{mockSubscriptionData.nextBillingDate}</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-4 rounded-lg bg-bg-soft-200'>
              <RiBankCardLine className='size-6 text-primary-500' />
              <div>
                <p className='text-paragraph-sm text-text-sub-600'>Next Billing Amount</p>
                <p className='text-label-md font-medium'>${mockSubscriptionData.nextBillingAmount}</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-4 rounded-lg bg-bg-soft-200'>
              <RiSparklingLine className='size-6 text-primary-500' />
              <div>
                <p className='text-paragraph-sm text-text-sub-600'>Plan Status</p>
                <p className='text-label-md font-medium'>{getStatusBadge(mockSubscriptionData.status)}</p>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div>
            <h4 className='text-label-md font-medium mb-4'>Plan Features</h4>
            <ul className='space-y-3 rounded-xl bg-bg-soft-100 p-6 text-paragraph-sm text-text-strong-950'>
              {mockSubscriptionData.plan.features.map((feature, index) => (
                <li key={index} className='flex items-center gap-3'>
                  <RiCheckLine className='size-5 text-primary-500' />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Statistics */}
          <div>
            <h4 className='text-label-md font-medium mb-4'>Usage Statistics</h4>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='p-5 rounded-lg border border-stroke-soft-200 bg-bg-white-0'>
                <p className='text-paragraph-sm text-text-sub-600 mb-2'>Families Managed</p>
                <p className='text-title-h4 text-text-strong-950'>
                  {mockSubscriptionData.usage.familiesManaged}
                  <span className='text-paragraph-md text-text-sub-600 ml-2'>
                    / {mockSubscriptionData.usage.maxFamilies}
                  </span>
                </p>
              </div>
              <div className='p-5 rounded-lg border border-stroke-soft-200 bg-bg-white-0'>
                <p className='text-paragraph-sm text-text-sub-600 mb-2'>Team Members</p>
                <p className='text-title-h4 text-text-strong-950'>
                  {mockSubscriptionData.usage.teamMembers}
                  <span className='text-paragraph-md text-text-sub-600 ml-2'>
                    / {mockSubscriptionData.usage.maxTeamMembers}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col lg:flex-row gap-4 pt-2'>
            <Button.Root
              variant='primary'
              mode='filled'
              size='large'
              className='flex-1 justify-center gap-3 py-3'
              onClick={handleManageSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='inline-flex size-5 animate-spin rounded-full border-[2px] border-primary-base/40 border-t-transparent' />
                  Loading...
                </>
              ) : (
                <>
                  <RiBankCardLine className='size-5' />
                  Manage Subscription
                </>
              )}
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='large'
              className='flex-1 justify-center gap-3 py-3'
            >
              <RiSparklingLine className='size-5' />
              View All Plans
            </Button.Root>
          </div>

          {/* Billing History Summary */}
          <div className='p-6 rounded-lg bg-bg-soft-100'>
            <h4 className='text-label-md font-medium mb-4'>Billing History</h4>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 text-center'>
              <div className='p-4 rounded-lg bg-bg-white-0'>
                <p className='text-title-h4 text-text-strong-950'>{mockSubscriptionData.billingHistory.totalInvoices}</p>
                <p className='text-paragraph-sm text-text-sub-600 mt-1'>Total Invoices</p>
              </div>
              <div className='p-4 rounded-lg bg-bg-white-0'>
                <p className='text-title-h4 text-text-strong-950'>{mockSubscriptionData.billingHistory.lastPayment}</p>
                <p className='text-paragraph-sm text-text-sub-600 mt-1'>Last Payment</p>
              </div>
              <div className='p-4 rounded-lg bg-bg-white-0'>
                <p className='text-title-h4 text-text-strong-950'>${mockSubscriptionData.billingHistory.lastAmount}</p>
                <p className='text-paragraph-sm text-text-sub-600 mt-1'>Last Amount</p>
              </div>
            </div>
          </div>
        </div>
      </WidgetBox.Root>

      {/* Additional Information */}
      <div className='p-6 rounded-lg bg-bg-soft-100'>
        <h4 className='text-label-md font-medium mb-4'>Need Help?</h4>
        <p className='text-paragraph-md text-text-sub-600 mb-6'>
          If you need to upgrade, downgrade, or have questions about your subscription, 
          you can manage everything through the Stripe Customer Portal or contact our support team.
        </p>
        <div className='flex flex-col lg:flex-row gap-4'>
          <Button.Root variant='neutral' mode='stroke' size='medium' className='flex-1 justify-center'>
            Contact Support
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' size='medium' className='flex-1 justify-center'>
            View Billing History
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
