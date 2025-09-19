'use client';

import * as React from 'react';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import {
  RiArrowDownSLine,
  RiCalendarLine,
  RiFilter3Fill,
  RiSearch2Line,
  RiSettings2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as ButtonGroup from '@/components/ui/button-group';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';

import IconCmd from '~/icons/icon-cmd.svg';

interface CalendarFiltersProps {
  onDateRangeChange?: (startDate: Date, endDate: Date) => void;
  onTodayClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function CalendarFilters({ 
  onDateRangeChange, 
  onTodayClick,
  searchQuery = '',
  onSearchChange 
}: CalendarFiltersProps) {
  const [currentDateRange, setCurrentDateRange] = React.useState(() => {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
    return { start: startOfWeekDate, end: endOfWeekDate };
  });

  const handleTodayClick = () => {
    const today = new Date();
    
    // Set the date range to show the week containing today
    const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(today, { weekStartsOn: 1 });
    const newRange = { start: startOfWeekDate, end: endOfWeekDate };
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
    
    // Tell the calendar to jump to today's specific date
    onTodayClick?.();
  };

  const [selectedDaysOption, setSelectedDaysOption] = React.useState('7');
  
  // Apply date range when selectedDaysOption changes
  React.useEffect(() => {
    const today = new Date();
    const daysAgo = parseInt(selectedDaysOption) - 1;
    const startDate = subDays(today, daysAgo);
    const newRange = { start: startDate, end: today };
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  }, [selectedDaysOption, onDateRangeChange]);

  // Initialize with current week when component mounts
  React.useEffect(() => {
    if (!currentDateRange.start) {
      const today = new Date();
      const initialRange = { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
      setCurrentDateRange(initialRange);
      onDateRangeChange?.(initialRange.start, initialRange.end);
    }
  }, [onDateRangeChange]);
  
  const handleLastDaysClick = () => {
    const today = new Date();
    const daysAgo = parseInt(selectedDaysOption) - 1;
    const startDate = subDays(today, daysAgo);
    const newRange = { start: startDate, end: today };
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const handleDaysOptionChange = () => {
    // Cycle through 7, 14, 30 days
    const options = ['7', '14', '30'];
    const currentIndex = options.indexOf(selectedDaysOption);
    const nextIndex = (currentIndex + 1) % options.length;
    setSelectedDaysOption(options[nextIndex]);
  };

  const [dateRangeIndex, setDateRangeIndex] = React.useState(0);
  
  const dateRangeOptions = [
    // Current week
    () => {
      const today = new Date();
      return { start: startOfWeek(today, { weekStartsOn: 1 }), end: endOfWeek(today, { weekStartsOn: 1 }) };
    },
    // Next week
    () => {
      const nextWeek = addDays(new Date(), 7);
      return { start: startOfWeek(nextWeek, { weekStartsOn: 1 }), end: endOfWeek(nextWeek, { weekStartsOn: 1 }) };
    },
    // This month
    () => {
      const today = new Date();
      return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: new Date(today.getFullYear(), today.getMonth() + 1, 0) };
    },
    // Next month
    () => {
      const today = new Date();
      return { start: new Date(today.getFullYear(), today.getMonth() + 1, 1), end: new Date(today.getFullYear(), today.getMonth() + 2, 0) };
    }
  ];

  const handleDateRangeClick = () => {
    const nextIndex = (dateRangeIndex + 1) % dateRangeOptions.length;
    setDateRangeIndex(nextIndex);
    const newRange = dateRangeOptions[nextIndex]();
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const formatDateRange = () => {
    return `${format(currentDateRange.start, 'MMM dd')} - ${format(currentDateRange.end, 'MMM dd yyyy')}`;
  };
  return (
    <div className='-mt-1 flex flex-col justify-between gap-4 lg:mt-0 lg:flex-row lg:flex-wrap lg:gap-3'>
      <div className='flex flex-row-reverse gap-3 lg:flex-row'>
        <Button.Root 
          variant='neutral' 
          mode='stroke' 
          size='small'
          onClick={handleTodayClick}
        >
          Today
        </Button.Root>

        <ButtonGroup.Root size='small' className='min-w-0'>
          <ButtonGroup.Item onClick={handleDaysOptionChange}>
            Last {selectedDaysOption} days
            <ButtonGroup.Icon as={RiArrowDownSLine} />
          </ButtonGroup.Item>
          <ButtonGroup.Item className='min-w-0' onClick={handleDateRangeClick}>
            <ButtonGroup.Icon as={RiCalendarLine} />
            <div className='truncate'>{formatDateRange()}</div>
          </ButtonGroup.Item>
        </ButtonGroup.Root>
      </div>

      <Input.Root className='lg:hidden'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input 
            placeholder='Search...' 
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          <button type='button'>
            <RiFilter3Fill className='size-5 text-text-soft-400' />
          </button>
        </Input.Wrapper>
      </Input.Root>

      <div className='hidden gap-3 lg:flex'>
        <div className='w-[300px] whitespace-nowrap'>
          <Input.Root size='small'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input 
                placeholder='Search...' 
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
              <Kbd.Root>
                <IconCmd className='size-2.5' />1
              </Kbd.Root>
            </Input.Wrapper>
          </Input.Root>
        </div>

        <Button.Root variant='neutral' mode='stroke' size='small'>
          <Button.Icon as={RiFilter3Fill} />
          Filter
        </Button.Root>

        <Button.Root variant='neutral' mode='stroke' size='small'>
          <Button.Icon as={RiSettings2Line} />
        </Button.Root>
      </div>
    </div>
  );
}
