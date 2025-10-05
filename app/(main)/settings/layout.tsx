'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RiSettings2Line } from '@remixicon/react';

import * as Select from '@/components/ui/select';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import Header from '@/app/(main)/header';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { PermissionGate } from '@/components/permission-gate';

const allItems = [
  {
    label: 'General Settings',
    href: '/settings/general-settings',
    permission: null, // Public access
    role: null,
  },
  {
    label: 'Profile Settings',
    href: '/settings/profile-settings',
    permission: null, // Public access (personal profile)
    role: null,
  },
  {
    label: 'Organization Settings',
    href: '/settings/company-settings',
    permission: 'canManageOrganization',
    role: null,
  },
  {
    label: 'Subscription Status',
    href: '/settings/subscription-status',
    permission: null, // Public access (personal subscription status)
    role: null,
  },
  {
    label: 'Subscription & Billing',
    href: '/settings/subscription-billing',
    permission: 'canManageOrganization', // Only org admins can manage billing
    role: null,
  },
  {
    label: 'Notification Settings',
    href: '/settings/notification-settings',
    permission: null, // Public access (personal notifications)
    role: null,
  },
  {
    label: 'Privacy & Security',
    href: '/settings/privacy-security',
    permission: 'canManageSecurity',
    role: null,
  },
  {
    label: 'Care Connections',
    href: '/settings/integrations',
    permission: 'canManageIntegrations',
    role: null,
  },
];

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentProfile, userPermissions } = useSimplePermissions();

  // Filter items based on user permissions
  const items = allItems.filter(item => {
    if (!item.permission) return true; // Public access
    return userPermissions && userPermissions[item.permission as keyof typeof userPermissions];
  });

  // Contextual header content based on current profile
  const getHeaderTitle = () => {
    if (!currentProfile) return 'Care Settings';
    return `${currentProfile.name} Settings`;
  };

  const getHeaderDescription = () => {
    if (!currentProfile) return 'Manage your care coordination preferences and configure various options.';
    return `Manage ${currentProfile.name.toLowerCase()} settings and care coordination preferences.`;
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiSettings2Line className='size-6 text-text-sub-600' />
          </div>
        }
        title={getHeaderTitle()}
        description={getHeaderDescription()}
        contentClassName='hidden'
      />

      <div className='px-4 lg:px-8'>
        <Select.Root
          defaultValue={pathname}
          onValueChange={(val) => router.push(val)}
        >
          <Select.Trigger className='md:hidden'>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {items.map((item) => (
              <Select.Item key={item.href} value={item.href}>
                {item.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <TabMenuHorizontal.Root defaultValue={pathname}>
          <TabMenuHorizontal.List className='hidden md:flex'>
            {items.map(({ label, href }) => (
              <TabMenuHorizontal.Trigger key={label} value={href} asChild>
                <Link href={href}>{label}</Link>
              </TabMenuHorizontal.Trigger>
            ))}
          </TabMenuHorizontal.List>
        </TabMenuHorizontal.Root>

        <div className='py-5 md:py-8'>{children}</div>
      </div>
    </>
  );
}
