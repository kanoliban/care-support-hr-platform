'use client';

import * as React from 'react';
import { RiCheckLine, RiSparklingLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as WidgetBox from '@/components/widget-box';

interface SubscriptionStatusProps {
  plan: {
    name: string;
    description: string;
    price: number;
    billingCycle: string;
    features: string[];
  };
  status: 'active' | 'trial' | 'cancelled' | 'expired';
  nextBillingDate?: string;
  nextBillingAmount?: number;
  trialEndsAt?: string | null;
  onManageSubscription?: () => void;
  onViewPlans?: () => void;
  isLoading?: boolean;
}

export default function SubscriptionStatus({
  plan,
  status,
  nextBillingDate,
  nextBillingAmount,
  trialEndsAt,
  onManageSubscription,
  onViewPlans,
  isLoading = false,
}: SubscriptionStatusProps) {
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
            <RiCheckLine className='size-3' />
            Cancelled
          </Badge.Root>
        );
      case 'expired':
        return (
          <Badge.Root variant='light' color='orange' size='medium'>
            <RiCheckLine className='size-3' />
            Expired
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

  const isFeatured = plan.name === 'CareGiver OS';

  return (
    <WidgetBox.Root className={`flex flex-col gap-4 ${isFeatured ? 'ring-2 ring-primary-500' : ''}`}>
      <WidgetBox.Header>
        <div className='flex justify-between items-start w-full'>
          <div className='flex flex-col gap-1 flex-1'>
            <div className='flex items-center gap-2'>
              <WidgetBox.HeaderIcon 
                as={RiSparklingLine} 
                style={isFeatured ? { color: '#8b5cf6' } : {}} 
              />
              {plan.name}
            </div>
            <p className='text-paragraph-sm text-text-sub-600'>{plan.description}</p>
          </div>
          <div className='flex flex-col items-end gap-2'>
            {getStatusBadge(status)}
            <div className='text-right'>
              <span className='text-title-h4 text-text-strong-950'>${plan.price}</span>
              <p className='text-paragraph-xs text-text-sub-600'>per {plan.billingCycle}</p>
            </div>
          </div>
        </div>
      </WidgetBox.Header>

      <div className='space-y-4'>
        {/* Billing Information */}
        {(nextBillingDate || nextBillingAmount) && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {nextBillingDate && (
              <div className='flex items-center gap-3 p-3 rounded-lg bg-bg-soft-200'>
                <RiSparklingLine className='size-5 text-primary-500' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Date</p>
                  <p className='text-label-sm font-medium'>{nextBillingDate}</p>
                </div>
              </div>
            )}
            {nextBillingAmount && (
              <div className='flex items-center gap-3 p-3 rounded-lg bg-bg-soft-200'>
                <RiCheckLine className='size-5 text-primary-500' />
                <div>
                  <p className='text-paragraph-xs text-text-sub-600'>Next Billing Amount</p>
                  <p className='text-label-sm font-medium'>${nextBillingAmount}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trial Information */}
        {trialEndsAt && status === 'trial' && (
          <div className='p-3 rounded-lg bg-blue-50 border border-blue-200'>
            <p className='text-label-sm font-medium text-blue-900'>
              Trial ends on {trialEndsAt}
            </p>
            <p className='text-paragraph-xs text-blue-700 mt-1'>
              Your subscription will automatically renew unless cancelled.
            </p>
          </div>
        )}

        {/* Plan Features */}
        <div>
          <h4 className='text-label-sm font-medium mb-3'>Plan Features</h4>
          <ul className='space-y-2 rounded-xl bg-bg-soft-100 p-4 text-paragraph-sm text-text-strong-950'>
            {plan.features.map((feature, index) => (
              <li key={index} className='flex items-center gap-2'>
                <RiCheckLine className='size-4 text-primary-500' />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3'>
          {onManageSubscription && (
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              className='flex-1 justify-center gap-2'
              onClick={onManageSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className='inline-flex size-4 animate-spin rounded-full border-[2px] border-primary-base/40 border-t-transparent' />
                  Loading...
                </>
              ) : (
                <>
                  <RiSparklingLine className='size-4' />
                  Manage Subscription
                </>
              )}
            </Button.Root>
          )}
          {onViewPlans && (
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='medium'
              className='flex-1 justify-center gap-2'
              onClick={onViewPlans}
            >
              <RiSparklingLine className='size-4' />
              View All Plans
            </Button.Root>
          )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}
