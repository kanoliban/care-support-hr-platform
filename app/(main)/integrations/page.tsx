'use client';

import * as React from 'react';
import { RiAddLine, RiEqualizerLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import Header from '@/app/(main)/header';

import { availableIntegrations, upcomingIntegrations, type IntegrationItem } from './data';
import { IntegrationsFilters } from './filters';
import { IntegrationsGrid } from './grid';

const upcomingIntegrationsExtended = upcomingIntegrations.map((item) => ({
  ...item,
  soon: true,
}));

export default function PageIntegrations() {
  const [filterStatus, setFilterStatus] = React.useState('all-apps');
  const [searchQuery, setSearchQuery] = React.useState('');

  const allIntegrations = [...availableIntegrations, ...upcomingIntegrationsExtended];

  const filteredIntegrations = React.useMemo(() => {
    let filtered = allIntegrations;

    // Filter by connection status
    if (filterStatus === 'connected') {
      filtered = filtered.filter(integration => integration.isActive);
    } else if (filterStatus === 'disconnected') {
      filtered = filtered.filter(integration => !integration.isActive);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(integration =>
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [filterStatus, searchQuery, allIntegrations]);

  const availableFiltered = filteredIntegrations.filter(integration => integration.isActive);
  const upcomingFiltered = filteredIntegrations.filter(integration => !integration.isActive);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEqualizerLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Care Connections'
        description='Connect your care tools and services to streamline coordination between families and caregivers.'
      >
        <Button.Root className='w-full md:w-auto'>
          <Button.Icon as={RiAddLine} />
          Connect Service
        </Button.Root>
      </Header>

      <div className='hidden px-4 lg:block lg:px-8'>
        <Divider.Root />
      </div>

      <div className='flex flex-1 flex-col px-4 pb-6 lg:px-8 lg:pt-5'>
        <IntegrationsFilters 
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {availableFiltered.length > 0 && (
          <IntegrationsGrid
            title='Available Now'
            description='Connect these services today to streamline your care coordination.'
            integrations={availableFiltered}
          />
        )}
        
        {upcomingFiltered.length > 0 && (
          <IntegrationsGrid
            title='Coming Soon'
            description='Advanced integrations coming to enhance your care management experience.'
            integrations={upcomingFiltered}
          />
        )}
      </div>
    </>
  );
}
