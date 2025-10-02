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

export interface TeamMemberFormData {
  email: string;
  phone: string;
  name: string;
  teamMemberCategory: 'family' | 'professional' | 'volunteer' | 'organization';
  careRole: string;
  careResponsibilities: string; // Keep for compatibility but won't be used
  role: 'owner' | 'admin' | 'member' | 'viewer';
  customMessage: string;
  // Scheduling fields (matching Create Request pattern)
  isOnCall: boolean; // true = flexible/on-call, false = regular schedule
  shiftStartDate: string; // "2024-01-15" format
  shiftEndDate: string; // "2024-01-15" format
  shiftStartTime: string; // "20:00" format
  shiftEndTime: string; // "08:00" format
  isRecurring: boolean; // true = recurring pattern
  recurrenceFrequency: 'daily' | 'weekly' | 'monthly';
  recurrenceInterval: number; // every N days/weeks/months
  shiftDays: number[]; // [0,1,2,3,4,5,6] for days of week
  recurrenceEndDate: string; // "2024-12-31" format
  availabilityType: 'flexible' | 'fixed' | 'on-call';
  // Time off
  blockStartDate: string;
  blockEndDate: string;
  blockReason: string;
  // Legacy/additional
  careNotes: string;
  photo: string;
}

interface UnifiedTeamFormProps {
  formData: TeamMemberFormData;
  onFormDataChange: (field: keyof TeamMemberFormData, value: any) => void;
  errors: Partial<Record<keyof TeamMemberFormData, string>>;
  onErrorsChange: (errors: Partial<Record<keyof TeamMemberFormData, string>>) => void;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel: () => void;
  onStepChange?: (stepIndex: number) => void;
  currentProfile?: any;
}

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
    description: 'Define role and availability'
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

// All care role options combined
const careRoleOptions = [
  // Family roles
  { value: 'family-coordinator', label: 'Family Coordinator', description: 'Coordinates care and schedules', category: 'Family' },
  { value: 'primary-caregiver', label: 'Primary Caregiver', description: 'Main family caregiver', category: 'Family' },
  { value: 'backup-caregiver', label: 'Backup Caregiver', description: 'Provides backup care support', category: 'Family' },
  { value: 'family-member', label: 'Family Member', description: 'General family support', category: 'Family' },
  
  // Professional roles
  { value: 'registered-nurse', label: 'Registered Nurse (RN)', description: 'Licensed nursing care', category: 'Professional' },
  { value: 'licensed-practical-nurse', label: 'Licensed Practical Nurse (LPN)', description: 'Practical nursing care', category: 'Professional' },
  { value: 'certified-nursing-assistant', label: 'Certified Nursing Assistant (CNA)', description: 'Basic nursing assistance', category: 'Professional' },
  { value: 'personal-care-assistant', label: 'Personal Care Assistant (PCA)', description: 'Personal care and assistance', category: 'Professional' },
  { value: 'physical-therapist', label: 'Physical Therapist', description: 'Physical therapy and rehabilitation', category: 'Professional' },
  { value: 'occupational-therapist', label: 'Occupational Therapist', description: 'Occupational therapy support', category: 'Professional' },
  { value: 'home-health-aide', label: 'Home Health Aide', description: 'In-home health assistance', category: 'Professional' },
  
  // Volunteer roles
  { value: 'companion', label: 'Companion', description: 'Social companionship and support', category: 'Volunteer' },
  { value: 'transportation-helper', label: 'Transportation Helper', description: 'Assists with transportation needs', category: 'Volunteer' },
  { value: 'meal-helper', label: 'Meal Helper', description: 'Assists with meal preparation', category: 'Volunteer' },
  { value: 'errand-helper', label: 'Errand Helper', description: 'Runs errands and shopping', category: 'Volunteer' },
  { value: 'activity-helper', label: 'Activity Helper', description: 'Assists with activities and outings', category: 'Volunteer' },
  
  // Organization roles
  { value: 'case-manager', label: 'Case Manager', description: 'Manages care coordination', category: 'Organization' },
  { value: 'social-worker', label: 'Social Worker', description: 'Provides social services support', category: 'Organization' },
  { value: 'care-coordinator', label: 'Care Coordinator', description: 'Coordinates care services', category: 'Organization' },
  { value: 'service-provider', label: 'Service Provider', description: 'Provides specialized services', category: 'Organization' },
  
  // Custom option
  { value: 'other', label: 'Other', description: 'Custom role', category: 'Custom' }
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

// Helper: Generate schedule preview string
const generateSchedulePreview = (isOnCall: boolean, days: number[], startTime: string, endTime: string): string => {
  if (isOnCall) return 'On-call';
  if (days.length === 0) return 'No schedule set';
  
  const daysStr = formatDays(days);
  const startStr = formatTime(startTime);
  const endStr = formatTime(endTime);
  
  return `${daysStr} ${startStr}-${endStr}`;
};

export function UnifiedTeamForm({
  formData,
  onFormDataChange,
  errors,
  onErrorsChange,
  isSaving = false,
  onSave,
  onCancel,
  onStepChange,
  currentProfile
}: UnifiedTeamFormProps) {
  const [currentStep, setCurrentStep] = React.useState(steps[0].id);
  const [mode, setMode] = React.useState<'invite' | 'manual' | null>(null);
  const [customCareRole, setCustomCareRole] = React.useState('');

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  // Notify parent of step changes
  React.useEffect(() => {
    onStepChange?.(currentStepIndex);
  }, [currentStepIndex, onStepChange]);

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
      case 'mode':
        if (!mode) newErrors.name = 'Please select a method'; // Use name field for mode error
        break;
      
      case 'basic':
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim() && !formData.phone.trim()) {
          newErrors.email = 'Email or phone number is required';
        } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      
      case 'care':
        if (!formData.careRole.trim()) newErrors.careRole = 'Care role is required';
        if (formData.careRole === 'other' && !customCareRole.trim()) {
          newErrors.careRole = 'Custom care role is required';
        }
        // Validate schedule only if not on-call
        if (!formData.isOnCall && formData.shiftDays.length === 0) {
          newErrors.shiftDays = 'Please select at least one day for regular schedule';
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
                value={mode ?? undefined} 
                onValueChange={(value) => setMode(value as 'invite' | 'manual')}
                className="space-y-3"
              >
                <div 
                  className="flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-soft-50"
                  onClick={() => setMode('invite')}
                >
                  <Radio.Item value="invite" id="invite-mode" />
                  <div className="flex-1 space-y-1">
                    <Label.Root htmlFor="invite-mode" className="font-medium cursor-pointer">
                      Invite by email
                    </Label.Root>
                    <p className="text-sm text-text-sub-600">
                      Send an invitation email to add them to the team
                    </p>
          </div>
        </div>

                <div 
                  className="flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-soft-50"
                  onClick={() => setMode('manual')}
                >
                  <Radio.Item value="manual" id="manual-mode" />
                  <div className="flex-1 space-y-1">
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
                  Email Address
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
                  Phone Number
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

          </div>
        );

      case 'care':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="team-care-role">
                Care Role <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.careRole}
                onValueChange={(value) => {
                  onFormDataChange('careRole', value);
                  if (value !== 'other') {
                    setCustomCareRole('');
                  }
                }}
              >
                <Select.Trigger id="team-care-role" className="min-h-[3rem]">
                  <Select.Value placeholder="Select care role" />
                </Select.Trigger>
                <Select.Content>
                  {careRoleOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      <div className="py-2">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-text-sub-600 mt-1">{option.description}</div>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {errors.careRole && <p className="text-xs text-error-base">{errors.careRole}</p>}

              {formData.careRole === 'other' && (
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      placeholder="Enter custom care role"
                      value={customCareRole}
                      onChange={(e) => {
                        setCustomCareRole(e.target.value);
                        onFormDataChange('careRole', e.target.value);
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
              )}
        </div>

            <Divider.Root />

            {/* Schedule Section - Matching Create Request Pattern */}
            <div className="space-y-4">
              <div className="text-label-sm">Regular Shift Schedule</div>

      <div className="space-y-3">
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isRecurring"
                      checked={formData.isRecurring || false}
                      onChange={(e) => onFormDataChange('isRecurring', e.target.checked)}
                      className="rounded border-stroke-soft-200"
                    />
                    <Label.Root htmlFor="isRecurring">
                      Recurring schedule
                    </Label.Root>
                  </div>
                )}
              </div>

              {!formData.isOnCall && (
                <div className="space-y-4 p-4 bg-bg-soft-50 rounded-lg border border-stroke-soft-200">
                  {/* Day Selection - Matching Create Request */}
                  <div>
                    <Label.Root>Shift Days <Label.Asterisk /></Label.Root>
                    <div className="flex gap-1 mt-2">
                      {dayOptions.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
            className={cn(
                            "w-10 h-10 text-sm font-medium border rounded-lg transition-colors",
                            formData.shiftDays?.includes(day.value)
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

                  {/* Time Pickers - Matching Create Request */}
                  <div className="grid grid-cols-2 gap-4">
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

                  {/* Recurring Schedule Options */}
                  {formData.isRecurring && (
                    <div className="space-y-4 p-4 bg-bg-soft-50 rounded-lg border border-stroke-soft-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label.Root>Frequency</Label.Root>
                          <Select.Root
                            value={formData.recurrenceFrequency}
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
                                  formData.shiftDays?.includes(day.value)
                                    ? 'bg-purple-500 border-purple-500 text-white'
                                    : 'border-stroke-soft-200 hover:border-stroke-soft-300 hover:bg-bg-soft-50 text-text-strong-950'
                                )}
                              >
                                {day.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* End Date */}
                      <div>
                        <Label.Root>End Date (Optional)</Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Input
                              type="date"
                              value={formData.recurrenceEndDate || ''}
                              onChange={(e) => onFormDataChange('recurrenceEndDate', e.target.value)}
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </div>
                  )}

                  {/* Preview - Matching Create Request */}
                  {formData.shiftDays && formData.shiftDays.length > 0 && (
                    <div className="p-3 bg-bg-soft-50 rounded border border-stroke-soft-200">
                      <p className="text-sm text-text-sub-600">
                        <span className="font-medium">Schedule Preview: </span>
                        {generateSchedulePreview(formData.isOnCall, formData.shiftDays, formData.shiftStartTime, formData.shiftEndTime)}
                        {formData.isRecurring && (
                          <span className="ml-2 text-xs">
                            (Recurring {formData.recurrenceFrequency} every {formData.recurrenceInterval})
                          </span>
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
              <div className="text-label-sm">Do they have any upcoming time off or blocked dates?</div>

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
                  <dt className="text-text-sub-600">Care Role</dt>
                  <dd className="text-text-strong-950">
                    {formData.careRole === 'other' 
                      ? customCareRole 
                      : careRoleOptions.find(role => role.value === formData.careRole)?.label || formData.careRole || '—'
                    }
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Schedule</dt>
                  <dd className="text-text-strong-950 font-medium">
                    {generateSchedulePreview(formData.isOnCall, formData.shiftDays || [], formData.shiftStartTime, formData.shiftEndTime)}
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
    <div className="bg-bg-weak-50">
      {/* Wizard Content */}
      <div className="px-6 py-6">
        {renderStep()}
      </div>

      {/* Wizard Footer - Matching Create Request */}
      <div className="px-6 py-4 border-t border-stroke-soft-200 flex justify-between items-center">
        <Button.Root
          onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
          variant="neutral"
          mode="stroke"
          size="medium"
        >
          {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
        </Button.Root>
        
        <div className="flex gap-3">
          {currentStepIndex === steps.length - 1 ? (
            <Button.Root
              onClick={handleSave}
              variant="primary"
              mode="filled"
              size="medium"
              disabled={isSaving}
            >
              {isSaving ? 'Adding Team Member...' : mode === 'invite' ? 'Send Invitation' : 'Add Team Member'}
            </Button.Root>
          ) : (
            <Button.Root
              onClick={handleNext}
              variant="primary"
              mode="filled"
              size="medium"
            >
              Next
            </Button.Root>
          )}
        </div>
      </div>
    </div>
  );
}