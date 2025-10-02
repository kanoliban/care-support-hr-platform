/**
 * CareSupport Types
 * 
 * Core type definitions for care coordination that mirror the
 * existing CareSupport OS types but adapted for the HR template
 * transformation.
 */

// ============================================================================
// CORE CARE COORDINATION TYPES
// ============================================================================

export interface CareRecipient {
  id: string;
  name: string;
  primaryCoordinator: string;
  backupCoordinator?: string;
  careNeeds: CareNeed[];
  preferences: CarePreferences;
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
  location: {
    address: string;
    coordinates?: { lat: number; lng: number; };
  };
}

export interface CareNeed {
  id: string;
  category: 'personal_care' | 'medical' | 'household' | 'transportation' | 'companionship' | 'cognitive_care';
  description: string;
  requiredSkills: string[];
  frequency: 'daily' | 'weekly' | 'as_needed';
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface CarePreferences {
  preferredCaregivers?: string[];
  avoidCaregivers?: string[];
  routinePreferences: {
    morningRoutine?: string;
    eveningRoutine?: string;
    medicationTimes?: string[];
  };
  communicationPreferences: {
    preferredContactMethod: 'phone' | 'text' | 'app' | 'email';
    updateFrequency: 'real_time' | 'daily_summary' | 'weekly_summary';
  };
}

export type TeamMemberRole = 
  | 'paid_caregiver'
  | 'family_caregiver'
  | 'backup_caregiver'
  | 'community_supporter'
  | 'emergency_contact';

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable' | 'unknown';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamMemberRole;
  contactInfo: {
    phone?: string;
    email?: string;
    preferredContact: 'phone' | 'text' | 'email';
  };
  regularShifts: RegularShift[];
  currentAvailability: AvailabilityStatus;
  blockedDates: string[];
  lastAvailabilityUpdate: string;
  skills: CareSkill[];
  certifications: Certification[];
  canDo: CareNeed['category'][];
  relationshipToCareRecipient: string;
  trustLevel: 'high' | 'medium' | 'new';
  reliability: {
    showUpRate: number;
    onTimeRate: number;
    lastMinuteCancellations: number;
  };
  sourceAgency?: string;
  hourlyRate?: number;
  paymentMethod?: 'agency' | 'direct' | 'volunteer';
}

export interface RegularShift {
  id: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  recurrencePattern: 'none' | 'weekly' | 'biweekly' | 'monthly';
  effectiveDate: string;
  expirationDate?: string;
  isActive: boolean;
}

export interface CareSkill {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced';
  verifiedBy?: string;
  lastUsed?: string;
}

export interface Certification {
  type: string;
  number: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export type CoverageStatus = 'covered' | 'confirmed' | 'tentative' | 'gap' | 'at_risk';

export interface CoverageWindow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  requiredCareTypes: CareNeed['category'][];
  status: CoverageStatus;
  assignedTeamMember?: string;
  backupOptions: string[];
  lastStatusUpdate: string;
}

export interface CoverageGap {
  id: string;
  coverageWindowId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: GapReason;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  backupRequestsSent: BackupRequest[];
  resolutionStatus: 'unresolved' | 'pending_response' | 'resolved';
  resolvedBy?: string;
  resolvedAt?: string;
}

export type GapReason = 
  | 'caregiver_unavailable'
  | 'caregiver_sick'
  | 'caregiver_no_show'
  | 'schedule_change'
  | 'emergency'
  | 'planned_absence';

export interface BackupRequest {
  id: string;
  gapId: string;
  teamMemberId: string;
  requestedAt: string;
  method: 'app_notification' | 'sms' | 'phone_call' | 'email';
  status: 'sent' | 'seen' | 'accepted' | 'declined' | 'expired';
  responseAt?: string;
  responseMessage?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
  canMakeMedicalDecisions: boolean;
}

export interface MedicalInfo {
  medications: Medication[];
  medicalConditions: string[];
  allergies: string[];
  emergencyMedicalInfo: string;
  preferredHospital?: string;
  primaryPhysician: {
    name: string;
    phone: string;
    address?: string;
  };
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  scheduledTimes: string[];
  instructions: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface NetworkHealthMetrics {
  coverageScore: number;
  gapMinutesPerWeek: number;
  teamUtilization: number;
  confirmationRate: number;
  reliabilityScore: number;
  coordinatorBurden: number;
  trends: {
    period: 'week' | 'month' | 'quarter';
    coverageImprovement: number;
    gapReduction: number;
    teamGrowth: number;
  };
}

export interface CareCoordinationContext {
  careRecipient: CareRecipient;
  careTeam: TeamMember[];
  currentCoverage: CoverageWindow[];
  activeShifts: any[];
  coverageGaps: CoverageGap[];
  networkHealth: NetworkHealthMetrics;
  quickActions: {
    findCoverage: (gapId: string) => Promise<TeamMember[]>;
    sendUpdate: (message: string, recipients: string[]) => Promise<void>;
    confirmShift: (shiftId: string) => Promise<void>;
    reportGap: (windowId: string, reason: GapReason) => Promise<CoverageGap>;
  };
}
