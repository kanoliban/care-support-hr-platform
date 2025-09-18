import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Edit3, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Star,
  Activity,
  UserCheck,
  UserX,
  Trash2
} from 'lucide-react';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

const dayOptions = [
  { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' }, { value: 3, label: 'Wed' }, 
  { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' }, { value: 6, label: 'Sat' }, { value: 0, label: 'Sun' }
];

const roleOptions = [
  { value: 'paid_caregiver', label: 'Professional Caregiver', desc: 'Paid professional' },
  { value: 'family', label: 'Family Member', desc: 'Family caregiver' },
  { value: 'backup_caregiver', label: 'Backup Caregiver', desc: 'On-call support' },
  { value: 'community_supporter', label: 'Community Helper', desc: 'Friend, neighbor, volunteer' }
];

const relationshipOptions: Record<string, string[]> = {
  paid_caregiver: ['Professional caregiver', 'Home health aide', 'Companion caregiver', 'Private nurse', 'Certified nursing assistant'],
  family: ['Spouse', 'Daughter', 'Son', 'Mother', 'Father', 'Sister', 'Brother', 'Daughter-in-law', 'Son-in-law'],
  backup_caregiver: ['Backup caregiver', 'Relief caregiver', 'Part-time caregiver', 'Weekend caregiver', 'Emergency contact'],
  community_supporter: ['Friend', 'Neighbor', 'Volunteer', 'Church member', 'Community helper', 'Family friend']
};

function TeamMemberDetailView() {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>();
  const careContext = useCareCoordination();
  
  const teamMember = careContext.careTeam.find(member => member.id === memberId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState(teamMember ? {
    name: teamMember.name,
    role: teamMember.role,
    relationshipToCareRecipient: teamMember.relationshipToCareRecipient,
    phone: teamMember.contactInfo.phone,
    email: teamMember.contactInfo.email || '',
    preferredContact: teamMember.contactInfo.preferredContact,
    hourlyRate: teamMember.hourlyRate?.toString() || '',
    currentAvailability: teamMember.currentAvailability,
    isOnCall: !teamMember.regularShifts || teamMember.regularShifts.length === 0,
    selectedDays: teamMember.regularShifts?.[0]?.daysOfWeek || [],
    startTime: teamMember.regularShifts?.[0]?.startTime || '09:00',
    endTime: teamMember.regularShifts?.[0]?.endTime || '17:00',
    isRecurring: teamMember.regularShifts?.[0]?.recurrencePattern === 'weekly' || teamMember.regularShifts?.[0]?.recurrencePattern === 'monthly',
    recurrencePattern: (teamMember.regularShifts?.[0]?.recurrencePattern === 'weekly' || teamMember.regularShifts?.[0]?.recurrencePattern === 'monthly') ? teamMember.regularShifts[0].recurrencePattern : 'weekly'
  } : null);

  if (!teamMember || !editData) {
    return (
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="text-center py-12">
            <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600">Team Member Not Found</h2>
            <p className="text-gray-500 mt-2">The requested team member could not be found.</p>
            <button
              onClick={() => navigate('/schedule/team')}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Return to Team Directory
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleEditChange = (field: string, value: any) => {
    setEditData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleDayToggle = (day: number) => {
    setEditData(prev => prev ? ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day].sort()
    }) : null);
  };

  const handleSave = () => {
    if (!editData) return;

    // Update the team member - this would need to be added to the context
    // For now, just update availability which we have
    careContext.updateTeamMemberAvailability(teamMember.id, editData.currentAvailability);
    
    // In a real app, you'd update all the other fields too
    console.log('Would save:', editData);
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: teamMember.name,
      role: teamMember.role,
      relationshipToCareRecipient: teamMember.relationshipToCareRecipient,
      phone: teamMember.contactInfo.phone,
      email: teamMember.contactInfo.email || '',
      preferredContact: teamMember.contactInfo.preferredContact,
      hourlyRate: teamMember.hourlyRate?.toString() || '',
      currentAvailability: teamMember.currentAvailability,
      isOnCall: !teamMember.regularShifts || teamMember.regularShifts.length === 0,
      selectedDays: teamMember.regularShifts?.[0]?.daysOfWeek || [],
      startTime: teamMember.regularShifts?.[0]?.startTime || '09:00',
      endTime: teamMember.regularShifts?.[0]?.endTime || '17:00',
      isRecurring: teamMember.regularShifts?.[0]?.recurrencePattern === 'weekly' || teamMember.regularShifts?.[0]?.recurrencePattern === 'monthly',
      recurrencePattern: (teamMember.regularShifts?.[0]?.recurrencePattern === 'weekly' || teamMember.regularShifts?.[0]?.recurrencePattern === 'monthly') ? teamMember.regularShifts[0].recurrencePattern : 'weekly'
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    careContext.removeTeamMember(teamMember.id);
    navigate('/schedule/team');
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'paid_caregiver': return 'Professional Caregiver';
      case 'family': return 'Family Caregiver';
      case 'backup_caregiver': return 'Backup Caregiver';
      case 'care_recipient': return 'Care Recipient';
      default: return role;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'available': return <UserCheck size={16} className="text-green-600" />;
      case 'busy': return <Clock size={16} className="text-yellow-600" />;
      case 'unavailable': return <UserX size={16} className="text-red-600" />;
      default: return <Activity size={16} className="text-gray-600" />;
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}${minute !== '00' ? ':' + minute : ''}${ampm}`;
  };

  const getDayName = (dayNum: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayNum];
  };

  const formatShiftDays = (daysOfWeek: number[]) => {
    if (daysOfWeek.length === 7) return 'Every day';
    if (daysOfWeek.length === 5 && daysOfWeek.every(d => d >= 1 && d <= 5)) return 'Weekdays (M-F)';
    if (daysOfWeek.length === 2 && daysOfWeek.includes(0) && daysOfWeek.includes(6)) return 'Weekends';
    
    return daysOfWeek.map(day => getDayName(day)).join(', ');
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/schedule/team')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User size={28} className="text-blue-600" />
              {isEditing ? 'Edit Team Member' : teamMember.name}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update team member information' : `${getRoleDisplayName(teamMember.role)} • ${teamMember.relationshipToCareRecipient}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  <Save size={16} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-medium mb-4">Basic Information</h2>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  ) : (
                    <div className="font-medium">{teamMember.name}</div>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  {isEditing ? (
                    <div className="border border-gray-200 rounded-lg divide-y">
                      {roleOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleEditChange('role', option.value)}
                          className={`w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between ${
                            editData.role === option.value ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                          {editData.role === option.value && (
                            <CheckCircle className="text-purple-600" size={20} />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="font-medium">{getRoleDisplayName(teamMember.role)}</div>
                  )}
                </div>

                {/* Relationship */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Care Recipient</label>
                  {isEditing ? (
                    <div>
                      <select
                        value={editData.relationshipToCareRecipient}
                        onChange={(e) => handleEditChange('relationshipToCareRecipient', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="">Select relationship...</option>
                        {relationshipOptions[editData.role]?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                        <option value="custom">Other (specify below)</option>
                      </select>
                      {editData.relationshipToCareRecipient === 'custom' && (
                        <input
                          type="text"
                          value={editData.relationshipToCareRecipient === 'custom' ? '' : editData.relationshipToCareRecipient}
                          onChange={(e) => handleEditChange('relationshipToCareRecipient', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2"
                          placeholder="Please specify relationship"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="font-medium">{teamMember.relationshipToCareRecipient}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-medium mb-4">Contact Information</h2>
              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => handleEditChange('phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => handleEditChange('email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{teamMember.contactInfo.phone}</div>
                        <div className="text-sm text-gray-500">Phone</div>
                      </div>
                    </div>
                    {teamMember.contactInfo.email && (
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-gray-400" />
                        <div>
                          <div className="font-medium">{teamMember.contactInfo.email}</div>
                          <div className="text-sm text-gray-500">Email</div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'phone', label: 'Phone' },
                        { value: 'text', label: 'Text' },
                        { value: 'email', label: 'Email' }
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleEditChange('preferredContact', option.value)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                            editData.preferredContact === option.value
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Activity size={16} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Prefers {teamMember.contactInfo.preferredContact}</div>
                        <div className="text-sm text-gray-500">Preferred contact method</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hourly Rate for paid caregivers */}
                {(editData.role === 'paid_caregiver' || teamMember.role === 'paid_caregiver') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editData.hourlyRate}
                        onChange={(e) => handleEditChange('hourlyRate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    ) : (
                      <div className="font-medium">${teamMember.hourlyRate}/hr</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-medium mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-purple-600" />
                Schedule
              </h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isOnCall"
                      checked={editData.isOnCall}
                      onChange={(e) => handleEditChange('isOnCall', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isOnCall" className="text-sm font-medium">
                      On call only (no regular shifts)
                    </label>
                  </div>

                  {!editData.isOnCall && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                        <div className="flex gap-2">
                          {dayOptions.map(day => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => handleDayToggle(day.value)}
                              className={`w-12 h-10 text-sm font-medium border rounded-lg ${
                                editData.selectedDays.includes(day.value)
                                  ? 'bg-purple-600 border-purple-600 text-white'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {day.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={editData.startTime}
                            onChange={(e) => handleEditChange('startTime', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                          <input
                            type="time"
                            value={editData.endTime}
                            onChange={(e) => handleEditChange('endTime', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="isRecurring"
                            checked={editData.isRecurring}
                            onChange={(e) => handleEditChange('isRecurring', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="isRecurring" className="text-sm font-medium">
                            Recurring shifts
                          </label>
                        </div>
                        
                        {editData.isRecurring && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Repeat</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditChange('recurrencePattern', 'weekly')}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                                  editData.recurrencePattern === 'weekly'
                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                Weekly
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditChange('recurrencePattern', 'monthly')}
                                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                                  editData.recurrencePattern === 'monthly'
                                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                Monthly
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {teamMember.regularShifts && teamMember.regularShifts.length > 0 ? (
                    <div className="space-y-3">
                      {teamMember.regularShifts.map((shift, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">
                              {formatShiftDays(shift.daysOfWeek)}
                            </div>
                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                              shift.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {shift.isActive ? 'Active' : 'Inactive'}
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-purple-600">
                            {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                          </div>
                          {shift.endTime < shift.startTime && (
                            <div className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                              <AlertCircle size={14} />
                              Overnight shift (ends next day)
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock size={32} className="mx-auto mb-2 text-gray-300" />
                      <p>On-call • No regular shifts scheduled</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Availability */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-medium mb-4 flex items-center gap-2">
                <Activity size={16} className="text-purple-600" />
                Availability
              </h2>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  <select
                    value={editData.currentAvailability}
                    onChange={(e) => handleEditChange('currentAvailability', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {getAvailabilityIcon(teamMember.currentAvailability)}
                  <div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(teamMember.currentAvailability)}`}>
                      {teamMember.currentAvailability.charAt(0).toUpperCase() + teamMember.currentAvailability.slice(1)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Last updated: {new Date(teamMember.lastAvailabilityUpdate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Reliability Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-medium mb-4 flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                Reliability
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Show-up rate</span>
                  <span className="font-semibold text-green-600">
                    {Math.round(teamMember.reliability.showUpRate * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">On-time rate</span>
                  <span className="font-semibold text-blue-600">
                    {Math.round(teamMember.reliability.onTimeRate * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Last-minute cancellations</span>
                  <span className="font-semibold text-gray-600">
                    {teamMember.reliability.lastMinuteCancellations}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Details - for paid caregivers */}
            {teamMember.role === 'paid_caregiver' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="font-medium mb-4">Employment Details</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Source</span>
                    <span className="font-medium text-sm">{teamMember.sourceAgency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-sm">Payment Method</span>
                    <span className="font-medium text-sm">{teamMember.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Team Member</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to remove <strong>{teamMember.name}</strong> from the care team? 
              This will delete their profile and remove them from all scheduled shifts.
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeamMemberDetailView;