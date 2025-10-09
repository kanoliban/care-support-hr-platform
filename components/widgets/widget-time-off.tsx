'use client';

import React from 'react';
import {
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiTimeFill,
  RiTimeLine,
  RiArrowRightLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { GaugeChart } from '@/components/chart-gauge';
import IllustrationEmptyTimeOff from '@/components/empty-state-illustrations/time-off';
import * as WidgetBox from '@/components/widget-box';
import { useTimeOffRequests, useInteractiveActions, useSelectedItems } from '@/lib/careContext';
import { useSimplePermissions } from '@/lib/simple-permission-context';

export default function WidgetTimeOff({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentProfile } = useSimplePermissions();
  
  // Get interactive data and actions with error handling
  let timeOffRequests: any[] = [];
  let selectItem: any, deselectItem: any, updateCoverageGap: any;
  let selectedItems: any = { coverageGaps: [] };

  try {
    timeOffRequests = useTimeOffRequests(); // These are coverage gaps in CareSupport context
    const actions = useInteractiveActions();
    selectItem = actions.selectItem;
    deselectItem = actions.deselectItem;
    updateCoverageGap = actions.updateCoverageGap;
    selectedItems = useSelectedItems();
  } catch (error) {
    console.warn('WidgetTimeOff: Context not available, using fallback data');
    // Fallback to static data if context is not available
  }
  
  // Calculate metrics
  const VALUE = timeOffRequests.length;
  const MAX = 7; // Days in week
  const selectedGaps = selectedItems.coverageGaps;

  // Handle gap selection and resolution
  const handleGapClick = (gapId: string, isSelected: boolean) => {
    if (isSelected) {
      deselectItem('coverageGaps', gapId);
    } else {
      selectItem('coverageGaps', gapId);
    }
  };

  const handleResolveGap = (gapId: string, newStatus: 'approved' | 'rejected') => {
    updateCoverageGap(gapId, { 
      status: newStatus === 'approved' ? 'resolved' : 'unresolved'
    });
    deselectItem('coverageGaps', gapId);
  };

  return (
    <WidgetBox.Root className="min-h-[380px]" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimeLine} />
        Coverage Gaps
        <Button.Root 
          variant='neutral' 
          mode='stroke' 
          size='xsmall'
          onClick={() => {
            // Find coverage action - could open a modal or navigate
            console.log('Find Coverage clicked - opening coverage finder...');
          }}
        >
          Find Coverage
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='py-7'>
        <div className='mx-auto grid w-[208px]'>
          <GaugeChart
            data={{ name: 'time-off', value: VALUE }}
            max={MAX}
            className='[grid-area:1/1]'
          />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h4 text-text-strong-950'>
              {VALUE}
            </span>
            <span className='pointer-events-auto text-subheading-xs text-text-sub-600'>
              GAPS THIS WEEK
            </span>
          </div>
        </div>
      </div>

      <div className='h-[calc(100%-120px)] overflow-y-auto' style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f3f4f6'
      }}>
        <div className='space-y-4'>
          {/* Always show 3 slots to maintain consistent card height */}
          {Array.from({ length: 3 }, (_, index) => {
          const gap = timeOffRequests[index];
          
          if (!gap) {
            // Empty slot - show placeholder to maintain height
            return (
              <React.Fragment key={`empty-${index}`}>
                {index > 0 && <Divider.Root />}
                <div className='flex items-center gap-1 p-2 rounded-lg opacity-30'>
                  <div className='size-5 shrink-0 bg-bg-soft-200 rounded-full' />
                  <div className='flex flex-1 items-center gap-0.5 text-paragraph-sm text-text-disabled-300'>
                    No coverage gap
                    <span className='text-paragraph-xs text-text-disabled-200'>
                      (slot {index + 1} of 3)
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge.Root size='medium' variant='lighter' color='gray'>
                      Empty
                    </Badge.Root>
                  </div>
                </div>
              </React.Fragment>
            );
          }
          
          // Real gap data
          const isSelected = selectedGaps.includes(gap.id);
          const StatusIcon = gap.status === 'approved' ? RiCheckboxCircleFill : 
                            gap.status === 'rejected' ? RiCloseCircleFill : RiTimeFill;
          const statusColor = gap.status === 'approved' ? 'text-success-base' : 
                             gap.status === 'rejected' ? 'text-error-base' : 'text-warning-base';
          const badgeColor = gap.status === 'approved' ? 'green' : 
                            gap.status === 'rejected' ? 'red' : 'orange';
          const badgeText = gap.status === 'approved' ? 'Confirmed' : 
                           gap.status === 'rejected' ? 'No Coverage' : 'Finding Coverage';
          
          return (
            <React.Fragment key={gap.id}>
              {index > 0 && <Divider.Root />}
              <div 
                className={cnExt(
                  'flex items-center gap-1 p-2 rounded-lg cursor-pointer transition-all duration-200',
                  'hover:bg-bg-soft-50 active:bg-bg-soft-100',
                  isSelected && 'bg-primary-50 border border-primary-200'
                )}
                onClick={() => handleGapClick(gap.id, isSelected)}
              >
                <StatusIcon className={cnExt('size-5 shrink-0', statusColor)} />
                <div className='flex flex-1 items-center gap-0.5 text-paragraph-sm'>
                  {new Date(gap.startDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })} - {new Date(gap.endDate).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    hour: 'numeric', 
                    minute: '2-digit' 
                  })}
                  <span className='text-paragraph-xs text-text-soft-400'>
                    ({gap.reason?.replace('_', ' ') || 'Coverage needed'})
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge.Root size='medium' variant='lighter' color={badgeColor}>
                    {badgeText}
                  </Badge.Root>
                  <RiArrowRightLine className={cnExt(
                    'size-4 text-text-soft-400 transition-transform duration-200',
                    isSelected && 'text-primary-base rotate-90'
                  )} />
                </div>
              </div>
              
              {/* Action buttons for selected gaps */}
              {isSelected && gap.status === 'pending' && (
                <div className='flex gap-2 px-2 pb-2'>
                  <Button.Root 
                    size='xsmall' 
                    variant='neutral' 
                    mode='stroke'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveGap(gap.id, 'approved');
                    }}
                  >
                    Approve
                  </Button.Root>
                  <Button.Root 
                    size='xsmall' 
                    variant='neutral' 
                    mode='stroke'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveGap(gap.id, 'rejected');
                    }}
                  >
                    Reject
                  </Button.Root>
                </div>
              )}
            </React.Fragment>
          );
        })}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetTimeOffEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiTimeLine} />
        Coverage Gaps
      </WidgetBox.Header>

      <Divider.Root />

      <div className='py-7'>
        <div className='mx-auto grid w-[208px]'>
          <GaugeChart className='[grid-area:1/1]' />
          <div className='pointer-events-none relative z-10 flex flex-col items-center justify-end gap-1 text-center [grid-area:1/1]'>
            <span className='pointer-events-auto text-title-h4 text-text-soft-400'>
              0
            </span>
            <span className='pointer-events-auto text-subheading-xs text-text-disabled-300'>
              GAPS THIS WEEK
            </span>
          </div>
        </div>
      </div>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-3 p-2.5'>
          <IllustrationEmptyTimeOff className='size-[72px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            All coverage gaps resolved! Care team is coordinated.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
