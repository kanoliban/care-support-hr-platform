import { z } from 'zod';

// ============================================================================
// CARE RECIPIENT TYPES (Single Focus)
// ============================================================================

export interface CareRecipient {
  id: string;
  name: string;
  primaryCoordinator: string;  // David, Elena, etc.
  backupCoordinator?: string;  // Elena as backup, etc.
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
  category: 'personal_care' | 'medical' | 'household' | 'transportation' | 'companionship';
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

// ============================================================================
// CARE TEAM TYPES (David's Network)
// ============================================================================

export type TeamMemberRole = 
  | 'paid_caregiver'        // Jim, Jennifer, Sarah, Ella, Olena
  | 'family_caregiver'      // Elena, Sarah
  | 'backup_caregiver'      // Lucy, Grace, Kathleen, Annie
  | 'community_supporter'   // Uncle Jim, Dan
  | 'emergency_contact';    // For crisis situations

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
  
  // Availability & Scheduling
  regularShifts: RegularShift[];
  currentAvailability: AvailabilityStatus;
  blockedDates: string[];
  lastAvailabilityUpdate: string;
  
  // Skills & Capabilities
  skills: CareSkill[];
  certifications: Certification[];
  canDo: CareNeed['category'][];
  
  // Relationship & Context
  relationshipToCareRecipient: string; // "registered nurse", "daughter", "neighbor", etc.
  trustLevel: 'high' | 'medium' | 'new';
  reliability: {
    showUpRate: number;          // 95% show up rate
    onTimeRate: number;          // 90% on time rate
    lastMinuteCancellations: number;
  };
  
  // Integration (Agency/Platform)
  sourceAgency?: string;       // "Home Health Plus", "independent", etc.
  hourlyRate?: number;
  paymentMethod?: 'agency' | 'direct' | 'volunteer';
}

export interface RegularShift {
  id: string;
  daysOfWeek: number[];        // [1,2] = Monday, Tuesday
  startTime: string;           // "20:00"
  endTime: string;             // "08:00" next day
  recurrencePattern: 'weekly' | 'biweekly' | 'monthly';
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

// ============================================================================
// SHIFT & COVERAGE TYPES (24/7 Focus)
// ============================================================================

export type CoverageStatus = 'covered' | 'confirmed' | 'tentative' | 'gap' | 'at_risk';

export interface CoverageWindow {
  id: string;
  date: string;               // "2024-08-29"
  startTime: string;          // "08:00"
  endTime: string;            // "20:00"
  requiredCareTypes: CareNeed['category'][];
  status: CoverageStatus;
  assignedTeamMember?: string;
  backupOptions: string[];    // TeamMember IDs who could cover
  lastStatusUpdate: string;
}

export interface Shift {
  id: string;
  coverageWindowId: string;
  teamMemberId: string;
  date: string;
  startTime: string;
  endTime: string;
  
  // Shift Status
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  confirmationStatus: 'pending' | 'confirmed' | 'declined';
  confirmationDate?: string;
  
  // Shift Details
  plannedActivities: PlannedActivity[];
  actualActivities?: CompletedActivity[];
  handoffNotes?: HandoffNote[];
  
  // Coverage Context
  isRegularShift: boolean;
  isBackupCovering: boolean;
  originalAssignee?: string;   // If backup is covering
  
  // Quality & Compliance
  completionScore?: number;    // 0-100 how well shift objectives were met
  incidentReports?: IncidentReport[];
}

export interface PlannedActivity {
  id: string;
  careNeedId: string;
  scheduledTime?: string;      // "14:00" or "after_lunch"
  description: string;
  priority: 'must_do' | 'should_do' | 'nice_to_do';
  estimatedDuration?: number;  // minutes
}

export interface CompletedActivity {
  id: string;
  plannedActivityId: string;
  actualTime: string;
  completionStatus: 'completed' | 'partial' | 'skipped' | 'rescheduled';
  notes?: string;
  completedBy: string;         // TeamMember ID
}

export interface HandoffNote {
  id: string;
  fromTeamMember: string;
  toTeamMember: string;
  timestamp: string;
  category: 'routine_update' | 'medical_concern' | 'behavioral_note' | 'schedule_change';
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  acknowledged: boolean;
  acknowledgedAt?: string;
}

// ============================================================================
// COVERAGE INTELLIGENCE TYPES (Gap Detection & Resolution)
// ============================================================================

export interface CoverageGap {
  id: string;
  coverageWindowId: string;
  date: string;
  startTime: string;
  endTime: string;
  
  // Gap Context
  reason: GapReason;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  
  // Resolution Efforts
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

// ============================================================================
// MEDICAL & SAFETY TYPES
// ============================================================================

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
  frequency: string;           // "twice daily", "as needed", etc.
  scheduledTimes: string[];    // ["08:00", "20:00"]
  instructions: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;            // 1 = primary, 2 = secondary, etc.
  canMakeMedicalDecisions: boolean;
}

export interface IncidentReport {
  id: string;
  shiftId: string;
  reportedBy: string;
  incidentTime: string;
  type: 'medical' | 'safety' | 'behavioral' | 'equipment' | 'other';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  actionsTaken: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  reportedToFamily: boolean;
  reportedToPhysician?: boolean;
}

// ============================================================================
// NETWORK HEALTH & ANALYTICS TYPES
// ============================================================================

export interface NetworkHealthMetrics {
  coverageScore: number;           // 0-100, overall coverage reliability
  gapMinutesPerWeek: number;       // Average uncovered minutes per week
  teamUtilization: number;         // 0-100, how well team capacity is used
  confirmationRate: number;        // % of shifts confirmed 24h in advance
  reliabilityScore: number;        // Team consistency and show-up rate
  coordinatorBurden: number;       // Hours spent on coordination per week
  
  trends: {
    period: 'week' | 'month' | 'quarter';
    coverageImprovement: number;   // +/- change
    gapReduction: number;          // +/- change  
    teamGrowth: number;            // +/- team members
  };
}

// ============================================================================
// CARE COORDINATION CONTEXT
// ============================================================================

export interface CareCoordinationContext {
  careRecipient: CareRecipient;
  careTeam: TeamMember[];
  currentCoverage: CoverageWindow[];
  activeShifts: Shift[];
  coverageGaps: CoverageGap[];
  networkHealth: NetworkHealthMetrics;
  
  // Quick Actions
  quickActions: {
    findCoverage: (gapId: string) => Promise<TeamMember[]>;
    sendUpdate: (message: string, recipients: string[]) => Promise<void>;
    confirmShift: (shiftId: string) => Promise<void>;
    reportGap: (windowId: string, reason: GapReason) => Promise<CoverageGap>;
  };
}