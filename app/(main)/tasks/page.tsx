'use client';

import * as React from 'react';
import {
  RiAddLine,
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
  RiStickyNoteLine,
  RiFlagLine,
  RiCalendarLine,
  RiSearchLine,
  RiCarLine,
  RiUserHeartLine,
  RiBriefcaseLine,
  RiTeamLine,
  RiCalendarEventLine,
  RiHospitalLine,
  RiHomeLine,
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
import * as StatusBadge from '@/components/ui/status-badge';
import * as Table from '@/components/ui/table';
import * as Dropdown from '@/components/ui/dropdown';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Input from '@/components/ui/input';
import * as Divider from '@/components/ui/divider';
import Header from '@/app/(main)/header';
import { useCareSupport } from '@/lib/careContext';
import { format, isToday } from 'date-fns';
import { TasksTableFilters } from './filters';
import CareEventDialog from '@/components/care-event-dialog';
import { CareEventsProvider } from '@/hooks/useCareEvents';

interface CareActivity {
  id: string;
  title: string;
  description: string;
  type: 'medical' | 'personal' | 'social' | 'transportation' | 'appointment' | 'meeting';
  priority: 'low' | 'medium' | 'high';
  status: 'in_progress' | 'completed' | 'overdue' | 'scheduled';
  assignedTo: string | null;
  dueDate: Date | null;
  tags: string[];
  recurring: boolean;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean; // Track actual completion status
}

const mockActivities: CareActivity[] = [
  {
    id: '1',
    title: 'Physical Therapy Session',
    description: 'Weekly physical therapy at Downtown Physical Therapy clinic',
    type: 'medical',
    priority: 'high',
    status: 'in_progress', // Will be calculated dynamically
    assignedTo: 'jim-nelson',
    dueDate: new Date('2025-10-15'), // October 15, 2025 - Future (Scheduled)
    tags: ['medical', 'rehabilitation'],
    recurring: true,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Grocery Shopping',
    description: 'Pick up weekly groceries and household items',
    type: 'personal',
    priority: 'medium',
    status: 'in_progress', // Will be calculated dynamically
    assignedTo: 'marta-snow',
    dueDate: new Date('2025-09-15'), // September 15, 2025 - Past (Overdue)
    tags: ['shopping', 'weekly'],
    recurring: true,
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-12'),
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Doctor Appointment',
    description: 'Follow-up appointment with Dr. Smith',
    type: 'appointment',
    priority: 'high',
    status: 'scheduled',
    assignedTo: null,
    dueDate: new Date('2025-10-25'), // October 25, 2025 - Future (Scheduled)
    tags: ['medical', 'follow-up'],
    recurring: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-05'),
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Family Dinner',
    description: 'Weekly family dinner at home',
    type: 'social',
    priority: 'low',
    status: 'completed',
    assignedTo: 'luann-wudlick',
    dueDate: new Date('2025-09-10'), // September 10, 2025 - Past (completed)
    tags: ['family', 'weekly'],
    recurring: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-12'),
    isCompleted: true, // This one is completed
  },
  {
    id: '5',
    title: 'Transportation to Bank',
    description: 'Bank appointment for business account matters',
    type: 'transportation',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'jim-nelson',
    dueDate: new Date('2025-09-20'), // September 20, 2025 - Past (overdue)
    tags: ['business', 'transportation'],
    recurring: false,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    isCompleted: false,
  },
  {
    id: '6',
    title: 'Medication Pickup',
    description: 'Pick up prescription medications from pharmacy',
    type: 'medical',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'marta-snow',
    dueDate: new Date('2025-10-05'), // October 5, 2025 - Past (overdue)
    tags: ['medical', 'prescription'],
    recurring: false,
    createdAt: new Date('2025-01-11'),
    updatedAt: new Date('2025-01-11'),
    isCompleted: false,
  },
  {
    id: '7',
    title: 'Weekly Check-in Call',
    description: 'Regular check-in call with family members',
    type: 'social',
    priority: 'low',
    status: 'completed',
    assignedTo: 'luann-wudlick',
    dueDate: new Date('2025-09-25'), // September 25, 2025 - Past (completed)
    tags: ['family', 'communication'],
    recurring: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-13'),
    isCompleted: true, // This one is completed
  },
  {
    id: '8',
    title: 'Overdue Lab Results',
    description: 'Review overdue lab test results with doctor',
    type: 'medical',
    priority: 'high',
    status: 'overdue',
    assignedTo: 'jim-nelson',
    dueDate: new Date('2025-09-01'), // September 1, 2025 - Past (overdue)
    tags: ['medical', 'urgent'],
    recurring: false,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    isCompleted: false,
  },
  {
    id: '9',
    title: 'Future Meeting',
    description: 'Scheduled business meeting next week',
    type: 'meeting',
    priority: 'medium',
    status: 'scheduled',
    assignedTo: 'marta-snow',
    dueDate: new Date('2025-10-30'), // October 30, 2025 - Future (scheduled)
    tags: ['business', 'planning'],
    recurring: false,
    createdAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
    isCompleted: false,
  },
  {
    id: '8',
    title: 'Home Maintenance',
    description: 'Schedule home maintenance and repairs',
    type: 'personal',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: null,
    dueDate: new Date('2025-09-28'), // September 28, 2025 - Past (overdue)
    tags: ['maintenance', 'home'],
    recurring: false,
    createdAt: new Date('2025-01-09'),
    updatedAt: new Date('2025-01-14'),
    isCompleted: false,
  },
  {
    id: '10',
    title: 'Overdue Insurance Claim',
    description: 'Submit overdue insurance claim for medical expenses',
    type: 'medical',
    priority: 'high',
    status: 'overdue',
    assignedTo: 'marta-snow',
    dueDate: new Date('2025-09-05'), // September 5, 2025 - Past (overdue)
    tags: ['medical', 'insurance', 'urgent'],
    recurring: false,
    createdAt: new Date('2025-01-05'),
    updatedAt: new Date('2025-01-14'),
    isCompleted: false,
  },
  {
    id: '11',
    title: 'Overdue Prescription Refill',
    description: 'Refill overdue prescription medication',
    type: 'medical',
    priority: 'medium',
    status: 'overdue',
    assignedTo: 'jim-nelson',
    dueDate: new Date('2025-09-12'), // September 12, 2025 - Past (overdue)
    tags: ['medical', 'prescription'],
    recurring: false,
    createdAt: new Date('2025-01-03'),
    updatedAt: new Date('2025-01-14'),
    isCompleted: false,
  },
];

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const getTypeConfig = (type: CareActivity['type']) => {
  const configs = {
    medical: { color: 'red' as const, label: 'Medical' },
    personal: { color: 'blue' as const, label: 'Personal' },
    social: { color: 'green' as const, label: 'Social' },
    transportation: { color: 'yellow' as const, label: 'Transportation' },
    appointment: { color: 'purple' as const, label: 'Appointment' },
    meeting: { color: 'gray' as const, label: 'Meeting' },
  };
  return configs[type];
};

const getTaskIcon = (type: CareActivity['type']) => {
  const iconMap = {
    medical: RiHospitalLine,
    personal: RiUserHeartLine,
    social: RiTeamLine,
    transportation: RiCarLine,
    appointment: RiCalendarEventLine,
    meeting: RiBriefcaseLine,
    event: RiCalendarLine,
  };
  return iconMap[type] || RiStickyNoteLine;
};

const getPriorityConfig = (priority: CareActivity['priority']) => {
  const configs = {
    low: { color: 'green' as const, label: 'Low' },
    medium: { color: 'yellow' as const, label: 'Medium' },
    high: { color: 'red' as const, label: 'High' },
  };
  return configs[priority];
};

// Function to calculate status based on due date and completion
const calculateStatus = (dueDate: Date | null, isCompleted: boolean = false): CareActivity['status'] => {
  if (isCompleted) {
    return 'completed';
  }
  
  if (!dueDate) {
    return 'in_progress'; // No due date = in progress
  }
  
  const today = new Date();
  const todayStr = today.toDateString();
  const dueDateStr = dueDate.toDateString();
  
  // If due date is today or in the past, it's overdue
  if (dueDate <= today) {
    return 'overdue';
  }
  
  // If due date is in the future, it's scheduled
  return 'scheduled';
};

const getStatusConfig = (status: CareActivity['status']) => {
  const configs = {
    in_progress: { color: 'orange' as const, label: 'In Progress' },
    completed: { color: 'green' as const, label: 'Completed' },
    overdue: { color: 'red' as const, label: 'Overdue' },
    scheduled: { color: 'blue' as const, label: 'Scheduled' },
  };
  return configs[status] || { color: 'orange' as const, label: 'In Progress' };
};

export default function TasksPage() {
  const { employees } = useCareSupport();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  
  // Process activities to calculate dynamic status
  const processedActivities = React.useMemo(() => {
    return mockActivities.map((activity, index) => {
      // Set some tasks to "In Progress" for testing variety
      if (index === 0 || index === 4) {
        return {
          ...activity,
          status: 'in_progress' as CareActivity['status'],
          isCompleted: false
        };
      }
      return {
        ...activity,
        status: calculateStatus(activity.dueDate, activity.isCompleted)
      };
    });
  }, []);
  
  const [activities, setActivities] = React.useState<CareActivity[]>(processedActivities);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [editingActivity, setEditingActivity] = React.useState<CareActivity | null>(null);

  // Map employee IDs to avatar images (matching Care Team data)
  const employeeAvatarMap: Record<string, string> = {
    'jim-nelson': '/images/avatar/illustration/arthur.png',
    'marta-snow': '/images/avatar/illustration/james.png',
    'luann-wudlick': '/images/avatar/illustration/sophia.png',
    'jennifer': '/images/avatar/illustration/emma.png',
    'sarah': '/images/avatar/illustration/matthew.png',
    'ella': '/images/avatar/illustration/laura.png',
    'alex': '/images/avatar/illustration/wei.png',
    'olena': '/images/avatar/illustration/james.png',
    'isabela': '/images/avatar/illustration/sophia.png',
    'lucy': '/images/avatar/illustration/arthur.png',
    'grace': '/images/avatar/illustration/emma.png',
    'kathleen': '/images/avatar/illustration/matthew.png',
    'annie': '/images/avatar/illustration/laura.png',
    'uncle-jim': '/images/avatar/illustration/wei.png',
    'dan': '/images/avatar/illustration/james.png',
    'robert-wudlick': '/images/avatar/illustration/james.png',
  };

  const handleCreateActivity = () => {
    setEditingActivity(null); // Clear any editing state
    setIsCreateDialogOpen(true);
  };

  const handleEventCreated = (eventId: string) => {
    console.log('Care event created/updated:', eventId);
    setIsCreateDialogOpen(false);
    setEditingActivity(null);
    // TODO: Refresh the activities list or update the specific event
  };

  const handleEditActivity = (activityId: string) => {
    const activity = activities.find(a => a.id === activityId);
    if (activity) {
      setEditingActivity(activity);
      setIsCreateDialogOpen(true);
    }
  };

  const handleStatusChange = (activityId: string, currentStatus: string) => {
    console.log('🔄 Status change clicked!', { activityId, currentStatus });
    
    // Cycle through: in_progress -> completed -> overdue -> scheduled -> in_progress
    const statusCycle: CareActivity['status'][] = ['in_progress', 'completed', 'overdue', 'scheduled'];
    const currentIndex = statusCycle.indexOf(currentStatus as CareActivity['status']);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const newStatus = statusCycle[nextIndex];
    
    setActivities(prev => prev.map(activity => {
      if (activity.id === activityId) {
        // Update completion status based on new status
        const newIsCompleted = newStatus === 'completed';
        return { 
          ...activity, 
          status: newStatus,
          isCompleted: newIsCompleted,
          updatedAt: new Date()
        };
      }
      return activity;
    }));
    
    console.log('✅ Status cycled to:', newStatus);
  };

  const handlePriorityChange = (activityId: string, currentPriority: string) => {
    console.log('🏁 Priority change clicked!', { activityId, currentPriority });
    // Cycle through: low -> medium -> high -> low
    const priorityCycle = ['low', 'medium', 'high'];
    const currentIndex = priorityCycle.indexOf(currentPriority);
    const newPriority = priorityCycle[(currentIndex + 1) % priorityCycle.length];
    
    // Update the activity priority in the state
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, priority: newPriority as CareActivity['priority'] }
        : activity
    ));
    
    console.log('✅ New priority:', newPriority);
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  const handleCompleteActivity = (activityId: string) => {
    setActivities(prev => prev.map(activity => 
      activity.id === activityId 
        ? { ...activity, status: 'completed' as const }
        : activity
    ));
  };

  // Define columns inside component to access handlers
  const columns: ColumnDef<CareActivity>[] = [
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
      size: 40,
      maxSize: 40,
      minSize: 40,
      meta: {
        className: 'pr-0',
      },
    },
    {
      id: 'activity',
      accessorKey: 'title',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Activity
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      enableSorting: true,
      size: 280,
      minSize: 250,
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            {React.createElement(getTaskIcon(row.original.type), { className: 'size-5 text-text-sub-600' })}
          </div>
          <div className='flex flex-col gap-0.5'>
            <span className='text-label-sm text-text-strong-950'>
              {row.original.title}
            </span>
            <span className='text-paragraph-xs text-text-sub-600 truncate'>
              {row.original.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'assignee',
      accessorKey: 'assignedTo',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Assignee
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      cell: ({ row }) => {
        const assignedMember = employees.find((m: any) => m.id === row.original.assignedTo);
        const avatarImage = assignedMember ? employeeAvatarMap[assignedMember.id] : null;
        return (
          <div className='flex min-w-[212px] items-center gap-3'>
            <Avatar.Root size='40'>
              {avatarImage ? (
                <Avatar.Image src={avatarImage} />
              ) : (
                <div className='flex size-10 items-center justify-center rounded-full bg-gray-100 border-2 border-dashed border-gray-300'>
                  <RiStickyNoteLine className='size-5 text-gray-400' />
                </div>
              )}
            </Avatar.Root>
            <div className='flex flex-col gap-0.5'>
              <span className='text-label-sm text-text-strong-950'>
                {assignedMember ? assignedMember.name : 'Open to anyone'}
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                {getTypeConfig(row.original.type).label}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Status
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      size: 120,
      minSize: 100,
        cell: ({ row }) => {
          const statusConfig = getStatusConfig(row.original.status);
          // All statuses are clickable, but they have different behaviors
          const isClickable = true;
          
          // Map status to StatusBadge variant and custom styling
        const getBadgeVariant = (status: string) => {
          switch (status) {
            case 'completed': return 'completed';
            case 'in_progress': return 'pending';
            case 'overdue': return 'failed';
            case 'scheduled': return 'pending'; // Will be overridden with custom blue styling
            default: return 'disabled';
          }
        };

        const isScheduled = row.original.status === 'scheduled';
          
          return (
            <StatusBadge.Root 
              status={getBadgeVariant(row.original.status)}
              variant="light"
              onClick={(e) => {
                console.log('🔥 StatusBadge clicked!', { 
                  activityId: row.original.id, 
                  currentStatus: row.original.status,
                  isClickable 
                });
                e.preventDefault();
                e.stopPropagation();
                if (isClickable) {
                  handleStatusChange(row.original.id, row.original.status);
                } else {
                  console.log('❌ Status not clickable:', row.original.status);
                }
              }}
              className={`${
                isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default'
              } ${
                isScheduled ? 'bg-blue-50 text-blue-600' : ''
              }`}
              style={{ pointerEvents: isClickable ? 'auto' : 'none' }}
            >
              {statusConfig.label}
            </StatusBadge.Root>
          );
        },
    },
    {
      id: 'dueDate',
      accessorKey: 'dueDate',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Due Date
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      size: 120,
      minSize: 100,
      cell: ({ row }) => {
        const dueDate = row.original.dueDate;
        return (
          <div className='flex flex-col gap-0.5'>
            {dueDate ? (
              <>
                <span className='text-label-sm text-text-strong-950'>
                  {format(dueDate, 'MMM dd, yyyy')}
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  {isToday(dueDate) ? 'Today' : format(dueDate, 'EEEE')}
                </span>
              </>
            ) : (
              <span className='text-label-sm text-text-sub-600'>
                No due date
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Priority
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      size: 100,
      minSize: 80,
      cell: ({ row }) => {
        const priorityConfig = getPriorityConfig(row.original.priority);
        return (
          <div
            onClick={(e) => {
              console.log('🔥 Priority clicked!', { 
                activityId: row.original.id, 
                currentPriority: row.original.priority
              });
              e.preventDefault();
              e.stopPropagation();
              handlePriorityChange(row.original.id, row.original.priority);
            }}
            className='flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity'
          >
            <RiFlagLine className={`size-4 ${
              row.original.priority === 'high' ? 'text-red-600' :
              row.original.priority === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <span className={`text-label-sm font-medium capitalize ${
              row.original.priority === 'high' ? 'text-red-600' :
              row.original.priority === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {priorityConfig.label}
            </span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      size: 60,
      maxSize: 60,
      minSize: 60,
      cell: ({ row }) => (
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button.Root variant='neutral' mode='ghost' size='xsmall'>
              <Button.Icon as={RiMore2Line} />
            </Button.Root>
          </Dropdown.Trigger>
          <Dropdown.Content align='end' className='w-48'>
            <Dropdown.Item onClick={() => handleEditActivity(row.original.id)}>
              <RiEditLine className='mr-2 h-4 w-4' />
              Edit Activity
            </Dropdown.Item>
            {row.original.status !== 'completed' && (
              <Dropdown.Item onClick={() => handleCompleteActivity(row.original.id)}>
                <RiCheckboxCircleFill className='mr-2 h-4 w-4' />
                Mark Complete
              </Dropdown.Item>
            )}
            <Dropdown.Separator />
            <Dropdown.Item className='text-red-600' onClick={() => handleDeleteActivity(row.original.id)}>
              <RiDeleteBinLine className='mr-2 h-4 w-4' />
              Delete Activity
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      ),
      meta: {
        className: 'px-4',
      },
    },
  ];

  const table = useReactTable({
    data: activities,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    filterFns: {
      statusFilter: (row, columnId, filterValue) => {
        if (!filterValue || filterValue === 'all') return true;
        
        // Map filter values to actual status values
        const filterMapping: Record<string, string[]> = {
          'in_progress': ['in_progress'],
          'completed': ['completed'],
          'overdue': ['overdue'],
          'scheduled': ['scheduled']
        };
        
        const matchingStatuses = filterMapping[filterValue] || [];
        return matchingStatuses.includes(row.original.status);
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
          id: 'dueDate',
          desc: false,
        },
      ],
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <CareEventsProvider>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStickyNoteLine className='size-6 text-text-sub-600' />
          </div>
        }
        title="Care Tasks"
        description="Task view of your care schedule"
        contentClassName='hidden lg:flex'
      >
        <Button.Root 
          className='hidden lg:flex' 
          onClick={handleCreateActivity}
          variant='primary'
          mode='filled'
        >
          <Button.Icon as={RiAddLine} />
          Add Task
        </Button.Root>
        <Button.Root className='w-full lg:hidden' onClick={handleCreateActivity}>
          <Button.Icon as={RiAddLine} />
          Add Task
        </Button.Root>
      </Header>

      <div className='lg:px-8'>
        <Divider.Root />
      </div>

      <div className='flex flex-1 flex-col px-4 lg:px-8 lg:pb-6'>
        {/* Filters */}
        <div className='pt-5 lg:pt-4'>
          <TasksTableFilters 
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            table={table}
          />
        </div>

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
      </div>

      {/* Create Request Dialog */}
      <CareEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setEditingActivity(null);
        }}
        onEventCreated={handleEventCreated}
        selectedDate={new Date()}
        selectedTime={new Date()}
        isEditMode={!!editingActivity}
        initialFormData={editingActivity ? {
          title: editingActivity.title,
          requestType: editingActivity.type,
          customRequestType: '',
          description: editingActivity.description,
          careRecipient: 'Care Recipient', // Default value
          assignedPerson: editingActivity.assignedTo || '',
          customAssignedPerson: '',
          customPersonContact: '',
          customPersonContactType: 'phone' as const,
          startDate: editingActivity.dueDate || new Date(),
          endDate: editingActivity.dueDate || new Date(),
          isRecurring: editingActivity.recurring,
          recurrencePattern: {
            frequency: 'weekly' as const,
            interval: 1,
            daysOfWeek: [],
          },
          location: '',
          customLocation: '',
          notes: '',
        } : undefined}
      />
    </CareEventsProvider>
  );
}