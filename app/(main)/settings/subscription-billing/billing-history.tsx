'use client';

import { RiDownloadLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';

export default function BillingHistory() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Billing History</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          View and download your past invoices and payment history
        </p>
      </div>

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
  );
}
