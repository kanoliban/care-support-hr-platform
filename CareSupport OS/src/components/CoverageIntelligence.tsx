import React, { useState } from 'react';
import { AlertTriangle, Clock, Users, Phone, CheckCircle, Search, Filter, TrendingUp, Brain, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination, useCoverageStatus, useTeamAvailability } from '../contexts/CareCoordinationContext';

function CoverageIntelligence() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Next 7 Days');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  // Use real care coordination data
  const careContext = useCareCoordination();
  const coverageStatus = useCoverageStatus();
  const teamAvailability = useTeamAvailability();

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle size={20} className="text-red-600" />;
      case 'high': return <AlertTriangle size={16} className="text-red-600" />;
      case 'medium': return <Clock size={16} className="text-yellow-600" />;
      case 'low': return <Clock size={16} className="text-blue-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getReasonDisplayName = (reason: string) => {
    return reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredGaps = coverageStatus.activeGaps.filter(gap => 
    severityFilter === 'all' || gap.severity === severityFilter
  );

  // Calculate coverage intelligence metrics
  const currentCoverageRate = coverageStatus.coveragePercentage;
  const predictedRisk = filteredGaps.length > 3 ? 'High' : filteredGaps.length > 1 ? 'Medium' : 'Low';
  const avgResponseTime = coverageStatus.activeGaps.length > 0 ? 
    Math.round(coverageStatus.activeGaps.reduce((sum, gap) => {
      return sum + (gap.backupRequestsSent.length * 2); // Mock response time calculation
    }, 0) / coverageStatus.activeGaps.length) : 0;

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle size={28} className="text-purple-600" />
              Coverage Gaps
            </h1>
            <p className="text-gray-600">Monitor and resolve coverage gaps</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Clock size={16} />
              {timeRange}
            </button>
          </div>
        </header>

        {/* Coverage Summary */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-purple-600" />
              <div className="text-sm text-gray-500">Coverage Score</div>
            </div>
            <div className={`text-2xl font-semibold ${
              currentCoverageRate >= 90 ? 'text-green-600' : 
              currentCoverageRate >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {currentCoverageRate}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {currentCoverageRate >= 90 ? 'Excellent' : 
               currentCoverageRate >= 70 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-blue-600" />
              <div className="text-sm text-gray-500">Risk Level</div>
            </div>
            <div className={`text-2xl font-semibold ${
              predictedRisk === 'High' ? 'text-red-600' : 
              predictedRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {predictedRisk}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Based on gap patterns
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} className="text-green-600" />
              <div className="text-sm text-gray-500">Avg Response Time</div>
            </div>
            <div className="text-2xl font-semibold text-green-600">
              {avgResponseTime}h
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Time to fill gaps
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-blue-600" />
              <div className="text-sm text-gray-500">Available Backups</div>
            </div>
            <div className="text-2xl font-semibold text-blue-600">
              {teamAvailability.availableBackups.length}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Ready to help
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {coverageStatus.activeGaps.length > 0 && (
          <div className="mb-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Action Required</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  You have {coverageStatus.activeGaps.length} coverage gap{coverageStatus.activeGaps.length > 1 ? 's' : ''} that need immediate attention.
                </p>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                    onClick={() => navigate('/schedule/team')}
                  >
                    Contact Team Members
                  </button>
                  <button 
                    className="px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 text-sm"
                    onClick={() => navigate('/care-recipient')}
                  >
                    View Emergency Contacts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Coverage Gaps */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Coverage Gaps</h2>
              <p className="text-sm text-gray-600">Current gaps requiring coverage</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setSeverityFilter(severity)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      severityFilter === severity
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {severity === 'all' ? 'All' : severity}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredGaps.length > 0 ? (
              filteredGaps.map((gap) => (
                <div key={gap.id} className={`p-6 border-l-4 ${getSeverityColor(gap.severity).replace('text-', 'border-').split(' ')[0].replace('bg-', 'border-')}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getSeverityIcon(gap.severity)}
                        <h3 className="font-semibold text-gray-900">
                          {formatDateRange(gap.date, gap.startTime, gap.endTime)}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                          {gap.severity}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        <strong>Reason:</strong> {getReasonDisplayName(gap.reason)}
                      </p>

                      {/* Backup Request Status */}
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Backup Requests:</div>
                        {gap.backupRequestsSent.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {gap.backupRequestsSent.map((request) => {
                              const teamMember = careContext.careTeam.find(m => m.id === request.teamMemberId);
                              return (
                                <div key={request.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                  <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" />
                                    <span>{teamMember?.name || 'Unknown'}</span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    request.status === 'declined' ? 'bg-red-100 text-red-800' :
                                    request.status === 'seen' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {request.status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic">No backup requests sent yet</div>
                        )}
                      </div>

                      {/* Action Steps */}
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock size={14} className="text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Next Steps</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {gap.severity === 'critical' || gap.severity === 'high' ? 
                            'Contact backup caregivers immediately. Consider calling family members.' :
                            gap.severity === 'medium' ?
                            'Send notifications to backup caregivers. Follow up in a few hours.' :
                            'Send reminders to available team members.'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button 
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                        onClick={() => navigate('/schedule')}
                      >
                        Find Coverage
                      </button>
                      <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 text-sm">
                        Contact Team
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Coverage Gaps Resolved!</h3>
                <p className="text-gray-600">Your care team coordination is running smoothly.</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Backup Team Members */}
        {teamAvailability.availableBackups.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-600" />
              Available Backup Caregivers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamAvailability.availableBackups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <div className="font-medium text-gray-900">{backup.name}</div>
                    <div className="text-sm text-gray-600">{backup.relationshipToCareRecipient}</div>
                    <div className="text-sm text-green-600">{Math.round(backup.reliability.showUpRate * 100)}% reliable</div>
                  </div>
                  <button 
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    onClick={() => navigate('/schedule/team')}
                  >
                    Contact
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CoverageIntelligence;