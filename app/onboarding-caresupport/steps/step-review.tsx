'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { cn } from '@/utils/cn';

import { RiCheckboxCircleLine, RiUserLine, RiHeartLine, RiTeamLine, RiTimeLine, RiShieldCheckLine } from '@remixicon/react';



import { activeStepAtom, onboardingDataAtom, nextStepAtom, prevStepAtom } from './store';

const OnboardingStepReview = () => {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [onboardingData] = useAtom(onboardingDataAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);

  const handleComplete = () => {
    // Here you would typically save the onboarding data to your backend
    console.log('Onboarding completed with data:', onboardingData);
    
    // Redirect to dashboard
    window.location.href = '/';
  };

  const handleEdit = (stepId: string) => {
    // Map section IDs to step numbers based on team setup type
    const isJoinTeam = onboardingData.teamSetupType === 'join-team';
    
    const stepMap: { [key: string]: number } = isJoinTeam ? {
      'account': 0,
      'team': 2,      // Care Team moved from 3 to 2
      'scheduling': 3, // Scheduling moved from 4 to 3
      'permissions': 4, // Permissions moved from 5 to 4
    } : {
      'account': 0,
      'recipient': 2,
      'team': 3,
      'scheduling': 4,
      'permissions': 5,
    };
    
    const targetStep = stepMap[stepId];
    if (targetStep !== undefined) {
      setActiveStep(targetStep);
    }
  };

  const steps = [
    {
      value: "account",
      title: "Account Setup",
      description: "Relationship to care and timezone preferences",
      icon: RiUserLine,
      fields: [
        { label: 'Relationship to Care', value: onboardingData.relationshipToCare?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not selected' },
        { label: 'Timezone', value: onboardingData.timezone || 'Not selected' },
      ],
    },
    {
      value: "recipient",
      title: "Care Recipient",
      description: "Details about the person receiving care",
      icon: RiHeartLine,
      fields: [
        { label: 'Name', value: onboardingData.careRecipient?.name || 'Not provided' },
        { label: 'Age', value: onboardingData.careRecipient?.age || 'Not provided' },
        { label: 'Care Needs', value: onboardingData.careRecipient?.careNeeds?.join(', ') || 'Not specified' },
        { label: 'Medical Conditions', value: onboardingData.careRecipient?.medicalConditions?.join(', ') || 'None specified' },
      ],
    },
    {
      value: "team",
      title: "Care Team",
      description: "Team members and their roles",
      icon: RiTeamLine,
      fields: [
        { label: 'Team Members', value: `${onboardingData.careTeam?.caregivers?.length || 0} members` },
        { label: 'Categories', value: onboardingData.careTeam?.caregivers?.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'None' },
      ],
    },
    {
      value: "scheduling",
      title: "Scheduling",
      description: "Availability and care requirements",
      icon: RiTimeLine,
      fields: [
        { label: 'Care Requirements', value: onboardingData.scheduling?.careRequirements?.method || 'Not configured' },
        { label: 'Availability Method', value: onboardingData.scheduling?.availability?.method || 'Not configured' },
        { label: 'Recurring Pattern', value: onboardingData.scheduling?.availability?.recurringPattern || 'Not set' },
      ],
    },
    {
      value: "permissions",
      title: "Permissions & Privacy",
      description: "Access levels and privacy controls",
      icon: RiShieldCheckLine,
      fields: [
        { label: 'Default Role', value: onboardingData.permissions?.teamPermissions?.defaultRole || 'Not set' },
        { label: 'Data Sharing', value: Object.values(onboardingData.permissions?.dataSharing || {}).filter(Boolean).length + ' enabled' },
        { label: 'Privacy Settings', value: Object.values(onboardingData.permissions?.privacySettings || {}).filter(Boolean).length + ' enabled' },
      ],
    },
  ];

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h4 lg:text-title-h3 mb-2'>
          Review Your Setup
        </h1>
        <p className='text-paragraph-md text-text-sub-600'>
          Please review all your information before completing the onboarding process.
        </p>
      </div>

      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 lg:p-8 shadow-regular-xs'>
        <div className='space-y-8'>
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.value} className='space-y-4'>
                <div className='flex items-center justify-between border-b border-stroke-soft-200 pb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='flex size-8 items-center justify-center rounded-full bg-primary-alpha-10'>
                      <IconComponent className='size-4 text-primary-base' />
                    </div>
                    <div>
                      <h3 className='text-label-md font-medium text-text-strong-950'>
                        {step.title}
                      </h3>
                      <p className='text-paragraph-xs text-text-sub-600'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(step.value)}
                    className='text-paragraph-sm text-primary-base hover:text-primary-darker transition-colors'
                  >
                    Edit
                  </button>
                </div>
                
                <div className='grid gap-4 md:grid-cols-2'>
                  {step.fields.map((field, index) => (
                    <div key={index} className='flex flex-col space-y-1'>
                      <span className='text-paragraph-xs font-medium text-text-sub-600 uppercase tracking-wide'>
                        {field.label}
                      </span>
                      <span className='text-paragraph-sm text-text-strong-950 bg-bg-weak-50 px-3 py-2 rounded-lg border border-stroke-soft-200'>
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className='flex justify-between pt-6 border-t border-stroke-soft-200'>
          <button
            onClick={prevStep}
            className='inline-flex items-center gap-2 px-4 py-3 bg-bg-weak-100 text-text-sub-600 rounded-lg hover:bg-bg-weak-200 transition-colors text-label-md font-medium'
          >
            ← Back
          </button>
          <button
            onClick={handleComplete}
            className='inline-flex items-center gap-2 px-6 py-3 bg-primary-base text-static-white rounded-lg hover:bg-primary-darker transition-colors text-label-md font-medium'
          >
            <RiCheckboxCircleLine className='size-4' />
            Complete Setup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepReview;
