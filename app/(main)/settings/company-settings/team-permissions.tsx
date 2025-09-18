'use client';

import * as React from 'react';
import { RiInformationFill } from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Switch from '@/components/ui/switch';

export default function TeamPermissions() {
  const uniqueId = React.useId();

  return (
    <div className='flex w-full flex-col gap-4'>
      <div>
        <div className='text-label-md'>Team Member Permissions</div>
        <p className='mt-1 text-paragraph-sm text-text-sub-600'>
          Manage what each team member can access and do in your care profile.
        </p>
      </div>

      <Divider.Root variant='line-spacing' />

      {/* Marta Wudlick */}
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center'>
            <span className='text-primary-600 font-medium'>MW</span>
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>Marta Wudlick</div>
            <div className='text-paragraph-xs text-text-sub-600'>Family Member</div>
          </div>
        </div>

        <div className='flex flex-col gap-3 pl-12'>
          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-marta-manage-team`} defaultChecked />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-marta-manage-team`}
            >
              Manage Team Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Add, remove, and manage care team members.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-marta-view-sensitive`} defaultChecked />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-marta-view-sensitive`}
            >
              View Sensitive Information
              <div className='text-paragraph-xs text-text-sub-600'>
                Access sensitive care data and medical information.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-marta-export-data`} defaultChecked />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-marta-export-data`}
            >
              Export Care Data
              <div className='text-paragraph-xs text-text-sub-600'>
                Download and export care information and reports.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-marta-invite-members`} defaultChecked />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-marta-invite-members`}
            >
              Invite New Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Send invitations to join the care team.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-marta-manage-billing`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-marta-manage-billing`}
            >
              Manage Billing
              <div className='text-paragraph-xs text-text-sub-600'>
                Handle payments, billing, and financial aspects of care.
              </div>
            </Label.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      {/* Luann Wudlick */}
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center'>
            <span className='text-primary-600 font-medium'>LW</span>
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>Luann Wudlick</div>
            <div className='text-paragraph-xs text-text-sub-600'>Family Member</div>
          </div>
        </div>

        <div className='flex flex-col gap-3 pl-12'>
          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-luann-manage-team`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-luann-manage-team`}
            >
              Manage Team Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Add, remove, and manage care team members.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-luann-view-sensitive`} defaultChecked />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-luann-view-sensitive`}
            >
              View Sensitive Information
              <div className='text-paragraph-xs text-text-sub-600'>
                Access sensitive care data and medical information.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-luann-export-data`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-luann-export-data`}
            >
              Export Care Data
              <div className='text-paragraph-xs text-text-sub-600'>
                Download and export care information and reports.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-luann-invite-members`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-luann-invite-members`}
            >
              Invite New Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Send invitations to join the care team.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-luann-manage-billing`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-luann-manage-billing`}
            >
              Manage Billing
              <div className='text-paragraph-xs text-text-sub-600'>
                Handle payments, billing, and financial aspects of care.
              </div>
            </Label.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      {/* Jim Anderson */}
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center'>
            <span className='text-primary-600 font-medium'>JA</span>
          </div>
          <div>
            <div className='text-label-sm text-text-strong-950'>Jim Anderson</div>
            <div className='text-paragraph-xs text-text-sub-600'>Care Provider</div>
          </div>
        </div>

        <div className='flex flex-col gap-3 pl-12'>
          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-jim-manage-team`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-jim-manage-team`}
            >
              Manage Team Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Add, remove, and manage care team members.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-jim-view-sensitive`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-jim-view-sensitive`}
            >
              View Sensitive Information
              <div className='text-paragraph-xs text-text-sub-600'>
                Access sensitive care data and medical information.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-jim-export-data`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-jim-export-data`}
            >
              Export Care Data
              <div className='text-paragraph-xs text-text-sub-600'>
                Download and export care information and reports.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-jim-invite-members`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-jim-invite-members`}
            >
              Invite New Members
              <div className='text-paragraph-xs text-text-sub-600'>
                Send invitations to join the care team.
              </div>
            </Label.Root>
          </div>

          <div className='flex items-start gap-2'>
            <Switch.Root id={`${uniqueId}-jim-manage-billing`} />
            <Label.Root
              className='flex-col items-start gap-1'
              htmlFor={`${uniqueId}-jim-manage-billing`}
            >
              Manage Billing
              <div className='text-paragraph-xs text-text-sub-600'>
                Handle payments, billing, and financial aspects of care.
              </div>
            </Label.Root>
          </div>
        </div>
      </div>

      <Alert.Root variant='lighter' status='information' size='xsmall'>
        <Alert.Icon as={RiInformationFill} />
        Carefully review permissions to ensure appropriate access levels for each team member.
      </Alert.Root>

      <div className='mt-1 grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke'>
          Discard
        </Button.Root>
        <Button.Root>Save Permissions</Button.Root>
      </div>
    </div>
  );
}