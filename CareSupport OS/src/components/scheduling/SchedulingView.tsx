import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Plus, Filter, Clock, AlertCircle, Users, Search, Shield, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CalendarView from './CalendarView';
import ListView from './ListView';
import CreateShiftModal from './CreateShiftModal';
import ShiftDetailModal from './ShiftDetailModal';
import { Shift } from './types';
import { useCareCoordination, useCoverageStatus, useCurrentShift } from '../../contexts/CareCoordinationContext';

function SchedulingView() {
  const navigate = useNavigate();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [dateRange, setDateRange] = useState('This Week');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'confirmed' | 'gaps'>('all');
  
  // Use real care coordination data
  const careContext = useCareCoordination();
  const coverageStatus = useCoverageStatus();
  const currentShift = useCurrentShift();

  const totalCoverageWindows = careContext.currentCoverage.length;
  const gapWindows = coverageStatus.gapWindows;
  const atRiskWindows = careContext.currentCoverage.filter(w => w.status === 'at_risk').length;

  // Generate shifts from team members' regular schedules + current coverage windows
  const generateShiftsFromRegularSchedules = () => {
    const shifts: Shift[] = [];
    const today = new Date();
    
    // Calculate days until end of year
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    const daysUntilEndOfYear = Math.ceil((endOfYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Generate shifts through end of year
    for (let i = 0; i < daysUntilEndOfYear; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Find team members who have regular shifts on this day
      careContext.careTeam.forEach(member => {
        // Skip if member is unavailable or has no regular shifts
        if (member.currentAvailability === 'unavailable' || !member.regularShifts) return;
        
        member.regularShifts.forEach(regularShift => {
          if (regularShift.isActive && regularShift.daysOfWeek.includes(dayOfWeek)) {
            const shiftId = `regular-${member.id}-${dateString}-${regularShift.startTime}`;
            
            // Check if there's a coverage window for this time/date
            const coverageWindow = careContext.currentCoverage.find(w => 
              w.date === dateString && 
              w.startTime === regularShift.startTime &&
              w.endTime === regularShift.endTime
            );
            
            shifts.push({
              id: shiftId,
              clientId: careContext.careRecipient.id,
              clientName: careContext.careRecipient.name,
              caregiverId: member.id,
              caregiverName: member.name,
              startTime: `${dateString}T${regularShift.startTime}:00`,
              endTime: `${dateString}T${regularShift.endTime}:00`,
              status: coverageWindow ? 
                (coverageWindow.status === 'gap' ? 'Blocked' : 
                 coverageWindow.status === 'confirmed' ? 'Scheduled' : 'Pending') :
                'Scheduled', // Regular shifts are assumed scheduled
              type: 'Hourly' as any,
              complianceStatus: {
                isCompliant: coverageWindow?.status !== 'gap',
                checks: coverageWindow?.status === 'gap' ? [
                  { control: 'Coverage', status: 'Fail' as any, message: 'Coverage gap detected' }
                ] : [
                  { control: 'Coverage', status: 'Pass' as any, message: 'Regular shift scheduled' }
                ]
              },
              planOfCareTasks: coverageWindow?.requiredCareTypes || ['personal_care']
            });
          }
        });
      });
    }
    
    // Add any coverage windows that don't have corresponding regular shifts
    careContext.currentCoverage.forEach(window => {
      const existingShift = shifts.find(s => 
        s.startTime.includes(window.date) && 
        s.startTime.includes(window.startTime)
      );
      
      if (!existingShift) {
        shifts.push({
          id: window.id,
          clientId: careContext.careRecipient.id,
          clientName: careContext.careRecipient.name,
          caregiverId: window.assignedTeamMember || 'unassigned',
          caregiverName: window.assignedTeamMember 
            ? careContext.careTeam.find(m => m.id === window.assignedTeamMember)?.name || 'TBD'
            : 'Unassigned',
          startTime: `${window.date}T${window.startTime}:00`,
          endTime: `${window.date}T${window.endTime}:00`,
          status: window.status === 'gap' ? 'Blocked' : window.status === 'confirmed' ? 'Scheduled' : 'Pending' as any,
          type: 'Hourly' as any,
          complianceStatus: {
            isCompliant: window.status !== 'gap',
            checks: window.status === 'gap' ? [
              { control: 'Coverage', status: 'Fail' as any, message: 'No caregiver assigned' }
            ] : [
              { control: 'Coverage', status: 'Pass' as any, message: 'Caregiver confirmed' }
            ]
          },
          planOfCareTasks: window.requiredCareTypes
        });
      }
    });
    
    return shifts.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const coverageShifts = generateShiftsFromRegularSchedules();

  const filteredShifts = coverageShifts.filter(shift => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        shift.caregiverName.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const handleSaveShift = (shift: Shift) => {
    setShowCreateModal(false);
  };

  const handleUpdateShift = (shift: Shift) => {
    setSelectedShift(null);
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Care Schedule</h1>
            <p className="text-gray-600">24/7 coverage coordination for {careContext.careRecipient.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <CalendarIcon size={16} />
              {view === 'calendar' ? 'List View' : 'Calendar View'}
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Coverage
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <button 
            className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setFilterType('all')}
          >
            <div className="text-sm text-gray-500 mb-1">Total Coverage Windows</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">{totalCoverageWindows}</div>
              <Shield size={20} className="text-purple-600" />
            </div>
          </button>
          <button 
            className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setFilterType('gaps')}
          >
            <div className="text-sm text-gray-500 mb-1">Coverage Gaps</div>
            <div className="flex items-center gap-2">
              <div className={`text-2xl font-semibold ${gapWindows > 0 ? 'text-red-600' : 'text-green-600'}`}>{gapWindows}</div>
              <AlertCircle size={20} className={gapWindows > 0 ? 'text-red-600' : 'text-green-600'} />
            </div>
          </button>
          <button 
            className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setFilterType('confirmed')}
          >
            <div className="text-sm text-gray-500 mb-1">Confirmed Coverage</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">{coverageStatus.coveredWindows}</div>
              <UserCheck size={20} className="text-green-600" />
            </div>
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              {dateRange}
              <ChevronDown size={16} />
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by caregiver or time"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Filter
              <Filter size={16} />
            </button>
          </div>

          <div className="p-4">
            {view === 'calendar' ? (
              <CalendarView 
                shifts={filteredShifts}
                onShiftClick={setSelectedShift}
              />
            ) : (
              <ListView
                shifts={filteredShifts}
                onShiftClick={setSelectedShift}
              />
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateShiftModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveShift}
        />
      )}

      {selectedShift && (
        <ShiftDetailModal
          shift={selectedShift}
          onClose={() => setSelectedShift(null)}
          onUpdate={handleUpdateShift}
        />
      )}
    </main>
  );
}

export default SchedulingView;