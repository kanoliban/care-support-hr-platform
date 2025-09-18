import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  CareCoordinationContext as ICareCoordinationContext,
  CoverageGap,
  TeamMember,
  CoverageWindow,
  Shift,
  NetworkHealthMetrics,
  GapReason
} from '../types/CareCoordinationTypes';
import { robsCareContext } from '../data/RobsCareData';

// ============================================================================
// CARE COORDINATION CONTEXT
// ============================================================================

interface CareCoordinationContextType extends ICareCoordinationContext {
  // Additional context methods for React components
  refreshCoverage: () => void;
  updateTeamMemberAvailability: (memberId: string, availability: 'available' | 'busy' | 'unavailable') => void;
  resolveGap: (gapId: string, resolvedBy: string) => void;
  addTeamMember: (member: TeamMember) => void;
  removeTeamMember: (memberId: string) => void;
  
  // Loading states
  isLoading: boolean;
  lastUpdated: Date;
}

const CareCoordinationContext = createContext<CareCoordinationContextType | undefined>(undefined);

// ============================================================================
// CARE COORDINATION PROVIDER
// ============================================================================

interface CareCoordinationProviderProps {
  children: ReactNode;
}

export function CareCoordinationProvider({ children }: CareCoordinationProviderProps) {
  // Initialize with Rob's data (in production, this would load from API based on coordinator)
  const [careContext, setCareContext] = useState<ICareCoordinationContext>(robsCareContext);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Refresh coverage data (simulates API call)
  const refreshCoverage = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // In production, this would fetch fresh data from API
      setCareContext(prev => ({
        ...prev,
        currentCoverage: [...prev.currentCoverage], // Trigger re-render
      }));
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Update team member availability
  const updateTeamMemberAvailability = (memberId: string, availability: 'available' | 'busy' | 'unavailable') => {
    setCareContext(prev => ({
      ...prev,
      careTeam: prev.careTeam.map(member =>
        member.id === memberId
          ? { ...member, currentAvailability: availability, lastAvailabilityUpdate: new Date().toISOString() }
          : member
      )
    }));
    setLastUpdated(new Date());
  };

  // Resolve a coverage gap
  const resolveGap = (gapId: string, resolvedBy: string) => {
    setCareContext(prev => ({
      ...prev,
      coverageGaps: prev.coverageGaps.map(gap =>
        gap.id === gapId
          ? { ...gap, resolutionStatus: 'resolved' as const, resolvedBy, resolvedAt: new Date().toISOString() }
          : gap
      ),
      // Update corresponding coverage window
      currentCoverage: prev.currentCoverage.map(window => {
        const gap = prev.coverageGaps.find(g => g.id === gapId);
        if (gap && window.id === gap.coverageWindowId) {
          return { ...window, status: 'confirmed' as const, assignedTeamMember: resolvedBy };
        }
        return window;
      })
    }));
    setLastUpdated(new Date());
  };

  // Add team member
  const addTeamMember = (member: TeamMember) => {
    setCareContext(prev => ({
      ...prev,
      careTeam: [...prev.careTeam, member]
    }));
    setLastUpdated(new Date());
  };

  // Remove team member
  const removeTeamMember = (memberId: string) => {
    setCareContext(prev => ({
      ...prev,
      careTeam: prev.careTeam.filter(member => member.id !== memberId)
    }));
    setLastUpdated(new Date());
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshCoverage();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const contextValue: CareCoordinationContextType = {
    ...careContext,
    refreshCoverage,
    updateTeamMemberAvailability,
    resolveGap,
    addTeamMember,
    removeTeamMember,
    isLoading,
    lastUpdated
  };

  return (
    <CareCoordinationContext.Provider value={contextValue}>
      {children}
    </CareCoordinationContext.Provider>
  );
}

// ============================================================================
// HOOK FOR USING CARE COORDINATION CONTEXT
// ============================================================================

export function useCareCoordination() {
  const context = useContext(CareCoordinationContext);
  if (context === undefined) {
    throw new Error('useCareCoordination must be used within a CareCoordinationProvider');
  }
  return context;
}

// ============================================================================
// CONVENIENCE HOOKS FOR SPECIFIC DATA
// ============================================================================

// Hook for current coverage status
export function useCoverageStatus() {
  const context = useCareCoordination();
  
  const coverageStats = {
    totalWindows: context.currentCoverage.length,
    coveredWindows: context.currentCoverage.filter(w => w.status === 'covered' || w.status === 'confirmed').length,
    gapWindows: context.currentCoverage.filter(w => w.status === 'gap').length,
    atRiskWindows: context.currentCoverage.filter(w => w.status === 'at_risk').length,
    coveragePercentage: context.currentCoverage.length > 0 
      ? Math.round((context.currentCoverage.filter(w => w.status === 'covered' || w.status === 'confirmed').length / context.currentCoverage.length) * 100)
      : 0
  };

  return {
    ...coverageStats,
    activeGaps: context.coverageGaps.filter(gap => gap.resolutionStatus !== 'resolved'),
    nextGap: context.coverageGaps
      .filter(gap => gap.resolutionStatus !== 'resolved')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  };
}

// Hook for team availability
export function useTeamAvailability() {
  const context = useCareCoordination();
  
  const teamStats = {
    totalMembers: context.careTeam.length,
    availableMembers: context.careTeam.filter(m => m.currentAvailability === 'available').length,
    busyMembers: context.careTeam.filter(m => m.currentAvailability === 'busy').length,
    unavailableMembers: context.careTeam.filter(m => m.currentAvailability === 'unavailable').length,
    unknownMembers: context.careTeam.filter(m => m.currentAvailability === 'unknown').length
  };

  const membersByRole = {
    paidCaregivers: context.careTeam.filter(m => m.role === 'paid_caregiver'),
    familyCaregivers: context.careTeam.filter(m => m.role === 'family_caregiver'),
    backupCaregivers: context.careTeam.filter(m => m.role === 'backup_caregiver'),
    communitySupport: context.careTeam.filter(m => m.role === 'community_supporter')
  };

  return {
    ...teamStats,
    membersByRole,
    highReliabilityMembers: context.careTeam.filter(m => m.reliability.showUpRate > 0.9),
    availableBackups: context.careTeam.filter(m => 
      m.currentAvailability === 'available' && 
      (m.role === 'backup_caregiver' || m.role === 'family_caregiver')
    )
  };
}

// Hook for current shift information
export function useCurrentShift() {
  const context = useCareCoordination();
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // First, look for an explicit coverage window (overrides regular shifts)
  let currentWindow = context.currentCoverage.find(window => {
    if (window.date !== today) return false;
    
    const startTime = window.startTime;
    const endTime = window.endTime;
    
    // Handle overnight shifts (end time next day)
    if (endTime < startTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  });

  let currentTeamMember = currentWindow?.assignedTeamMember
    ? context.careTeam.find(m => m.id === currentWindow.assignedTeamMember)
    : null;

  // If no explicit coverage window, check regular shifts
  if (!currentWindow) {
    // Find team members with regular shifts that should be active now
    for (const member of context.careTeam) {
      if (member.currentAvailability === 'unavailable' || !member.regularShifts) continue;
      
      for (const regularShift of member.regularShifts) {
        if (!regularShift.isActive || !regularShift.daysOfWeek.includes(dayOfWeek)) continue;
        
        const startTime = regularShift.startTime;
        const endTime = regularShift.endTime;
        
        // Check if current time falls within this regular shift
        let isCurrentShift = false;
        if (endTime < startTime) {
          // Overnight shift
          isCurrentShift = currentTime >= startTime || currentTime <= endTime;
        } else {
          isCurrentShift = currentTime >= startTime && currentTime <= endTime;
        }
        
        if (isCurrentShift) {
          // Create a synthetic coverage window from the regular shift
          currentWindow = {
            id: `regular-${member.id}-${today}`,
            date: today,
            startTime: regularShift.startTime,
            endTime: regularShift.endTime,
            requiredCareTypes: ['personal_care'],
            status: 'confirmed' as any,
            assignedTeamMember: member.id,
            backupOptions: [],
            lastStatusUpdate: new Date().toISOString()
          };
          currentTeamMember = member;
          break;
        }
      }
      if (currentWindow) break;
    }
  }

  // Find next shift - combine coverage windows with regular shifts
  const generateUpcomingShifts = () => {
    const shifts: Array<{ window: any; teamMember: TeamMember | null }> = [];
    
    // Add explicit coverage windows
    context.currentCoverage
      .filter(window => window.date >= today)
      .forEach(window => {
        const teamMember = window.assignedTeamMember
          ? context.careTeam.find(m => m.id === window.assignedTeamMember) || null
          : null;
        shifts.push({ window, teamMember });
      });
    
    // Add regular shifts for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      context.careTeam.forEach(member => {
        if (member.currentAvailability === 'unavailable' || !member.regularShifts) return;
        
        member.regularShifts.forEach(regularShift => {
          if (!regularShift.isActive || !regularShift.daysOfWeek.includes(dayOfWeek)) return;
          
          // Check if there's already an explicit coverage window for this time
          const hasExplicitWindow = context.currentCoverage.some(w => 
            w.date === dateString && 
            w.startTime === regularShift.startTime &&
            w.endTime === regularShift.endTime
          );
          
          if (!hasExplicitWindow) {
            const syntheticWindow = {
              id: `regular-${member.id}-${dateString}`,
              date: dateString,
              startTime: regularShift.startTime,
              endTime: regularShift.endTime,
              requiredCareTypes: ['personal_care'],
              status: 'confirmed' as any,
              assignedTeamMember: member.id,
              backupOptions: [],
              lastStatusUpdate: new Date().toISOString()
            };
            shifts.push({ window: syntheticWindow, teamMember: member });
          }
        });
      });
    }
    
    return shifts
      .sort((a, b) => {
        if (a.window.date !== b.window.date) return a.window.date.localeCompare(b.window.date);
        return a.window.startTime.localeCompare(b.window.startTime);
      })
      .find(shift => {
        if (shift.window.date > today) return true;
        if (shift.window.date === today && shift.window.startTime > currentTime) return true;
        return false;
      });
  };

  const nextShift = generateUpcomingShifts();
  const nextWindow = nextShift?.window || null;
  const nextTeamMember = nextShift?.teamMember || null;

  return {
    currentWindow,
    currentTeamMember,
    nextWindow,
    nextTeamMember,
    isCurrentlyCovered: !!currentWindow && currentWindow.status !== 'gap'
  };
}

export default CareCoordinationContext;