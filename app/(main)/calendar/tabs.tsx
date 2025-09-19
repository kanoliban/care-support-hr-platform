'use client';

import * as React from 'react';
import * as AccordionPrimivites from '@radix-ui/react-accordion';
import {
  RemixiconComponentType,
  RiArrowDownSLine,
  RiCalendarEventLine,
  RiCloseCircleLine,
  RiDiscussLine,
  RiLayoutGridLine,
  RiSpamFill,
  RiSpamLine,
  RiTimeFill,
} from '@remixicon/react';
import { format, isToday, isPast, isFuture } from 'date-fns';

import { cn, cnExt } from '@/utils/cn';
import * as CompactButton from '@/components/ui/compact-button';
import * as LinkButton from '@/components/ui/link-button';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';

interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  title: string;
  type: 'meeting' | 'event';
  completed?: boolean;
  people?: Array<{
    alt: string;
    image: string;
    color?: string;
  }>;
  link?: string;
  location?: string;
}

interface CalendarTabsProps {
  className?: string;
  events: CalendarEvent[];
  onTabChange?: (tabValue: string, filteredEvents: CalendarEvent[]) => void;
}

// Function to categorize events and determine their status
const categorizeEvents = (events: CalendarEvent[]) => {
  const now = new Date();
  
  return events.map(event => {
    let statusType: 'success' | 'warning' | 'error' | 'neutral';
    let statusText: string;
    let buttonLabel: string | undefined;
    
    // Determine status based on event properties
    if (event.completed === false && isPast(event.endDate)) {
      // Past incomplete events are considered cancelled/missed
      statusType = 'error';
      statusText = 'Missed';
      buttonLabel = 'Reschedule';
    } else if (event.completed === true) {
      // Completed events
      statusType = 'success';
      statusText = 'Completed';
      buttonLabel = undefined;
    } else if (isToday(event.startDate)) {
      // Today's events
      statusType = 'success';
      statusText = 'Today';
      buttonLabel = event.type === 'meeting' ? 'Join Care Shift' : 'Join Event';
    } else if (isFuture(event.startDate)) {
      // Future events
      const daysDiff = Math.ceil((event.startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        statusType = 'warning';
        statusText = 'Tomorrow';
      } else if (daysDiff <= 3) {
        statusType = 'neutral';
        statusText = `${daysDiff} days later`;
      } else {
        statusType = 'neutral';
        statusText = format(event.startDate, 'MMM dd');
      }
      buttonLabel = undefined;
    } else {
      // Default case
      statusType = 'neutral';
      statusText = format(event.startDate, 'MMM dd');
      buttonLabel = undefined;
    }
    
    return {
      title: event.title,
      time: `${format(event.startDate, 'h:mm a')} - ${format(event.endDate, 'h:mm a')}`,
      status: {
        type: statusType,
        text: statusText,
        buttonLabel,
        icon: event.type === 'meeting' ? RiDiscussLine : RiCalendarEventLine,
      },
      originalEvent: event,
    };
  });
};

// Function to filter events by tab
const filterEventsByTab = (events: CalendarEvent[], tabValue: string) => {
  switch (tabValue) {
    case 'all':
      return events;
    case 'meetings':
      return events.filter(event => event.type === 'meeting');
    case 'events':
      return events.filter(event => event.type === 'event');
    case 'conflicted':
      // Events that are past but not completed (coverage gaps)
      return events.filter(event => 
        event.completed === false && isPast(event.endDate)
      );
    case 'canceled':
      // Events that are explicitly cancelled or missed
      return events.filter(event => 
        event.completed === false && isPast(event.endDate)
      );
    default:
      return events;
  }
};

// Function to get event counts for tabs
const getEventCounts = (events: CalendarEvent[]) => {
  const meetings = events.filter(e => e.type === 'meeting').length;
  const appointments = events.filter(e => e.type === 'event').length;
  const coverageGaps = events.filter(e => e.completed === false && isPast(e.endDate)).length;
  const cancelled = events.filter(e => e.completed === false && isPast(e.endDate)).length;
  
  return { meetings, appointments, coverageGaps, cancelled };
};

type EventItemProps = {
  title: string;
  time: string;
  status: {
    type: 'success' | 'warning' | 'error' | 'neutral' | (string & {});
    text: string;
    buttonLabel?: string;
    date?: string;
    icon: RemixiconComponentType;
  };
  index?: number;
};

function EventItem({ title, time, status, index = 0 }: EventItemProps) {
  const Icon = status.icon;

  return (
    <div
      key={index}
      style={{
        animationDelay: `${index * 0.15}s`,
      }}
      className={cn(
        'flex flex-col rounded-xl bg-bg-white-0 p-4 ring-1 ring-inset ring-stroke-soft-200',
        // animation
        '-translate-x-4 opacity-0',
        'group-data-[state=active]/tab-menu:animate-event-item-show',
      )}
    >
      <div className='text-label-sm'>{title}</div>
      <div className='mt-1 text-paragraph-xs text-text-sub-600'>{time}</div>
      <div className='mt-auto'>
        <div
          className={cn(
            '-mx-2 -mb-2 mt-3 flex items-center gap-1.5 rounded-lg p-2 pr-3',
            {
              'bg-success-lighter': status.type === 'success',
              'bg-warning-lighter': status.type === 'warning',
              'bg-error-lighter': status.type === 'error',
              'bg-neutral-lighter': status.type === 'neutral',
            },
          )}
        >
          <Icon
            className={cn('size-4', {
              'text-success-base': status.type === 'success',
              'text-warning-base': status.type === 'warning',
              'text-error-base': status.type === 'error',
              'text-text-sub-600': status.type === 'neutral',
            })}
          />
          <div className='flex-1 text-label-xs'>{status.text}</div>
          {status.buttonLabel && (
            <LinkButton.Root variant='gray' size='small' underline>
              {status.buttonLabel}
            </LinkButton.Root>
          )}
          {status.date && (
            <div className='text-paragraph-xs text-text-sub-600'>
              {status.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CalendarTabs({
  className,
  events,
  onTabChange,
  ...rest
}: CalendarTabsProps & React.ComponentPropsWithoutRef<typeof TabMenuHorizontal.Root>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState('all');
  
  // Get event counts for tab labels
  const eventCounts = getEventCounts(events);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const filteredEvents = filterEventsByTab(events, value);
    onTabChange?.(value, filteredEvents);
  };

  return (
    <AccordionPrimivites.Root
      type='single'
      collapsible
      defaultValue='accordion'
    >
      <AccordionPrimivites.Item
        value='accordion'
        className={cnExt('group/accordion', className)}
      >
        <TabMenuHorizontal.Root defaultValue='all' value={activeTab} onValueChange={handleTabChange} {...rest}>
          <div className='relative'>
            <TabMenuHorizontal.List
              wrapperClassName='-mx-4 pr-28 lg:mx-0'
              className='-mr-28 px-4 pr-28 lg:border-t-0 lg:px-0'
              ref={containerRef}
            >
              <TabMenuHorizontal.Trigger value='all'>
                <TabMenuHorizontal.Icon as={RiLayoutGridLine} />
                All Care Activities
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='meetings'>
                <TabMenuHorizontal.Icon as={RiDiscussLine} />
                Care Shifts ({eventCounts.meetings})
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='events'>
                <TabMenuHorizontal.Icon as={RiCalendarEventLine} />
                Appointments ({eventCounts.appointments})
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='conflicted'>
                <TabMenuHorizontal.Icon as={RiSpamLine} />
                Coverage Gaps ({eventCounts.coverageGaps})
              </TabMenuHorizontal.Trigger>
              <TabMenuHorizontal.Trigger value='canceled'>
                <TabMenuHorizontal.Icon as={RiCloseCircleLine} />
                Cancelled Care ({eventCounts.cancelled})
              </TabMenuHorizontal.Trigger>
            </TabMenuHorizontal.List>
            <div
              className={cn(
                'absolute right-0 top-3',
                'before:pointer-events-none before:absolute before:-inset-y-2.5 before:-right-4 before:w-28 before:bg-[linear-gradient(90deg,#0000,theme(colors.bg[white-0])_55%)]',
              )}
            >
              <AccordionPrimivites.Trigger asChild>
                <CompactButton.Root variant='stroke' size='large' fullRadius>
                  <CompactButton.Icon
                    as={RiArrowDownSLine}
                    className='group-data-[state=open]/accordion:-rotate-180'
                  />
                </CompactButton.Root>
              </AccordionPrimivites.Trigger>
            </div>
          </div>

          <AccordionPrimivites.Content className='data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
            <div className='pt-4'>
              {['all', 'meetings', 'events', 'conflicted', 'canceled'].map(tabValue => {
                const filteredEvents = filterEventsByTab(events, tabValue);
                const categorizedEvents = categorizeEvents(filteredEvents);
                
                return (
                  <TabMenuHorizontal.Content key={tabValue} value={tabValue} className='group/tab-menu'>
                    <div className='-mx-4 grid auto-cols-[264px] grid-flow-col gap-4 overflow-auto px-4 lg:mx-0 lg:px-0'>
                      {categorizedEvents.length > 0 ? (
                        categorizedEvents.map((event, index) => (
                          <EventItem
                            key={`${tabValue}-${index}`}
                            title={event.title}
                            time={event.time}
                            status={event.status}
                            index={index}
                          />
                        ))
                      ) : (
                        <div className='col-span-full flex items-center justify-center py-8 text-text-sub-600'>
                          No {tabValue === 'all' ? 'care activities' : tabValue === 'meetings' ? 'care shifts' : tabValue === 'events' ? 'appointments' : tabValue === 'conflicted' ? 'coverage gaps' : 'cancelled care'} found
                        </div>
                      )}
                    </div>
                  </TabMenuHorizontal.Content>
                );
              })}
            </div>
          </AccordionPrimivites.Content>
        </TabMenuHorizontal.Root>
      </AccordionPrimivites.Item>
    </AccordionPrimivites.Root>
  );
}
