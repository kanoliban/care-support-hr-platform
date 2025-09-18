'use client';

import * as React from 'react';
import { RiMagicFill } from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Divider from '@/components/ui/divider';
import { upcomingIntegrations } from '@/app/(main)/integrations/data';
import type { IntegrationItem } from '@/app/(main)/integrations/data';

import { IntegrationCard } from './integration-card';

export default function Upcoming() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Coming Soon</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Advanced integrations coming to enhance your care management experience.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        {upcomingIntegrations.map((integration) => (
          <IntegrationCard key={integration.id} soon {...integration} />
        ))}

        <Alert.Root variant='lighter' status='feature' size='small'>
          <Alert.Icon as={RiMagicFill} />
          These advanced care integrations are in development and will be available soon.
        </Alert.Root>
      </div>
    </div>
  );
}
