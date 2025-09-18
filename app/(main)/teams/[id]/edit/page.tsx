'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RiArrowLeftLine, RiUserSettingsLine } from '@remixicon/react';

import Header from '@/app/(main)/header';
import { ComprehensiveEditModal, TeamMemberEditData } from '../../components/comprehensive-edit-modal';

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
      label: 'Available',
    },
    role: 'admin',
    permissions: {
      canManageTeam: true,
      canViewSensitive: true,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: true,
      canExportData: true,
      canManageOrganization: false,
      canManageIntegrations: false,
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

  // Find the team member to edit
  const teamMember = React.useMemo(() => {
    return mockTeamMembers.find(member => member.id === memberId);
  }, [memberId]);

  // Form data state - using new interface
  const [formData, setFormData] = React.useState<TeamMemberEditData>({
    name: '',
    email: '',
    phone: '',
    teamMemberCategory: 'family',
    role: 'member',
    careRole: '',
    careResponsibilities: '',
    careAssignment: '',
    assignmentDescription: '',
    schedule: '',
    availabilityType: 'flexible',
    careNotes: '',
    photo: '',
  });

  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize form data when team member is found
  React.useEffect(() => {
    if (teamMember) {
      setFormData({
        name: teamMember.member.name,
        email: teamMember.member.email,
        phone: '', // Not available in mock data
        teamMemberCategory: 'family', // Default, not in mock data
        role: teamMember.role as any,
        careRole: teamMember.title.name,
        careResponsibilities: teamMember.project.description,
        careAssignment: teamMember.project.name,
        assignmentDescription: teamMember.project.description,
        schedule: teamMember.availability.schedule,
        availabilityType: teamMember.availability.type.toLowerCase() as any,
        careNotes: '',
        photo: teamMember.member.image,
      });
    }
  }, [teamMember]);

  const handleSave = async (data: TeamMemberEditData) => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Updating team member:', data);
      
      // In real app, this would update the team member via API
      // For now, just redirect back to teams page
      router.push('/teams');
    } catch (error) {
      console.error('Error updating team member:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    router.push('/teams');
  };

  if (!teamMember) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h1>
          <p className="text-gray-600 mb-6">The team member you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/teams')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Teams
          </button>
        </div>
      </div>
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
        description="Update team member information and permissions"
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

          {/* Edit Modal */}
          <ComprehensiveEditModal
            isOpen={true}
            onClose={handleClose}
            memberData={formData}
            onSave={handleSave}
            isLoading={isSaving}
          />
        </div>
      </div>
    </>
  );
}