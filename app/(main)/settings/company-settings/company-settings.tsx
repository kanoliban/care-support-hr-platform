'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
// import * as Textarea from '@/components/ui/textarea';

export default function CompanySettings() {
  const uniqueId = React.useId();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Care Profile Settings</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Configure your care profile and organization details for coordination.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex gap-5'>
        <div className='w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center'>
          <span className='text-primary-600 font-medium text-xl'>RC</span>
        </div>
        <div className='space-y-3 flex-1'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-care-profile-name`}>
              Care Profile Name <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Input
                id={`${uniqueId}-care-profile-name`}
                placeholder="Rob's Care Team"
              />
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-care-description`}>
              Care Profile Description
            </Label.Root>
            <Input.Root>
              <Input.Input
                id={`${uniqueId}-care-description`}
                placeholder='Describe your care needs, team, and coordination requirements...'
              />
            </Input.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-primary-address`}>
            Primary Care Address <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-primary-address`}
              placeholder='123 Main Street, City, State 12345'
            />
          </Input.Root>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-city`}>
              City <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Input id={`${uniqueId}-city`} placeholder='City' />
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-state`}>
              State <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Input id={`${uniqueId}-state`} placeholder='State' />
            </Input.Root>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-zip`}>
              ZIP Code <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Input id={`${uniqueId}-zip`} placeholder='12345' />
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor={`${uniqueId}-country`}>
              Country <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Input id={`${uniqueId}-country`} placeholder='United States' />
            </Input.Root>
          </div>
        </div>
      </div>

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Discard Changes
        </Button.Root>
        <Button.Root>Save Settings</Button.Root>
      </div>
    </div>
  );
}