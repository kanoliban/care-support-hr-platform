import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Clock, 
  Calendar,
  Phone,
  Mail,
  Globe,
  Palette,
  Save
} from 'lucide-react';
import { useCareCoordination } from '../../contexts/CareCoordinationContext';

function PreferencesView() {
  const navigate = useNavigate();
  const careContext = useCareCoordination();
  
  // Get the coordinator info - Rob coordinates himself, but we can also use the team member data
  const coordinatorMember = careContext.careTeam.find(m => m.id === 'rob-wudlick');
  const coordinatorName = coordinatorMember?.name || careContext.careRecipient.primaryCoordinator;
  const coordinatorPhone = coordinatorMember?.contactInfo.phone || '+1-555-0100';
  const coordinatorEmail = coordinatorMember?.contactInfo.email || 'rob@example.com';

  const [preferences, setPreferences] = useState({
    // Personal Info
    name: coordinatorName,
    email: coordinatorEmail,
    phone: coordinatorPhone,
    timezone: 'America/Los_Angeles',
    
    // Display Preferences
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Care Coordination Preferences
    defaultView: 'command-center',
    autoRefresh: true,
    refreshInterval: 5,
    showCompletedjTasks: false,
    
    // Communication Preferences
    preferredContactMethod: 'both',
    receiveWeeklyDigest: true,
    digestDay: 'sunday',
    digestTime: '08:00'
  });

  const handleSave = () => {
    // In real app, would save to backend
    console.log('Saving preferences:', preferences);
    // Show success message
    alert('Preferences saved successfully!');
  };

  const handleInputChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User size={28} className="text-blue-600" />
              My Preferences
            </h1>
            <p className="text-gray-600">Personal settings and care coordination preferences</p>
          </div>
        </header>

        <div className="max-w-4xl space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={preferences.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={preferences.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={preferences.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette size={20} className="text-purple-600" />
              Display Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                <select
                  value={preferences.timeFormat}
                  onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="12h">12 hour (AM/PM)</option>
                  <option value="24h">24 hour</option>
                </select>
              </div>
            </div>
          </div>

          {/* Care Coordination */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-green-600" />
              Care Coordination
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                <select
                  value={preferences.defaultView}
                  onChange={(e) => handleInputChange('defaultView', e.target.value)}
                  className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="command-center">Command Center</option>
                  <option value="schedule">Schedule</option>
                  <option value="care-recipient">Care Profile</option>
                  <option value="gaps">Coverage Gaps</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={preferences.autoRefresh}
                  onChange={(e) => handleInputChange('autoRefresh', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm font-medium text-gray-700">
                  Auto-refresh data
                </label>
              </div>

              {preferences.autoRefresh && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval</label>
                  <select
                    value={preferences.refreshInterval}
                    onChange={(e) => handleInputChange('refreshInterval', parseInt(e.target.value))}
                    className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value={1}>1 minute</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="showCompleted"
                  checked={preferences.showCompletedjTasks}
                  onChange={(e) => handleInputChange('showCompletedjTasks', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showCompleted" className="text-sm font-medium text-gray-700">
                  Show completed tasks by default
                </label>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={20} className="text-orange-600" />
              Communication
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                <select
                  value={preferences.preferredContactMethod}
                  onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                  className="w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="email">Email only</option>
                  <option value="sms">SMS only</option>
                  <option value="both">Email and SMS</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="weeklyDigest"
                  checked={preferences.receiveWeeklyDigest}
                  onChange={(e) => handleInputChange('receiveWeeklyDigest', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="weeklyDigest" className="text-sm font-medium text-gray-700">
                  Receive weekly care summary
                </label>
              </div>

              {preferences.receiveWeeklyDigest && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                    <select
                      value={preferences.digestDay}
                      onChange={(e) => handleInputChange('digestDay', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={preferences.digestTime}
                      onChange={(e) => handleInputChange('digestTime', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save size={20} />
            Save Preferences
          </button>
        </div>
      </div>
    </main>
  );
}

export default PreferencesView;