'use client';

import { RiIndeterminateCircleFill, RiTeamLine } from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import IllustrationEmptyStatusTracker from '@/components/empty-state-illustrations/status-tracker';
import * as WidgetBox from '@/components/widget-box';

export default function WidgetStatusTracker({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root className="min-h-[380px]" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTeamLine} />
        Care Team Status
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          View Team
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='space-y-4 pb-1 pt-4'>
        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>Unavailable</p>
          <div className='flex items-center gap-3.5'>
            <Avatar.Root size='40'>
              <Avatar.Image src='/images/avatar/illustration/james.png' />
              <Avatar.Indicator>
                <Avatar.Status status='offline' />
              </Avatar.Indicator>
            </Avatar.Root>

            <div className='grow space-y-1'>
              <div className='text-label-sm'>Sarah Martinez 🏥</div>
              <div className='text-paragraph-xs text-text-sub-600'>
                Medical leave - Back Mar 20
              </div>
            </div>

            <Badge.Root color='red' variant='lighter' size='medium'>
              <Badge.Icon as={RiIndeterminateCircleFill} />
              Unavailable
            </Badge.Root>
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div className='space-y-2.5'>
          <p className='text-paragraph-xs text-text-sub-600'>On Break</p>
          <div className='space-y-4'>
            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/sophia.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Jim Nelson 👨‍⚕️</div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  Lunch break
                </div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                25m
              </Badge.Root>
            </div>

            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/arthur.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Jennifer Smith 👩‍⚕️</div>
                <div className='text-paragraph-xs text-text-sub-600'>Sleeping</div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                12m
              </Badge.Root>
            </div>

            <div className='flex items-center gap-3.5'>
              <Avatar.Root size='40'>
                <Avatar.Image src='/images/avatar/illustration/emma.png' />
                <Avatar.Indicator>
                  <Avatar.Status status='away' />
                </Avatar.Indicator>
              </Avatar.Root>

              <div className='grow space-y-1'>
                <div className='text-label-sm'>Elena Chen 👩‍👧</div>
                <div className='text-paragraph-xs text-text-sub-600'>Family time</div>
              </div>

              <Badge.Root color='orange' variant='lighter' size='medium'>
                <Badge.Icon as={RiIndeterminateCircleFill} />
                8m
              </Badge.Root>
            </div>
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
