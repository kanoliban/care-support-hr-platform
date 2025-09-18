import { 
  CareRecipient, 
  TeamMember, 
  CoverageWindow, 
  Shift, 
  CoverageGap,
  NetworkHealthMetrics,
  CareCoordinationContext 
} from '../types/CareCoordinationTypes';
import { robsCompleteTeam } from './RobsCompleteTeam';

// ============================================================================
// ROB'S CARE RECIPIENT PROFILE
// ============================================================================

export const robCareRecipient: CareRecipient = {
  id: 'rob-001',
  name: 'David Orwell',
  primaryCoordinator: 'David Orwell',      // Rob coordinates himself
  backupCoordinator: 'Elena Chen',        // Sister as backup
  careNeeds: [
    {
      id: 'need-001',
      category: 'personal_care',
      description: 'Transfer assistance, range of motion, dressing/undressing',
      requiredSkills: ['transfer_techniques', 'mobility_assistance'],
      frequency: 'daily',
      priority: 'high'
    },
    {
      id: 'need-002', 
      category: 'medical',
      description: 'Medication management, medical monitoring',
      requiredSkills: ['medication_administration', 'vital_signs'],
      frequency: 'daily',
      priority: 'high'
    },
    {
      id: 'need-003',
      category: 'household',
      description: 'Meal preparation, dishes, laundry, cleaning',
      requiredSkills: ['meal_prep', 'housekeeping'],
      frequency: 'daily',
      priority: 'medium'
    },
    {
      id: 'need-004',
      category: 'transportation',
      description: 'Medical appointments, errands, social activities',
      requiredSkills: ['safe_driving', 'wheelchair_transport'],
      frequency: 'weekly',
      priority: 'medium'
    }
  ],
  preferences: {
    preferredCaregivers: ['jim-nelson', 'jennifer-pca', 'sarah-pca'],
    routinePreferences: {
      morningRoutine: 'Early riser, prefers to be up by 7am for morning care routine',
      eveningRoutine: 'Evening medications at 8pm, prefer quiet environment after 9pm',
      medicationTimes: ['08:00', '14:00', '20:00']
    },
    communicationPreferences: {
      preferredContactMethod: 'app',
      updateFrequency: 'real_time'
    }
  },
  emergencyContacts: [
    {
      id: 'emergency-001',
      name: 'Elena Chen',
      relationship: 'Sister',
      phone: '+1-555-0101',
      priority: 1,
      canMakeMedicalDecisions: true
    },
    {
      id: 'emergency-002', 
      name: 'Sarah Martinez',
      relationship: 'Mother',
      phone: '+1-555-0102',
      priority: 2,
      canMakeMedicalDecisions: false // Has dementia
    }
  ],
  medicalInfo: {
    medications: [
      {
        id: 'med-001',
        name: 'Baclofen',
        dosage: '10mg',
        frequency: 'three times daily',
        scheduledTimes: ['08:00', '14:00', '20:00'],
        instructions: 'Take with food to reduce stomach upset',
        prescribedBy: 'Dr. Martinez',
        startDate: '2023-01-15',
        isActive: true
      }
    ],
    medicalConditions: ['Spinal cord injury (C5-C6)', 'Neurogenic bladder', 'Autonomic dysreflexia'],
    allergies: ['Latex'],
    emergencyMedicalInfo: 'Quadriplegic, uses wheelchair, catheter dependent. Watch for autonomic dysreflexia signs.',
    primaryPhysician: {
      name: 'Dr. Sarah Martinez',
      phone: '+1-555-0200'
    }
  },
  location: {
    address: '123 Main St, Minneapolis, MN 55401'
  }
};

// ============================================================================
// ROB'S CARE TEAM - ACTUAL SCHEDULE PROVIDED BY ROB
// ============================================================================

export const robsCareTeam: TeamMember[] = [
  // ROB WUDLICK - Care Recipient, Scheduler, General Administration
  {
    id: 'rob-wudlick',
    name: 'David Orwell',
    role: 'care_recipient',
    contactInfo: {
      phone: '+1-555-0100',
      email: 'rob.wudlick@example.com',
      preferredContact: 'app'
    },
    regularShifts: [], // No shifts as care recipient
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Scheduling', level: 'advanced' },
      { name: 'General Administration', level: 'advanced' }
    ],
    certifications: [],
    canDo: ['scheduling', 'administration'],
    relationshipToCareRecipient: 'Care Recipient, Scheduler, General Administration',
    trustLevel: 'high',
    reliability: {
      showUpRate: 1.0,
      onTimeRate: 1.0,
      lastMinuteCancellations: 0
    },
    sourceAgency: 'N/A',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },
  
  // LUANN WUDLICK (Mom) - Family, Nurse, PCA - has dementia, fills empty time slots
  {
    id: 'luann-wudlick',
    name: 'Sarah Martinez (mom)',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0102',
      email: 'luann.wudlick@example.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // Fills empty time slots as needed - has dementia
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Nursing Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' },
      { name: 'Medication Administration', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'Registered Nurse',
        number: 'RN789012',
        issuingOrganization: 'Minnesota Board of Nursing',
        issueDate: '1985-06-15',
        expirationDate: '2025-06-15',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'medical', 'household'],
    relationshipToCareRecipient: 'Mother',
    trustLevel: 'high',
    reliability: {
      showUpRate: 1.0,
      onTimeRate: 1.0,
      lastMinuteCancellations: 0
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // MARTA SNOW (Sister) - Family, Scheduler, Admin, Backup PCA - On-call
  {
    id: 'marta-snow',
    name: 'Elena Chen',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0101',
      email: 'marta.snow@example.com',
      preferredContact: 'text'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T08:00:00Z',
    skills: [
      { name: 'Scheduling', level: 'advanced' },
      { name: 'General Administration', level: 'advanced' },
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [],
    canDo: ['personal_care', 'household', 'transportation', 'scheduling', 'administration'],
    relationshipToCareRecipient: 'Sister',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.92,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // JIM NELSON - Primary Caregiver, Nurse - M-F 9am-5pm
  {
    id: 'jim-nelson',
    name: 'Jim Nelson',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1001',
      email: 'jim.nelson@caregivers.com',
      preferredContact: 'phone'
    },
    regularShifts: [{
      id: 'shift-jim-regular',
      daysOfWeek: [1,2,3,4,5], // M-F
      startTime: '09:00',
      endTime: '17:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Medication Administration', level: 'advanced' },
      { name: 'Range of Motion', level: 'advanced' },
      { name: 'Transfer Techniques', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'Registered Nurse',
        number: 'RN123456',
        issuingOrganization: 'Minnesota Board of Nursing',
        issueDate: '2020-01-15',
        expirationDate: '2026-01-15',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'medical', 'household', 'transportation'],
    relationshipToCareRecipient: 'Primary Caregiver (Nurse)',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.98,
      onTimeRate: 0.95,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Independent contractor',
    hourlyRate: 35,
    paymentMethod: 'direct'
  },
  // JENNIFER - Overnight PCA - Monday, Tuesday 8pm-8am
  {
    id: 'jennifer-pca',
    name: 'Jennifer',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1002',
      email: 'jennifer@nightcaregivers.com',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'shift-jennifer-regular',
      daysOfWeek: [1,2], // Monday, Tuesday
      startTime: '20:00',
      endTime: '08:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-28T20:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA789',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-03-01',
        expirationDate: '2025-03-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'Overnight PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.96,
      onTimeRate: 0.92,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Home Health Plus',
    hourlyRate: 22,
    paymentMethod: 'agency'
  },
  // SARAH - Overnight PCA - Wednesday, Thursday 8pm-8am
  {
    id: 'sarah-pca',
    name: 'Sarah',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1003',
      email: 'sarah@nightcaregivers.com',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'shift-sarah-regular',
      daysOfWeek: [3,4], // Wednesday, Thursday
      startTime: '20:00',
      endTime: '08:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-28T19:30:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' },
      { name: 'Transportation', level: 'intermediate' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA790',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-02-15',
        expirationDate: '2025-02-15',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household', 'transportation'],
    relationshipToCareRecipient: 'Personal Care Assistant',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.94,
      onTimeRate: 0.90,
      lastMinuteCancellations: 3
    },
    sourceAgency: 'CarePartners LLC',
    hourlyRate: 23,
    paymentMethod: 'agency'
  },
  // ELLA - Overnight PCA - Friday, Saturday, Sunday 8pm-9am
  {
    id: 'ella-pca',
    name: 'Ella',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1004',
      preferredContact: 'phone'
    },
    regularShifts: [{
      id: 'shift-ella-regular',
      daysOfWeek: [5,6,0], // Friday, Saturday, Sunday
      startTime: '20:00',
      endTime: '09:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T14:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA791',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-01-10',
        expirationDate: '2025-01-10',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'Personal Care Assistant',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.91,
      onTimeRate: 0.88,
      lastMinuteCancellations: 4
    },
    sourceAgency: 'Caring Hands Agency',
    hourlyRate: 21,
    paymentMethod: 'agency'
  },
  
  // ALEX - PCA - Random
  {
    id: 'alex-pca',
    name: 'Alex',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1005',
      preferredContact: 'text'
    },
    regularShifts: [], // Random/as-needed
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T12:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA445',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-07-01',
        expirationDate: '2025-07-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'PCA',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.90,
      onTimeRate: 0.88,
      lastMinuteCancellations: 3
    },
    sourceAgency: 'Independent',
    hourlyRate: 20,
    paymentMethod: 'direct'
  },
  
  // OLENA - PCA - Saturday, Sunday 9am-1pm
  {
    id: 'olena-pca',
    name: 'Olena',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1006',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'shift-olena-regular',
      daysOfWeek: [6,0], // Saturday, Sunday
      startTime: '09:00',
      endTime: '13:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'advanced' },
      { name: 'Meal Preparation', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA667',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2022-10-01',
        expirationDate: '2024-10-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.93,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'CarePartners LLC',
    hourlyRate: 22,
    paymentMethod: 'agency'
  },
  
  // ISABELA - Family, PCA - On-call
  {
    id: 'isabela-family',
    name: 'Isabela',
    role: 'family',
    contactInfo: {
      phone: '+1-555-1007',
      preferredContact: 'text'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T10:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [],
    canDo: ['personal_care', 'household', 'companionship'],
    relationshipToCareRecipient: 'Family Friend',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.92,
      onTimeRate: 0.90,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'volunteer'
  },
  
  // LUCY - PCA, Family - On-call
  {
    id: 'lucy-family',
    name: 'Lucy',
    role: 'family',
    contactInfo: {
      phone: '+1-555-1008',
      preferredContact: 'phone'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T10:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' },
      { name: 'Companionship', level: 'advanced' }
    ],
    certifications: [],
    canDo: ['personal_care', 'household', 'companionship'],
    relationshipToCareRecipient: 'Family Friend',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.90,
      onTimeRate: 0.88,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'volunteer'
  },
  
  // GRACE - Overnight PCA - On summer break
  {
    id: 'grace-pca',
    name: 'Grace',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1009',
      preferredContact: 'text'
    },
    regularShifts: [], // On summer break
    currentAvailability: 'unavailable', // Summer break
    blockedDates: ['2024-06-01', '2024-09-15'], // Summer break dates
    lastAvailabilityUpdate: '2024-06-01T12:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA889',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-01-01',
        expirationDate: '2025-01-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'Overnight PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.94,
      onTimeRate: 0.92,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Independent',
    hourlyRate: 23,
    paymentMethod: 'direct'
  },
  
  // KATHLEEN - Backup PCA - Random on-call
  {
    id: 'kathleen-backup',
    name: 'Kathleen',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1010',
      preferredContact: 'phone'
    },
    regularShifts: [], // Random on-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T10:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA990',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-05-01',
        expirationDate: '2025-05-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'Backup PCA',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.88,
      onTimeRate: 0.85,
      lastMinuteCancellations: 4
    },
    sourceAgency: 'Independent',
    hourlyRate: 20,
    paymentMethod: 'direct'
  },
  
  // ANNIE - Backup PCA - Random on-call
  {
    id: 'annie-backup',
    name: 'Annie',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-1011',
      preferredContact: 'text'
    },
    regularShifts: [], // Random on-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T10:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      {
        type: 'PCA Certification',
        number: 'PCA111',
        issuingOrganization: 'Minnesota Department of Health',
        issueDate: '2023-08-01',
        expirationDate: '2025-08-01',
        status: 'valid'
      }
    ],
    canDo: ['personal_care', 'household'],
    relationshipToCareRecipient: 'Backup PCA',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.85,
      onTimeRate: 0.83,
      lastMinuteCancellations: 5
    },
    sourceAgency: 'Independent',
    hourlyRate: 20,
    paymentMethod: 'direct'
  }
];

// ============================================================================
// CURRENT COVERAGE SITUATION (Next 7 Days)
// ============================================================================

export const currentCoverage: CoverageWindow[] = [
  // Today's coverage windows
  {
    id: 'coverage-today-morning',
    date: '2024-08-29',
    startTime: '09:00',
    endTime: '17:00',
    requiredCareTypes: ['personal_care', 'medical', 'household'],
    status: 'confirmed',
    assignedTeamMember: 'jim-nelson',
    backupOptions: ['marta-snow'],
    lastStatusUpdate: '2024-08-29T08:00:00Z'
  },
  {
    id: 'coverage-today-evening',
    date: '2024-08-29',
    startTime: '20:00',
    endTime: '08:00',
    requiredCareTypes: ['personal_care', 'medical'],
    status: 'confirmed',
    assignedTeamMember: 'jennifer-pca',
    backupOptions: ['sarah-pca', 'ella-pca'],
    lastStatusUpdate: '2024-08-28T20:00:00Z'
  },
  // Saturday evening gap (Ella called out)
  {
    id: 'coverage-saturday-evening',
    date: '2024-08-31',
    startTime: '20:00',
    endTime: '09:00',
    requiredCareTypes: ['personal_care', 'medical'],
    status: 'gap',
    backupOptions: ['sarah-pca', 'marta-snow', 'kathleen-backup', 'annie-backup'],
    lastStatusUpdate: '2024-08-29T14:00:00Z'
  }
];

// ============================================================================
// ACTIVE COVERAGE GAPS
// ============================================================================

export const activeCoverageGaps: CoverageGap[] = [
  {
    id: 'gap-saturday-evening',
    coverageWindowId: 'coverage-saturday-evening',
    date: '2024-08-31',
    startTime: '20:00',
    endTime: '09:00',
    reason: 'caregiver_sick',
    severity: 'high',
    detectedAt: '2024-08-29T14:00:00Z',
    backupRequestsSent: [
      {
        id: 'request-001',
        gapId: 'gap-saturday-evening',
        teamMemberId: 'sarah-pca',
        requestedAt: '2024-08-29T14:15:00Z',
        method: 'sms',
        status: 'sent'
      },
      {
        id: 'request-002', 
        gapId: 'gap-saturday-evening',
        teamMemberId: 'marta-snow',
        requestedAt: '2024-08-29T14:16:00Z',
        method: 'phone_call',
        status: 'seen'
      }
    ],
    resolutionStatus: 'pending_response'
  }
];

// ============================================================================
// NETWORK HEALTH METRICS
// ============================================================================

export const networkHealthMetrics: NetworkHealthMetrics = {
  coverageScore: 85,              // 85% - good but room for improvement
  gapMinutesPerWeek: 120,         // 2 hours per week average gaps
  teamUtilization: 78,            // 78% of team capacity used
  confirmationRate: 87,           // 87% confirmed 24h in advance
  reliabilityScore: 92,           // High team reliability
  coordinatorBurden: 8,           // Rob spends 8 hours/week coordinating
  
  trends: {
    period: 'month',
    coverageImprovement: 5,       // +5% improvement this month
    gapReduction: -30,           // 30% fewer gap minutes
    teamGrowth: 2                // +2 team members this month
  }
};

// ============================================================================
// COMPLETE CARE COORDINATION CONTEXT
// ============================================================================

export const robsCareContext: CareCoordinationContext = {
  careRecipient: robCareRecipient,
  careTeam: robsCompleteTeam,
  currentCoverage: currentCoverage,
  activeShifts: [], // Would be populated with current shifts
  coverageGaps: activeCoverageGaps,
  networkHealth: networkHealthMetrics,
  
  quickActions: {
    findCoverage: async (gapId: string) => {
      // Return available team members for the gap
      const gap = activeCoverageGaps.find(g => g.id === gapId);
      if (!gap) return [];
      
      return robsCareTeam.filter(member => 
        gap.backupRequestsSent.some(req => req.teamMemberId === member.id) ||
        member.currentAvailability === 'available'
      );
    },
    
    sendUpdate: async (message: string, recipients: string[]) => {
      // Mock implementation - would send actual messages
      console.log(`Sending "${message}" to:`, recipients);
    },
    
    confirmShift: async (shiftId: string) => {
      // Mock implementation - would update shift status
      console.log(`Confirming shift: ${shiftId}`);
    },
    
    reportGap: async (windowId: string, reason) => {
      // Mock implementation - would create new coverage gap
      const newGap: CoverageGap = {
        id: `gap-${Date.now()}`,
        coverageWindowId: windowId,
        date: new Date().toISOString().split('T')[0],
        startTime: '00:00',
        endTime: '00:00', 
        reason,
        severity: 'medium',
        detectedAt: new Date().toISOString(),
        backupRequestsSent: [],
        resolutionStatus: 'unresolved'
      };
      return newGap;
    }
  }
};