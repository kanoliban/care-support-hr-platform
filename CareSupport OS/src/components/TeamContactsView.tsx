import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, User, Search, Filter, ExternalLink, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

function TeamContactsView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  
  const careContext = useCareCoordination();

  const filteredTeamMembers = careContext.careTeam.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.relationshipToCareRecipient.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'paid_caregiver': return 'bg-purple-100 text-purple-800';
      case 'family_caregiver': return 'bg-blue-100 text-blue-800';
      case 'backup_caregiver': return 'bg-green-100 text-green-800';
      case 'community_supporter': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'phone': return <Phone size={16} className="text-green-600" />;
      case 'text': return <MessageSquare size={16} className="text-blue-600" />;
      case 'email': return <Mail size={16} className="text-purple-600" />;
      default: return <Phone size={16} className="text-gray-600" />;
    }
  };

  const getContactMethodColor = (method: string) => {
    switch (method) {
      case 'phone': return 'bg-green-100 text-green-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyContact = async (contactInfo: string, type: string) => {
    try {
      await navigator.clipboard.writeText(contactInfo);
      setCopiedContact(`${contactInfo}-${type}`);
      setTimeout(() => setCopiedContact(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleContact = (member: any, method: string) => {
    // In real implementation, this would trigger appropriate contact flow
    if (method === 'phone' && member.contactInfo.phone) {
      window.location.href = `tel:${member.contactInfo.phone}`;
    } else if (method === 'text' && member.contactInfo.phone) {
      window.location.href = `sms:${member.contactInfo.phone}`;
    } else if (method === 'email' && member.contactInfo.email) {
      window.location.href = `mailto:${member.contactInfo.email}`;
    }
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'paid_caregiver', label: 'Professional Caregivers' },
    { value: 'family_caregiver', label: 'Family Caregivers' },
    { value: 'backup_caregiver', label: 'Backup Caregivers' },
    { value: 'community_supporter', label: 'Community Support' }
  ];

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Team Contacts</h1>
            <p className="text-gray-600">Contact information and communication preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/schedule/team')}
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            >
              Back to Team
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Contacts</div>
            <div className="text-2xl font-semibold">{careContext.careTeam.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Prefer Phone</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">
                {careContext.careTeam.filter(m => m.contactInfo.preferredContact === 'phone').length}
              </div>
              <Phone size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Prefer Text</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-blue-600">
                {careContext.careTeam.filter(m => m.contactInfo.preferredContact === 'text').length}
              </div>
              <MessageSquare size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Prefer Email</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-purple-600">
                {careContext.careTeam.filter(m => m.contactInfo.preferredContact === 'email').length}
              </div>
              <Mail size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search team members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Team Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.relationshipToCareRecipient}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {getRoleDisplayName(member.role)}
                </span>
              </div>

              {/* Preferred Contact Method */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {getContactIcon(member.contactInfo.preferredContact)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getContactMethodColor(member.contactInfo.preferredContact)}`}>
                    Preferred: {member.contactInfo.preferredContact}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                {member.contactInfo.phone && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-600" />
                      <span className="font-mono text-sm">{member.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyContact(member.contactInfo.phone!, 'phone')}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded"
                        title="Copy phone number"
                      >
                        {copiedContact === `${member.contactInfo.phone}-phone` ? 
                          <Check size={14} className="text-green-600" /> : 
                          <Copy size={14} />
                        }
                      </button>
                      <button
                        onClick={() => handleContact(member, 'phone')}
                        className="p-1 text-green-600 hover:text-green-700 rounded"
                        title="Call"
                      >
                        <Phone size={14} />
                      </button>
                      <button
                        onClick={() => handleContact(member, 'text')}
                        className="p-1 text-blue-600 hover:text-blue-700 rounded"
                        title="Text"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {member.contactInfo.email && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-600" />
                      <span className="text-sm truncate">{member.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyContact(member.contactInfo.email!, 'email')}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded"
                        title="Copy email"
                      >
                        {copiedContact === `${member.contactInfo.email}-email` ? 
                          <Check size={14} className="text-green-600" /> : 
                          <Copy size={14} />
                        }
                      </button>
                      <button
                        onClick={() => handleContact(member, 'email')}
                        className="p-1 text-purple-600 hover:text-purple-700 rounded"
                        title="Email"
                      >
                        <Mail size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleContact(member, member.contactInfo.preferredContact)}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center gap-2"
                >
                  {getContactIcon(member.contactInfo.preferredContact)}
                  Contact via {member.contactInfo.preferredContact}
                </button>
              </div>

              {/* Reliability Badge */}
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>Reliability: {Math.round(member.reliability.showUpRate * 100)}%</span>
                <span>Updated {new Date(member.lastAvailabilityUpdate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTeamMembers.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            Showing {filteredTeamMembers.length} of {careContext.careTeam.length} team members
          </div>
        </div>
      </div>
    </main>
  );
}

export default TeamContactsView;