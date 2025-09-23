// CareSupport Onboarding Data Models

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

export interface Caregiver {
  name: string;
  email: string;
  phone: string;
  category: 'family' | 'professional' | 'volunteer' | 'organization';
  role: string;
  availability?: string;
}

export interface HealthcareProvider {
  name: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface SchedulePreference {
  day: string;
  startTime: string;
  endTime: string;
  type: string;
}

export interface CoverageRequirement {
  minCaregivers: number;
  maxCaregivers: number;
  overnightCare: boolean;
  weekendCare: boolean;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  reminderTime: string; // minutes before
}

export interface Permission {
  role: string;
  canViewSchedule: boolean;
  canEditSchedule: boolean;
  canViewMedicalInfo: boolean;
  canEditMedicalInfo: boolean;
}

export interface DataSharingSettings {
  shareWithFamily: boolean;
  shareWithHealthcare: boolean;
  shareWithCaregivers: boolean;
}

export interface PrivacySettings {
  anonymizeData: boolean;
  dataRetention: string; // years
  backupEnabled: boolean;
}

export interface CareRecipient {
  name: string;
  dateOfBirth: string;
  medicalConditions: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  specialInstructions: string;
}

export interface CareTeam {
  careRecipient: {
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  primaryCaregivers: Caregiver[];
  onCallCaregivers: Caregiver[];
  healthcareProviders: HealthcareProvider[];
}

export interface Scheduling {
  preferredSchedule: SchedulePreference[];
  coverageRequirements: CoverageRequirement;
  notificationPreferences: NotificationSettings;
}

export interface Permissions {
  teamPermissions: Permission[];
  dataSharing: DataSharingSettings;
  privacySettings: PrivacySettings;
}

export interface OnboardingData {
  // Step 1: Relationship to Care
  relationshipToCare: 'care-recipient' | 'family-member' | 'friend-neighbor' | 'coordinator' | 'professional-caregiver' | 'organization';
  organizationName?: string;
  timeZone: string;
  
  // Step 2: Care Recipient
  careRecipient: CareRecipient;
  
  // Step 3: Care Team
  careTeam: CareTeam;
  
  // Step 4: Scheduling
  scheduling: Scheduling;
  
  // Step 5: Permissions
  permissions: Permissions;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  canProceed: boolean;
  validationErrors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  step: number;
}

export interface StepValidation {
  [key: number]: boolean;
}

// Relationship to care options
export const RELATIONSHIP_TO_CARE_OPTIONS = [
  {
    value: 'care-recipient',
    label: 'Care Recipient',
    description: 'I\'m receiving care and support',
    icon: 'RiHeartLine',
  },
  {
    value: 'family-member',
    label: 'Family Member',
    description: 'I\'m a family member or loved one',
    icon: 'RiUserHeartLine',
  },
  {
    value: 'friend-neighbor',
    label: 'Friend / Neighbor',
    description: 'I\'m a friend, neighbor, or volunteer',
    icon: 'RiTeamLine',
  },
  {
    value: 'coordinator',
    label: 'Coordinator',
    description: 'I\'m organizing care for someone',
    icon: 'RiCalendarCheckLine',
  },
  {
    value: 'professional-caregiver',
    label: 'Professional Caregiver',
    description: 'I provide professional care services',
    icon: 'RiHospitalLine',
  },
  {
    value: 'organization',
    label: 'Organization',
    description: 'I represent a care agency or organization',
    icon: 'RiBuilding4Line',
  },
] as const;

// Common medical conditions
export const COMMON_MEDICAL_CONDITIONS = [
  'Alzheimer\'s Disease',
  'Dementia',
  'Diabetes',
  'Heart Disease',
  'Stroke',
  'Parkinson\'s Disease',
  'Arthritis',
  'Cancer',
  'COPD',
  'High Blood Pressure',
  'Depression',
  'Anxiety',
  'Other',
] as const;

// Common medications
export const COMMON_MEDICATIONS = [
  'Insulin',
  'Blood Pressure Medication',
  'Heart Medication',
  'Pain Management',
  'Antidepressants',
  'Anti-anxiety Medication',
  'Blood Thinners',
  'Cholesterol Medication',
  'Diabetes Medication',
  'Other',
] as const;

// Team member categories
export const TEAM_MEMBER_CATEGORIES = [
  {
    value: 'family',
    label: 'Family Member',
    description: 'Family member providing care and support',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    value: 'professional',
    label: 'Professional Caregiver',
    description: 'Licensed or certified care professional',
    icon: '👩‍⚕️',
  },
  {
    value: 'volunteer',
    label: 'Volunteer',
    description: 'Volunteer providing care assistance',
    icon: '🤝',
  },
  {
    value: 'organization',
    label: 'Organization',
    description: 'Care agency or organization',
    icon: '🏥',
  },
] as const;

// Care roles
export const CARE_ROLES = [
  'Primary Caregiver',
  'Backup Caregiver',
  'Medical Assistant',
  'Companion',
  'Transportation Provider',
  'Meal Preparation',
  'Housekeeping',
  'Personal Care Assistant',
  'Registered Nurse',
  'Physical Therapist',
  'Other',
] as const;

// Days of week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

// Time slots
export const TIME_SLOTS = [
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
] as const;
