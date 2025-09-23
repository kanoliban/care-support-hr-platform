export interface OnboardingData {
  // Step 1: Account Setup
  teamSetupType?: string;
  careRecipientName?: string;
  invitationCode?: string;
  relationshipToCare?: string;
  organizationName?: string;
  timezone?: string;
  
  // Step 2: User Profile
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  
  // Step 3: Care Recipient
  careRecipient?: {
    name?: string;
    age?: string;
    careNeeds?: string[];
    medicalConditions?: string[];
  };
  
  // Step 4: Care Team
  careTeam?: {
    caregivers?: Caregiver[];
  };
  
  // Step 5: Scheduling
  scheduling?: {
    careRequirements?: {
      method?: string;
    };
    availability?: {
      method?: string;
      days?: string[];
      startTime?: string;
      endTime?: string;
      recurringPattern?: string;
    };
  };
  
  // Step 6: Permissions
  permissions?: {
    teamPermissions?: {
      defaultRole?: string;
    };
    dataSharing?: {
      family?: boolean;
      healthcare?: boolean;
      emergency?: boolean;
    };
    privacySettings?: {
      twoFactorAuth?: boolean;
      sessionTimeout?: boolean;
      auditLogging?: boolean;
    };
  };
}

export interface Caregiver {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  category: 'family-member' | 'professional-caregiver' | 'community-supporter' | 'coordinator' | 'care-recipient' | 'organization';
  role: 'member' | 'admin' | 'viewer';
  permissions?: {
    canManageTeam?: boolean;
    canViewSensitive?: boolean;
    canEditSchedule?: boolean;
    canViewReports?: boolean;
  };
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'bi-weekly' | 'monthly';
  days?: string[];
  interval?: number;
  endDate?: string;
  occurrences?: number;
}

export interface TimeBlock {
  day: string;
  startTime: string;
  endTime: string;
  recurringPattern?: RecurringPattern;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StepValidation {
  [key: number]: ValidationResult;
}

export type OnboardingStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StepConfig {
  id: OnboardingStep;
  title: string;
  description: string;
  isRequired: boolean;
  isCompleted: boolean;
  validation?: (data: OnboardingData) => ValidationResult;
}
