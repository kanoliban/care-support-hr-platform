'use client';

import * as React from 'react';
import { useAtom } from 'jotai';
import { cn } from '@/utils/cn';

import { RiShieldCheckLine, RiEyeLine, RiEyeOffLine, RiSettingsLine, RiShareLine, RiLockLine } from '@remixicon/react';

import * as Label from '@/components/ui/label';
import { Group as RadioGroup, Item as RadioItem } from '@/components/ui/radio';
import { Root as SwitchRoot } from '@/components/ui/switch';
import * as Select from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import { activeStepAtom, onboardingDataAtom, stepValidationAtom, nextStepAtom, prevStepAtom, canProceedAtom } from './store';

const PERMISSION_ROLES = [
  {
    id: 'coordinator',
    name: 'Care Coordinator',
    description: 'Full access to manage the entire care team and all information',
    capabilities: 'I can manage the entire care team, access all medical information, edit schedules, and invite new members to help coordinate care.',
    icon: RiShieldCheckLine,
    permissions: {
      canViewSchedule: true,
      canEditSchedule: true,
      canViewMedicalInfo: true,
      canEditMedicalInfo: true,
      canManageTeam: true,
      canInviteMembers: true,
      canExportData: true,
    },
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'admin',
    name: 'Team Admin',
    description: 'Manage team members and schedules, view all information',
    capabilities: 'I can manage team members, edit schedules, view medical information, and invite new people to join the care team.',
    icon: RiSettingsLine,
    permissions: {
      canViewSchedule: true,
      canEditSchedule: true,
      canViewMedicalInfo: true,
      canEditMedicalInfo: false,
      canManageTeam: true,
      canInviteMembers: true,
      canExportData: true,
    },
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'member',
    name: 'Team Member',
    description: 'Basic access to view schedules and limited information',
    capabilities: 'I can view the care schedule, send messages to the team, and update my own profile information.',
    icon: RiEyeLine,
    permissions: {
      canViewSchedule: true,
      canEditSchedule: false,
      canViewMedicalInfo: false,
      canEditMedicalInfo: false,
      canManageTeam: false,
      canInviteMembers: false,
      canExportData: false,
    },
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to basic schedule information',
    capabilities: 'I can only look at the care schedule and basic information without making any changes.',
    icon: RiEyeOffLine,
    permissions: {
      canViewSchedule: true,
      canEditSchedule: false,
      canViewMedicalInfo: false,
      canEditMedicalInfo: false,
      canManageTeam: false,
      canInviteMembers: false,
      canExportData: false,
    },
    color: 'bg-gray-50 border-gray-200 text-gray-700',
  },
];

const DATA_SHARING_OPTIONS = [
  {
    id: 'family',
    label: 'Share with Family Members',
    description: 'Allow family members to view care information and schedules',
    defaultEnabled: true,
  },
  {
    id: 'healthcare',
    label: 'Share with Healthcare Providers',
    description: 'Enable healthcare providers to access medical information when needed',
    defaultEnabled: true,
  },
  {
    id: 'caregivers',
    label: 'Share with Caregivers',
    description: 'Allow caregivers to view relevant care information for their shifts',
    defaultEnabled: false,
  },
  {
    id: 'emergency',
    label: 'Emergency Access',
    description: 'Enable emergency contacts to access critical information',
    defaultEnabled: true,
  },
];

const PRIVACY_SETTINGS = [
  {
    id: 'anonymize',
    label: 'Anonymize Data',
    description: 'Remove personal identifiers from data when sharing externally',
    defaultEnabled: false,
  },
  {
    id: 'backup',
    label: 'Automatic Backup',
    description: 'Automatically backup care data to secure cloud storage',
    defaultEnabled: true,
  },
  {
    id: 'encryption',
    label: 'End-to-End Encryption',
    description: 'Encrypt all data in transit and at rest',
    defaultEnabled: true,
  },
  {
    id: 'audit',
    label: 'Access Audit Logs',
    description: 'Keep detailed logs of who accessed what information',
    defaultEnabled: true,
  },
];

export default function StepPermissions() {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);
  const [onboardingData, setOnboardingData] = useAtom(onboardingDataAtom);
  const [stepValidation, setStepValidation] = useAtom(stepValidationAtom);
  const [canProceed] = useAtom(canProceedAtom);
  const [, nextStep] = useAtom(nextStepAtom);
  const [, prevStep] = useAtom(prevStepAtom);

  const [defaultRole, setDefaultRole] = React.useState<string>('member');
  const [dataSharing, setDataSharing] = React.useState({
    family: true,
    healthcare: true,
    caregivers: false,
    emergency: true,
  });
  const [privacySettings, setPrivacySettings] = React.useState({
    anonymize: false,
    backup: true,
    encryption: true,
    audit: true,
  });
  const [dataRetention, setDataRetention] = React.useState('2');

  const validateStep = React.useCallback(() => {
    // Permissions step is optional - user can skip this step
    const isValid = true; // Always allow Continue/Skip
    setStepValidation(prev => ({ ...prev, [activeStep]: isValid }));
  }, [activeStep, setStepValidation]);

  React.useEffect(() => {
    validateStep();
  }, [validateStep]);

  // Global Enter key support
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && canProceed) {
        e.preventDefault();
        nextStep();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [canProceed, nextStep]);

  const handleContinue = () => {
    if (canProceed) {
      // Save permissions data
      setOnboardingData(prev => ({
        ...prev,
        permissions: {
          teamPermissions: PERMISSION_ROLES.map(role => ({
            role: role.id,
            canViewSchedule: role.permissions.canViewSchedule,
            canEditSchedule: role.permissions.canEditSchedule,
            canViewMedicalInfo: role.permissions.canViewMedicalInfo,
            canEditMedicalInfo: role.permissions.canEditMedicalInfo,
          })),
          dataSharing: {
            shareWithFamily: dataSharing.family,
            shareWithHealthcare: dataSharing.healthcare,
            shareWithCaregivers: dataSharing.caregivers,
          },
          privacySettings: {
            anonymizeData: privacySettings.anonymize,
            dataRetention: dataRetention,
            backupEnabled: privacySettings.backup,
          },
        }
      }));
      nextStep();
    }
  };

  // Keyboard event handler for Enter key
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const handleDataSharingChange = (key: string, value: boolean) => {
    setDataSharing(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacySettingChange = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-title-h4 lg:text-title-h3 mb-2">
          Configure Permissions & Privacy
        </h1>
        <p className="text-paragraph-md text-text-sub-600">
          Set up who can access what information and how your data is protected.
        </p>
      </div>

      <div className="rounded-lg border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
        <Tabs defaultValue="permissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 border-b border-stroke-soft-200 bg-bg-white-0 mb-4">
            <TabsTrigger 
              value="permissions" 
              className="flex items-center justify-center gap-2 px-4 py-2 text-paragraph-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary-base data-[state=active]:text-primary-base hover:text-text-strong-950 transition-colors"
            >
              <RiShieldCheckLine className="size-4" />
              Team Permissions
            </TabsTrigger>
            <TabsTrigger 
              value="sharing" 
              className="flex items-center justify-center gap-2 px-4 py-2 text-paragraph-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary-base data-[state=active]:text-primary-base hover:text-text-strong-950 transition-colors"
            >
              <RiShareLine className="size-4" />
              Data Sharing
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="flex items-center justify-center gap-2 px-4 py-2 text-paragraph-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary-base data-[state=active]:text-primary-base hover:text-text-strong-950 transition-colors"
            >
              <RiLockLine className="size-4" />
              Privacy & Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="p-6">
            <div className="mb-6">
              <Label.Root className='text-label-lg font-medium mb-2 block'>
                Team Permission Levels <Label.Asterisk />
              </Label.Root>
              <p className="text-paragraph-sm text-text-sub-600 mb-4">
                Define what level of access new team members will have by default.
              </p>
            </div>

            <RadioGroup
              value={defaultRole}
              onValueChange={setDefaultRole}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {PERMISSION_ROLES.map((role) => {
                const IconComponent = role.icon;
                const isSelected = defaultRole === role.id;
                
                return (
                  <div
                    key={role.id}
                    className={cn(
                      'relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
                      isSelected 
                        ? `${role.color} ring-2 ring-current ring-opacity-20` 
                        : 'border-stroke-soft-200 bg-bg-white-0 hover:border-stroke-soft-300'
                    )}
                    onClick={() => setDefaultRole(role.id)}
                  >
                    <div className="flex items-start gap-3">
                      <RadioItem value={role.id} className="mt-1" />
                      <IconComponent className="size-5 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-label-sm font-medium mb-2">{role.name}</h3>
                          <p className="text-paragraph-xs text-text-sub-600 leading-relaxed">
                            {role.capabilities}
                          </p>
                        </div>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="sharing" className="p-6">
            <div className="mb-6">
              <Label.Root className='text-label-lg font-medium mb-2 block'>
                Data Sharing Settings
              </Label.Root>
              <p className="text-paragraph-sm text-text-sub-600">
                Control who can access different types of information within your care network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DATA_SHARING_OPTIONS.map((option) => (
                <div key={option.id} className="flex items-start gap-3 p-4 rounded-lg border border-stroke-soft-200 bg-bg-soft-50">
                  <SwitchRoot
                    checked={dataSharing[option.id as keyof typeof dataSharing]}
                    onCheckedChange={(checked) => handleDataSharingChange(option.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="text-label-sm font-medium mb-1">{option.label}</h3>
                    <p className="text-paragraph-xs text-text-sub-600">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="p-6">
            <div className="mb-6">
              <Label.Root className='text-label-lg font-medium mb-2 block'>
                Privacy & Security Controls
              </Label.Root>
              <p className="text-paragraph-sm text-text-sub-600">
                Configure advanced privacy and security settings to protect sensitive information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {PRIVACY_SETTINGS.map((setting) => (
                <div key={setting.id} className="flex items-start gap-3 p-4 rounded-lg border border-stroke-soft-200 bg-bg-soft-50">
                  <SwitchRoot
                    checked={privacySettings[setting.id as keyof typeof privacySettings]}
                    onCheckedChange={(checked) => handlePrivacySettingChange(setting.id, checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className="text-label-sm font-medium mb-1">{setting.label}</h3>
                    <p className="text-paragraph-xs text-text-sub-600">
                      {setting.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Data Retention */}
            <div className="p-4 rounded-lg border border-stroke-soft-200 bg-bg-soft-50">
              <Label.Root className='text-label-sm font-medium mb-3 block'>
                Data Retention Period
              </Label.Root>
              <p className="text-paragraph-xs text-text-sub-600 mb-4">
                How long should we keep care data after it's no longer needed?
              </p>
              <Select.Root
                value={dataRetention}
                onValueChange={setDataRetention}
              >
                <Select.Trigger className="w-full max-w-xs">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="1">1 Year</Select.Item>
                  <Select.Item value="2">2 Years</Select.Item>
                  <Select.Item value="5">5 Years</Select.Item>
                  <Select.Item value="10">10 Years</Select.Item>
                  <Select.Item value="indefinite">Indefinitely</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Summary Section */}
      {canProceed && (
        <div className="mt-6 rounded-lg border border-success-base bg-success-alpha-10 p-4">
          <div className="flex items-center gap-2 text-success-base mb-2">
            <RiShieldCheckLine className="size-4" />
            <span className="text-paragraph-sm font-medium">Privacy Configuration Complete</span>
          </div>
          <div className="text-paragraph-xs text-text-sub-600">
            {PERMISSION_ROLES.find(role => role.id === defaultRole)?.name} permissions set as default. 
            Data sharing configured for {Object.values(dataSharing).filter(Boolean).length} groups. 
            Privacy settings enabled with {dataRetention}-year retention.
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={prevStep}
          className={cn(
            "group relative inline-flex items-center justify-center whitespace-nowrap outline-none transition duration-200 ease-out focus:outline-none bg-bg-weak-100 text-text-sub-600 hover:bg-bg-weak-200 h-10 gap-3 rounded-10 px-3.5 text-label-sm"
          )}
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={nextStep}
            onKeyDown={(e) => handleKeyDown(e, nextStep)}
            className={cn(
              "group relative inline-flex items-center justify-center whitespace-nowrap outline-none transition duration-200 ease-out focus:outline-none bg-bg-weak-100 text-text-sub-600 hover:bg-bg-weak-200 h-10 gap-3 rounded-10 px-3.5 text-label-sm"
            )}
          >
            Skip
          </button>
          <button
            onClick={handleContinue}
            onKeyDown={(e) => handleKeyDown(e, handleContinue)}
            disabled={!canProceed}
            className={cn(
              "group relative inline-flex items-center justify-center whitespace-nowrap outline-none transition duration-200 ease-out focus:outline-none disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-text-disabled-300 disabled:ring-transparent h-10 gap-3 rounded-10 px-3.5 text-label-sm",
              canProceed
                ? "bg-primary-base text-static-white hover:bg-primary-darker focus-visible:shadow-button-primary-focus"
                : "bg-bg-weak-50 text-text-disabled-300"
            )}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}