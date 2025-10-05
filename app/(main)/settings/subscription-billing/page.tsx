'use client';

import * as React from 'react';
import { RiCreditCard2Line, RiBillLine, RiShieldCheckLine, RiDownloadLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import * as Badge from '@/components/ui/badge';
import WidgetSubscription from '@/components/widgets/widget-subscription';

export default function SubscriptionBillingPage() {
  return (
    <div className='space-y-6'>
      {/* Current Subscription Status */}
      <Card.Root>
        <Card.Header>
          <Card.Title className='flex items-center gap-2'>
            <RiCreditCard2Line className='size-5' />
            Current Subscription
          </Card.Title>
          <Card.Description>
            Manage your CareSupport subscription and billing preferences
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <WidgetSubscription />
        </Card.Content>
      </Card.Root>

      {/* Billing History */}
      <Card.Root>
        <Card.Header>
          <Card.Title className='flex items-center gap-2'>
            <RiBillLine className='size-5' />
            Billing History
          </Card.Title>
          <Card.Description>
            View and download your past invoices and payment history
          </Card.Description>
        </Card.Header>
        <Card.Content className='space-y-4'>
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
        </Card.Content>
      </Card.Root>

      {/* Payment Methods */}
      <Card.Root>
        <Card.Header>
          <Card.Title className='flex items-center gap-2'>
            <RiShieldCheckLine className='size-5' />
            Payment Methods
          </Card.Title>
          <Card.Description>
            Manage your payment methods and billing information
          </Card.Description>
        </Card.Header>
        <Card.Content className='space-y-4'>
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
        </Card.Content>
      </Card.Root>

      {/* Billing Information */}
      <Card.Root>
        <Card.Header>
          <Card.Title>Billing Information</Card.Title>
          <Card.Description>
            Update your billing address and tax information
          </Card.Description>
        </Card.Header>
        <Card.Content className='space-y-4'>
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
        </Card.Content>
      </Card.Root>
    </div>
  );
}
