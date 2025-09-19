'use client';

import * as React from 'react';
import { RiCalendarLine, RiTimeLine, RiCheckLine, RiUserLine } from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { format, addHours } from 'date-fns';

export interface RequestFormData {
  // Core Information - Same for all requests
  title: string;
  requestType: string; // New: categorized request type
  customRequestType: string; // New: custom request type when "Other" is selected
  description: string;
  
  // Who - Who needs help or who's providing it
  careRecipient: string;
  assignedPerson: string;
  customAssignedPerson: string; // New: custom person when "Other" is selected
  customPersonContact: string; // New: contact info for custom person
  customPersonContactType: 'phone' | 'email'; // New: type of contact info
  
  // When - Date and time
  startDate: Date;
  endDate: Date;
  
  // Recurring - Recurrence pattern
  isRecurring: boolean;
  recurrencePattern: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek: number[];
    endDate?: string;
  };
  
  // Where - Location (if relevant)
  location: string;
  customLocation: string; // New: custom location when "Other" is selected
  
  // Additional
  notes: string;
}

export interface UnifiedRequestFormProps {
  formData: RequestFormData;
  onFormDataChange: (field: keyof RequestFormData, value: any) => void;
  errors: Partial<Record<keyof RequestFormData, string>>;
  onErrorsChange: (errors: Partial<Record<keyof RequestFormData, string>>) => void;
  isSaving?: boolean;
  onSave?: () => void;
  onCancel: () => void;
  selectedDate: Date;
  selectedTime: Date;
}

const steps = [
  {
    id: 'details',
    title: 'Request Details',
    description: 'What help do you need?',
    icon: RiUserLine
  },
  {
    id: 'schedule',
    title: 'When & Where',
    description: 'When and where will this happen?',
    icon: RiCalendarLine
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm your request',
    icon: RiCheckLine
  }
];

// Rob's Real Family Care Data
const careRecipients = [
  { id: 'rob-wudlick', name: 'Rob Wudlick', needs: '24-hour care (quadriplegic)' },
  { id: 'luann-wudlick', name: 'Luann Wudlick (Mom)', needs: 'Dementia care' },
];

const teamMembers = [
  { id: 'open-to-anyone', name: 'Open to anyone', roles: ['Any available team member'], availability: 'Team members can claim this slot' },
  { id: 'marta-snow', name: 'Marta Snow (Sister)', roles: ['Family', 'Scheduler', 'General Administration', 'Backup PCA'], availability: 'On-call' },
  { id: 'luann-wudlick', name: 'Luann Wudlick (Mom)', roles: ['Family', 'Nurse', 'PCA'], availability: 'All empty time slots' },
  { id: 'jim-nelson', name: 'Jim Nelson', roles: ['Nurse'], availability: 'M-F 9am-5pm' },
  { id: 'jennifer', name: 'Jennifer', roles: ['Overnight PCA'], availability: 'M,T 8pm-8am' },
  { id: 'sarah', name: 'Sarah', roles: ['Overnight PCA'], availability: 'W, Th 8pm-8am' },
  { id: 'ella', name: 'Ella', roles: ['Overnight PCA'], availability: 'F, Sat, Sun 8pm-9am' },
  { id: 'alex', name: 'Alex', roles: ['PCA'], availability: 'Random' },
  { id: 'olena', name: 'Olena', roles: ['PCA'], availability: 'Sat, Sun 9am-1pm' },
  { id: 'isabela', name: 'Isabela', roles: ['Family', 'PCA'], availability: 'On-call' },
  { id: 'lucy', name: 'Lucy', roles: ['PCA', 'Family'], availability: 'On-call' },
  { id: 'grace', name: 'Grace', roles: ['Overnight PCA'], availability: 'On summer break' },
  { id: 'kathleen', name: 'Kathleen', roles: ['Backup PCA'], availability: 'Random on-call' },
  { id: 'annie', name: 'Annie', roles: ['Backup PCA'], availability: 'Random on-call' },
  { id: 'uncle-jim', name: 'Uncle Jim', roles: ['Family', 'Backup PCA'], availability: 'On-call' },
  { id: 'dan', name: 'Dan (Bro in-law)', roles: ['Family', 'Backup PCA'], availability: 'On-call' },
  { id: 'other', name: 'Other', roles: ['Outside care team'], availability: 'Custom person' },
];

const locations = [
  { id: 'rob-home', name: 'Rob\'s Home' },
  { id: 'luann-home', name: 'Luann\'s Home' },
  { id: 'medical-center', name: 'Medical Center' },
  { id: 'rehabilitation-center', name: 'Rehabilitation Center' },
  { id: 'other', name: 'Other' },
];

const dayOptions = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 }
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const requestTypeOptions = [
  { value: 'medication', label: 'Medication Reminder', description: 'Daily medication or treatment reminders' },
  { value: 'appointment', label: 'Medical Appointment', description: 'Doctor visits, therapy sessions, check-ups' },
  { value: 'care-shift', label: 'Care Shift', description: 'Personal care, assistance, supervision' },
  { value: 'transportation', label: 'Transportation', description: 'Rides to appointments, errands, outings' },
  { value: 'meal-prep', label: 'Meal Preparation', description: 'Cooking, meal planning, dietary needs' },
  { value: 'housekeeping', label: 'Housekeeping', description: 'Cleaning, laundry, home maintenance' },
  { value: 'companionship', label: 'Companionship', description: 'Social visits, activities, emotional support' },
  { value: 'emergency', label: 'Emergency Support', description: 'Urgent care needs, crisis situations' },
  { value: 'other', label: 'Other', description: 'Custom request type' }
];

export function UnifiedRequestForm({
  formData,
  onFormDataChange,
  errors,
  onErrorsChange,
  isSaving = false,
  onSave,
  onCancel,
  selectedDate,
  selectedTime
}: UnifiedRequestFormProps) {
  const [currentStep, setCurrentStep] = React.useState(steps[0].id);

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleRecurringChange = (field: keyof RequestFormData['recurrencePattern'], value: any) => {
    onFormDataChange('recurrencePattern', {
      ...formData.recurrencePattern,
      [field]: value
    });
  };

  const handleDayToggle = (dayValue: number) => {
    const currentDays = formData.recurrencePattern.daysOfWeek;
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue];
    
    onFormDataChange('recurrencePattern', {
      ...formData.recurrencePattern,
      daysOfWeek: newDays
    });
  };

  const getTitlePlaceholder = (requestType: string): string => {
    switch (requestType) {
      case 'medication':
        return 'e.g., Morning blood pressure medication, Evening pain relief';
      case 'appointment':
        return 'e.g., Physical therapy session, Doctor check-up, Lab work';
      case 'care-shift':
        return 'e.g., Evening personal care, Morning assistance, Overnight supervision';
      case 'transportation':
        return 'e.g., Ride to doctor appointment, Grocery shopping trip';
      case 'meal-prep':
        return 'e.g., Prepare dinner, Meal planning, Special diet cooking';
      case 'housekeeping':
        return 'e.g., Weekly cleaning, Laundry, Home maintenance';
      case 'companionship':
        return 'e.g., Social visit, Activity companion, Emotional support';
      case 'emergency':
        return 'e.g., Urgent care needed, Crisis support, Emergency assistance';
      case 'other':
        return 'e.g., Describe your specific request';
      default:
        return 'e.g., Describe your specific request';
    }
  };

  React.useEffect(() => {
    // Initialize form data with selected date/time
    if (!formData.startDate) {
      onFormDataChange('startDate', selectedTime);
    }
    if (!formData.endDate) {
      onFormDataChange('endDate', addHours(selectedTime, 1));
    }
  }, [selectedDate, selectedTime, formData.startDate, formData.endDate, onFormDataChange]);

  const validateStep = (stepId: string): boolean => {
    const newErrors: Partial<Record<keyof RequestFormData, string>> = {};

    switch (stepId) {
      case 'details':
        if (!formData.requestType) newErrors.requestType = 'Request type is required';
        if (formData.requestType === 'other' && !formData.customRequestType.trim()) {
          newErrors.customRequestType = 'Custom request type is required';
        }
        if (!formData.title.trim()) newErrors.title = 'Request details are required';
        // Description is now optional - removed validation
        if (!formData.careRecipient) newErrors.careRecipient = 'Care recipient is required';
        if (!formData.assignedPerson) newErrors.assignedPerson = 'Assigned person is required';
        if (formData.assignedPerson === 'other' && !formData.customAssignedPerson.trim()) {
          newErrors.customAssignedPerson = 'Custom person is required';
        }
        break;
      
      case 'schedule':
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
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
      case 'details':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="requestType">
                What kind of help do you need? <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.requestType}
                onValueChange={(value) => {
                  onFormDataChange('requestType', value);
                  if (value !== 'other') {
                    onFormDataChange('customRequestType', '');
                  }
                }}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select request type" />
                </Select.Trigger>
                <Select.Content>
                  {requestTypeOptions.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-text-sub-600">{option.description}</div>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              {errors.requestType && (
                <div className="text-xs text-red-600">{errors.requestType}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="title">
                {formData.requestType === 'other' ? 'Custom Request Type' : 'Request Details'} <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="title"
                    value={formData.requestType === 'other' ? formData.customRequestType : formData.title}
                    onChange={(e) => {
                      if (formData.requestType === 'other') {
                        onFormDataChange('customRequestType', e.target.value);
                      } else {
                        onFormDataChange('title', e.target.value);
                      }
                    }}
                    placeholder={getTitlePlaceholder(formData.requestType)}
                    className={errors.title || errors.customRequestType ? 'border-red-500' : ''}
                  />
                </Input.Wrapper>
              </Input.Root>
              {(errors.title || errors.customRequestType) && (
                <div className="text-xs text-red-600">{errors.title || errors.customRequestType}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="description">
                More details (Optional)
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => onFormDataChange('description', e.target.value)}
                    placeholder="Any additional context or special instructions..."
                    className={errors.description ? 'border-red-500' : ''}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.description && (
                <div className="text-xs text-red-600">{errors.description}</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="care-recipient">
                  Who needs care? <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.careRecipient}
                  onValueChange={(value) => onFormDataChange('careRecipient', value)}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select care recipient" />
                  </Select.Trigger>
                  <Select.Content>
                    {careRecipients.map((recipient) => (
                      <Select.Item key={recipient.id} value={recipient.id}>
                        {recipient.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.careRecipient && (
                  <div className="text-xs text-red-600">{errors.careRecipient}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="assigned-person">
                  Who can help? <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.assignedPerson}
                  onValueChange={(value) => {
                    onFormDataChange('assignedPerson', value);
                    if (value !== 'other') {
                      onFormDataChange('customAssignedPerson', '');
                    }
                  }}
                >
                  <Select.Trigger>
                    <Select.Value placeholder="Select team member" />
                  </Select.Trigger>
                  <Select.Content>
                    {teamMembers.map((member) => (
                      <Select.Item key={member.id} value={member.id}>
                        {member.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {errors.assignedPerson && (
                  <div className="text-xs text-red-600">{errors.assignedPerson}</div>
                )}
              </div>
            </div>

            {formData.assignedPerson === 'other' && (
              <div className="space-y-3 p-3 bg-bg-soft-50 rounded-lg border border-stroke-soft-200">
                <div className="space-y-2">
                  <Label.Root htmlFor="customAssignedPerson">
                    Person's Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id="customAssignedPerson"
                        placeholder="Enter name of person outside care team"
                        value={formData.customAssignedPerson}
                        onChange={(e) => onFormDataChange('customAssignedPerson', e.target.value)}
                        className={errors.customAssignedPerson ? 'border-red-500' : ''}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {errors.customAssignedPerson && (
                    <div className="text-xs text-red-600">{errors.customAssignedPerson}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label.Root>Contact Information (Optional)</Label.Root>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label.Root htmlFor="customPersonContactType">Contact Type</Label.Root>
                      <Select.Root
                        value={formData.customPersonContactType}
                        onValueChange={(value: 'phone' | 'email') => onFormDataChange('customPersonContactType', value)}
                      >
                        <Select.Trigger>
                          <Select.Value placeholder="Select type" />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value="phone">Phone</Select.Item>
                          <Select.Item value="email">Email</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>
                    <div>
                      <Label.Root htmlFor="customPersonContact">
                        {formData.customPersonContactType === 'phone' ? 'Phone Number' : 'Email Address'}
                      </Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Input
                            id="customPersonContact"
                            type={formData.customPersonContactType === 'phone' ? 'tel' : 'email'}
                            placeholder={formData.customPersonContactType === 'phone' ? '(555) 123-4567' : 'person@example.com'}
                            value={formData.customPersonContact}
                            onChange={(e) => onFormDataChange('customPersonContact', e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-stroke-soft-200">
                  <p className="text-xs text-text-sub-600">
                    💡 <strong>Tip:</strong> Adding contact information allows you to invite this person to join your care team in the future.
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="start-date">Start Date <Label.Asterisk /></Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="start-date"
                      type="date"
                      value={format(formData.startDate || selectedDate, 'yyyy-MM-dd')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const newStartDateTime = new Date(
                          newDate.getFullYear(), 
                          newDate.getMonth(), 
                          newDate.getDate(), 
                          formData.startDate?.getHours() || selectedTime.getHours(), 
                          formData.startDate?.getMinutes() || selectedTime.getMinutes()
                        );
                        onFormDataChange('startDate', newStartDateTime);
                        
                        // Maintain duration
                        const currentDuration = formData.endDate ? 
                          (formData.endDate.getTime() - formData.startDate!.getTime()) : 
                          60 * 60 * 1000; // 1 hour default
                        onFormDataChange('endDate', new Date(newStartDateTime.getTime() + currentDuration));
                      }}
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.startDate && (
                  <div className="text-xs text-red-600">{errors.startDate}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="end-date">End Date <Label.Asterisk /></Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="end-date"
                      type="date"
                      value={format(formData.endDate || addHours(selectedTime, 1), 'yyyy-MM-dd')}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        const newEndDateTime = new Date(
                          newDate.getFullYear(), 
                          newDate.getMonth(), 
                          newDate.getDate(), 
                          formData.endDate?.getHours() || addHours(selectedTime, 1).getHours(), 
                          formData.endDate?.getMinutes() || addHours(selectedTime, 1).getMinutes()
                        );
                        onFormDataChange('endDate', newEndDateTime);
                      }}
                      className={errors.endDate ? 'border-red-500' : ''}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.endDate && (
                  <div className="text-xs text-red-600">{errors.endDate}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="start-time">Start Time</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="start-time"
                      type="time"
                      value={format(formData.startDate || selectedTime, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newStartDateTime = new Date(formData.startDate || selectedTime);
                        newStartDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        onFormDataChange('startDate', newStartDateTime);
                        
                        // Maintain duration
                        const currentDuration = formData.endDate ? 
                          (formData.endDate.getTime() - formData.startDate!.getTime()) : 
                          60 * 60 * 1000; // 1 hour default
                        onFormDataChange('endDate', new Date(newStartDateTime.getTime() + currentDuration));
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="end-time">End Time</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="end-time"
                      type="time"
                      value={format(formData.endDate || addHours(selectedTime, 1), 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newEndDateTime = new Date(formData.startDate || selectedTime);
                        newEndDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                        onFormDataChange('endDate', newEndDateTime);
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            {/* Recurring Pattern */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
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
                        value={formData.recurrencePattern.frequency}
                        onValueChange={(value) => handleRecurringChange('frequency', value)}
                      >
                        <Select.Trigger>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          {frequencyOptions.map(option => (
                            <Select.Item key={option.value} value={option.value}>
                              {option.label}
                            </Select.Item>
                          ))}
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
                            value={formData.recurrencePattern.interval}
                            onChange={(e) => handleRecurringChange('interval', parseInt(e.target.value) || 1)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                    </div>
                  </div>

                  {/* Days Selection - Show for weekly */}
                  {formData.recurrencePattern.frequency === 'weekly' && (
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
                              formData.recurrencePattern.daysOfWeek.includes(day.value)
                                ? 'bg-primary-600 border-primary-600 text-white'
                                : 'border-stroke-soft-200 hover:border-stroke-soft-300 hover:bg-bg-soft-50'
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
                          value={formData.recurrencePattern.endDate || ''}
                          onChange={(e) => handleRecurringChange('endDate', e.target.value)}
                          min={format(selectedDate, 'yyyy-MM-dd')}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  {/* Summary */}
                  <div className="p-3 bg-white rounded border border-stroke-soft-200">
                    <p className="text-sm text-text-sub-600">
                      {`Repeat ${formData.recurrencePattern.frequency} every ${formData.recurrencePattern.interval} ${
                        formData.recurrencePattern.frequency === 'daily' ? 'day(s)' :
                        formData.recurrencePattern.frequency === 'weekly' ? 'week(s)' :
                        'month(s)'
                      }`}
                      {formData.recurrencePattern.frequency === 'weekly' && formData.recurrencePattern.daysOfWeek.length > 0 && (
                        <span> on {formData.recurrencePattern.daysOfWeek.map(d => dayOptions[d].label).join(', ')}</span>
                      )}
                      {formData.recurrencePattern.endDate && (
                        <span> until {format(new Date(formData.recurrencePattern.endDate), 'MMM dd, yyyy')}</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="location">Where will this happen?</Label.Root>
              <Select.Root
                value={formData.location}
                onValueChange={(value) => {
                  onFormDataChange('location', value);
                  if (value !== 'other') {
                    onFormDataChange('customLocation', '');
                  }
                }}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Select location" />
                </Select.Trigger>
                <Select.Content>
                  {locations.map((location) => (
                    <Select.Item key={location.id} value={location.id}>
                      {location.name}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              
              {formData.location === 'other' && (
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      placeholder="Enter custom location"
                      value={formData.customLocation}
                      onChange={(e) => onFormDataChange('customLocation', e.target.value)}
                    />
                  </Input.Wrapper>
                </Input.Root>
              )}
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="notes">Additional Notes (Optional)</Label.Root>
              <Textarea.Root simple>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => onFormDataChange('notes', e.target.value)}
                  placeholder="Any additional information, special requirements, or notes..."
                  rows={2}
                />
              </Textarea.Root>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-bg-soft-50 p-4 rounded-lg border border-stroke-soft-200">
              <h3 className="font-medium text-text-strong-950 mb-3">Ready to create this request?</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Request:</span> {formData.title}
                </div>
                <div>
                  <span className="font-medium">Type:</span> {
                    formData.requestType === 'other' 
                      ? formData.customRequestType 
                      : requestTypeOptions.find(t => t.value === formData.requestType)?.label
                  }
                </div>
                {formData.description && (
                  <div>
                    <span className="font-medium">Description:</span> {formData.description}
                  </div>
                )}
                <div>
                  <span className="font-medium">Care Recipient:</span> {careRecipients.find(r => r.id === formData.careRecipient)?.name}
                </div>
                <div>
                  <span className="font-medium">Assigned to:</span> {
                    formData.assignedPerson === 'other' 
                      ? formData.customAssignedPerson 
                      : teamMembers.find(m => m.id === formData.assignedPerson)?.name
                  }
                  {formData.assignedPerson === 'other' && formData.customPersonContact && (
                    <span className="text-text-sub-600 ml-2">
                      ({formData.customPersonContactType === 'phone' ? 'Phone' : 'Email'}: {formData.customPersonContact})
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-medium">When:</span> {format(formData.startDate || selectedTime, 'MMM dd, yyyy')} at {format(formData.startDate || selectedTime, 'h:mm a')} - {format(formData.endDate || addHours(selectedTime, 1), 'h:mm a')}
                </div>
                {formData.isRecurring && (
                  <div>
                    <span className="font-medium">Recurring:</span> {formData.recurrencePattern.frequency} every {formData.recurrencePattern.interval} {
                      formData.recurrencePattern.frequency === 'daily' ? 'day(s)' :
                      formData.recurrencePattern.frequency === 'weekly' ? 'week(s)' :
                      'month(s)'
                    }
                    {formData.recurrencePattern.frequency === 'weekly' && formData.recurrencePattern.daysOfWeek.length > 0 && (
                      <span> on {formData.recurrencePattern.daysOfWeek.map(d => dayOptions[d].label).join(', ')}</span>
                    )}
                    {formData.recurrencePattern.endDate && (
                      <span> until {format(new Date(formData.recurrencePattern.endDate), 'MMM dd, yyyy')}</span>
                    )}
                  </div>
                )}
                {formData.location && (
                  <div>
                    <span className="font-medium">Where:</span> {formData.location === 'other' ? formData.customLocation : locations.find(l => l.id === formData.location)?.name}
                  </div>
                )}
                {formData.notes && (
                  <div>
                    <span className="font-medium">Notes:</span> {formData.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-t border-stroke-soft-200">
      {/* Wizard Header */}
      <div className="px-6 py-4 border-b border-stroke-soft-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-sub-600">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-text-sub-600 hover:text-text-strong-950"
          >
            ×
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center mt-4 space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors",
                      isCompleted
                        ? "bg-primary-600 text-white"
                        : isCurrent
                        ? "bg-primary-100 text-primary-600"
                        : "bg-bg-soft-100 text-text-sub-600"
                    )}
                  >
                    {isCompleted ? (
                      <RiCheckLine className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 transition-colors",
                      index < currentStepIndex
                        ? "bg-primary-600"
                        : "bg-bg-soft-200"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="px-6 py-6">
        {renderStep()}
      </div>

      {/* Wizard Footer */}
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
              {isSaving ? 'Creating Request...' : 'Create Request'}
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
