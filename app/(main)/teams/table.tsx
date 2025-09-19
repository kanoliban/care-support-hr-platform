'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiCheckboxCircleFill,
  RiExpandUpDownFill,
  RiMore2Line,
  RiEditLine,
  RiDeleteBinLine,
  RiSettings3Line,
  RiUserSettingsLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import * as Dropdown from '@/components/ui/dropdown';
import * as Modal from '@/components/ui/modal';
import * as Switch from '@/components/ui/switch';
import * as Label from '@/components/ui/label';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { ThemedImage } from '@/components/themed-image';
import { TeamsTableFilters } from '@/app/(main)/teams/filters';
import { EditDetailsModalContent } from './edit-details-modal-content';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { PermissionGate } from '@/components/permission-gate';

const data: Data[] = [
  {
    id: 'marta-snow',
    profileId: 'robs-care-team', // Add profile association
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
          description: 'Transfer, Range of Motion, Dressing/Undressing, Eating, Meal Prep, Dishes, Laundry, Empty Leg Bag, Change Leg Bag, Bring Meals, Shovel/Plow, Driving, Medical Monitoring, Help with Meds, Companionship, Wheelchair Repair',
          image: ['/images/major-brands/monday.svg'],
        },
    doc: {
      name: 'snow-marta-family-admin.pdf',
      size: '1.8 MB',
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
    profileId: 'robs-care-team',
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
      description: 'Dressing/Undressing, Eating, Meal Prep, Dishes, Laundry, Empty Leg Bag, Change Leg Bag, Change Catheter, Bowel Program, Bring Meals, Chores, Work Assistance, Medical Monitoring, Help with Meds, Cleaning/Organizing, Companionship',
      image: [
        '/images/major-brands/notion.svg',
        '/images/major-brands/notion-white.svg',
      ],
    },
    doc: {
      name: 'wudlick-luann-nurse-cert.pdf',
      size: '2.1 MB',
    },
    availability: {
      schedule: 'All empty time slots',
      type: 'Flexible',
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
  {
    id: 'jim-nelson',
    profileId: 'robs-care-team',
    member: {
      name: 'Jim Nelson',
      email: 'jim.nelson@caresupport.com',
      image: '/images/avatar/illustration/arthur.png',
    },
    title: {
      name: 'Nurse',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'M-F 9am-5pm Medical Care',
      image: ['/images/major-brands/spotify.svg'],
    },
    doc: {
      name: 'nelson-jim-nurse-certifications.pdf',
      size: '1.9 MB',
    },
    availability: {
      schedule: 'M-F 9am-5pm',
      type: 'Regular',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'jennifer',
    profileId: 'robs-care-team',
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
    member: {
      name: 'Jennifer',
      email: 'jennifer@caresupport.com',
      image: '/images/avatar/illustration/emma.png',
    },
    title: {
      name: 'Overnight PCA',
      date: 'Since Feb, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'M,T 8pm-8am Overnight Care',
      image: ['/images/major-brands/formcarry.svg'],
    },
    doc: {
      name: 'jennifer-pca-certifications.pdf',
      size: '2.3 MB',
    },
    availability: {
      schedule: 'M,T 8pm-8am',
      type: 'Overnight',
    },
    status: {
      variant: 'on-shift',
      label: 'On Shift',
    },
  },
  {
    id: 'sarah',
    profileId: 'robs-care-team',
    member: {
      name: 'Sarah',
      email: 'sarah@caresupport.com',
      image: '/images/avatar/illustration/matthew.png',
    },
    title: {
      name: 'Overnight PCA',
      date: 'Since Feb, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'W, Th 8pm-8am Overnight Care',
      image: ['/images/major-brands/loom.svg'],
    },
    doc: {
      name: 'sarah-pca-certifications.pdf',
      size: '2.2 MB',
    },
    availability: {
      schedule: 'W, Th 8pm-8am',
      type: 'Overnight',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'ella',
    profileId: 'robs-care-team',
    member: {
      name: 'Ella',
      email: 'ella@caresupport.com',
      image: '/images/avatar/illustration/laura.png',
    },
    title: {
      name: 'Overnight PCA',
      date: 'Since Feb, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'F, Sat, Sun 8pm-9am Weekend Care',
      image: [
        '/images/major-brands/tidal.svg',
        '/images/major-brands/tidal-white.svg',
      ],
    },
    doc: {
      name: 'ella-pca-certifications.pdf',
      size: '2.0 MB',
    },
    availability: {
      schedule: 'F, Sat, Sun 8pm-9am',
      type: 'Weekend Overnight',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'alex',
    profileId: 'robs-care-team',
    member: {
      name: 'Alex',
      email: 'alex@caresupport.com',
      image: '/images/avatar/illustration/wei.png',
    },
    title: {
      name: 'PCA',
      date: 'Since Mar, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Random Availability',
      image: ['/images/major-brands/dropbox.svg'],
    },
    doc: {
      name: 'alex-pca-certifications.pdf',
      size: '2.4 MB',
    },
    availability: {
      schedule: 'Random',
      type: 'Flexible',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'olena',
    profileId: 'robs-care-team',
    member: {
      name: 'Olena',
      email: 'olena@caresupport.com',
      image: '/images/avatar/illustration/james.png',
    },
    title: {
      name: 'PCA',
      date: 'Since Mar, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Sat, Sun 9am-1pm Weekend Care',
      image: ['/images/major-brands/monday.svg'],
    },
    doc: {
      name: 'olena-pca-certifications.pdf',
      size: '1.8 MB',
    },
    availability: {
      schedule: 'Sat, Sun 9am-1pm',
      type: 'Weekend Day',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'isabela',
    profileId: 'robs-care-team',
    member: {
      name: 'Isabela',
      email: 'isabela@family.com',
      image: '/images/avatar/illustration/sophia.png',
    },
    title: {
      name: 'Family PCA',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Family Support & On-call Care',
      image: [
        '/images/major-brands/notion.svg',
        '/images/major-brands/notion-white.svg',
      ],
    },
    doc: {
      name: 'isabela-family-pca.pdf',
      size: '2.1 MB',
    },
    availability: {
      schedule: 'On-call',
      type: 'Flexible',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'lucy',
    profileId: 'robs-care-team',
    member: {
      name: 'Lucy',
      email: 'lucy@family.com',
      image: '/images/avatar/illustration/arthur.png',
    },
    title: {
      name: 'PCA & Family',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Family Support & On-call Care',
      image: ['/images/major-brands/spotify.svg'],
    },
    doc: {
      name: 'lucy-family-pca.pdf',
      size: '1.9 MB',
    },
    availability: {
      schedule: 'On-call',
      type: 'Flexible',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'grace',
    profileId: 'robs-care-team',
    member: {
      name: 'Grace',
      email: 'grace@caresupport.com',
      image: '/images/avatar/illustration/emma.png',
    },
    title: {
      name: 'Overnight PCA',
      date: 'Since Apr, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Overnight Care (Summer Break)',
      image: ['/images/major-brands/formcarry.svg'],
    },
    doc: {
      name: 'grace-pca-certifications.pdf',
      size: '2.3 MB',
    },
    availability: {
      schedule: 'Summer Break',
      type: 'Temporary Leave',
    },
    status: {
      variant: 'disabled',
      label: 'Summer Break',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'kathleen',
    profileId: 'robs-care-team',
    member: {
      name: 'Kathleen',
      email: 'kathleen@caresupport.com',
      image: '/images/avatar/illustration/matthew.png',
    },
    title: {
      name: 'Backup PCA',
      date: 'Since May, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Random On-call Backup',
      image: ['/images/major-brands/loom.svg'],
    },
    doc: {
      name: 'kathleen-backup-pca.pdf',
      size: '2.2 MB',
    },
    availability: {
      schedule: 'Random On-call',
      type: 'Backup',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'annie',
    profileId: 'robs-care-team',
    member: {
      name: 'Annie',
      email: 'annie@caresupport.com',
      image: '/images/avatar/illustration/laura.png',
    },
    title: {
      name: 'Backup PCA',
      date: 'Since May, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Random On-call Backup',
      image: [
        '/images/major-brands/tidal.svg',
        '/images/major-brands/tidal-white.svg',
      ],
    },
    doc: {
      name: 'annie-backup-pca.pdf',
      size: '2.0 MB',
    },
    availability: {
      schedule: 'Random On-call',
      type: 'Backup',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'uncle-jim',
    profileId: 'robs-care-team',
    member: {
      name: 'Uncle Jim',
      email: 'uncle.jim@family.com',
      image: '/images/avatar/illustration/wei.png',
    },
    title: {
      name: 'Family Backup PCA',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Family Support & On-call Backup',
      image: ['/images/major-brands/dropbox.svg'],
    },
    doc: {
      name: 'uncle-jim-family-backup.pdf',
      size: '2.4 MB',
    },
    availability: {
      schedule: 'On-call',
      type: 'Family Backup',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'dan',
    profileId: 'robs-care-team',
    member: {
      name: 'Dan (Bro in-law)',
      email: 'dan@family.com',
      image: '/images/avatar/illustration/james.png',
    },
    title: {
      name: 'Family Backup PCA',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Family Support & On-call Backup',
      image: ['/images/major-brands/monday.svg'],
    },
    doc: {
      name: 'dan-family-backup.pdf',
      size: '1.8 MB',
    },
    availability: {
      schedule: 'On-call',
      type: 'Family Backup',
    },
    status: {
      variant: 'completed',
      label: 'On-call',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
  {
    id: 'robert-wudlick',
    profileId: 'robs-care-team',
    member: {
      name: 'Robert Wudlick (Rob)',
      email: 'rwudlick@gmail.com',
      image: '/images/avatar/illustration/james.png',
    },
    title: {
      name: 'Care Recipient & Coordinator',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Rob's Care",
      description: 'Primary Care Recipient & Team Coordinator',
      image: ['/images/major-brands/monday.svg'],
    },
    doc: {
      name: 'wudlick-robert-care-plan.pdf',
      size: '3.2 MB',
    },
    availability: {
      schedule: '24/7 Care Recipient',
      type: 'Primary',
    },
    status: {
      variant: 'completed',
      label: 'Active',
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
  // Luann's Care Team Members
  {
    id: 'luann-family-1',
    profileId: 'luanns-care-team',
    member: {
      name: 'Sarah Johnson (Daughter)',
      email: 'sarah.johnson@family.com',
      image: '/images/avatar/illustration/laura.png',
    },
    title: {
      name: 'Family Care Coordinator',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Luann's Care",
      description: 'Family Care & Medical Support',
      image: ['/images/major-brands/notion.svg'],
    },
    doc: {
      name: 'johnson-sarah-family-care.pdf',
      size: '1.8 MB',
    },
    availability: {
      schedule: 'Weekdays 9-5',
      type: 'Fixed',
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
      canManageOrganization: true,
      canManageIntegrations: true,
      canManageSecurity: false,
    },
  },
  {
    id: 'luann-family-2',
    profileId: 'luanns-care-team',
    member: {
      name: 'Michael Johnson (Son-in-law)',
      email: 'michael.johnson@family.com',
      image: '/images/avatar/illustration/arthur.png',
    },
    title: {
      name: 'Family Support',
      date: 'Since Jan, 2023',
    },
    project: {
      name: "Luann's Care",
      description: 'Family Support & Transportation',
      image: ['/images/major-brands/monday.svg'],
    },
    doc: {
      name: 'johnson-michael-family-support.pdf',
      size: '1.5 MB',
    },
    availability: {
      schedule: 'Weekends',
      type: 'Flexible',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
    role: 'member',
    permissions: {
      canManageTeam: false,
      canViewSensitive: false,
      canManageBilling: false,
      canDeleteProfile: false,
      canInviteMembers: false,
      canExportData: false,
      canManageOrganization: false,
      canManageIntegrations: false,
      canManageSecurity: false,
    },
  },
];

type Data = {
  id: string;
  profileId: string; // Add profile association
  member: {
    name: string;
    email: string;
    image: string;
  };
  title: {
    name: string;
    date: string;
  };
  project: {
    name: string;
    description: string;
    image: [string, string?];
  };
  doc: {
    name: string;
    size: string;
  };
  availability: {
    schedule: string;
    type: string;
  };
  status: {
    variant: 'completed' | 'pending' | 'failed' | 'disabled' | 'on-shift';
    label: string;
  };
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: {
    canManageTeam: boolean;
    canViewSensitive: boolean;
    canManageBilling: boolean;
    canDeleteProfile: boolean;
    canInviteMembers: boolean;
    canExportData: boolean;
    canManageOrganization: boolean;
    canManageIntegrations: boolean;
    canManageSecurity: boolean;
  };
};

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};


export function MembersTable({ className }: { className?: string }) {
  const router = useRouter();
  const { currentProfile, userPermissions } = useSimplePermissions();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false);
  const [editDetailsModalOpen, setEditDetailsModalOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Data | null>(null);
  const [currentRole, setCurrentRole] = React.useState<string>('');
  const [currentPermissions, setCurrentPermissions] = React.useState<any>(null);
  const [editFormData, setEditFormData] = React.useState<any>(null);
  const [formErrors, setFormErrors] = React.useState<any>({});
  const [isSaving, setIsSaving] = React.useState(false);
  const [teamMembers, setTeamMembers] = React.useState<Data[]>(data);

  // Filter team members by current profile
  const profileFilteredMembers = React.useMemo(() => {
    if (!currentProfile) return teamMembers;
    return teamMembers.filter(member => member.profileId === currentProfile.id);
  }, [teamMembers, currentProfile]);

  // Role-based permission logic
  const getPermissionsForRole = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          canManageTeam: true,
          canInviteMembers: true,
          canExportData: true,
          canViewSensitive: true,
          canManageBilling: true,
          canManageOrganization: true,
          canManageIntegrations: true,
          canManageSecurity: true,
        };
      case 'admin':
        return {
          canManageTeam: true,
          canInviteMembers: true,
          canExportData: true,
          canViewSensitive: true,
          canManageBilling: false,
          canManageOrganization: true,
          canManageIntegrations: true,
          canManageSecurity: false,
        };
      case 'member':
        return {
          canManageTeam: false,
          canInviteMembers: false,
          canExportData: false,
          canViewSensitive: false,
          canManageBilling: false,
          canManageOrganization: false,
          canManageIntegrations: false,
          canManageSecurity: false,
        };
      case 'viewer':
        return {
          canManageTeam: false,
          canInviteMembers: false,
          canExportData: false,
          canViewSensitive: false,
          canManageBilling: false,
          canManageOrganization: false,
          canManageIntegrations: false,
          canManageSecurity: false,
        };
      default:
        return {
          canManageTeam: false,
          canInviteMembers: false,
          canExportData: false,
          canViewSensitive: false,
          canManageBilling: false,
          canManageOrganization: false,
          canManageIntegrations: false,
          canManageSecurity: false,
        };
    }
  };

  const handleManagePermissions = (member: Data) => {
    setSelectedMember(member);
    setCurrentRole(member.role);
    setCurrentPermissions(member.permissions);
    setPermissionsModalOpen(true);
  };

  const handleEditDetails = (member: Data) => {
    setSelectedMember(member);
    // Initialize form data with current member data
    setEditFormData({
      name: member.member.name,
      email: member.member.email,
      careRole: member.title.name,
      careAssignment: member.project.name,
      assignmentDescription: member.project.description,
      schedule: member.availability.schedule,
      availabilityType: member.availability.type,
    });
    setEditDetailsModalOpen(true);
  };

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    setCurrentPermissions(getPermissionsForRole(newRole));
  };

  // Form validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!editFormData.name.trim()) {
      errors.name = 'Caregiver name is required';
    }
    
    if (!editFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(editFormData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editFormData.careRole.trim()) {
      errors.careRole = 'Care role is required';
    }
    
    if (!editFormData.careAssignment.trim()) {
      errors.careAssignment = 'Care assignment is required';
    }
    
    if (!editFormData.schedule.trim()) {
      errors.schedule = 'Schedule details are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDetails = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the team member in the local state
      setTeamMembers(prev => prev.map(member => 
        member.id === selectedMember?.id 
          ? {
              ...member,
              member: {
                ...member.member,
                name: editFormData.name,
                email: editFormData.email,
              },
              title: {
                ...member.title,
                name: editFormData.careRole,
              },
              project: {
                ...member.project,
                name: editFormData.careAssignment,
                description: editFormData.assignmentDescription,
              },
              availability: {
                ...member.availability,
                schedule: editFormData.schedule,
                type: editFormData.availabilityType,
              }
            }
          : member
      ));
      
      console.log('Saving team member details:', editFormData);
      
      // Show success message (you could add a toast notification here)
      alert('Team member details saved successfully!');
      
      setEditDetailsModalOpen(false);
      setFormErrors({});
    } catch (error) {
      console.error('Error saving team member details:', error);
      alert('Error saving details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormFieldChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  // Define columns inside component to access handleManagePermissions
const columns: ColumnDef<Data>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox.Root
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox.Root
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'pr-0',
    },
  },
  {
    id: 'member',
    accessorKey: 'member.name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
          Care Team Member
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className='flex min-w-[212px] items-center gap-3'>
        <Avatar.Root size='40'>
          <Avatar.Image src={row.original.member.image} />
        </Avatar.Root>
        <div className='flex flex-col gap-0.5'>
          <span className='text-label-sm text-text-strong-950'>
            {row.original.member.name}
          </span>
          <span className='text-paragraph-xs text-text-sub-600'>
            {row.original.member.email}
          </span>
        </div>
      </div>
    ),
  },
  {
    id: 'title',
    accessorKey: 'title.name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
          Contact Info
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[180px] flex-col gap-0.5'>
        <span className='text-label-sm text-text-strong-950'>
          {row.original.member.email}
        </span>
        <span className='text-paragraph-xs text-text-sub-600'>
          {row.original.title.name} • {row.original.title.date}
        </span>
      </div>
    ),
  },
  {
    id: 'project',
    accessorKey: 'project.name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
          Care Responsibilities
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex w-[232px] items-center gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <ThemedImage
            src={row.original.project.image[0]}
            srcDark={row.original.project.image[1]}
            alt=''
            width={28}
            height={28}
          />
        </div>
        <div className='flex min-w-0 flex-col gap-0.5'>
          <span className='text-label-sm text-text-strong-950'>
            {row.original.project.name}
          </span>
          <span className='truncate text-paragraph-xs text-text-sub-600'>
            {row.original.project.description}
          </span>
        </div>
      </div>
    ),
  },
  {
      id: 'availability',
      accessorKey: 'availability.schedule',
    header: ({ column }) => (
        <div className='flex min-w-32 items-center gap-0.5'>
          Availability
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
        <div className='flex min-w-32 flex-col gap-0.5'>
          <span className='text-label-sm text-text-strong-950'>
            {row.original.availability.schedule}
          </span>
          <span className='text-paragraph-xs text-text-sub-600'>
            {row.original.availability.type}
          </span>
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status.label',
      filterFn: 'includesString',
    header: ({ column }) => (
      <div className='flex min-w-24 items-center gap-0.5'>
        Status
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      const isAvailable = row.original.status.variant === 'completed' || row.original.status.label === 'Available' || row.original.status.label === 'On-call';
      return (
        <StatusBadge.Root status={isAvailable ? "completed" : "pending"}>
        <StatusBadge.Icon as={RiCheckboxCircleFill} />
          {isAvailable ? 'Available' : 'Unavailable'}
      </StatusBadge.Root>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
      <Button.Root variant='neutral' mode='ghost' size='xsmall'>
        <Button.Icon as={RiMore2Line} />
      </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align='end' className='w-48'>
            <PermissionGate permission="canManageTeam">
              <Dropdown.Item onClick={() => router.push(`/teams/${row.original.id}/edit`)}>
                <RiEditLine className='mr-2 h-4 w-4' />
                Comprehensive Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleEditDetails(row.original)}>
                <RiEditLine className='mr-2 h-4 w-4' />
                Quick Edit
              </Dropdown.Item>
            </PermissionGate>
            <PermissionGate permission="canManageTeam">
              <Dropdown.Item onClick={() => handleManagePermissions(row.original)}>
                <RiUserSettingsLine className='mr-2 h-4 w-4' />
                Manage Permissions
              </Dropdown.Item>
            </PermissionGate>
            <PermissionGate permission="canManageTeam">
              <Dropdown.Separator />
              <Dropdown.Item className='text-red-600'>
                <RiDeleteBinLine className='mr-2 h-4 w-4' />
                Remove from Team
              </Dropdown.Item>
            </PermissionGate>
          </Dropdown.Content>
        </Dropdown.Root>
    ),
    meta: {
      className: 'px-4',
    },
  },
];

  const table = useReactTable({
    data: profileFilteredMembers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      statusFilter: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        return row.original.status.label === filterValue;
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      sorting: [
        {
          id: 'member',
          desc: true,
        },
      ],
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className={cn('flex w-full flex-1 flex-col', className)}>
      <TeamsTableFilters 
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        table={table}
      />

      <Table.Root className='-mx-4 mt-5 w-auto px-4 lg:mx-0 lg:mt-4 lg:w-full lg:px-0'>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Head
                    key={header.id}
                    className={header.column.columnDef.meta?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows?.length > 0 &&
            table.getRowModel().rows.map((row, i, arr) => (
              <React.Fragment key={row.id}>
                <Table.Row data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
                {i < arr.length - 1 && <Table.RowDivider />}
              </React.Fragment>
            ))}
        </Table.Body>
      </Table.Root>

      <div className='mt-auto'>
        <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-28'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button.Root>
          <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-28'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button.Root>
        </div>
        <div className='mt-10 hidden items-center gap-3 lg:flex'>
          <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>

          <Pagination.Root>
            <Pagination.NavButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
            </Pagination.NavButton>
            <Pagination.NavButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <Pagination.NavIcon as={RiArrowLeftSLine} />
            </Pagination.NavButton>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <Pagination.Item 
                key={i} 
                current={table.getState().pagination.pageIndex === i}
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.NavButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <Pagination.NavIcon as={RiArrowRightSLine} />
            </Pagination.NavButton>
            <Pagination.NavButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <Pagination.NavIcon as={RiArrowRightDoubleLine} />
            </Pagination.NavButton>
          </Pagination.Root>

          <div className='flex flex-1 justify-end'>
            <Select.Root 
              size='xsmall' 
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <Select.Trigger className='w-auto'>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value={'7'}>7 / page</Select.Item>
                <Select.Item value={'15'}>15 / page</Select.Item>
                <Select.Item value={'50'}>50 / page</Select.Item>
                <Select.Item value={'100'}>100 / page</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      {/* Permissions Management Modal */}
      <Modal.Root open={permissionsModalOpen} onOpenChange={setPermissionsModalOpen}>
        <Modal.Content className='max-w-[600px]'>
          <Modal.Header
            title="Manage Permissions"
            description={`Configure roles and permissions for ${selectedMember?.member.name}`}
          />
          
          {selectedMember && currentPermissions && (
            <Modal.Body>
              <div className='space-y-6'>
                {/* Role Selection */}
                <div className='space-y-3'>
                  <div className='text-label-sm'>Role</div>
                  <Select.Root value={currentRole} onValueChange={handleRoleChange}>
                    <Select.Trigger className='w-full'>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='owner'>Owner</Select.Item>
                      <Select.Item value='admin'>Admin</Select.Item>
                      <Select.Item value='member'>Member</Select.Item>
                      <Select.Item value='viewer'>Viewer</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <div className='text-paragraph-xs text-text-sub-600'>
                    Changing the role will automatically update the permissions below.
                  </div>
                </div>

                <Divider.Root variant='line-spacing' />

                {/* Permissions - Using exact same pattern as notification settings */}
                <div className='space-y-3'>
                  <div className='text-label-sm'>Permissions</div>
                  
                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-manage-team`} 
                      checked={currentPermissions.canManageTeam}
                       onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canManageTeam: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-manage-team`}
                    >
                      Manage Team Members
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Add, remove, and manage care team members.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-invite-members`} 
                      checked={currentPermissions.canInviteMembers}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canInviteMembers: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-invite-members`}
                    >
                      Invite New Members
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Send invitations to join the care team.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-export-data`} 
                      checked={currentPermissions.canExportData}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canExportData: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-export-data`}
                    >
                      Export Care Data
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Download and export care information and reports.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-view-sensitive`} 
                      checked={currentPermissions.canViewSensitive}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canViewSensitive: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-view-sensitive`}
                    >
                      View Sensitive Information
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Access sensitive care data and medical information.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-manage-billing`} 
                      checked={currentPermissions.canManageBilling}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canManageBilling: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-manage-billing`}
                    >
                      Manage Billing
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Handle payments, billing, and financial aspects of care.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-manage-organization`} 
                      checked={currentPermissions.canManageOrganization}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canManageOrganization: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-manage-organization`}
                    >
                      Manage Organization Settings
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Configure organization-wide settings and preferences.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-manage-integrations`} 
                      checked={currentPermissions.canManageIntegrations}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canManageIntegrations: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-manage-integrations`}
                    >
                      Manage Care Connections
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Connect and manage external care services and integrations.
                      </div>
                    </Label.Root>
                  </div>

                  <div className='flex items-start gap-2'>
                    <Switch.Root 
                      id={`${selectedMember.id}-manage-security`} 
                      checked={currentPermissions.canManageSecurity}
                      onCheckedChange={(checked) => setCurrentPermissions((prev: any) => ({...prev, canManageSecurity: checked}))}
                    />
                    <Label.Root
                      className='flex-col items-start gap-1'
                      htmlFor={`${selectedMember.id}-manage-security`}
                    >
                      Manage Security Settings
                      <div className='text-paragraph-xs text-text-sub-600'>
                        Configure privacy, security, and access controls.
                      </div>
                    </Label.Root>
                  </div>
                </div>
              </div>
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button.Root variant='neutral' mode='stroke' onClick={() => setPermissionsModalOpen(false)}>
              Discard
            </Button.Root>
            <Button.Root onClick={() => {
              // Update the team member's role and permissions in the local state
              setTeamMembers(prev => prev.map(member => 
                member.id === selectedMember?.id 
                  ? {
                      ...member,
                      role: currentRole,
                      permissions: currentPermissions
                    }
                  : member
              ));
              
              console.log('Saving permissions:', { role: currentRole, permissions: currentPermissions });
              alert('Permissions updated successfully!');
              setPermissionsModalOpen(false);
            }}>
              Save Permissions
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      {/* Edit Details Modal */}
      <Modal.Root open={editDetailsModalOpen} onOpenChange={setEditDetailsModalOpen}>
        <Modal.Content className='max-w-[700px]'>
          <Modal.Header
            title="Edit Team Member Details"
            description={`Update personal information and care responsibilities for ${selectedMember?.member.name}`}
          />
          
          {selectedMember && editFormData && (
            <Modal.Body>
              <EditDetailsModalContent
                editFormData={editFormData}
                handleFormFieldChange={handleFormFieldChange}
                formErrors={formErrors}
              />
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button.Root 
              variant='neutral' 
              mode='stroke' 
              onClick={() => {
                setEditDetailsModalOpen(false);
                setFormErrors({});
              }}
              disabled={isSaving}
            >
              Cancel
            </Button.Root>
            <Button.Root 
              onClick={handleSaveDetails}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
