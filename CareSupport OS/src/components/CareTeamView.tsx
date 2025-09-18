import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Filter, AlertCircle, Clock, User, Phone, UserCheck, UserX, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination, useTeamAvailability } from '../contexts/CareCoordinationContext';
import { TeamMember } from '../types/CareCoordinationTypes';
import AddTeamMemberWizard from './AddTeamMemberWizard';

function CareTeamView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'paid_caregiver' | 'family_caregiver' | 'backup_caregiver' | 'community_supporter'>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'busy' | 'unavailable'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Use real care coordination data
  const careContext = useCareCoordination();
  const teamAvailability = useTeamAvailability();

  const handleTeamMemberClick = (memberId: string) => {
    navigate(`/schedule/team/${memberId}`);
  };


  const filteredTeamMembers = careContext.careTeam.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.relationshipToCareRecipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesAvailability = selectedAvailability === 'all' || member.currentAvailability === selectedAvailability;
    
    return matchesSearch && matchesRole && matchesAvailability;
  });

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
      default: return <User size={16} className="text-gray-600" />;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'paid_caregiver': return 'Professional Caregiver';
      case 'family_caregiver': return 'Family Caregiver';
      case 'backup_caregiver': return 'Backup Caregiver';
      case 'community_supporter': return 'Community Support';
      default: return role;
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}${minute !== '00' ? ':' + minute : ''}${ampm}`;
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Care Team</h1>
            <p className="text-gray-600">Coordinate your care team availability and assignments</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Team Member
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Team Members</div>
            <div className="text-2xl font-semibold">{teamAvailability.totalMembers}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Available Now</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">{teamAvailability.availableMembers}</div>
              <UserCheck size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">High Reliability</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-purple-600">{teamAvailability.highReliabilityMembers.length}</div>
              <Activity size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Available Backups</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-blue-600">{teamAvailability.availableBackups.length}</div>
              <User size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search team members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Role
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Availability
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Shifts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reliability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeamMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTeamMemberClick(member.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getAvailabilityIcon(member.currentAvailability)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.relationshipToCareRecipient}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {getRoleDisplayName(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(member.currentAvailability)}`}>
                      {member.currentAvailability}
                    </span>
                    {member.lastAvailabilityUpdate && (
                      <div className="text-xs text-gray-400 mt-1">
                        Updated {new Date(member.lastAvailabilityUpdate).toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {member.regularShifts.length > 0 ? (
                      <div className="space-y-1">
                        {member.regularShifts.slice(0, 2).map((shift, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {shift.daysOfWeek.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')}
                          </div>
                        ))}
                        {member.regularShifts.length > 2 && (
                          <div className="text-xs text-gray-400">+{member.regularShifts.length - 2} more</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">On-call</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              member.reliability.showUpRate >= 0.9
                                ? 'bg-green-500'
                                : member.reliability.showUpRate >= 0.7
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${member.reliability.showUpRate * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(member.reliability.showUpRate * 100)}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.reliability.lastMinuteCancellations} cancellations
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {member.contactInfo.preferredContact}
                      </span>
                    </div>
                    {member.contactInfo.phone && (
                      <div className="text-xs text-gray-400 mt-1">
                        {member.contactInfo.phone}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Team Summary Footer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-600">Showing {filteredTeamMembers.length} of {careContext.careTeam.length} team members</span>
            </div>
            <div className="flex gap-4">
              <span className="text-green-600">● {teamAvailability.availableMembers} Available</span>
              <span className="text-yellow-600">● {teamAvailability.busyMembers} Busy</span>
              <span className="text-red-600">● {teamAvailability.unavailableMembers} Unavailable</span>
            </div>
          </div>
        </div>
      </div>

      <AddTeamMemberWizard
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

    </main>
  );
}

export default CareTeamView;