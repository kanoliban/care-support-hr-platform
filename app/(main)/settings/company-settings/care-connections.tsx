'use client';

import * as React from 'react';
import { RiAddLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';

export default function CareConnections() {
  const uniqueId = React.useId();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Care Connections</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Connect with healthcare providers, medical systems, and care resources.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-primary-physician`}>
            Primary Care Physician <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-primary-physician`}
              placeholder='Dr. Sarah Johnson - Family Medicine'
            />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-specialist`}>
            Primary Specialist <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-specialist`}
              placeholder='Dr. Michael Chen - Neurology'
            />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-pharmacy`}>
            Preferred Pharmacy <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-pharmacy`}
              placeholder='CVS Pharmacy - Main Street Location'
            />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-hospital`}>
            Preferred Hospital <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-hospital`}
              placeholder='Regional Medical Center'
            />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-insurance`}>
            Insurance Provider <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-insurance`}
              placeholder='Blue Cross Blue Shield'
            />
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor={`${uniqueId}-care-coordinator`}>
            Care Coordinator <Label.Sub>(Optional)</Label.Sub>
          </Label.Root>
          <Input.Root>
            <Input.Input
              id={`${uniqueId}-care-coordinator`}
              placeholder='Jennifer Martinez - Care Management'
            />
          </Input.Root>
        </div>
      </div>

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Discard
        </Button.Root>
        <Button.Root>Save Connections</Button.Root>
      </div>
    </div>
  );
}
