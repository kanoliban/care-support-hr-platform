'use client';

import { RiFilter3Fill, RiSearch2Line, RiSortDesc } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Select from '@/components/ui/select';

// import IconCmd from '~/icons/icon-cmd.svg';

interface TasksTableFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  table: any;
}

export function TasksTableFilters({ 
  globalFilter, 
  setGlobalFilter, 
  statusFilter, 
  setStatusFilter, 
  table 
}: TasksTableFiltersProps) {
  return (
    <div className='flex flex-col justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3'>
      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input 
            placeholder='Search activities...' 
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
          } else {
            table.getColumn('status')?.setFilterValue(value);
          }
        }} 
        className='lg:w-[500px]'
      >
        <SegmentedControl.List className='gap-2'>
            <SegmentedControl.Trigger value='all' className='px-3'>All Tasks</SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='scheduled' className='px-3'>
            Scheduled
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='in_progress' className='px-3'>
            In Progress
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='completed' className='px-3'>
            Complete
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger value='overdue' className='px-3'>
            Overdue
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>

      <Input.Root size='small' className='w-[300px]'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input 
            placeholder='Search tasks...' 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <Kbd.Root>
            ⌘1
          </Kbd.Root>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}
