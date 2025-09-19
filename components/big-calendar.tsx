'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiGlobalLine,
  RiMapPin2Fill,
} from '@remixicon/react';
import CareEventDialog from './care-event-dialog';
import EventDetailsModal from './event-details-modal';
import { useCareEvents } from '@/hooks/useCareEvents';
import {
  addDays,
  addHours,
  differenceInMinutes,
  endOfHour,
  format,
  isSameDay,
  isSameHour,
  setHours,
  setMinutes,
  setSeconds,
  startOfHour,
  subDays,
  isToday,
  getHours,
  getMinutes,
} from 'date-fns';

import { cn, cnExt, type ClassValue } from '@/utils/cn';
import { type AvatarRootProps } from '@/components/ui/avatar';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';

const getHourRange = (
  calendarData: CalendarData[],
): { earliestHour: number; latestHour: number } => {
  const startTimes = calendarData.map((event) => startOfHour(event.startDate));
  const endTimes = calendarData.map((event) => endOfHour(event.endDate));
  const earliestHour = Math.min(...startTimes.map((date) => date.getHours()));
  const latestHour = Math.max(...endTimes.map((date) => date.getHours()));

  return { earliestHour, latestHour };
};

const generateHours = (startHour: number, endHour: number): string[] => {
  const hours = [];
  for (let i = startHour; i <= endHour; i++) {
    const date = setSeconds(setMinutes(setHours(new Date(), i), 0), 0);
    hours.push(date.toISOString());
  }
  return hours;
};

const ensureMinimumHours = (
  hours: string[],
  minHours: number = 6,
): string[] => {
  if (hours.length >= minHours) {
    return hours;
  }

  const firstHour = new Date(hours[0]);
  const lastHour = new Date(hours[hours.length - 1]);

  while (hours.length < minHours) {
    firstHour.setHours(firstHour.getHours() - 1);
    hours.unshift(firstHour.toISOString());

    lastHour.setHours(lastHour.getHours() + 1);
    hours.push(lastHour.toISOString());
  }

  return hours;
};

type GroupedCalendarData = {
  groupDateStart: Date;
  groupDateEnd: Date;
  events: CalendarData[];
}[];

/**
 * Groups calendar events by hour. Events that start within the same hour
 * or overlap within an hour are grouped together.
 *
 * @param {CalendarData[]} events - Array of calendar events to be grouped.
 * @returns {GroupedCalendarData} - Array of grouped events with group start and end times.
 *
 * @example
 * // 9 AM - 9:30 AM and 9:30 AM - 10 AM will be grouped together.
 * // 9 AM - 9:15 AM and 9:15 AM - 9:45 AM will be grouped together.
 * // 10 AM - 10:30 AM and 10:15 AM - 10:45 AM will be grouped together.
 * // 11 AM - 11:30 AM and 11:45 AM - 12 PM will be grouped together.
 * // 1 PM - 1:30 PM and 1:15 PM - 1:45 PM will be grouped together.
 * // 2 PM - 2:30 PM and 2:45 PM - 3:15 PM will NOT be grouped together.
 */
const groupEventsByHour = (events: CalendarData[]): GroupedCalendarData => {
  const sortedEvents = events
    .slice()
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const groupedEvents: GroupedCalendarData = [];

  for (const event of sortedEvents) {
    // Find if there is already a group for this hour
    const existingGroup = groupedEvents.find(
      ({ groupDateStart, groupDateEnd }) =>
        isSameHour(event.startDate, groupDateStart) &&
        (isSameHour(event.endDate, groupDateEnd) ||
          event.endDate < groupDateEnd),
    );

    if (existingGroup) {
      // If there is an existing group, add the event to that group
      existingGroup.events.push(event);
      // Update groupDateEnd to the latest endDate in the group
      if (event.endDate > existingGroup.groupDateEnd) {
        existingGroup.groupDateEnd = event.endDate;
      }
    } else {
      // Create a new group for this hour
      groupedEvents.push({
        groupDateStart: event.startDate,
        groupDateEnd: event.endDate,
        events: [event],
      });
    }
  }

  return groupedEvents;
};

export type CalendarData = {
  startDate: Date;
  endDate: Date;
  title?: string;
  type?: 'meeting' | 'event' | 'default';
  location?: string;
  link?: string;
  platform?: string;
  people?: {
    image: string;
    alt: string;
    color?: AvatarRootProps['color'];
  }[];
  completed?: boolean;
  disabled?: boolean;
};

type CalendarEventItemProps = CalendarData & {
  isTiny?: boolean;
  onClick?: () => void;
};

const bgColors: Partial<Record<NonNullable<CalendarData['type']>, string>> = {
  meeting: 'bg-information-lighter',
  event: 'bg-warning-lighter',
  default: 'bg-away-lighter',
};

function CalendarEventItem({
  startDate,
  endDate,
  type = 'default',
  completed,
  title,
  link,
  location,
  people,
  platform,
  isTiny,
  onClick,
}: CalendarEventItemProps) {
  return (
    <div
      onClick={onClick}
      className={cnExt(
        'flex min-h-0 w-full min-w-0 flex-col gap-2 overflow-hidden rounded-lg px-3 py-2',
        'backdrop-blur-xl cursor-pointer hover:opacity-80 transition-opacity',
        bgColors[type],
        {
          'bg-bg-weak-50': completed,
        },
      )}
    >
      <div className='space-y-1'>
        <div
          className={cn('text-label-xs', {
            truncate: isTiny,
            'text-text-strong-950': !completed,
            'text-text-sub-600': completed,
          })}
        >
          {title}
        </div>
        <div className='text-subheading-2xs text-text-sub-600'>
          {`${format(startDate, 'h:mm')} - ${format(endDate, 'h:mm aa')}`}
        </div>
      </div>
      {(location || link || people || platform) && !isTiny && (
        <div className='mt-auto space-y-1'>
          {location && (
            <div className='flex items-center gap-1.5'>
              <RiMapPin2Fill className='size-4 shrink-0 text-warning-base' />
              <div className='truncate text-paragraph-xs'>{location}</div>
            </div>
          )}
          {link && (
            <div className='flex items-center gap-1.5'>
              <RiGlobalLine className='size-4 shrink-0 text-warning-base' />
              <div className='truncate text-paragraph-xs'>{link}</div>
            </div>
          )}
          {(people || platform) && (
            <div className='flex items-center justify-between'>
              {people && (
                <div className='flex items-center gap-1.5'>
                  <AvatarGroup.Root size='20'>
                    {people.slice(0, 3).map(({ image, alt, color }, i) => (
                      <Avatar.Root key={i} color={color}>
                        <Avatar.Image src={image} alt={alt} />
                      </Avatar.Root>
                    ))}
                  </AvatarGroup.Root>
                  {people.length > 3 && (
                    <div className='text-paragraph-xs text-text-sub-600'>
                      +{people.length - 3}
                    </div>
                  )}
                </div>
              )}
              {platform && (
                <div className='text-paragraph-xs text-text-sub-600'>
                  {platform}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarDisabledHourItem({}: Pick<
  CalendarData,
  'startDate' | 'endDate'
>) {
  return <div className='calendar-disabled-hour -m-2 min-w-0' />;
}

type BigCalendarProps = {
  defaultStartDate: Date;
  totalShowingDays?: number;
  className?: ClassValue;
  events: CalendarData[];
  showAllHours?: boolean;
};

export function BigCalendar({
  defaultStartDate,
  totalShowingDays = 6,
  events,
  showAllHours = true, // Default to showing all hours
  className,
}: BigCalendarProps) {
  // Debug logging
  console.log('BigCalendar received events:', events);
  const { events: careEvents, getEventsByDateRange } = useCareEvents();
  const [currentStartDate, setCurrentStartDate] =
    React.useState(defaultStartDate);
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<Date>(new Date());
  
  // Current time for the time indicator line
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Event details modal state
  const [isEventDetailsOpen, setIsEventDetailsOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarData | null>(null);
  
  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Sync internal state with prop changes (for Today button functionality)
  React.useEffect(() => {
    setCurrentStartDate(defaultStartDate);
  }, [defaultStartDate]);

  const showingDays = Array.from({ length: totalShowingDays }, (_, i) =>
    addDays(currentStartDate, i),
  );

  let showingHours: string[] = [];

  // Always show full 24-hour range for better usability
  showingHours = generateHours(0, 23); // Full 24 hours (12 AM to 11 PM)

  const groupedEvents = groupEventsByHour(events);

  const handlePrevDay = () => {
    setCurrentStartDate(subDays(currentStartDate, 1));
  };

  const handleNextDay = () => {
    setCurrentStartDate(addDays(currentStartDate, 1));
  };

  const handleTimeSlotClick = (day: Date, hour: string) => {
    const hourDate = new Date(day);
    const [hourStr, period] = hour.split(' ');
    let hourNum = parseInt(hourStr);
    
    // Convert 12-hour to 24-hour format
    if (period === 'pm' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'am' && hourNum === 12) {
      hourNum = 0;
    }
    
    hourDate.setHours(hourNum, 0, 0, 0);
    
    setSelectedDate(day);
    setSelectedTime(hourDate);
    setIsEventDialogOpen(true);
  };

  const handleEventCreated = (eventId: string) => {
    console.log('Care event created:', eventId);
    // The care events context will automatically update the events list
    // and the calendar will re-render with the new events
  };

  const handleEventClick = (event: CalendarData) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEventEdit = (event: CalendarData) => {
    // For now, just log - we'll implement edit functionality later
    console.log('Edit event:', event);
    // TODO: Open edit modal with pre-filled data
  };

  const handleEventDelete = (event: CalendarData) => {
    // For now, just log - we'll implement delete functionality later
    console.log('Delete event:', event);
    // TODO: Remove event from events array
  };

  const handleEventToggleComplete = (event: CalendarData) => {
    // For now, just log - we'll implement toggle functionality later
    console.log('Toggle complete for event:', event);
    // TODO: Update event completion status
  };


  // Calculate current time position for the indicator line
  const getCurrentTimePosition = () => {
    const currentHour = getHours(currentTime);
    const currentMinute = getMinutes(currentTime);
    const totalMinutes = currentHour * 60 + currentMinute;
    
    // Calculate position as percentage of the day (assuming 24-hour display)
    const dayStartHour = 0; // Assuming calendar starts at midnight
    const dayEndHour = 24;
    const totalDayMinutes = (dayEndHour - dayStartHour) * 60;
    
    return (totalMinutes / totalDayMinutes) * 100;
  };

  // Helper function to get events for a specific day and hour
  const getEventsForTimeSlot = (day: Date, hour: string) => {
    const matchingEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const hourDate = new Date(hour); // Convert ISO string to Date
      const slotStart = new Date(day);
      slotStart.setHours(hourDate.getHours(), 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hourDate.getHours() + 1, 0, 0, 0);
      
      // Check if event overlaps with this time slot
      return eventStart < slotEnd && eventEnd > slotStart;
    });
    
    // Debug logging
    if (matchingEvents.length > 0) {
      const hourDate = new Date(hour);
      console.log(`Found ${matchingEvents.length} events for ${day.toDateString()} at ${hourDate.getHours()}:00`, matchingEvents);
    }
    
    return matchingEvents;
  };

  const handleCloseDialog = () => {
    setIsEventDialogOpen(false);
  };

  return (
    <div className='relative z-20 -mx-4 overflow-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0'>
      <div className={cnExt('w-fit bg-bg-white-0 lg:w-full', className)}>
        <div className='flex overflow-clip rounded-xl border border-stroke-soft-200 lg:overflow-auto'>
          {/* Left Navigation Panel */}
          <div className='sticky -left-4 z-30 -ml-px w-[104px] shrink-0 overflow-hidden border-x border-stroke-soft-200 bg-bg-white-0 lg:left-0 lg:border-l-0'>
            {/* Navigation Arrows - Now replace the month/year cell */}
            <div className='grid h-8 w-full shrink-0 grid-cols-2 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200 bg-bg-weak-50'>
              <button
                type='button'
                onClick={() => handlePrevDay()}
                className='flex items-center justify-center bg-bg-weak-50 hover:bg-bg-weak-100'
              >
                <RiArrowLeftSLine className='size-5 text-text-sub-600' />
              </button>
              <button
                type='button'
                onClick={() => handleNextDay()}
                className='flex items-center justify-center bg-bg-weak-50 hover:bg-bg-weak-100'
              >
                <RiArrowRightSLine className='size-5 text-text-sub-600' />
              </button>
            </div>
            
            
            {/* Time Labels Column - Now starts immediately after navigation */}
            <div className='space-y-0'>
              {/* 24-Hour Time Labels */}
              {showingHours.map((hour, index) => (
                <div key={index} className='h-16 flex items-center justify-center border-b border-stroke-soft-200'>
                  <div className='text-label-sm text-text-sub-600'>
                    {format(hour, 'h aa')}
                  </div>
                </div>
              ))}
              
              {/* Footer spacer */}
              <div className='h-10'></div>
            </div>
          </div>

          {/* Main Calendar Area */}
          <div className='flex-1'>
            {/* Day Headers - Now aligned with navigation arrows */}
            <div className='sticky top-0 z-20 overflow-hidden rounded-tr-xl bg-bg-white-0'>
              <header className='flex divide-x divide-stroke-soft-200'>
                {showingDays.map((day, index) => (
                  <div
                    key={index}
                    className={`flex h-8 w-[200px] items-center justify-center border-b border-stroke-soft-200 text-center text-label-xs ${
                      isToday(day) 
                        ? 'bg-primary-lighter text-primary-dark font-medium' 
                        : 'bg-bg-weak-50 text-text-soft-400'
                    }`}
                  >
                    {format(day, 'EEE, MMM dd').toUpperCase()}
                  </div>
                ))}
              </header>
            </div>

            {/* Calendar Grid Area - 24-hour timeline */}
            <div className='relative'>
              {/* Current Time Indicator Line */}
              {(() => {
                const timePosition = getCurrentTimePosition();
                const isTodayVisible = showingDays.some(day => isToday(day));
                
                if (isTodayVisible) {
                  return (
                    <div 
                      className='absolute left-0 right-0 h-0.5 bg-red-500 z-10 pointer-events-none'
                      style={{ top: `${timePosition}%` }}
                    />
                  );
                }
                return null;
              })()}
              
              {/* 24-Hour Grid Structure */}
              <div className='grid grid-cols-6 divide-x divide-stroke-soft-200'>
                {/* Generate 6 day columns */}
                {showingDays.map((day, dayIndex) => (
                  <div key={dayIndex} className='relative'>
                    {/* Generate 24 hour rows */}
                    {showingHours.map((hour, hourIndex) => (
                      <div
                        key={hourIndex}
                        onClick={() => handleTimeSlotClick(day, format(hour, 'h aa'))}
                        className={`h-16 border-b border-stroke-soft-200 transition-colors cursor-pointer relative ${
                          isToday(day)
                            ? 'bg-primary-lighter/20 hover:bg-primary-lighter/40'
                            : 'bg-bg-white-0 hover:bg-bg-weak-50'
                        }`}
                      >
                          {/* Render events for this time slot */}
                          {getEventsForTimeSlot(day, hour).map((event, eventIndex) => (
                            <CalendarEventItem
                              key={`${event.title}-${eventIndex}`}
                              {...event}
                              isTiny={true}
                              onClick={() => handleEventClick(event)}
                            />
                          ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
          {/* Care Event Creation Dialog */}
          <CareEventDialog
            isOpen={isEventDialogOpen}
            onClose={handleCloseDialog}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onEventCreated={handleEventCreated}
          />
          
          {/* Event Details Modal */}
          <EventDetailsModal
            isOpen={isEventDetailsOpen}
            onClose={() => setIsEventDetailsOpen(false)}
            event={selectedEvent}
            onEdit={handleEventEdit}
            onDelete={handleEventDelete}
            onToggleComplete={handleEventToggleComplete}
          />
        </div>
      );
    }
