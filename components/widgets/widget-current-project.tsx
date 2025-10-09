'use client';

import React, { useState } from 'react';
import {
  RiCalendarLine,
  RiFlashlightLine,
  RiPencilLine,
  RiTimeFill,
  RiCheckLine,
  RiCloseLine,
  RiEditLine,
  RiUserLine,
  RiTeamLine,
} from '@remixicon/react';

import { cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as AvatarGroup from '@/components/ui/avatar-group';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import IllustrationEmptyCurrentProject from '@/components/empty-state-illustrations/current-project';
import * as WidgetBox from '@/components/widget-box';
import { useCurrentProject, useInteractiveActions, useTeamMembers } from '@/lib/careContext';
import { useSimplePermissions } from '@/lib/simple-permission-context';

export default function WidgetCurrentProject({
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentProfile } = useSimplePermissions();
  
  // Get interactive data and actions with error handling
  let currentProject: any = null;
  let updateProject: any;

  // Dynamic care team data based on current profile
  const getTeamMembers = () => {
    if (currentProfile?.id === 'luanns-care-team') {
      return [
        {
          id: 'marta-snow-luann',
          name: 'Marta Snow',
          role: 'Primary Care Coordinator',
          avatar: '/images/avatar/illustration/james.png'
        },
        {
          id: 'rob-wudlick-luann',
          name: 'Rob Wudlick',
          role: 'Care Coordinator',
          avatar: '/images/avatar/illustration/arthur.png'
        },
        {
          id: 'jim-nelson-luann',
          name: 'Jim Nelson',
          role: 'Dementia Specialist',
          avatar: '/images/avatar/illustration/james.png'
        },
        {
          id: 'jennifer-luann',
          name: 'Jennifer',
          role: 'Dementia PCA - Overnight',
          avatar: '/images/avatar/illustration/emma.png'
        },
        {
          id: 'sarah-luann',
          name: 'Sarah',
          role: 'Dementia PCA - Overnight',
          avatar: '/images/avatar/illustration/matthew.png'
        },
        {
          id: 'ella-luann',
          name: 'Ella',
          role: 'Dementia PCA - Weekend',
          avatar: '/images/avatar/illustration/laura.png'
        },
        {
          id: 'olena-luann',
          name: 'Olena',
          role: 'Weekend PCA',
          avatar: '/images/avatar/illustration/natalia.png'
        }
      ];
    } else {
      // Rob's care team
      return [
        {
          id: 'jim-nelson',
          name: 'Jim Nelson',
          role: 'Primary Caregiver',
          avatar: '/images/avatar/illustration/james.png'
        },
        {
          id: 'jennifer-smith',
          name: 'Jennifer Smith',
          role: 'PCA - Overnight Care',
          avatar: '/images/avatar/illustration/sophia.png'
        },
        {
          id: 'alaina-shen',
          name: 'Alaina Shen',
          role: 'Family Backup',
          avatar: '/images/avatar/illustration/arthur.png'
        },
        {
          id: 'sarah-martinez',
          name: 'Sarah Martinez',
          role: 'Medical Assistant',
          avatar: '/images/avatar/illustration/sophia.png'
        },
        {
          id: 'grace-thompson',
          name: 'Grace Thompson',
          role: 'Physical Therapist',
          avatar: '/images/avatar/illustration/arthur.png'
        },
        {
          id: 'alex-rodriguez',
          name: 'Alex Rodriguez',
          role: 'Transportation Specialist',
          avatar: '/images/avatar/illustration/james.png'
        },
        {
          id: 'maria-santos',
          name: 'Maria Santos',
          role: 'Household Support',
          avatar: '/images/avatar/illustration/sophia.png'
        }
      ];
    }
  };

  const teamMembers = getTeamMembers();

  try {
    currentProject = useCurrentProject();
    const actions = useInteractiveActions();
    updateProject = actions.updateProject;
  } catch (error) {
    console.warn('WidgetCurrentProject: Context not available, using fallback data');
    // Fallback to static data if context is not available
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState<'planning' | 'in_progress' | 'completed' | 'on_hold'>('in_progress');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    caregiver: currentProject?.team?.[0] || '',
    startTime: '09:00',
    endTime: '17:00',
    date: currentProject?.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : '',
    team: currentProject?.team || [],
    description: currentProject?.description || ''
  });

  // Handle status updates
  const handleStatusUpdate = (newStatus: 'planning' | 'in_progress' | 'completed' | 'on_hold') => {
    if (currentProject) {
      updateProject(currentProject.id, { status: newStatus });
      setEditStatus(newStatus);
    }
  };

  // Handle edit form changes
  const handleEditFormChange = (field: string, value: any) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle team member selection
  const handleTeamToggle = (memberId: string) => {
    setEditForm(prev => ({
      ...prev,
      team: prev.team.includes(memberId) 
        ? prev.team.filter((id: string) => id !== memberId)
        : [...prev.team, memberId]
    }));
  };

  // Handle save changes
  const handleSaveChanges = () => {
    if (currentProject && updateProject) {
      // Create new deadline by combining date and start time
      const newDeadline = new Date(`${editForm.date}T${editForm.startTime}:00`).toISOString();
      
      updateProject(currentProject.id, {
        team: editForm.team,
        deadline: newDeadline,
        description: editForm.description,
        startTime: editForm.startTime,
        endTime: editForm.endTime
      });
      
      setIsEditing(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original values
    setEditForm({
      caregiver: currentProject?.team?.[0] || '',
      startTime: '09:00',
      endTime: '17:00',
      date: currentProject?.deadline ? new Date(currentProject.deadline).toISOString().split('T')[0] : '',
      team: currentProject?.team || [],
      description: currentProject?.description || 'Good morning! Starting my shift with Rob at 9 AM. He\'s had his morning medication and seems to be in good spirits today. Planning to help with light breakfast and then assist with his daily exercises. His daughter mentioned he had some trouble sleeping last night, so I\'ll keep an eye on his energy levels. Will coordinate with the physical therapist who\'s scheduled for 2 PM and update the family on his progress. Weather is nice today, so hoping to get some fresh air in the afternoon if he\'s feeling up to it.'
    });
  };

  const handleViewSchedule = () => {
    console.log('View Schedule clicked - navigating to schedule...');
  };

  if (!currentProject) {
    return <WidgetCurrentProjectEmpty {...rest} />;
  }

  const statusConfig = {
    planning: { color: 'yellow', text: 'Planning', icon: RiFlashlightLine },
    in_progress: { color: 'blue', text: 'In Progress', icon: RiTimeFill },
    completed: { color: 'green', text: 'Completed', icon: RiCheckLine },
    on_hold: { color: 'orange', text: 'On Hold', icon: RiCloseLine }
  };

  const currentStatus = statusConfig[currentProject.status as keyof typeof statusConfig] || statusConfig.in_progress;

  return (
    <WidgetBox.Root className="min-h-[380px]" {...rest}>
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Current Shift
        <Button.Root 
          variant='neutral' 
          mode='stroke' 
          size='xsmall'
          onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
        >
          <Button.Icon as={isEditing ? RiCloseLine : RiEditLine} />
          {isEditing ? 'Cancel' : 'Manage Shift'}
        </Button.Root>
      </WidgetBox.Header>

      <Divider.Root />

      <div className='h-[calc(100%-120px)] overflow-y-auto' style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f3f4f6'
      }}>
        <div className='space-y-3.5 pb-1.5 pt-4'>
          {isEditing ? (
          /* Edit Mode */
          <>
            {/* Caregiver Edit */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Primary Caregiver
              </div>
              <div className='flex items-center gap-2'>
                <RiUserLine className='size-4 text-text-sub-600' />
                <Select.Root value={editForm.caregiver} onValueChange={(value) => handleEditFormChange('caregiver', value)}>
                  <Select.Trigger className="w-full">
                    <Select.Value placeholder="Select primary caregiver" />
                  </Select.Trigger>
                  <Select.Content>
                    {teamMembers.map((member) => (
                      <Select.Item key={member.id} value={member.id}>
                        {member.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>

            {/* Shift Times Edit */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Shift Times
              </div>
              <div className='flex items-center gap-2'>
                <RiTimeFill className='size-4 text-text-sub-600' />
                <div className='flex gap-2 flex-1'>
                  <Input.Root className='flex-1'>
                    <Input.Input
                      type="time"
                      value={editForm.startTime}
                      onChange={(e) => handleEditFormChange('startTime', e.target.value)}
                      placeholder="Start"
                    />
                  </Input.Root>
                  <span className='text-text-sub-600 px-2 flex items-center'>to</span>
                  <Input.Root className='flex-1'>
                    <Input.Input
                      type="time"
                      value={editForm.endTime}
                      onChange={(e) => handleEditFormChange('endTime', e.target.value)}
                      placeholder="End"
                    />
                  </Input.Root>
                </div>
              </div>
            </div>

            {/* Date Edit */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>Date</div>
              <div className='flex items-center gap-2'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                <Input.Root>
                  <Input.Input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => handleEditFormChange('date', e.target.value)}
                  />
                </Input.Root>
              </div>
            </div>

            {/* Team Selection */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Team Members ({editForm.team.length} selected)
                {editForm.team.length > 1 && <span className='ml-1'>👥</span>}
              </div>
              <div className='flex items-start gap-2'>
                <RiTeamLine className='size-4 text-text-sub-600 mt-1' />
                <div className='flex flex-wrap gap-2 flex-1'>
                  {teamMembers.map((member) => {
                    const isSelected = editForm.team.includes(member.id);
                    const hasSelection = editForm.team.length > 0;
                    
                    return (
                      <Button.Root
                        key={member.id}
                        size='xsmall'
                        variant='neutral'
                        mode={isSelected ? 'filled' : 'stroke'}
                        onClick={() => handleTeamToggle(member.id)}
                        className={isSelected && hasSelection ? 'bg-green-100 text-green-700 border-green-300' : ''}
                      >
                        {member.name}
                      </Button.Root>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Description Edit */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>Description</div>
              <div className='flex items-start gap-2'>
                <RiPencilLine className='size-4 text-text-sub-600 mt-1' />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => handleEditFormChange('description', e.target.value)}
                    placeholder="Enter shift description"
                    rows={6}
                    className="flex-1 p-3 border border-bg-soft-200 rounded-lg bg-bg-soft-50 text-paragraph-sm placeholder:text-text-sub-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none min-h-[140px]"
                  />
              </div>
            </div>

            {/* Status Update Options */}
            <div className='space-y-1.5 pt-2 border-t border-bg-soft-200'>
              <div className='text-paragraph-xs text-text-sub-600'>Update Status</div>
              <div className='flex gap-2 flex-wrap'>
                {Object.entries(statusConfig).map(([status, config]) => {
                  const isSelected = editStatus === status;
                  const colorClasses = {
                    yellow: isSelected ? 'bg-yellow-500 text-white border-yellow-500' : 'border-yellow-500 text-yellow-600 hover:bg-yellow-50',
                    blue: isSelected ? 'bg-blue-500 text-white border-blue-500' : 'border-blue-500 text-blue-600 hover:bg-blue-50',
                    green: isSelected ? 'bg-green-500 text-white border-green-500' : 'border-green-500 text-green-600 hover:bg-green-50',
                    orange: isSelected ? 'bg-orange-500 text-white border-orange-500' : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                  };
                  
                  return (
                    <Button.Root 
                      key={status}
                      size='xsmall' 
                      variant='neutral' 
                      mode={isSelected ? 'filled' : 'stroke'}
                      onClick={() => setEditStatus(status as any)}
                      className={colorClasses[config.color as keyof typeof colorClasses]}
                    >
                      <Button.Icon as={config.icon} />
                      {config.text}
                    </Button.Root>
                  );
                })}
              </div>
            </div>

            {/* Save/Cancel Buttons */}
            <div className='flex gap-2 pt-2 border-t border-bg-soft-200'>
              <Button.Root 
                size='small' 
                variant='neutral' 
                mode='stroke'
                onClick={handleSaveChanges}
              >
                <Button.Icon as={RiCheckLine} />
                Save Changes
              </Button.Root>
              <Button.Root 
                size='small' 
                variant='neutral' 
                mode='stroke'
                onClick={handleCancelEdit}
              >
                <Button.Icon as={RiCloseLine} />
                Cancel
              </Button.Root>
            </div>
          </>
        ) : (
          /* View Mode */
          <>
            {/* Caregiver */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Caregiver
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-paragraph-sm'>
                  <Avatar.Root size='24' color='purple'>
                    <Avatar.Image src='/images/avatar/illustration/james.png' alt='Jim Nelson' />
                  </Avatar.Root>
                  {teamMembers.find(m => m.id === currentProject.team[0])?.name || 'Jim Nelson'}
                </div>
                <Badge.Root size='medium' color={currentStatus.color as any} variant='lighter'>
                  <Badge.Icon as={currentStatus.icon} />
                  {currentStatus.text}
                </Badge.Root>
              </div>
            </div>

            {/* Shift Time */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>
                Shift Time
              </div>
              <div className='flex items-center gap-2 text-paragraph-sm'>
                <RiTimeFill className='size-4 text-text-sub-600' />
                {currentProject.startTime && currentProject.endTime 
                  ? `${currentProject.startTime} - ${currentProject.endTime}`
                  : '9:00 AM - 5:00 PM'}
              </div>
            </div>

            {/* Date */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>Date</div>
              <div className='flex items-center gap-2 text-paragraph-sm'>
                <RiCalendarLine className='size-4 text-text-sub-600' />
                {currentProject.deadline ? new Date(currentProject.deadline).toLocaleDateString('en-US', {
                  month: 'numeric',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'TBD'}
              </div>
            </div>

            {/* Team */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>Team</div>
              <div className='flex items-center gap-2'>
                <AvatarGroup.Root size='24'>
                  {currentProject.team.slice(0, 4).map((member: string, index: number) => (
                    <Avatar.Root key={index} color={['purple', 'yellow', 'blue', 'sky'][index] as any}>
                      <Avatar.Image
                        src='/images/avatar/illustration/james.png'
                        alt={member}
                      />
                    </Avatar.Root>
                  ))}
                </AvatarGroup.Root>
                <span className='text-paragraph-xs text-text-sub-600'>
                  +{Math.max(0, currentProject.team.length - 4)} people
                </span>
              </div>
            </div>

            {/* Description */}
            <div className='space-y-1.5'>
              <div className='text-paragraph-xs text-text-sub-600'>Description</div>
              <div className='flex items-start gap-2 text-paragraph-sm'>
                <RiPencilLine className='size-4 text-text-sub-600 mt-1' />
                <div className='flex-1 relative'>
                  <div className='max-h-[100px] overflow-y-auto ring-1 ring-inset ring-stroke-soft-200 rounded-2xl p-2' style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db #f3f4f6'
                  }}>
                    <div className='leading-relaxed pr-1'>
                        {currentProject?.description || 'No shift description available.'}
                    </div>
                  </div>
                  {/* Fade gradient overlay to indicate more content */}
                  <div className='absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-2xl'></div>
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </WidgetBox.Root>
  );
}

export function WidgetCurrentProjectEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <WidgetBox.Root
      className={cnExt('flex h-[380px] flex-col', className)}
      {...rest}
    >
      <WidgetBox.Header>
        <WidgetBox.HeaderIcon as={RiFlashlightLine} />
        Current Project
      </WidgetBox.Header>

      <Divider.Root />

      <div className='flex flex-1 flex-col justify-center pt-4'>
        <div className='flex flex-col items-center gap-5 p-5'>
          <IllustrationEmptyCurrentProject className='size-[108px]' />
          <div className='text-center text-paragraph-sm text-text-soft-400'>
            No records of projects yet.
            <br /> Please check back later.
          </div>
        </div>
      </div>
    </WidgetBox.Root>
  );
}
