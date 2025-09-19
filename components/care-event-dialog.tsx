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
}


export default function CareEventDialog({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onEventCreated,
}: CareEventDialogProps) {
  // Temporarily disable useCareEvents to test for infinite loops
  // const { createEvent } = useCareEvents();
  const createEvent = async (data: any) => {
    console.log('createEvent called with:', data);
    return { id: 'test-id', ...data };
  };
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof RequestFormData, string>>>({});
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const steps = [
    { title: 'Request Details' },
    { title: 'When & Where' },
    { title: 'Review' }
  ];
  
  const [formData, setFormData] = React.useState<RequestFormData>({
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
  });

  // Removed useEffect that was updating formData - initialization is handled in useState
  // This could cause unnecessary re-renders and potential infinite loops

  const handleFormDataChange = React.useCallback((field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Stabilize error and step change handlers for Radix children
  const handleErrorsChange = React.useCallback((nextErrors: Partial<Record<keyof RequestFormData, string>>) => {
    setErrors(nextErrors);
  }, []);

  const handleStepChange = React.useCallback((idx: number) => {
    setCurrentStepIndex(idx);
  }, []);

  const handleSave = React.useCallback(async () => {
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
  }, [createEvent, formData, onClose, onEventCreated]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-2xl shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-sub-600">
                Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-2 rounded hover:bg-bg-weak-50 flex items-center justify-center"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Unified Request Form - TEMPORARILY DISABLED TO ISOLATE INFINITE LOOP */}
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-4">Request Form Temporarily Disabled</h3>
            <p className="text-gray-600 mb-4">Debugging persistent infinite loop issue...</p>
            <div className="text-sm text-gray-500">
              <p>Form data state: {JSON.stringify(formData, null, 2)}</p>
            </div>
          </div>
          {/* 
          <UnifiedRequestForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            errors={errors}
            onErrorsChange={handleErrorsChange}
            isSaving={isLoading}
            onSave={handleSave}
            onCancel={onClose}
            onStepChange={handleStepChange}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
          */}
        </div>
      </div>
    </div>
  );
}
