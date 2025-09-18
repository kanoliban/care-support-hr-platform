'use client';

import * as React from 'react';
import { RiInformationFill } from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Switch from '@/components/ui/switch';

export default function Preferences() {
  const uniqueId = React.useId();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Care Notification Preferences</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Choose what care-related notifications you want to receive.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        <div className='flex items-start gap-2'>
          <Switch.Root id={`${uniqueId}-news`} defaultChecked />
          <Label.Root
            className='flex-col items-start gap-1'
            htmlFor={`${uniqueId}-news`}
          >
            Care Updates and Announcements
            <div className='text-paragraph-xs text-text-sub-600'>
              Stay informed about the latest care updates, announcements, and important information.
            </div>
          </Label.Root>
        </div>

        <div className='flex items-start gap-2'>
          <Switch.Root id={`${uniqueId}-reminders`} defaultChecked />
          <Label.Root
            className='flex-col items-start gap-1'
            htmlFor={`${uniqueId}-reminders`}
          >
            Care Reminders and Appointments
            <div className='text-paragraph-xs text-text-sub-600'>
              Get reminders for upcoming care appointments, medication times, and important care activities.
            </div>
          </Label.Root>
        </div>

        <div className='flex items-start gap-2'>
          <Switch.Root id={`${uniqueId}-promotions`} />
          <Label.Root
            className='flex-col items-start gap-1'
            htmlFor={`${uniqueId}-promotions`}
          >
            Care Resources and Support
            <div className='text-paragraph-xs text-text-sub-600'>
              Receive notifications about care resources, support groups, educational materials, and helpful tips.
            </div>
          </Label.Root>
        </div>
      </div>

      <Alert.Root variant='lighter' status='information' size='xsmall'>
        <Alert.Icon as={RiInformationFill} />
        Maximize your care coordination by keeping important notification settings active.
      </Alert.Root>

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Discard
        </Button.Root>
        <Button.Root>Apply Changes</Button.Root>
      </div>
    </div>
  );
}
