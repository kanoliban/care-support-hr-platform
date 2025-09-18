import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, AlertCircle, Users, Calendar,
  CheckCircle, XCircle, ArrowRight, Phone,
  Shield, UserCheck, UserX, Activity
} from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';
import { useCareCoordination, useCoverageStatus, useTeamAvailability, useCurrentShift } from '../contexts/CareCoordinationContext';

function CommandCenterView() {
  const navigate = useNavigate();
  const { settings } = useSystemSettings();
  
  // Use real care coordination data
  const careContext = useCareCoordination();
  const coverageStatus = useCoverageStatus();
  const teamAvailability = useTeamAvailability();
  const currentShift = useCurrentShift();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}${minute !== '00' ? ':' + minute : ''}${ampm}`;
  };

  const formatDateRange = (date: string, startTime: string, endTime: string) => {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName} ${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getCoverageStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            {getTimeOfDay()}, {settings.coordinatorName}
          </h1>
          <p className="text-gray-600 mt-1">Your care team coordination center</p>
        </header>

        {/* Command Center KPI Cards - 4x4 Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => navigate('/schedule')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Coverage Today</div>
              <Shield size={20} className="text-purple-600" />
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getCoverageStatusColor(coverageStatus.coveragePercentage)}`}>
              {coverageStatus.coveragePercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {coverageStatus.gapWindows} gaps • {coverageStatus.coveredWindows} confirmed
            </div>
          </button>

          <button 
            onClick={() => navigate('/schedule')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Current Shift</div>
              <UserCheck size={20} className="text-purple-600" />
            </div>
            <div className="text-lg font-semibold mb-1">
              {currentShift.currentTeamMember?.name || 'No one assigned'}
            </div>
            <div className="text-sm text-gray-600">
              {currentShift.currentWindow && 
                `${formatTime(currentShift.currentWindow.startTime)}-${formatTime(currentShift.currentWindow.endTime)}`
              }
            </div>
          </button>

          <button 
            onClick={() => navigate('/schedule')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Next Shift</div>
              <Clock size={20} className="text-purple-600" />
            </div>
            <div className="text-lg font-semibold mb-1">
              {currentShift.nextTeamMember?.name || 'TBD'}
            </div>
            <div className={`text-sm ${currentShift.nextWindow?.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
              {currentShift.nextWindow && 
                `${formatTime(currentShift.nextWindow.startTime)}-${formatTime(currentShift.nextWindow.endTime)} ${
                  currentShift.nextWindow.status === 'confirmed' ? '✓' : '?'
                }`
              }
            </div>
          </button>

          <button 
            onClick={() => navigate('/schedule/team')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Team Status</div>
              <Users size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">{teamAvailability.availableMembers}</div>
            <div className="text-sm text-gray-600">
              {teamAvailability.membersByRole.paidCaregivers.length} regular • {teamAvailability.membersByRole.backupCaregivers.length + teamAvailability.membersByRole.familyCaregivers.length} backup
            </div>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Coverage Gaps & Alerts */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">Coverage Gaps</h2>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  View schedule
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {coverageStatus.activeGaps.map((gap) => (
                  <button
                    key={gap.id}
                    onClick={() => navigate('/schedule')}
                    className="w-full p-4 hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className={getPriorityColor(gap.severity)} />
                      <div className="text-left">
                        <div className="font-medium">
                          {formatDateRange(gap.date, gap.startTime, gap.endTime)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {gap.reason.replace('_', ' ')} • {gap.backupRequestsSent.length} contacted
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {gap.backupRequestsSent.filter(req => req.status !== 'sent').length}/{gap.backupRequestsSent.length}
                      </span>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                    </div>
                  </button>
                ))}
                {coverageStatus.activeGaps.length === 0 && (
                  <div className="p-8 text-center">
                    <CheckCircle size={32} className="text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">All time slots covered!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Quick Actions</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/schedule')}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar size={20} className="text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-purple-600">View Schedule</div>
                    <div className="text-sm text-gray-500">Full team calendar</div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/schedule/team')}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users size={20} className="text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-purple-600">Care Team</div>
                    <div className="text-sm text-gray-500">Team availability & contact</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Current Activity */}
          <div className="space-y-6">
            {/* Active Shifts */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Active Care</h2>
              </div>
              <div className="p-4 space-y-4">
                {/* Current Shift */}
                {currentShift.currentTeamMember && currentShift.currentWindow && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{currentShift.currentTeamMember.name}</div>
                      <div className="flex items-center gap-1">
                        <Activity size={12} className="text-green-500" />
                        <span className="text-xs text-gray-500">On duty</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(currentShift.currentWindow.startTime)} - {formatTime(currentShift.currentWindow.endTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Last update: {new Date(currentShift.currentTeamMember.lastAvailabilityUpdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-xs text-purple-600">
                      {currentShift.currentWindow.requiredCareTypes.join(', ')}
                    </div>
                  </div>
                )}
                
                {/* Next Shift */}
                {currentShift.nextTeamMember && currentShift.nextWindow && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{currentShift.nextTeamMember.name}</div>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={12} className="text-blue-500" />
                        <span className="text-xs text-gray-500">
                          {currentShift.nextWindow.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatTime(currentShift.nextWindow.startTime)} - {formatTime(currentShift.nextWindow.endTime)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Reliability: {Math.round(currentShift.nextTeamMember.reliability.showUpRate * 100)}% show rate
                    </div>
                  </div>
                )}
                
                {/* No current activity */}
                {!currentShift.currentTeamMember && (
                  <div className="text-center py-4 text-gray-500">
                    <Clock size={24} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No active shift right now</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Status */}
            {coverageStatus.activeGaps.length > 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {coverageStatus.activeGaps.length} coverage gap{coverageStatus.activeGaps.length > 1 ? 's' : ''} need attention. 
                      Click above to find backup coverage.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      All shifts covered and confirmed. Your care team is coordinated!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default CommandCenterView;