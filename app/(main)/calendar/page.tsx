'use client';

import * as React from 'react';
import { RiCalendarLine } from '@remixicon/react';
import { format, startOfWeek, endOfWeek } from 'date-fns';

import * as Divider from '@/components/ui/divider';
import { BigCalendar, type CalendarData } from '@/components/big-calendar';
import { CreateRequestButton } from '@/components/create-request-button';
import Header from '@/app/(main)/header';
// import { useCareSupport } from '@/hooks/useCareSupport';

import CalendarFilters from './filters';
import CalendarTabs from './tabs';
import { CareEventsProvider } from '@/hooks/useCareEvents';
import { CareNotifications } from '@/components/care-notifications';
import CareEventDialog from '@/components/care-event-dialog';

const calendarData: CalendarData[] = [
  // Rob's Family Care Schedule - Real Data
  {
    startDate: new Date('2024-11-04T09:00:00'),
    endDate: new Date('2024-11-04T17:00:00'),
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
    startDate: new Date('2024-11-04T20:00:00'),
    endDate: new Date('2024-11-05T08:00:00'),
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
  // TEST EVENT: Jim Nelson - Friday, September 19, 2024 at noon (1-hour block)
  {
    startDate: new Date('2024-09-19T12:00:00'),
    endDate: new Date('2024-09-19T13:00:00'),
    title: 'Jim Nelson - Daily Care Routine (Medication & Mobility)',
    completed: false,
    type: 'meeting',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/arthur.png',
        color: 'blue',
      },
    ],
    location: "Rob's Home",
    description: 'Daily medication administration, mobility assistance, and health monitoring. Includes transfer to wheelchair, range of motion exercises, and vital signs check.',
    assignedCaregiver: 'Jim Nelson',
    client: 'Rob Wudlick',
    careType: 'Daily Care',
    priority: 'High',
    status: 'scheduled',
    visibility: 'care-team-only',
    metadata: {
      careResponsibilities: ['Medication Management', 'Mobility Assistance', 'Health Monitoring'],
      specialInstructions: 'Rob requires assistance with morning medication routine and transfer from bed to wheelchair. Check for any overnight changes in condition.',
      equipment: ['Wheelchair', 'Medication Organizer', 'Blood Pressure Monitor'],
      notes: 'Regular Friday morning routine. Jim has been providing this care for 18 months and is familiar with Rob\'s specific needs.'
    }
  },
];

export default function PageCalendar() {
  // const { currentProject } = useCareSupport();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredEvents, setFilteredEvents] = React.useState<CalendarData[]>([]);
  const [dateRange, setDateRange] = React.useState<{start: Date, end: Date} | null>(null);
  
  // Care Event Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());

  // Generate calendar events (using static data to avoid infinite loops)
  const generateCalendarEvents = React.useMemo((): CalendarData[] => {
    // Return static data only - no dynamic date generation to avoid infinite loops
    return calendarData;
  }, []);

  React.useEffect(() => {
    setFilteredEvents(generateCalendarEvents);
  }, []);

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setCurrentDate(startDate);
    // Store the date range for filtering events
    const newRange = { start: startDate, end: endDate };
    setDateRange(newRange);
    // Trigger filtering with current search query and new date range
    filterEvents(searchQuery, newRange);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    filterEvents(query, dateRange);
  };

  const filterEvents = (query: string, range: {start: Date, end: Date} | null) => {
    const events = generateCalendarEvents;
    let filtered = events;

    // Filter by search query
    if (query) {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(query.toLowerCase()) ||
        event.location?.toLowerCase().includes(query.toLowerCase()) ||
        event.platform?.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by date range
    if (range) {
      filtered = filtered.filter(event => {
        const eventDate = event.startDate;
        return eventDate >= range.start && eventDate <= range.end;
      });
    }

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
    setFilteredEvents(generateCalendarEvents);
  };

  // Calculate dynamic description
  const getTodayDescription = () => {
    const todayEvents = filteredEvents.filter(event => 
      event.startDate.toDateString() === new Date().toDateString()
    );
    const shifts = todayEvents.filter(e => e.type === 'meeting').length;
    const appointments = todayEvents.filter(e => e.type === 'event').length;
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
        />

        <CalendarTabs 
          className='mt-5 lg:mt-3' 
          events={filteredEvents}
          onTabChange={(tabValue, filteredTabEvents) => {
            console.log('Tab changed:', tabValue, filteredTabEvents);
            // You can add additional logic here if needed
          }}
        />

        <BigCalendar
          className='mt-4'
          defaultStartDate={currentDate}
          events={filteredEvents}
          showAllHours={true}
          onDateChange={(date) => setCurrentDate(date)}
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
