'use client';

import { RiIndeterminateCircleFill, RiTeamLine } from '@remixicon/react';

import { useRouter } from 'next/navigation';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyStatusTracker from '@/components/empty-state-illustrations/status-tracker';
import * as WidgetBox from '@/components/widget-box';
import { useSimplePermissions } from '@/lib/simple-permission-context';

export default function WidgetStatusTracker({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter();
  const { currentProfile } = useSimplePermissions();

  // Dynamic team status data based on current profile
  const getTeamStatus = () => {
    if (currentProfile?.id === 'luanns-care-team') {
      return {
        onDuty: [
          {
            name: 'Marta Snow',
            role: 'Primary Care Coordinator',
            avatar: '/images/avatar/illustration/james.png',
            status: 'online',
            activity: 'Coordinating care',
            emoji: '👩‍💼'
          },
          {
            name: 'Jim Nelson',
            role: 'Dementia Specialist',
            avatar: '/images/avatar/illustration/james.png',
            status: 'online',
            activity: 'Morning assessment',
            emoji: '👨‍⚕️'
          }
        ],
        onBreak: [
          {
            name: 'Jennifer',
            role: 'Dementia PCA',
            avatar: '/images/avatar/illustration/emma.png',
            status: 'away',
            activity: 'Lunch break',
            emoji: '👩‍⚕️',
            duration: '25m'
          },
          {
            name: 'Rob Wudlick',
            role: 'Care Coordinator',
            avatar: '/images/avatar/illustration/arthur.png',
            status: 'away',
            activity: 'Family time',
            emoji: '👨‍👩‍👧‍👦',
            duration: '8m'
          }
        ]
      };
    } else {
      // Rob's care team
      return {
        onDuty: [
          {
            name: 'Jim Nelson',
            role: 'Primary Caregiver',
            avatar: '/images/avatar/illustration/james.png',
            status: 'online',
            activity: 'Morning care routine',
            emoji: '👨‍⚕️'
          },
          {
            name: 'Elena Chen',
            role: 'Family Backup',
            avatar: '/images/avatar/illustration/arthur.png',
            status: 'online',
            activity: 'Family coordination',
            emoji: '👩‍👧'
          }
        ],
        onBreak: [
          {
            name: 'Jennifer Smith',
            role: 'PCA - Overnight Care',
            avatar: '/images/avatar/illustration/emma.png',
            status: 'away',
            activity: 'Sleeping',
            emoji: '👩‍⚕️',
            duration: '12m'
          },
          {
            name: 'Grace Thompson',
            role: 'Physical Therapist',
            avatar: '/images/avatar/illustration/arthur.png',
            status: 'away',
            activity: 'Lunch break',
            emoji: '👩‍⚕️',
            duration: '25m'
          }
        ]
      };
    }
  };

  const teamStatus = getTeamStatus();

  return (
    <WidgetBox.Root className="min-h-[380px]" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Care Team Status
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          onClick={() => router.push('/teams')}
        >
          View Team
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pb-1 pt-4'>
        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>On Duty</p>
          <div className='space-y-4'>
            {teamStatus.onDuty.map((member, index) => (
              <div key={index} className='flex items-center gap-3.5'>
                <Avatar.Root size='40'>
                  <Avatar.Image src={member.avatar} />
                  <Avatar.Indicator>
                    <Avatar.Status status={member.status} />
                  </Avatar.Indicator>
                </Avatar.Root>

                <div className='grow space-y-1'>
                  <div className='text-label-sm'>{member.name} {member.emoji}</div>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    {member.activity}
                  </div>
                </div>

                <Badge.Root color='green' variant='lighter' size='medium'>
                  <Badge.Icon as={RiIndeterminateCircleFill} />
                  Active
                </Badge.Root>
              </div>
            ))}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>On Break</p>
          <div className='space-y-4'>
            {teamStatus.onBreak.map((member, index) => (
              <div key={index} className='flex items-center gap-3.5'>
                <Avatar.Root size='40'>
                  <Avatar.Image src={member.avatar} />
                  <Avatar.Indicator>
                    <Avatar.Status status={member.status} />
                  </Avatar.Indicator>
                </Avatar.Root>

                <div className='grow space-y-1'>
                  <div className='text-label-sm'>{member.name} {member.emoji}</div>
                  <div className='text-paragraph-xs text-text-sub-600'>{member.activity}</div>
                </div>

                <Badge.Root color='orange' variant='lighter' size='medium'>
                  <Badge.Icon as={RiIndeterminateCircleFill} />
                  {member.duration}
                </Badge.Root>
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetStatusTrackerEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Care Team Status
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyStatusTracker className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No care team status updates yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
