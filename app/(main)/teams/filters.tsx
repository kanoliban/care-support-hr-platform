'use client';

import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

import IconCmd from '~/icons/icon-cmd.svg';

interface TeamsTableFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  table: any;
}

export function TeamsTableFilters({ 
  globalFilter, 
  setGlobalFilter, 
  statusFilter, 
  setStatusFilter, 
  table 
}: TeamsTableFiltersProps) {
  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input 
            placeholder='Search caregivers...' 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <button type='button'>
            <RiFilter3Fill className='size-5 text-text-soft-400' />
          </button>
        </Input.Wrapper>
      </Input.Root>

      <SegmentedControl.Root 
        value={statusFilter} 
        onValueChange={(value) => {
          setStatusFilter(value);
          if (value === 'all') {
            table.getColumn('status')?.setFilterValue(undefined);
          } else if (value === 'active') {
            table.getColumn('status')?.setFilterValue('Available');
          } else if (value === 'absent') {
            table.getColumn('status')?.setFilterValue('Unavailable');
          }
        }} 
        className='lg:w-80'
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger value='all'>All Caregivers</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='active'>
            Available
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='absent'>
            Unavailable
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <div className='hidden flex-wrap gap-3 min-[560px]:flex-nowrap lg:flex'>
        <Input.Root size='small' className='w-[300px]'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input 
              placeholder='Search caregivers...' 
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
          </Input.Wrapper>
        </Input.Root>

        <Button.Root
          variant='neutral'
          mode='stroke'
          size='small'
          className='flex-1 min-[560px]:flex-none'
        >
          <Button.Icon as={RiFilter3Fill} />
          Filter
        </Button.Root>

        <Select.Root size='small'>
          <Select.Trigger className='w-auto flex-1 min-[560px]:flex-none'>
            <Select.TriggerIcon as={RiSortDesc} />
            <Select.Value placeholder='Sort by' />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='asc'>ASC</Select.Item>
            <Select.Item value='desc'>DESC</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  );
}
