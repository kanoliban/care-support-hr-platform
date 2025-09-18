import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Clock, UserCheck, UserX, Activity } from 'lucide-react';
import { Shift } from './types';
import { useCareCoordination } from '../../contexts/CareCoordinationContext';

interface ListViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
}

type SortField = 'date' | 'client' | 'caregiver' | 'status';
type SortDirection = 'asc' | 'desc';

function ListView({ shifts, onShiftClick }: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const careContext = useCareCoordination();

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedShifts = [...shifts].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) * direction;
      case 'client':
        return a.clientName.localeCompare(b.clientName) * direction;
      case 'caregiver':
        return a.caregiverName.localeCompare(b.caregiverName) * direction;
      case 'status':
        return a.status.localeCompare(b.status) * direction;
      default:
        return 0;
    }
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const getStatusColor = (shift: Shift) => {
    if (!shift.complianceStatus.isCompliant) {
      return 'bg-red-100 text-red-800';
    }
    switch (shift.status) {
      case 'Scheduled':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blocked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityInfo = (caregiverId: string) => {
    const teamMember = careContext.careTeam.find(m => m.id === caregiverId);
    if (!teamMember) return { availability: 'unknown', icon: <Activity size={16} className="text-gray-400" />, color: 'bg-gray-100 text-gray-600' };
    
    const { currentAvailability } = teamMember;
    switch (currentAvailability) {
      case 'available':
        return { availability: 'Available', icon: <UserCheck size={16} className="text-green-600" />, color: 'bg-green-100 text-green-600' };
      case 'busy':
        return { availability: 'Busy', icon: <Clock size={16} className="text-yellow-600" />, color: 'bg-yellow-100 text-yellow-600' };
      case 'unavailable':
        return { availability: 'Unavailable', icon: <UserX size={16} className="text-red-600" />, color: 'bg-red-100 text-red-600' };
      default:
        return { availability: 'Unknown', icon: <Activity size={16} className="text-gray-400" />, color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center gap-1">
                Date & Time
                <SortIcon field="date" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('client')}
            >
              <div className="flex items-center gap-1">
                Client
                <SortIcon field="client" />
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('caregiver')}
            >
              <div className="flex items-center gap-1">
                Caregiver
                <SortIcon field="caregiver" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Availability
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1">
                Status
                <SortIcon field="status" />
              </div>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tasks
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Compliance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedShifts.map((shift) => (
            <tr 
              key={shift.id}
              onClick={() => onShiftClick(shift)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(shift.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(shift.startTime).toLocaleTimeString([], { 
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                      {' - '}
                      {new Date(shift.endTime).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{shift.clientName}</div>
                <div className="text-sm text-gray-500">{shift.type}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{shift.caregiverName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(() => {
                  const availInfo = getAvailabilityInfo(shift.caregiverId);
                  return (
                    <div className="flex items-center gap-2">
                      {availInfo.icon}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${availInfo.color}`}>
                        {availInfo.availability}
                      </span>
                    </div>
                  );
                })()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(shift)
                }`}>
                  {shift.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">
                  {shift.planOfCareTasks.length} tasks
                </div>
              </td>
              <td className="px-6 py-4">
                {!shift.complianceStatus.isCompliant && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle size={16} />
                    <span className="text-sm">
                      {shift.complianceStatus.checks.filter(c => c.status === 'Fail').length} issues
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;