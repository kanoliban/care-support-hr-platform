'use client';

import * as React from 'react';
import { RiShieldUserLine, RiUserSettingsLine, RiEyeLine, RiSettings3Line } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as Switch from '@/components/ui/switch';
import * as Label from '@/components/ui/label';

export interface PermissionsData {
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: {
    canManageTeam: boolean;
    canViewSensitive: boolean;
    canManageBilling: boolean;
    canDeleteProfile: boolean;
    canInviteMembers: boolean;
    canExportData: boolean;
    canManageOrganization: boolean;
    canManageIntegrations: boolean;
    canManageSecurity: boolean;
  };
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: PermissionsData;
  onSave: (data: PermissionsData) => void;
  isLoading?: boolean;
}

export function PermissionsModal({
  isOpen,
  onClose,
  memberData,
  onSave,
  isLoading = false
}: PermissionsModalProps) {
  const [formData, setFormData] = React.useState<PermissionsData>(memberData);

  // Update form data when memberData changes
  React.useEffect(() => {
    setFormData(memberData);
  }, [memberData]);

  const handleRoleChange = (role: 'owner' | 'admin' | 'member' | 'viewer') => {
    // Set default permissions based on role
    const defaultPermissions = {
      owner: {
        canManageTeam: true,
        canViewSensitive: true,
        canManageBilling: true,
        canDeleteProfile: true,
        canInviteMembers: true,
        canExportData: true,
        canManageOrganization: true,
        canManageIntegrations: true,
        canManageSecurity: true,
      },
      admin: {
        canManageTeam: true,
        canViewSensitive: true,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: true,
        canExportData: true,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      },
      member: {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      },
      viewer: {
        canManageTeam: false,
        canViewSensitive: false,
        canManageBilling: false,
        canDeleteProfile: false,
        canInviteMembers: false,
        canExportData: false,
        canManageOrganization: false,
        canManageIntegrations: false,
        canManageSecurity: false,
      },
    };

    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role]
    }));
  };

  const handlePermissionChange = (permission: keyof PermissionsData['permissions'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const roleOptions = [
    {
      value: 'viewer',
      icon: RiEyeLine,
      title: 'Viewer',
      description: 'Read-only access to care information and schedules',
      color: 'text-blue-600'
    },
    {
      value: 'member',
      icon: RiUserSettingsLine,
      title: 'Member',
      description: 'Basic access to care coordination and updates',
      color: 'text-green-600'
    },
    {
      value: 'admin',
      icon: RiShieldUserLine,
      title: 'Admin',
      description: 'Manage team members and care coordination',
      color: 'text-orange-600'
    },
    {
      value: 'owner',
      icon: RiSettings3Line,
      title: 'Owner',
      description: 'Full access to all features and settings',
      color: 'text-red-600'
    }
  ] as const;

  const permissionLabels = {
    canManageTeam: 'Manage Team Members',
    canViewSensitive: 'View Sensitive Information',
    canManageBilling: 'Manage Billing & Payments',
    canDeleteProfile: 'Delete Profile',
    canInviteMembers: 'Invite New Members',
    canExportData: 'Export Data',
    canManageOrganization: 'Manage Organization',
    canManageIntegrations: 'Manage Integrations',
    canManageSecurity: 'Manage Security Settings'
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className="max-w-3xl">
        <Modal.Header
          icon={RiShieldUserLine}
          title="Manage Permissions"
          description="Set role and permissions for this team member"
        />

        <Modal.Body>
          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <div className="text-label-sm">Select Role</div>
              <div className="text-paragraph-sm text-text-sub-600">
                Choose the appropriate role for this team member. This will set default permissions that can be customized below.
              </div>
              
              <Radio.Group 
                value={formData.role} 
                onValueChange={handleRoleChange}
                className="space-y-3"
              >
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <LabelPrimitive.Root
                      key={option.value}
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                        formData.role === option.value && 'shadow-none ring-primary-base',
                      )}
                    >
                      <div className={cn(
                        'flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200',
                        option.color
                      )}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-label-sm">{option.title}</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                          {option.description}
                        </div>
                      </div>
                      <Radio.Item value={option.value} />
                    </LabelPrimitive.Root>
                  );
                })}
              </Radio.Group>
            </div>

            {/* Custom Permissions */}
            <div className="space-y-4">
              <div className="text-label-sm">Custom Permissions</div>
              <div className="text-paragraph-sm text-text-sub-600">
                Fine-tune specific permissions for this team member.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissionLabels).map(([key, label]) => {
                  const permissionKey = key as keyof PermissionsData['permissions'];
                  return (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <Label.Root htmlFor={key} className="text-sm font-medium">
                        {label}
                      </Label.Root>
                      <Switch.Root
                        id={key}
                        checked={formData.permissions[permissionKey]}
                        onCheckedChange={(checked) => handlePermissionChange(permissionKey, checked)}
                        disabled={formData.role === 'owner'} // Owner has all permissions
                      />
                    </div>
                  );
                })}
              </div>
              
              {formData.role === 'owner' && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Owner Role:</strong> All permissions are enabled and cannot be modified.
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex justify-end gap-3">
            <Button.Root variant="neutral" mode="stroke" onClick={onClose}>
              Cancel
            </Button.Root>
            <FancyButton.Root 
              variant="primary" 
              size="medium"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Permissions'}
            </FancyButton.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
