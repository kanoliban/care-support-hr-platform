'use client';

import * as React from 'react';
import {
  RiMore2Line,
  RiHeartPulseLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as WidgetBox from '@/components/widget-box';

// Clean UI components for care activities
function CareActivityItem({ title, icon, status, time }: { title: string; icon: string; status: string; time: string }) {
  return (
    <div className='flex w-full items-start gap-2.5'>
      <div className='flex size-10 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
        <img
          src={icon}
          alt=''
          className='size-6'
        />
      </div>
      <div className='flex-1 space-y-1'>
        <div className='text-paragraph-sm'>{title}</div>
        <div className='text-paragraph-xs text-text-sub-600'>{time}</div>
        <div className='text-paragraph-xs text-text-soft-400'>{status}</div>
      </div>
      <Button.Root variant='neutral' mode='ghost' size='xsmall'>
        <Button.Icon as={RiMore2Line} />
      </Button.Root>
    </div>
  );
}

export default function WidgetCareActivities({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiHeartPulseLine} />
        Care Activities
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          <Button.Icon as={RiMore2Line} />
          View All
        </Button.Root>
      </WidgetBox.Header>

      <div className='space-y-4 pb-0.5'>
        <div className='text-subheading-2xs uppercase text-text-soft-400'>
          Recent Activities
        </div>

        <CareActivityItem 
          title="Morning Care Routine"
          icon="/images/major-brands/google.svg"
          status="Completed"
          time="7:30 AM"
        />

        <CareActivityItem 
          title="Physical Therapy Session"
          icon="/images/major-brands/apple.svg"
          status="In Progress"
          time="10:00 AM"
        />

        <CareActivityItem 
          title="Medication Administration"
          icon="/images/major-brands/whatsapp.svg"
          status="Scheduled"
          time="2:00 PM"
        />
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetCareActivitiesEmpty({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiHeartPulseLine} />
        Care Activities
      </WidgetBox.Header>

      <div className='space-y-4 pb-0.5'>
        <div className='flex min-h-[124px] flex-col items-center justify-center gap-3 p-2'>
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No care activities recorded yet.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

// Legacy export for backward compatibility
export const WidgetTimeTrackerEmpty = WidgetCareActivitiesEmpty;
