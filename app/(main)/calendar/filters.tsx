'use client';

import * as React from 'react';
import { format, startOfWeek, endOfWeek, addDays, subDays, startOfMonth, endOfMonth, addMonths, subMonths, addWeeks, subWeeks } from 'date-fns';
import {
  RiArrowDownSLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiFilter3Fill,
  RiLayoutGridLine,
  RiSearch2Line,
  RiSettings2Line,
  RiTimeLine,
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
  currentView?: 'month' | 'week';
  onViewChange?: (view: 'month' | 'week') => void;
}

export default function CalendarFilters({ 
  onDateRangeChange, 
  onTodayClick,
  searchQuery = '',
  onSearchChange,
  currentView = 'week',
  onViewChange
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


  const handleDateRangeClick = () => {
    // For now, just cycle through different ranges
    // In a real implementation, this would open a date picker
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const startOfNextWeek = startOfWeek(nextWeek, { weekStartsOn: 1 });
    const endOfNextWeek = endOfWeek(nextWeek, { weekStartsOn: 1 });
    const newRange = { start: startOfNextWeek, end: endOfNextWeek };
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const handlePreviousPeriod = () => {
    let newRange;
    if (currentView === 'month') {
      const prevMonth = subMonths(currentDateRange.start, 1);
      newRange = { 
        start: startOfMonth(prevMonth), 
        end: endOfMonth(prevMonth) 
      };
    } else {
      const prevWeek = subWeeks(currentDateRange.start, 1);
      newRange = { 
        start: startOfWeek(prevWeek, { weekStartsOn: 1 }), 
        end: endOfWeek(prevWeek, { weekStartsOn: 1 }) 
      };
    }
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const handleNextPeriod = () => {
    let newRange;
    if (currentView === 'month') {
      const nextMonth = addMonths(currentDateRange.start, 1);
      newRange = { 
        start: startOfMonth(nextMonth), 
        end: endOfMonth(nextMonth) 
      };
    } else {
      const nextWeek = addWeeks(currentDateRange.start, 1);
      newRange = { 
        start: startOfWeek(nextWeek, { weekStartsOn: 1 }), 
        end: endOfWeek(nextWeek, { weekStartsOn: 1 }) 
      };
    }
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
  };

  const handleViewChange = (view: 'month' | 'week') => {
    let newRange;
    if (view === 'month') {
      newRange = { 
        start: startOfMonth(currentDateRange.start), 
        end: endOfMonth(currentDateRange.start) 
      };
    } else {
      newRange = { 
        start: startOfWeek(currentDateRange.start, { weekStartsOn: 1 }), 
        end: endOfWeek(currentDateRange.start, { weekStartsOn: 1 }) 
      };
    }
    
    setCurrentDateRange(newRange);
    onDateRangeChange?.(newRange.start, newRange.end);
    onViewChange?.(view);
  };

  const formatDateRange = () => {
    if (currentView === 'month') {
      return format(currentDateRange.start, 'MMMM yyyy');
    } else {
      return `${format(currentDateRange.start, 'MMM dd')} - ${format(currentDateRange.end, 'MMM dd yyyy')}`;
    }
  };
  return (
    <div className='-mt-1 flex flex-col justify-between gap-4 lg:mt-0 lg:flex-row lg:flex-wrap lg:gap-3'>
      {/* View Navigation Controls */}
      <div className='flex items-center gap-2'>
        <Button.Root 
          variant='neutral' 
          mode='stroke' 
          size='small'
          onClick={handlePreviousPeriod}
        >
          <Button.Icon as={RiArrowLeftSLine} />
        </Button.Root>
        
        <ButtonGroup.Root size='small'>
          <ButtonGroup.Item 
            onClick={() => handleViewChange('week')}
            className={currentView === 'week' ? 'bg-primary-50 text-primary-600' : ''}
          >
            <ButtonGroup.Icon as={RiTimeLine} />
            Week
          </ButtonGroup.Item>
          <ButtonGroup.Item 
            onClick={() => handleViewChange('month')}
            className={currentView === 'month' ? 'bg-primary-50 text-primary-600' : ''}
          >
            <ButtonGroup.Icon as={RiLayoutGridLine} />
            Month
          </ButtonGroup.Item>
        </ButtonGroup.Root>
        
        <Button.Root 
          variant='neutral' 
          mode='stroke' 
          size='small'
          onClick={handleNextPeriod}
        >
          <Button.Icon as={RiArrowRightSLine} />
        </Button.Root>
      </div>

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
