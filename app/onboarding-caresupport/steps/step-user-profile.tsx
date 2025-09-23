'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { 
  RiUserLine, 
  RiMailLine,
  RiPhoneLine
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Button from '@/components/ui/button';
import { activeStepAtom, onboardingDataAtom, stepValidationAtom, canProceedAtom, nextStepAtom, prevStepAtom } from './store';

export default function OnboardingStepUserProfile() {
  const [activeStep] = useAtom(activeStepAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);

  const [localData, setLocalData] = React.useState({
    firstName: onboardingData.userProfile?.firstName || '',
    lastName: onboardingData.userProfile?.lastName || '',
    email: onboardingData.userProfile?.email || '',
    phone: onboardingData.userProfile?.phone || ''
  });

  // Update validation when data changes
  React.useEffect(() => {
    // All basic information is required
    const isValid = localData.firstName.trim() && 
                   localData.lastName.trim() && 
                   localData.email.trim() &&
                   localData.phone.trim();
    
    setStepValidation(prev => ({
      ...prev,
      [activeStep]: isValid,
    }));

    // Update global data
    setOnboardingData(prev => ({
      ...prev,
      userProfile: {
        firstName: localData.firstName,
        lastName: localData.lastName,
        email: localData.email,
        phone: localData.phone
      }
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

  const handleInputChange = (field: string, value: string) => {
    setLocalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };


  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          Complete your care profile
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          Add any additional information that helps us understand your role in care coordination.
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        <div className='space-y-6'>
          {/* Basic Information */}
          <div>
            <h3 className='text-paragraph-md font-medium mb-4 flex items-center gap-2'>
              <RiUserLine className='size-4 text-primary-base' />
              Basic Information
            </h3>
            
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <Label.Root htmlFor='firstName'>
                  First Name <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiUserLine} />
                    <Input.Input
                      id='firstName'
                      type='text'
                      placeholder='Enter your first name'
                      value={localData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (canProceed) {
                            nextStep();
                          }
                        }
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div>
                <Label.Root htmlFor='lastName'>
                  Last Name <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiUserLine} />
                    <Input.Input
                      id='lastName'
                      type='text'
                      placeholder='Enter your last name'
                      value={localData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (canProceed) {
                            nextStep();
                          }
                        }
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            <div className='grid gap-4 md:grid-cols-2 mt-4'>
              <div>
                <Label.Root htmlFor='email'>
                  Email Address <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiMailLine} />
                        <Input.Input
                          id='email'
                          type='email'
                          placeholder='Enter your email address'
                          value={localData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (canProceed) {
                                nextStep();
                              }
                            }
                          }}
                        />
                  </Input.Wrapper>
                </Input.Root>
                <p className='text-paragraph-xs text-text-sub-600 mt-1'>
                  Used for account notifications and login.
                </p>
              </div>

              <div>
                <Label.Root htmlFor='phone'>
                  Phone Number <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiPhoneLine} />
                        <Input.Input
                          id='phone'
                          type='tel'
                          placeholder='Enter your phone number'
                          value={localData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (canProceed) {
                                nextStep();
                              }
                            }
                          }}
                        />
                  </Input.Wrapper>
                </Input.Root>
                <p className='text-paragraph-xs text-text-sub-600 mt-1'>
                  Used for urgent care coordination.
                </p>
              </div>
            </div>
          </div>


          {/* Navigation */}
          <div className='mt-8 flex justify-between'>
            <Button.Root 
              variant='neutral' 
              mode='ghost'
              size='medium'
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
      </div>
    </div>
  );
}
