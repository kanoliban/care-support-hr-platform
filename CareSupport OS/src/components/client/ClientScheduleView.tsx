import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ListView from '../scheduling/ListView';
import CalendarView from '../scheduling/CalendarView';
import CreateShiftModal from '../scheduling/CreateShiftModal';
import ShiftDetailModal from '../scheduling/ShiftDetailModal';
import { Shift } from '../scheduling/types';
import { mockShifts } from '../scheduling/mockData';

function ClientScheduleView() {
  const navigate = useNavigate();
  const [view, setView] = useState<'calendar' | 'list'>('list'); // Default to list view
  const [dateRange, setDateRange] = useState('This Week (Apr 15 - Apr 21)');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Filter shifts to only show client-related shifts
  const filteredShifts = mockShifts.filter(shift => {
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        shift.clientName.toLowerCase().includes(search) ||
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
            <h1 className="text-2xl font-semibold">Client Schedule</h1>
            <p className="text-gray-600">Manage client care visits and activities</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              {view === 'calendar' ? 'List View' : 'Calendar View'}
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Schedule Visit
            </button>
          </div>
        </header>

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
                placeholder="Search by client or caregiver"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
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

export default ClientScheduleView;