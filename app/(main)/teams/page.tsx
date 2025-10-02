'use client';

import {
  RiAddLine,
  RiGroupLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { useRouter } from 'next/navigation';
import Header from '@/app/(main)/header';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { PermissionGate } from '@/components/permission-gate';

import { MembersTable } from './table';
import AddTeamMemberModal from '@/components/add-team-member-modal';
import { TeamMemberFormData } from './components/unified-team-form';
import * as React from 'react';

export default function PageTeams() {
  const router = useRouter();
  const { currentProfile, userPermissions } = useSimplePermissions();
  const [addTeamMemberModalOpen, setAddTeamMemberModalOpen] = React.useState(false);
  
  const getHeaderTitle = () => {
    if (!currentProfile) return 'Care Team';
    return `${currentProfile.name}'s Care Team`;
  };

  const getHeaderDescription = () => {
    if (!currentProfile) return "Coordinate care schedules and availability across your care network.";
    return `Manage ${currentProfile.name.toLowerCase()} care team and coordinate schedules.`;
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiGroupLine className='size-6 text-text-sub-600' />
          </div>
        }
        title={getHeaderTitle()}
        description={getHeaderDescription()}
        contentClassName='hidden lg:flex'
      >
        <PermissionGate permission="canManageTeam">
          <Button.Root 
            className='hidden lg:flex' 
            onClick={() => setAddTeamMemberModalOpen(true)}
            variant='primary'
            mode='filled'
          >
            <Button.Icon as={RiAddLine} />
            Add Team Member
          </Button.Root>
          <Button.Root className='w-full lg:hidden' onClick={() => setAddTeamMemberModalOpen(true)}>
            <Button.Icon as={RiAddLine} />
            Add Team Member
          </Button.Root>
        </PermissionGate>
      </Header>

      <div className='lg:px-8'>
        <Divider.Root />
      </div>

      <div className='flex flex-1 flex-col px-4 lg:px-8 lg:pb-6'>
        <div className='pt-5 lg:pt-4'>
          <MembersTable />
        </div>
      </div>

      {/* Add Team Member Modal */}
      <AddTeamMemberModal
        isOpen={addTeamMemberModalOpen}
        onClose={() => setAddTeamMemberModalOpen(false)}
        onTeamMemberAdded={(memberData) => {
          console.log('Team member added:', memberData);
          // In a real app, you'd update the team members list here
        }}
      />
    </>
  );
}
