'use client';

import * as React from 'react';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Textarea from '@/components/ui/textarea';

export default function BillingInformation() {
  const uniqueId = React.useId();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Billing Information</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Update your billing address and tax information
        </p>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-billing-name`}>
            Billing Name <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`${uniqueId}-billing-name`}
                defaultValue='CareSupport Organization'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-billing-email`}>
            Billing Email <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`${uniqueId}-billing-email`}
                type='email'
                defaultValue='billing@caresupport.org'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-billing-address`}>
            Billing Address <Label.Asterisk />
          </Label.Root>
          <Textarea.Root
            className='min-h-[80px]'
            id={`${uniqueId}-billing-address`}
            defaultValue='123 Care Street&#10;Minneapolis, MN 55401&#10;United States'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-tax-id`}>
            Tax ID <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id={`${uniqueId}-tax-id`}
                placeholder='Enter your tax identification number'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Discard
        </Button.Root>
        <Button.Root>
          Update Billing Information
        </Button.Root>
      </div>
    </div>
  );
}
