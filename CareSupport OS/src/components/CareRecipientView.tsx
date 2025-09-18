import React, { useState } from 'react';
import { Edit, Phone, MapPin, Heart, Shield, Clock, AlertTriangle, User, Calendar, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

function CareRecipientView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'preferences' | 'contacts'>('overview');
  
  // Use real care coordination data
  const careContext = useCareCoordination();
  const { careRecipient } = careContext;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal_care': return <User size={16} className="text-purple-600" />;
      case 'medical': return <Heart size={16} className="text-red-600" />;
      case 'household': return <Shield size={16} className="text-blue-600" />;
      case 'transportation': return <MapPin size={16} className="text-green-600" />;
      case 'companionship': return <User size={16} className="text-pink-600" />;
      default: return <User size={16} className="text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal_care': return 'bg-purple-100 text-purple-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'household': return 'bg-blue-100 text-blue-800';
      case 'transportation': return 'bg-green-100 text-green-800';
      case 'companionship': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Care Profile</h1>
            <p className="text-gray-600">Comprehensive care information and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </header>

        {/* Care Recipient Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{careRecipient.name}</h2>
                <p className="text-gray-600">Primary Coordinator: {careRecipient.primaryCoordinator}</p>
                {careRecipient.backupCoordinator && (
                  <p className="text-gray-500 text-sm">Backup: {careRecipient.backupCoordinator}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin size={16} />
                {careRecipient.location.address}
              </div>
              <div className="text-sm text-gray-500">
                {careRecipient.careNeeds.length} active care needs
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'medical', label: 'Medical Info', icon: Heart },
              { id: 'preferences', label: 'Preferences', icon: Calendar },
              { id: 'contacts', label: 'Emergency Contacts', icon: Phone }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Care Needs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Care Needs</h3>
              <div className="space-y-4">
                {careRecipient.careNeeds.map((need) => (
                  <div key={need.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(need.category)}
                        <span className="font-medium">{need.description}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(need.category)}`}>
                          {need.category.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(need.priority)}`}>
                          {need.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Frequency:</strong> {need.frequency}
                    </div>
                    {need.requiredSkills.length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Required Skills:</strong> {need.requiredSkills.join(', ')}
                      </div>
                    )}
                    {need.notes && (
                      <div className="text-sm text-gray-500 italic">
                        {need.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Care Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">High Priority Needs</span>
                    <span className="font-semibold text-red-600">
                      {careRecipient.careNeeds.filter(n => n.priority === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Care Tasks</span>
                    <span className="font-semibold">
                      {careRecipient.careNeeds.filter(n => n.frequency === 'daily').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Medical Care Needs</span>
                    <span className="font-semibold text-red-600">
                      {careRecipient.careNeeds.filter(n => n.category === 'medical').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Emergency Contacts</span>
                    <span className="font-semibold">
                      {careRecipient.emergencyContacts.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => navigate('/schedule')}
                    className="w-full px-4 py-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-2"
                  >
                    <Calendar size={16} className="text-purple-600" />
                    View Care Schedule
                  </button>
                  <button 
                    onClick={() => navigate('/schedule/team')}
                    className="w-full px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-2"
                  >
                    <User size={16} className="text-blue-600" />
                    Manage Care Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Medical Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Medical Conditions</h3>
              <div className="space-y-2">
                {careRecipient.medicalInfo.medicalConditions.map((condition, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <AlertTriangle size={16} className="text-orange-500" />
                    <span>{condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Current Medications</h3>
              <div className="space-y-3">
                {careRecipient.medicalInfo.medications.filter(med => med.isActive).map((medication) => (
                  <div key={medication.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Pill size={16} className="text-blue-500" />
                        <span className="font-medium">{medication.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{medication.dosage}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {medication.frequency} • {medication.scheduledTimes.join(', ')}
                    </div>
                    {medication.instructions && (
                      <div className="text-sm text-gray-500 mt-1 italic">
                        {medication.instructions}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies & Emergency Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Allergies</h3>
              <div className="space-y-2">
                {careRecipient.medicalInfo.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-red-700">{allergy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Physician */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Primary Physician</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-500" />
                  <span className="font-medium">{careRecipient.medicalInfo.primaryPhysician.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-500" />
                  <span>{careRecipient.medicalInfo.primaryPhysician.phone}</span>
                </div>
                {careRecipient.medicalInfo.primaryPhysician.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-sm">{careRecipient.medicalInfo.primaryPhysician.address}</span>
                  </div>
                )}
              </div>
              {careRecipient.medicalInfo.preferredHospital && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <strong>Preferred Hospital:</strong> {careRecipient.medicalInfo.preferredHospital}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Care Preferences</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Communication</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Preferred Contact:</strong> {careRecipient.preferences.communicationPreferences.preferredContactMethod}</div>
                  <div><strong>Update Frequency:</strong> {careRecipient.preferences.communicationPreferences.updateFrequency}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Routines</h4>
                <div className="space-y-2 text-sm">
                  {careRecipient.preferences.routinePreferences.morningRoutine && (
                    <div><strong>Morning:</strong> {careRecipient.preferences.routinePreferences.morningRoutine}</div>
                  )}
                  {careRecipient.preferences.routinePreferences.eveningRoutine && (
                    <div><strong>Evening:</strong> {careRecipient.preferences.routinePreferences.eveningRoutine}</div>
                  )}
                  {careRecipient.preferences.routinePreferences.medicationTimes && (
                    <div><strong>Medication Times:</strong> {careRecipient.preferences.routinePreferences.medicationTimes.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>

            {careRecipient.preferences.preferredCaregivers && careRecipient.preferences.preferredCaregivers.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Preferred Caregivers</h4>
                <div className="flex flex-wrap gap-2">
                  {careRecipient.preferences.preferredCaregivers.map((caregiverId, index) => {
                    const caregiver = careContext.careTeam.find(m => m.id === caregiverId);
                    return (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                        {caregiver?.name || caregiverId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Emergency Contacts</h3>
              <p className="text-gray-600 text-sm">Listed in order of priority</p>
            </div>
            <div className="divide-y divide-gray-200">
              {careRecipient.emergencyContacts
                .sort((a, b) => a.priority - b.priority)
                .map((contact) => (
                <div key={contact.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          contact.priority === 1 ? 'bg-red-100 text-red-800' : 
                          contact.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contact.priority}
                        </div>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-gray-600">{contact.relationship}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Phone size={16} className="text-gray-400" />
                        <span className="font-mono">{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="text-sm text-gray-600">{contact.email}</div>
                      )}
                      {contact.canMakeMedicalDecisions && (
                        <div className="text-sm text-green-600 mt-1">✓ Can make medical decisions</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CareRecipientView;