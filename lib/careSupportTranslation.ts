/**
 * CareSupport Semantic Translation Service
 * 
 * This service provides semantic translation between HR template concepts
 * and CareSupport care coordination concepts. The UI structure remains
 * identical - we only change the meaning and data sources.
 */

import { 
  CareRecipient, 
  TeamMember, 
  CoverageWindow, 
  CoverageGap,
  CareCoordinationContext 
} from './careTypes';

// ============================================================================
// TYPE DEFINITIONS FOR HR TEMPLATE COMPATIBILITY
// ============================================================================

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  manager: string;
  timeOffBalance: number;
  schedule: any[];
  performance: any[];
  avatar?: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface TimeOffRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  requestedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  team: string[];
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
}

// ============================================================================
// SEMANTIC TRANSLATION SERVICE
// ============================================================================

export class CareSupportTranslationService {
  
  /**
   * Transform CareSupport TeamMember to HR Employee format
   */
  static teamMemberToEmployee(teamMember: TeamMember): Employee {
    return {
      id: teamMember.id,
      name: teamMember.name,
      department: CareSupportTranslationService.mapRoleToDepartment(teamMember.role),
      position: CareSupportTranslationService.mapRoleToPosition(teamMember.role),
      manager: 'Care Coordinator', // Always the care coordinator
      timeOffBalance: CareSupportTranslationService.calculateAvailabilityBalance(teamMember),
      schedule: teamMember.regularShifts || [],
      performance: [], // Would map care quality metrics
      avatar: undefined, // Could be added later
      status: teamMember.currentAvailability === 'unavailable' ? 'inactive' : 'active'
    };
  }

  /**
   * Transform CoverageGap to TimeOffRequest format
   */
  static coverageGapToTimeOffRequest(gap: CoverageGap): TimeOffRequest {
    return {
      id: gap.id,
      employeeId: gap.coverageWindowId, // Map to coverage window
      startDate: `${gap.date}T${gap.startTime}:00`,
      endDate: `${gap.date}T${gap.endTime}:00`,
      type: CareSupportTranslationService.mapGapReasonToTimeOffType(gap.reason),
      status: CareSupportTranslationService.mapGapStatusToTimeOffStatus(gap.resolutionStatus),
      reason: gap.reason.replace('_', ' '),
      requestedAt: gap.detectedAt
    };
  }

  /**
   * Transform CoverageWindow to Project format
   */
  static coverageWindowToProject(window: CoverageWindow, careTeam: TeamMember[]): Project {
    const assignedMember = careTeam.find(m => m.id === window.assignedTeamMember);
    
    return {
      id: window.id,
      name: `Care Shift - ${assignedMember?.name || 'Unassigned'}`,
      description: `Good morning! Starting my shift with Rob at 9 AM. He's had his morning medication and seems to be in good spirits today. Planning to help with light breakfast and then assist with his daily exercises. His daughter mentioned he had some trouble sleeping last night, so I'll keep an eye on his energy levels. Will coordinate with the physical therapist who's scheduled for 2 PM and update the family on his progress. Weather is nice today, so hoping to get some fresh air in the afternoon if he's feeling up to it.`,
      status: CareSupportTranslationService.mapCoverageStatusToProjectStatus(window.status),
      team: window.assignedTeamMember ? [window.assignedTeamMember] : [],
      deadline: window.date,
      priority: CareSupportTranslationService.mapCareTypesToPriority(window.requiredCareTypes)
    };
  }

  /**
   * Transform CareCoordinationContext to HR Dashboard Data
   */
  static transformCareContextToHRData(context: CareCoordinationContext) {
    return {
      employees: context.careTeam.map(CareSupportTranslationService.teamMemberToEmployee),
      timeOffRequests: context.coverageGaps.map(CareSupportTranslationService.coverageGapToTimeOffRequest),
      currentProject: context.currentCoverage.length > 0 
        ? CareSupportTranslationService.coverageWindowToProject(context.currentCoverage[0], context.careTeam)
        : null,
      projects: context.currentCoverage.map(window => 
        CareSupportTranslationService.coverageWindowToProject(window, context.careTeam)
      ),
      // Add more mappings as needed
    };
  }

  // ============================================================================
  // HELPER MAPPING FUNCTIONS
  // ============================================================================

  static mapRoleToDepartment(role: string): string {
    const roleMap: Record<string, string> = {
      'paid_caregiver': 'Professional Care',
      'family_caregiver': 'Family Care',
      'backup_caregiver': 'Backup Support',
      'community_supporter': 'Community Support',
      'emergency_contact': 'Emergency Response'
    };
    return roleMap[role] || 'Care Team';
  }

  static mapRoleToPosition(role: string): string {
    const positionMap: Record<string, string> = {
      'paid_caregiver': 'Personal Care Assistant',
      'family_caregiver': 'Family Member',
      'backup_caregiver': 'Backup Caregiver',
      'community_supporter': 'Community Helper',
      'emergency_contact': 'Emergency Contact'
    };
    return positionMap[role] || 'Care Team Member';
  }

  static calculateAvailabilityBalance(teamMember: TeamMember): number {
    // Convert availability to a "balance" concept
    // Available = high balance, unavailable = low balance
    switch (teamMember.currentAvailability) {
      case 'available': return 20;
      case 'busy': return 10;
      case 'unavailable': return 0;
      default: return 5;
    }
  }

  static mapGapReasonToTimeOffType(reason: string): TimeOffRequest['type'] {
    const reasonMap: Record<string, TimeOffRequest['type']> = {
      'caregiver_unavailable': 'personal',
      'caregiver_sick': 'sick',
      'caregiver_no_show': 'emergency',
      'emergency': 'emergency',
      'planned_absence': 'vacation'
    };
    return reasonMap[reason] || 'personal';
  }

  static mapGapStatusToTimeOffStatus(status: string): TimeOffRequest['status'] {
    const statusMap: Record<string, TimeOffRequest['status']> = {
      'unresolved': 'pending',
      'pending_response': 'pending',
      'resolved': 'approved'
    };
    return statusMap[status] || 'pending';
  }

  static mapCoverageStatusToProjectStatus(status: string): Project['status'] {
    const statusMap: Record<string, Project['status']> = {
      'covered': 'completed',
      'confirmed': 'in_progress',
      'tentative': 'planning',
      'gap': 'on_hold',
      'at_risk': 'planning'
    };
    return statusMap[status] || 'planning';
  }

  static mapCareTypesToPriority(careTypes: string[]): Project['priority'] {
    if (careTypes.includes('medical')) return 'high';
    if (careTypes.includes('personal_care')) return 'medium';
    return 'low';
  }
}

