import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, MessageSquare, Search, Filter, AlertTriangle, CheckCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination, useCoverageStatus, useTeamAvailability } from '../contexts/CareCoordinationContext';

function FindCoverageView() {
  const navigate = useNavigate();
  const [selectedGap, setSelectedGap] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'normal' | 'urgent' | 'emergency'>('normal');
  
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter available backup caregivers who could potentially cover the gap
  const availableBackups = teamAvailability.availableBackups.filter(member => 
    member.currentAvailability === 'available'
  );

  // Default message based on selected gap
  const getDefaultMessage = (gap: any) => {
    if (!gap) return '';
    
    const gapInfo = formatDateRange(gap.date, gap.startTime, gap.endTime);
    const urgencyText = urgencyLevel === 'emergency' ? 'EMERGENCY: ' : 
                      urgencyLevel === 'urgent' ? 'URGENT: ' : '';
    
    return `${urgencyText}Hi! We need backup coverage for ${gapInfo}. Can you help? Please let us know ASAP. Thanks!`;
  };

  const handleGapSelect = (gapId: string) => {
    setSelectedGap(gapId);
    const gap = coverageStatus.activeGaps.find(g => g.id === gapId);
    if (gap) {
      setMessage(getDefaultMessage(gap));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSendRequests = () => {
    // In real implementation, this would send actual notifications
    if (selectedGap && selectedMembers.length > 0) {
      console.log('Sending coverage requests:', {
        gapId: selectedGap,
        members: selectedMembers,
        message,
        urgency: urgencyLevel
      });
      
      // Show success feedback
      alert(`Coverage requests sent to ${selectedMembers.length} team member(s)!`);
      
      // Reset form
      setSelectedGap('');
      setSelectedMembers([]);
      setMessage('');
      setUrgencyLevel('normal');
    }
  };

  const selectedGapData = coverageStatus.activeGaps.find(g => g.id === selectedGap);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Find Coverage</h1>
            <p className="text-gray-600">Request backup coverage for gaps and emergencies</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/gaps')}
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            >
              View All Gaps
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Gap Selection */}
          <div className="col-span-2 space-y-6">
            {/* Step 1: Select Coverage Gap */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">1. Select Coverage Gap</h2>
                <p className="text-sm text-gray-600">Choose which gap needs coverage</p>
              </div>
              
              <div className="p-6">
                {coverageStatus.activeGaps.length > 0 ? (
                  <div className="space-y-3">
                    {coverageStatus.activeGaps.map((gap) => (
                      <div
                        key={gap.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedGap === gap.id 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleGapSelect(gap.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <AlertTriangle size={16} className={`${getSeverityColor(gap.severity).split(' ')[0]}`} />
                              <span className="font-medium">
                                {formatDateRange(gap.date, gap.startTime, gap.endTime)}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                                {gap.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Reason: {gap.reason.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {gap.backupRequestsSent.length} requests already sent
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Coverage Gaps!</h3>
                    <p className="text-gray-600">All time slots are currently covered.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Select Team Members */}
            {selectedGap && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">2. Select Team Members</h2>
                  <p className="text-sm text-gray-600">Choose who to contact for backup coverage</p>
                </div>
                
                <div className="p-6">
                  {availableBackups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableBackups.map((member) => (
                        <div
                          key={member.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedMembers.includes(member.id)
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleMemberToggle(member.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <User size={20} className="text-green-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{member.name}</div>
                                <div className="text-sm text-gray-600">{member.relationshipToCareRecipient}</div>
                                <div className="text-sm text-green-600">
                                  {Math.round(member.reliability.showUpRate * 100)}% reliable
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-1">
                                {member.contactInfo.preferredContact === 'phone' && <Phone size={14} className="text-green-600" />}
                                {member.contactInfo.preferredContact === 'text' && <MessageSquare size={14} className="text-blue-600" />}
                                <span className="text-xs text-gray-500">{member.contactInfo.preferredContact}</span>
                              </div>
                              {selectedMembers.includes(member.id) && (
                                <CheckCircle size={16} className="text-purple-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <User size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Backups</h3>
                      <p className="text-gray-600">All backup caregivers are currently busy or unavailable.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Customize Message */}
            {selectedGap && selectedMembers.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">3. Customize Message</h2>
                  <p className="text-sm text-gray-600">Edit the message to send to selected team members</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Urgency Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                    <div className="flex gap-2">
                      {['normal', 'urgent', 'emergency'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setUrgencyLevel(level as any)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            urgencyLevel === level
                              ? getUrgencyColor(level)
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                      placeholder="Enter your message..."
                    />
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSendRequests}
                      disabled={!selectedGap || selectedMembers.length === 0 || !message.trim()}
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send Requests ({selectedMembers.length})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Request Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold">Request Summary</h3>
              </div>
              <div className="p-6">
                {selectedGapData ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-gray-700">Coverage Needed</div>
                      <div className="text-sm text-gray-900 mt-1">
                        {formatDateRange(selectedGapData.date, selectedGapData.startTime, selectedGapData.endTime)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700">Severity</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getSeverityColor(selectedGapData.severity)}`}>
                        {selectedGapData.severity}
                      </span>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700">Recipients</div>
                      <div className="text-sm text-gray-900 mt-1">
                        {selectedMembers.length} team member{selectedMembers.length !== 1 ? 's' : ''} selected
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-gray-700">Urgency</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getUrgencyColor(urgencyLevel)}`}>
                        {urgencyLevel}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Select a coverage gap to get started
                  </div>
                )}
              </div>
            </div>

            {/* Available Backups Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold">Available Team</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Available Now</span>
                    <span className="font-semibold text-green-600">{teamAvailability.availableMembers}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">High Reliability</span>
                    <span className="font-semibold text-purple-600">{teamAvailability.highReliabilityMembers.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Backup Ready</span>
                    <span className="font-semibold text-blue-600">{availableBackups.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default FindCoverageView;