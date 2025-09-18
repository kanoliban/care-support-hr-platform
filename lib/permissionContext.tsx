'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export interface CareProfile {
  id: string;
  name: string;
  subtitle: string;
  logo: string;
  ownerId: string;
  userRole: 'owner' | 'admin' | 'member' | 'viewer';
  description?: string;
}

export interface UserPermissions {
  canManageTeam: boolean;
  canViewSensitive: boolean;
  canManageBilling: boolean;
  canDeleteProfile: boolean;
  canInviteMembers: boolean;
  canExportData: boolean;
}

export interface ProfileMember {
  id: string;
  profileId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: UserPermissions;
  invitedBy: string;
  joinedAt: Date;
}

interface PermissionContextType {
  currentProfile: CareProfile | null;
  userPermissions: UserPermissions | null;
  availableProfiles: CareProfile[];
  switchProfile: (profileId: string) => void;
  canPerformAction: (action: string) => boolean;
  isLoading: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockCareProfiles: CareProfile[] = [
  {
    id: 'robs-care',
    name: "Rob's Care",
    subtitle: "Care Team",
    logo: "/icons/rob-care.svg",
    ownerId: 'rob-wudlick',
    userRole: 'owner',
    description: "Rob's personal care coordination"
  },
  {
    id: 'luanns-care',
    name: "Luann's Care",
    subtitle: "Family Care", 
    logo: "/icons/luann-care.svg",
    ownerId: 'luann-wudlick',
    userRole: 'admin',
    description: "Luann's care coordination"
  },
  {
    id: 'community-care',
    name: "Community Care",
    subtitle: "Shared Resources",
    logo: "/icons/community-care.svg", 
    ownerId: 'marta-snow',
    userRole: 'member',
    description: "Community care resources"
  }
];

const getPermissionsForRole = (role: 'owner' | 'admin' | 'member' | 'viewer'): UserPermissions => {
  switch (role) {
    case 'owner':
      return {
        canManageTeam: true,
        canViewSensitive: true,
        canManageBilling: true,
        canDeleteProfile: true,
        canInviteMembers: true,
        canExportData: true,
      };
    case 'admin':
      return {
        canManageTeam: true,
        canViewSensitive: true,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: true,
        canExportData: true,
      };
    case 'member':
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
      };
    case 'viewer':
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
      };
    default:
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
      };
  }
};

// ============================================================================
// CONTEXT
// ============================================================================

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: React.ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [currentProfile, setCurrentProfile] = useState<CareProfile | null>(null);
  const [availableProfiles, setAvailableProfiles] = useState<CareProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize profiles and set default
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setAvailableProfiles(mockCareProfiles);
      setCurrentProfile(mockCareProfiles[0]); // Default to Rob's Care
      setIsLoading(false);
    }, 100);
  }, []);

  const switchProfile = (profileId: string) => {
    const profile = availableProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  const userPermissions = currentProfile ? getPermissionsForRole(currentProfile.userRole) : null;

  const canPerformAction = (action: string): boolean => {
    if (!userPermissions) return false;
    
    switch (action) {
      case 'manageTeam':
        return userPermissions.canManageTeam;
      case 'viewSensitive':
        return userPermissions.canViewSensitive;
      case 'manageBilling':
        return userPermissions.canManageBilling;
      case 'deleteProfile':
        return userPermissions.canDeleteProfile;
      case 'inviteMembers':
        return userPermissions.canInviteMembers;
      case 'exportData':
        return userPermissions.canExportData;
      default:
        return false;
    }
  };

  const value: PermissionContextType = {
    currentProfile,
    userPermissions,
    availableProfiles,
    switchProfile,
    canPerformAction,
    isLoading,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// Default export for easier importing
export default usePermissions;
