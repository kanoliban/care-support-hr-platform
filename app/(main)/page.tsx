'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import * as Avatar from '@/components/ui/avatar';
import { CreateRequestButton } from '@/components/create-request-button';
import { ScheduleButton } from '@/components/schedule-button';
import WidgetCurrentProject from '@/components/widgets/widget-current-project';
import WidgetNotes from '@/components/widgets/widget-notes';
import WidgetSchedule from '@/components/widgets/widget-schedule';
import WidgetStatusTracker from '@/components/widgets/widget-status-tracker';
import WidgetTimeOff from '@/components/widgets/widget-time-off';
import RealTimeToggle from '@/components/real-time-toggle';
import CareEventDialog from '@/components/care-event-dialog';
import { CareEventsProvider } from '@/hooks/useCareEvents';
import { CareNotifications } from '@/components/care-notifications';

import Header from './header';

export default function PageHome() {
  const router = useRouter();
  
  // Care Event Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedTime, setSelectedTime] = React.useState(new Date());

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
    // Navigate to activities page to show the created event
      router.push('/tasks');
  };

  return (
    <CareEventsProvider>
      <Header
        icon={
          <Avatar.Root size='48' color='purple'>
            <Avatar.Image src='/images/avatar/illustration/sophia.png' alt='' />
          </Avatar.Root>
        }
        title='Care Coordination Center'
        description='Welcome back to CareSupport OS 👋🏻'
        contentClassName='hidden lg:flex'
      >
        <RealTimeToggle className='hidden lg:flex' />
        <ScheduleButton className='hidden lg:flex' />
        <CreateRequestButton 
          className='hidden lg:flex' 
          onClick={handleCreateRequestClick}
        />
      </Header>

      <div className='flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 animate-float items-stretch'>
          {/* Left Column: Coverage Gaps, Current Shift */}
          <div className='flex flex-col gap-6'>
            <div className='h-80'>
              <WidgetTimeOff />
            </div>
            <div className='h-80'>
              <WidgetCurrentProject />
            </div>
          </div>
          
          {/* Middle Column: Care Team Status, Care Activities */}
          <div className='flex flex-col gap-6'>
            <div className='h-80'>
              <WidgetStatusTracker />
            </div>
            <div className='h-80'>
              <WidgetNotes />
            </div>
          </div>
          
          {/* Right Column: 4 Schedule Cards */}
          <div className='flex flex-col gap-6'>
            <div className='h-80'>
              <WidgetSchedule />
            </div>
            <div className='h-80'>
              <WidgetSchedule />
            </div>
            <div className='h-80'>
              <WidgetSchedule />
            </div>
            <div className='h-80'>
              <WidgetSchedule />
            </div>
          </div>
        </div>
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
