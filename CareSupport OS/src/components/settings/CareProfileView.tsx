import React, { useState } from 'react';
import { Edit, Phone, MapPin, Heart, Shield, Clock, AlertTriangle, User, Calendar, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../../contexts/CareCoordinationContext';

function CareProfileView() {
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
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User size={28} className="text-blue-600" />
              Care Profile
            </h1>
            <p className="text-gray-600">Manage care recipient information, needs, and preferences</p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
            <Edit size={16} />
            Edit Profile
          </button>
        </header>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900">{careRecipient.name}</h2>
              <div className="flex items-center gap-4 text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{careRecipient.age} years old</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{careRecipient.address?.city}, {careRecipient.address?.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{careRecipient.contactInfo.phone}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Primary Condition</div>
              <div className="font-medium text-gray-900">{careRecipient.primaryConditions[0]?.name || 'Not specified'}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'medical', label: 'Medical Info', icon: Heart },
                { id: 'preferences', label: 'Care Preferences', icon: Shield },
                { id: 'contacts', label: 'Emergency Contacts', icon: Phone }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-medium">{careRecipient.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{careRecipient.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth</span>
                  <span className="font-medium">{careRecipient.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium">{careRecipient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium">{careRecipient.preferredLanguage}</span>
                </div>
              </div>
            </div>

            {/* Care Level Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Care Level</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Independence Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      careRecipient.careLevel.independenceLevel === 'high' 
                        ? 'bg-green-100 text-green-800'
                        : careRecipient.careLevel.independenceLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {careRecipient.careLevel.independenceLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        careRecipient.careLevel.independenceLevel === 'high' 
                          ? 'bg-green-500 w-5/6'
                          : careRecipient.careLevel.independenceLevel === 'medium'
                          ? 'bg-yellow-500 w-1/2'
                          : 'bg-red-500 w-1/4'
                      }`}
                    />
                  </div>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Mobility Level</span>
                  <div className="font-medium capitalize">{careRecipient.careLevel.mobilityLevel}</div>
                </div>
                
                <div>
                  <span className="text-gray-600 text-sm">Cognitive Level</span>
                  <div className="font-medium capitalize">{careRecipient.careLevel.cognitiveLevel}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'medical' && (
          <div className="space-y-6">
            {/* Primary Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Heart size={20} className="text-red-600" />
                Primary Conditions
              </h3>
              <div className="space-y-3">
                {careRecipient.primaryConditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{condition.name}</div>
                      <div className="text-sm text-gray-600">{condition.description}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(condition.severity)}`}>
                      {condition.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Pill size={20} className="text-blue-600" />
                Current Medications
              </h3>
              <div className="space-y-3">
                {careRecipient.medications.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-gray-600">{med.dosage} • {med.frequency}</div>
                      <div className="text-xs text-gray-500">Prescribed by: {med.prescribedBy}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Next dose</div>
                      <div className="font-medium">{med.nextDose}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Care Needs */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Care Needs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {careRecipient.careNeeds.map((need, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    {getCategoryIcon(need.category)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium">{need.task}</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(need.category)}`}>
                          {need.category.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{need.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(need.priority)}`}>
                          {need.priority} priority
                        </span>
                        <span className="text-xs text-gray-500">{need.frequency}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Preferences</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-600 text-sm">Preferred Activities</span>
                  <div className="font-medium">Reading, listening to music, gardening</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Communication Style</span>
                  <div className="font-medium">Direct and clear instructions</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Special Dietary Needs</span>
                  <div className="font-medium">Low sodium, diabetic-friendly</div>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Mobility Aids</span>
                  <div className="font-medium">Walker, grab bars in bathroom</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone size={20} className="text-green-600" />
              Emergency Contacts
            </h3>
            <div className="space-y-4">
              {careRecipient.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-sm text-gray-600">{contact.relationship}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{contact.phone}</div>
                    {contact.email && (
                      <div className="text-sm text-gray-600">{contact.email}</div>
                    )}
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

export default CareProfileView;