import { z } from 'zod';

export type ShiftStatus = 'Scheduled' | 'Pending' | 'Blocked';

export type ComplianceCheck = {
  control: string;
  status: 'Pass' | 'Fail' | 'Warning';
  message: string;
};

export type ComplianceStatus = {
  isCompliant: boolean;
  checks: ComplianceCheck[];
};

export const RecurringPatternSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  interval: z.number().min(1).optional(),
  endDate: z.string().optional(),
  exceptions: z.array(z.string()).optional()
});

export type RecurringPattern = z.infer<typeof RecurringPatternSchema>;

export type Shift = {
  id: string;
  clientId: string;
  clientName: string;
  caregiverId: string;
  caregiverName: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  type: 'Hourly' | 'Live-in';
  complianceStatus: ComplianceStatus;
  planOfCareTasks: string[];
  recurringPattern?: RecurringPattern;
  seriesId?: string;
};

export type Client = {
  id: string;
  name: string;
  program: string;
  requiredCredentials: string[];
  planOfCareTasks: string[];
  preferredCaregivers?: string[];
  locationConstraints?: {
    latitude: number;
    longitude: number;
    maxDistance: number;
  };
};

export type Caregiver = {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Blocked';
  credentials: {
    type: string;
    status: 'Valid' | 'Expiring Soon' | 'Expired';
    expirationDate: string;
  }[];
  availability?: {
    weeklyHours: number;
    preferredHours?: {
      start: string;
      end: string;
    }[];
    blockedDates?: string[];
    maxShiftsPerWeek?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
};

export type MatchingCriteria = {
  requiredCredentials: string[];
  preferredCaregivers?: string[];
  locationConstraints?: {
    latitude: number;
    longitude: number;
    maxDistance: number;
  };
  shiftTiming: {
    start: string;
    end: string;
  };
};

export type TimelineItemType = 
  // Common types
  | 'shift'
  | 'review'
  // Client-specific types
  | 'medication'
  | 'family_check_in'
  // Caregiver-specific types
  | 'training'
  | 'credential';

export type TimelineCategory = 
  // Common categories
  | 'care'
  | 'health'
  // Client-specific categories
  | 'social'
  // Caregiver-specific categories
  | 'training'
  | 'compliance';

export type PersonalTimelineItem = {
  id: string;
  type: TimelineItemType;
  startTime: string;
  endTime?: string;
  title: string;
  description?: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  category: TimelineCategory;
  relatedShiftId?: string;
  metadata?: {
    caregiverName?: string;
    clientName?: string;
    medicationDetails?: {
      name: string;
      dosage: string;
      instructions: string;
    };
    reviewType?: 'care_plan' | 'satisfaction' | 'health';
    trainingDetails?: {
      type: string;
      provider: string;
      credits?: number;
    };
    credentialDetails?: {
      type: string;
      identifier: string;
      expirationDate: string;
      renewalRequired: boolean;
    };
  };
};