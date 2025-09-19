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

const calendarData: CalendarData[] = [
  // Rob's Family Care Schedule - Real Data (using current date)
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 9, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 17, 0),
    title: 'Jim Nelson - Primary Care (M-F 9am-5pm)',
    completed: true,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 20, 0),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 8, 0),
    title: 'Jennifer - Overnight Care (M,T 8pm-8am)',
    completed: true,
    type: 'meeting',
    people: [
      {
        alt: 'Jennifer',
        image: '/images/avatar/illustration/arthur.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date('2024-11-05T09:00:00'),
    endDate: new Date('2024-11-05T17:00:00'),
    title: 'Jim Nelson - Primary Care (M-F 9am-5pm)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date('2024-11-05T20:00:00'),
    endDate: new Date('2024-11-06T08:00:00'),
    title: 'Jennifer - Overnight Care (M,T 8pm-8am)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jennifer',
        image: '/images/avatar/illustration/arthur.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date('2024-11-06T09:00:00'),
    endDate: new Date('2024-11-06T17:00:00'),
    title: 'Jim Nelson - Primary Care (M-F 9am-5pm)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date('2024-11-06T20:00:00'),
    endDate: new Date('2024-11-07T08:00:00'),
    title: 'Sarah - Overnight Care (W,Th 8pm-8am)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Sarah',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
    ],
  },
  {
    startDate: new Date('2024-11-07T09:00:00'),
    endDate: new Date('2024-11-07T17:00:00'),
    title: 'Jim Nelson - Primary Care (M-F 9am-5pm)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
    ],
  },
  {
    startDate: new Date('2024-11-07T20:00:00'),
    endDate: new Date('2024-11-08T08:00:00'),
    title: 'Sarah - Overnight Care (W,Th 8pm-8am)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Sarah',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
    ],
  },
  {
    startDate: new Date('2024-11-08T09:00:00'),
    endDate: new Date('2024-11-08T17:00:00'),
    title: 'Jim Nelson - Primary Care (M-F 9am-5pm)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
      {
        alt: 'Jennifer Smith',
        image: '/images/avatar/illustration/arthur.png',
      },
      {
        alt: 'Elena Chen',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
      {
        alt: 'Sarah Martinez',
        image: '/images/avatar/illustration/emma.png',
        color: 'yellow',
      },
    ],
    platform: 'Care Center',
  },
  {
    startDate: new Date('2024-11-07T09:00:00'),
    endDate: new Date('2024-11-07T10:00:00'),
    title: 'Family Feedback Analysis',
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'blue',
      },
      {
        alt: 'Jennifer Smith',
        image: '/images/avatar/illustration/arthur.png',
      },
      {
        alt: 'Elena Chen',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
      {
        alt: 'Sarah Martinez',
        image: '/images/avatar/illustration/emma.png',
        color: 'yellow',
      },
    ],
    platform: 'Family Meeting',
  },
  {
    startDate: new Date('2024-11-07T11:30:00'),
    endDate: new Date('2024-11-07T13:00:00'),
    title: 'Medical Webinar: "Advanced Care Techniques for 2024"',
    type: 'event',
    link: 'www.carewebinar.com',
  },
  // disabled hour
  {
    startDate: new Date('2024-11-08T09:00:00'),
    endDate: new Date('2024-11-08T14:00:00'),
    disabled: true,
  },
  // {
  //   startDate: new Date('2024-11-10T06:30:00'),
  //   endDate: new Date('2024-11-10T08:30:00'),
  //   title: 'A mysterious event',
  //   type: 'event',
  //   link: 'www.alignui.com',
  // },
];

export default function PageCalendar() {
  // const { currentProject } = useCareSupport();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredEvents, setFilteredEvents] = React.useState<CalendarData[]>([]);
  const [currentView, setCurrentView] = React.useState<'week' | 'month'>('week');
  
  // Care Event Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());

  // Generate dynamic calendar events (using static data for now)
  const generateCalendarEvents = (): CalendarData[] => {
    console.log('[CALENDAR DEBUG] generateCalendarEvents called');
    const events: CalendarData[] = [];
    const today = new Date();
    
    // Add test events for today and the next few days
    const testDate = new Date(); // Use current date
    console.log('[CALENDAR DEBUG] testDate:', testDate);
    
    events.push(
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 9, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 17, 0),
            title: 'Help with morning routine and medication',
            type: 'meeting',
            completed: false,
            people: [
              {
                alt: 'Jim Nelson',
                image: '/images/avatar/illustration/james.png',
                color: 'blue',
              },
            ],
            platform: 'Rob\'s Home',
            // Additional fields from create form
            description: 'Assist with morning routine including medication administration and light housekeeping',
            assignedCaregiver: 'Jim Nelson',
            client: 'Rob',
            isRecurring: true,
            recurrencePattern: 'weekly every 1 on Mon,Tue,Wed,Thu,Fri',
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Personal Care',
              notes: 'Please arrive 15 minutes early to prepare medications',
              isOpenToAnyone: false,
            },
          },
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 14, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 15, 30),
            title: 'Physical therapy session with Dr. Martinez',
            type: 'event',
            completed: false,
            location: 'Medical Center',
            people: [
              {
                alt: 'Dr. Martinez',
                image: '/images/avatar/illustration/emma.png',
                color: 'yellow',
              },
            ],
            // Additional fields from create form
            description: 'Weekly physical therapy session focusing on mobility and strength',
            assignedCaregiver: 'Open to anyone',
            client: 'Rob',
            isRecurring: false,
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Medical Appointment',
              notes: 'Transportation needed - please coordinate with family',
              isOpenToAnyone: true,
            },
          },
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate(), 20, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 8, 0),
            title: 'Overnight care and safety monitoring',
            type: 'meeting',
            completed: false,
            people: [
              {
                alt: 'Jennifer',
                image: '/images/avatar/illustration/arthur.png',
                color: 'blue',
              },
            ],
            platform: 'Rob\'s Home',
            // Additional fields from create form
            description: 'Overnight care including safety checks, medication reminders, and emergency response',
            assignedCaregiver: 'Jennifer Smith',
            client: 'Rob',
            isRecurring: true,
            recurrencePattern: 'weekly every 1 on Fri,Sat,Sun',
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Overnight Care',
              notes: 'Emergency contact numbers posted on refrigerator',
              isOpenToAnyone: false,
            },
          },
          // Add more recurring events to test deletion functionality
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 9, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 17, 0),
            title: 'Help with morning routine and medication',
            type: 'meeting',
            completed: false,
            people: [
              {
                alt: 'Jim Nelson',
                image: '/images/avatar/illustration/james.png',
                color: 'blue',
              },
            ],
            platform: 'Rob\'s Home',
            description: 'Assist with morning routine including medication administration and light housekeeping',
            assignedCaregiver: 'Jim Nelson',
            client: 'Rob',
            isRecurring: true,
            recurrencePattern: 'weekly every 1 on Mon,Tue,Wed,Thu,Fri',
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Personal Care',
              notes: 'Please arrive 15 minutes early to prepare medications',
              isOpenToAnyone: false,
            },
          },
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 2, 9, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 2, 17, 0),
            title: 'Help with morning routine and medication',
            type: 'meeting',
            completed: false,
            people: [
              {
                alt: 'Jim Nelson',
                image: '/images/avatar/illustration/james.png',
                color: 'blue',
              },
            ],
            platform: 'Rob\'s Home',
            description: 'Assist with morning routine including medication administration and light housekeeping',
            assignedCaregiver: 'Jim Nelson',
            client: 'Rob',
            isRecurring: true,
            recurrencePattern: 'weekly every 1 on Mon,Tue,Wed,Thu,Fri',
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Personal Care',
              notes: 'Please arrive 15 minutes early to prepare medications',
              isOpenToAnyone: false,
            },
          },
          {
            startDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 1, 20, 0),
            endDate: new Date(testDate.getFullYear(), testDate.getMonth(), testDate.getDate() + 2, 8, 0),
            title: 'Overnight care and safety monitoring',
            type: 'meeting',
            completed: false,
            people: [
              {
                alt: 'Jennifer',
                image: '/images/avatar/illustration/arthur.png',
                color: 'blue',
              },
            ],
            platform: 'Rob\'s Home',
            description: 'Overnight care including safety checks, medication reminders, and emergency response',
            assignedCaregiver: 'Jennifer Smith',
            client: 'Rob',
            isRecurring: true,
            recurrencePattern: 'weekly every 1 on Fri,Sat,Sun',
            status: 'scheduled',
            visibility: 'care-team-only',
            metadata: {
              requestType: 'Overnight Care',
              notes: 'Emergency contact numbers posted on refrigerator',
              isOpenToAnyone: false,
            },
          }
        );

    // Add a simple event for tomorrow
    const tomorrow = new Date(testDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    events.push({
      startDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0),
      endDate: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0),
      title: 'Doctor Appointment',
      type: 'event',
      completed: false,
      location: 'Medical Center',
      people: [
        {
          alt: 'Dr. Smith',
          image: '/images/avatar/illustration/emma.png',
          color: 'green',
        },
      ],
      description: 'Regular checkup appointment',
      assignedCaregiver: 'Dr. Smith',
      client: 'Rob',
      isRecurring: false,
      status: 'scheduled',
      visibility: 'care-team-only',
      metadata: {
        requestType: 'Medical Appointment',
        notes: 'Bring insurance card',
        isOpenToAnyone: false,
      },
    });

    const combinedEvents = [...events, ...calendarData]; // Combine with existing static data
    console.log('[CALENDAR DEBUG] Combined events:', combinedEvents.length, 'total events');
    console.log('[CALENDAR DEBUG] Generated events:', events.length);
    console.log('[CALENDAR DEBUG] Static calendarData:', calendarData.length);
    return combinedEvents;
  };

  // Initialize events immediately
  React.useEffect(() => {
    console.log('[CALENDAR DEBUG] useEffect running, calling generateCalendarEvents...');
    const events = generateCalendarEvents();
    console.log('[CALENDAR DEBUG] generateCalendarEvents returned:', events.length, 'events');
    console.log('[CALENDAR DEBUG] Events:', events);
    setFilteredEvents(events);
  }, []); // Run once on mount
  
  // Also set events on component mount
  React.useLayoutEffect(() => {
    console.log('[CALENDAR DEBUG] useLayoutEffect running, setting initial events...');
    const events = generateCalendarEvents();
    console.log('[CALENDAR DEBUG] Initial events:', events.length);
    setFilteredEvents(events);
  }, []);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCurrentDate(startDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Filter events based on search query
    const events = generateCalendarEvents();
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
    setFilteredEvents(generateCalendarEvents());
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
        />
        {console.log('[CALENDAR DEBUG] Passing to BigCalendar:', filteredEvents.length, 'events')}
        {console.log('[CALENDAR DEBUG] filteredEvents:', filteredEvents)}
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
