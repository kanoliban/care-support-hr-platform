'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiArrowLeftLine, RiUserSettingsLine } from '@remixicon/react';

import Header from '@/app/(main)/header';
import { TeamMemberForm, TeamMemberFormData } from '../../components/team-member-form';

// Mock data - in real app this would come from API
const mockTeamMembers = [
  {
    id: 'marta-snow',
    member: {
      name: 'Marta Snow (Sister)',
      email: 'marta.snow@family.com',
      image: '/images/avatar/illustration/james.png',
    },
    title: {
      name: 'Family Coordinator & Scheduler',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Family Administration & General Care',
      image: ['/images/major-brands/monday.svg'],
    },
    availability: {
      schedule: 'On-call',
      type: 'Flexible',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'admin',
    permissions: {
      canManageTeam: true,
      canViewSensitive: true,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: true,
      canExportData: true,
      canManageOrganization: true,
      canManageIntegrations: true,
      canManageSecurity: false,
    },
  },
  {
    id: 'luann-wudlick',
    member: {
      name: 'Luann Wudlick (Mom)',
      email: 'luann.wudlick@family.com',
      image: '/images/avatar/illustration/sophia.png',
    },
    title: {
      name: 'Family Nurse & PCA',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Medical & Personal Care',
      image: ['/images/major-brands/notion.svg'],
    },
    availability: {
      schedule: 'Weekdays 9-5',
      type: 'Fixed',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'owner',
    permissions: {
      canManageTeam: true,
      canViewSensitive: true,
      canManageBilling: true,
      canDeleteProfile: true,
      canInviteMembers: true,
      canExportData: true,
      canManageOrganization: true,
      canManageIntegrations: true,
      canManageSecurity: true,
    },
  },
];


export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;

  const [formData, setFormData] = React.useState<TeamMemberFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    careRole: '',
    careAssignment: '',
    assignmentDescription: '',
    teamMemberCategory: 'family',
    schedule: '',
    availabilityType: '',
    careNotes: '',
    emergencyContact: '',
    emergencyPhone: '',
    skills: '',
    photo: '',
  });

  const [errors, setErrors] = React.useState<Partial<Record<keyof TeamMemberFormData, string>>>({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Find the team member to edit
  const teamMember = React.useMemo(() => {
    return mockTeamMembers.find(member => member.id === memberId);
  }, [memberId]);

  // Initialize form data when team member is found
  React.useEffect(() => {
    if (teamMember) {
      setFormData({
        name: teamMember.member.name,
        email: teamMember.member.email,
        phone: '', // Not in current data structure
        address: '', // Not in current data structure
        careRole: teamMember.title.name,
        careAssignment: teamMember.project.name,
        assignmentDescription: teamMember.project.description,
        teamMemberCategory: 'family', // Default, could be determined by role
        schedule: teamMember.availability.schedule,
        availabilityType: teamMember.availability.type,
        careNotes: '', // Not in current data structure
        emergencyContact: '', // Not in current data structure
        emergencyPhone: '', // Not in current data structure
        skills: '', // Not in current data structure
        photo: teamMember.member.image,
      });
    }
  }, [teamMember]);

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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TeamMemberFormData, string>> = {};

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

    if (!formData.careAssignment.trim()) {
      newErrors.careAssignment = 'Care assignment is required';
    }

    if (!formData.schedule.trim()) {
      newErrors.schedule = 'Schedule is required';
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
      
      console.log('Saving team member:', formData);
      
      // In real app, this would update the team member via API
      // For now, just redirect back to teams page
      router.push('/teams');
    } catch (error) {
      console.error('Error saving team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/teams');
  };

  if (!teamMember) {
    return (
      <>
        <Header
          icon={
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiUserSettingsLine className='size-6 text-text-sub-600' />
            </div>
          }
          title="Team Member Not Found"
          description="The team member you're looking for doesn't exist."
          contentClassName='hidden'
        />
        <div className='px-4 lg:px-8 py-8'>
          <div className="text-center">
            <p className="text-text-sub-600 mb-4">Team member not found.</p>
            <button
              onClick={() => router.push('/teams')}
              className="text-primary-600 hover:text-primary-700"
            >
              ← Back to Teams
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiUserSettingsLine className='size-6 text-text-sub-600' />
          </div>
        }
        title={`Edit ${teamMember.member.name}`}
        description="Update team member information and care responsibilities."
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

          {/* Form */}
          <div className="bg-white rounded-lg border border-stroke-soft-200 p-6">
            <TeamMemberForm
              formData={formData}
              onFormDataChange={handleFormDataChange}
              errors={errors}
              isEdit={true}
              isSaving={isSaving}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </>
  );
}
