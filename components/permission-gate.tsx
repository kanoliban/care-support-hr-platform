'use client';

import * as React from 'react';
import { useSimplePermissions } from '@/lib/simple-permission-context';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: keyof NonNullable<ReturnType<typeof useSimplePermissions>['userPermissions']>;
  role?: 'owner' | 'admin' | 'member' | 'viewer';
  fallback?: React.ReactNode;
  hideIfNoPermission?: boolean;
}

export function PermissionGate({
  children,
  permission,
  role,
  fallback = null,
  hideIfNoPermission = true,
}: PermissionGateProps) {
  const { userPermissions, currentProfile } = useSimplePermissions();

  // If no permission or role is specified, always show children
  if (!permission && !role) {
    return <>{children}</>;
  }

  // Check role-based access
  if (role && currentProfile?.userRole !== role) {
    return hideIfNoPermission ? null : <>{fallback}</>;
  }

  // Check permission-based access
  if (permission && (!userPermissions || !userPermissions[permission])) {
    return hideIfNoPermission ? null : <>{fallback}</>;
  }

  // User has required permissions/role
  return <>{children}</>;
}

// Convenience components for common permission patterns
export function OwnerOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate role="owner" fallback={fallback}>{children}</PermissionGate>;
}

export function AdminOrOwner({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { currentProfile } = useSimplePermissions();
  const hasAccess = currentProfile?.userRole === 'owner' || currentProfile?.userRole === 'admin';
  return hasAccess ? <>{children}</> : (fallback ? <>{fallback}</> : null);
}

export function CanManageTeam({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canManageTeam" fallback={fallback}>{children}</PermissionGate>;
}

export function CanExportData({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canExportData" fallback={fallback}>{children}</PermissionGate>;
}

export function CanManageOrganization({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canManageOrganization" fallback={fallback}>{children}</PermissionGate>;
}

export function CanManageIntegrations({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canManageIntegrations" fallback={fallback}>{children}</PermissionGate>;
}

export function CanManageSecurity({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return <PermissionGate permission="canManageSecurity" fallback={fallback}>{children}</PermissionGate>;
}
