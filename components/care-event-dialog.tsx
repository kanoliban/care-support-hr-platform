'use client';

import React from 'react';
import { format, addHours } from 'date-fns';
import * as Button from '@/components/ui/button';
import { RiCloseLine, RiAddLine, RiCheckLine } from '@remixicon/react';
import { useCareEvents } from '@/hooks/useCareEvents';
import {
  CareEventCreateData,
  CareEventType,
  getEventTypeFieldConfig,
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

// Rob's Real Family Care Data
const careRecipients = [
  { id: 'rob-wudlick', name: 'Rob Wudlick', needs: '24-hour care (quadriplegic)' },
  { id: 'luann-wudlick', name: 'Luann Wudlick (Mom)', needs: 'Dementia care' },
];

const caregivers = [
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
];

const locations = [
  { id: 'loc-1', name: 'Rob\'s Home' },
  { id: 'loc-2', name: 'Luann\'s Home' },
  { id: 'loc-3', name: 'Medical Center' },
  { id: 'loc-4', name: 'Rehabilitation Center' },
  { id: 'loc-5', name: 'Other' },
];

export default function CareEventDialog({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onEventCreated,
}: CareEventDialogProps) {
  const { createEvent } = useCareEvents();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedCaregivers, setSelectedCaregivers] = React.useState<string[]>([]);
  const [customLocation, setCustomLocation] = React.useState('');
  const [selectedEventType, setSelectedEventType] = React.useState<CareEventType>('care-shift');
  const [showRecurrenceOptions, setShowRecurrenceOptions] = React.useState(false);
  const [recurrencePattern, setRecurrencePattern] = React.useState<string>('weekly');
  const [recurrenceEndDate, setRecurrenceEndDate] = React.useState<string>('');
  const [recurrenceInterval, setRecurrenceInterval] = React.useState<number>(1);
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [wizardStep, setWizardStep] = React.useState<1 | 2>(1);
  const [formData, setFormData] = React.useState<Partial<CareEventCreateData>>({
    title: '',
    type: 'care-shift',
    startDate: selectedTime,
    endDate: addHours(selectedTime, 1),
    location: '',
    description: '',
    assignedCaregiver: '',
    client: '',
    isRecurring: false,
    notifications: ['30-min-before'],
    status: 'scheduled',
    visibility: 'care-team-only',
  });

  const eventTypes: CareEventType[] = ['care-shift', 'appointment', 'blocked-date'];

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      startDate: selectedTime,
      endDate: addHours(selectedTime, 1),
    }));
  }, [selectedDate, selectedTime]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecurrenceToggle = (checked: boolean) => {
    handleInputChange('isRecurring', checked);
    if (checked) {
      setWizardStep(2);
    } else {
      setWizardStep(1);
      // Reset recurrence options when unchecked
      setRecurrencePattern('weekly');
      setRecurrenceEndDate('');
      setRecurrenceInterval(1);
      setSelectedDays([]);
    }
  };

  const handleNextToStep2 = () => {
    if (!formData.title?.trim()) {
      alert('Please enter a title before proceeding');
      return;
    }
    setWizardStep(2);
  };

  const handleBackToStep1 = () => {
    setWizardStep(1);
  };

  const handleCompleteWizard = async () => {
    if (wizardStep === 2) {
      // From step 2, go back to step 1 to complete the event creation
      setWizardStep(1);
      return;
    }

    // From step 1, proceed with event creation
    if (!formData.title?.trim()) {
      alert('Please enter a title for the care activity');
      return;
    }

    // Validate required fields based on event type
    const config = getEventTypeFieldConfig(selectedEventType);
    const missingFields = config.required.filter(field => {
      if (field === 'teamMembers') return selectedCaregivers.length === 0;
      if (field === 'careRecipient') return !formData.client;
      if (field === 'location') return !formData.location;
      if (field === 'description') return !formData.description?.trim();
      return !formData[field as keyof CareEventCreateData];
    });

    if (missingFields.length > 0) {
      const fieldLabels = {
        'teamMembers': 'team members',
        'careRecipient': 'care recipient',
        'location': 'location',
        'description': 'description',
        'dateTime': 'date and time'
      };
      const missingLabel = fieldLabels[missingFields[0] as keyof typeof fieldLabels] || missingFields[0];
      alert(`Please fill in the ${missingLabel} field`);
      return;
    }

    setIsLoading(true);
    try {
      // Build recurrence pattern string
      let recurrencePatternStr = '';
      if (formData.isRecurring) {
        const daysStr = selectedDays.length > 0 ? ` on ${selectedDays.join(',')}` : '';
        const endDateStr = recurrenceEndDate ? ` until ${recurrenceEndDate}` : '';
        recurrencePatternStr = `${recurrencePattern} every ${recurrenceInterval}${daysStr}${endDateStr}`;
      }

      const eventData: CareEventCreateData = {
        title: formData.title!,
        type: selectedEventType,
        startDate: formData.startDate!,
        endDate: formData.endDate!,
        location: customLocation || formData.location || '',
        description: formData.description || '',
        assignedCaregiver: selectedCaregivers.join(', '),
        client: formData.client || '',
        isRecurring: formData.isRecurring || false,
        recurrencePattern: recurrencePatternStr,
        notifications: formData.notifications || ['30-min-before'],
        status: formData.status as CareEventStatus,
        visibility: formData.visibility as CareEventVisibility,
        metadata: formData.metadata,
      };

      const newEvent = await createEvent(eventData);
      onEventCreated?.(newEvent.id);
      onClose();
    } catch (error) {
      console.error('Error creating care event:', error);
      alert('Failed to create care activity. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const getDaysOfWeek = () => {
    return [
      { key: 'monday', label: 'Mon' },
      { key: 'tuesday', label: 'Tue' },
      { key: 'wednesday', label: 'Wed' },
      { key: 'thursday', label: 'Thu' },
      { key: 'friday', label: 'Fri' },
      { key: 'saturday', label: 'Sat' },
      { key: 'sunday', label: 'Sun' }
    ];
  };

  const handleEventTypeSelect = (type: CareEventType) => {
    setSelectedEventType(type);
    handleInputChange('type', type);
    
    // Set smart defaults based on event type
    const config = getEventTypeFieldConfig(type);
    const newEndDate = addHours(formData.startDate || selectedTime, config.defaultDuration);
    setFormData(prev => ({
      ...prev,
      type,
      endDate: newEndDate,
    }));
  };

  if (!isOpen) return null;

  const currentConfig = getEventTypeFieldConfig(selectedEventType);

  // Warm, inclusive placeholders and labels based on event type
  const getContextualContent = (type: CareEventType) => {
    switch (type) {
      case 'care-shift':
        return {
          titlePlaceholder: "Who's providing care?",
          titleLabel: "Care Schedule"
        };
      case 'appointment':
        return {
          titlePlaceholder: "What's this appointment for?",
          titleLabel: "Appointment"
        };
      case 'blocked-date':
        return {
          titlePlaceholder: "Why unavailable? e.g., Sick, Vacation, Personal",
          titleLabel: "Unavailable"
        };
      default:
        return {
          titlePlaceholder: "Add to schedule",
          titleLabel: "Title"
        };
    }
  };

  const contextualContent = getContextualContent(selectedEventType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-lg shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-4">
          {/* Header with title and close */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-paragraph-sm font-medium text-text-strong-950">
              Add to Schedule
            </h3>
            <button 
              onClick={onClose} 
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-1 rounded hover:bg-bg-weak-50"
            >
              <RiCloseLine size={16} />
            </button>
          </div>

          {/* STEP 1: Main Event Creation */}
          {wizardStep === 1 && (
            <div className="space-y-3">
              {/* Event Type Selection - Horizontal Row */}
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {eventTypes.map((type) => {
                    const config = getEventTypeFieldConfig(type);
                    const isSelected = selectedEventType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleEventTypeSelect(type)}
                        className={`p-3 text-center border rounded-lg transition-all duration-200 hover:scale-105 ${
                          isSelected 
                            ? `${config.color} shadow-sm` 
                            : 'bg-white border-stroke-soft-200 text-text-sub-600 hover:bg-bg-weak-50'
                        }`}
                      >
                        <div className="text-lg mb-1">{config.icon}</div>
                        <div className="text-label-xs font-medium">{config.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Divider Line */}
              <div className="border-t border-stroke-soft-200"></div>

              {/* Title - Clean Input Style */}
              <div>
                <label className="text-paragraph-xs text-text-strong-950 mb-2 block font-medium">
                  {contextualContent.titleLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder={contextualContent.titlePlaceholder}
                    className="w-full h-12 px-4 py-3 text-paragraph-sm border border-stroke-soft-200 rounded-lg bg-bg-white-0 text-text-strong-950 placeholder:text-text-soft-400 focus:ring-2 focus:ring-primary-base focus:border-transparent transition-all duration-200 hover:border-stroke-soft-300"
                    autoFocus
                  />
                </div>
              </div>

              {/* Date and Time - Clean Input Style */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-paragraph-xs text-text-strong-950 mb-2 block font-medium">Date</label>
                  <input
                    type="date"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      const newStartDateTime = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), selectedTime.getHours(), selectedTime.getMinutes());
                      handleInputChange('startDate', newStartDateTime);
                      const currentDuration = formData.endDate ? (formData.endDate.getTime() - formData.startDate!.getTime()) / (1000 * 60 * 60) : 1;
                      handleInputChange('endDate', addHours(newStartDateTime, currentDuration));
                    }}
                    className="w-full h-12 px-4 py-3 text-paragraph-sm border border-stroke-soft-200 rounded-lg bg-bg-white-0 text-text-strong-950 focus:ring-2 focus:ring-primary-base focus:border-transparent transition-all duration-200 hover:border-stroke-soft-300"
                  />
                </div>
                <div>
                  <label className="text-paragraph-xs text-text-strong-950 mb-2 block font-medium">
                    {selectedEventType === 'blocked-date' ? 'From' : 'Start'}
                  </label>
                  <input
                    type="time"
                    value={format(formData.startDate || selectedTime, 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newStartDateTime = new Date(formData.startDate || selectedTime);
                      newStartDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      handleInputChange('startDate', newStartDateTime);
                      const currentDuration = formData.endDate ? (formData.endDate.getTime() - formData.startDate!.getTime()) / (1000 * 60 * 60) : 1;
                      handleInputChange('endDate', addHours(newStartDateTime, currentDuration));
                    }}
                    className="w-full h-12 px-4 py-3 text-paragraph-sm border border-stroke-soft-200 rounded-lg bg-bg-white-0 text-text-strong-950 focus:ring-2 focus:ring-primary-base focus:border-transparent transition-all duration-200 hover:border-stroke-soft-300"
                  />
                </div>
                <div>
                  <label className="text-paragraph-xs text-text-strong-950 mb-2 block font-medium">
                    {selectedEventType === 'blocked-date' ? 'To' : 'End'}
                  </label>
                  <input
                    type="time"
                    value={format(formData.endDate || addHours(selectedTime, 1), 'HH:mm')}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const newEndDateTime = new Date(formData.startDate || selectedTime);
                      newEndDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                      handleInputChange('endDate', newEndDateTime);
                    }}
                    className="w-full h-12 px-4 py-3 text-paragraph-sm border border-stroke-soft-200 rounded-lg bg-bg-white-0 text-text-strong-950 focus:ring-2 focus:ring-primary-base focus:border-transparent transition-all duration-200 hover:border-stroke-soft-300"
                  />
                </div>
              </div>

              {/* Family Member - Show for care-shift and appointment */}
              {(selectedEventType === 'care-shift' || selectedEventType === 'appointment') && (
                <div>
                  <label className="block text-label-xs text-text-sub-600 mb-1 uppercase tracking-wider">Who needs care?</label>
                  <select
                    value={formData.client || ''}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    className="w-full px-2 py-1.5 h-8 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors"
                  >
                    <option value="">Select care recipient</option>
                    {careRecipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Team Member Selector - Show for care-shift and blocked-date */}
              {(selectedEventType === 'care-shift' || selectedEventType === 'blocked-date') && (
                <div>
                  <label className="block text-label-xs text-text-sub-600 mb-2 uppercase tracking-wider">
                    {selectedEventType === 'care-shift' ? 'Who\'s helping?' : 'Who\'s unavailable?'} ({selectedCaregivers.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {caregivers.map((caregiver) => {
                      const isSelected = selectedCaregivers.includes(caregiver.id);
                      return (
                        <button
                          key={caregiver.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedCaregivers(prev => prev.filter(id => id !== caregiver.id));
                            } else {
                              setSelectedCaregivers(prev => [...prev, caregiver.id]);
                            }
                          }}
                          className={`px-3 py-2 text-label-sm font-medium rounded-lg border transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? 'bg-green-200 text-green-800 border-green-300 shadow-sm'
                              : 'bg-white text-text-strong-950 border-stroke-soft-200 hover:bg-bg-weak-50 hover:border-stroke-soft-300'
                          }`}
                        >
                          {caregiver.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location - Show for care-shift and appointment */}
              {(selectedEventType === 'care-shift' || selectedEventType === 'appointment') && (
                <div>
                  <label className="block text-label-xs text-text-sub-600 mb-1 uppercase tracking-wider">Where will this happen?</label>
                  <select
                    value={formData.location || ''}
                    onChange={(e) => {
                      const selectedLocation = e.target.value;
                      handleInputChange('location', selectedLocation);
                      if (selectedLocation === 'loc-5') {
                        setCustomLocation('');
                      } else {
                        setCustomLocation('');
                      }
                    }}
                    className="w-full px-2 py-1.5 h-8 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors mb-1"
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {formData.location === 'loc-5' && (
                    <input
                      type="text"
                      placeholder="Enter other location"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      className="w-full px-2 py-1.5 h-8 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 placeholder:text-text-soft-400 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors"
                    />
                  )}
                </div>
              )}

              {/* Additional Details - Show for care-shift and blocked-date */}
              {(selectedEventType === 'care-shift' || selectedEventType === 'blocked-date') && (
                <div>
                  <label className="block text-label-xs text-text-sub-600 mb-1 uppercase tracking-wider">
                    Additional Notes
                  </label>
                  <textarea
                    placeholder={
                      selectedEventType === 'care-shift' 
                        ? "e.g., Special care instructions, medications, important notes..."
                        : "e.g., Taking time off, personal day, emergency situation..."
                    }
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-2 py-1.5 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 placeholder:text-text-soft-400 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors resize-none"
                    rows={2}
                  />
                </div>
              )}

              {/* Recurrence Checkbox - Show for care-shift, appointment, and blocked-date (moved to last) */}
              {(selectedEventType === 'care-shift' || selectedEventType === 'appointment' || selectedEventType === 'blocked-date') && (
                <div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={formData.isRecurring || false}
                      onChange={(e) => handleRecurrenceToggle(e.target.checked)}
                      className="w-3 h-3 text-primary-base bg-white border-stroke-soft-200 rounded focus:ring-primary-base focus:ring-1"
                    />
                    <label htmlFor="recurring" className="text-label-xs text-text-strong-950">
                      {selectedEventType === 'care-shift' 
                        ? 'Recurring availability pattern'
                        : selectedEventType === 'appointment'
                        ? 'Recurring appointment pattern'
                        : 'Recurring unavailability pattern'
                      }
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Recurrence Settings */}
          {wizardStep === 2 && (
            <div className="space-y-3">
              {/* Step 2 Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-label-sm text-text-strong-950">Recurrence Settings</h3>
                <button
                  onClick={handleBackToStep1}
                  className="text-label-xs text-text-sub-600 hover:text-text-strong-950 transition-colors"
                >
                  ← Back
                </button>
              </div>

              {/* Recurrence Pattern Setup */}
              <div className="p-2 bg-bg-weak-50 rounded border border-stroke-soft-200 space-y-2">
                <h4 className="text-label-xs font-medium text-text-strong-950">
                  Set up recurring pattern
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  {/* Pattern Selection */}
                  <div>
                    <label className="block text-label-xs text-text-sub-600 mb-0.5 uppercase tracking-wider">
                      Pattern
                    </label>
                    <select
                      value={recurrencePattern}
                      onChange={(e) => setRecurrencePattern(e.target.value)}
                      className="w-full px-1.5 py-1 h-6 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Interval */}
                  <div>
                    <label className="block text-label-xs text-text-sub-600 mb-0.5 uppercase tracking-wider">
                      Every
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={recurrenceInterval}
                        onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || 1)}
                        className="w-10 px-1.5 py-1 h-6 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors"
                      />
                      <span className="text-label-xs text-text-sub-600">
                        {recurrencePattern === 'daily' ? 'd' :
                         recurrencePattern === 'weekly' ? 'w' :
                         recurrencePattern === 'biweekly' ? 'bw' :
                         'm'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Days of Week - Show for weekly/biweekly */}
                {(recurrencePattern === 'weekly' || recurrencePattern === 'biweekly') && (
                  <div>
                    <label className="block text-label-xs text-text-sub-600 mb-0.5 uppercase tracking-wider">
                      Days
                    </label>
                    <div className="grid grid-cols-7 gap-0.5">
                      {getDaysOfWeek().map((day) => (
                        <button
                          key={day.key}
                          onClick={() => handleDayToggle(day.key)}
                          className={`p-0.5 text-center border rounded text-label-xs transition-all duration-200 ${
                            selectedDays.includes(day.key)
                              ? 'bg-primary-lighter border-primary-base text-primary-dark'
                              : 'bg-white border-stroke-soft-200 text-text-strong-950 hover:bg-bg-weak-50'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* End Date */}
                <div>
                  <label className="block text-label-xs text-text-sub-600 mb-0.5 uppercase tracking-wider">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={recurrenceEndDate}
                    onChange={(e) => setRecurrenceEndDate(e.target.value)}
                    min={format(selectedDate, 'yyyy-MM-dd')}
                    className="w-full px-1.5 py-1 h-6 text-label-xs border border-stroke-soft-200 rounded bg-bg-white-0 text-text-strong-950 focus:ring-1 focus:ring-primary-base focus:border-transparent transition-colors"
                  />
                </div>

                {/* Summary */}
                <div className="p-2 bg-white rounded border border-stroke-soft-200">
                  <p className="text-label-xs text-text-sub-600">
                    {`Repeat ${recurrencePattern} every ${recurrenceInterval} ${
                      recurrencePattern === 'daily' ? 'day(s)' :
                      recurrencePattern === 'weekly' ? 'week(s)' :
                      recurrencePattern === 'biweekly' ? 'bi-week(s)' :
                      'month(s)'
                    }`}
                    {selectedDays.length > 0 && ` on ${selectedDays.map(day => getDaysOfWeek().find(d => d.key === day)?.label).join(', ')}`}
                    {recurrenceEndDate && ` until ${format(new Date(recurrenceEndDate), 'MMM dd, yyyy')}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer - Clean Button Style */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t border-stroke-soft-200">
            <div className="text-paragraph-xs text-text-soft-400">
              {wizardStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
            </div>
            <div className="flex gap-3">
              <Button.Root
                onClick={onClose}
                variant="neutral"
                mode="stroke"
                size="medium"
                className="px-6"
              >
                Cancel
              </Button.Root>
              <Button.Root
                onClick={wizardStep === 1 ? handleCompleteWizard : handleCompleteWizard}
                variant="primary"
                mode="filled"
                size="medium"
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? 'Saving...' : 
                  wizardStep === 1 && formData.isRecurring ? 'Confirm' : 
                  wizardStep === 1 ? 'Add to Schedule' : 
                  'Complete Recurring Schedule'}
              </Button.Root>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}