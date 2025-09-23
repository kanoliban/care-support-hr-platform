'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiUserAddLine } from '@remixicon/react';

import Header from '@/app/(main)/header';
import { UnifiedTeamForm, TeamMemberFormData } from '../components/unified-team-form';
import { useSimplePermissions } from '@/lib/simple-permission-context';

export default function AddTeamMemberPage() {
  const router = useRouter();
  const { currentProfile } = useSimplePermissions();

  // Unified form data - base fields for both modes
  const [formData, setFormData] = React.useState<TeamMemberFormData>({
    email: '',
    phone: '',
    name: '',
    teamMemberCategory: 'family',
    careRole: '',
    careResponsibilities: '',
    role: 'member',
    customMessage: '',
    // Additional fields for manual mode
    schedule: '',
    availabilityType: 'flexible',
    careNotes: '',
    photo: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof TeamMemberFormData, string>>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [isInviting, setIsInviting] = React.useState(false);

  const handleFormDataChange = (field: keyof TeamMemberFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (data: TeamMemberFormData): boolean => {
    const newErrors: Partial<Record<keyof TeamMemberFormData, string>> = {};

    // Base validation for both modes
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Require either email or phone
    if (!data.email.trim() && !data.phone.trim()) {
      newErrors.email = 'Email or phone number is required';
    } else if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.careRole.trim()) {
      newErrors.careRole = 'Care role is required';
    }

    if (!data.careResponsibilities.trim()) {
      newErrors.careResponsibilities = 'Care responsibilities are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (overrideData?: TeamMemberFormData) => {
    const payload = overrideData ?? formData;

    if (!validateForm(payload)) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Adding new team member:', payload);
      
      // In real app, this would create the team member via API
      // For now, just redirect back to teams page
      router.push('/teams');
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvitation = async (overrideData?: TeamMemberFormData) => {
    const payload = overrideData ?? formData;

    if (!validateForm(payload)) {
      return;
    }

    setIsInviting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sending invitation:', {
        ...payload,
        profileId: currentProfile?.id,
        profileName: currentProfile?.name,
        invitedBy: 'Current User', // In real app, get from auth context
        invitationToken: 'mock-invitation-token-' + Date.now(),
      });
      
      // In real app, this would:
      // 1. Create invitation record in database
      // 2. Send email with invitation link
      // 3. Show success message
      
      alert(`Invitation sent to ${payload.email}! They will receive an email to join ${currentProfile?.name}.`);
      
      // Reset form and redirect
      setFormData({
        email: '',
        phone: '',
        name: '',
        teamMemberCategory: 'family',
        careRole: '',
        careResponsibilities: '',
        role: 'member',
        customMessage: '',
        schedule: '',
        availabilityType: 'flexible',
        careNotes: '',
        photo: '',
      });
      
      router.push('/teams');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const handleCancel = () => {
    router.push('/teams');
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiUserAddLine className='size-6 text-text-sub-600' />
          </div>
        }
        title="Add Team Member"
        description="Add a new member to your care team."
        contentClassName='hidden'
      />

      <div className='px-4 lg:px-8 py-8'>
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/teams')}
              className="flex items-center gap-2 text-text-sub-600 hover:text-text-strong-950 transition-colors"
            >
              <RiArrowLeftLine className="size-4" />
              Back to Teams
            </button>
          </div>

          {/* Unified Form */}
          <div className="bg-white rounded-lg border border-stroke-soft-200 p-6">
            <UnifiedTeamForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              errors={errors}
              isInviting={isInviting}
              isSaving={isSaving}
              onSendInvitation={handleSendInvitation}
              onSave={handleSave}
              onCancel={handleCancel}
              currentProfile={currentProfile}
            />
          </div>
        </div>
      </div>
    </>
  );
}
