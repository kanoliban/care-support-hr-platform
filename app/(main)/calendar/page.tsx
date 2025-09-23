'use client';

import * as React from 'react';
import { RiCalendarLine } from '@remixicon/react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

import * as Divider from '@/components/ui/divider';
import { BigCalendar, type CalendarData } from '@/components/big-calendar';
import { CreateRequestButton } from '@/components/create-request-button';
import { ScheduleButton } from '@/components/schedule-button';
import Header from '@/app/(main)/header';
// import { useCareSupport } from '@/hooks/useCareSupport';

import CalendarFilters from './filters';
import CalendarTabs from './tabs';
import { CareEventsProvider } from '@/hooks/useCareEvents';
import { CareNotifications } from '@/components/care-notifications';
import CareEventDialog from '@/components/care-event-dialog';

// Rob's Realistic Monthly Caregiving Schedule - September 2025
// This schedule follows proper caregiving logic:
// 1. Primary caregivers have regular recurring schedules
// 2. On-call caregivers fill in when primary caregivers are unavailable
// 3. Unavailable caregivers (Grace) are not scheduled
// 4. Only one person per shift is needed
// 5. Covers one full month with realistic availability patterns

const generateMonthlyCareSchedule = (): CalendarData[] => {
  const events: CalendarData[] = [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Define Rob's care team with realistic availability patterns
  const careTeam = {
    // Primary Caregivers with Regular Schedules
    primary: {
            jim: {
              name: 'Jim Nelson',
              schedule: { days: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 }, // M-F 9am-5pm
              status: 'primary',
              color: 'blue' as const,
        image: '/images/avatar/illustration/james.png',
              alt: 'Jim Nelson'
            },
            jennifer: {
              name: 'Jennifer',
              schedule: { days: [1, 2], startHour: 20, endHour: 8 }, // M,T 8pm-8am (overnight)
              status: 'primary',
              color: 'green' as const,
              image: '/images/avatar/illustration/emma.png',
              alt: 'Jennifer'
            },
            sarah: {
              name: 'Sarah',
              schedule: { days: [3, 4], startHour: 20, endHour: 8 }, // W,Th 8pm-8am (overnight)
              status: 'primary',
              color: 'purple' as const,
              image: '/images/avatar/illustration/laura.png',
              alt: 'Sarah'
            },
            ella: {
              name: 'Ella',
              schedule: { days: [5, 6, 0], startHour: 20, endHour: 9 }, // F,Sat,Sun 8pm-9am (overnight)
              status: 'primary',
              color: 'orange' as const,
              image: '/images/avatar/illustration/sophia.png',
              alt: 'Ella'
            },
            olena: {
              name: 'Olena',
              schedule: { days: [6, 0], startHour: 9, endHour: 13 }, // Sat,Sun 9am-1pm
              status: 'primary',
              color: 'pink' as const,
              image: '/images/avatar/illustration/natalia.png',
              alt: 'Olena'
            }
    },
    
    // On-Call Caregivers (Available for Coverage)
    onCall: {
      rob: {
        name: 'Rob Wudlick',
        availability: 'all-slots', // Available for any empty time slots
        status: 'on-call',
        color: 'gray' as const,
        image: '/images/avatar/illustration/arthur.png',
        alt: 'Rob Wudlick'
      },
      marta: {
        name: 'Marta Snow',
        availability: 'on-call',
        status: 'on-call',
        color: 'teal' as const,
        image: '/images/avatar/illustration/matthew.png',
        alt: 'Marta Snow'
      },
      isabela: {
        name: 'Isabela',
        availability: 'on-call',
        status: 'on-call',
        color: 'yellow' as const,
        image: '/images/avatar/illustration/lena.png',
        alt: 'Isabela'
      },
      lucy: {
        name: 'Lucy',
        availability: 'on-call',
        status: 'on-call',
        color: 'red' as const,
        image: '/images/avatar/illustration/nuray.png',
        alt: 'Lucy'
      },
      uncleJim: {
        name: 'Uncle Jim',
        availability: 'on-call',
        status: 'on-call',
        color: 'brown' as const,
        image: '/images/avatar/illustration/juma.png',
        alt: 'Uncle Jim'
      },
      dan: {
        name: 'Dan (Bro in-law)',
        availability: 'on-call',
        status: 'on-call',
        color: 'sky' as const,
        image: '/images/avatar/illustration/ravi.png',
        alt: 'Dan'
      }
    },
    
    // Special Circumstances Caregivers
    special: {
      alex: {
        name: 'Alex',
        availability: 'random',
        status: 'random-availability',
        color: 'blue' as const,
        image: '/images/avatar/illustration/wei.png',
        alt: 'Alex'
      },
      kathleen: {
        name: 'Kathleen',
        availability: 'random-on-call',
        status: 'random-on-call',
        color: 'green' as const,
        image: '/images/avatar/illustration/emma.png',
        alt: 'Kathleen'
      },
      annie: {
        name: 'Annie',
        availability: 'random-on-call',
        status: 'random-on-call',
        color: 'purple' as const,
        image: '/images/avatar/illustration/laura.png',
        alt: 'Annie'
      },
      grace: {
        name: 'Grace',
        availability: 'summer-break',
        status: 'unavailable',
        color: 'gray' as const,
        image: '/images/avatar/illustration/sophia.png',
        alt: 'Grace'
      }
    }
  };

  // Generate events for the current month
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
  // Track coverage gaps for on-call assignment
  const coverageMap = new Map<string, boolean[]>();
  
  // Helper function to create an event
  const createEvent = (
    caregiver: any,
    date: Date,
    startHour: number,
    endHour: number,
    isOvernight: boolean = false
  ): CalendarData => {
    const startDate = new Date(date);
    startDate.setHours(startHour, 0, 0, 0);
    
    const endDate = new Date(date);
    if (isOvernight && endHour < startHour) {
      // Overnight shift - end date is next day
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate.setHours(endHour, 0, 0, 0);
    
    // Determine shift type and title
    let title: string;
    if (startHour >= 9 && endHour <= 17) {
      title = 'Regular Scheduled Care';
    } else if (startHour >= 20 || endHour <= 8) {
      title = 'Overnight Care';
    } else if (startHour >= 9 && startHour < 17) {
      title = 'Weekend Day Care';
    } else {
      title = 'On-call Coverage';
    }
    
    return {
      startDate,
      endDate,
      title,
      completed: false,
      type: 'meeting', // All scheduled caregivers show as blue (scheduled)
      people: [{
        image: caregiver.image,
        alt: caregiver.alt,
        color: caregiver.color
      }],
      platform: 'Home',
      description: `${title} for Luann Wudlick`,
      assignedCaregiver: caregiver.name,
      client: 'Luann Wudlick',
      isRecurring: true,
      recurrencePattern: `Every ${getDayNames(caregiver.schedule?.days || [date.getDay()])} ${formatTime(startHour)}-${formatTime(endHour)}`,
      recurringSchedule: caregiver.name, // Show caregiver name instead of schedule pattern
      status: caregiver.status,
      visibility: 'care-team-only',
      metadata: {
        requestType: 'Personal Care',
        notes: `${title} - ${caregiver.name} provides medication, meals, personal care, and daily activities for Luann`,
        isOpenToAnyone: false
      },
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: caregiver.schedule?.days || [date.getDay()]
      }
    };
  };
  
  // Helper function to format time
  const formatTime = (hour: number): string => {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  };
  
  // Helper function to get day names
  const getDayNames = (days: number[]): string => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map(day => dayNames[day]).join(',');
  };
  
  // Note: On-call caregivers are not auto-assigned to gaps
  // This allows the care team to see coverage gaps and coordinate coverage themselves
  
  // Generate primary caregiver schedules
  Object.values(careTeam.primary).forEach(caregiver => {
    if (!caregiver.schedule) return;
    
    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      
      if (caregiver.schedule.days.includes(dayOfWeek)) {
        const isOvernight = caregiver.schedule.startHour >= 20 || caregiver.schedule.endHour <= 8;
        events.push(createEvent(caregiver, date, caregiver.schedule.startHour, caregiver.schedule.endHour, isOvernight));
      }
    }
  });
  
  // Add some realistic unavailability (sick days, conflicts, etc.)
  const unavailabilityPatterns = [
    { caregiver: 'Jim Nelson', dates: [3, 10, 17], reason: 'medical appointment' },
    { caregiver: 'Jennifer', dates: [8, 15], reason: 'family conflict' },
    { caregiver: 'Sarah', dates: [12], reason: 'personal day' }
  ];
  
  // Remove events for unavailable caregivers
  unavailabilityPatterns.forEach(pattern => {
    pattern.dates.forEach(day => {
      const date = new Date(currentYear, currentMonth, day);
      events.splice(events.findIndex(event => 
        event.assignedCaregiver === pattern.caregiver && 
        event.startDate.getDate() === day
      ), 1);
    });
  });
  
  // DO NOT auto-fill coverage gaps - leave them visible for care team coordination
  // This allows the care team to see where coverage is needed and coordinate coverage themselves
  
  // SEAMLESS COORDINATION TEST: Add Rob's overlapping activities during Jim Nelson's 9am-5pm shift
  // This tests how the system handles multiple overlapping events for seamless coordination
  
  const robsActivities = [
    // Monday - Physical Therapy & Business Meeting
    {
      title: 'Physical Therapy Session',
      startHour: 10, endHour: 11,
      day: 1, // Monday
      type: 'appointment',
      location: 'Downtown Physical Therapy',
      description: 'Weekly physical therapy session for mobility and strength training',
      requestType: 'Medical Appointment'
    },
    {
      title: 'Client Meeting - Tech Startup',
      startHour: 14, endHour: 15,
      day: 1, // Monday
    type: 'meeting',
      location: 'Coffee Shop Downtown',
      description: 'Meeting with potential client about software development project',
      requestType: 'Business Meeting'
    },
    
    // Tuesday - Networking & Transportation
    {
      title: 'Networking Event',
      startHour: 12, endHour: 13,
      day: 2, // Tuesday
      type: 'event',
      location: 'Convention Center',
      description: 'Monthly entrepreneur networking event',
      requestType: 'Networking'
    },
    {
      title: 'Transportation to Doctor',
      startHour: 16, endHour: 17,
      day: 2, // Tuesday
      type: 'transportation',
      location: 'Medical Center',
      description: 'Transportation assistance to and from doctor appointment',
      requestType: 'Transportation'
    },
    
    // Wednesday - Multiple Overlapping Events
    {
      title: 'Physical Therapy Session',
      startHour: 9, endHour: 10,
      day: 3, // Wednesday
      type: 'appointment',
      location: 'Downtown Physical Therapy',
      description: 'Follow-up physical therapy session',
      requestType: 'Medical Appointment'
    },
    {
      title: 'Lunch with Business Partner',
      startHour: 12, endHour: 13,
      day: 3, // Wednesday
    type: 'meeting',
      location: 'Restaurant Downtown',
      description: 'Business lunch to discuss partnership opportunities',
      requestType: 'Business Meeting'
    },
    {
      title: 'Visit Friend - Sarah',
      startHour: 15, endHour: 16,
      day: 3, // Wednesday
      type: 'social',
      location: 'Sarah\'s House',
      description: 'Visit with close friend for social time',
      requestType: 'Social Visit'
    },
    
    // Thursday - Transportation & Meeting
    {
      title: 'Transportation to Bank',
      startHour: 10, endHour: 11,
      day: 4, // Thursday
      type: 'transportation',
      location: 'First National Bank',
      description: 'Bank appointment for business account matters',
      requestType: 'Transportation'
    },
    {
      title: 'Team Meeting',
      startHour: 13, endHour: 14,
      day: 4, // Thursday
      type: 'meeting',
      location: 'Office Conference Room',
      description: 'Weekly team meeting to review projects and priorities',
      requestType: 'Business Meeting'
    },
    
    // Friday - Multiple Events
    {
      title: 'Physical Therapy Session',
      startHour: 11, endHour: 12,
      day: 5, // Friday
      type: 'appointment',
      location: 'Downtown Physical Therapy',
      description: 'End of week physical therapy session',
      requestType: 'Medical Appointment'
    },
    {
      title: 'Client Presentation',
      startHour: 14, endHour: 15,
      day: 5, // Friday
      type: 'meeting',
      location: 'Client Office',
      description: 'Presentation of new software solution to client',
      requestType: 'Business Meeting'
    },
    {
      title: 'Transportation to Airport',
      startHour: 16, endHour: 17,
      day: 5, // Friday
      type: 'transportation',
      location: 'International Airport',
      description: 'Transportation to airport for weekend business trip',
      requestType: 'Transportation'
    }
  ];
  
  // Add Rob's activities to the events
  robsActivities.forEach(activity => {
    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === activity.day) {
        const startDate = new Date(date);
        startDate.setHours(activity.startHour, 0, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(activity.endHour, 0, 0, 0);
        
        events.push({
          startDate,
          endDate,
          title: activity.title,
          completed: false,
          type: activity.type as 'meeting' | 'event' | 'appointment' | 'transportation' | 'social',
          people: [{
            image: '/images/avatar/illustration/arthur.png',
            alt: 'Open to anyone',
            color: 'gray'
          }],
          platform: activity.location,
          description: activity.description,
          assignedCaregiver: 'Open to anyone',
          client: 'Rob Wudlick',
          isRecurring: false,
          recurrencePattern: '',
          recurringSchedule: 'Open to anyone',
          status: 'request',
          visibility: 'care-team-only',
          metadata: {
            requestType: activity.requestType,
            notes: activity.description,
            isOpenToAnyone: true
          }
        });
      }
    }
  });
  
  console.log(`[SCHEDULE DEBUG] Generated ${events.length} total events (${events.length - robsActivities.length} caregiver shifts + ${robsActivities.length} Rob's activities) for ${currentYear}-${currentMonth + 1}`);
  console.log(`[SEAMLESS COORDINATION TEST] Added ${robsActivities.length} overlapping activities during Jim Nelson's 9am-5pm shift`);
  console.log(`[SCHEDULE DEBUG] Coverage gaps are intentionally left visible for care team coordination`);
  
  return events;
};


// Generate the monthly schedule
const calendarData: CalendarData[] = generateMonthlyCareSchedule();

// Generate dynamic calendar events using Rob's full care team schedule
const generateCalendarEvents = (): CalendarData[] => {
  console.log('[CALENDAR DEBUG] generateCalendarEvents called');
  return generateMonthlyCareSchedule();
};

export default function PageCalendar() {
  // const { currentProject } = useCareSupport();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState('');
  // Initialize with static calendar data for now
  const [filteredEvents, setFilteredEvents] = React.useState<CalendarData[]>(() => {
    console.log('[CALENDAR DEBUG] Initializing filteredEvents with static calendarData...');
    console.log('[CALENDAR DEBUG] Static calendarData length:', calendarData.length);
    return calendarData;
  });
  const [currentView, setCurrentView] = React.useState<'week' | 'month'>('week');
  
  // Care Event Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());


  // Events are initialized in state, no need for useEffect

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCurrentDate(startDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Filter events based on search query
    const events = generateMonthlyCareSchedule();
    const filtered = query 
      ? events.filter(event => 
        event.title?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase()) ||
        event.platform?.toLowerCase().includes(query.toLowerCase())
        )
      : events;
    setFilteredEvents(filtered);
  };

  // Care Event Dialog handlers
  const handleCreateRequestClick = () => {
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setIsEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
  };

  const handleEventCreated = (eventId: string) => {
    console.log('Care event created:', eventId);
    // Refresh the calendar events
    setFilteredEvents(generateMonthlyCareSchedule());
  };

  const handleViewChange = (view: 'week' | 'month') => {
    setCurrentView(view);
    
    // Update currentDate based on view
    if (view === 'month') {
      // For month view, set to the first day of the current month
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      setCurrentDate(firstDayOfMonth);
    } else {
      // For week view, set to the start of the current week
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      startOfWeek.setDate(diff);
      setCurrentDate(startOfWeek);
    }
  };

  // Calculate dynamic description
  const getTodayDescription = () => {
    console.log('[CALENDAR DEBUG] getTodayDescription called with filteredEvents:', filteredEvents.length);
    const todayEvents = filteredEvents.filter(event => 
      event.startDate.toDateString() === new Date().toDateString()
    );
    console.log('[CALENDAR DEBUG] todayEvents:', todayEvents.length);
    const shifts = todayEvents.filter(e => e.type === 'meeting').length;
    const appointments = todayEvents.filter(e => e.type === 'event').length;
    console.log('[CALENDAR DEBUG] shifts:', shifts, 'appointments:', appointments);
    return `You have ${shifts} care shifts and ${appointments} appointments today 🏥`;
  };

  return (
    <CareEventsProvider>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiCalendarLine className='size-6 text-text-sub-600' />
          </div>
        }
        title="Today's Care Schedule"
        description={getTodayDescription()}
      >
        <ScheduleButton className='w-full md:hidden' />
        <CreateRequestButton 
          className='w-full md:w-auto' 
          onClick={handleCreateRequestClick}
        />
      </Header>

      <div className='hidden px-8 lg:block'>
        <Divider.Root />
      </div>

      <div className='flex flex-1 flex-col px-4 pb-[18px] lg:px-8 lg:pb-6 lg:pt-4'>
        <CalendarFilters 
          onDateRangeChange={handleDateRangeChange}
          onTodayClick={handleTodayClick}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          currentView={currentView}
          onViewChange={handleViewChange}
        />

        <CalendarTabs className='mt-5 lg:mt-3' />

        <BigCalendar
          className='mt-4'
          defaultStartDate={currentDate}
          events={filteredEvents}
          showAllHours={true}
          view={currentView}
          totalShowingDays={currentView === 'month' ? 35 : 7} // 35 days for month view (5 weeks), 7 for week view
          onEventDialogOpen={(date, time) => {
            setSelectedDate(date);
            setSelectedTime(time);
            setIsEventDialogOpen(true);
          }}
          onEventsUpdate={(updatedEvents) => {
            console.log('[CALENDAR DEBUG] Events updated from BigCalendar:', updatedEvents.length, 'events');
            setFilteredEvents(updatedEvents);
          }}
        />
      </div>
      
      {/* Care Event Notifications */}
      <CareNotifications />
      
      {/* Care Event Dialog */}
      <CareEventDialog
        isOpen={isEventDialogOpen}
        onClose={handleCloseEventDialog}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onEventCreated={handleEventCreated}
      />
    </CareEventsProvider>
  );
}
