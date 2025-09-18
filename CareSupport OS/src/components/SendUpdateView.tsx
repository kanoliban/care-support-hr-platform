import React, { useState } from 'react';
import { Send, Users, MessageSquare, AlertCircle, Calendar, Clock, User, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

function SendUpdateView() {
  const navigate = useNavigate();
  const [updateType, setUpdateType] = useState<'general' | 'schedule_change' | 'important' | 'emergency'>('general');
  const [recipients, setRecipients] = useState<'all' | 'role' | 'selected'>('all');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sendMethod, setSendMethod] = useState<'preferred' | 'all_methods'>('preferred');
  
  const careContext = useCareCoordination();

  const updateTypes = [
    { 
      value: 'general', 
      label: 'General Update', 
      color: 'bg-blue-100 text-blue-800',
      icon: <MessageSquare size={16} className="text-blue-600" />,
      description: 'Regular communication with the team'
    },
    { 
      value: 'schedule_change', 
      label: 'Schedule Change', 
      color: 'bg-purple-100 text-purple-800',
      icon: <Calendar size={16} className="text-purple-600" />,
      description: 'Changes to care schedule or assignments'
    },
    { 
      value: 'important', 
      label: 'Important Notice', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: <AlertCircle size={16} className="text-yellow-600" />,
      description: 'Important information that requires attention'
    },
    { 
      value: 'emergency', 
      label: 'Emergency Alert', 
      color: 'bg-red-100 text-red-800',
      icon: <AlertCircle size={16} className="text-red-600" />,
      description: 'Urgent emergency communication'
    }
  ];

  const roleOptions = [
    { value: 'paid_caregiver', label: 'Professional Caregivers' },
    { value: 'family_caregiver', label: 'Family Caregivers' },
    { value: 'backup_caregiver', label: 'Backup Caregivers' },
    { value: 'community_supporter', label: 'Community Support' }
  ];

  const getDefaultSubject = (type: string) => {
    switch (type) {
      case 'schedule_change': return 'Care Schedule Update';
      case 'important': return 'Important Care Team Notice';
      case 'emergency': return 'EMERGENCY: Immediate Attention Required';
      default: return 'Care Team Update';
    }
  };

  const getDefaultMessage = (type: string) => {
    const recipientName = careContext.careRecipient.name;
    switch (type) {
      case 'schedule_change':
        return `Hi team! There's been a change to ${recipientName}'s care schedule. Please review the updated schedule and confirm your availability. Let me know if you have any questions. Thanks!`;
      case 'important':
        return `Hi everyone! I have an important update regarding ${recipientName}'s care. Please read this carefully and let me know if you need any clarification. Your attention to this matter is appreciated. Thanks!`;
      case 'emergency':
        return `EMERGENCY UPDATE: This is an urgent matter regarding ${recipientName}'s care. Please respond immediately. If you cannot respond within 15 minutes, please call me directly.`;
      default:
        return `Hi team! I wanted to share an update about ${recipientName}'s care. Please let me know if you have any questions. Thanks for all your great work!`;
    }
  };

  const handleUpdateTypeChange = (type: string) => {
    setUpdateType(type as any);
    setSubject(getDefaultSubject(type));
    setMessage(getDefaultMessage(type));
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const getRecipientCount = () => {
    if (recipients === 'all') {
      return careContext.careTeam.length;
    } else if (recipients === 'role') {
      return careContext.careTeam.filter(member => selectedRoles.includes(member.role)).length;
    } else {
      return selectedMembers.length;
    }
  };

  const getFilteredMembers = () => {
    if (recipients === 'all') {
      return careContext.careTeam;
    } else if (recipients === 'role') {
      return careContext.careTeam.filter(member => selectedRoles.includes(member.role));
    } else {
      return careContext.careTeam.filter(member => selectedMembers.includes(member.id));
    }
  };

  const handleSendUpdate = () => {
    // In real implementation, this would send actual messages
    const recipientCount = getRecipientCount();
    if (recipientCount > 0 && subject.trim() && message.trim()) {
      console.log('Sending update:', {
        type: updateType,
        recipients: recipients,
        selectedRoles,
        selectedMembers,
        subject,
        message,
        method: sendMethod,
        recipientCount
      });
      
      // Show success feedback
      alert(`Update sent to ${recipientCount} team member(s)!`);
      
      // Reset form
      setUpdateType('general');
      setSubject(getDefaultSubject('general'));
      setMessage(getDefaultMessage('general'));
      setRecipients('all');
      setSelectedRoles([]);
      setSelectedMembers([]);
    }
  };

  const canSend = getRecipientCount() > 0 && subject.trim() && message.trim();

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Send Update</h1>
            <p className="text-gray-600">Communicate with your care team</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            >
              Back to Command Center
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Update Composition */}
          <div className="col-span-2 space-y-6">
            {/* Update Type */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">1. Update Type</h2>
                <p className="text-sm text-gray-600">Choose the type of update you're sending</p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {updateTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        updateType === type.value 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleUpdateTypeChange(type.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {type.icon}
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">2. Select Recipients</h2>
                <p className="text-sm text-gray-600">Choose who should receive this update</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Recipient Type */}
                <div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="all"
                        checked={recipients === 'all'}
                        onChange={(e) => setRecipients(e.target.value as any)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">All team members ({careContext.careTeam.length})</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="role"
                        checked={recipients === 'role'}
                        onChange={(e) => setRecipients(e.target.value as any)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">By role</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="selected"
                        checked={recipients === 'selected'}
                        onChange={(e) => setRecipients(e.target.value as any)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">Specific members</span>
                    </label>
                  </div>
                </div>

                {/* Role Selection */}
                {recipients === 'role' && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Select Roles</div>
                    <div className="grid grid-cols-2 gap-2">
                      {roleOptions.map((role) => (
                        <label key={role.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedRoles.includes(role.value)}
                            onChange={() => handleRoleToggle(role.value)}
                            className="text-purple-600"
                          />
                          <span className="text-sm">{role.label}</span>
                          <span className="text-xs text-gray-500">
                            ({careContext.careTeam.filter(m => m.role === role.value).length})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Member Selection */}
                {recipients === 'selected' && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Select Team Members</div>
                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                      {careContext.careTeam.map((member) => (
                        <label 
                          key={member.id} 
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(member.id)}
                            onChange={() => handleMemberToggle(member.id)}
                            className="text-purple-600"
                          />
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User size={16} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{member.name}</div>
                            <div className="text-xs text-gray-500">{member.relationshipToCareRecipient}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Composition */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">3. Compose Message</h2>
                <p className="text-sm text-gray-600">Write your update message</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Enter subject..."
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                    placeholder="Enter your message..."
                  />
                </div>

                {/* Send Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Send Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="preferred"
                        checked={sendMethod === 'preferred'}
                        onChange={(e) => setSendMethod(e.target.value as any)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">Use each member's preferred contact method</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="all_methods"
                        checked={sendMethod === 'all_methods'}
                        onChange={(e) => setSendMethod(e.target.value as any)}
                        className="text-purple-600"
                      />
                      <span className="text-sm">Send via all available methods</span>
                    </label>
                  </div>
                </div>

                {/* Send Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSendUpdate}
                    disabled={!canSend}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send size={16} />
                    Send Update ({getRecipientCount()})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Summary */}
          <div className="space-y-6">
            {/* Update Summary */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold">Update Summary</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700">Type</div>
                  <div className="mt-1">
                    {updateTypes.find(t => t.value === updateType) && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${updateTypes.find(t => t.value === updateType)?.color}`}>
                        {updateTypes.find(t => t.value === updateType)?.label}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700">Recipients</div>
                  <div className="text-sm text-gray-900 mt-1">
                    {getRecipientCount()} team member{getRecipientCount() !== 1 ? 's' : ''}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700">Send Method</div>
                  <div className="text-sm text-gray-900 mt-1">
                    {sendMethod === 'preferred' ? 'Preferred contact method' : 'All available methods'}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipients Preview */}
            {getRecipientCount() > 0 && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="font-semibold">Recipients Preview</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {getFilteredMembers().slice(0, 10).map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{member.name}</div>
                        <div className="text-xs text-gray-500 truncate">{member.relationshipToCareRecipient}</div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.contactInfo.preferredContact}
                      </div>
                    </div>
                  ))}
                  {getFilteredMembers().length > 10 && (
                    <div className="p-3 text-center text-sm text-gray-500">
                      +{getFilteredMembers().length - 10} more recipients
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold">Team Stats</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Team</span>
                    <span className="font-semibold">{careContext.careTeam.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Professional Caregivers</span>
                    <span className="font-semibold text-purple-600">
                      {careContext.careTeam.filter(m => m.role === 'paid_caregiver').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Family Members</span>
                    <span className="font-semibold text-blue-600">
                      {careContext.careTeam.filter(m => m.role === 'family_caregiver').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Backup Team</span>
                    <span className="font-semibold text-green-600">
                      {careContext.careTeam.filter(m => m.role === 'backup_caregiver').length}
                    </span>
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

export default SendUpdateView;