'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { RiUserAddLine, RiGroupLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as Label from '@/components/ui/label';
import * as Button from '@/components/ui/button';

import { 
  activeStepAtom, 
  nextStepAtom, 
  prevStepAtom,
  onboardingDataAtom,
  stepValidationAtom,
  canProceedAtom 
} from './store';
import { InlineWizard, TeamMemberFormData } from '../components/inline-wizard';

export default function OnboardingStepCareTeam() {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);

  const [mode, setMode] = React.useState<'invite' | 'manual' | null>(null);
  const [isWizardActive, setIsWizardActive] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form data for the wizard
  const [formData, setFormData] = React.useState<TeamMemberFormData>({
    email: '',
    phone: '',
    name: '',
    teamMemberCategory: 'family',
    careRole: '',
    careResponsibilities: '',
    role: 'member',
    customMessage: '',
    schedule: '',
    availabilityType: 'flexible',
    careNotes: '',
    photo: '',
  });

  // Update validation when team members are added
  React.useEffect(() => {
    // Care team is optional - user can skip this step
    const isValid = true; // Always allow Continue/Skip
    
    setStepValidation(prev => ({
      ...prev,
      [activeStep]: isValid,
    }));
  }, [activeStep, setStepValidation]);

  // Global Enter key support
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed && !isWizardActive) {
        e.preventDefault();
        nextStep();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canProceed, nextStep, isWizardActive]);

  const handleModeChange = (newMode: 'invite' | 'manual') => {
    setMode(newMode);
    setIsWizardActive(true);
  };

  const handleFormDataChange = (field: keyof TeamMemberFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWizardSubmit = async (data: TeamMemberFormData, submissionMode: 'invite' | 'manual') => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update global data with team member
      setOnboardingData(prev => ({
        ...prev,
        careTeam: {
          ...prev.careTeam,
          primaryCaregivers: [
            ...prev.careTeam.primaryCaregivers,
            {
              name: data.name,
              email: data.email,
              phone: data.phone,
              category: data.teamMemberCategory,
              role: data.careRole,
              availability: data.schedule || 'Flexible',
            }
          ]
        }
      }));

      // Reset form data
      setFormData({
        email: '',
        phone: '',
        name: '',
        teamMemberCategory: 'family',
        careRole: '',
        careResponsibilities: '',
        role: 'member',
        customMessage: '',
        schedule: '',
        availabilityType: 'flexible',
        careNotes: '',
        photo: '',
      });

      setIsWizardActive(false);
      setMode(null);
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWizardCancel = () => {
    setIsWizardActive(false);
    setMode(null);
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
          Build your care team
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          Add the people who will be part of your care coordination.
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        <div className='space-y-6'>
          {/* Mode Selection - Only show when no mode is selected */}
          {!mode && (
            <div>
              <Label.Root className='text-paragraph-md font-medium'>
                How would you like to add team members? <Label.Asterisk />
              </Label.Root>
              <p className='text-paragraph-sm text-text-sub-600 mb-4'>
                Choose the method that works best for your care team.
              </p>
              
              <Radio.Group 
                value={mode ?? undefined} 
                onValueChange={handleModeChange}
                className="space-y-3"
              >
                <LabelPrimitive.Root
                  className={cn(
                    'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                    mode === 'invite' && 'shadow-none ring-primary-base',
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="text-label-sm">Invite by Email or Phone</div>
                    <div className="text-paragraph-xs text-text-sub-600">
                      Send an invitation via email or phone to join the care team.
                    </div>
                  </div>
                  <Radio.Item value="invite" />
                </LabelPrimitive.Root>
                
                <LabelPrimitive.Root
                  className={cn(
                    'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                    mode === 'manual' && 'shadow-none ring-primary-base',
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="text-label-sm">Add Manually</div>
                    <div className="text-paragraph-xs text-text-sub-600">
                      Create a team member without sending an invitation.
                    </div>
                  </div>
                  <Radio.Item value="manual" />
                </LabelPrimitive.Root>
              </Radio.Group>
            </div>
          )}

          {/* Show wizard when mode is selected - Replaces the mode selection */}
          {mode && isWizardActive && (
            <InlineWizard
              key={mode}
              mode={mode}
              initialData={formData}
              onFieldChange={handleFormDataChange}
              onSubmit={handleWizardSubmit}
              onCancel={handleWizardCancel}
              isSaving={isSaving}
            />
          )}

          {/* Show added team members - Only show when we have members and no active wizard */}
          {onboardingData.careTeam.primaryCaregivers.length > 0 && !isWizardActive && (
            <div className="border-t border-stroke-soft-200 pt-6">
              <div className="space-y-3">
                <div className="text-label-sm font-medium">Added Team Members</div>
                {onboardingData.careTeam.primaryCaregivers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-stroke-soft-200 p-3">
                    <div>
                      <div className="text-label-sm">{member.name}</div>
                      <div className="text-paragraph-xs text-text-sub-600">{member.role}</div>
                    </div>
                    <div className="text-paragraph-xs text-text-sub-600 capitalize">
                      {member.category}
                    </div>
                  </div>
                ))}
                
                {/* Add another team member button */}
                <div className="pt-4">
                  <Button.Root
                    variant="neutral"
                    mode="stroke"
                    onClick={() => {
                      setMode(null);
                      setIsWizardActive(false);
                    }}
                    className="w-full"
                  >
                    <RiUserAddLine className="size-4" />
                    Add Another Team Member
                  </Button.Root>
                </div>
              </div>
            </div>
          )}

          {/* Navigation - Only show when not in wizard mode */}
          {!isWizardActive && (
            <div className='mt-8 flex justify-between'>
              <Button.Root 
                variant='neutral' 
                mode='ghost'
                size='medium'
                onClick={prevStep}
              >
                ← Back
              </Button.Root>
              <div className="flex gap-3">
                <Button.Root 
                  variant='secondary' 
                  size='medium'
                  onClick={nextStep}
                  onKeyDown={(e) => handleKeyDown(e, nextStep)}
                >
                  Skip
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
          )}
        </div>
      </div>
    </div>
  );
}