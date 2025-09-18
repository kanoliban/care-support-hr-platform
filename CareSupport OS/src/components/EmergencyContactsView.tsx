import React, { useState } from 'react';
import { Phone, Mail, AlertTriangle, User, Shield, Clock, Copy, Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

function EmergencyContactsView() {
  const navigate = useNavigate();
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  
  const careContext = useCareCoordination();
  const { careRecipient } = careContext;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
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

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Primary';
      case 2: return 'Secondary';
      case 3: return 'Tertiary';
      default: return `Priority ${priority}`;
    }
  };

  const emergencyContacts = careRecipient.emergencyContacts.sort((a, b) => a.priority - b.priority);

  // Emergency services (always available)
  const emergencyServices = [
    {
      id: 'emergency-911',
      name: '911 Emergency Services',
      relationship: 'Emergency Services',
      phone: '911',
      priority: 0,
      canMakeMedicalDecisions: false,
      category: 'emergency'
    },
    {
      id: 'poison-control',
      name: 'Poison Control',
      relationship: 'Medical Emergency',
      phone: '1-800-222-1222',
      priority: 0,
      canMakeMedicalDecisions: false,
      category: 'emergency'
    }
  ];

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle size={28} className="text-red-600" />
              Emergency Contacts
            </h1>
            <p className="text-gray-600">Quick access to emergency contacts for {careRecipient.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/care-recipient')}
              className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
            >
              View Full Profile
            </button>
          </div>
        </header>

        {/* Emergency Banner */}
        <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertTriangle size={24} className="text-red-600 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-red-900 mb-2">Emergency Information</h2>
              <p className="text-red-800 mb-4">
                In case of a medical emergency, call 911 immediately. Use these contacts for coordination and notification.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-red-900">Care Recipient:</span>
                  <span className="text-red-800 ml-2">{careRecipient.name}</span>
                </div>
                <div>
                  <span className="font-medium text-red-900">Address:</span>
                  <span className="text-red-800 ml-2">{careRecipient.location.address}</span>
                </div>
                {careRecipient.medicalInfo.preferredHospital && (
                  <div className="col-span-2">
                    <span className="font-medium text-red-900">Preferred Hospital:</span>
                    <span className="text-red-800 ml-2">{careRecipient.medicalInfo.preferredHospital}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield size={24} className="text-red-600" />
            Emergency Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyServices.map((service) => (
              <div key={service.id} className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">{service.name}</h3>
                    <p className="text-red-700 text-sm">{service.relationship}</p>
                  </div>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Emergency
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-red-600" />
                    <span className="text-xl font-bold text-red-900">{service.phone}</span>
                  </div>
                  <button
                    onClick={() => handleCall(service.phone)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                  >
                    <Phone size={16} />
                    Call Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Emergency Contacts */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={24} className="text-purple-600" />
            Personal Emergency Contacts
          </h2>
          
          {emergencyContacts.length > 0 ? (
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${getPriorityColor(contact.priority)}`}>
                        {contact.priority}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-gray-600">{contact.relationship}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(contact.priority)}`}>
                        {getPriorityLabel(contact.priority)}
                      </span>
                      {contact.canMakeMedicalDecisions && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          Medical Authority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Phone size={18} className="text-gray-600" />
                          <span className="font-medium text-gray-700">Phone</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopyContact(contact.phone, 'phone')}
                            className="p-1 text-gray-500 hover:text-gray-700 rounded"
                            title="Copy phone number"
                          >
                            {copiedContact === `${contact.phone}-phone` ? 
                              <Check size={16} className="text-green-600" /> : 
                              <Copy size={16} />
                            }
                          </button>
                        </div>
                      </div>
                      <div className="text-lg font-mono text-gray-900 mb-3">{contact.phone}</div>
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <Phone size={16} />
                        Call Now
                      </button>
                    </div>

                    {/* Email */}
                    {contact.email && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Mail size={18} className="text-gray-600" />
                            <span className="font-medium text-gray-700">Email</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopyContact(contact.email!, 'email')}
                              className="p-1 text-gray-500 hover:text-gray-700 rounded"
                              title="Copy email"
                            >
                              {copiedContact === `${contact.email}-email` ? 
                                <Check size={16} className="text-green-600" /> : 
                                <Copy size={16} />
                              }
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-900 mb-3 truncate">{contact.email}</div>
                        <button
                          onClick={() => handleEmail(contact.email!)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                        >
                          <Mail size={16} />
                          Send Email
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  {contact.canMakeMedicalDecisions && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          Authorized to make medical decisions for {careRecipient.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <User size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Emergency Contacts</h3>
              <p className="text-gray-600 mb-4">Add emergency contacts to the care recipient profile.</p>
              <button
                onClick={() => navigate('/care-recipient')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Edit Care Profile
              </button>
            </div>
          )}
        </div>

        {/* Medical Information Summary */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Critical Medical Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Medical Conditions</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {careRecipient.medicalInfo.medicalConditions.slice(0, 3).map((condition, index) => (
                  <li key={index}>• {condition}</li>
                ))}
                {careRecipient.medicalInfo.medicalConditions.length > 3 && (
                  <li className="text-blue-600">+{careRecipient.medicalInfo.medicalConditions.length - 3} more</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Allergies</h4>
              {careRecipient.medicalInfo.allergies.length > 0 ? (
                <ul className="text-sm text-blue-700 space-y-1">
                  {careRecipient.medicalInfo.allergies.map((allergy, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle size={14} className="text-red-500" />
                      {allergy}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-blue-700">No known allergies</p>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800">Primary Physician</h4>
                <p className="text-sm text-blue-700">
                  {careRecipient.medicalInfo.primaryPhysician.name} - {careRecipient.medicalInfo.primaryPhysician.phone}
                </p>
              </div>
              <button
                onClick={() => handleCall(careRecipient.medicalInfo.primaryPhysician.phone)}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EmergencyContactsView;