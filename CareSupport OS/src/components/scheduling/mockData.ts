import { Shift } from './types';

export const mockShifts: Shift[] = [
  {
    id: 'shift-001',
    clientId: 'client-001',
    clientName: 'John Smith',
    caregiverId: 'cg-001',
    caregiverName: 'Jane Doe, RN',
    startTime: '2024-04-15T09:00:00',
    endTime: '2024-04-15T17:00:00',
    status: 'Scheduled',
    type: 'Hourly',
    complianceStatus: {
      isCompliant: true,
      checks: [
        {
          control: 'CRD-1',
          status: 'Pass',
          message: 'All credentials valid'
        },
        {
          control: 'EVV-2',
          status: 'Pass',
          message: 'Location verified'
        }
      ]
    },
    planOfCareTasks: ['Medication administration', 'Vital signs monitoring']
  },
  {
    id: 'shift-002',
    clientId: 'client-002',
    clientName: 'Mary Johnson',
    caregiverId: 'cg-002',
    caregiverName: 'Robert Wilson, CNA',
    startTime: '2024-04-15T10:00:00',
    endTime: '2024-04-15T14:00:00',
    status: 'Pending',
    type: 'Hourly',
    complianceStatus: {
      isCompliant: false,
      checks: [
        {
          control: 'CRD-1',
          status: 'Fail',
          message: 'CNA License expires in 30 days'
        }
      ]
    },
    planOfCareTasks: ['Personal care', 'Light housekeeping']
  }
];