import React, { useState, useMemo } from 'react';
import { Shift } from './types';
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';

interface CalendarViewProps {
  shifts: Shift[];
  onShiftClick: (shift: Shift) => void;
  onDateClick?: (date: Date) => void;
}

function CalendarView({ shifts, onShiftClick, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');

  // Get the start and end dates for the current view
  const viewDates = useMemo(() => {
    const dates = [];
    let startDate: Date;
    let numDays: number;

    if (view === 'week') {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      numDays = 7;
    } else {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDay = startDate.getDay();
      startDate.setDate(startDate.getDate() - firstDay);
      numDays = 42; // Always show 6 weeks
    }

    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, [currentDate, view]);

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => {
      const shiftDate = new Date(shift.startTime);
      return (
        shiftDate.getFullYear() === date.getFullYear() &&
        shiftDate.getMonth() === date.getMonth() &&
        shiftDate.getDate() === date.getDate()
      );
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const getShiftStatusColor = (shift: Shift) => {
    if (!shift.complianceStatus.isCompliant) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    switch (shift.status) {
      case 'Scheduled':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'Blocked':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleDateClick = (date: Date, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isShiftButton = target.closest('button[data-shift-id]');
    const isDateCell = target.closest('[data-date-cell]');
    
    if (!isShiftButton && isDateCell) {
      e.preventDefault();
      e.stopPropagation();
      onDateClick?.(date);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-medium">
            {view === 'week'
              ? `Week of ${viewDates[0].toLocaleDateString('en-US', { 
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}`
              : currentDate.toLocaleDateString('en-US', { 
                  month: 'long',
                  year: 'numeric'
                })}
          </h3>
          <button
            onClick={() => navigate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('week')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'week'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === 'month'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="px-3 py-2">
              <span className="text-sm font-medium text-gray-900">{day}</span>
            </div>
          ))}
        </div>

        <div className={`grid grid-cols-7 ${view === 'month' ? 'grid-rows-6' : ''} divide-x divide-y divide-gray-200`}>
          {viewDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const dateShifts = getShiftsForDate(date);

            return (
              <div
                key={index}
                data-date-cell="true"
                onClick={(e) => handleDateClick(date, e)}
                className={`${view === 'month' ? 'h-24' : 'h-96'} p-2 transition-colors ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                }`}
              >
                <div 
                  data-date-cell="true"
                  className={`flex items-center gap-1 mb-1 ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  <span 
                    data-date-cell="true"
                    className={`w-7 h-7 flex items-center justify-center text-sm font-medium rounded-full ${
                      isToday ? 'bg-purple-600 text-white' : ''
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
                  {dateShifts.map((shift) => (
                    <button
                      key={shift.id}
                      data-shift-id={shift.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onShiftClick(shift);
                      }}
                      className={`w-full group relative p-2 rounded-lg border text-left transition-all hover:shadow-md ${
                        getShiftStatusColor(shift)
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">
                          {shift.clientName}
                        </span>
                        {!shift.complianceStatus.isCompliant && (
                          <AlertCircle size={16} className="text-red-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-0.5 opacity-75">
                        <Clock size={12} />
                        <span>
                          {new Date(shift.startTime).toLocaleTimeString([], { 
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                          {' - '}
                          {new Date(shift.endTime).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="text-xs mt-1 truncate">
                        {shift.caregiverName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;