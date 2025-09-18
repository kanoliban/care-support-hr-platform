'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { RiArrowLeftLine, RiUserAddLine, RiMailLine, RiUserLine, RiSendPlaneLine } from '@remixicon/react';

import Header from '@/app/(main)/header';
import { TeamMemberForm, TeamMemberFormData } from '../components/team-member-form';
import { CareResponsibilitiesSelector } from '../components/care-responsibilities-selector';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Divider from '@/components/ui/divider';
import { useSimplePermissions } from '@/lib/simple-permission-context';

export default function AddTeamMemberPage() {
  const router = useRouter();
  const { currentProfile } = useSimplePermissions();

  // Mode selection: 'manual' or 'invite'
  const [mode, setMode] = React.useState<'manual' | 'invite'>('invite');

  // Unified form data - base fields for both modes
  const [formData, setFormData] = React.useState({
    email: '',
    phone: '',
    name: '',
    teamMemberCategory: 'family' as 'family' | 'professional' | 'volunteer' | 'organization',
    careRole: '',
    careResponsibilities: '',
    role: 'member' as 'owner' | 'admin' | 'member' | 'viewer',
    customMessage: '',
    // Additional fields for manual mode
    schedule: '',
    availabilityType: 'flexible' as 'flexible' | 'fixed' | 'on-call',
    careNotes: '',
    photo: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof typeof formData, string>>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [isInviting, setIsInviting] = React.useState(false);

  const handleFormDataChange = (field: keyof typeof formData, value: string) => {
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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    // Base validation for both modes
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Require either email or phone
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.email = 'Email or phone number is required';
    } else if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.careRole.trim()) {
      newErrors.careRole = 'Care role is required';
    }

    if (!formData.careResponsibilities.trim()) {
      newErrors.careResponsibilities = 'Care responsibilities are required';
    }

    // Additional validation for manual mode
    if (mode === 'manual') {
      if (!formData.schedule.trim()) {
        newErrors.schedule = 'Schedule is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Adding new team member:', formData);
      
      // In real app, this would create the team member via API
      // For now, just redirect back to teams page
      router.push('/teams');
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!validateForm()) {
      return;
    }

    setIsInviting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Sending invitation:', {
        ...formData,
        profileId: currentProfile?.id,
        profileName: currentProfile?.name,
        invitedBy: 'Current User', // In real app, get from auth context
        invitationToken: 'mock-invitation-token-' + Date.now(),
      });
      
      // In real app, this would:
      // 1. Create invitation record in database
      // 2. Send email with invitation link
      // 3. Show success message
      
      alert(`Invitation sent to ${formData.email}! They will receive an email to join ${currentProfile?.name}.`);
      
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
        <div className="max-w-4xl mx-auto">
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

          {/* Mode Selection */}
          <div className="mb-6">
            <div className="bg-white rounded-lg border border-stroke-soft-200 p-4">
              <div className="flex items-center gap-4">
                <div className="text-label-sm font-medium">How would you like to add this team member?</div>
                <div className="flex gap-2">
                  <Button.Root
                    variant={mode === 'invite' ? 'primary' : 'neutral'}
                    mode={mode === 'invite' ? 'solid' : 'ghost'}
                    size="small"
                    onClick={() => setMode('invite')}
                  >
                    <RiMailLine className="size-4 mr-2" />
                    Send Invitation
                  </Button.Root>
                  <Button.Root
                    variant={mode === 'manual' ? 'primary' : 'neutral'}
                    mode={mode === 'manual' ? 'solid' : 'ghost'}
                    size="small"
                    onClick={() => setMode('manual')}
                  >
                    <RiUserLine className="size-4 mr-2" />
                    Add Manually
                  </Button.Root>
                </div>
              </div>
            </div>
          </div>

              {/* Unified Form Content */}
              <div className="bg-white rounded-lg border border-stroke-soft-200 p-6">
                {mode === 'invite' ? (
                  <InvitationForm
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    errors={errors}
                    isInviting={isInviting}
                    onSendInvitation={handleSendInvitation}
                    onCancel={handleCancel}
                    currentProfile={currentProfile}
                  />
                ) : (
                  <ManualForm
                    formData={formData}
                    onFormDataChange={handleFormDataChange}
                    errors={errors}
                    isSaving={isSaving}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    currentProfile={currentProfile}
                  />
                )}
              </div>
        </div>
      </div>
    </>
  );
}

// Invitation Form Component
function InvitationForm({
  formData,
  onFormDataChange,
  errors,
  isInviting,
  onSendInvitation,
  onCancel,
  currentProfile
}: {
  formData: typeof formData;
  onFormDataChange: (field: keyof typeof formData, value: string) => void;
  errors: Partial<Record<keyof typeof formData, string>>;
  isInviting: boolean;
  onSendInvitation: () => void;
  onCancel: () => void;
  currentProfile: any;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RiMailLine className="size-5 text-primary-600" />
          <div className="text-label-lg font-medium">Send Team Invitation</div>
        </div>
        <div className="text-text-sub-600 text-sm">
          Invite someone to join <span className="font-medium">{currentProfile?.name}</span> care team
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="invite-email">Email Address</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="invite-email"
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
            <Label.Root htmlFor="invite-phone">Phone Number</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="invite-phone"
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
        
        <div className="space-y-2">
          <Label.Root htmlFor="invite-name">Full Name *</Label.Root>
          <Input.Root>
            <Input.Wrapper>
                <Input.Input
                  id="invite-name"
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
            <Label.Root htmlFor="invite-category">Team Member Category *</Label.Root>
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
            <Label.Root htmlFor="invite-role">Role & Permissions *</Label.Root>
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

        <div className="space-y-2">
          <Label.Root htmlFor="invite-care-role">Care Role *</Label.Root>
          <Input.Root>
            <Input.Wrapper>
                <Input.Input
                  id="invite-care-role"
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

        <div className="space-y-2">
          <Label.Root htmlFor="invite-message">Personal Message (Optional)</Label.Root>
          <Textarea.Root
            id="invite-message"
            value={formData.customMessage}
            onChange={(e) => onFormDataChange('customMessage', e.target.value)}
            placeholder="Add a personal message to include with the invitation..."
            rows={3}
          />
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
          Cancel
        </Button.Root>
        <Button.Root 
          variant="primary" 
          mode="solid" 
          onClick={onSendInvitation}
          disabled={isInviting}
        >
          <RiSendPlaneLine className="size-4 mr-2" />
          {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
        </Button.Root>
      </div>
    </div>
  );
}

// Manual Form Component
function ManualForm({
  formData,
  onFormDataChange,
  errors,
  isSaving,
  onSave,
  onCancel,
  currentProfile
}: {
  formData: typeof formData;
  onFormDataChange: (field: keyof typeof formData, value: string) => void;
  errors: Partial<Record<keyof typeof formData, string>>;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  currentProfile: any;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <RiUserLine className="size-5 text-primary-600" />
          <div className="text-label-lg font-medium">Add Team Member Manually</div>
        </div>
        <div className="text-text-sub-600 text-sm">
          Add a new member directly to <span className="font-medium">{currentProfile?.name}</span> care team
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="manual-name">Full Name *</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="manual-name"
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
          
          <div className="space-y-2">
            <Label.Root htmlFor="manual-phone">Phone Number</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="manual-phone"
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

        <div className="space-y-2">
          <Label.Root htmlFor="manual-email">Email Address</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id="manual-email"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="manual-category">Team Member Category *</Label.Root>
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
            <Label.Root htmlFor="manual-role">Role & Permissions *</Label.Root>
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

        <div className="space-y-2">
          <Label.Root htmlFor="manual-care-role">Care Role *</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id="manual-care-role"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="manual-schedule">Schedule *</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="manual-schedule"
                  value={formData.schedule}
                  onChange={(e) => onFormDataChange('schedule', e.target.value)}
                  placeholder="e.g., Mon-Fri 9am-5pm"
                  className={errors.schedule ? 'border-red-500' : ''}
                />
              </Input.Wrapper>
            </Input.Root>
            {errors.schedule && (
              <div className="text-xs text-red-600">{errors.schedule}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="manual-availability">Availability Type</Label.Root>
            <Select.Root
              value={formData.availabilityType}
              onValueChange={(value) => onFormDataChange('availabilityType', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select availability" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="flexible">Flexible</Select.Item>
                <Select.Item value="fixed">Fixed Schedule</Select.Item>
                <Select.Item value="on-call">On-Call</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div className="space-y-2">
          <Label.Root htmlFor="manual-notes">Care Notes</Label.Root>
          <Textarea.Root
            id="manual-notes"
            value={formData.careNotes}
            onChange={(e) => onFormDataChange('careNotes', e.target.value)}
            placeholder="Additional notes about this team member's care responsibilities..."
            rows={3}
          />
        </div>
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
          Cancel
        </Button.Root>
        <Button.Root 
          variant="primary" 
          mode="solid" 
          onClick={onSave}
          disabled={isSaving}
        >
          <RiUserAddLine className="size-4 mr-2" />
          {isSaving ? 'Adding Member...' : 'Add Team Member'}
        </Button.Root>
      </div>
    </div>
  );
}
