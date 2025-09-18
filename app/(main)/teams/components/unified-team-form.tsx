'use client';

import * as React from 'react';
import { RiUserAddLine, RiMailLine, RiUserLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import { CareResponsibilitiesSelector } from './care-responsibilities-selector';
import { ManualAddWizard } from './manual-add-wizard';

export interface TeamMemberFormData {
  email: string;
  phone: string;
  name: string;
  teamMemberCategory: 'family' | 'professional' | 'volunteer' | 'organization';
  careRole: string;
  careResponsibilities: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  customMessage: string;
  // Additional fields for manual mode
  schedule: string;
  availabilityType: 'flexible' | 'fixed' | 'on-call';
  careNotes: string;
  photo: string;
}

interface UnifiedTeamFormProps {
  formData: TeamMemberFormData;
  onFormDataChange: (field: keyof TeamMemberFormData, value: string) => void;
  errors: Partial<Record<keyof TeamMemberFormData, string>>;
  isInviting?: boolean;
  isSaving?: boolean;
  onSendInvitation?: () => void;
  onSave?: () => void;
  onCancel: () => void;
  currentProfile: any;
}

export function UnifiedTeamForm({
  formData,
  onFormDataChange,
  errors,
  isInviting = false,
  isSaving = false,
  onSendInvitation,
  onSave,
  onCancel,
  currentProfile
}: UnifiedTeamFormProps) {
  const [mode, setMode] = React.useState<'invite' | 'manual'>('invite');
  const [isManualWizardOpen, setIsManualWizardOpen] = React.useState(false);

  const handleModeChange = (newMode: 'invite' | 'manual') => {
    setMode(newMode);
    if (newMode === 'manual') {
      setIsManualWizardOpen(true);
    }
  };

  const handleManualWizardSave = (wizardData: any) => {
    // Update form data with wizard data
    Object.keys(wizardData).forEach(key => {
      onFormDataChange(key, wizardData[key]);
    });
    setIsManualWizardOpen(false);
    // Trigger save
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Following onboarding pattern */}
      <div className="flex flex-col items-center space-y-2">
        <div
          className={cn(
            'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24',
            'before:absolute before:inset-0 before:rounded-full',
            'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-gradient-to-b after:from-neutral-500 after:to-transparent after:opacity-[.16]',
            'after:mask-exclude after:p-px',
          )}
        >
          <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 lg:size-16">
            <RiUserAddLine className="size-6 text-text-sub-600 lg:size-8" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <div className="text-title-h6 lg:text-title-h5">
            Add Team Member
          </div>
          <div className="text-paragraph-sm text-text-sub-600 lg:text-paragraph-md">
            Add a new member to <span className="font-medium">{currentProfile?.name}</span> care team
          </div>
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Mode Selection - Following role selection pattern from onboarding */}
      <div className="space-y-3">
        <div className="text-label-sm text-center">How would you like to add this team member?</div>
        <Radio.Group 
          value={mode} 
          onValueChange={handleModeChange}
          className="space-y-3"
        >
          <LabelPrimitive.Root
            className={cn(
              'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
              mode === 'invite' && 'shadow-none ring-primary-base',
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200">
              <RiMailLine className="size-5 text-text-sub-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-label-sm">Send Invitation</div>
              <div className="text-paragraph-xs text-text-sub-600">
                Invite someone to join the care team via email
              </div>
            </div>
            <Radio.Item value="invite" />
          </LabelPrimitive.Root>
          
          <LabelPrimitive.Root
            className={cn(
              'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
              mode === 'manual' && 'shadow-none ring-primary-base',
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200">
              <RiUserLine className="size-5 text-text-sub-600" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="text-label-sm">Add Manually</div>
              <div className="text-paragraph-xs text-text-sub-600">
                Add team member directly without invitation
              </div>
            </div>
            <Radio.Item value="manual" />
          </LabelPrimitive.Root>
        </Radio.Group>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Form Fields - Following auth form patterns */}
      <div className="space-y-4">
        {/* Basic Information */}
        <div className="space-y-3">
          <div className="text-label-sm">Basic Information</div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="name">
              Full Name <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange('name', e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className={errors.name ? 'border-red-500' : ''}
                />
              </Input.Wrapper>
            </Input.Root>
            {errors.name && (
              <div className="text-xs text-red-600">{errors.name}</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label.Root htmlFor="email">
                Email Address {mode === 'invite' && <Label.Asterisk />}
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Icon as={RiMailLine} />
                  <Input.Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => onFormDataChange('email', e.target.value)}
                    placeholder="colleague@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.email && (
                <div className="text-xs text-red-600">{errors.email}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label.Root htmlFor="phone">Phone Number</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onFormDataChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.phone && (
                <div className="text-xs text-red-600">{errors.phone}</div>
              )}
            </div>
          </div>
        </div>

        {/* Role & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="category">
              Team Member Category <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={formData.teamMemberCategory}
              onValueChange={(value) => onFormDataChange('teamMemberCategory', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select category" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="family">Family Member</Select.Item>
                <Select.Item value="professional">Professional Caregiver</Select.Item>
                <Select.Item value="volunteer">Volunteer</Select.Item>
                <Select.Item value="organization">Organization</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="role">
              Role & Permissions <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={formData.role}
              onValueChange={(value) => onFormDataChange('role', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select role" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="member">Member - Basic access</Select.Item>
                <Select.Item value="admin">Admin - Manage team</Select.Item>
                <Select.Item value="viewer">Viewer - Read only</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        {/* Care Information */}
        <div className="space-y-3">
          <div className="text-label-sm">Care Information</div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="care-role">
              Care Role <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="care-role"
                  value={formData.careRole}
                  onChange={(e) => onFormDataChange('careRole', e.target.value)}
                  placeholder="e.g., Primary PCA, Family Coordinator"
                  className={errors.careRole ? 'border-red-500' : ''}
                />
              </Input.Wrapper>
            </Input.Root>
            {errors.careRole && (
              <div className="text-xs text-red-600">{errors.careRole}</div>
            )}
          </div>

          <CareResponsibilitiesSelector
            value={formData.careResponsibilities}
            onChange={(value) => onFormDataChange('careResponsibilities', value)}
            error={errors.careResponsibilities}
          />
        </div>

        {/* Manual Mode - Now handled by wizard */}
        {mode === 'manual' && (
          <div className="bg-bg-soft-50 p-4 rounded-lg border border-stroke-soft-200">
            <div className="text-center space-y-3">
              <div className="text-text-strong-950 font-medium">
                Manual Entry Wizard
              </div>
              <div className="text-sm text-text-sub-600">
                Click "Add Manually" above to open the detailed setup wizard with scheduling and recurrence options.
              </div>
            </div>
          </div>
        )}

        {/* Invitation Message for Invite Mode */}
        {mode === 'invite' && (
          <div className="space-y-2">
            <Label.Root htmlFor="message">Personal Message (Optional)</Label.Root>
            <Textarea.Root
              id="message"
              value={formData.customMessage}
              onChange={(e) => onFormDataChange('customMessage', e.target.value)}
              placeholder="Add a personal message to include with the invitation..."
              rows={3}
            />
          </div>
        )}
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Action Buttons - Following onboarding pattern */}
      <div className="flex justify-end gap-3">
        <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
          Cancel
        </Button.Root>
        <FancyButton.Root 
          variant="primary" 
          size="medium"
          onClick={mode === 'invite' ? onSendInvitation : onSave}
          disabled={mode === 'invite' ? isInviting : isSaving}
        >
          {mode === 'invite' 
            ? (isInviting ? 'Sending Invitation...' : 'Send Invitation')
            : (isSaving ? 'Adding Member...' : 'Add Team Member')
          }
        </FancyButton.Root>
      </div>

      {/* Manual Add Wizard */}
      <ManualAddWizard
        isOpen={isManualWizardOpen}
        onClose={() => setIsManualWizardOpen(false)}
        onSave={handleManualWizardSave}
        currentProfile={currentProfile}
      />
    </div>
  );
}
