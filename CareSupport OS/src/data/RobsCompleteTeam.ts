import { TeamMember } from '../types/CareCoordinationTypes';

// ROB'S COMPLETE CARE TEAM WITH ACTUAL SCHEDULES
export const robsCompleteTeam: TeamMember[] = [
  // ROB WUDLICK - Care Recipient, Scheduler, General Administration
  {
    id: 'david-orwell',
    name: 'David Orwell',
    role: 'care_recipient',
    contactInfo: {
      phone: '+1-555-0100',
      email: 'rob.wudlick@example.com',
      preferredContact: 'app'
    },
    regularShifts: [],
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
    regularShifts: [], // fills empty time slots
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Nursing Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Registered Nurse', number: 'RN789012', issuedBy: 'State Board', expiryDate: '2025-12-31' }
    ],
    canDo: ['nursing', 'personal_care', 'medication'],
    relationshipToCareRecipient: 'Family, Nurse, PCA - has dementia',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.98,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // MARTA SNOW (Sister) - Family, Scheduler, General Administration, Backup PCA - On-call
  {
    id: 'marta-snow',
    name: 'Elena Chen (sister)',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0103',
      email: 'marta.snow@example.com',
      preferredContact: 'text'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Scheduling', level: 'advanced' },
      { name: 'General Administration', level: 'advanced' },
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [],
    canDo: ['scheduling', 'administration', 'personal_care'],
    relationshipToCareRecipient: 'Family, Scheduler, General Administration, Backup PCA - On-call',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.98,
      onTimeRate: 1.0,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // JIM NELSON - Primary Caregiver, Nurse - M-F 9am-5pm
  {
    id: 'jim-nelson',
    name: 'Jim Nelson (primary caregiver)',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0104',
      email: 'jim.nelson@caregiver.com',
      preferredContact: 'phone'
    },
    regularShifts: [{
      id: 'jim-weekdays',
      daysOfWeek: [1, 2, 3, 4, 5], // M-F
      startTime: '09:00',
      endTime: '17:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'busy',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Nursing Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' },
      { name: 'Medical Monitoring', level: 'advanced' }
    ],
    certifications: [
      { type: 'Licensed Practical Nurse', number: 'LPN456789', issuedBy: 'State Board', expiryDate: '2025-06-30' }
    ],
    canDo: ['nursing', 'personal_care', 'medication', 'medical_monitoring'],
    relationshipToCareRecipient: 'Nurse',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.97,
      onTimeRate: 0.99,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Independent',
    hourlyRate: 28,
    paymentMethod: 'direct'
  },

  // JENNIFER - Overnight PCA - M,T 8pm-8am
  {
    id: 'jennifer-pca',
    name: 'Jennifer',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0105',
      email: 'jennifer.pca@caregiver.com',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'jennifer-overnight',
      daysOfWeek: [1, 2], // M,T
      startTime: '20:00',
      endTime: '08:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA123456', issuedBy: 'State Board', expiryDate: '2025-03-15' }
    ],
    canDo: ['overnight_care', 'personal_care'],
    relationshipToCareRecipient: 'Overnight PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.98,
      lastMinuteCancellations: 3
    },
    sourceAgency: 'Independent',
    hourlyRate: 22,
    paymentMethod: 'direct'
  },

  // SARAH - Overnight PCA - W, Th 8pm-8am
  {
    id: 'sarah-pca',
    name: 'Sarah',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0106',
      email: 'sarah.pca@caregiver.com',
      preferredContact: 'phone'
    },
    regularShifts: [{
      id: 'sarah-overnight',
      daysOfWeek: [3, 4], // W, Th
      startTime: '20:00',
      endTime: '08:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA654321', issuedBy: 'State Board', expiryDate: '2025-09-20' }
    ],
    canDo: ['overnight_care', 'personal_care'],
    relationshipToCareRecipient: 'Overnight PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.98,
      onTimeRate: 0.99,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Independent',
    hourlyRate: 22,
    paymentMethod: 'direct'
  },

  // ELLA - Overnight PCA - F, Sat, Sun 8pm-9am
  {
    id: 'ella-pca',
    name: 'Ella',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0107',
      email: 'ella.pca@caregiver.com',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'ella-overnight',
      daysOfWeek: [5, 6, 0], // F, Sat, Sun
      startTime: '20:00',
      endTime: '09:00',
      recurrencePattern: 'weekly',
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA789123', issuedBy: 'State Board', expiryDate: '2025-11-30' }
    ],
    canDo: ['overnight_care', 'personal_care'],
    relationshipToCareRecipient: 'Overnight PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.96,
      onTimeRate: 0.97,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Independent',
    hourlyRate: 24,
    paymentMethod: 'direct'
  },

  // ALEX - PCA - Random
  {
    id: 'alex-pca',
    name: 'Alex',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0108',
      email: 'alex.pca@caregiver.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // Random
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA555777', issuedBy: 'State Board', expiryDate: '2025-07-15' }
    ],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'PCA - Random',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.92,
      onTimeRate: 0.95,
      lastMinuteCancellations: 5
    },
    sourceAgency: 'Independent',
    hourlyRate: 20,
    paymentMethod: 'direct'
  },

  // OLENA - PCA - Sat, Sun 9am-1pm
  {
    id: 'olena-pca',
    name: 'Olena',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0109',
      email: 'olena.pca@caregiver.com',
      preferredContact: 'text'
    },
    regularShifts: [{
      id: 'olena-weekends',
      daysOfWeek: [6, 0], // Sat, Sun
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
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA999888', issuedBy: 'State Board', expiryDate: '2025-04-10' }
    ],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'PCA',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.99,
      onTimeRate: 1.0,
      lastMinuteCancellations: 0
    },
    sourceAgency: 'Independent',
    hourlyRate: 21,
    paymentMethod: 'direct'
  },

  // ISABELA - Family, PCA - On-call
  {
    id: 'isabela-family',
    name: 'Isabela',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0110',
      email: 'isabela@family.com',
      preferredContact: 'text'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'Family, PCA - On-call',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.94,
      onTimeRate: 0.96,
      lastMinuteCancellations: 3
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // LUCY - PCA, Family - On-call
  {
    id: 'lucy-family',
    name: 'Lucy',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0111',
      email: 'lucy@family.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'PCA, Family - On-call',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.93,
      onTimeRate: 0.97,
      lastMinuteCancellations: 4
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // GRACE - Overnight PCA - On summer break
  {
    id: 'grace-pca',
    name: 'Grace',
    role: 'paid_caregiver',
    contactInfo: {
      phone: '+1-555-0112',
      email: 'grace.pca@caregiver.com',
      preferredContact: 'text'
    },
    regularShifts: [], // On summer break
    currentAvailability: 'unavailable',
    blockedDates: [
      '2024-06-15',
      '2024-06-16',
      '2024-09-01' // Summer break period
    ],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Overnight Care', level: 'advanced' },
      { name: 'Personal Care', level: 'advanced' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA111222', issuedBy: 'State Board', expiryDate: '2025-12-01' }
    ],
    canDo: ['overnight_care', 'personal_care'],
    relationshipToCareRecipient: 'Overnight PCA - On summer break',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.99,
      onTimeRate: 1.0,
      lastMinuteCancellations: 0
    },
    sourceAgency: 'Independent',
    hourlyRate: 23,
    paymentMethod: 'direct'
  },

  // KATHLEEN - Backup PCA - Random on-call
  {
    id: 'kathleen-backup',
    name: 'Kathleen',
    role: 'backup_caregiver',
    contactInfo: {
      phone: '+1-555-0113',
      email: 'kathleen.backup@caregiver.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // Random on-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA333444', issuedBy: 'State Board', expiryDate: '2025-08-15' }
    ],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'Backup PCA - Random on-call',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.91,
      onTimeRate: 0.94,
      lastMinuteCancellations: 6
    },
    sourceAgency: 'Independent',
    hourlyRate: 19,
    paymentMethod: 'direct'
  },

  // ANNIE - Backup PCA - Random on-call
  {
    id: 'annie-backup',
    name: 'Annie',
    role: 'backup_caregiver',
    contactInfo: {
      phone: '+1-555-0114',
      email: 'annie.backup@caregiver.com',
      preferredContact: 'text'
    },
    regularShifts: [], // Random on-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'intermediate' }
    ],
    certifications: [
      { type: 'Personal Care Assistant', number: 'PCA555666', issuedBy: 'State Board', expiryDate: '2025-10-20' }
    ],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'Backup PCA - Random on-call',
    trustLevel: 'medium',
    reliability: {
      showUpRate: 0.90,
      onTimeRate: 0.93,
      lastMinuteCancellations: 7
    },
    sourceAgency: 'Independent',
    hourlyRate: 18,
    paymentMethod: 'direct'
  },

  // UNCLE JIM - Family, Backup PCA - On-call
  {
    id: 'uncle-jim',
    name: 'Uncle Jim',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0115',
      email: 'uncle.jim@family.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'basic' }
    ],
    certifications: [],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'Family, Backup PCA - On-call',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.88,
      onTimeRate: 0.92,
      lastMinuteCancellations: 8
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  },

  // DAN (Bro in-law) - Family, Backup PCA - On-call
  {
    id: 'dan-brotherinlaw',
    name: 'Dan (Bro in-law)',
    role: 'family',
    contactInfo: {
      phone: '+1-555-0116',
      email: 'dan.brotherinlaw@family.com',
      preferredContact: 'phone'
    },
    regularShifts: [], // On-call
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Personal Care', level: 'basic' }
    ],
    certifications: [],
    canDo: ['personal_care'],
    relationshipToCareRecipient: 'Family, Backup PCA - On-call',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.87,
      onTimeRate: 0.90,
      lastMinuteCancellations: 9
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'N/A'
  }
];