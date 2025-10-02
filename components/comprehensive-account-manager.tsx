'use client';

import * as React from 'react';
import Link from 'next/link';
import { RiAddLine, RiExpandUpDownLine, RiCheckLine, RiArrowRightSLine } from '@remixicon/react';

import { cn, cnExt } from '@/utils/cn';
import * as Dropdown from '@/components/ui/dropdown';
import { useSimplePermissions } from '@/lib/simple-permission-context';

// Company data for inter-organization switching
const companies = [
  {
    value: 'synergy',
    name: 'Synergy',
    description: 'HR Management',
    logo: '/images/placeholder/synergy.svg',
  },
  {
    value: 'apex',
    name: 'Apex',
    description: 'Finance & Banking',
    logo: '/images/placeholder/apex.svg',
  },
  {
    value: 'catalyst',
    name: 'Catalyst',
    description: 'Marketing & Sales',
    logo: '/images/placeholder/catalyst.svg',
  },
];

interface ComprehensiveAccountManagerProps {
  className?: string;
  collapsed?: boolean;
}

export function ComprehensiveAccountManager({ className, collapsed }: ComprehensiveAccountManagerProps) {
  const { currentProfile, availableProfiles, switchProfile } = useSimplePermissions();
  const [selectedCompany, setSelectedCompany] = React.useState(companies[0].value);

  if (!currentProfile) {
    return null;
  }

  return (
    <div className={cnExt('w-full', className)}>
      {/* Add Account Section - Always Visible */}
      <div className="mb-4">
        <Link
          href="/register"
          className={cnExt(
            'flex items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 ease-out',
            'hover:bg-gradient-primary hover:shadow-glass glassmorphic-hover',
            'text-label-sm font-medium text-primary-base',
            {
              'w-9 px-2 justify-center': collapsed,
              'w-full': !collapsed,
            }
          )}
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-primary-base text-white">
            <RiAddLine className="size-4" />
          </div>
          {!collapsed && (
            <div className="flex-1">
              <div className="text-label-sm">Add Account</div>
              <div className="text-paragraph-xs text-text-sub-600">Create new organization</div>
            </div>
          )}
        </Link>
      </div>

      {/* Switch Account Section */}
      <div className="space-y-3">
        {/* Intra-Organization Switching (Profile Switching) */}
        <div>
          <div className={cn('mb-2 text-subheading-xs uppercase text-text-soft-400', {
            'hidden': collapsed,
          })}>
            Switch Profile
          </div>
          
          {collapsed ? (
            // Collapsed: Show current profile only
            <div className="flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden">
              <img src={currentProfile.avatar} alt={currentProfile.name} className="size-10 object-cover" />
            </div>
          ) : (
            // Expanded: Show full profile switcher
            <Dropdown.Root>
              <Dropdown.Trigger
                className={cnExt(
                  'flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none transition-all duration-200 ease-out',
                  'hover:bg-gradient-primary hover:shadow-glass glassmorphic-hover focus:outline-none'
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden">
                  <img src={currentProfile.avatar} alt={currentProfile.name} className="size-10 object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-label-sm">{currentProfile.name}</div>
                  <div className="text-paragraph-xs text-text-sub-600">
                    {currentProfile.subtitle}
                  </div>
                </div>
                <div className="flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
                  <RiExpandUpDownLine className="size-5 text-text-sub-600" />
                </div>
              </Dropdown.Trigger>
              <Dropdown.Content side="right" sideOffset={24} align="start">
                {availableProfiles.map((profile) => (
                  <Dropdown.Item
                    key={profile.id}
                    onSelect={() => switchProfile(profile.id)}
                    className="flex items-center gap-3 p-2"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 overflow-hidden">
                      <img src={profile.avatar} alt={profile.name} className="size-8 object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-label-sm">{profile.name}</div>
                      <div className="text-paragraph-xs text-text-sub-600">
                        {profile.subtitle}
                      </div>
                    </div>
                    {profile.id === currentProfile.id && (
                      <RiCheckLine className="size-4 text-primary-base" />
                    )}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
          )}
        </div>

        {/* Inter-Organization Switching (Company Switching) */}
        <div>
          <div className={cn('mb-2 text-subheading-xs uppercase text-text-soft-400', {
            'hidden': collapsed,
          })}>
            Switch Organization
          </div>
          
          {collapsed ? (
            // Collapsed: Show company logo only
            <div className="flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
              <img 
                src={companies.find(c => c.value === selectedCompany)?.logo} 
                alt="" 
                className="size-6" 
              />
            </div>
          ) : (
            // Expanded: Show full company switcher
            <Dropdown.Root>
              <Dropdown.Trigger
                className={cnExt(
                  'flex w-full items-center gap-3 whitespace-nowrap p-3 text-left outline-none transition-all duration-200 ease-out',
                  'hover:bg-gradient-primary hover:shadow-glass glassmorphic-hover focus:outline-none'
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                  <img 
                    src={companies.find(c => c.value === selectedCompany)?.logo} 
                    alt="" 
                    className="size-6" 
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-label-sm">
                    {companies.find(c => c.value === selectedCompany)?.name}
                  </div>
                  <div className="text-paragraph-xs text-text-sub-600">
                    {companies.find(c => c.value === selectedCompany)?.description}
                  </div>
                </div>
                <div className="flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
                  <RiExpandUpDownLine className="size-5 text-text-sub-600" />
                </div>
              </Dropdown.Trigger>
              <Dropdown.Content side="right" sideOffset={24} align="start">
                {companies.map((company) => (
                  <Dropdown.Item
                    key={company.value}
                    onSelect={() => setSelectedCompany(company.value)}
                    className="flex items-center gap-3 p-2"
                  >
                    <div className="flex size-8 items-center justify-center rounded-full shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
                      <img src={company.logo} alt="" className="size-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-label-sm">{company.name}</div>
                      <div className="text-paragraph-xs text-text-sub-600">
                        {company.description}
                      </div>
                    </div>
                    {company.value === selectedCompany && (
                      <RiCheckLine className="size-4 text-primary-base" />
                    )}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown.Root>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComprehensiveAccountManager;
