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
import { EditTeamMemberWizard, type TeamMemberEditData } from './edit-team-member-wizard';
import { useSimplePermissions } from '@/lib/simple-permission-context';
import { PermissionGate } from '@/components/permission-gate';
import { useCareSupport } from '@/lib/careContext';

// Function to determine if a team member is currently on shift
const isCurrentlyOnShift = (memberId: string, coverageWindows: any[]) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  return coverageWindows.some(window => {
    if (window.assignedTeamMember !== memberId) return false;
    if (window.date !== currentDate) return false;
    if (window.status !== 'confirmed') return false;
    
    const startTime = window.startTime;
    const endTime = window.endTime;
    
    // Handle overnight shifts (e.g., 20:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      // Handle same-day shifts (e.g., 09:00 to 17:00)
      return currentTime >= startTime && currentTime <= endTime;
    }
  });
};

const data: Data[] = [
  {
    id: 'marta-snow',
    profileId: 'robs-care-team', // Add profile association
    member: {
      name: 'Marta Snow (Sister)',
      email: 'marta.snow@family.com',
      phone: '+1 (555) 234-5678',
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
    id: 'luann-wudlick',
    profileId: 'robs-care-team',
    member: {
      name: 'Luann Wudlick (Mom)',
      email: 'luann.wudlick@family.com',
      phone: '+1 (555) 345-6789',
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
      schedule: 'On-call',
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
      phone: '+1 (555) 456-7890',
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
      schedule: 'Mon-Fri 9am-5pm',
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
    member: {
      name: 'Jennifer',
      email: 'jennifer@caresupport.com',
      phone: '+1 (555) 567-8901',
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
      schedule: 'Mon-Tue 8pm-8am',
      type: 'Overnight',
    },
    status: {
      variant: 'completed',
      label: 'Available',
    },
  },
  {
    id: 'sarah',
    profileId: 'robs-care-team',
    member: {
      name: 'Sarah',
      email: 'sarah@caresupport.com',
      phone: '+1 (555) 678-9012',
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
      schedule: 'Wed-Thu 8pm-8am',
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
      phone: '+1 (555) 789-0123',
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
      schedule: 'Fri-Sun 8pm-9am',
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
      phone: '+1 (555) 890-1234',
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
      schedule: 'On-call',
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
      schedule: 'On-call',
      type: 'Temporary Leave',
    },
    blockedDates: [
      {
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        reason: 'Summer Break'
      }
    ],
    status: {
      variant: 'failed',
      label: 'Unavailable',
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
      schedule: 'On-call',
      type: 'Backup',
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
      schedule: 'On-call',
      type: 'Backup',
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
      schedule: 'On-call',
      type: 'Primary',
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
      schedule: 'Mon-Fri 9am-5pm',
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
      schedule: 'Sat-Sun (Flexible)',
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
    phone?: string;
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
  blockedDates?: {
    startDate: string;
    endDate: string;
    reason?: string;
  }[];
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
  const { careContext } = useCareSupport(); // Get real coverage data
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [permissionsModalOpen, setPermissionsModalOpen] = React.useState(false);
  const [editDetailsModalOpen, setEditDetailsModalOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Data | null>(null);
  const [currentRole, setCurrentRole] = React.useState<string>('');
  const [currentPermissions, setCurrentPermissions] = React.useState<any>(null);
  const [editFormData, setEditFormData] = React.useState<TeamMemberEditData | null>(null);
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof TeamMemberEditData, string>>>({});
  const [isSaving, setIsSaving] = React.useState(false);
  
  // Process team members to determine their current status based on real schedule data
  const processedTeamMembers = React.useMemo(() => {
    return data.map(member => {
      const isOnShift = isCurrentlyOnShift(member.id, careContext?.coverageWindows || []);
      
      // If they're currently on shift, override their status
      if (isOnShift) {
        return {
          ...member,
          status: {
            variant: 'on-shift' as const,
            label: 'On Shift'
          }
        };
      }
      
      return member;
    });
  }, [careContext?.coverageWindows]);
  
  const [teamMembers, setTeamMembers] = React.useState<Data[]>(processedTeamMembers);

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
    // Get the first blocked date if it exists
    const firstBlock = member.blockedDates?.[0];
    
    // Initialize form data with current member data
    setEditFormData({
      name: member.member.name,
      email: member.member.email,
      phone: member.member.phone || '',
      careRole: member.title.name,
      careAssignment: member.project.name,
      assignmentDescription: member.project.description,
      schedule: member.availability.schedule,
      availabilityType: member.availability.type,
      blockStartDate: firstBlock?.startDate || '',
      blockEndDate: firstBlock?.endDate || '',
      blockReason: firstBlock?.reason || '',
    });
    setEditDetailsModalOpen(true);
  };

  const handleFormFieldChange = (field: keyof TeamMemberEditData, value: any) => {
    setEditFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    setCurrentPermissions(getPermissionsForRole(newRole));
  };


  const handleSaveDetails = async () => {
    if (!editFormData) return;
    
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
                phone: editFormData.phone,
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
              },
              blockedDates: editFormData.blockStartDate && editFormData.blockEndDate ? [{
                startDate: editFormData.blockStartDate,
                endDate: editFormData.blockEndDate,
                reason: editFormData.blockReason
              }] : member.blockedDates,
              status: editFormData.blockStartDate && editFormData.blockEndDate ? {
                variant: 'failed',
                label: 'Unavailable'
              } : member.status
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
    id: 'contact',
    accessorKey: 'member.phone',
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
          {row.original.member.phone || '+1 (555) 000-0000'}
        </span>
        <span className='text-paragraph-xs text-text-sub-600'>
          {row.original.member.email}
        </span>
      </div>
    ),
  },
  {
    id: 'role',
    accessorKey: 'title.name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Role
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex min-w-[140px] flex-col gap-0.5'>
        <span className='text-label-sm text-text-strong-950'>
          {row.original.title.name}
        </span>
      </div>
    ),
    enableSorting: true,
    size: 140,
    minSize: 120,
  },
  {
    id: 'schedule',
    accessorKey: 'availability.schedule',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Schedule
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      // Check if this member is currently on shift
      const isOnShift = isCurrentlyOnShift(row.original.id, careContext?.coverageWindows || []);
      
      // Check for active blocked dates
      const now = new Date();
      const activeBlock = row.original.blockedDates?.find(block => {
        const start = new Date(block.startDate);
        const end = new Date(block.endDate);
        return now >= start && now <= end;
      });
      
      // Check for upcoming blocked dates
      const upcomingBlock = row.original.blockedDates?.find(block => {
        const start = new Date(block.startDate);
        return start > now;
      });
      
      const blockToShow = activeBlock || upcomingBlock;
      
      return (
        <div className='flex min-w-32 flex-col gap-0.5'>
          <span className={`text-label-sm ${isOnShift ? 'text-blue-600 font-medium' : 'text-text-strong-950'}`}>
            {isOnShift ? 'Currently On Shift' : row.original.availability.schedule}
          </span>
          {blockToShow && !isOnShift && (
            <span className='text-paragraph-xs text-text-sub-600'>
              {activeBlock 
                ? `Unavailable until ${new Date(blockToShow.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : `Blocked ${new Date(blockToShow.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(blockToShow.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              }
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status.label',
      filterFn: 'includesString',
    header: ({ column }) => (
      <div className='flex min-w-24 items-center gap-0.5'>
        Availability
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => {
      const isAvailable = row.original.status.label === 'Available';
      const isBusy = row.original.status.label === 'Busy';
      const isUnavailable = row.original.status.label === 'Unavailable';
      
      const handleStatusChange = () => {
        console.log('🔄 Care Team status change clicked!', { 
          id: row.original.id, 
          currentStatus: row.original.status.label 
        });
        
        // Cycle through care team statuses: Available -> Busy -> Unavailable -> Available
        const statusCycle = [
          { label: 'Available', variant: 'completed' },
          { label: 'Busy', variant: 'pending' },
          { label: 'Unavailable', variant: 'pending' }
        ];
        
        const currentStatusIndex = statusCycle.findIndex(s => s.label === row.original.status.label);
        // If current status is not in cycle, start from 'Available'
        const nextStatusIndex = currentStatusIndex === -1 ? 0 : (currentStatusIndex + 1) % statusCycle.length;
        const newStatus = statusCycle[nextStatusIndex];
        
        // Update the team member status in the state
        setTeamMembers(prev => prev.map(member => 
          member.id === row.original.id 
            ? { 
                ...member, 
                status: { 
                  ...member.status, 
                  label: newStatus.label, 
                  variant: newStatus.variant 
                } 
              }
            : member
        ));
        
        console.log('✅ New status:', newStatus);
      };
      
      // Map care team status to StatusBadge variant
        const getBadgeVariant = (statusLabel: string) => {
          switch (statusLabel) {
            case 'Available': return 'completed';
            case 'Busy': return 'pending';
            case 'Unavailable': return 'failed';
            default: return 'disabled';
          }
        };

      return (
        <StatusBadge.Root 
          status={getBadgeVariant(row.original.status.label)}
          variant="light"
          onClick={(e) => {
            console.log('🔥 Care Team StatusBadge clicked!', { 
              memberId: row.original.id, 
              currentStatus: row.original.status.label
            });
            e.preventDefault();
            e.stopPropagation();
            handleStatusChange();
          }}
          className="cursor-pointer hover:opacity-80 transition-opacity"
        >
          {row.original.status.label}
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
              <Dropdown.Item onClick={() => handleEditDetails(row.original)}>
                <RiEditLine className='mr-2 h-4 w-4' />
                Edit Details
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canManageTeam: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canInviteMembers: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canExportData: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canViewSensitive: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canManageBilling: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canManageOrganization: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canManageIntegrations: checked}))}
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
                      onCheckedChange={(checked) => setCurrentPermissions(prev => ({...prev, canManageSecurity: checked}))}
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

      {/* Edit Details Modal - 3 Step Wizard */}
      <Modal.Root open={editDetailsModalOpen} onOpenChange={setEditDetailsModalOpen}>
        <Modal.Content className='max-w-[700px]'>
          <Modal.Header
            title="Edit Team Member"
            description={`Update details for ${selectedMember?.member.name}`}
          />
          
          {selectedMember && editFormData && (
            <Modal.Body>
              <EditTeamMemberWizard
                formData={editFormData}
                onFormDataChange={handleFormFieldChange}
                errors={formErrors}
                onErrorsChange={setFormErrors}
                isSaving={isSaving}
                onSave={handleSaveDetails}
                onCancel={() => {
                  setEditDetailsModalOpen(false);
                  setFormErrors({});
                }}
                memberName={selectedMember.member.name}
              />
            </Modal.Body>
          )}
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}
