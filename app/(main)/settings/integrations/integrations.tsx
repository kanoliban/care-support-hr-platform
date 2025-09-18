'use client';

import * as React from 'react';
import { RiAddLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { availableIntegrations } from '@/app/(main)/integrations/data';
import type { IntegrationItem } from '@/app/(main)/integrations/data';

import { IntegrationCard } from './integration-card';

export default function Integrations() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Care Connections</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Connect and sync with essential care coordination tools and platforms.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        {availableIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} {...integration} />
        ))}
      </div>

      <Button.Root mode='stroke' className='mt-1 w-full'>
        <Button.Icon as={RiAddLine} />
        Connect Service
      </Button.Root>
    </div>
  );
}
