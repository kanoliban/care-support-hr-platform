'use client';

import * as React from 'react';
import * as Avatar from '@/components/ui/avatar';
import { CreateRequestButton } from '@/components/create-request-button';
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
  // Care Event Dialog state
  const [isEventDialogOpen, setIsEventDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [selectedTime, setSelectedTime] = React.useState(() => new Date());

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
        <CreateRequestButton 
          className='hidden lg:flex' 
          onClick={handleCreateRequestClick}
        />
      </Header>

      <div className='flex flex-col gap-6 px-4 pb-6 lg:px-8 lg:pt-1'>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(344px,1fr))] items-stretch justify-center gap-6'>
          {/* Core Care Coordination Widgets */}
          <WidgetTimeOff />
          <WidgetCurrentProject />
          <WidgetSchedule className='row-span-2' />
          
          {/* Care Team & Status Widgets */}
          <WidgetStatusTracker />
          <WidgetNotes />
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
