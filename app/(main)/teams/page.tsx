'use client';

import {
  RiAddLine,
  RiGroupLine,
  RiShareForwardBoxLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { useRouter } from 'next/navigation';
import Header from '@/app/(main)/header';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { PermissionGate } from '@/components/permission-gate';

import { MembersTable } from './table';

export default function PageTeams() {
  const router = useRouter();
  const { currentProfile, userPermissions } = useSimplePermissions();
  
  const getHeaderTitle = () => {
    if (!currentProfile) return 'Care Team';
    return `${currentProfile.name} - Care Team`;
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
      >
        <PermissionGate permission="canExportData">
          <Button.Root
            variant='neutral'
            mode='stroke'
            className='w-full lg:hidden'
          >
            <Button.Icon as={RiShareForwardBoxLine} />
            Export Care Team
          </Button.Root>
        </PermissionGate>
        <PermissionGate permission="canManageTeam">
          <Button.Root className='w-full lg:hidden' onClick={() => router.push('/teams/add')}>
            <Button.Icon as={RiAddLine} />
            Add Team Member
          </Button.Root>
        </PermissionGate>
      </Header>

      <div className='lg:px-8'>
        <Divider.Root />
      </div>

      <div className='flex flex-1 flex-col px-4 lg:px-8 lg:pb-6'>
        <div className='flex items-center gap-3 pb-4 pt-5 lg:pt-4'>
          <div className='flex-1 space-y-1'>
            <div className='text-label-lg'>Care Team</div>
            <div className='text-paragraph-sm text-text-sub-600'>
              View care team members and their availability.
            </div>
          </div>

          <div className='hidden gap-3 lg:flex'>
            <PermissionGate permission="canExportData">
              <Button.Root variant='neutral' mode='stroke'>
                <Button.Icon as={RiShareForwardBoxLine} />
                Export Care Team
              </Button.Root>
            </PermissionGate>
            <PermissionGate permission="canManageTeam">
              <Button.Root onClick={() => router.push('/teams/add')}>
                <Button.Icon as={RiAddLine} />
                Add Team Member
              </Button.Root>
            </PermissionGate>
          </div>
        </div>

        <Divider.Root className='hidden lg:flex' />

        <MembersTable className='lg:mt-5' />
      </div>
    </>
  );
}
