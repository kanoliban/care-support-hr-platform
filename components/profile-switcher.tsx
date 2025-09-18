'use client';

import * as React from 'react';
import { RiCheckLine, RiExpandUpDownLine } from '@remixicon/react';

import { cn, cnExt } from '@/utils/cn';
import * as Dropdown from '@/components/ui/dropdown';
import { useSimplePermissions } from '@/lib/simple-permission-context';

type ProfileItemProps = {
  profile: {
    id: string;
    name: string;
    subtitle: string;
    userRole: 'owner' | 'admin' | 'member' | 'viewer';
    avatar: string;
  };
  selected: boolean;
  onSelect: (id: string) => void;
};

function ProfileItem({ profile, selected, onSelect }: ProfileItemProps) {
  return (
    <button
      type='button'
      onClick={() => onSelect(profile.id)}
      className='group/item flex w-full cursor-pointer items-center gap-3 rounded-10 p-2 text-left outline-none transition duration-200 ease-out hover:bg-bg-weak-50 focus:outline-none'
    >
      <div className='flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden'>
        <img src={profile.avatar} alt={profile.name} className='size-10 object-cover' />
      </div>
      <div className='flex-1 space-y-1'>
        <div className='text-label-sm'>{profile.name}</div>
        <div className='text-paragraph-xs text-text-sub-600'>
          {profile.subtitle}
        </div>
      </div>
      {selected && <RiCheckLine className='size-5 text-text-sub-600' />}
    </button>
  );
}

export function ProfileSwitcher() {
  const { currentProfile, availableProfiles, switchProfile } = useSimplePermissions();
  const [selectedProfile, setSelectedProfile] = React.useState(currentProfile?.id || '');

  React.useEffect(() => {
    if (currentProfile) {
      setSelectedProfile(currentProfile.id);
    }
  }, [currentProfile]);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    switchProfile(profileId);
  };

  if (!currentProfile) {
    return null;
  }

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none focus:outline-none'
        )}
      >
        <div className='flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden'>
          <img src={currentProfile.avatar} alt={currentProfile.name} className='size-10 object-cover' />
        </div>
        <div
          className='flex w-[172px] shrink-0 items-center gap-3'
          data-hide-collapsed
        >
          <div className='flex-1 space-y-1'>
            <div className='text-label-sm'>
              {currentProfile.name}
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              {currentProfile.subtitle}
            </div>
          </div>
          <div className='flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs'>
            <RiExpandUpDownLine className='size-5 text-text-sub-600' />
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={24} align='start'>
        {availableProfiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            selected={selectedProfile === profile.id}
            onSelect={handleProfileSelect}
          />
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
