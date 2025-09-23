'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { 
  RiGlobeLine, 
  RiUserHeartLine, 
  RiHospitalLine, 
  RiTeamLine, 
  RiHeartLine, 
  RiBuilding4Line,
  RiCalendarCheckLine,
  RiAddLine,
  RiLoginBoxLine,
  RiUserLine,
  RiKeyLine
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Button from '@/components/ui/button';

import { 
  activeStepAtom, 
  nextStepAtom, 
  onboardingDataAtom,
  stepValidationAtom,
  canProceedAtom 
} from './store';
import { RELATIONSHIP_TO_CARE_OPTIONS } from '../types/onboarding';

// Team setup options
const TEAM_SETUP_OPTIONS = [
  {
    value: 'create-team',
    label: 'Create New Team',
    description: 'Set up care coordination for someone you care for',
    icon: 'RiAddLine'
  },
  {
    value: 'join-team',
    label: 'Join Existing Team',
    description: "You've been invited to help with someone's care",
    icon: 'RiLoginBoxLine'
  }
];

export default function OnboardingStepAccount() {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);

  // Progressive disclosure state
  const [currentPart, setCurrentPart] = React.useState<'team-setup' | 'team-details' | 'relationship'>('team-setup');

  const [localData, setLocalData] = React.useState({
    teamSetupType: onboardingData.teamSetupType || '',
    careRecipientName: onboardingData.careRecipientName || '',
    invitationCode: onboardingData.invitationCode || '',
    relationshipToCare: onboardingData.relationshipToCare,
    organizationName: onboardingData.organizationName || '',
    timeZone: onboardingData.timeZone,
  });

  // Auto-detect timezone
  React.useEffect(() => {
    setLocalData(prev => ({
      ...prev,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }));
  }, []);

  // Global Enter key support
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        
        // Handle different parts of Step 1
        if (currentPart === 'team-setup' && localData.teamSetupType) {
          setCurrentPart('team-details');
        } else if (currentPart === 'team-details') {
          if (localData.teamSetupType === 'create-team' && localData.careRecipientName.trim()) {
            setCurrentPart('relationship');
          } else if (localData.teamSetupType === 'join-team' && localData.invitationCode.trim()) {
            setCurrentPart('relationship');
          }
        } else if (currentPart === 'relationship' && canProceed) {
          nextStep();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentPart, localData, canProceed, nextStep]);

  // Update validation when data changes
  React.useEffect(() => {
    let isValid = false;
    
    if (currentPart === 'team-setup') {
      isValid = !!localData.teamSetupType;
    } else if (currentPart === 'team-details') {
      if (localData.teamSetupType === 'create-team') {
        isValid = !!localData.careRecipientName.trim();
      } else {
        isValid = !!localData.invitationCode.trim();
      }
    } else {
      isValid = localData.relationshipToCare && localData.timeZone && 
        (localData.relationshipToCare !== 'organization' || localData.organizationName.trim());
    }
    
    setStepValidation(prev => ({
      ...prev,
      [activeStep]: isValid,
    }));

    // Update global data
    setOnboardingData(prev => ({
      ...prev,
      teamSetupType: localData.teamSetupType,
      careRecipientName: localData.careRecipientName,
      invitationCode: localData.invitationCode,
      relationshipToCare: localData.relationshipToCare,
      organizationName: localData.organizationName,
      timeZone: localData.timeZone,
    }));
  }, [localData, currentPart, activeStep, setStepValidation, setOnboardingData]);

  const handleTeamSetupChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      teamSetupType: value,
    }));
  };

  const handleCareRecipientNameChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      careRecipientName: value,
    }));
  };

  const handleInvitationCodeChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      invitationCode: value,
    }));
  };

  const handleRelationshipToCareChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      relationshipToCare: value as 'care-recipient' | 'family-member' | 'friend-neighbor' | 'coordinator' | 'professional-caregiver' | 'organization',
      organizationName: value === 'organization' ? prev.organizationName : '',
    }));
  };

  const handleOrganizationNameChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      organizationName: value,
    }));
  };

  const handleTimeZoneChange = (value: string) => {
    setLocalData(prev => ({
      ...prev,
      timeZone: value,
    }));
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleContinueToTeamDetails = () => {
    setCurrentPart('team-details');
  };

  const handleContinueToRelationship = () => {
    setCurrentPart('relationship');
  };

  const handleBackToTeamSetup = () => {
    setCurrentPart('team-setup');
  };

  const handleBackToTeamDetails = () => {
    setCurrentPart('team-details');
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      // Team setup icons
      case 'RiAddLine':
        return <RiAddLine className='size-5' />;
      case 'RiLoginBoxLine':
        return <RiLoginBoxLine className='size-5' />;
      // Team details icons
      case 'RiUserLine':
        return <RiUserLine className='size-5' />;
      case 'RiKeyLine':
        return <RiKeyLine className='size-5' />;
      // Relationship icons
      case 'RiUserHeartLine':
        return <RiUserHeartLine className='size-5' />;
      case 'RiHospitalLine':
        return <RiHospitalLine className='size-5' />;
      case 'RiTeamLine':
        return <RiTeamLine className='size-5' />;
      case 'RiHeartLine':
        return <RiHeartLine className='size-5' />;
      case 'RiBuilding4Line':
        return <RiBuilding4Line className='size-5' />;
      case 'RiCalendarCheckLine':
        return <RiCalendarCheckLine className='size-5' />;
      default:
        return <RiUserHeartLine className='size-5' />;
    }
  };


  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          {currentPart === 'team-setup' 
            ? 'How would you like to get started?' 
            : currentPart === 'team-details'
            ? (localData.teamSetupType === 'create-team' 
                ? 'Who are you setting up care for?' 
                : 'Enter your invitation details')
            : 'What best describes your relationship to the care?'
          }
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          {currentPart === 'team-setup' 
            ? "Choose how you'd like to set up your CareSupport experience."
            : currentPart === 'team-details'
            ? (localData.teamSetupType === 'create-team' 
                ? "Let us know who you're coordinating care for."
                : 'Enter the invitation code you received to join the care team.')
            : 'This helps us understand your role in the care coordination.'
          }
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        {currentPart === 'team-setup' ? (
          // Team Setup Part
          <div className='space-y-6'>
            <div>
              <Label.Root className='text-paragraph-md font-medium'>
                Select your setup option <Label.Asterisk />
              </Label.Root>
              <p className='text-paragraph-sm text-text-sub-600 mb-4'>
                This determines how your CareSupport journey begins.
              </p>
              
              <div className='grid gap-4 md:grid-cols-2'>
                {TEAM_SETUP_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTeamSetupChange(option.value)}
                    className={cn(
                      'relative flex flex-col items-center gap-4 rounded-lg border-2 p-6 text-left transition-all',
                      'hover:border-purple-300 hover:bg-purple-50',
                      localData.teamSetupType === option.value
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-stroke-soft-200 bg-bg-white-0'
                    )}
                  >
                    <div className={cn(
                      'flex size-12 items-center justify-center rounded-full',
                      localData.teamSetupType === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-bg-soft-200 text-text-sub-600'
                    )}>
                      {getIcon(option.icon)}
                    </div>
                    <div className='text-center'>
                      <div className='text-paragraph-md font-medium mb-2'>
                        {option.label}
                      </div>
                      <div className='text-paragraph-sm text-text-sub-600'>
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className='mt-8 flex justify-end'>
              <Button.Root 
                variant='primary' 
                size='medium'
                onClick={handleContinueToTeamDetails}
                onKeyDown={(e) => handleKeyDown(e, handleContinueToTeamDetails)}
                disabled={!localData.teamSetupType}
              >
                Continue
              </Button.Root>
            </div>
          </div>
        ) : currentPart === 'team-details' ? (
          // Team Details Part
          <div className='space-y-6'>

            {localData.teamSetupType === 'create-team' ? (
              // Create Team - Care Recipient Name
              <div>
                <Label.Root htmlFor='careRecipientName'>
                  Care Recipient's Name <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiUserLine} />
                    <Input.Input
                      id='careRecipientName'
                      type='text'
                      placeholder="Enter the person's name"
                      value={localData.careRecipientName}
                      onChange={(e) => handleCareRecipientNameChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (localData.teamSetupType === 'create-team' && localData.careRecipientName.trim()) {
                            setCurrentPart('relationship');
                          }
                        }
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
                <p className='text-paragraph-xs text-text-sub-600 mt-1'>
                  This is the person you'll be coordinating care for.
                </p>
              </div>
            ) : (
              // Join Team - Invitation Code
              <div>
                <Label.Root htmlFor='invitationCode'>
                  Invitation Code <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiKeyLine} />
                    <Input.Input
                      id='invitationCode'
                      type='text'
                      placeholder='Enter your invitation code'
                      value={localData.invitationCode}
                      onChange={(e) => handleInvitationCodeChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (localData.teamSetupType === 'join-team' && localData.invitationCode.trim()) {
                            setCurrentPart('relationship');
                          }
                        }
                      }}
                    />
                  </Input.Wrapper>
                </Input.Root>
                <p className='text-paragraph-xs text-text-sub-600 mt-1'>
                  This code was provided in your invitation email or message.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className='mt-8 flex justify-between'>
              <Button.Root 
                variant='neutral' 
                mode='ghost'
                size='medium'
                onClick={handleBackToTeamSetup}
              >
                ← Back
              </Button.Root>
              <Button.Root 
                variant='primary' 
                size='medium'
                onClick={handleContinueToRelationship}
                onKeyDown={(e) => handleKeyDown(e, handleContinueToRelationship)}
                disabled={!((localData.teamSetupType === 'create-team' && localData.careRecipientName.trim()) || 
                         (localData.teamSetupType === 'join-team' && localData.invitationCode.trim()))}
              >
                Continue
              </Button.Root>
            </div>
          </div>
        ) : (
          // Relationship to Care Part
          <div className='space-y-6'>

            <div>
              <Label.Root className='text-paragraph-md font-medium'>
                Select your relationship <Label.Asterisk />
              </Label.Root>
              <p className='text-paragraph-sm text-text-sub-600 mb-4'>
                This helps us customize your CareSupport experience.
              </p>
              
              <div className='grid gap-3 md:grid-cols-2 lg:grid-cols-3'>
                {RELATIONSHIP_TO_CARE_OPTIONS.map((relationship) => (
                  <button
                    key={relationship.value}
                    onClick={() => handleRelationshipToCareChange(relationship.value)}
                    className={cn(
                      'relative flex flex-col items-center gap-3 rounded-lg border-2 p-4 text-left transition-all',
                      'hover:border-purple-300 hover:bg-purple-50',
                      localData.relationshipToCare === relationship.value
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                        : 'border-stroke-soft-200 bg-bg-white-0'
                    )}
                  >
                    <div className={cn(
                      'flex size-10 items-center justify-center rounded-full',
                      localData.relationshipToCare === relationship.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-bg-soft-200 text-text-sub-600'
                    )}>
                      {getIcon(relationship.icon)}
                    </div>
                    <div className='text-center'>
                      <div className='text-paragraph-sm font-medium'>
                        {relationship.label}
                      </div>
                      <div className='text-paragraph-xs text-text-sub-600'>
                        {relationship.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Name (for organizations) */}
            {localData.relationshipToCare === 'organization' && (
              <div>
                <Label.Root htmlFor='organizationName'>
                  Organization Name <Label.Asterisk />
                </Label.Root>
                <Input.Root className='mt-1'>
                  <Input.Wrapper>
                    <Input.Icon as={RiBuilding4Line} />
                    <Input.Input
                      id='organizationName'
                      type='text'
                      placeholder='Enter your organization name'
                      value={localData.organizationName}
                      onChange={(e) => handleOrganizationNameChange(e.target.value)}
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
            )}

            {/* Timezone */}
            <div>
              <Label.Root htmlFor='timezone'>
                Timezone <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={localData.timeZone}
                onValueChange={handleTimeZoneChange}
              >
                <Select.Trigger className='mt-1'>
                  <Select.Value placeholder='Select your timezone' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='America/New_York'>Eastern Time (ET)</Select.Item>
                  <Select.Item value='America/Chicago'>Central Time (CT)</Select.Item>
                  <Select.Item value='America/Denver'>Mountain Time (MT)</Select.Item>
                  <Select.Item value='America/Los_Angeles'>Pacific Time (PT)</Select.Item>
                  <Select.Item value='America/Anchorage'>Alaska Time (AKT)</Select.Item>
                  <Select.Item value='Pacific/Honolulu'>Hawaii Time (HST)</Select.Item>
                </Select.Content>
              </Select.Root>
              <p className='text-paragraph-xs text-text-sub-600 mt-1'>
                This ensures all schedules and notifications are shown in your local time.
              </p>
            </div>

            {/* Navigation */}
            <div className='mt-8 flex justify-between'>
              <Button.Root 
                variant='neutral' 
                mode='ghost'
                size='medium'
                onClick={handleBackToTeamDetails}
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
        )}
      </div>
    </div>
  );
}
