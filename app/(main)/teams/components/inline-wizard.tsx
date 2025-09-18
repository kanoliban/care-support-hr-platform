'use client';

import * as React from 'react';
import { RiUserAddLine, RiTimeLine, RiCheckLine } from '@remixicon/react';
import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import { CareResponsibilitiesSelector } from './care-responsibilities-selector';

export interface InlineWizardProps {
  mode: 'invite' | 'manual';
  onSave: (data: any) => void;
  onCancel: () => void;
  currentProfile: any;
  isSaving?: boolean;
}

const steps = [
  {
    id: 'basic',
    title: 'Basic Information',
    description: 'Enter team member details',
    icon: RiUserAddLine
  },
  {
    id: 'care',
    title: 'Care Information',
    description: 'Define care role and responsibilities',
    icon: RiTimeLine
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Confirm all details',
    icon: RiCheckLine
  }
];


export function InlineWizard({ mode, onSave, onCancel, currentProfile, isSaving = false }: InlineWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(steps[0].id);
  const [formData, setFormData] = React.useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    teamMemberCategory: '',
    role: '',
    
    // Care Information
    careRole: '',
    careResponsibilities: '',
    
    // Additional
    personalMessage: ''
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };


  const validateStep = (stepId: string): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepId) {
      case 'basic':
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.teamMemberCategory) newErrors.teamMemberCategory = 'Category is required';
        if (!formData.role) newErrors.role = 'Role is required';
        break;
      
      case 'care':
        if (!formData.careRole.trim()) newErrors.careRole = 'Care role is required';
        if (!formData.careResponsibilities.trim()) newErrors.careResponsibilities = 'Care responsibilities are required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSave = () => {
    if (!validateStep(currentStep)) return;
    onSave(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="name">
                  Full Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleFormDataChange('name', e.target.value)}
                      placeholder="e.g., Sarah Johnson"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.name && (
                  <div className="text-xs text-red-600">{errors.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="email">
                  Email Address <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <RiUserAddLine className="size-4 text-text-sub-600" />
                    <Input.Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormDataChange('email', e.target.value)}
                      placeholder="colleague@example.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.email && (
                  <div className="text-xs text-red-600">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="phone">
                  Phone Number <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleFormDataChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                  </Input.Wrapper>
                </Input.Root>
                {errors.phone && (
                  <div className="text-xs text-red-600">{errors.phone}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root htmlFor="category">
                  Team Member Category <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.teamMemberCategory}
                  onValueChange={(value) => handleFormDataChange('teamMemberCategory', value)}
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
                {errors.teamMemberCategory && (
                  <div className="text-xs text-red-600">{errors.teamMemberCategory}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label.Root htmlFor="role">
                Role & Permissions <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.role}
                onValueChange={(value) => handleFormDataChange('role', value)}
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
              {errors.role && (
                <div className="text-xs text-red-600">{errors.role}</div>
              )}
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label.Root htmlFor="care-role">
                Care Role <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="care-role"
                    value={formData.careRole}
                    onChange={(e) => handleFormDataChange('careRole', e.target.value)}
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
              onChange={(value) => handleFormDataChange('careResponsibilities', value)}
              error={errors.careResponsibilities}
            />

            <div className="space-y-2">
              <Label.Root htmlFor="personal-message">
                Personal Message (Optional)
              </Label.Root>
              <textarea
                id="personal-message"
                value={formData.personalMessage}
                onChange={(e) => handleFormDataChange('personalMessage', e.target.value)}
                placeholder={mode === 'invite' 
                  ? "Add a personal message to include with the invitation..."
                  : "Additional notes about this team member..."
                }
                className="w-full px-3 py-2 border border-stroke-soft-200 rounded-lg resize-none"
                rows={3}
              />
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-bg-soft-50 p-4 rounded-lg border border-stroke-soft-200">
              <h3 className="font-medium text-text-strong-950 mb-3">
                {mode === 'invite' ? 'Ready to send invitation?' : 'Ready to add team member?'}
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Name:</span> {formData.name}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {formData.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {formData.phone}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {formData.teamMemberCategory}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {formData.role}
                </div>
                <div>
                  <span className="font-medium">Care Role:</span> {formData.careRole}
                </div>
                {formData.personalMessage && (
                  <div>
                    <span className="font-medium">Message:</span> {formData.personalMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-t border-stroke-soft-200">
      {/* Wizard Header */}
      <div className="px-6 py-4 border-b border-stroke-soft-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-sub-600">
              Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-text-sub-600 hover:text-text-strong-950"
          >
            ×
          </button>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center mt-4 space-x-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <React.Fragment key={step.id}>
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                  isActive && "bg-primary-600 text-white",
                  isCompleted && "bg-primary-100 text-primary-700",
                  !isActive && !isCompleted && "bg-bg-soft-100 text-text-sub-600"
                )}>
                  {isCompleted ? <RiCheckLine className="size-4" /> : <Icon className="size-4" />}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 transition-colors",
                    index < currentStepIndex ? "bg-primary-600" : "bg-stroke-soft-200"
                  )} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Wizard Content */}
      <div className="px-6 py-6">
        {renderStep()}
      </div>

      {/* Wizard Footer */}
      <div className="px-6 py-4 border-t border-stroke-soft-200 flex justify-between">
        <Button.Root
          variant="neutral"
          onClick={currentStepIndex === 0 ? onCancel : handlePrevious}
        >
          {currentStepIndex === 0 ? 'Cancel' : 'Previous'}
        </Button.Root>
        
        {currentStepIndex === steps.length - 1 ? (
          <Button.Root
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving 
              ? (mode === 'invite' ? 'Sending Invitation...' : 'Adding Member...')
              : (mode === 'invite' ? 'Send Invitation' : 'Add Team Member')
            }
          </Button.Root>
        ) : (
          <Button.Root
            variant="primary"
            onClick={handleNext}
          >
            Next
          </Button.Root>
        )}
      </div>
    </div>
  );
}
