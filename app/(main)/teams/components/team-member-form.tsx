'use client';

import * as React from 'react';
import { RiUserLine, RiMailLine, RiPhoneLine, RiMapPinLine, RiUserHeartLine, RiTimeLine, RiFileTextLine, RiImageLine } from '@remixicon/react';

import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Avatar from '@/components/ui/avatar';
import { CareResponsibilitiesSelector } from './care-responsibilities-selector';

export interface TeamMemberFormData {
  // Basic Information
  name: string;
  email: string;
  phone: string;
  
  // Care Information
  careRole: string;
  careResponsibilities: string;
  teamMemberCategory: 'family' | 'professional' | 'volunteer' | 'organization';
  role: 'owner' | 'admin' | 'member' | 'viewer';
  customMessage: string;
  
  // Availability (for manual mode)
  schedule: string;
  availabilityType: string;
  
  // Additional Information
  careNotes: string;
  photo: string;
}

export interface TeamMemberFormProps {
  formData: TeamMemberFormData;
  onFormDataChange: (field: keyof TeamMemberFormData, value: string) => void;
  errors: Partial<Record<keyof TeamMemberFormData, string>>;
  isEdit?: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export function TeamMemberForm({
  formData,
  onFormDataChange,
  errors,
  isEdit = false,
  isSaving = false,
  onSave,
  onCancel
}: TeamMemberFormProps) {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RiUserLine className="size-5 text-text-sub-600" />
          <div className="text-label-sm">Basic Information</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="name">Name *</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => onFormDataChange('name', e.target.value)}
                  placeholder="e.g., Marta Snow (Sister), Sarah Johnson (PCA)"
                  className={errors.name ? 'border-red-500' : ''}
                />
              </Input.Wrapper>
            </Input.Root>
            {errors.name && (
              <div className="text-xs text-red-600">{errors.name}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="email">Email *</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormDataChange('email', e.target.value)}
                  placeholder="email@example.com"
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

      <Divider.Root variant="line-spacing" />

      {/* Care Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RiUserHeartLine className="size-5 text-text-sub-600" />
          <div className="text-label-sm">Care Information</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="teamMemberCategory">Team Member Category *</Label.Root>
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
            {errors.teamMemberCategory && (
              <div className="text-xs text-red-600">{errors.teamMemberCategory}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="role">Role & Permissions *</Label.Root>
            <Select.Root
              value={formData.role}
              onValueChange={(value) => onFormDataChange('role', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select role" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="owner">Owner</Select.Item>
                <Select.Item value="admin">Admin</Select.Item>
                <Select.Item value="member">Member</Select.Item>
                <Select.Item value="viewer">Viewer</Select.Item>
              </Select.Content>
            </Select.Root>
            {errors.role && (
              <div className="text-xs text-red-600">{errors.role}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label.Root htmlFor="careRole">Care Role *</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id="careRole"
                value={formData.careRole}
                onChange={(e) => onFormDataChange('careRole', e.target.value)}
                placeholder="e.g., Family Coordinator, Primary PCA, Physical Therapist"
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
          <Label.Root htmlFor="customMessage">Personal Message (Optional)</Label.Root>
          <textarea
            id="customMessage"
            value={formData.customMessage}
            onChange={(e) => onFormDataChange('customMessage', e.target.value)}
            placeholder="Add any additional notes about this team member..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        
      </div>

      <Divider.Root variant="line-spacing" />

      {/* Availability */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RiTimeLine className="size-5 text-text-sub-600" />
          <div className="text-label-sm">Availability</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label.Root htmlFor="schedule">Schedule *</Label.Root>
            <Input.Root
              id="schedule"
              value={formData.schedule}
              onChange={(e) => onFormDataChange('schedule', e.target.value)}
              placeholder="e.g., Mon-Fri 9-5, On-call, Weekends only"
              className={errors.schedule ? 'border-red-500' : ''}
            />
            {errors.schedule && (
              <div className="text-xs text-red-600">{errors.schedule}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label.Root htmlFor="availabilityType">Availability Type</Label.Root>
            <Select.Root
              value={formData.availabilityType}
              onValueChange={(value) => onFormDataChange('availabilityType', value)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select availability type" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Flexible">Flexible</Select.Item>
                <Select.Item value="Fixed">Fixed</Select.Item>
                <Select.Item value="On-call">On-call</Select.Item>
                <Select.Item value="Part-time">Part-time</Select.Item>
                <Select.Item value="Full-time">Full-time</Select.Item>
                <Select.Item value="Professional">Professional Services</Select.Item>
                <Select.Item value="Volunteer">Volunteer</Select.Item>
                <Select.Item value="Emergency">Emergency Contact</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>


      <Divider.Root variant="line-spacing" />

      {/* Additional Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <RiFileTextLine className="size-5 text-text-sub-600" />
          <div className="text-label-sm">Additional Information</div>
        </div>
        
        <div className="space-y-2">
          <Label.Root htmlFor="careNotes">Care Notes & Instructions</Label.Root>
          <Textarea.Root
            id="careNotes"
            value={formData.careNotes}
            onChange={(e) => onFormDataChange('careNotes', e.target.value)}
            placeholder="Any special instructions, preferences, or important notes about this team member..."
            rows={4}
            className={errors.careNotes ? 'border-red-500' : ''}
          />
          {errors.careNotes && (
            <div className="text-xs text-red-600">{errors.careNotes}</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6">
        <Button.Root variant="neutral" mode="stroke" onClick={onCancel}>
          Cancel
        </Button.Root>
        <Button.Root 
          variant="primary" 
          mode="solid" 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Team Member')}
        </Button.Root>
      </div>
    </div>
  );
}
