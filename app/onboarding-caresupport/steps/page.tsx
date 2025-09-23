'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useAtomValue } from 'jotai';

import { cn } from '@/utils/cn';

import OnboardingStepAccount from './step-account';
import OnboardingStepUserProfile from './step-user-profile';
import OnboardingStepCareRecipient from './step-care-recipient';
import OnboardingStepCareTeam from './step-care-team';
import OnboardingStepScheduling from './step-scheduling';
import OnboardingStepPermissions from './step-permissions';
import OnboardingStepReview from './step-review';
import OnboardingStepSummary from './step-summary';
import { activeStepAtom, onboardingDataAtom } from './store';

type StepComponents = {
  [key: number]: React.ComponentType;
};

// Define all possible steps
const allStepComponents: StepComponents = {
  0: OnboardingStepAccount,      // Account Setup
  1: OnboardingStepUserProfile,  // User Profile
  2: OnboardingStepCareRecipient, // Care Recipient (conditional)
  3: OnboardingStepCareTeam,     // Care Team
  4: OnboardingStepScheduling,   // Scheduling
  5: OnboardingStepPermissions,  // Permissions
  6: OnboardingStepReview,       // Review
};

// Function to get step components based on team setup type
const getStepComponents = (teamSetupType: string): StepComponents => {
  if (teamSetupType === 'join-team') {
    // Skip Care Recipient step (index 2) for existing teams
    return {
      0: OnboardingStepAccount,      // Account Setup
      1: OnboardingStepUserProfile,  // User Profile
      2: OnboardingStepCareTeam,     // Care Team (moved from 3 to 2)
      3: OnboardingStepScheduling,   // Scheduling (moved from 4 to 3)
      4: OnboardingStepPermissions,  // Permissions (moved from 5 to 4)
      5: OnboardingStepReview,       // Review (moved from 6 to 5)
    };
  } else {
    // Include all steps for new teams
    return allStepComponents;
  }
};

export default function CareSupportOnboardingStepsPage() {
  const activeStep = useAtomValue(activeStepAtom);
  const onboardingData = useAtomValue(onboardingDataAtom);
  
  // Get the appropriate step components based on team setup type
  const stepComponents = getStepComponents(onboardingData.teamSetupType);

  return (
    <TabsPrimitive.Root
      value={`${activeStep}`}
      className='flex justify-center py-6 lg:py-12'
    >
      {Object.values(stepComponents).map((Step, i) => (
        <TabsPrimitive.Content
          key={i}
          value={`${i}`}
          className={cn(
            'w-full outline-none focus:outline-none',
            // active
            'data-[state=active]:duration-500 data-[state=active]:ease-out data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-3',
          )}
        >
          <Step />
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
