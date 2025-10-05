'use client';

import * as React from 'react';
import { RiCreditCard2Line, RiBillLine, RiShieldCheckLine, RiDownloadLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import * as Divider from '@/components/ui/divider';
import WidgetSubscription from '@/components/widgets/widget-subscription';

export default function SubscriptionBillingPage() {
  return (
    <div className='flex w-full flex-col gap-6'>
      {/* Current Subscription Status */}
      <div className='space-y-4'>
        <div>
          <div className='flex items-center gap-2 text-label-md'>
            <RiCreditCard2Line className='size-5' />
            Current Subscription
          </div>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage your CareSupport subscription and billing preferences
          </p>
        </div>

        <Divider.Root variant='line-spacing' />

        <WidgetSubscription />
      </div>

      {/* Billing History */}
      <div className='space-y-4'>
        <div>
          <div className='flex items-center gap-2 text-label-md'>
            <RiBillLine className='size-5' />
            Billing History
          </div>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            View and download your past invoices and payment history
          </p>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
            <div className='space-y-1'>
              <div className='text-label-sm font-medium'>CareSupport Pro - Monthly</div>
              <div className='text-paragraph-xs text-text-sub-600'>January 15, 2024</div>
            </div>
            <div className='flex items-center gap-3'>
              <Badge.Root variant='light' color='blue' size='medium'>
                Paid
              </Badge.Root>
              <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                <Button.Icon as={RiDownloadLine} />
                Download
              </Button.Root>
            </div>
          </div>
          
          <div className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
            <div className='space-y-1'>
              <div className='text-label-sm font-medium'>CareSupport Pro - Monthly</div>
              <div className='text-paragraph-xs text-text-sub-600'>December 15, 2023</div>
            </div>
            <div className='flex items-center gap-3'>
              <Badge.Root variant='light' color='blue' size='medium'>
                Paid
              </Badge.Root>
              <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                <Button.Icon as={RiDownloadLine} />
                Download
              </Button.Root>
            </div>
          </div>

          <div className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
            <div className='space-y-1'>
              <div className='text-label-sm font-medium'>CareSupport Pro - Monthly</div>
              <div className='text-paragraph-xs text-text-sub-600'>November 15, 2023</div>
            </div>
            <div className='flex items-center gap-3'>
              <Badge.Root variant='light' color='blue' size='medium'>
                Paid
              </Badge.Root>
              <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                <Button.Icon as={RiDownloadLine} />
                Download
              </Button.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className='space-y-4'>
        <div>
          <div className='flex items-center gap-2 text-label-md'>
            <RiShieldCheckLine className='size-5' />
            Payment Methods
          </div>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Manage your payment methods and billing information
          </p>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-4'>
          <div className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 items-center justify-center rounded-lg bg-bg-weak-50'>
                <RiCreditCard2Line className='size-5 text-text-sub-600' />
              </div>
              <div className='space-y-1'>
                <div className='text-label-sm font-medium'>•••• •••• •••• 4242</div>
                <div className='text-paragraph-xs text-text-sub-600'>Expires 12/25</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge.Root variant='light' color='blue' size='medium'>
                Default
              </Badge.Root>
              <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                Edit
              </Button.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div className='space-y-4'>
        <div>
          <div className='text-label-md'>Billing Information</div>
          <p className='mt-1 text-paragraph-sm text-text-sub-600'>
            Update your billing address and tax information
          </p>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-label-sm font-medium'>Billing Name</label>
              <div className='text-paragraph-sm text-text-sub-600'>CareSupport Organization</div>
            </div>
            <div className='space-y-2'>
              <label className='text-label-sm font-medium'>Email</label>
              <div className='text-paragraph-sm text-text-sub-600'>billing@caresupport.org</div>
            </div>
            <div className='space-y-2 md:col-span-2'>
              <label className='text-label-sm font-medium'>Billing Address</label>
              <div className='text-paragraph-sm text-text-sub-600'>
                123 Care Street<br />
                Minneapolis, MN 55401<br />
                United States
              </div>
            </div>
          </div>
          <Button.Root variant='neutral' mode='stroke' size='small'>
            Update Billing Information
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
