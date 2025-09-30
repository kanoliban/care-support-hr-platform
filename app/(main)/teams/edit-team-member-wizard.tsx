'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Divider from '@/components/ui/divider';

export interface TeamMemberEditData {
  // Step 1: Basic Information
  name: string;
  email: string;
  phone: string;
  
  // Step 2: Role & Schedule
  careRole: string;
  careAssignment: string;
  assignmentDescription: string;
  schedule: string;
  availabilityType: string;
  
  // Step 3: Time Off & Blocked Dates
  blockStartDate: string;
  blockEndDate: string;
  blockReason: string;
}

export interface EditTeamMemberWizardProps {
  formData: TeamMemberEditData;
  onFormDataChange: (field: keyof TeamMemberEditData, value: any) => void;
  errors: Partial<Record<keyof TeamMemberEditData, string>>;
  onErrorsChange: (errors: Partial<Record<keyof TeamMemberEditData, string>>) => void;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel: () => void;
  memberName?: string;
}

const steps = [
  {
    id: 'basic-info',
    title: 'Basic Information',
    description: 'Update contact details'
  },
  {
    id: 'role-schedule',
    title: 'Role & Schedule',
    description: 'Update care responsibilities and schedule'
  },
  {
    id: 'time-off',
    title: 'Time Off',
    description: 'Manage blocked dates and availability'
  }
];

const scheduleOptions = [
  { value: 'On-call', label: 'On-call' },
  { value: 'Mon-Fri 9am-5pm', label: 'Mon-Fri 9am-5pm' },
  { value: 'Mon-Tue 8pm-8am', label: 'Mon-Tue 8pm-8am' },
  { value: 'Wed-Thu 8pm-8am', label: 'Wed-Thu 8pm-8am' },
  { value: 'Fri-Sun 8pm-9am', label: 'Fri-Sun 8pm-9am' },
  { value: 'Sat-Sun 9am-1pm', label: 'Sat-Sun 9am-1pm' },
  { value: 'Custom', label: 'Custom Schedule' },
];

const availabilityTypeOptions = [
  { value: 'Flexible', label: 'Flexible' },
  { value: 'Fixed', label: 'Fixed' },
  { value: 'Regular', label: 'Regular' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Overnight', label: 'Overnight' },
  { value: 'Weekend', label: 'Weekend' },
  { value: 'On-call', label: 'On-call' },
];

export function EditTeamMemberWizard({
  formData,
  onFormDataChange,
  errors,
  onErrorsChange,
  isSaving = false,
  onSave,
  onCancel,
  memberName
}: EditTeamMemberWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(steps[0].id);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const validateStep = (stepId: string): boolean => {
    const newErrors: Partial<Record<keyof TeamMemberEditData, string>> = {};

    switch (stepId) {
      case 'basic-info':
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'Phone number is required';
        }
        break;
      
      case 'role-schedule':
        if (!formData.careRole.trim()) newErrors.careRole = 'Care role is required';
        if (!formData.schedule.trim()) newErrors.schedule = 'Schedule is required';
        break;
      
      case 'time-off':
        // Time off is optional, but if one field is filled, both must be
        if (formData.blockStartDate && !formData.blockEndDate) {
          newErrors.blockEndDate = 'End date is required';
        }
        if (formData.blockEndDate && !formData.blockStartDate) {
          newErrors.blockStartDate = 'Start date is required';
        }
        break;
    }

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
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div className='space-y-2'>
              <Label.Root htmlFor='edit-name'>Full Name <Label.Asterisk /></Label.Root>
              <Input.Root className={errors.name ? 'border-red-500' : ''}>
                <Input.Input
                  id='edit-name'
                  value={formData.name}
                  onChange={(e) => onFormDataChange('name', e.target.value)}
                  placeholder="e.g., Marta Snow (Sister), Sarah Johnson (PCA)"
                />
              </Input.Root>
              {errors.name && (
                <div className='text-xs text-red-600'>{errors.name}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-email'>Email Address <Label.Asterisk /></Label.Root>
              <Input.Root className={errors.email ? 'border-red-500' : ''}>
                <Input.Input
                  id='edit-email'
                  type='email'
                  value={formData.email}
                  onChange={(e) => onFormDataChange('email', e.target.value)}
                  placeholder="caregiver@example.com"
                />
              </Input.Root>
              {errors.email && (
                <div className='text-xs text-red-600'>{errors.email}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-phone'>Phone Number <Label.Asterisk /></Label.Root>
              <Input.Root className={errors.phone ? 'border-red-500' : ''}>
                <Input.Input
                  id='edit-phone'
                  type='tel'
                  value={formData.phone}
                  onChange={(e) => onFormDataChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </Input.Root>
              {errors.phone && (
                <div className='text-xs text-red-600'>{errors.phone}</div>
              )}
            </div>
          </div>
        );

      case 'role-schedule':
        return (
          <div className="space-y-6">
            <div className='space-y-2'>
              <Label.Root htmlFor='edit-care-role'>Role / What They Help With <Label.Asterisk /></Label.Root>
              <Input.Root className={errors.careRole ? 'border-red-500' : ''}>
                <Input.Input
                  id='edit-care-role'
                  value={formData.careRole}
                  onChange={(e) => onFormDataChange('careRole', e.target.value)}
                  placeholder="e.g., Family Coordinator, Primary PCA, Nurse"
                />
              </Input.Root>
              {errors.careRole && (
                <div className='text-xs text-red-600'>{errors.careRole}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-care-assignment'>Care Focus</Label.Root>
              <Input.Root>
                <Input.Input
                  id='edit-care-assignment'
                  value={formData.careAssignment}
                  onChange={(e) => onFormDataChange('careAssignment', e.target.value)}
                  placeholder="e.g., Rob's Care, Physical Therapy"
                />
              </Input.Root>
            </div>

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-assignment-description'>Assignment Description</Label.Root>
              <Input.Root>
                <Input.Input
                  id='edit-assignment-description'
                  value={formData.assignmentDescription}
                  onChange={(e) => onFormDataChange('assignmentDescription', e.target.value)}
                  placeholder="e.g., Family Administration & General Care"
                />
              </Input.Root>
            </div>

            <Divider.Root variant='line-spacing' />

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-schedule'>Schedule <Label.Asterisk /></Label.Root>
              <Select.Root value={formData.schedule} onValueChange={(value) => onFormDataChange('schedule', value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Select schedule" />
                </Select.Trigger>
                <Select.Content>
                  {scheduleOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {errors.schedule && (
                <div className='text-xs text-red-600'>{errors.schedule}</div>
              )}
            </div>

            <div className='space-y-2'>
              <Label.Root htmlFor='edit-availability-type'>Availability Type</Label.Root>
              <Select.Root value={formData.availabilityType} onValueChange={(value) => onFormDataChange('availabilityType', value)}>
                <Select.Trigger>
                  <Select.Value placeholder="Select availability type" />
                </Select.Trigger>
                <Select.Content>
                  {availabilityTypeOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        );

      case 'time-off':
        return (
          <div className="space-y-6">
            <div className="text-paragraph-sm text-text-sub-600 bg-bg-weak-50 p-4 rounded-lg">
              Set blocked dates when this team member is unavailable. This will prevent them from being scheduled during these periods.
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label.Root htmlFor='edit-block-start'>Start Date</Label.Root>
                <Input.Root className={errors.blockStartDate ? 'border-red-500' : ''}>
                  <Input.Input
                    id='edit-block-start'
                    type='date'
                    value={formData.blockStartDate || ''}
                    onChange={(e) => onFormDataChange('blockStartDate', e.target.value)}
                  />
                </Input.Root>
                {errors.blockStartDate && (
                  <div className='text-xs text-red-600'>{errors.blockStartDate}</div>
                )}
              </div>
              
              <div className='space-y-2'>
                <Label.Root htmlFor='edit-block-end'>End Date</Label.Root>
                <Input.Root className={errors.blockEndDate ? 'border-red-500' : ''}>
                  <Input.Input
                    id='edit-block-end'
                    type='date'
                    value={formData.blockEndDate || ''}
                    onChange={(e) => onFormDataChange('blockEndDate', e.target.value)}
                  />
                </Input.Root>
                {errors.blockEndDate && (
                  <div className='text-xs text-red-600'>{errors.blockEndDate}</div>
                )}
              </div>
            </div>
            
            <div className='space-y-2'>
              <Label.Root htmlFor='edit-block-reason'>Reason (Optional)</Label.Root>
              <Input.Root>
                <Input.Input
                  id='edit-block-reason'
                  value={formData.blockReason || ''}
                  onChange={(e) => onFormDataChange('blockReason', e.target.value)}
                  placeholder="e.g., Summer Break, Vacation, Medical Leave"
                />
              </Input.Root>
              <div className='text-xs text-text-sub-600'>
                This will be displayed in the schedule and will automatically set their availability to "Unavailable"
              </div>
            </div>

            {formData.blockStartDate && formData.blockEndDate && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg border border-blue-200">
                <div className="text-label-sm font-medium mb-1">Preview:</div>
                <div className="text-paragraph-sm">
                  {formData.name} will be marked as <strong>Unavailable</strong> from{' '}
                  {new Date(formData.blockStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to{' '}
                  {new Date(formData.blockEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {formData.blockReason && ` (${formData.blockReason})`}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-label-sm font-medium transition-colors',
                  currentStepIndex >= index
                    ? 'bg-purple-600 text-white'
                    : 'bg-bg-weak-50 text-text-sub-600'
                )}
              >
                {index + 1}
              </div>
              <div className="hidden sm:block">
                <div className={cn(
                  'text-label-sm font-medium',
                  currentStepIndex >= index ? 'text-text-strong-950' : 'text-text-sub-600'
                )}>
                  {step.title}
                </div>
                <div className="text-paragraph-xs text-text-sub-600">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-[2px] flex-1 mx-4 transition-colors',
                  currentStepIndex > index ? 'bg-purple-600' : 'bg-bg-weak-50'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <Divider.Root variant='line-spacing' />

      {/* Step Content */}
      <div className="min-h-[300px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
          disabled={isSaving}
        >
          {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
        </Button.Root>

        {currentStepIndex < steps.length - 1 ? (
          <Button.Root onClick={handleNext}>
            Next Step
          </Button.Root>
        ) : (
          <Button.Root onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button.Root>
        )}
      </div>
    </div>
  );
}
