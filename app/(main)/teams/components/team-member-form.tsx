'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Radio from '@/components/ui/radio';
import * as Divider from '@/components/ui/divider';

import { CareResponsibilitiesSelector } from './care-responsibilities-selector';
import type { TeamMemberFormData } from './unified-team-form';

// Step definitions - matching Create Request pattern
const steps = [
  {
    id: 'mode',
    title: 'Add Team Member',
    description: 'Choose how to add this team member'
  },
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Contact and profile details'
  },
  {
    id: 'care',
    title: 'Care Role & Schedule',
    description: 'Define responsibilities and availability'
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm team member details'
  }
];

// Day options - matching Create Request wizard
const dayOptions = [
  { label: 'S', value: 0, name: 'Sun' },
  { label: 'M', value: 1, name: 'Mon' },
  { label: 'T', value: 2, name: 'Tue' },
  { label: 'W', value: 3, name: 'Wed' },
  { label: 'T', value: 4, name: 'Thu' },
  { label: 'F', value: 5, name: 'Fri' },
  { label: 'S', value: 6, name: 'Sat' }
];

// Helper: Format time from 24h to 12h
const formatTime = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}${minutes > 0 ? ':' + minutes.toString().padStart(2, '0') : ''}${period}`;
};

// Helper: Format days array to readable string
const formatDays = (days: number[]): string => {
  if (days.length === 0) return '';
  if (days.length === 7) return 'Every day';
  if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Mon-Fri';
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekends';
  
  const sortedDays = [...days].sort();
  const dayNames = sortedDays.map(d => dayOptions[d].name);
  
  // Check for consecutive days
  const isConsecutive = sortedDays.every((day, i) => i === 0 || day === sortedDays[i - 1] + 1);
  if (isConsecutive && sortedDays.length > 1) {
    return `${dayNames[0]}-${dayNames[dayNames.length - 1]}`;
  }
  
  return dayNames.join(', ');
};

// Helper: Detect availability type from shift times
const detectAvailabilityType = (startTime: string, endTime: string, days: number[]): string => {
  const start = parseInt(startTime.split(':')[0]);
  const end = parseInt(endTime.split(':')[0]);
  
  // Overnight shift (crosses midnight)
  if (start >= 20 || (start > end)) return 'Overnight';
  
  // Weekend only
  if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Weekend';
  
  // Regular business hours
  if (start >= 8 && start <= 10 && end >= 16 && end <= 18) return 'Regular';
  
  return 'Flexible';
};

// Helper: Generate schedule preview string
const generateSchedulePreview = (isOnCall: boolean, days: number[], startTime: string, endTime: string): string => {
  if (isOnCall) return 'On-call';
  if (days.length === 0) return 'No schedule set';
  
  const daysStr = formatDays(days);
  const startStr = formatTime(startTime);
  const endStr = formatTime(endTime);
  const typeStr = detectAvailabilityType(startTime, endTime, days);
  
  return `${daysStr} ${startStr}-${endStr} (${typeStr})`;
};

export interface TeamMemberFormProps {
  mode: 'invite' | 'manual';
  formData: TeamMemberFormData;
  onFormDataChange: (field: keyof TeamMemberFormData, value: any) => void;
  errors: Partial<Record<keyof TeamMemberFormData, string>>;
  onErrorsChange: (errors: Partial<Record<keyof TeamMemberFormData, string>>) => void;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel: () => void;
  onStepChange?: (stepIndex: number) => void;
  onModeChange?: (mode: 'invite' | 'manual') => void;
  isEditMode?: boolean;
}

export function TeamMemberForm({
  mode,
  formData,
  onFormDataChange,
  errors,
  onErrorsChange,
  isSaving = false,
  onSave,
  onCancel,
  onStepChange,
  onModeChange,
  isEditMode = false
}: TeamMemberFormProps) {
  const [currentStep, setCurrentStep] = React.useState(steps[0].id);
  const [inviteSent, setInviteSent] = React.useState(false);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Notify parent of step changes
  React.useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

  // Handle day toggle - matching Create Request pattern
  const handleDayToggle = (dayValue: number) => {
    const currentDays = formData.shiftDays || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue];
    
    onFormDataChange('shiftDays', newDays);
  };

  const validateStep = (stepId: string): boolean => {
    const newErrors: Partial<Record<keyof TeamMemberFormData, string>> = {};

    switch (stepId) {
      case 'basic':
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
        if (!formData.teamMemberCategory) newErrors.teamMemberCategory = 'Category is required';
        if (!formData.role) newErrors.role = 'Role is required';
        break;
      
      case 'care':
        if (!formData.careRole?.trim()) newErrors.careRole = 'Care role is required';
        // Validate schedule only if not on-call
        if (!formData.isOnCall) {
          if (!formData.shiftStartDate?.trim()) newErrors.shiftStartDate = 'Start date is required';
          // End date is optional - allows for ongoing schedules
          if (formData.isRecurring && formData.recurrenceFrequency === 'weekly' && (!formData.shiftDays || formData.shiftDays.length === 0)) {
            newErrors.shiftDays = 'Please select at least one day for weekly recurring schedule';
          }
        }
        break;
      
      case 'review':
        // Validate blocked dates if either is provided
        if (formData.blockStartDate && !formData.blockEndDate) {
          newErrors.blockEndDate = 'End date is required when start date is set';
        }
        if (formData.blockEndDate && !formData.blockStartDate) {
          newErrors.blockStartDate = 'Start date is required when end date is set';
        }
        break;
    }

    // Update errors in parent component
    onErrorsChange(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSave = () => {
    if (!validateStep(currentStep)) return;
    if (onSave) {
      onSave();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'mode':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Radio.Group
                value={mode}
                onValueChange={(value: string) => {
                  onModeChange?.(value as 'invite' | 'manual');
                }}
                className="space-y-3"
              >
                <div 
                  className="flex items-center space-x-3 p-4 border border-stroke-soft-200 rounded-lg hover:bg-bg-soft-50 cursor-pointer bg-bg-soft-50"
                  onClick={() => onModeChange?.('invite')}
                >
                  <Radio.Item value="invite" id="invite-mode" />
                  <div className="flex-1">
                    <Label.Root htmlFor="invite-mode" className="font-medium cursor-pointer">
                      Invite by email
                    </Label.Root>
                    <p className="text-sm text-text-sub-600">
                      Send an invitation email to add them to the team
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center space-x-3 p-4 border border-stroke-soft-200 rounded-lg hover:bg-bg-soft-50 cursor-pointer bg-bg-soft-50"
                  onClick={() => onModeChange?.('manual')}
                >
                  <Radio.Item value="manual" id="manual-mode" />
                  <div className="flex-1">
                    <Label.Root htmlFor="manual-mode" className="font-medium cursor-pointer">
                      Add manually
                    </Label.Root>
                    <p className="text-sm text-text-sub-600">
                      Add their information directly without sending an invitation
                    </p>
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="team-name">
                Full Name <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="team-name"
                    value={formData.name || ''}
                    onChange={(event) => onFormDataChange('name', event.target.value)}
                    placeholder="e.g., Marta Snow (Sister), Sarah Johnson (PCA)"
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.name && <p className="text-xs text-error-base">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="team-email">
                  Email Address <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="team-email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(event) => onFormDataChange('email', event.target.value)}
                      placeholder="marta@example.com"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.email && <p className="text-xs text-error-base">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="team-phone">
                  Phone Number <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="team-phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(event) => onFormDataChange('phone', event.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.phone && <p className="text-xs text-error-base">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="team-category">
                  Team Member Category <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.teamMemberCategory || ''}
                  onValueChange={(value) => onFormDataChange('teamMemberCategory', value)}
                >
                  <Select.Trigger id="team-category">
                    <Select.Value placeholder="Select category" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="family">Family Member</Select.Item>
                    <Select.Item value="professional">Professional Caregiver</Select.Item>
                    <Select.Item value="volunteer">Volunteer</Select.Item>
                    <Select.Item value="organization">Organization</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.teamMemberCategory && (
                  <p className="text-xs text-error-base">{errors.teamMemberCategory}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="team-role">
                  Role & Permissions <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.role || ''}
                  onValueChange={(value) => onFormDataChange('role', value)}
                >
                  <Select.Trigger id="team-role">
                    <Select.Value placeholder="Choose the level of access" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="member">Member — basic access</Select.Item>
                    <Select.Item value="admin">Admin — manage team</Select.Item>
                    <Select.Item value="viewer">Viewer — read only</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.role && <p className="text-xs text-error-base">{errors.role}</p>}
              </div>
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="team-care-role">
                Care Role <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="team-care-role"
                    value={formData.careRole || ''}
                    onChange={(event) => onFormDataChange('careRole', event.target.value)}
                    placeholder="e.g., Primary PCA, Family Coordinator"
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.careRole && <p className="text-xs text-error-base">{errors.careRole}</p>}
            </div>

            <Divider.Root />

            {/* Schedule Section - Matching Create Request Pattern */}
            <div className="space-y-4">
              <div className="text-label-sm">Regular Shift Schedule</div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isOnCall"
                  checked={formData.isOnCall || false}
                  onChange={(e) => onFormDataChange('isOnCall', e.target.checked)}
                  className="rounded border-stroke-soft-200"
                />
                <Label.Root htmlFor="isOnCall">
                  On-call / Flexible schedule (no regular shifts)
                </Label.Root>
              </div>

              {!formData.isOnCall && (
                <div className="space-y-4 p-4 bg-bg-soft-50 rounded-lg border border-stroke-soft-200">
                  {/* Date Selection - Matching Create Request */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label.Root htmlFor="shift-start-date">Start Date <Label.Asterisk /></Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            id="shift-start-date"
                            type="date"
                            value={formData.shiftStartDate || ''}
                            onChange={(e) => onFormDataChange('shiftStartDate', e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                      {errors.shiftStartDate && <p className="text-xs text-error-base">{errors.shiftStartDate}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label.Root htmlFor="shift-end-date">End Date (optional)</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            id="shift-end-date"
                            type="date"
                            value={formData.shiftEndDate || ''}
                            onChange={(e) => onFormDataChange('shiftEndDate', e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                      {errors.shiftEndDate && <p className="text-xs text-error-base">{errors.shiftEndDate}</p>}
                    </div>
                  </div>

                  {/* Time Selection - Matching Create Request */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label.Root htmlFor="shift-start-time">Start Time</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            id="shift-start-time"
                            type="time"
                            value={formData.shiftStartTime || '09:00'}
                            onChange={(e) => onFormDataChange('shiftStartTime', e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>

                    <div className="space-y-2">
                      <Label.Root htmlFor="shift-end-time">End Time</Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            id="shift-end-time"
                            type="time"
                            value={formData.shiftEndTime || '17:00'}
                            onChange={(e) => onFormDataChange('shiftEndTime', e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  </div>

                  {/* Recurring Pattern - Matching Create Request */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring || false}
                        onChange={(e) => onFormDataChange('isRecurring', e.target.checked)}
                        className="rounded border-stroke-soft-200"
                      />
                      <Label.Root htmlFor="isRecurring">
                        Set up recurring pattern
                      </Label.Root>
                    </div>

                    {formData.isRecurring && (
                      <div className="space-y-4 p-4 bg-bg-soft-50 rounded-lg border border-stroke-soft-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label.Root>Frequency</Label.Root>
                            <Select.Root
                              value={formData.recurrenceFrequency || 'weekly'}
                              onValueChange={(value) => onFormDataChange('recurrenceFrequency', value)}
                            >
                              <Select.Trigger>
                                <Select.Value />
                              </Select.Trigger>
                              <Select.Content>
                                <Select.Item value="daily">Daily</Select.Item>
                                <Select.Item value="weekly">Weekly</Select.Item>
                                <Select.Item value="monthly">Monthly</Select.Item>
                              </Select.Content>
                            </Select.Root>
                          </div>

                          <div>
                            <Label.Root>Every</Label.Root>
                            <Input.Root>
                              <Input.Wrapper>
                                <Input.Input
                                  type="number"
                                  min="1"
                                  value={formData.recurrenceInterval || 1}
                                  onChange={(e) => onFormDataChange('recurrenceInterval', parseInt(e.target.value) || 1)}
                                />
                              </Input.Wrapper>
                            </Input.Root>
                          </div>
                        </div>

                        {/* Days Selection - Show for weekly */}
                        {formData.recurrenceFrequency === 'weekly' && (
                          <div>
                            <Label.Root>Repeat on</Label.Root>
                            <div className="flex gap-1 mt-2">
                              {dayOptions.map(day => (
                                <button
                                  key={day.value}
                                  type="button"
                                  onClick={() => handleDayToggle(day.value)}
                                  className={cn(
                                    "w-10 h-10 text-sm font-medium border rounded-lg transition-colors",
                                    (formData.shiftDays || []).includes(day.value)
                                      ? 'bg-purple-500 border-purple-500 text-white'
                                      : 'border-stroke-soft-200 hover:border-stroke-soft-300 hover:bg-bg-soft-50 text-text-strong-950'
                                  )}
                                >
                                  {day.label}
                                </button>
                              ))}
                            </div>
                            {errors.shiftDays && <p className="text-xs text-error-base mt-1">{errors.shiftDays}</p>}
                          </div>
                        )}

                        {/* End Date for Recurring */}
                        <div>
                          <Label.Root htmlFor="recurrence-end-date">End Date (optional)</Label.Root>
                          <Input.Root>
                            <Input.Wrapper>
                              <Input.Input
                                id="recurrence-end-date"
                                type="date"
                                value={formData.recurrenceEndDate || ''}
                                onChange={(e) => onFormDataChange('recurrenceEndDate', e.target.value)}
                              />
                            </Input.Wrapper>
                          </Input.Root>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Preview - Matching Create Request */}
                  {(formData.shiftStartDate && formData.shiftEndDate) && (
                    <div className="p-3 bg-white rounded border border-stroke-soft-200">
                      <p className="text-sm text-text-sub-600">
                        <span className="font-medium">Schedule Preview: </span>
                        {generateSchedulePreview(
                          formData.isOnCall || false, 
                          formData.shiftDays || [], 
                          formData.shiftStartTime || '09:00', 
                          formData.shiftEndTime || '17:00'
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            {/* Time Off / Blocked Dates Section */}
            <div className="space-y-4">
              <div className="text-label-sm">Time Off & Blocked Dates (Optional)</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label.Root htmlFor="block-start-date">Start Date</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id="block-start-date"
                        type="date"
                        value={formData.blockStartDate || ''}
                        onChange={(e) => onFormDataChange('blockStartDate', e.target.value)}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {errors.blockStartDate && <p className="text-xs text-error-base">{errors.blockStartDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label.Root htmlFor="block-end-date">End Date</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id="block-end-date"
                        type="date"
                        value={formData.blockEndDate || ''}
                        onChange={(e) => onFormDataChange('blockEndDate', e.target.value)}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {errors.blockEndDate && <p className="text-xs text-error-base">{errors.blockEndDate}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="block-reason">Reason (optional)</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="block-reason"
                      value={formData.blockReason || ''}
                      onChange={(e) => onFormDataChange('blockReason', e.target.value)}
                      placeholder="e.g., Vacation, Medical leave, Personal time"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              {formData.blockStartDate && formData.blockEndDate && (
                <div className="bg-blue-50 text-blue-700 p-4 rounded-lg border border-blue-200">
                  <div className="text-label-sm font-medium mb-1">Time Off Preview:</div>
                  <div className="text-paragraph-sm">
                    {formData.name} will be marked as <strong>Unavailable</strong> from{' '}
                    {new Date(formData.blockStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to{' '}
                    {new Date(formData.blockEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {formData.blockReason && ` (${formData.blockReason})`}
                  </div>
                </div>
              )}
            </div>

            <Divider.Root variant='line-spacing' />

            {/* Review Summary */}
            <div className="rounded-lg border border-stroke-soft-200 bg-bg-soft-50 p-4">
              <h3 className="text-label-md font-medium text-text-strong-950 mb-3">
                {mode === 'invite'
                  ? 'Ready to send the invitation?'
                  : 'Ready to add this team member?'}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Name</dt>
                  <dd className="text-text-strong-950">{formData.name || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Email</dt>
                  <dd className="text-text-strong-950">{formData.email || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Phone</dt>
                  <dd className="text-text-strong-950">{formData.phone || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Category</dt>
                  <dd className="text-text-strong-950">{formData.teamMemberCategory || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Permission Role</dt>
                  <dd className="text-text-strong-950">{formData.role || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Care Role</dt>
                  <dd className="text-text-strong-950">{formData.careRole || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Schedule</dt>
                  <dd className="text-text-strong-950 font-medium">
                    {generateSchedulePreview(
                      formData.isOnCall || false, 
                      formData.shiftDays || [], 
                      formData.shiftStartTime || '09:00', 
                      formData.shiftEndTime || '17:00'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Header - Matching Create Request */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{steps[currentStepIndex].title}</h2>
        <p className="text-text-sub-600">{steps[currentStepIndex].description}</p>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation - Matching Create Request */}
      <div className="flex justify-between pt-6">
        <Button.Root
          variant="neutral"
          mode="stroke"
          onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
          disabled={isSaving}
        >
          {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
        </Button.Root>

        <div className="flex gap-2">
          {currentStepIndex === steps.length - 1 ? (
            <Button.Root
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? 'Saving...' : mode === 'invite' ? 'Send Invitation' : 'Add Team Member'}
            </Button.Root>
          ) : (
            <Button.Root
              onClick={handleNext}
              disabled={isSaving}
              className="min-w-[120px]"
            >
              Next
            </Button.Root>
          )}
        </div>
      </div>
    </div>
  );
}