import React, { useState, useEffect } from 'react';
import { X, Search, AlertCircle, Calendar, Clock, CheckCircle, XCircle, User, UserCheck } from 'lucide-react';
import { Shift, Client, Caregiver, RecurringPattern } from './types';
import { SchedulingService } from './services';

// Mock data for demonstration
const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'John Smith',
    program: 'TX Medicaid',
    requiredCredentials: ['RN License', 'CPR Certification'],
    planOfCareTasks: ['Medication administration', 'Vital signs monitoring'],
    locationConstraints: {
      latitude: 32.7767,
      longitude: -96.7970,
      maxDistance: 25
    }
  },
  {
    id: 'client-002',
    name: 'Mary Johnson',
    program: 'Private Pay',
    requiredCredentials: ['CNA License'],
    planOfCareTasks: ['Personal care', 'Light housekeeping']
  }
];

const mockCaregivers: Caregiver[] = [
  {
    id: 'cg-001',
    name: 'Jane Doe, RN',
    role: 'Registered Nurse',
    status: 'Active',
    credentials: [
      {
        type: 'RN License',
        status: 'Valid',
        expirationDate: '2025-06-15'
      },
      {
        type: 'CPR Certification',
        status: 'Valid',
        expirationDate: '2025-01-15'
      }
    ],
    location: {
      latitude: 32.7866,
      longitude: -96.7970
    }
  },
  {
    id: 'cg-002',
    name: 'Robert Wilson, CNA',
    role: 'Certified Nursing Assistant',
    status: 'Active',
    credentials: [
      {
        type: 'CNA License',
        status: 'Expiring Soon',
        expirationDate: '2024-05-15'
      }
    ]
  }
];

interface CreateShiftModalProps {
  onClose: () => void;
  onSave: (shift: Shift, recurringPattern?: RecurringPattern) => void;
}

const steps = [
  {
    id: 'client',
    title: 'Select Client',
    description: 'Choose the client who will receive care',
    icon: User
  },
  {
    id: 'schedule',
    title: 'Schedule Details', 
    description: 'Set the date, time and recurrence pattern',
    icon: Calendar
  },
  {
    id: 'caregiver',
    title: 'Select Caregiver',
    description: 'Choose a qualified caregiver for this shift',
    icon: UserCheck
  }
];

function CreateShiftModal({ onClose, onSave }: CreateShiftModalProps) {
  const [currentStep, setCurrentStep] = useState(steps[0].id);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [caregiverSearch, setCaregiverSearch] = useState('');
  const [matchingCaregivers, setMatchingCaregivers] = useState<{
    caregiver: Caregiver;
    score: number;
    complianceStatus: any;
  }[]>([]);

  const [shiftDetails, setShiftDetails] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    type: 'Hourly' as const
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringPattern, setRecurringPattern] = useState<RecurringPattern>({
    frequency: 'weekly',
    daysOfWeek: [],
    interval: 1
  });

  // Filter clients based on search
  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  // Update matching caregivers when client or shift details change
  useEffect(() => {
    if (selectedClient && shiftDetails.date && shiftDetails.startTime && shiftDetails.endTime) {
      const startTime = `${shiftDetails.date}T${shiftDetails.startTime}:00`;
      const endTime = `${shiftDetails.date}T${shiftDetails.endTime}:00`;

      const matches = SchedulingService.findMatchingCaregivers(
        selectedClient,
        mockCaregivers,
        {
          requiredCredentials: selectedClient.requiredCredentials,
          locationConstraints: selectedClient.locationConstraints,
          shiftTiming: { start: startTime, end: endTime }
        }
      );

      // Filter by search if needed
      const filtered = caregiverSearch
        ? matches.filter(m => 
            m.caregiver.name.toLowerCase().includes(caregiverSearch.toLowerCase())
          )
        : matches;

      setMatchingCaregivers(filtered);
    }
  }, [selectedClient, shiftDetails, caregiverSearch]);

  const handleRecurringChange = (field: keyof RecurringPattern, value: any) => {
    setRecurringPattern(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!selectedClient || !selectedCaregiver || !shiftDetails.date) return;

    const shift: Shift = {
      id: 'new',
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      caregiverId: selectedCaregiver.id,
      caregiverName: selectedCaregiver.name,
      startTime: `${shiftDetails.date}T${shiftDetails.startTime}:00`,
      endTime: `${shiftDetails.date}T${shiftDetails.endTime}:00`,
      status: 'Scheduled',
      type: shiftDetails.type,
      complianceStatus: matchingCaregivers.find(m => m.caregiver.id === selectedCaregiver.id)?.complianceStatus || {
        isCompliant: false,
        checks: []
      },
      planOfCareTasks: selectedClient.planOfCareTasks
    };

    onSave(shift, isRecurring ? recurringPattern : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Shift</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStepIndex === index
                      ? 'bg-purple-600 text-white'
                      : currentStepIndex > index
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <step.icon size={16} />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${
                      currentStepIndex > index ? 'bg-green-100' : 'bg-gray-100'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {currentStep === 'client' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{steps[0].title}</h3>
              <p className="text-gray-500">{steps[0].description}</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="border border-gray-200 rounded-lg divide-y">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between ${
                      selectedClient?.id === client.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">{client.program}</div>
                      <div className="flex gap-2 mt-1">
                        {client.requiredCredentials.map((cred) => (
                          <span
                            key={cred}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {cred}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedClient?.id === client.id && (
                      <CheckCircle className="text-purple-600" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{steps[1].title}</h3>
              <p className="text-gray-500">{steps[1].description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={shiftDetails.date}
                    onChange={(e) => setShiftDetails(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Type
                  </label>
                  <select 
                    value={shiftDetails.type}
                    onChange={(e) => setShiftDetails(prev => ({ ...prev, type: e.target.value as 'Hourly' | 'Live-in' }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Live-in">Live-in</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={shiftDetails.startTime}
                    onChange={(e) => setShiftDetails(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={shiftDetails.endTime}
                    onChange={(e) => setShiftDetails(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Recurring shift</span>
                </label>

                {isRecurring && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        value={recurringPattern.frequency}
                        onChange={(e) => handleRecurringChange('frequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    {recurringPattern.frequency === 'weekly' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Repeat on
                        </label>
                        <div className="flex gap-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                const days = recurringPattern.daysOfWeek || [];
                                const newDays = days.includes(index)
                                  ? days.filter(d => d !== index)
                                  : [...days, index];
                                handleRecurringChange('daysOfWeek', newDays);
                              }}
                              className={`w-8 h-8 rounded-full ${
                                recurringPattern.daysOfWeek?.includes(index)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={recurringPattern.endDate || ''}
                        onChange={(e) => handleRecurringChange('endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 'caregiver' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{steps[2].title}</h3>
              <p className="text-gray-500">{steps[2].description}</p>
              
              {matchingCaregivers.length > 0 ? (
                <>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Found {matchingCaregivers.length} qualified caregivers for this shift.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search caregivers..."
                      value={caregiverSearch}
                      onChange={(e) => setCaregiverSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg divide-y">
                    {matchingCaregivers.map(({ caregiver, score, complianceStatus }) => (
                      <button
                        key={caregiver.id}
                        onClick={() => setSelectedCaregiver(caregiver)}
                        className={`w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between ${
                          selectedCaregiver?.id === caregiver.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{caregiver.name}</div>
                            <div className="text-sm font-medium text-purple-600">
                              {score}% match
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{caregiver.role}</div>
                          <div className="flex gap-2 mt-2">
                            {caregiver.credentials.map((cred) => (
                              <span
                                key={cred.type}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  cred.status === 'Valid'
                                    ? 'bg-green-100 text-green-800'
                                    : cred.status === 'Expiring Soon'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {cred.type}
                              </span>
                            ))}
                          </div>
                        </div>
                        {selectedCaregiver?.id === caregiver.id && (
                          <CheckCircle className="text-purple-600 ml-4" size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        No caregivers found matching the required credentials and availability.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStep(steps[currentStepIndex - 1].id)}
                className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (currentStepIndex < steps.length - 1) {
                  setCurrentStep(steps[currentStepIndex + 1].id);
                } else {
                  handleSave();
                }
              }}
              disabled={
                (currentStep === 'client' && !selectedClient) ||
                (currentStep === 'caregiver' && !selectedCaregiver)
              }
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {currentStepIndex === steps.length - 1 ? 'Create Shift' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateShiftModal;