'use client';

import * as React from 'react';
import { RiEditLine } from '@remixicon/react';

import * as Modal from '@/components/ui/modal';
import * as Button from '@/components/ui/button';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';

export interface QuickEditData {
  name: string;
  email: string;
  careRole: string;
  schedule: string;
  availabilityType: 'flexible' | 'fixed' | 'on-call' | 'part-time' | 'full-time' | 'professional' | 'volunteer' | 'emergency';
}

interface QuickEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberData: QuickEditData;
  onSave: (data: QuickEditData) => void;
  isLoading?: boolean;
}

export function QuickEditModal({
  isOpen,
  onClose,
  memberData,
  onSave,
  isLoading = false
}: QuickEditModalProps) {
  const [formData, setFormData] = React.useState<QuickEditData>(memberData);
  const [errors, setErrors] = React.useState<Partial<Record<keyof QuickEditData, string>>>({});

  // Update form data when memberData changes
  React.useEffect(() => {
    setFormData(memberData);
  }, [memberData]);

  const handleFormDataChange = (field: keyof QuickEditData, value: string) => {
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
    const newErrors: Partial<Record<keyof QuickEditData, string>> = {};

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

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className="max-w-2xl">
        <Modal.Header
          icon={RiEditLine}
          title="Quick Edit"
          description="Update essential team member information"
        />

        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="quick-name">
                  Full Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="quick-name"
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
                <Label.Root htmlFor="quick-email">
                  Email Address <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="quick-email"
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
              <Label.Root htmlFor="quick-care-role">
                Care Role <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="quick-care-role"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label.Root htmlFor="quick-schedule">
                  Schedule <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id="quick-schedule"
                      value={formData.schedule}
                      onChange={(e) => handleFormDataChange('schedule', e.target.value)}
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
                <Label.Root htmlFor="quick-availability">Availability Type</Label.Root>
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
