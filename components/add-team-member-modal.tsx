'use client';

import React from 'react';
import { RiCloseLine } from '@remixicon/react';
import { UnifiedTeamForm, TeamMemberFormData } from '@/app/(main)/teams/components/unified-team-form';
import { useSimplePermissions } from '@/lib/simple-permission-context';

// Care role options (copied from unified-team-form.tsx for auto-categorization)
const careRoleOptions = [
  { value: 'family-coordinator', label: 'Family Coordinator', category: 'Family' },
  { value: 'primary-caregiver', label: 'Primary Caregiver', category: 'Family' },
  { value: 'backup-caregiver', label: 'Backup Caregiver', category: 'Family' },
  { value: 'family-member', label: 'Family Member', category: 'Family' },
  { value: 'registered-nurse', label: 'Registered Nurse (RN)', category: 'Professional' },
  { value: 'licensed-practical-nurse', label: 'Licensed Practical Nurse (LPN)', category: 'Professional' },
  { value: 'certified-nursing-assistant', label: 'Certified Nursing Assistant (CNA)', category: 'Professional' },
  { value: 'personal-care-assistant', label: 'Personal Care Assistant (PCA)', category: 'Professional' },
  { value: 'physical-therapist', label: 'Physical Therapist', category: 'Professional' },
  { value: 'occupational-therapist', label: 'Occupational Therapist', category: 'Professional' },
  { value: 'home-health-aide', label: 'Home Health Aide', category: 'Professional' },
  { value: 'companion', label: 'Companion', category: 'Volunteer' },
  { value: 'transportation-helper', label: 'Transportation Helper', category: 'Volunteer' },
  { value: 'meal-helper', label: 'Meal Helper', category: 'Volunteer' },
  { value: 'errand-helper', label: 'Errand Helper', category: 'Volunteer' },
  { value: 'activity-helper', label: 'Activity Helper', category: 'Volunteer' },
  { value: 'case-manager', label: 'Case Manager', category: 'Organization' },
  { value: 'social-worker', label: 'Social Worker', category: 'Organization' },
  { value: 'care-coordinator', label: 'Care Coordinator', category: 'Organization' },
  { value: 'service-provider', label: 'Service Provider', category: 'Organization' },
  { value: 'other', label: 'Other', category: 'Custom' }
];

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamMemberAdded?: (memberData: TeamMemberFormData) => void;
}

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onTeamMemberAdded,
}: AddTeamMemberModalProps) {
  const { currentProfile } = useSimplePermissions();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Partial<Record<keyof TeamMemberFormData, string>>>({});
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const steps = [
    { title: 'Add Team Member' },
    { title: 'Basic Information' },
    { title: 'Care Role & Schedule' },
    { title: 'Review' }
  ];

  // Unified form data - simplified without care responsibilities
  const [formData, setFormData] = React.useState<TeamMemberFormData>({
    email: '',
    phone: '',
    name: '',
    teamMemberCategory: 'family',
    careRole: '',
    careResponsibilities: '', // Keep for compatibility but won't be used
    role: 'member',
    customMessage: '',
    // Scheduling fields (matching Create Request pattern)
    isOnCall: false,
    shiftStartDate: '',
    shiftEndDate: '',
    shiftStartTime: '',
    shiftEndTime: '',
    isRecurring: false,
    recurrenceFrequency: 'weekly',
    recurrenceInterval: 1,
    shiftDays: [],
    recurrenceEndDate: '',
    availabilityType: 'flexible',
    // Time off
    blockStartDate: '',
    blockEndDate: '',
    blockReason: '',
    // Legacy/additional
    careNotes: '',
    photo: '',
  });

  const handleFormDataChange = (field: keyof TeamMemberFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    // Validate required fields
    const newErrors: Partial<Record<keyof TeamMemberFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Email or phone number is required';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.careRole.trim()) newErrors.careRole = 'Care role is required';
    
    // Set default role if not set
    if (!formData.role) {
      handleFormDataChange('role', 'member');
    }
    
    // Set teamMemberCategory based on care role
    const selectedRole = formData.careRole;
    if (selectedRole) {
      const roleOption = careRoleOptions.find(role => role.value === selectedRole);
      if (roleOption && roleOption.category !== 'Custom') {
        const categoryMap: Record<string, string> = {
          'Family': 'family',
          'Professional': 'professional', 
          'Volunteer': 'volunteer',
          'Organization': 'organization'
        };
        const category = categoryMap[roleOption.category];
        if (category) {
          handleFormDataChange('teamMemberCategory', category);
        }
      }
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Adding new team member:', {
        ...formData,
        profileId: currentProfile?.id,
        profileName: currentProfile?.name,
      });
      
      // Call the callback if provided
      onTeamMemberAdded?.(formData);
      
      // Reset form and close modal
      setFormData({
        email: '',
        phone: '',
        name: '',
        teamMemberCategory: 'family',
        careRole: '',
        careResponsibilities: '',
        role: 'member',
        customMessage: '',
        isOnCall: false,
        shiftStartDate: '',
        shiftEndDate: '',
        shiftStartTime: '',
        shiftEndTime: '',
        isRecurring: false,
        recurrenceFrequency: 'weekly',
        recurrenceInterval: 1,
        shiftDays: [],
        recurrenceEndDate: '',
        availabilityType: 'flexible',
        blockStartDate: '',
        blockEndDate: '',
        blockReason: '',
        careNotes: '',
        photo: '',
      });
      setCurrentStepIndex(0);
      
      onClose();
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-weak-50 rounded-2xl w-full max-w-2xl shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text-strong-950">
                Add Team Member
              </h2>
              <p className="text-sm text-text-sub-600 mt-1">
                Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-2 rounded hover:bg-bg-weak-50 flex items-center justify-center"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Unified Form */}
          <UnifiedTeamForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            errors={errors}
            onErrorsChange={setErrors}
            isSaving={isLoading}
            onSave={handleSave}
            onCancel={onClose}
            onStepChange={setCurrentStepIndex}
            currentProfile={currentProfile}
          />
        </div>
      </div>
    </div>
  );
}
