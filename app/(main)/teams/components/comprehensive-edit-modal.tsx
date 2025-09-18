'use client';

import * as React from 'react';
import { RiUserSettingsLine, RiShieldUserLine, RiEditLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Radio from '@/components/ui/radio';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as Divider from '@/components/ui/divider';
import { CareResponsibilitiesSelector } from './care-responsibilities-selector';

export interface TeamMemberEditData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  
  // Role & Category
  teamMemberCategory: 'family' | 'professional' | 'volunteer' | 'organization';
  role: 'owner' | 'admin' | 'member' | 'viewer';
  
  // Care Information
  careRole: string;
  careResponsibilities: string;
  careAssignment: string;
  assignmentDescription: string;
  
  // Schedule & Availability
  schedule: string;
  availabilityType: 'flexible' | 'fixed' | 'on-call' | 'part-time' | 'full-time' | 'professional' | 'volunteer' | 'emergency';
  
  // Additional
  careNotes: string;
  photo: string;
}

interface ComprehensiveEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: TeamMemberEditData;
  onSave: (data: TeamMemberEditData) => void;
  isLoading?: boolean;
}

export function ComprehensiveEditModal({
  isOpen,
  onClose,
  memberData,
  onSave,
  isLoading = false
}: ComprehensiveEditModalProps) {
  const [formData, setFormData] = React.useState<TeamMemberEditData>(memberData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof TeamMemberEditData, string>>>({});
  const [activeTab, setActiveTab] = React.useState<'basic' | 'care' | 'schedule' | 'permissions'>('basic');

  // Update form data when memberData changes
  React.useEffect(() => {
    setFormData(memberData);
  }, [memberData]);

  const handleFormDataChange = (field: keyof TeamMemberEditData, value: string) => {
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
    const newErrors: Partial<Record<keyof TeamMemberEditData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.careRole.trim()) {
      newErrors.careRole = 'Care role is required';
    }

    if (!formData.careResponsibilities.trim()) {
      newErrors.careResponsibilities = 'Care responsibilities are required';
    }

    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Schedule is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: RiEditLine },
    { id: 'care', label: 'Care Details', icon: RiUserSettingsLine },
    { id: 'schedule', label: 'Schedule', icon: RiEditLine },
    { id: 'permissions', label: 'Permissions', icon: RiShieldUserLine },
  ] as const;

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <Modal.Header
          icon={RiUserSettingsLine}
          title="Edit Team Member"
          description="Update team member information and permissions"
        />

        <Modal.Body>
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="text-label-sm">Basic Information</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-name">
                      Full Name <Label.Asterisk />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id="edit-name"
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
                    <Label.Root htmlFor="edit-email">
                      Email Address <Label.Asterisk />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id="edit-email"
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

                <div className="space-y-2">
                  <Label.Root htmlFor="edit-phone">Phone Number</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id="edit-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormDataChange('phone', e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-category">
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-role">
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
                        <Select.Item value="owner">Owner - Full access</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <div className="text-label-sm">Care Information</div>
                
                <div className="space-y-2">
                  <Label.Root htmlFor="edit-care-role">
                    Care Role <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id="edit-care-role"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-care-assignment">
                      Care Assignment <Label.Asterisk />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id="edit-care-assignment"
                          value={formData.careAssignment}
                          onChange={(e) => handleFormDataChange('careAssignment', e.target.value)}
                          placeholder="e.g., Rob's Care, Physical Therapy"
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                  
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-assignment-description">
                      Assignment Description
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id="edit-assignment-description"
                          value={formData.assignmentDescription}
                          onChange={(e) => handleFormDataChange('assignmentDescription', e.target.value)}
                          placeholder="e.g., Family Administration & General Care"
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label.Root htmlFor="edit-care-notes">Care Notes</Label.Root>
                  <Textarea.Root
                    id="edit-care-notes"
                    value={formData.careNotes}
                    onChange={(e) => handleFormDataChange('careNotes', e.target.value)}
                    placeholder="Additional notes about this team member's care responsibilities..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="text-label-sm">Schedule & Availability</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-schedule">
                      Schedule Details <Label.Asterisk />
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id="edit-schedule"
                          value={formData.schedule}
                          onChange={(e) => handleFormDataChange('schedule', e.target.value)}
                          placeholder="e.g., Mon-Fri 9am-5pm, On-call"
                          className={errors.schedule ? 'border-red-500' : ''}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                    {errors.schedule && (
                      <div className="text-xs text-red-600">{errors.schedule}</div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label.Root htmlFor="edit-availability-type">
                      Availability Type
                    </Label.Root>
                    <Select.Root
                      value={formData.availabilityType}
                      onValueChange={(value) => handleFormDataChange('availabilityType', value)}
                    >
                      <Select.Trigger>
                        <Select.Value placeholder="Select availability" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="flexible">Flexible</Select.Item>
                        <Select.Item value="fixed">Fixed Schedule</Select.Item>
                        <Select.Item value="on-call">On-Call</Select.Item>
                        <Select.Item value="part-time">Part-time</Select.Item>
                        <Select.Item value="full-time">Full-time</Select.Item>
                        <Select.Item value="professional">Professional Services</Select.Item>
                        <Select.Item value="volunteer">Volunteer</Select.Item>
                        <Select.Item value="emergency">Emergency Contact</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permissions' && (
              <div className="space-y-4">
                <div className="text-label-sm">Role & Permissions</div>
                
                <div className="space-y-3">
                  <div className="text-paragraph-sm text-text-sub-600">
                    Select the appropriate role for this team member. This determines their access level and capabilities.
                  </div>
                  
                  <Radio.Group 
                    value={formData.role} 
                    onValueChange={(value) => handleFormDataChange('role', value)}
                    className="space-y-3"
                  >
                    <LabelPrimitive.Root
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                        formData.role === 'viewer' && 'shadow-none ring-primary-base',
                      )}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200">
                        <RiShieldUserLine className="size-5 text-text-sub-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-label-sm">Viewer</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                          Read-only access to care information and schedules
                        </div>
                      </div>
                      <Radio.Item value="viewer" />
                    </LabelPrimitive.Root>
                    
                    <LabelPrimitive.Root
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                        formData.role === 'member' && 'shadow-none ring-primary-base',
                      )}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200">
                        <RiUserSettingsLine className="size-5 text-text-sub-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-label-sm">Member</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                          Basic access to care coordination and updates
                        </div>
                      </div>
                      <Radio.Item value="member" />
                    </LabelPrimitive.Root>
                    
                    <LabelPrimitive.Root
                      className={cn(
                        'flex cursor-pointer items-start gap-3.5 rounded-xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
                        formData.role === 'admin' && 'shadow-none ring-primary-base',
                      )}
                    >
                      <div className="flex size-10 items-center justify-center rounded-full ring-1 ring-inset ring-stroke-soft-200">
                        <RiShieldUserLine className="size-5 text-text-sub-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-label-sm">Admin</div>
                        <div className="text-paragraph-xs text-text-sub-600">
                          Manage team members and care coordination
                        </div>
                      </div>
                      <Radio.Item value="admin" />
                    </LabelPrimitive.Root>
                  </Radio.Group>
                </div>
              </div>
            )}
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
              {isLoading ? 'Saving...' : 'Save Changes'}
            </FancyButton.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
