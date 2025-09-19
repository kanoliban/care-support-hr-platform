'use client';

import React from 'react';
import { format, addHours } from 'date-fns';
import * as Button from '@/components/ui/button';
import { RiCloseLine } from '@remixicon/react';
import { useCareEvents } from '@/hooks/useCareEvents';
import { UnifiedRequestForm, RequestFormData } from '@/components/unified-request-form';
import {
  CareEventCreateData,
  CareEventStatus,
  CareEventVisibility
} from '@/types/care-events';

interface CareEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime: Date;
  onEventCreated?: (eventId: string) => void;
  initialFormData?: RequestFormData;
  isEditMode?: boolean;
}


export default function CareEventDialog({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onEventCreated,
  initialFormData,
  isEditMode = false,
}: CareEventDialogProps) {
  const { createEvent } = useCareEvents();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof RequestFormData, string>>>({});
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const steps = [
    { title: 'Request Details' },
    { title: 'When & Where' },
    { title: 'Review' }
  ];
  
  const [formData, setFormData] = React.useState<RequestFormData>(() => {
    if (initialFormData) {
      return initialFormData;
    }
    return {
    title: '',
      requestType: '',
      customRequestType: '',
      description: '',
      careRecipient: '',
      assignedPerson: '',
      customAssignedPerson: '',
      customPersonContact: '',
      customPersonContactType: 'phone',
    startDate: selectedTime,
    endDate: addHours(selectedTime, 1),
      isRecurring: false,
      recurrencePattern: {
        frequency: 'weekly',
        interval: 1,
        daysOfWeek: [],
        endDate: ''
      },
    location: '',
      customLocation: '',
      notes: '',
    };
  });

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      startDate: selectedTime,
      endDate: addHours(selectedTime, 1),
    }));
  }, [selectedDate, selectedTime]);

  const handleFormDataChange = (field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
      // Validate required fields
      const newErrors: Partial<Record<keyof RequestFormData, string>> = {};
      
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
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.endDate) newErrors.endDate = 'End date is required';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Build recurrence pattern string
      let recurrencePatternStr = '';
      if (formData.isRecurring) {
        const daysStr = formData.recurrencePattern.daysOfWeek.length > 0 
          ? ` on ${formData.recurrencePattern.daysOfWeek.map(d => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d]).join(',')}` 
          : '';
        const endDateStr = formData.recurrencePattern.endDate ? ` until ${formData.recurrencePattern.endDate}` : '';
        recurrencePatternStr = `${formData.recurrencePattern.frequency} every ${formData.recurrencePattern.interval}${daysStr}${endDateStr}`;
      }

      // Convert to CareEventCreateData format
      const eventData: CareEventCreateData = {
        title: formData.title,
        type: 'care-shift', // Simplified - all requests are care-shifts
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location === 'other' ? formData.customLocation : formData.location,
        description: formData.description,
        assignedCaregiver: formData.assignedPerson === 'open-to-anyone' 
          ? 'Open to anyone' 
          : formData.assignedPerson === 'other' 
            ? formData.customAssignedPerson 
            : formData.assignedPerson,
        client: formData.careRecipient,
        isRecurring: formData.isRecurring,
        recurrencePattern: recurrencePatternStr,
        notifications: ['30-min-before'],
        status: 'scheduled' as CareEventStatus,
        visibility: 'care-team-only' as CareEventVisibility,
        metadata: {
          notes: formData.notes,
          isOpenToAnyone: formData.assignedPerson === 'open-to-anyone',
          requestType: formData.requestType === 'other' ? formData.customRequestType : formData.requestType,
          customPersonContact: formData.assignedPerson === 'other' ? formData.customPersonContact : undefined,
          customPersonContactType: formData.assignedPerson === 'other' ? formData.customPersonContactType : undefined,
        },
      };

      const newEvent = await createEvent(eventData);
      onEventCreated?.(newEvent.id);
      onClose();
    } catch (error) {
      console.error('Error creating care event:', error);
      alert('Failed to create request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-2xl shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-sub-600">
                {isEditMode ? 'Edit Request' : 'Create Request'} • Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-2 rounded hover:bg-bg-weak-50 flex items-center justify-center"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Unified Request Form */}
          <UnifiedRequestForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            errors={errors}
            onErrorsChange={setErrors}
            isSaving={isLoading}
            onSave={handleSave}
            onCancel={onClose}
            onStepChange={setCurrentStepIndex}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  );
}