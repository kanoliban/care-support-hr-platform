import { atom } from 'jotai';

const MIN_STEP = 0;

export const activeStepAtom = atom(0);

export const prevStepAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => {
    const currentStep = get(activeStepAtom);
    set(activeStepAtom, Math.max(currentStep - 1, MIN_STEP));
  },
);

export const nextStepAtom = atom(
  (get) => get(activeStepAtom),
  (get, set) => {
    const currentStep = get(activeStepAtom);
    const onboardingData = get(onboardingDataAtom);
    
    // Determine max step based on team setup type
    const maxStep = onboardingData.teamSetupType === 'join-team' ? 5 : 6;
    
    set(activeStepAtom, Math.min(currentStep + 1, maxStep));
  },
);

// CareSupport-specific onboarding data atoms
export const onboardingDataAtom = atom({
  // Step 1: Account Setup
      teamSetupType: '' as 'create-team' | 'join-team',
  careRecipientName: '',
  invitationCode: '',
  relationshipToCare: 'family-member' as 'care-recipient' | 'family-member' | 'friend-neighbor' | 'coordinator' | 'professional-caregiver' | 'organization',
  organizationName: '',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  
  // Step 2: Care Recipient
  careRecipient: {
    name: '',
    dateOfBirth: '',
    medicalConditions: [] as string[],
    medications: [] as string[],
    emergencyContacts: [] as Array<{
      name: string;
      relationship: string;
      phone: string;
      email: string;
    }>,
    specialInstructions: '',
  },
  
  // Step 3: Care Team
  careTeam: {
    careRecipient: {
      name: '',
      email: '',
      phone: '',
      role: 'Care Recipient',
    },
    primaryCaregivers: [] as Array<{
      name: string;
      email: string;
      phone: string;
      category: 'family' | 'professional' | 'volunteer' | 'organization';
      role: string;
      availability: string;
    }>,
    onCallCaregivers: [] as Array<{
      name: string;
      email: string;
      phone: string;
      category: 'family' | 'professional' | 'volunteer' | 'organization';
      role: string;
      availability: string;
    }>,
    healthcareProviders: [] as Array<{
      name: string;
      specialty: string;
      phone: string;
      email: string;
    }>,
  },
  
          // Step 4: Scheduling
          scheduling: {
            method: '' as string,
            careRequirements: undefined as {
              type: string;
              days: string[];
              timeBlocks: string[];
            } | undefined,
            availability: undefined as {
              method: string;
              calendarSync: string;
            } | undefined,
            preferredSchedule: [] as Array<{
              day: string;
              startTime: string;
              endTime: string;
              type: string;
            }>,
            coverageRequirements: {
              minCaregivers: 1,
              maxCaregivers: 3,
              overnightCare: false,
              weekendCare: true,
            },
            notificationPreferences: {
              email: true,
              sms: true,
              push: true,
              reminderTime: '15', // minutes before
            },
          },
  
  // Step 5: Permissions
  permissions: {
    teamPermissions: [] as Array<{
      role: string;
      canViewSchedule: boolean;
      canEditSchedule: boolean;
      canViewMedicalInfo: boolean;
      canEditMedicalInfo: boolean;
    }>,
    dataSharing: {
      shareWithFamily: true,
      shareWithHealthcare: true,
      shareWithCaregivers: false,
    },
    privacySettings: {
      anonymizeData: false,
      dataRetention: '2', // years
      backupEnabled: true,
    },
  },
});

// Validation atoms for each step
export const stepValidationAtom = atom({
  0: false, // Account step
  1: false, // Care recipient step
  2: false, // Care team step
  3: false, // Scheduling step
  4: false, // Permissions step
  5: false, // Summary step
});

// Check if current step can proceed
export const canProceedAtom = atom((get) => {
  const activeStep = get(activeStepAtom);
  const validation = get(stepValidationAtom);
  return validation[activeStep as keyof typeof validation] || false;
});
