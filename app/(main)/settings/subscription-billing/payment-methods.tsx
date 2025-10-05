'use client';

import { RiBankCardLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';

export default function PaymentMethods() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Payment Methods</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Manage your payment methods and billing information
        </p>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-lg bg-bg-weak-50'>
              <RiBankCardLine className='size-5 text-text-sub-600' />
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

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Add Payment Method
        </Button.Root>
        <Button.Root>
          Manage Methods
        </Button.Root>
      </div>
    </div>
  );
}
