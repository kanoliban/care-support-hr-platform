'use client';

import React, { createContext, useContext, useState } from 'react';

// Simple types for the permission context
export interface CareProfile {
  id: string;
  name: string;
  subtitle: string;
  userRole: 'owner' | 'admin' | 'member' | 'viewer';
  avatar: string;
}

export interface UserPermissions {
  canManageTeam: boolean;
  canViewSensitive: boolean;
  canManageBilling: boolean;
  canDeleteProfile: boolean;
  canInviteMembers: boolean;
  canExportData: boolean;
  canManageOrganization: boolean;
  canManageIntegrations: boolean;
  canManageSecurity: boolean;
}

interface PermissionContextType {
  currentProfile: CareProfile | null;
  userPermissions: UserPermissions | null;
  availableProfiles: CareProfile[];
  switchProfile: (profileId: string) => void;
}

// Mock data
const mockProfiles: CareProfile[] = [
  {
    id: 'robs-care-team',
    name: "Rob's Care Team",
    subtitle: "Primary Care Coordination",
    userRole: 'owner',
    avatar: '/images/avatar/illustration/james.png' // Rob's avatar
  },
  {
    id: 'luanns-care-team',
    name: "Luann's Care Team",
    subtitle: "Family Care Support",
    userRole: 'admin',
    avatar: '/images/avatar/illustration/sophia.png' // Luann's avatar
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
        canManageOrganization: true,
        canManageIntegrations: true,
        canManageSecurity: true,
      };
    case 'admin':
      return {
        canManageTeam: true,
        canViewSensitive: true,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: true,
        canExportData: true,
        canManageOrganization: true,
        canManageIntegrations: true,
        canManageSecurity: false,
      };
    case 'member':
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      };
    case 'viewer':
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      };
    default:
      return {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      };
  }
};

// Context
const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: React.ReactNode;
}

export function SimplePermissionProvider({ children }: PermissionProviderProps) {
  const [currentProfile, setCurrentProfile] = useState<CareProfile | null>(mockProfiles[0]);
  const [availableProfiles] = useState<CareProfile[]>(mockProfiles);

  const switchProfile = (profileId: string) => {
    const profile = availableProfiles.find(p => p.id === profileId);
    if (profile) {
      setCurrentProfile(profile);
    }
  };

  const userPermissions = currentProfile ? getPermissionsForRole(currentProfile.userRole) : null;

  const value: PermissionContextType = {
    currentProfile,
    userPermissions,
    availableProfiles,
    switchProfile,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export const useSimplePermissions = () => {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('useSimplePermissions must be used within a SimplePermissionProvider');
  }
  return context;
};
