'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { RiAddLine, RiCloseLine, RiHeartLine, RiMedicineBottleLine, RiUserAddLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';

import { 
  activeStepAtom, 
  nextStepAtom, 
  prevStepAtom,
  onboardingDataAtom,
  stepValidationAtom,
  canProceedAtom 
} from './store';
import { COMMON_MEDICAL_CONDITIONS, COMMON_MEDICATIONS } from '../types/onboarding';

export default function OnboardingStepCareRecipient() {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);

  const [localData, setLocalData] = React.useState(onboardingData.careRecipient);
  const [newEmergencyContact, setNewEmergencyContact] = React.useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
  });
  const [showAddContact, setShowAddContact] = React.useState(false);

  // Update validation when data changes
  React.useEffect(() => {
    // Only require fields with asterisks (name and date of birth)
    const isValid = localData.name.trim() && localData.dateOfBirth;
    
    setStepValidation(prev => ({
      ...prev,
      [activeStep]: isValid,
    }));

    // Update global data
    setOnboardingData(prev => ({
      ...prev,
      careRecipient: localData,
    }));
  }, [localData, activeStep, setStepValidation, setOnboardingData]);

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

  const handleBasicInfoChange = (field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleMedicalConditionToggle = (condition: string) => {
    setLocalData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.includes(condition)
        ? prev.medicalConditions.filter(c => c !== condition)
        : [...prev.medicalConditions, condition],
    }));
  };

  const handleMedicationToggle = (medication: string) => {
    setLocalData(prev => ({
      ...prev,
      medications: prev.medications.includes(medication)
        ? prev.medications.filter(m => m !== medication)
        : [...prev.medications, medication],
    }));
  };

  const handleAddEmergencyContact = () => {
    if (newEmergencyContact.name && newEmergencyContact.phone) {
      setLocalData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newEmergencyContact],
      }));
      setNewEmergencyContact({ name: '', relationship: '', phone: '', email: '' });
      setShowAddContact(false);
    }
  };

  const handleRemoveEmergencyContact = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          Tell us about the person you're caring for
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          This information helps us provide personalized care coordination and ensures proper emergency contacts.
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Basic Information */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-full bg-purple-100'>
              <RiHeartLine className='size-5 text-purple-600' />
            </div>
            <div>
              <h2 className='text-title-h6'>Basic Information</h2>
              <p className='text-paragraph-sm text-text-sub-600'>Essential details about the care recipient</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div>
              <Label.Root htmlFor='name'>
                Full Name <Label.Asterisk />
              </Label.Root>
              <Input.Root className='mt-1'>
                <Input.Wrapper>
                  <Input.Icon as={RiUserAddLine} />
                  <Input.Input
                    id='name'
                    type='text'
                    placeholder='Enter full name'
                    value={localData.name}
                    onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div>
              <Label.Root htmlFor='dateOfBirth'>
                Date of Birth <Label.Asterisk />
              </Label.Root>
              <Input.Root className='mt-1'>
                <Input.Input
                  id='dateOfBirth'
                  type='date'
                  value={localData.dateOfBirth}
                  onChange={(e) => handleBasicInfoChange('dateOfBirth', e.target.value)}
                />
              </Input.Root>
            </div>

            <div>
              <Label.Root htmlFor='specialInstructions'>
                Special Instructions or Notes
              </Label.Root>
              <Textarea.Root 
                className='mt-1'
                id='specialInstructions'
                placeholder='Any important care instructions, preferences, or notes...'
                value={localData.specialInstructions}
                onChange={(e) => handleBasicInfoChange('specialInstructions', e.target.value)}
                rows={4}
                simple
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
          <div className='mb-6 flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-full bg-blue-100'>
              <RiMedicineBottleLine className='size-5 text-blue-600' />
            </div>
            <div>
              <h2 className='text-title-h6'>Medical Information</h2>
              <p className='text-paragraph-sm text-text-sub-600'>Help caregivers provide appropriate care</p>
            </div>
          </div>

          <div className='space-y-6'>
            {/* Medical Conditions */}
            <div>
              <Label.Root className='text-paragraph-sm font-medium mb-3 block'>
                Medical Conditions
              </Label.Root>
              <div className='flex flex-wrap gap-2'>
                {COMMON_MEDICAL_CONDITIONS.map((condition) => (
                  <Badge.Root
                    key={condition}
                    variant={localData.medicalConditions.includes(condition) ? 'filled' : 'light'}
                    color={localData.medicalConditions.includes(condition) ? 'purple' : 'gray'}
                    className={cn(
                      'cursor-pointer transition-all',
                      'hover:bg-purple-100 hover:text-purple-700'
                    )}
                    onClick={() => handleMedicalConditionToggle(condition)}
                  >
                    {condition}
                  </Badge.Root>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <Label.Root className='text-paragraph-sm font-medium mb-3 block'>
                Current Medications
              </Label.Root>
              <div className='flex flex-wrap gap-2'>
                {COMMON_MEDICATIONS.map((medication) => (
                  <Badge.Root
                    key={medication}
                    variant={localData.medications.includes(medication) ? 'filled' : 'light'}
                    color={localData.medications.includes(medication) ? 'blue' : 'gray'}
                    className={cn(
                      'cursor-pointer transition-all',
                      'hover:bg-blue-100 hover:text-blue-700'
                    )}
                    onClick={() => handleMedicationToggle(medication)}
                  >
                    {medication}
                  </Badge.Root>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className='mt-6 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 items-center justify-center rounded-full bg-red-100'>
              <RiUserAddLine className='size-5 text-red-600' />
            </div>
            <div>
              <h2 className='text-title-h6'>Emergency Contacts</h2>
              <p className='text-paragraph-sm text-text-sub-600'>Who should we contact in case of emergency?</p>
            </div>
          </div>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='small'
            onClick={() => setShowAddContact(!showAddContact)}
          >
            <Button.Icon as={RiAddLine} />
            Add Contact
          </Button.Root>
        </div>

        {/* Existing Contacts */}
        <div className='space-y-3 mb-4'>
          {localData.emergencyContacts.map((contact, index) => (
            <div key={index} className='flex items-center justify-between rounded-lg border border-stroke-soft-200 p-4'>
              <div className='flex-1'>
                <div className='font-medium text-text-strong-950'>{contact.name}</div>
                <div className='text-paragraph-sm text-text-sub-600'>
                  {contact.relationship} • {contact.phone} • {contact.email}
                </div>
              </div>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='small'
                onClick={() => handleRemoveEmergencyContact(index)}
              >
                <Button.Icon as={RiCloseLine} />
              </Button.Root>
            </div>
          ))}
        </div>

        {/* Add New Contact Form */}
        {showAddContact && (
          <div className='rounded-lg border border-stroke-soft-200 p-4 bg-bg-soft-50'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <Label.Root htmlFor='contactName'>
                  Name <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Input
                    id='contactName'
                    type='text'
                    placeholder='Full name'
                    value={newEmergencyContact.name}
                    onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
                  />
                </Input.Root>
              </div>
              <div>
                <Label.Root htmlFor='relationship'>
                  Relationship
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Input
                    id='relationship'
                    type='text'
                    placeholder='e.g., Spouse, Child, Doctor'
                    value={newEmergencyContact.relationship}
                    onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
                  />
                </Input.Root>
              </div>
              <div>
                <Label.Root htmlFor='contactPhone'>
                  Phone <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Input
                    id='contactPhone'
                    type='tel'
                    placeholder='(555) 123-4567'
                    value={newEmergencyContact.phone}
                    onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </Input.Root>
              </div>
              <div>
                <Label.Root htmlFor='contactEmail'>
                  Email
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Input
                    id='contactEmail'
                    type='email'
                    placeholder='email@example.com'
                    value={newEmergencyContact.email}
                    onChange={(e) => setNewEmergencyContact(prev => ({ ...prev, email: e.target.value }))}
                  />
                </Input.Root>
              </div>
            </div>
            <div className='mt-4 flex justify-end gap-2'>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='small'
                onClick={() => setShowAddContact(false)}
              >
                Cancel
              </Button.Root>
              <Button.Root
                variant='primary'
                size='small'
                onClick={handleAddEmergencyContact}
                disabled={!newEmergencyContact.name || !newEmergencyContact.phone}
              >
                Add Contact
              </Button.Root>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className='mt-8 flex justify-between'>
        <Button.Root 
          variant='neutral' 
          mode='ghost'
          onClick={prevStep}
        >
          ← Back
        </Button.Root>
        <Button.Root 
          variant='primary' 
          size='medium'
          onClick={nextStep}
          onKeyDown={(e) => handleKeyDown(e, nextStep)}
          disabled={!canProceed}
        >
          Continue
        </Button.Root>
      </div>
    </div>
  );
}
