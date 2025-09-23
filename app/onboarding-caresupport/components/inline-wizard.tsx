'use client';

import * as React from 'react';

import {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNextTrigger,
  StepperPrevTrigger,
  StepperTitle,
  StepperTrigger,
  StepperSeparator,
  type StepperChangeDetails,
} from '@/components/ui/stepper';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';

import { CareResponsibilitiesSelector } from './care-responsibilities-selector';

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

export interface InlineWizardProps {
  mode: 'invite' | 'manual';
  initialData: TeamMemberFormData;
  onFieldChange: (field: keyof TeamMemberFormData, value: string) => void;
  onSubmit: (data: TeamMemberFormData, mode: 'invite' | 'manual') => void;
  onCancel: () => void;
  isSaving?: boolean;
}

type WizardStep = 'basic' | 'care' | 'review';

const steps: Array<{
  id: WizardStep;
  title: string;
  description: string;
}> = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Contact and profile details.',
  },
  {
    id: 'care',
    title: 'Care Role',
    description: 'Define responsibilities and scope.',
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Confirm everything looks correct.',
  },
];

type WizardFormData = {
  name: string;
  email: string;
  phone: string;
  teamMemberCategory: TeamMemberFormData['teamMemberCategory'] | '';
  role: TeamMemberFormData['role'] | '';
  careRole: string;
  careResponsibilities: string;
  personalMessage: string;
};

const defaultWizardState: WizardFormData = {
  name: '',
  email: '',
  phone: '',
  teamMemberCategory: '',
  role: '',
  careRole: '',
  careResponsibilities: '',
  personalMessage: '',
};

export function InlineWizard({
  mode,
  initialData,
  onFieldChange,
  onSubmit,
  onCancel,
  isSaving = false,
}: InlineWizardProps) {
  const [currentStep, setCurrentStep] = React.useState<WizardStep>('basic');
  const [formData, setFormData] = React.useState<WizardFormData>(() => ({
    ...defaultWizardState,
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    teamMemberCategory: initialData.teamMemberCategory ?? 'family',
    role: initialData.role ?? 'member',
    careRole: initialData.careRole,
    careResponsibilities: initialData.careResponsibilities,
    personalMessage: initialData.customMessage ?? '',
  }));
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleFieldChange = React.useCallback(
    (field: keyof WizardFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      switch (field) {
        case 'name':
          onFieldChange('name', value);
          break;
        case 'email':
          onFieldChange('email', value);
          break;
        case 'phone':
          onFieldChange('phone', value);
          break;
        case 'teamMemberCategory':
          onFieldChange(
            'teamMemberCategory',
            (value as TeamMemberFormData['teamMemberCategory']) ?? 'family',
          );
          break;
        case 'role':
          onFieldChange('role', (value as TeamMemberFormData['role']) ?? 'member');
          break;
        case 'careRole':
          onFieldChange('careRole', value);
          break;
        case 'careResponsibilities':
          onFieldChange('careResponsibilities', value);
          break;
        case 'personalMessage':
          onFieldChange('customMessage', value);
          break;
        default:
          break;
      }

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [errors, onFieldChange],
  );

  const validateStep = React.useCallback(
    (stepId: WizardStep): boolean => {
      const newErrors: Record<string, string> = {};

      if (stepId === 'basic') {
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        if (!formData.email.trim() && !formData.phone.trim()) {
          newErrors.email = 'Email or phone number is required.';
        } else if (
          formData.email.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.teamMemberCategory)
          newErrors.teamMemberCategory = 'Category is required.';
        if (!formData.role) newErrors.role = 'Role is required.';
      }

      if (stepId === 'care') {
        if (!formData.careRole.trim()) newErrors.careRole = 'Care role is required.';
        if (!formData.careResponsibilities.trim())
          newErrors.careResponsibilities = 'Care responsibilities are required.';
      }

      setErrors((prev) => ({ ...prev, ...newErrors }));

      return Object.keys(newErrors).length === 0;
    },
    [formData],
  );

  const handleValidate = React.useCallback(
    async ({ previousValue, nextValue, direction }: StepperChangeDetails) => {
      if (direction !== 'forward') return true;

      const prevIndex = previousValue
        ? steps.findIndex((step) => step.id === (previousValue as WizardStep))
        : -1;
      const nextIndex = steps.findIndex((step) => step.id === (nextValue as WizardStep));

      if (prevIndex !== -1 && nextIndex > prevIndex + 1) {
        return false;
      }

      const stepToCheck = (previousValue as WizardStep) ?? 'basic';
      return validateStep(stepToCheck);
    },
    [validateStep],
  );

  const handleValueChange = React.useCallback(({ nextValue }: StepperChangeDetails) => {
    setCurrentStep(nextValue as WizardStep);
  }, []);

  const normalizeData = React.useCallback(
    (): TeamMemberFormData => ({
      ...initialData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      teamMemberCategory: (formData.teamMemberCategory || 'family') as TeamMemberFormData['teamMemberCategory'],
      role: (formData.role || 'member') as TeamMemberFormData['role'],
      careRole: formData.careRole.trim(),
      careResponsibilities: formData.careResponsibilities.trim(),
      customMessage: formData.personalMessage,
    }),
    [formData, initialData],
  );

  const handleSubmit = React.useCallback(() => {
    if (!validateStep(currentStep)) return;
    const payload = normalizeData();
    onSubmit(payload, mode);
  }, [currentStep, mode, normalizeData, onSubmit, validateStep]);

  const isFirstStep = currentStep === 'basic';
  const isLastStep = currentStep === 'review';

  return (
    <div className="bg-white border-t border-stroke-soft-200">
      <Stepper
        value={currentStep}
        onValidate={handleValidate}
        onValueChange={handleValueChange}
      >
        <div className="px-6 py-4 border-b border-stroke-soft-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-sub-600">
              Step {steps.findIndex((step) => step.id === currentStep) + 1} of {steps.length}
            </p>
            <button
              onClick={onCancel}
              className="text-text-sub-600 hover:text-text-strong-950"
            >
              ×
            </button>
          </div>
          <StepperList className="mt-4 gap-4 overflow-x-auto">
            {steps.map((step) => (
              <StepperItem key={step.id} value={step.id} className="gap-2">
                <StepperTrigger className="gap-3 rounded-lg px-3 py-2">
                  <StepperIndicator />
                  <div className="flex flex-col gap-0.5">
                    <StepperTitle>{step.title}</StepperTitle>
                    <StepperDescription>{step.description}</StepperDescription>
                  </div>
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
            ))}
          </StepperList>
        </div>

        <div className="px-6 py-6 space-y-6">
          <StepperContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="wizard-name">
                  Full Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="wizard-name"
                      value={formData.name}
                      onChange={(event) => handleFieldChange('name', event.target.value)}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.name && <p className="text-xs text-error-base">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="wizard-email">
                  Email Address <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="wizard-email"
                      type="email"
                      value={formData.email}
                      onChange={(event) => handleFieldChange('email', event.target.value)}
                      placeholder="colleague@example.com"
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.email && <p className="text-xs text-error-base">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="wizard-phone">
                  Phone Number <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="wizard-phone"
                      value={formData.phone}
                      onChange={(event) => handleFieldChange('phone', event.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="wizard-category">
                  Team Member Category <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.teamMemberCategory}
                  onValueChange={(value) =>
                    handleFieldChange('teamMemberCategory', value)
                  }
                >
                  <Select.Trigger id="wizard-category">
                    <Select.Value placeholder="Select category" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="family">Family Member</Select.Item>
                    <Select.Item value="professional">Professional Caregiver</Select.Item>
                    <Select.Item value="volunteer">Volunteer</Select.Item>
                    <Select.Item value="organization">Organization</Select.Item>
                  </Select.Content>
                </Select.Root>
                {errors.teamMemberCategory && (
                  <p className="text-xs text-error-base">{errors.teamMemberCategory}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="wizard-role">
                Role & Permissions <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.role}
                onValueChange={(value) => handleFieldChange('role', value)}
              >
                <Select.Trigger id="wizard-role">
                  <Select.Value placeholder="Choose the level of access" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="member">Member — basic access</Select.Item>
                  <Select.Item value="admin">Admin — manage team</Select.Item>
                  <Select.Item value="viewer">Viewer — read only</Select.Item>
                </Select.Content>
              </Select.Root>
              {errors.role && <p className="text-xs text-error-base">{errors.role}</p>}
            </div>
          </StepperContent>

          <StepperContent value="care" className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="wizard-care-role">
                Care Role <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="wizard-care-role"
                    value={formData.careRole}
                    onChange={(event) => handleFieldChange('careRole', event.target.value)}
                    placeholder="e.g., Primary PCA, Family Coordinator"
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.careRole && <p className="text-xs text-error-base">{errors.careRole}</p>}
            </div>

            <CareResponsibilitiesSelector
              value={formData.careResponsibilities}
              onChange={(value) => handleFieldChange('careResponsibilities', value)}
              error={errors.careResponsibilities}
            />

            <div className="space-y-2">
              <Label.Root htmlFor="wizard-message">
                Personal Message (optional)
              </Label.Root>
              <textarea
                id="wizard-message"
                value={formData.personalMessage}
                onChange={(event) => handleFieldChange('personalMessage', event.target.value)}
                placeholder={
                  mode === 'invite'
                    ? 'Add a personal message to include with the invitation...'
                    : 'Additional notes about this team member...'
                }
                className="w-full resize-none rounded-lg border border-stroke-soft-200 px-3 py-2 text-paragraph-sm"
                rows={3}
              />
            </div>
          </StepperContent>

          <StepperContent value="review" className="space-y-4">
            <div className="rounded-lg border border-stroke-soft-200 bg-bg-soft-50 p-4">
              <h3 className="text-label-md font-medium text-text-strong-950 mb-3">
                {mode === 'invite'
                  ? 'Ready to send the invitation?'
                  : 'Ready to add this team member?'}
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Name</dt>
                  <dd className="text-text-strong-950">{formData.name || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Email</dt>
                  <dd className="text-text-strong-950">{formData.email || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Phone</dt>
                  <dd className="text-text-strong-950">{formData.phone || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Category</dt>
                  <dd className="text-text-strong-950">{formData.teamMemberCategory || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Role</dt>
                  <dd className="text-text-strong-950">{formData.role || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Care Role</dt>
                  <dd className="text-text-strong-950">{formData.careRole || '—'}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-sub-600">Responsibilities</dt>
                  <dd className="text-text-strong-950 max-w-xs text-right">
                    {formData.careResponsibilities || '—'}
                  </dd>
                </div>
                {formData.personalMessage && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-sub-600">Message</dt>
                    <dd className="text-text-strong-950 max-w-xs text-right">
                      {formData.personalMessage}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </StepperContent>
        </div>

        <div className="px-6 py-4 border-t border-stroke-soft-200 flex justify-between">
          {isFirstStep ? (
            <Button.Root variant="neutral" onClick={onCancel}>
              Cancel
            </Button.Root>
          ) : (
            <StepperPrevTrigger asChild>
              <Button.Root variant="neutral">Back</Button.Root>
            </StepperPrevTrigger>
          )}

          {isLastStep ? (
            <Button.Root
              variant="primary"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              {isSaving
                ? mode === 'invite'
                  ? 'Sending Invitation...'
                  : 'Adding Member...'
                : mode === 'invite'
                  ? 'Send Invitation'
                  : 'Add Team Member'}
            </Button.Root>
          ) : (
            <StepperNextTrigger asChild>
              <Button.Root variant="primary" disabled={isSaving}>
                Continue
              </Button.Root>
            </StepperNextTrigger>
          )}
        </div>
      </Stepper>
    </div>
  );
}
