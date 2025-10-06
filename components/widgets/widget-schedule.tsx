'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  RiAddLine,
  RiArrowDownSLine,
  RiCalendarEventLine,
  RiCalendarLine,
  RiDiscussLine,
  RiFilter3Fill,
  RiMapPin2Fill,
  RiSearch2Line,
  RiSuitcase2Line,
  RiUser6Fill,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroupCompact from '@/components/ui/avatar-group-compact';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import DayPicker from '@/components/day-picker';
import IllustrationEmptyScheduleEvents from '@/components/empty-state-illustrations/schedule-events';
import IllustrationEmptyScheduleHoliday from '@/components/empty-state-illustrations/schedule-holiday';
import IllustrationEmptyScheduleMeetings from '@/components/empty-state-illustrations/schedule-meetings';
import * as WidgetBox from '@/components/widget-box';
import { useSimplePermissions } from '@/lib/simple-permission-context';

import IconCmd from '~/icons/icon-cmd.svg';

type Meeting = {
  id: string;
  title: string;
  date: string;
  platform?: string;
  people?: {
    image: string;
    alt: string;
    color?: React.ComponentPropsWithoutRef<typeof Avatar.Root>['color'];
  }[];
  badges?: {
    label: string;
    color: React.ComponentPropsWithoutRef<typeof Badge.Root>['color'];
  }[];
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  by: string;
  quota: {
    current: number;
    max: number;
  };
};

type Holiday = {
  id: string;
  title: string;
  date: string;
  message: string;
  emoji: string;
  category: string;
  badge?: {
    label: string;
    color: React.ComponentPropsWithoutRef<typeof Badge.Root>['color'];
  };
};

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Morning Care Shift - Jim Nelson',
    date: '9:00 AM - 5:00 PM',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'purple',
      },
    ],
    platform: 'Personal Care',
    badges: [
      {
        label: 'Confirmed',
        color: 'blue',
      },
    ],
  },
  {
    id: '2',
    title: 'Overnight Care Shift - Jennifer',
    date: '8:00 PM - 8:00 AM',
    people: [
      {
        alt: 'Jennifer',
        image: '/images/avatar/illustration/emma.png',
        color: 'blue',
      },
    ],
    platform: 'Overnight Care',
    badges: [
      {
        label: 'PCA',
        color: 'blue',
      },
    ],
  },
  {
    id: '3',
    title: 'Weekend Care Shift - Elena Chen',
    date: '9:00 AM - 1:00 PM',
    people: [
      {
        alt: 'Elena Chen',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
    ],
    platform: 'Family Backup',
    badges: [
      {
        label: 'Backup',
        color: 'yellow',
      },
    ],
  },
  {
    id: '4',
    title: 'Evening Care Shift - Grace Thompson',
    date: '6:00 PM - 10:00 PM',
    people: [
      {
        alt: 'Grace Thompson',
        image: '/images/avatar/illustration/arthur.png',
        color: 'blue',
      },
    ],
    platform: 'Physical Therapy',
    badges: [
      {
        label: 'Specialized',
        color: 'purple',
      },
    ],
  },
  {
    id: '5',
    title: 'Night Care Shift - Maria Santos',
    date: '10:00 PM - 6:00 AM',
    people: [
      {
        alt: 'Maria Santos',
        image: '/images/avatar/illustration/emma.png',
        color: 'blue',
      },
    ],
    platform: 'Overnight Care',
    badges: [
      {
        label: 'PCA',
        color: 'blue',
      },
    ],
  },
  {
    id: '6',
    title: 'Weekend Relief - Alex Rodriguez',
    date: '1:00 PM - 9:00 PM',
    people: [
      {
        alt: 'Alex Rodriguez',
        image: '/images/avatar/illustration/sophia.png',
        color: 'yellow',
      },
    ],
    platform: 'Weekend Relief',
    badges: [
      {
        label: 'Backup',
        color: 'yellow',
      },
    ],
  },
  {
    id: '7',
    title: 'Early Morning Care - Sarah Martinez',
    date: '5:00 AM - 9:00 AM',
    people: [
      {
        alt: 'Sarah Martinez',
        image: '/images/avatar/illustration/james.png',
        color: 'purple',
      },
    ],
    platform: 'Morning Routine',
    badges: [
      {
        label: 'Confirmed',
        color: 'blue',
      },
    ],
  },
  {
    id: '8',
    title: 'Afternoon Care - Jennifer Smith',
    date: '12:00 PM - 4:00 PM',
    people: [
      {
        alt: 'Jennifer Smith',
        image: '/images/avatar/illustration/emma.png',
        color: 'blue',
      },
    ],
    platform: 'Personal Care',
    badges: [
      {
        label: 'Regular',
        color: 'blue',
      },
    ],
  },
  {
    id: '9',
    title: 'Weekend Night Shift - Elena Chen',
    date: '11:00 PM - 7:00 AM',
    people: [
      {
        alt: 'Elena Chen',
        image: '/images/avatar/illustration/sophia.png',
        color: 'purple',
      },
    ],
    platform: 'Weekend Coverage',
    badges: [
      {
        label: 'Weekend',
        color: 'yellow',
      },
    ],
  },
  {
    id: '10',
    title: 'Holiday Care - Jim Nelson',
    date: '8:00 AM - 8:00 PM',
    people: [
      {
        alt: 'Jim Nelson',
        image: '/images/avatar/illustration/james.png',
        color: 'purple',
      },
    ],
    platform: 'Holiday Coverage',
    badges: [
      {
        label: 'Holiday',
        color: 'red',
      },
    ],
  },
  {
    id: '11',
    title: 'Emergency Backup - Grace Thompson',
    date: 'On Call',
    people: [
      {
        alt: 'Grace Thompson',
        image: '/images/avatar/illustration/arthur.png',
        color: 'blue',
      },
    ],
    platform: 'Emergency Response',
    badges: [
      {
        label: 'On Call',
        color: 'red',
      },
    ],
  },
];

const events: Event[] = [
  {
    id: '1',
    title: 'Doctor Appointment - Dr. Martinez',
    date: '2:00 - 3:00 PM',
    location: 'Minneapolis Medical Center',
    by: 'by Jim Nelson',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '2',
    title: 'Physical Therapy Session',
    date: '10:00 AM - 11:00 AM',
    location: 'Rehabilitation Center',
    by: 'by Sarah Martinez',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '3',
    title: 'Family Visit - Elena Chen',
    date: '6:00 - 8:00 PM',
    location: '123 Main St, Minneapolis',
    by: 'by Elena Chen',
    quota: {
      current: 2,
      max: 3,
    },
  },
  {
    id: '4',
    title: 'Cardiology Checkup - Dr. Johnson',
    date: '9:00 AM - 10:30 AM',
    location: 'Heart Care Clinic',
    by: 'by Grace Thompson',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '5',
    title: 'Dental Cleaning - Dr. Williams',
    date: '1:00 PM - 2:00 PM',
    location: 'Bright Smile Dentistry',
    by: 'by Jennifer Smith',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '6',
    title: 'Ophthalmology Exam - Dr. Brown',
    date: '3:30 PM - 4:30 PM',
    location: 'Vision Care Center',
    by: 'by Alex Rodriguez',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '7',
    title: 'Neurology Consultation - Dr. Davis',
    date: '11:00 AM - 12:00 PM',
    location: 'Neurological Associates',
    by: 'by Maria Santos',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '8',
    title: 'Podiatry Appointment - Dr. Wilson',
    date: '4:00 PM - 5:00 PM',
    location: 'Foot Care Specialists',
    by: 'by Alaina Shen',
    quota: {
      current: 1,
      max: 1,
    },
  },
  {
    id: '9',
    title: 'Hearing Test - Dr. Taylor',
    date: '2:30 PM - 3:15 PM',
    location: 'Audiology Center',
    by: 'by Elena Chen',
    quota: {
      current: 1,
      max: 1,
    },
  },
];

const holidays: Holiday[] = [
  {
    id: '1',
    title: 'Grace - Summer Break',
    date: 'JUN 01 - SEP 15',
    message: 'Grace unavailable for overnight shifts',
    emoji: '🏖️',
    category: 'Caregiver Unavailable',
    badge: {
      color: 'orange',
      label: '3-months break',
    },
  },
  {
    id: '2',
    title: 'Sarah - Medical Leave',
    date: 'MAR 15 - MAR 20',
    message: 'Sarah unavailable due to medical procedure',
    emoji: '🏥',
    category: 'Medical Leave',
    badge: {
      color: 'red',
      label: '5-days break',
    },
  },
  {
    id: '3',
    title: 'Alex - Family Emergency',
    date: 'MAY 10 - MAY 12',
    message: 'Alex unavailable for family emergency',
    emoji: '🚨',
    category: 'Family Emergency',
    badge: {
      color: 'red',
      label: '3-days break',
    },
  },
  {
    id: '4',
    title: 'Jim - Vacation Time',
    date: 'JUL 20 - JUL 30',
    message: 'Jim taking family vacation',
    emoji: '✈️',
    category: 'Vacation',
    badge: {
      color: 'blue',
      label: '10-days break',
    },
  },
  {
    id: '5',
    title: 'Elena - Training Course',
    date: 'APR 05 - APR 07',
    message: 'Elena attending professional development',
    emoji: '📚',
    category: 'Training',
    badge: {
      color: 'purple',
      label: '3-days break',
    },
  },
  {
    id: '6',
    title: 'Maria - Personal Leave',
    date: 'JUN 15 - JUN 17',
    message: 'Maria unavailable for personal matters',
    emoji: '🏠',
    category: 'Personal Leave',
    badge: {
      color: 'orange',
      label: '3-days break',
    },
  },
  {
    id: '7',
    title: 'Jennifer - Conference',
    date: 'SEP 10 - SEP 12',
    message: 'Jennifer attending healthcare conference',
    emoji: '🏢',
    category: 'Professional Development',
    badge: {
      color: 'blue',
      label: '3-days break',
    },
  },
  {
    id: '8',
    title: 'Alaina - Wedding',
    date: 'AUG 25 - AUG 27',
    message: 'Alaina attending family wedding',
    emoji: '💒',
    category: 'Family Event',
    badge: {
      color: 'green',
      label: '3-days break',
    },
  },
  {
    id: '9',
    title: 'Alex - Surgery Recovery',
    date: 'OCT 01 - OCT 15',
    message: 'Alex recovering from minor surgery',
    emoji: '🏥',
    category: 'Medical Recovery',
    badge: {
      color: 'red',
      label: '15-days break',
    },
  },
  {
    id: '10',
    title: 'Grace - Holiday Break',
    date: 'DEC 20 - JAN 05',
    message: 'Grace unavailable during holidays',
    emoji: '🎄',
    category: 'Holiday Break',
    badge: {
      color: 'red',
      label: '17-days break',
    },
  },
];

function MeetingItem({ id, title, date, platform, badges, people }: Meeting) {
  return (
    <AccordionPrimitive.Item
      value={id}
      defaultChecked
      className='rounded-xl bg-bg-weak-50 p-4'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        <AccordionPrimitive.Trigger asChild>
          <CompactButton.Root
            variant='white'
            size='large'
            fullRadius
            className='group'
          >
            <CompactButton.Icon
              as={RiArrowDownSLine}
              className='transition duration-200 ease-out group-data-[state=open]:rotate-180'
            />
          </CompactButton.Root>
        </AccordionPrimitive.Trigger>
      </div>

      <AccordionPrimitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
        <div className='space-y-3.5 pt-3.5'>
          {people && (
            <AvatarGroupCompact.Root size='24'>
              <AvatarGroupCompact.Stack>
                {people.slice(0, 3).map(({ image, alt, color }, i) => (
                  <Avatar.Root key={i} color={color}>
                    <Avatar.Image src={image} alt={alt} />
                  </Avatar.Root>
                ))}
              </AvatarGroupCompact.Stack>
              {people.length > 3 && (
                <AvatarGroupCompact.Overflow>
                  +{people.length - 3}
                </AvatarGroupCompact.Overflow>
              )}
            </AvatarGroupCompact.Root>
          )}

          <div className='flex items-center justify-between'>
            {platform && (
              <span className='text-paragraph-xs text-text-sub-600'>
                {platform}
              </span>
            )}
            {badges && (
              <div className='flex gap-1'>
                {badges.map(({ color, label }, i) => (
                  <Badge.Root
                    key={i}
                    size='medium'
                    variant='light'
                    color={color}
                  >
                    {label}
                  </Badge.Root>
                ))}
              </div>
            )}
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function EventItem({
  id,
  title,
  date,
  location,
  by,
  quota,
  index,
}: Event & { index: number }) {
  const mapPinColors = [
    'text-error-base',
    'text-verified-base',
    'text-success-base',
    'text-warning-base',
    'text-information-base',
    'text-highlighted-base',
    'text-feature-base',
  ];

  const mapPinColor = mapPinColors[index % mapPinColors.length];

  return (
    <AccordionPrimitive.Item
      value={id}
      defaultChecked
      className='rounded-xl bg-bg-weak-50 p-4'
    >
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        <AccordionPrimitive.Trigger asChild>
          <CompactButton.Root
            variant='white'
            size='large'
            fullRadius
            className='group'
          >
            <CompactButton.Icon
              as={RiArrowDownSLine}
              className='transition duration-200 ease-out group-data-[state=open]:rotate-180'
            />
          </CompactButton.Root>
        </AccordionPrimitive.Trigger>
      </div>

      <AccordionPrimitive.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
        <div className='space-y-4 pt-4'>
          <div className='flex items-center gap-2'>
            <div className='flex size-7 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs'>
              <RiMapPin2Fill className={cn('size-5', mapPinColor)} />
            </div>
            <div className='text-paragraph-sm'>{location}</div>
          </div>

          <div className='flex items-center justify-between gap-2'>
            <span className='text-paragraph-xs text-text-sub-600'>{by}</span>
            <div className='flex items-center gap-1 text-paragraph-xs text-text-sub-600'>
              <RiUser6Fill className='size-4' />
              {quota.current}/{quota.max}
            </div>
          </div>
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}

function HolidayItem({
  title,
  date,
  category,
  emoji,
  message,
  badge,
}: Holiday) {
  return (
    <div className='space-y-4 rounded-xl bg-bg-weak-50 p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='space-y-1'>
          <div className='text-label-sm'>{title}</div>
          <div className='text-subheading-xs text-text-sub-600'>{date}</div>
        </div>
        {badge && (
          <Badge.Root variant='light' size='medium' color={badge.color}>
            {badge.label}
          </Badge.Root>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <div className='flex size-7 items-center justify-center rounded-full bg-bg-white-0 text-paragraph-sm shadow-regular-xs'>
          {emoji}
        </div>
        <div className='text-paragraph-sm'>{message}</div>
      </div>

      <div className='text-paragraph-xs text-text-sub-600'>{category}</div>
    </div>
  );
}

export default function WidgetSchedule({
  emptyState,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  emptyState?: boolean;
}) {
  const { currentProfile } = useSimplePermissions();
  
  // Dynamic data based on current profile
  const getDynamicData = () => {
    if (currentProfile?.id === 'luanns-care-team') {
      return {
        meetings: [
          {
            id: '1',
            title: 'Dementia Day Care - Jim Nelson',
            date: '9:00 AM - 5:00 PM',
            people: [
              {
                alt: 'Jim Nelson',
                image: '/images/avatar/illustration/james.png',
                color: 'purple',
              },
            ],
            platform: 'Dementia Care',
            badges: [
              {
                label: 'Confirmed',
                color: 'blue',
              },
            ],
          },
          {
            id: '2',
            title: 'Dementia Overnight Care - Jennifer',
            date: '8:00 PM - 8:00 AM',
            people: [
              {
                alt: 'Jennifer',
                image: '/images/avatar/illustration/emma.png',
                color: 'blue',
              },
            ],
            platform: 'Dementia Overnight',
            badges: [
              {
                label: 'PCA',
                color: 'blue',
              },
            ],
          },
          {
            id: '3',
            title: 'Dementia Weekend Care - Olena',
            date: '9:00 AM - 1:00 PM',
            people: [
              {
                alt: 'Olena',
                image: '/images/avatar/illustration/natalia.png',
                color: 'purple',
              },
            ],
            platform: 'Weekend Care',
            badges: [
              {
                label: 'Weekend',
                color: 'yellow',
              },
            ],
          },
          {
            id: '4',
            title: 'Dementia Evening Care - Marta Snow',
            date: '6:00 PM - 10:00 PM',
            people: [
              {
                alt: 'Marta Snow',
                image: '/images/avatar/illustration/emma.png',
                color: 'blue',
              },
            ],
            platform: 'Evening Care',
            badges: [
              {
                label: 'Family',
                color: 'green',
              },
            ],
          }
        ],
        events: [
          {
            id: '1',
            title: 'Neurology Appointment - Dr. Martinez',
            date: '2:00 - 3:00 PM',
            location: 'Minneapolis Medical Center',
            by: 'by Jim Nelson',
            quota: {
              current: 1,
              max: 1,
            },
          },
          {
            id: '2',
            title: 'Cognitive Assessment',
            date: '10:00 AM - 11:00 AM',
            location: 'Memory Care Clinic',
            by: 'by Marta Snow',
            quota: {
              current: 1,
              max: 1,
            },
          },
          {
            id: '3',
            title: 'Family Meeting - Marta & Rob',
            date: '6:00 - 8:00 PM',
            location: '456 Oak Street, Minneapolis',
            by: 'by Marta Snow',
            quota: {
              current: 2,
              max: 3,
            },
          }
        ]
      };
    } else {
      return { meetings, events };
    }
  };

  const dynamicData = getDynamicData();
  const dynamicMeetings = dynamicData.meetings;
  const dynamicEvents = dynamicData.events;

  const [selectedDay, setSelectedDay] = React.useState<Date>(new Date());
  const [openedMeetings, setOpenedMeetings] = React.useState([
    ...dynamicMeetings.map((p) => p.id),
  ]);
  const [openedEvents, setOpenedEvents] = React.useState([
    ...dynamicEvents.map((p) => p.id),
  ]);

  // Update state when profile changes
  React.useEffect(() => {
    setOpenedMeetings(dynamicMeetings.map((p) => p.id));
    setOpenedEvents(dynamicEvents.map((p) => p.id));
  }, [currentProfile?.id]);

  // Check if currently selected day is today
  const isToday = React.useMemo(() => {
    const today = new Date();
    return selectedDay.toDateString() === today.toDateString();
  }, [selectedDay]);

  // Handle "Today" button click
  const handleTodayClick = () => {
    setSelectedDay(new Date());
  };

  // React.useEffect(() => {
  //   console.log('selectedDay: ', format(selectedDay, 'yyy MMM dd'));
  // }, [selectedDay]);

  return (
    <WidgetBox.Root {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiCalendarLine} />
        Schedule
        <Button.Root 
          variant='neutral' 
          mode='stroke'
          size='xsmall'
          onClick={isToday ? () => window.open('/calendar', '_blank') : handleTodayClick}
        >
          {isToday ? 'See All' : 'Today'}
        </Button.Root>
      </WidgetBox.Header>

      <DayPicker value={selectedDay} onDayChange={setSelectedDay} />

      <div className='py-4'>
        <Input.Root size='medium'>
          <Input.Wrapper>
            <Input.Icon as={RiSearch2Line} />
            <Input.Input placeholder='Search...' />
            <Kbd.Root>
              <IconCmd className='size-2.5' />1
            </Kbd.Root>
            <button type='button' className=''>
              <RiFilter3Fill className='size-5 text-text-soft-400' />
            </button>
          </Input.Wrapper>
        </Input.Root>
      </div>

      <TabMenuHorizontal.Root defaultValue='meetings'>
        <TabMenuHorizontal.List wrapperClassName='-mx-4' className='gap-3 px-4'>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='meetings'>
            <TabMenuHorizontal.Icon as={RiDiscussLine} />
            Care Shifts
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='events'>
            <TabMenuHorizontal.Icon as={RiCalendarEventLine} />
            Appointments
          </TabMenuHorizontal.Trigger>
          <TabMenuHorizontal.Trigger className='flex-1 px-2' value='holidays'>
            <TabMenuHorizontal.Icon as={RiSuitcase2Line} />
            Blocked Dates
          </TabMenuHorizontal.Trigger>
        </TabMenuHorizontal.List>
        <TabMenuHorizontal.Content
          value='meetings'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleMeetings className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No care shifts scheduled yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <div className='h-[600px] overflow-y-auto pt-4' style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}>
              <AccordionPrimitive.Root
                type='multiple'
                defaultValue={openedMeetings}
                onValueChange={(value) => setOpenedMeetings(value)}
                className='space-y-2'
              >
                {dynamicMeetings.map((meeting) => (
                  <MeetingItem key={meeting.id} {...meeting} />
                ))}
              </AccordionPrimitive.Root>
            </div>
          )}
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='events'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleEvents className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No appointments scheduled yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <div className='h-[480px] overflow-y-auto pt-4' style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}>
              <AccordionPrimitive.Root
                type='multiple'
                defaultValue={openedEvents}
                onValueChange={(value) => setOpenedEvents(value)}
                className='space-y-2'
              >
                {dynamicEvents.map((event, i) => (
                  <EventItem key={event.id} index={i} {...event} />
                ))}
              </AccordionPrimitive.Root>
            </div>
          )}
        </TabMenuHorizontal.Content>
        <TabMenuHorizontal.Content
          value='holidays'
          className='data-[state=active]:duration-300 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-5'
        >
          {emptyState ? (
            <div className='pt-4'>
              <div className='flex h-[460px] flex-col items-center justify-center gap-5 p-5'>
                <IllustrationEmptyScheduleHoliday className='size-[108px]' />
                <div className='text-center text-paragraph-sm text-text-soft-400'>
                  No blocked dates scheduled yet.
                  <br /> Please check back later.
                </div>
                <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                  <Button.Icon as={RiAddLine} />
                  Request
                </Button.Root>
              </div>
            </div>
          ) : (
            <div className='h-[480px] overflow-y-auto pt-4' style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#d1d5db #f3f4f6'
            }}>
              <div className='space-y-2'>
                {holidays.map((holiday) => (
                  <HolidayItem key={holiday.id} {...holiday} />
                ))}
              </div>
            </div>
          )}
        </TabMenuHorizontal.Content>
      </TabMenuHorizontal.Root>
    </WidgetBox.Root>
  );
}
