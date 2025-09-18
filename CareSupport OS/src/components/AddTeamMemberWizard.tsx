import React, { useState } from 'react';
import { X, User, Phone, Calendar, CheckCircle } from 'lucide-react';
import { useCareCoordination } from '../contexts/CareCoordinationContext';
import { TeamMember } from '../types/CareCoordinationTypes';

interface AddTeamMemberWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    id: 'basics',
    title: 'Basic Info',
    description: 'Name and role information',
    icon: User
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'How to reach them',
    icon: Phone
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Regular shifts',
    icon: Calendar
  }
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

const dayOptions = [
  { value: 0, label: 'S' }, { value: 1, label: 'M' }, { value: 2, label: 'T' }, 
  { value: 3, label: 'W' }, { value: 4, label: 'T' }, { value: 5, label: 'F' }, { value: 6, label: 'S' }
];

const shiftTypeOptions = [
  { value: 'hourly', label: 'Hourly', desc: 'Standard hourly shifts' },
  { value: 'daily', label: 'Daily', desc: 'Full day coverage' },
  { value: 'overnight', label: 'Overnight', desc: 'Evening to morning shifts' }
];

function AddTeamMemberWizard({ isOpen, onClose }: AddTeamMemberWizardProps) {
  const careContext = useCareCoordination();
  
  const [currentStep, setCurrentStep] = useState(steps[0].id);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  
  const [formData, setFormData] = useState({
    name: '',
    role: 'paid_caregiver' as TeamMember['role'],
    relationshipToCareRecipient: '',
    phone: '',
    email: '',
    preferredContact: 'phone' as 'phone' | 'text' | 'email',
    hourlyRate: '',
    isOnCall: false,
    startDate: new Date().toISOString().split('T')[0],
    shiftType: 'hourly' as 'hourly' | 'daily' | 'overnight',
    selectedDays: [] as number[],
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: false,
    recurrencePattern: 'weekly' as 'weekly' | 'monthly',
    endDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDayToggle = (day: number) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day].sort()
    }));
  };

  const validateStep = (step: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 'basics') {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.relationshipToCareRecipient.trim()) newErrors.relationshipToCareRecipient = 'Relationship is required';
    }

    if (step === 'contact') {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (formData.role === 'paid_caregiver' && !formData.hourlyRate.trim()) {
        newErrors.hourlyRate = 'Hourly rate is required for professional caregivers';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    const newId = `team-member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newTeamMember: TeamMember = {
      id: newId,
      name: formData.name.trim(),
      role: formData.role,
      contactInfo: {
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        preferredContact: formData.preferredContact
      },
      regularShifts: !formData.isOnCall && formData.selectedDays.length > 0 ? [{
        id: `shift-${newId}`,
        daysOfWeek: formData.selectedDays,
        startTime: formData.startTime,
        endTime: formData.endTime,
        recurrencePattern: formData.isRecurring ? formData.recurrencePattern : 'none',
        effectiveDate: new Date().toISOString().split('T')[0],
        isActive: true
      }] : [],
      currentAvailability: 'available',
      blockedDates: [],
      lastAvailabilityUpdate: new Date().toISOString(),
      skills: [],
      certifications: [],
      canDo: ['personal_care'],
      relationshipToCareRecipient: formData.relationshipToCareRecipient.trim(),
      trustLevel: 'medium' as const,
      reliability: {
        showUpRate: 1.0,
        onTimeRate: 1.0,
        lastMinuteCancellations: 0
      },
      sourceAgency: formData.role === 'paid_caregiver' ? 'Direct hire' : 'Family',
      hourlyRate: formData.role === 'paid_caregiver' && formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
      paymentMethod: formData.role === 'paid_caregiver' ? 'direct' : 'N/A'
    };

    careContext.addTeamMember(newTeamMember);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      role: 'paid_caregiver',
      relationshipToCareRecipient: '',
      phone: '',
      email: '',
      preferredContact: 'phone',
      hourlyRate: '',
      isOnCall: false,
      selectedDays: [],
      startTime: '09:00',
      endTime: '17:00',
      isRecurring: false,
      recurrencePattern: 'weekly',
      startDate: new Date().toISOString().split('T')[0],
      shiftType: 'hourly',
      endDate: ''
    });
    setErrors({});
    setCurrentStep(steps[0].id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add Team Member</h2>
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

          {currentStep === 'basics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{steps[0].title}</h3>
              <p className="text-gray-500">{steps[0].description}</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter their full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="border border-gray-200 rounded-lg divide-y">
                  {roleOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('role', option.value)}
                      className={`w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between ${
                        formData.role === option.value ? 'bg-purple-50' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.desc}</div>
                      </div>
                      {formData.role === option.value && (
                        <CheckCircle className="text-purple-600" size={20} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Care Recipient</label>
                <select
                  value={formData.relationshipToCareRecipient}
                  onChange={(e) => handleInputChange('relationshipToCareRecipient', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.relationshipToCareRecipient ? 'border-red-500' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select relationship...</option>
                  {relationshipOptions[formData.role]?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="custom">Other (specify below)</option>
                </select>
                {formData.relationshipToCareRecipient === 'custom' && (
                  <input
                    type="text"
                    value={formData.relationshipToCareRecipient === 'custom' ? '' : formData.relationshipToCareRecipient}
                    onChange={(e) => handleInputChange('relationshipToCareRecipient', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2"
                    placeholder="Please specify relationship"
                  />
                )}
                {errors.relationshipToCareRecipient && <p className="text-red-500 text-sm mt-1">{errors.relationshipToCareRecipient}</p>}
              </div>
            </div>
          )}

          {currentStep === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{steps[1].title}</h3>
              <p className="text-gray-500">{steps[1].description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+1-555-0000"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'phone', label: 'Phone' },
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('preferredContact', option.value)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        formData.preferredContact === option.value
                          ? 'bg-purple-50 border-purple-200 text-purple-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {formData.role === 'paid_caregiver' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg ${
                      errors.hourlyRate ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                </div>
              )}
            </div>
          )}

          {currentStep === 'schedule' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Schedule Details</h3>
              <p className="text-gray-500">Set the date, time and recurrence pattern</p>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isOnCall"
                  checked={formData.isOnCall}
                  onChange={(e) => handleInputChange('isOnCall', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="isOnCall" className="text-sm font-medium">
                  On call only (no regular shifts)
                </label>
              </div>

              {!formData.isOnCall && (
                <div className="space-y-6">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Shift Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
                    <div className="border border-gray-200 rounded-lg divide-y">
                      {shiftTypeOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('shiftType', option.value)}
                          className={`w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between ${
                            formData.shiftType === option.value ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.desc}</div>
                          </div>
                          {formData.shiftType === option.value && (
                            <CheckCircle className="text-purple-600" size={20} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <select
                        value={formData.startTime}
                        onChange={(e) => handleInputChange('startTime', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i;
                          const time24 = `${hour.toString().padStart(2, '0')}:00`;
                          const time12 = new Date(`2000-01-01T${time24}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          });
                          return (
                            <option key={time24} value={time24}>{time12}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <select
                        value={formData.endTime}
                        onChange={(e) => handleInputChange('endTime', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i;
                          const time24 = `${hour.toString().padStart(2, '0')}:00`;
                          const time12 = new Date(`2000-01-01T${time24}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          });
                          return (
                            <option key={time24} value={time24}>{time12}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Days (Always Visible) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
                    <div className="flex gap-1">
                      {dayOptions.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`w-10 h-10 text-sm font-medium border rounded-lg ${
                            formData.selectedDays.includes(day.value)
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recurring Shifts */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={formData.isRecurring}
                        onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium">
                        Recurring shift
                      </label>
                    </div>
                    
                    {formData.isRecurring && (
                      <div className="space-y-4">
                        {/* Frequency */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleInputChange('recurrencePattern', 'weekly')}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                                formData.recurrencePattern === 'weekly'
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              Weekly
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInputChange('recurrencePattern', 'monthly')}
                              className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                                formData.recurrencePattern === 'monthly'
                                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              Monthly
                            </button>
                          </div>
                        </div>

                        {/* End Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                            placeholder="mm/dd/yyyy"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 text-sm font-medium ${
                currentStepIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Previous
            </button>

            {currentStepIndex === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Add Team Member
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeamMemberWizard;