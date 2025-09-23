'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { 
  RiCalendarLine, 
  RiTimeLine,
  RiCheckboxBlankLine,
  RiCheckboxLine
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as Button from '@/components/ui/button';
import * as Select from '@/components/ui/select';
import * as Input from '@/components/ui/input';
import { RecurringPatternSelector, RecurringPatternData } from '@/components/recurring-pattern-selector';

import { 
  activeStepAtom, 
  nextStepAtom,
  prevStepAtom,
  onboardingDataAtom,
  stepValidationAtom,
  canProceedAtom
} from './store';

// Simplified for MVP - no complex time selection

export default function OnboardingStepScheduling() {
  const [activeStep] = useAtom(activeStepAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);

  const [schedulingMethod, setSchedulingMethod] = React.useState<string>('');
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [startTime, setStartTime] = React.useState<string>('');
  const [endTime, setEndTime] = React.useState<string>('');
  const [recurringPattern, setRecurringPattern] = React.useState<RecurringPatternData>({
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [],
    endDate: undefined
  });


  // Determine user role from Step 1
  const userRole = onboardingData.relationshipToCare;
  const isCareRecipient = userRole === 'care-recipient';

  const handleSchedulingMethodChange = (value: string) => {
    setSchedulingMethod(value);
    validateStep();
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };




  const validateStep = () => {
    // Scheduling is optional - user can skip this step
    const isValid = true; // Always allow Continue/Skip
    
    setStepValidation(prev => ({ ...prev, [activeStep]: isValid }));
  };

  const getValidationMessage = () => {
    // All scheduling methods are now optional
    return null;
  };

  React.useEffect(() => {
    validateStep();
  }, [schedulingMethod, selectedDays, startTime, endTime]);

  // Global Enter key support
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed) {
        e.preventDefault();
        nextStep();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canProceed, nextStep]);

  const handleContinue = () => {
    if (canProceed) {
      // Save scheduling data
      setOnboardingData(prev => ({
        ...prev,
        scheduling: {
          ...prev.scheduling,
          method: schedulingMethod,
          careRequirements: isCareRecipient ? {
            type: schedulingMethod,
          } : undefined,
          availability: !isCareRecipient ? {
            method: schedulingMethod,
            days: selectedDays,
            startTime: startTime,
            endTime: endTime,
            recurringPattern: recurringPattern.frequency || null,
          } : undefined,
        }
      }));
      nextStep();
    }
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const getSchedulingOptions = () => {
    if (isCareRecipient) {
      return [
        {
          value: '24-7',
          label: '24/7 Care Needed',
          description: 'I need continuous care around the clock',
          icon: 'RiTimeLine',
        },
        {
          value: 'as-needed',
          label: 'As-Needed Care',
          description: 'I need care when required',
          icon: 'RiTimeLine',
        },
      ];
    } else {
      return [
        {
          value: 'manual',
          label: 'Set My Availability',
          description: 'I\'ll specify when I\'m available for care',
          icon: 'RiCalendarLine',
        },
        {
          value: 'on-call',
          label: 'On-Call Availability',
          description: 'I\'m available for emergency or last-minute care',
          icon: 'RiTimeLine',
        },
        {
          value: 'temporary',
          label: 'Temporary Leave',
          description: 'I\'m currently unavailable (vacation, sick, etc.)',
          icon: 'RiCalendarLine',
        },
        {
          value: 'flexible',
          label: 'Flexible Schedule',
          description: 'My availability changes frequently',
          icon: 'RiTimeLine',
        },
      ];
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'RiTimeLine': return RiTimeLine;
      case 'RiCalendarLine': return RiCalendarLine;
      case 'RiGoogleFill': return RiGoogleFill;
      default: return RiCalendarLine;
    }
  };

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          {isCareRecipient ? 'Set Your Care Requirements' : 'Add Your Availability'}
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          {isCareRecipient 
            ? 'Tell us about your care needs and schedule requirements.'
            : 'Help us understand when you\'re available to provide care.'
          }
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        <div className='space-y-6'>
          {/* Method Selection */}
          <div>
            <Label.Root className='text-paragraph-md font-medium'>
              {isCareRecipient ? 'What are your care requirements?' : 'How would you like to add your availability?'} <Label.Asterisk />
            </Label.Root>
            <p className='text-paragraph-sm text-text-sub-600 mb-4'>
              {isCareRecipient 
                ? 'Choose the option that best describes your care needs.'
                : 'Select your scheduling preferences.'
              }
            </p>
            
            <Radio.Group 
              value={schedulingMethod} 
              onValueChange={handleSchedulingMethodChange}
              className="space-y-3"
            >
              {getSchedulingOptions().map((option) => {
                const IconComponent = getIcon(option.icon);
                return (
                  <LabelPrimitive.Root
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                      schedulingMethod === option.value && 'shadow-none ring-primary-base',
                    )}
                  >
                    <IconComponent className="size-5 text-primary-base mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="text-label-sm">{option.label}</div>
                      <div className="text-paragraph-xs text-text-sub-600">
                        {option.description}
                      </div>
                    </div>
                    <Radio.Item value={option.value} />
                  </LabelPrimitive.Root>
                );
              })}
            </Radio.Group>
          </div>



          {/* Manual Entry for Care Team Members */}
          {!isCareRecipient && schedulingMethod === 'manual' && (
            <div className="space-y-6">
              <div>
                <Label.Root className='text-label-sm font-medium mb-3 block'>
                  Which days are you available? (Recommended)
                </Label.Root>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'monday', label: 'Monday' },
                    { value: 'tuesday', label: 'Tuesday' },
                    { value: 'wednesday', label: 'Wednesday' },
                    { value: 'thursday', label: 'Thursday' },
                    { value: 'friday', label: 'Friday' },
                    { value: 'saturday', label: 'Saturday' },
                    { value: 'sunday', label: 'Sunday' },
                  ].map((day) => (
                    <button
                      key={day.value}
                      onClick={() => handleDayToggle(day.value)}
                      className={cn(
                        'flex items-center gap-2 p-3 rounded-lg border transition-all duration-200',
                        selectedDays.includes(day.value)
                          ? 'border-primary-base bg-primary-alpha-10 text-primary-base shadow-sm'
                          : 'border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 hover:border-stroke-soft-300 hover:shadow-sm'
                      )}
                    >
                      {selectedDays.includes(day.value) ? (
                        <RiCheckboxLine className="size-4" />
                      ) : (
                        <RiCheckboxBlankLine className="size-4" />
                      )}
                      <span className="text-paragraph-sm font-medium">{day.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDays.length > 0 && (
                <div>
                  <Label.Root className='text-label-sm font-medium mb-3 block'>
                    What times are you available? <Label.Asterisk />
                  </Label.Root>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label.Root className='text-paragraph-xs text-text-sub-600 mb-2 block'>
                        Start Time
                      </Label.Root>
                      <Select.Root value={startTime} onValueChange={setStartTime}>
                        <Select.Trigger className="w-full">
                          <Select.Value placeholder="Select start time" />
                        </Select.Trigger>
                        <Select.Content>
                          {[
                            { value: '06:00', label: '6:00 AM' },
                            { value: '08:00', label: '8:00 AM' },
                            { value: '10:00', label: '10:00 AM' },
                            { value: '12:00', label: '12:00 PM' },
                            { value: '14:00', label: '2:00 PM' },
                            { value: '16:00', label: '4:00 PM' },
                            { value: '18:00', label: '6:00 PM' },
                            { value: '20:00', label: '8:00 PM' },
                          ].map((slot) => (
                            <Select.Item key={slot.value} value={slot.value}>
                              <div className="flex items-center gap-2">
                                <RiTimeLine className="size-4" />
                                {slot.label}
                              </div>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>
                    <div>
                      <Label.Root className='text-paragraph-xs text-text-sub-600 mb-2 block'>
                        End Time
                      </Label.Root>
                      <Select.Root value={endTime} onValueChange={setEndTime}>
                        <Select.Trigger className="w-full">
                          <Select.Value placeholder="Select end time" />
                        </Select.Trigger>
                        <Select.Content>
                          {[
                            { value: '08:00', label: '8:00 AM' },
                            { value: '10:00', label: '10:00 AM' },
                            { value: '12:00', label: '12:00 PM' },
                            { value: '14:00', label: '2:00 PM' },
                            { value: '16:00', label: '4:00 PM' },
                            { value: '18:00', label: '6:00 PM' },
                            { value: '20:00', label: '8:00 PM' },
                            { value: '22:00', label: '10:00 PM' },
                          ].map((slot) => (
                            <Select.Item key={slot.value} value={slot.value}>
                              <div className="flex items-center gap-2">
                                <RiTimeLine className="size-4" />
                                {slot.label}
                              </div>
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>
                  </div>
                </div>
              )}

              {selectedDays.length > 0 && startTime && endTime && (
                <div>
                  <Label.Root className='text-label-sm font-medium mb-3 block'>
                    Set up recurring pattern (Optional)
                  </Label.Root>
                  
                  <RecurringPatternSelector
                    pattern={recurringPattern}
                    onPatternChange={setRecurringPattern}
                    showDaysSelection={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Selection Summary */}
          {canProceed && (
            <div className="rounded-lg border border-success-base bg-success-alpha-10 p-4">
              <div className="flex items-center gap-2 text-success-base mb-2">
                <RiTimeLine className="size-4" />
                <span className="text-paragraph-sm font-medium">Availability Set</span>
              </div>
              <div className="text-paragraph-xs text-text-sub-600">
                {isCareRecipient ? (
                  schedulingMethod === '24-7' ? (
                    'You need 24/7 care coverage'
                  ) : (
                    'You need care as needed'
                  )
                ) : (
                  selectedDays.length > 0 && startTime && endTime ? (
                    `Available ${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''} from ${startTime} to ${endTime}${recurringPattern.frequency ? ` (${recurringPattern.frequency === 'weekly' ? 'weekly' : recurringPattern.frequency === 'monthly' ? 'monthly' : 'daily'} pattern)` : ''}`
                  ) : (
                    'You\'ll set up your availability in the next step'
                  )
                )}
              </div>
            </div>
          )}

          {/* On-Call Availability */}
          {!isCareRecipient && schedulingMethod === 'on-call' && (
            <div className="rounded-lg border border-info-base bg-info-alpha-10 p-6">
              <div className="flex items-start gap-3">
                <RiTimeLine className="size-5 text-info-base mt-0.5" />
                <div>
                  <h3 className="text-paragraph-sm font-semibold text-info-base mb-2">
                    On-Call Availability
                  </h3>
                  <p className="text-paragraph-sm text-text-sub-600 mb-4">
                    You'll be available for emergency or last-minute care requests. The care coordinator will contact you when urgent help is needed.
                  </p>
                  <div className="flex items-center gap-2 text-paragraph-sm text-info-base">
                    <RiCheckboxLine className="size-4" />
                    <span>Ready for emergency calls</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Temporary Leave */}
          {!isCareRecipient && schedulingMethod === 'temporary' && (
            <div className="rounded-lg border border-warning-base bg-warning-alpha-10 p-6">
              <div className="flex items-start gap-3">
                <RiCalendarLine className="size-5 text-warning-base mt-0.5" />
                <div>
                  <h3 className="text-paragraph-sm font-semibold text-warning-base mb-2">
                    Temporary Leave
                  </h3>
                  <p className="text-paragraph-sm text-text-sub-600 mb-4">
                    You're currently unavailable for care. You can update your availability when you're ready to return.
                  </p>
                  <div className="flex items-center gap-2 text-paragraph-sm text-warning-base">
                    <RiCheckboxLine className="size-4" />
                    <span>Temporarily unavailable</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flexible Schedule */}
          {!isCareRecipient && schedulingMethod === 'flexible' && (
            <div className="rounded-lg border border-primary-base bg-primary-alpha-10 p-6">
              <div className="flex items-start gap-3">
                <RiTimeLine className="size-5 text-primary-base mt-0.5" />
                <div>
                  <h3 className="text-paragraph-sm font-semibold text-primary-base mb-2">
                    Flexible Schedule
                  </h3>
                  <p className="text-paragraph-sm text-text-sub-600 mb-4">
                    Your availability changes frequently. The care coordinator will check with you before scheduling care.
                  </p>
                  <div className="flex items-center gap-2 text-paragraph-sm text-primary-base">
                    <RiCheckboxLine className="size-4" />
                    <span>Availability varies by day</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Message */}
          {!canProceed && schedulingMethod && (
            <div className="rounded-lg border border-warning-base bg-warning-alpha-10 p-4">
              <div className="flex items-center gap-2 text-warning-base">
                <RiTimeLine className="size-4" />
                <span className="text-paragraph-sm font-medium">
                  {getValidationMessage()}
                </span>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-stroke-soft-200">
          <Button.Root
            variant="neutral"
            mode="ghost"
            size="medium"
            onClick={prevStep}
          >
            ← Back
          </Button.Root>
          <div className="flex gap-3">
            <Button.Root
              variant="secondary"
              onClick={nextStep}
              onKeyDown={(e) => handleKeyDown(e, nextStep)}
            >
              Skip
            </Button.Root>
            <Button.Root
              variant="primary"
              onClick={handleContinue}
              onKeyDown={(e) => handleKeyDown(e, handleContinue)}
              disabled={!canProceed}
            >
              Continue
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}