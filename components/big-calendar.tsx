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
import { DeleteConfirmationModal } from './delete-confirmation-modal';
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
  type?: 'meeting' | 'event' | 'appointment' | 'transportation' | 'social' | 'default';
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
  // Additional fields from create form
  description?: string;
  assignedCaregiver?: string;
  client?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  recurringSchedule?: string; // Add recurring schedule field
  status?: string;
  visibility?: string;
  // Split event properties for overnight events
  isOvernightSplit?: boolean;
  isFirstPart?: boolean;
  isLastPart?: boolean;
  metadata?: {
    notes?: string;
    isOpenToAnyone?: boolean;
    requestType?: string;
    customPersonContact?: string;
    customPersonContactType?: string;
    isConsolidated?: boolean;
    originalEventCount?: number;
    originalStartDate?: string;
  };
};

type CalendarEventItemProps = CalendarData & {
  isTiny?: boolean;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent, eventData: CalendarData) => void;
  onDragEnd?: (event: React.DragEvent) => void;
  isDragging?: boolean;
  // Split event properties
  isOvernightSplit?: boolean;
  isFirstPart?: boolean;
  isLastPart?: boolean;
};

const bgColors: Partial<Record<NonNullable<CalendarData['type']>, string>> = {
  meeting: 'bg-sky-100', // Light blue for scheduled caregiver shifts
  event: 'bg-orange-100', // Orange for coverage gaps
  appointment: 'bg-purple-100', // Purple for medical appointments
  transportation: 'bg-yellow-100', // Yellow for transportation
  social: 'bg-pink-100', // Pink for social visits
  default: 'bg-green-100', // Light green for today's events
};

// Z-index mapping for proper layering
const zIndexMapping: Partial<Record<NonNullable<CalendarData['type']>, string>> = {
  meeting: 'z-0', // Base layer for caregiver shifts
  appointment: 'z-10', // On top for medical appointments
  transportation: 'z-10', // On top for transportation
  social: 'z-10', // On top for social visits
  event: 'z-5', // Middle layer for other events
  default: 'z-0', // Base layer
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
  onDragStart,
  onDragEnd,
  isDragging = false,
  // Include all the additional properties
  description,
  assignedCaregiver,
  client,
  isRecurring,
  recurrencePattern,
  recurringSchedule,
  status,
  visibility,
  metadata,
  // Split event properties
  isOvernightSplit,
  isFirstPart,
  isLastPart,
}: CalendarEventItemProps) {
  const eventData: CalendarData = {
    startDate,
    endDate,
    type,
    completed,
    title,
    link,
    location,
    people,
    platform,
    // Include all the additional properties
    description,
    assignedCaregiver,
    client,
    isRecurring,
    recurrencePattern,
    recurringSchedule,
    status,
    visibility,
    metadata,
  };

  // Calculate duration in hours for multi-hour events
  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const isMultiHour = durationHours > 1;
  
  // For month view (isTiny=true): use fixed height slivers
  // For week view (isTiny=false): use dynamic height based on duration
  const eventHeight = isTiny 
    ? '32px' // Fixed height for month view slivers
    : isMultiHour 
      ? `${Math.max(durationHours * 64, 64)}px` // Dynamic height for week view (64px per hour)
      : '64px'; // Single hour events should be 64px tall

  // Determine if this event is today or in the future
  // For split overnight events, use the original event's start date for color consistency
  const today = new Date();
  const eventDate = isOvernightSplit ? 
    new Date(metadata?.originalStartDate || startDate) : 
    new Date(startDate);
  const isToday = eventDate.toDateString() === today.toDateString();
  const isFuture = eventDate > today;

  return (
    <div
      draggable
      onClick={(e) => {
        e.stopPropagation(); // Prevent event from bubbling up to time slot
        onClick?.();
      }}
      onDragStart={(e) => {
        e.stopPropagation();
        // For split events, we need to reconstruct the original event for proper drag handling
        const dragEventData = isOvernightSplit && metadata?.originalStartDate ? {
          ...eventData,
          startDate: new Date(metadata.originalStartDate),
          // Calculate the original end date (start + 12 hours for overnight events)
          endDate: new Date(new Date(metadata.originalStartDate).getTime() + 12 * 60 * 60 * 1000),
          isOvernightSplit: false,
          isFirstPart: false,
          isLastPart: false,
          metadata: {
            ...metadata,
            originalStartDate: undefined // Remove this to avoid confusion
          }
        } : eventData;
        
        console.log('[DRAG DEBUG] CalendarEventItem onDragStart called with eventData:', dragEventData);
        onDragStart?.(e, dragEventData);
      }}
      onDragEnd={(e) => {
        e.stopPropagation();
        onDragEnd?.(e);
      }}
      className={cnExt(
        'flex min-h-0 w-full min-w-0 flex-col gap-2 overflow-hidden rounded-lg px-3 py-2',
        'backdrop-blur-xl cursor-move hover:opacity-80 transition-opacity',
        'select-none', // Prevent text selection during drag
        // Only use absolute positioning for week view multi-hour events
        isTiny ? 'relative' : 'absolute', // Month view uses relative, week view uses absolute
        // Color logic: completed/canceled events are red, today's events are green, future events are light blue
        completed ? 'bg-red-100' : 
        isToday ? 'bg-green-100' : 
        isFuture ? 'bg-sky-100' : 
        bgColors[type],
        {
          'opacity-50 scale-95': isDragging,
        },
      )}
      style={{
        height: eventHeight, // Both month and week view use calculated height
        zIndex: type === 'meeting' ? 0 : 10, // Base layer for caregiver shifts (meeting), on top for requests
        ...(isTiny ? {} : {
          top: 0, // Position at the top of the time slot (week view only)
          left: 0, // Position at the left edge (week view only)
          right: 0, // Extend to the right edge (week view only)
        }),
      }}
    >
      <div className='space-y-1'>
        {/* Title - always show */}
        <div
          className={cn('text-label-xs flex items-center gap-1', {
            truncate: isTiny,
            'text-text-strong-950': !completed,
            'text-text-sub-600': completed,
          })}
        >
          {isOvernightSplit && isFirstPart && (
            <span className='text-text-sub-500'>↗</span>
          )}
          {isOvernightSplit && isLastPart && (
            <span className='text-text-sub-500'>↖</span>
          )}
          {title}
        </div>

        {/* For month view (isTiny): show minimal info - just time */}
        {isTiny ? (
          <div className='text-subheading-2xs text-text-sub-600'>
            {isOvernightSplit ? (
              <>
                {isFirstPart && (
                  <span>8pm-8am...</span>
                )}
                {isLastPart && (
                  <span>...8pm-8am</span>
                )}
              </>
            ) : (
              `${format(startDate, 'h:mm')}-${format(endDate, 'h:mm aa')}`
            )}
          </div>
        ) : (
          /* For week view: show detailed info */
          <>
            <div className='text-subheading-2xs text-text-sub-600'>
              {isOvernightSplit ? (
                <>
                  {isFirstPart && (
                    <span>{format(startDate, 'h:mm')} - 8:00 AM...</span>
                  )}
                  {isLastPart && (
                    <span>...8:00 PM - {format(endDate, 'h:mm aa')}</span>
                  )}
                </>
              ) : (
                `${format(startDate, 'h:mm')} - ${format(endDate, 'h:mm aa')}`
              )}
            </div>
            {(recurringSchedule || (isOvernightSplit && assignedCaregiver)) && (
              <>
                <div className='w-full h-px border-t border-dashed border-stroke-soft-200 my-1'></div>
                <div className='text-paragraph-xs text-text-sub-500 italic'>
                  {isOvernightSplit && assignedCaregiver ? assignedCaregiver : recurringSchedule}
                </div>
                {recurrencePattern && (
                  <div className='text-paragraph-xs text-text-sub-500 italic'>
                    {recurrencePattern}
                  </div>
                )}
              </>
            )}
          </>
        )}
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
                <div className='flex items-center gap-1.5'>
                  <RiGlobalLine className='size-4 shrink-0 text-warning-base' />
                  <div className='truncate text-paragraph-xs'>{platform}</div>
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
  view?: 'week' | 'month';
  onEventDialogOpen?: (date: Date, time: Date) => void;
  onEventsUpdate?: (events: CalendarData[]) => void;
};

export function BigCalendar({
  defaultStartDate,
  totalShowingDays = 6,
  events,
  showAllHours = true, // Default to showing all hours
  className,
  view = 'week',
  onEventDialogOpen,
  onEventsUpdate,
}: BigCalendarProps) {
  console.log('[BIGCALENDAR DEBUG] BigCalendar received view:', view);
  // Calculate totalShowingDays based on view
  const actualShowingDays = view === 'week' ? 7 : totalShowingDays; // 7 days for week view (including Sunday)
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
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editFormData, setEditFormData] = React.useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<CalendarData | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Drag and drop state
  const [draggedEvent, setDraggedEvent] = React.useState<CalendarData | null>(null);
  const [dragOverTimeSlot, setDragOverTimeSlot] = React.useState<{ day: Date; hour: string } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Use events directly from props - no local state needed
  
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

  const showingDays = Array.from({ length: actualShowingDays }, (_, i) =>
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
    console.log('[BIGCALENDAR DEBUG] handleEventClick called with event:', event.title);
    console.log('[BIGCALENDAR DEBUG] Current view:', view);
    
    // Use the same modal approach for both week and month views
    console.log('[BIGCALENDAR DEBUG] Opening modal for event details');
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleEventEdit = (event: CalendarData) => {
    // Parse recurrence pattern if it exists
    let recurrencePattern = {
      frequency: 'weekly' as const,
      interval: 1,
      daysOfWeek: [] as number[],
      endDate: ''
    };

    if (event.recurrencePattern) {
      // Simple parsing - in a real app, you'd want more robust parsing
      if (event.recurrencePattern.includes('weekly')) {
        recurrencePattern.frequency = 'weekly';
        // Extract days from pattern like "weekly every 1 on M,T,W,T,F"
        const daysMatch = event.recurrencePattern.match(/on ([A-Z,]+)/);
        if (daysMatch) {
          const dayMap: { [key: string]: number } = { 'S': 0, 'M': 1, 'T': 2, 'W': 3, 'Th': 4, 'F': 5, 'Sa': 6 };
          recurrencePattern.daysOfWeek = daysMatch[1].split(',').map(d => dayMap[d.trim()]).filter(d => d !== undefined);
        }
      }
    }

    // Convert CalendarData to RequestFormData for editing
    const formData = {
      title: event.title || '',
      requestType: event.metadata?.requestType === 'Personal Care' ? 'care-shift' :
                   event.metadata?.requestType === 'Medical Appointment' ? 'appointment' :
                   event.metadata?.requestType === 'Overnight Care' ? 'care-shift' :
                   event.metadata?.requestType?.toLowerCase().replace(' ', '-') || '',
      customRequestType: event.metadata?.requestType === 'other' ? event.title || '' : '',
      description: event.description || '',
      careRecipient: event.client === 'Rob' ? 'rob-wudlick' : event.client || '',
      assignedPerson: event.assignedCaregiver === 'Open to anyone' ? 'open-to-anyone' : 
                     event.assignedCaregiver === 'Jim Nelson' ? 'jim-nelson' :
                     event.assignedCaregiver === 'Jennifer Smith' ? 'jennifer' :
                     event.assignedCaregiver && !event.people?.some(p => p.alt === event.assignedCaregiver) ? 'other' : 
                     event.assignedCaregiver || '',
      customAssignedPerson: event.assignedCaregiver && !event.people?.some(p => p.alt === event.assignedCaregiver) ? event.assignedCaregiver : '',
      customPersonContact: event.metadata?.customPersonContact || '',
      customPersonContactType: event.metadata?.customPersonContactType || 'phone',
      startDate: event.startDate,
      endDate: event.endDate,
      isRecurring: event.isRecurring || false,
      recurrencePattern: recurrencePattern,
      location: (event.location || event.platform) === 'Rob\'s Home' ? 'rob-home' :
                (event.location || event.platform) === 'Medical Center' ? 'medical-center' :
                (event.location || event.platform) === 'Luann\'s Home' ? 'luann-home' :
                (event.location || event.platform) === 'Rehabilitation Center' ? 'rehabilitation-center' :
                (event.location || event.platform) || '',
      customLocation: (event.location === 'other' || event.platform === 'other') ? (event.location || event.platform) : '',
      notes: event.metadata?.notes || '',
    };

    // Set edit mode and form data
    console.log('Converting event to form data:', { event, formData });
    setEditFormData(formData);
    setIsEditMode(true);
    setSelectedDate(event.startDate);
    setSelectedTime(event.startDate);
    setIsEventDialogOpen(true);
    
    console.log('Edit event with form data:', formData);
  };

  const handleEventDelete = (event: CalendarData) => {
    console.log('Delete event:', event);
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (deletionType: 'this' | 'this-and-following' | 'all') => {
    if (!eventToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove event from the events list based on deletion type
      let updatedEvents = events;
      
      if (deletionType === 'this') {
        // Remove only this specific occurrence
        updatedEvents = events.filter(e => e !== eventToDelete);
        console.log(`Deleted single occurrence: ${eventToDelete.title}`);
        
      } else if (deletionType === 'this-and-following') {
        // Remove this occurrence and all future occurrences
        // Filter out events with same title and recurrence pattern that start on or after this event's date
        updatedEvents = events.filter(e => {
          if (e === eventToDelete) return false; // Remove this specific occurrence
          
          // If it's the same recurring event, check if it's a future occurrence
          if (e.title === eventToDelete.title && 
              e.isRecurring === eventToDelete.isRecurring && 
              e.recurrencePattern === eventToDelete.recurrencePattern) {
            return e.startDate < eventToDelete.startDate; // Keep only past occurrences
          }
          
          return true; // Keep all other events
        });
        console.log(`Deleted this and future occurrences: ${eventToDelete.title}`);
        
      } else if (deletionType === 'all') {
        // Remove all occurrences of this recurring event
        // Filter out all events with same title and recurrence pattern
        updatedEvents = events.filter(e => {
          if (e === eventToDelete) return false; // Remove this specific occurrence
          
          // Remove all other occurrences of the same recurring event
          if (e.title === eventToDelete.title && 
              e.isRecurring === eventToDelete.isRecurring && 
              e.recurrencePattern === eventToDelete.recurrencePattern) {
            return false;
          }
          
          return true; // Keep all other events
        });
        console.log(`Deleted all occurrences: ${eventToDelete.title}`);
      }
      
      // Update the events in the parent component
      console.log(`Event deletion completed (${deletionType}):`, eventToDelete.title);
      console.log(`Remaining events:`, updatedEvents.length);
      
      // Sync the updated events back to the parent component
      if (onEventsUpdate) {
        onEventsUpdate(updatedEvents);
      }
      
      // Close modals
      setIsDeleteModalOpen(false);
      setIsEventDetailsOpen(false);
      setEventToDelete(null);
      
      // Show success feedback based on deletion type
      const deletionMessage = deletionType === 'this' 
        ? `Event "${eventToDelete.title}" has been deleted successfully!`
        : deletionType === 'this-and-following'
        ? `Event "${eventToDelete.title}" and all future occurrences have been deleted successfully!`
        : `All occurrences of "${eventToDelete.title}" have been deleted successfully!`;
      
      alert(deletionMessage);
      
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };


  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, eventData: CalendarData) => {
    console.log('[DRAG DEBUG] handleDragStart called:', { 
      title: eventData.title, 
      isRecurring: eventData.isRecurring,
      recurrencePattern: eventData.recurrencePattern 
    });
    
    // Set drag state immediately for proper drag handling
    setDraggedEvent(eventData);
    setIsDragging(true);
    
    // Set drag image to be semi-transparent
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(eventData));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedEvent(null);
    setDragOverTimeSlot(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, day: Date, hour: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTimeSlot({ day, hour });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the time slot entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTimeSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, day: Date, hour: string | undefined) => {
    e.preventDefault();
    
    console.log('[DRAG DEBUG] handleDrop called:', { 
      draggedEvent: draggedEvent?.title, 
      hasDraggedEvent: !!draggedEvent,
      targetDay: day.toDateString(),
      targetHour: hour
    });
    
    if (!draggedEvent) {
      console.log('[DRAG DEBUG] No dragged event, returning');
      return;
    }

    // Simple drag and drop - just reschedule the event
    // Don't clean up drag state here - let handleDragEnd do it
    console.log('[DRAG DEBUG] Rescheduling event directly');
    performDragUpdate(draggedEvent, day, hour);
  };

  const performDragUpdate = (event: CalendarData, day: Date, hour: string | undefined) => {
    try {
      // Parse the hour string to get the target time, or use original time if no hour provided
      let targetDate: Date;
      
      if (hour !== undefined) {
        const targetHour = parseInt(hour);
        targetDate = new Date(day);
        targetDate.setHours(targetHour, 0, 0, 0);
      } else {
        // For month view, keep the original time but change the date
        targetDate = new Date(day);
        targetDate.setHours(event.startDate.getHours(), event.startDate.getMinutes(), 0, 0);
      }

      // Calculate the duration of the original event
      const duration = event.endDate.getTime() - event.startDate.getTime();
      const newEndDate = new Date(targetDate.getTime() + duration);

      console.log('Event rescheduled:', {
        original: { start: event.startDate, end: event.endDate },
        new: { start: targetDate, end: newEndDate },
        duration: duration / (1000 * 60), // duration in minutes
      });

      // Update the events through parent callback - simple reschedule
      if (onEventsUpdate) {
        const newEvents = events.map((eventItem: CalendarData) => {
          // For split overnight events, match by title and originalStartDate
          if (event.isOvernightSplit && event.metadata?.originalStartDate) {
            const originalStartDate = new Date(event.metadata.originalStartDate);
            const isMatch = eventItem.title === event.title && 
                           eventItem.startDate.getTime() === originalStartDate.getTime();
            return isMatch ? { ...eventItem, startDate: targetDate, endDate: newEndDate } : eventItem;
          } else {
            // For regular events, match by title and exact start/end times
            const isMatch = eventItem.title === event.title && 
                           eventItem.startDate.getTime() === event.startDate.getTime() &&
                           eventItem.endDate.getTime() === event.endDate.getTime();
            return isMatch ? { ...eventItem, startDate: targetDate, endDate: newEndDate } : eventItem;
          }
        });
        
        console.log('[DRAG DEBUG] Before update:', events.map((e: CalendarData) => ({ title: e.title, start: e.startDate, end: e.endDate })));
        console.log('[DRAG DEBUG] After update:', newEvents.map((e: CalendarData) => ({ title: e.title, start: e.startDate, end: e.endDate })));
        
        onEventsUpdate(newEvents);
      }

      // Show success message
      alert(`Event "${event.title}" rescheduled to ${targetDate.toLocaleString()}`);

    } catch (error) {
      console.error('Error rescheduling event:', error);
      alert('Failed to reschedule event. Please try again.');
    }
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

  // Helper function to consolidate continuous events into single visual cards
  const consolidateContinuousEvents = (events: CalendarData[]): CalendarData[] => {
    if (events.length === 0) return [];
    
    // Group events by title and assigned caregiver to identify continuous blocks
    const eventGroups = new Map<string, CalendarData[]>();
    
    events.forEach(event => {
      const key = `${event.title}-${event.assignedCaregiver || 'unknown'}`;
      if (!eventGroups.has(key)) {
        eventGroups.set(key, []);
      }
      eventGroups.get(key)!.push(event);
    });
    
    const consolidatedEvents: CalendarData[] = [];
    
    eventGroups.forEach((groupEvents, key) => {
      // Sort events by start time
      const sortedEvents = groupEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
      
      // Find continuous blocks of the same event
      let currentBlock: CalendarData[] = [];
      
      for (let i = 0; i < sortedEvents.length; i++) {
        const currentEvent = sortedEvents[i];
        
        if (currentBlock.length === 0) {
          // Start a new block
          currentBlock.push(currentEvent);
        } else {
          const lastEvent = currentBlock[currentBlock.length - 1];
          const timeDiff = currentEvent.startDate.getTime() - lastEvent.endDate.getTime();
          
          // Check if events are on the same day
          const isSameDay = currentEvent.startDate.getDate() === lastEvent.startDate.getDate() &&
                           currentEvent.startDate.getMonth() === lastEvent.startDate.getMonth() &&
                           currentEvent.startDate.getFullYear() === lastEvent.startDate.getFullYear();
          
          // Check if the last event ends before midnight (23:59:59)
          const lastEventEndHour = lastEvent.endDate.getHours();
          const lastEventEndMinute = lastEvent.endDate.getMinutes();
          const endsBeforeMidnight = lastEventEndHour < 23 || (lastEventEndHour === 23 && lastEventEndMinute < 59);
          
          // Check if this is an overnight event (starts near midnight)
          const currentEventStartHour = currentEvent.startDate.getHours();
          const currentEventStartMinute = currentEvent.startDate.getMinutes();
          const startsNearMidnight = currentEventStartHour === 0 && currentEventStartMinute <= 1; // 12:00 AM to 12:01 AM
          
          // Check if the last event ends near midnight (11:59 PM to 11:59:59 PM)
          const endsNearMidnight = lastEventEndHour === 23 && lastEventEndMinute >= 59;
          
          // Special case for overnight events: allow consolidation across midnight
          const isOvernightConsolidation = endsNearMidnight && startsNearMidnight && timeDiff <= 60 * 60 * 1000;
          
          // If events are consecutive (within 1 hour), have same details, and either:
          // 1. Are on the same day AND end before midnight, OR
          // 2. Are overnight events spanning across midnight
          if (timeDiff <= 60 * 60 * 1000 && // Within 1 hour
              ((isSameDay && endsBeforeMidnight) || isOvernightConsolidation) && // Same day OR overnight consolidation
              currentEvent.title === lastEvent.title &&
              currentEvent.assignedCaregiver === lastEvent.assignedCaregiver &&
              currentEvent.type === lastEvent.type) {
            currentBlock.push(currentEvent);
          } else {
            // End current block and start new one
            consolidatedEvents.push(createConsolidatedEvent(currentBlock));
            currentBlock = [currentEvent];
          }
        }
      }
      
      // Don't forget the last block
      if (currentBlock.length > 0) {
        consolidatedEvents.push(createConsolidatedEvent(currentBlock));
      }
    });
    
    return consolidatedEvents;
  };
  
  // Helper function to create a consolidated event from a block of continuous events
  const createConsolidatedEvent = (eventBlock: CalendarData[]): CalendarData => {
    if (eventBlock.length === 1) {
      return eventBlock[0];
    }
    
    const firstEvent = eventBlock[0];
    const lastEvent = eventBlock[eventBlock.length - 1];
    
    // For overnight events that span across midnight, preserve the original end time
    // Only cap events that are NOT overnight (i.e., don't span across midnight)
    let consolidatedEndDate = lastEvent.endDate;
    
    // Check if this is an overnight event (starts on one day, ends on the next)
    // For overnight events, the end date should be significantly later than start date
    const timeDiff = lastEvent.endDate.getTime() - firstEvent.startDate.getTime();
    const isOvernightEvent = timeDiff > 12 * 60 * 60 * 1000; // More than 12 hours apart
    
    // Only cap non-overnight events at 11:59 PM
    if (!isOvernightEvent && lastEvent.endDate.getHours() >= 23 && lastEvent.endDate.getMinutes() >= 59) {
      consolidatedEndDate = new Date(lastEvent.endDate);
      consolidatedEndDate.setHours(23, 59, 59, 999); // 11:59:59.999 PM
    }
    
    return {
      ...firstEvent,
      startDate: firstEvent.startDate,
      endDate: consolidatedEndDate,
      // Mark as consolidated for special rendering
      metadata: {
        ...firstEvent.metadata,
        isConsolidated: true,
        originalEventCount: eventBlock.length,
      }
    };
  };

  // Helper function to split overnight events into day-specific cards
  const splitOvernightEvent = (event: CalendarData, targetDay: Date) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const targetDayStart = new Date(targetDay);
    targetDayStart.setHours(0, 0, 0, 0);
    const targetDayEnd = new Date(targetDay);
    targetDayEnd.setHours(23, 59, 59, 999);

    // Check if event spans across this day
    if (eventStart < targetDayEnd && eventEnd > targetDayStart) {
      // Determine the actual start and end times for this day
      const dayEventStart = new Date(Math.max(eventStart.getTime(), targetDayStart.getTime()));
      const dayEventEnd = new Date(Math.min(eventEnd.getTime(), targetDayEnd.getTime()));
      
      // Create a new event object for this day
      const splitEvent = {
        ...event,
        startDate: dayEventStart,
        endDate: dayEventEnd,
        // Add visual indicators for continuation
        isOvernightSplit: true,
        isFirstPart: dayEventStart.getDate() === eventStart.getDate(),
        isLastPart: dayEventEnd.getDate() === eventEnd.getDate(),
        // Include original start date for color consistency
        metadata: {
          ...event.metadata,
          originalStartDate: eventStart.toISOString()
        }
      };

      return splitEvent;
    }
    
    return null;
  };

  // Helper function to get events for a specific day and hour
  const getEventsForTimeSlot = (day: Date, hour: string) => {
    // First, get all events that overlap with this time slot
    const matchingEvents = events.filter(event => {
      // Don't exclude any events during drag start - let them all render normally
      // The visual feedback will be handled by the isDragging prop in CalendarEventItem

      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const hourDate = new Date(hour); // Convert ISO string to Date
      const slotStart = new Date(day);
      slotStart.setHours(hourDate.getHours(), 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(hourDate.getHours() + 1, 0, 0, 0);

      // Render each event only once in its starting time slot
      // This applies to ALL events regardless of duration - no discrimination
      return eventStart.getHours() === hourDate.getHours() && eventStart.getDate() === day.getDate();
    });
    
    // Consolidate continuous events for this day first
    const consolidatedEvents = consolidateContinuousEvents(matchingEvents);
    
    const eventsToShow = consolidatedEvents.flatMap(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const hourDate = new Date(hour);
      const slotStart = new Date(day);
      slotStart.setHours(hourDate.getHours(), 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1, 0, 0, 0);
      
      // Check if this is an overnight event (spans more than 12 hours or crosses midnight)
      const timeDiff = eventEnd.getTime() - eventStart.getTime();
      const isOvernightEvent = timeDiff > 12 * 60 * 60 * 1000 || eventStart.getDate() !== eventEnd.getDate();
      
      if (isOvernightEvent) {
        // For overnight events, check if this time slot overlaps with the event on this day
        const splitEvent = splitOvernightEvent(event, day);
        if (splitEvent && splitEvent.startDate < slotEnd && splitEvent.endDate > slotStart) {
          // Only show in the starting hour slot of the split event
          return splitEvent.startDate.getHours() === slotStart.getHours() ? [splitEvent] : [];
        }
        return [];
      } else {
        // For regular events, only show them in the hour slot where they start
        return eventStart.getHours() === slotStart.getHours() ? [event] : [];
      }
    });
    
    // Debug logging
    const hourDate = new Date(hour);
    if (eventsToShow.length > 0) {
      console.log(`Found ${eventsToShow.length} events for ${day.toDateString()} at ${hourDate.getHours()}:00`, eventsToShow);
    }
    
    return eventsToShow;
  };

  // Helper function to get events for a specific day (for month view)
  const getEventsForDay = (day: Date) => {
    const matchingEvents = events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      // Include events that start on this day
      if (isSameDay(eventStart, day)) {
        return true;
      }
      
      // For overnight events that span multiple days, include them on both start and end days
      const timeDiff = eventEnd.getTime() - eventStart.getTime();
      const isOvernightEvent = timeDiff > 12 * 60 * 60 * 1000; // More than 12 hours apart
      
      if (isOvernightEvent) {
        // Show overnight events on both their start day and end day
        return isSameDay(eventStart, day) || isSameDay(eventEnd, day);
      }
      
      return false;
    });
    
    return matchingEvents;
  };

  const handleCloseDialog = () => {
    setIsEventDialogOpen(false);
    setIsEditMode(false);
    setEditFormData(null);
  };

  // Render month view differently
  if (view === 'month') {
    console.log('[MONTH VIEW DEBUG] Rendering month view with', events.length, 'events');
    console.log('[MONTH VIEW DEBUG] currentStartDate:', currentStartDate);
    console.log('[MONTH VIEW DEBUG] events:', events.map(e => ({ title: e.title, startDate: e.startDate })));
    
    // For month view, create a proper calendar grid
    const firstDayOfMonth = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), 1);
    console.log('[MONTH VIEW DEBUG] firstDayOfMonth:', firstDayOfMonth);
    const lastDayOfMonth = new Date(currentStartDate.getFullYear(), currentStartDate.getMonth() + 1, 0);
    
    // Get the first day of the week for the calendar grid (Sunday)
    const firstDayOfWeek = new Date(firstDayOfMonth);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
    
    // Create 35 days (5 weeks) starting from the first Sunday
    const monthDays = Array.from({ length: 35 }, (_, i) => 
      addDays(firstDayOfWeek, i)
    );
    
    return (
      <div className='relative z-20 -mx-4 overflow-hidden px-4 lg:mx-0 lg:overflow-visible lg:px-0'>
        <div className={cnExt('w-fit bg-bg-white-0 lg:w-full', className)}>
          <div className='overflow-clip rounded-xl border border-stroke-soft-200 lg:overflow-hidden'>
            {/* Month view header - Fixed width columns */}
            <div className='grid grid-cols-7 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200 bg-bg-weak-50'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className='flex h-8 items-center justify-center text-xs font-medium text-text-soft-600 min-w-[120px]'>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Month view grid - 5 rows of 7 days each */}
            <div className='grid grid-rows-5'>
              {Array.from({ length: 5 }, (_, weekIndex) => (
                <div key={weekIndex} className='grid grid-cols-7 divide-x divide-stroke-soft-200 border-b border-stroke-soft-200'>
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = monthDays[weekIndex * 7 + dayIndex];
                    
                    const isCurrentMonth = day.getMonth() === currentStartDate.getMonth();
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div 
                        key={dayIndex}
                        className={`min-h-[120px] p-2 min-w-[120px] ${
                          !isCurrentMonth ? 'bg-bg-weak-50 text-text-soft-400' : ''
                        } ${isToday ? 'bg-blue-50' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventDialogOpen?.(day, day);
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (draggedEvent) {
                            handleDrop(e, day, undefined);
                          }
                        }}
                      >
                        <div className={`mb-2 text-sm font-medium ${
                          isToday ? 'text-blue-600 font-bold' : 
                          isCurrentMonth ? 'text-text-strong-900' : 'text-text-soft-400'
                        }`}>
                          {format(day, 'd')}
                        </div>
                        <div className='space-y-1'>
                          {/* Get all events for this day using the same method as week view */}
                          {getEventsForDay(day).slice(0, 3).map((event, eventIndex) => (
                            <CalendarEventItem
                              key={`${event.title}-${eventIndex}`}
                              {...event}
                              isTiny={true}
                              onClick={() => handleEventClick(event)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              isDragging={isDragging && (
                                draggedEvent?.title === event.title && (
                                  !event.isOvernightSplit || 
                                  (draggedEvent?.isOvernightSplit && draggedEvent?.metadata?.originalStartDate === event.metadata?.originalStartDate)
                                )
                              )}
                            />
                          ))}
                          {getEventsForDay(day).length > 3 && (
                            <div className='text-xs text-text-soft-600'>
                              +{getEventsForDay(day).length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
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
          initialFormData={editFormData}
          isEditMode={isEditMode}
        />
        
        {/* Event Details Modal */}
        <EventDetailsModal
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          event={selectedEvent}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
        />
        
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          eventTitle={eventToDelete?.title || ''}
          isRecurring={eventToDelete?.isRecurring || false}
          recurrencePattern={eventToDelete?.recurrencePattern}
          isDeleting={isDeleting}
        />
      </div>
    );
  } else {
    // Week view (existing implementation)
  return (
    <div className='relative z-20 -mx-4 overflow-hidden px-4 lg:mx-0 lg:overflow-visible lg:px-0'>
      <div className={cnExt('w-fit bg-bg-white-0 lg:w-full', className)}>
        <div className='flex overflow-clip rounded-xl border border-stroke-soft-200 lg:overflow-hidden'>
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
              <div className='grid grid-cols-7 divide-x divide-stroke-soft-200'>
                {/* Generate 6 day columns */}
                {showingDays.map((day, dayIndex) => (
                  <div key={dayIndex} className='relative'>
                    {/* Generate 24 hour rows */}
                    {showingHours.map((hour, hourIndex) => (
                      <div
                        key={hourIndex}
                        onClick={() => handleTimeSlotClick(day, format(hour, 'h aa'))}
                        onDragOver={(e) => handleDragOver(e, day, format(hour, 'H'))}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, format(hour, 'H'))}
                        className={`h-16 border-b border-stroke-soft-200 transition-colors cursor-pointer relative ${
                          isToday(day)
                            ? 'bg-primary-lighter/20 hover:bg-primary-lighter/40'
                            : 'bg-bg-white-0 hover:bg-bg-weak-50'
                        } ${
                          dragOverTimeSlot?.day.getTime() === day.getTime() && 
                          dragOverTimeSlot?.hour === format(hour, 'H')
                            ? 'bg-primary-lighter/60 border-primary-500 border-2'
                            : ''
                        }`}
                      >
                          {/* Render events for this time slot */}
                          {getEventsForTimeSlot(day, hour).map((event, eventIndex) => (
                            <CalendarEventItem
                              key={`${event.title}-${eventIndex}`}
                              {...event}
                              isTiny={false}
                              onClick={() => handleEventClick(event)}
                              onDragStart={handleDragStart}
                              onDragEnd={handleDragEnd}
                              isDragging={isDragging && (
                                draggedEvent?.title === event.title && (
                                  !event.isOvernightSplit || 
                                  (draggedEvent?.isOvernightSplit && draggedEvent?.metadata?.originalStartDate === event.metadata?.originalStartDate)
                                )
                              )}
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
            initialFormData={editFormData}
            isEditMode={isEditMode}
          />
          
          {/* Event Details Modal */}
          <EventDetailsModal
            isOpen={isEventDetailsOpen}
            onClose={() => setIsEventDetailsOpen(false)}
            event={selectedEvent}
            onEdit={handleEventEdit}
            onDelete={handleEventDelete}
          />
          
          {/* Delete Confirmation Modal */}
          <DeleteConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            eventTitle={eventToDelete?.title || ''}
            isRecurring={eventToDelete?.isRecurring || false}
            recurrencePattern={eventToDelete?.recurrencePattern}
            isDeleting={isDeleting}
          />
          
        </div>
      );
    }
  }
