/**
 * CareSupport Context Provider for HR Template Integration
 * 
 * This context provides CareSupport data in a format that's compatible
 * with the HR template components, enabling seamless semantic translation.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CareCoordinationContext,
  CareRecipient, 
  TeamMember, 
  CoverageWindow, 
  CoverageGap,
  NetworkHealthMetrics 
} from './careTypes';
import { CareSupportTranslationService, Employee, TimeOffRequest, Project } from './careSupportTranslation';
import { useSimplePermissions } from './simple-permission-context';

// ============================================================================
// ROB'S CARE DATA (Mock data for initial implementation)
// ============================================================================

const mockCareRecipient: CareRecipient = {
  id: 'rob-001',
  name: 'David Orwell',
  primaryCoordinator: 'David Orwell',
  backupCoordinator: 'Elena Chen',
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
    }
  ],
  preferences: {
    preferredCaregivers: ['jim-nelson', 'jennifer-pca', 'sarah-pca'],
    routinePreferences: {
      morningRoutine: 'Early riser, prefers to be up by 7am',
      eveningRoutine: 'Evening medications at 8pm',
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
    medicalConditions: ['Spinal cord injury (C5-C6)', 'Neurogenic bladder'],
    allergies: ['Latex'],
    emergencyMedicalInfo: 'Quadriplegic, uses wheelchair, catheter dependent',
    primaryPhysician: {
      name: 'Dr. Sarah Martinez',
      phone: '+1-555-0200'
    }
  },
  location: {
    address: '123 Main St, Minneapolis, MN 55401'
  }
};

const mockCareTeam: TeamMember[] = [
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
      recurrencePattern: 'weekly' as any,
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
      recurrencePattern: 'weekly' as any,
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
  {
    id: 'marta-snow',
    name: 'Elena Chen',
    role: 'family_caregiver',
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
    canDo: ['personal_care', 'household', 'transportation', 'companionship'],
    relationshipToCareRecipient: 'Sister',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.92,
      lastMinuteCancellations: 2
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'volunteer'
  }
];

const mockCurrentCoverage: CoverageWindow[] = [
  {
    id: 'coverage-today-morning',
    date: '2025-01-12',
    startTime: '09:00',
    endTime: '17:00',
    requiredCareTypes: ['personal_care', 'medical', 'household'],
    status: 'confirmed',
    assignedTeamMember: 'jim-nelson',
    backupOptions: ['marta-snow'],
    lastStatusUpdate: '2025-01-12T08:00:00Z'
  },
  {
    id: 'coverage-today-evening',
    date: '2025-01-12',
    startTime: '20:00',
    endTime: '08:00',
    requiredCareTypes: ['personal_care', 'medical'],
    status: 'confirmed',
    assignedTeamMember: 'jennifer-pca',
    backupOptions: ['marta-snow'],
    lastStatusUpdate: '2025-01-11T20:00:00Z'
  }
];

const mockCoverageGaps: CoverageGap[] = [
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
        teamMemberId: 'marta-snow',
        requestedAt: '2024-08-29T14:15:00Z',
        method: 'sms',
        status: 'sent'
      }
    ],
    resolutionStatus: 'pending_response'
  }
];

const mockNetworkHealth: NetworkHealthMetrics = {
  coverageScore: 85,
  gapMinutesPerWeek: 120,
  teamUtilization: 78,
  confirmationRate: 87,
  reliabilityScore: 92,
  coordinatorBurden: 8,
  trends: {
    period: 'month',
    coverageImprovement: 5,
    gapReduction: -30,
    teamGrowth: 2
  }
};

// ============================================================================
// LUANN'S CARE DATA (Mock data for dementia care coordination)
// ============================================================================

const luannCareRecipient: CareRecipient = {
  id: 'luann-001',
  name: 'Luann Snow',
  primaryCoordinator: 'Marta Snow',
  backupCoordinator: 'Rob Wudlick',
  careNeeds: [
    {
      id: 'need-luann-001',
      category: 'cognitive_care',
      description: 'Dementia care, cognitive stimulation, memory support, orientation assistance',
      requiredSkills: ['dementia_care', 'cognitive_assessment', 'behavioral_support'],
      frequency: 'daily',
      priority: 'high'
    },
    {
      id: 'need-luann-002',
      category: 'personal_care',
      description: 'Personal hygiene, dressing assistance, meal preparation, medication management',
      requiredSkills: ['personal_care', 'medication_administration', 'meal_preparation'],
      frequency: 'daily',
      priority: 'high'
    },
    {
      id: 'need-luann-003',
      category: 'safety_monitoring',
      description: 'Wandering prevention, fall risk management, home safety, emergency response',
      requiredSkills: ['safety_monitoring', 'fall_prevention', 'emergency_response'],
      frequency: 'continuous',
      priority: 'critical'
    }
  ],
  preferences: {
    preferredCaregivers: ['marta-snow', 'jim-nelson', 'jennifer-pca'],
    routinePreferences: {
      morningRoutine: 'Gentle wake-up, prefers familiar faces and routines',
      eveningRoutine: 'Early bedtime routine, medication at 7pm',
      medicationTimes: ['08:00', '13:00', '19:00']
    },
    communicationPreferences: {
      preferredContactMethod: 'family_coordinator',
      updateFrequency: 'real_time'
    }
  },
  emergencyContacts: [
    {
      id: 'emergency-luann-001',
      name: 'Marta Snow',
      relationship: 'Daughter',
      phone: '+1-555-234-5678',
      priority: 1,
      canMakeMedicalDecisions: true
    },
    {
      id: 'emergency-luann-002',
      name: 'Rob Wudlick',
      relationship: 'Son',
      phone: '+1-555-345-6789',
      priority: 2,
      canMakeMedicalDecisions: true
    }
  ],
  location: {
    address: '456 Oak Street, Minneapolis, MN 55402'
  }
};

const luannCareTeam: TeamMember[] = [
  {
    id: 'marta-snow-luann',
    name: 'Marta Snow',
    role: 'family_coordinator',
    contactInfo: {
      phone: '+1-555-234-5678',
      email: 'marta.snow@family.com',
      preferredContact: 'phone'
    },
    regularShifts: [],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Dementia Care Coordination', level: 'advanced' },
      { name: 'Family Communication', level: 'advanced' },
      { name: 'Medical Advocacy', level: 'advanced' }
    ],
    certifications: [],
    canDo: ['coordination', 'communication', 'advocacy', 'personal_care'],
    relationshipToCareRecipient: 'Primary Care Coordinator (Daughter)',
    trustLevel: 'highest',
    reliability: {
      showUpRate: 1.0,
      onTimeRate: 1.0,
      lastMinuteCancellations: 0
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'volunteer'
  },
  {
    id: 'rob-wudlick-luann',
    name: 'Rob Wudlick',
    role: 'family_coordinator',
    contactInfo: {
      phone: '+1-555-345-6789',
      email: 'rob.wudlick@family.com',
      preferredContact: 'app'
    },
    regularShifts: [],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Care Coordination', level: 'intermediate' },
      { name: 'Technology Support', level: 'advanced' },
      { name: 'Family Liaison', level: 'advanced' }
    ],
    certifications: [],
    canDo: ['coordination', 'technology', 'communication'],
    relationshipToCareRecipient: 'Care Coordinator (Son)',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.95,
      onTimeRate: 0.90,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Family',
    hourlyRate: 0,
    paymentMethod: 'volunteer'
  },
  {
    id: 'jim-nelson-luann',
    name: 'Jim Nelson',
    role: 'professional_nurse',
    contactInfo: {
      phone: '+1-555-456-7890',
      email: 'jim.nelson@caresupport.com',
      preferredContact: 'phone'
    },
    regularShifts: [{
      id: 'shift-jim-luann-regular',
      daysOfWeek: [1,2,3,4,5], // M-F
      startTime: '09:00',
      endTime: '17:00',
      recurrencePattern: 'weekly' as any,
      effectiveDate: '2024-01-01',
      isActive: true
    }],
    currentAvailability: 'available',
    blockedDates: [],
    lastAvailabilityUpdate: '2024-08-29T09:00:00Z',
    skills: [
      { name: 'Dementia Care', level: 'advanced' },
      { name: 'Cognitive Assessment', level: 'advanced' },
      { name: 'Behavioral Support', level: 'advanced' },
      { name: 'Medication Management', level: 'advanced' }
    ],
    certifications: [
      {
        type: 'Dementia Care Specialist',
        number: 'DCS-789123',
        issuingOrganization: 'Alzheimer\'s Association',
        issueDate: '2021-03-15',
        expirationDate: '2027-03-15',
        status: 'valid'
      }
    ],
    canDo: ['medical', 'dementia_care', 'cognitive_assessment', 'behavioral_support'],
    relationshipToCareRecipient: 'Dementia Care Specialist (Nurse)',
    trustLevel: 'high',
    reliability: {
      showUpRate: 0.98,
      onTimeRate: 0.95,
      lastMinuteCancellations: 1
    },
    sourceAgency: 'Professional Care Services',
    hourlyRate: 38,
    paymentMethod: 'direct'
  }
];

const luannCurrentCoverage: CoverageWindow[] = [
  {
    id: 'coverage-luann-today-morning',
    date: '2025-01-12',
    startTime: '09:00',
    endTime: '17:00',
    requiredCareTypes: ['dementia_care', 'cognitive_stimulation', 'personal_care'],
    status: 'confirmed',
    assignedTeamMember: 'jim-nelson-luann',
    backupOptions: ['marta-snow-luann'],
    lastStatusUpdate: '2025-01-12T08:00:00Z'
  },
  {
    id: 'coverage-luann-today-evening',
    date: '2025-01-12',
    startTime: '20:00',
    endTime: '08:00',
    requiredCareTypes: ['safety_monitoring', 'dementia_care', 'personal_care'],
    status: 'confirmed',
    assignedTeamMember: 'jennifer-pca',
    backupOptions: ['marta-snow-luann'],
    lastStatusUpdate: '2025-01-11T20:00:00Z'
  }
];

const luannCoverageGaps: CoverageGap[] = [
  {
    id: 'gap-luann-saturday-evening',
    coverageWindowId: 'coverage-luann-saturday-evening',
    date: '2024-08-31',
    startTime: '20:00',
    endTime: '09:00',
    reason: 'caregiver_sick',
    severity: 'critical',
    detectedAt: '2024-08-29T14:00:00Z',
    backupRequestsSent: [
      {
        id: 'request-luann-001',
        gapId: 'gap-luann-saturday-evening',
        teamMemberId: 'marta-snow-luann',
        requestedAt: '2024-08-29T14:15:00Z',
        method: 'phone',
        status: 'sent'
      }
    ],
    resolvedAt: '2024-08-29T16:30:00Z',
    resolutionMethod: 'backup_coverage',
    notes: 'Marta stepped in for overnight dementia care coverage'
  }
];

const luannNetworkHealth: NetworkHealthMetrics = {
  overallScore: 85,
  coverageReliability: 0.88,
  teamResponseTime: 2.5,
  communicationEffectiveness: 0.92,
  careQualityRating: 4.3,
  familySatisfaction: 4.5,
  trends: {
    coverageReliability: 5,
    teamResponseTime: -15,
    communicationEffectiveness: 8,
    careQualityRating: 3,
    familySatisfaction: 2,
    gapReduction: -25,
    teamGrowth: 1
  }
};

// ============================================================================
// CARE SUPPORT CONTEXT
// ============================================================================

interface CareSupportContextType {
  // CareSupport data
  careContext: CareCoordinationContext;
  
  // HR Template compatible data
  employees: Employee[];
  timeOffRequests: TimeOffRequest[];
  currentProject: Project | null;
  projects: Project[];
  
  // Loading states
  isLoading: boolean;
  lastUpdated: Date;
  
  // Interactive state management
  selectedItems: {
    coverageGaps: string[];
    employees: string[];
    projects: string[];
  };
  
  filters: {
    coverageGaps: {
      status: string[];
      reason: string[];
      severity: string[];
    };
    employees: {
      department: string[];
      status: string[];
      availability: string[];
    };
    projects: {
      status: string[];
      priority: string[];
    };
  };
  
  // Actions
  refreshData: () => void;
  
  // Interactive actions
  selectItem: (type: 'coverageGaps' | 'employees' | 'projects', id: string) => void;
  deselectItem: (type: 'coverageGaps' | 'employees' | 'projects', id: string) => void;
  clearSelection: (type: 'coverageGaps' | 'employees' | 'projects') => void;
  
  // Data modification actions
  updateCoverageGap: (gapId: string, updates: Partial<CoverageGap>) => void;
  updateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  
  // Filter actions
  setFilter: (type: 'coverageGaps' | 'employees' | 'projects', filterKey: string, values: string[]) => void;
  clearFilters: (type: 'coverageGaps' | 'employees' | 'projects') => void;
  
  // Real-time simulation
  startRealTimeSimulation: () => void;
  stopRealTimeSimulation: () => void;
  isRealTimeActive: boolean;
}

const CareSupportContext = createContext<CareSupportContextType | undefined>(undefined);

// ============================================================================
// CARE SUPPORT PROVIDER
// ============================================================================

interface CareSupportProviderProps {
  children: ReactNode;
}

export function CareSupportProvider({ children }: CareSupportProviderProps) {
  const { currentProfile } = useSimplePermissions();
  
  // Select appropriate data based on current profile
  const selectedCareRecipient = currentProfile?.id === 'luanns-care-team' ? luannCareRecipient : mockCareRecipient;
  const selectedCareTeam = currentProfile?.id === 'luanns-care-team' ? luannCareTeam : mockCareTeam;
  const selectedCurrentCoverage = currentProfile?.id === 'luanns-care-team' ? luannCurrentCoverage : mockCurrentCoverage;
  const selectedCoverageGaps = currentProfile?.id === 'luanns-care-team' ? luannCoverageGaps : mockCoverageGaps;
  const selectedNetworkHealth = currentProfile?.id === 'luanns-care-team' ? luannNetworkHealth : mockNetworkHealth;
  
  const [careContext, setCareContext] = useState<CareCoordinationContext>({
    careRecipient: selectedCareRecipient,
    careTeam: selectedCareTeam,
    currentCoverage: selectedCurrentCoverage,
    activeShifts: [],
    coverageGaps: selectedCoverageGaps,
    networkHealth: selectedNetworkHealth,
    quickActions: {
      findCoverage: async (gapId: string) => {
        return selectedCareTeam.filter(member => member.currentAvailability === 'available');
      },
      sendUpdate: async (message: string, recipients: string[]) => {
        console.log(`Sending "${message}" to:`, recipients);
      },
      confirmShift: async (shiftId: string) => {
        console.log(`Confirming shift: ${shiftId}`);
      },
      reportGap: async (windowId: string, reason: any) => {
        console.log(`Reporting gap: ${windowId}, reason: ${reason}`);
        return mockCoverageGaps[0];
      }
    }
  });
  
  // Interactive state management
  const [selectedItems, setSelectedItems] = useState({
    coverageGaps: [] as string[],
    employees: [] as string[],
    projects: [] as string[]
  });
  
  const [filters, setFilters] = useState({
    coverageGaps: {
      status: [] as string[],
      reason: [] as string[],
      severity: [] as string[]
    },
    employees: {
      department: [] as string[],
      status: [] as string[],
      availability: [] as string[]
    },
    projects: {
      status: [] as string[],
      priority: [] as string[]
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  // Transform CareSupport data to HR template format
  const transformedData = CareSupportTranslationService.transformCareContextToHRData(careContext);

  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Interactive actions
  const selectItem = (type: 'coverageGaps' | 'employees' | 'projects', id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: [...prev[type], id]
    }));
  };

  const deselectItem = (type: 'coverageGaps' | 'employees' | 'projects', id: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: prev[type].filter(itemId => itemId !== id)
    }));
  };

  const clearSelection = (type: 'coverageGaps' | 'employees' | 'projects') => {
    setSelectedItems(prev => ({
      ...prev,
      [type]: []
    }));
  };

  // Data modification actions
  const updateCoverageGap = (gapId: string, updates: Partial<CoverageGap>) => {
    setCareContext(prev => ({
      ...prev,
      coverageGaps: prev.coverageGaps.map(gap => 
        gap.id === gapId ? { ...gap, ...updates } : gap
      )
    }));
    setLastUpdated(new Date());
  };

  const updateEmployee = (employeeId: string, updates: Partial<Employee>) => {
    // This would update the underlying team member data
    setCareContext(prev => ({
      ...prev,
      careTeam: prev.careTeam.map(member => 
        member.id === employeeId ? { 
          ...member, 
          currentAvailability: updates.status === 'inactive' ? 'unavailable' : 'available'
        } : member
      )
    }));
    setLastUpdated(new Date());
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    // This would update the underlying coverage window data
    setCareContext(prev => ({
      ...prev,
      currentCoverage: prev.currentCoverage.map(window => 
        window.id === projectId ? { 
          ...window, 
          status: updates.status === 'completed' ? 'covered' : 
                 updates.status === 'in_progress' ? 'confirmed' : 'tentative'
        } : window
      )
    }));
    setLastUpdated(new Date());
  };

  // Filter actions
  const setFilter = (type: 'coverageGaps' | 'employees' | 'projects', filterKey: string, values: string[]) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [filterKey]: values
      }
    }));
  };

  const clearFilters = (type: 'coverageGaps' | 'employees' | 'projects') => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        coverageGaps: { status: [], reason: [], severity: [] },
        employees: { department: [], status: [], availability: [] },
        projects: { status: [], priority: [] }
      }[type]
    }));
  };

  // Real-time simulation
  const startRealTimeSimulation = () => {
    setIsRealTimeActive(true);
    
    const interval = setInterval(() => {
      // Simulate real-time data changes
      setCareContext(prev => {
        const updatedTeam = prev.careTeam.map(member => {
          // Randomly change availability status
          if (Math.random() < 0.1) { // 10% chance to change
            const availabilities = ['available', 'busy', 'unavailable'];
            const currentIndex = availabilities.indexOf(member.currentAvailability);
            const nextIndex = (currentIndex + 1) % availabilities.length;
            return {
              ...member,
              currentAvailability: availabilities[nextIndex] as 'available' | 'busy' | 'unavailable'
            };
          }
          return member;
        });
        
        return {
          ...prev,
          careTeam: updatedTeam
        };
      });
      
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds
    
    // Store interval ID for cleanup
    (window as any).careSupportInterval = interval;
  };

  const stopRealTimeSimulation = () => {
    setIsRealTimeActive(false);
    if ((window as any).careSupportInterval) {
      clearInterval((window as any).careSupportInterval);
      delete (window as any).careSupportInterval;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ((window as any).careSupportInterval) {
        clearInterval((window as any).careSupportInterval);
      }
    };
  }, []);

  const contextValue: CareSupportContextType = {
    careContext,
    employees: transformedData.employees,
    timeOffRequests: transformedData.timeOffRequests,
    currentProject: transformedData.currentProject,
    projects: transformedData.projects,
    isLoading,
    lastUpdated,
    selectedItems,
    filters,
    refreshData,
    selectItem,
    deselectItem,
    clearSelection,
    updateCoverageGap,
    updateEmployee,
    updateProject,
    setFilter,
    clearFilters,
    startRealTimeSimulation,
    stopRealTimeSimulation,
    isRealTimeActive
  };

  return (
    <CareSupportContext.Provider value={contextValue}>
      {children}
    </CareSupportContext.Provider>
  );
}

// ============================================================================
// HOOKS FOR USING CARE SUPPORT CONTEXT
// ============================================================================

export function useCareSupport() {
  const context = useContext(CareSupportContext);
  if (context === undefined) {
    throw new Error('useCareSupport must be used within a CareSupportProvider');
  }
  return context;
}

// Convenience hooks for specific data
export function useEmployees() {
  const { employees } = useCareSupport();
  return employees;
}

export function useTeamMembers() {
  const { employees } = useCareSupport();
  return employees;
}

export function useTimeOffRequests() {
  const { timeOffRequests } = useCareSupport();
  return timeOffRequests;
}

export function useCurrentProject() {
  const { currentProject } = useCareSupport();
  return currentProject;
}

export function useProjects() {
  const { projects } = useCareSupport();
  return projects;
}

// Interactive hooks
export function useSelectedItems() {
  const { selectedItems } = useCareSupport();
  return selectedItems;
}

export function useFilters() {
  const { filters } = useCareSupport();
  return filters;
}

export function useInteractiveActions() {
  const { 
    selectItem, 
    deselectItem, 
    clearSelection,
    updateCoverageGap,
    updateEmployee,
    updateProject,
    setFilter,
    clearFilters
  } = useCareSupport();
  
  return {
    selectItem,
    deselectItem,
    clearSelection,
    updateCoverageGap,
    updateEmployee,
    updateProject,
    setFilter,
    clearFilters
  };
}

export function useRealTimeSimulation() {
  const { 
    startRealTimeSimulation, 
    stopRealTimeSimulation, 
    isRealTimeActive 
  } = useCareSupport();
  
  return {
    startRealTimeSimulation,
    stopRealTimeSimulation,
    isRealTimeActive
  };
}
