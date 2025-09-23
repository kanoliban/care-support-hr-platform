'use client';

import * as React from 'react';
import { RiUserAddLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Divider from '@/components/ui/divider';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import { InlineWizard } from './inline-wizard';

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
  onSendInvitation?: (data: TeamMemberFormData) => void;
  onSave?: (data: TeamMemberFormData) => void;
  onCancel: () => void;
  currentProfile: any;
}

export function UnifiedTeamForm({
  formData,
  onFormDataChange,
  errors: _errors,
  isInviting = false,
  isSaving = false,
  onSendInvitation,
  onSave,
  onCancel,
  currentProfile
}: UnifiedTeamFormProps) {
  const [mode, setMode] = React.useState<'invite' | 'manual' | null>(null);
  const [isWizardActive, setIsWizardActive] = React.useState(false);

  const handleModeChange = (newMode: 'invite' | 'manual') => {
    setMode(newMode);
    setIsWizardActive(true);
  };

  const handleWizardSubmit = (data: TeamMemberFormData, submissionMode: 'invite' | 'manual') => {
    (Object.entries(data) as [keyof TeamMemberFormData, string][]).forEach(([key, value]) => {
      onFormDataChange(key, value);
    });

    setIsWizardActive(false);
    setMode(null);

    if (submissionMode === 'invite') {
      onSendInvitation?.(data);
    } else {
      onSave?.(data);
    }
  };

  const handleWizardCancel = () => {
    setIsWizardActive(false);
    setMode(null);
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
          value={mode ?? undefined} 
          onValueChange={handleModeChange}
          className="space-y-3"
        >
          <LabelPrimitive.Root
            className={cn(
              'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
              mode === 'invite' && 'shadow-none ring-primary-base',
            )}
          >
            <div className="flex-1 space-y-1">
              <div className="text-label-sm">Invite by Email</div>
              <div className="text-paragraph-xs text-text-sub-600">
                Email an invitation to join the care team.
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
            <div className="flex-1 space-y-1">
              <div className="text-label-sm">Add Manually</div>
              <div className="text-paragraph-xs text-text-sub-600">
                Create a team member without sending an invitation.
              </div>
            </div>
            <Radio.Item value="manual" />
          </LabelPrimitive.Root>
        </Radio.Group>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Show wizard when mode is selected */}
      {!mode && (
        <div className="text-center py-12">
          <div className="text-text-sub-600">
            Choose a method above, then follow the steps to add your team member.
          </div>
        </div>
      )}

      {/* Inline Wizard - Shows when mode is selected */}
      {mode && isWizardActive && (
        <InlineWizard
          key={mode}
          mode={mode}
          initialData={formData}
          onFieldChange={onFormDataChange}
          onSubmit={handleWizardSubmit}
          onCancel={handleWizardCancel}
          isSaving={mode === 'invite' ? isInviting : isSaving}
        />
      )}
    </div>
  );
}
