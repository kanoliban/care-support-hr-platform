import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  BellOff,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  MessageCircle,
  Mail,
  Smartphone,
  Save
} from 'lucide-react';

function NotificationsView() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    // Coverage & Scheduling
    coverageGaps: {
      enabled: true,
      immediate: true,
      email: true,
      sms: true,
      sound: true
    },
    upcomingShifts: {
      enabled: true,
      advance: 30, // minutes
      email: true,
      sms: false,
      sound: true
    },
    scheduleChanges: {
      enabled: true,
      email: true,
      sms: true,
      sound: false
    },
    
    // Care Updates
    medicationReminders: {
      enabled: true,
      email: false,
      sms: true,
      sound: true
    },
    appointmentReminders: {
      enabled: true,
      advance: 60, // minutes
      email: true,
      sms: true,
      sound: true
    },
    careNotes: {
      enabled: true,
      email: true,
      sms: false,
      sound: false
    },
    
    // Team Communication
    teamUpdates: {
      enabled: true,
      email: true,
      sms: false,
      sound: false
    },
    emergencyAlerts: {
      enabled: true,
      email: true,
      sms: true,
      sound: true,
      immediatePush: true
    },
    
    // Daily/Weekly
    dailySummary: {
      enabled: true,
      time: '08:00',
      email: true,
      sms: false
    },
    weeklySummary: {
      enabled: true,
      day: 'sunday',
      time: '09:00',
      email: true,
      sms: false
    },
    
    // System
    systemMaintenance: {
      enabled: true,
      email: true,
      sms: false
    }
  });

  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturbEnabled: false,
    doNotDisturbStart: '22:00',
    doNotDisturbEnd: '07:00',
    allowEmergencyDuringDND: true
  });

  const handleNotificationChange = (category: string, field: string, value: any) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleGlobalChange = (field: string, value: any) => {
    setGlobalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving notifications:', { notifications, globalSettings });
    alert('Notification settings saved successfully!');
  };

  const NotificationCategory = ({ 
    title, 
    icon: Icon, 
    children, 
    iconColor 
  }: { 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
    iconColor: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Icon size={20} className={iconColor} />
        {title}
      </h2>
      {children}
    </div>
  );

  const NotificationRow = ({ 
    label, 
    description, 
    category, 
    settings 
  }: { 
    label: string; 
    description: string; 
    category: string; 
    settings: any;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => handleNotificationChange(category, 'enabled', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Enable</span>
        </div>
        {settings.enabled && (
          <>
            {settings.hasOwnProperty('email') && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.email}
                  onChange={(e) => handleNotificationChange(category, 'email', e.target.checked)}
                  className="rounded"
                />
                <Mail size={16} className="text-gray-500" />
              </div>
            )}
            {settings.hasOwnProperty('sms') && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.sms}
                  onChange={(e) => handleNotificationChange(category, 'sms', e.target.checked)}
                  className="rounded"
                />
                <Smartphone size={16} className="text-gray-500" />
              </div>
            )}
            {settings.hasOwnProperty('sound') && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.sound}
                  onChange={(e) => handleNotificationChange(category, 'sound', e.target.checked)}
                  className="rounded"
                />
                <Bell size={16} className="text-gray-500" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

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
              <Bell size={28} className="text-green-600" />
              Notifications
            </h1>
            <p className="text-gray-600">Manage alerts, reminders, and communication preferences</p>
          </div>
        </header>

        <div className="max-w-4xl space-y-8">
          {/* Global Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BellOff size={20} className="text-red-600" />
              Do Not Disturb
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="dnd"
                  checked={globalSettings.doNotDisturbEnabled}
                  onChange={(e) => handleGlobalChange('doNotDisturbEnabled', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="dnd" className="text-sm font-medium text-gray-700">
                  Enable Do Not Disturb
                </label>
              </div>

              {globalSettings.doNotDisturbEnabled && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={globalSettings.doNotDisturbStart}
                        onChange={(e) => handleGlobalChange('doNotDisturbStart', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                      <input
                        type="time"
                        value={globalSettings.doNotDisturbEnd}
                        onChange={(e) => handleGlobalChange('doNotDisturbEnd', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      id="emergencyDND"
                      checked={globalSettings.allowEmergencyDuringDND}
                      onChange={(e) => handleGlobalChange('allowEmergencyDuringDND', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="emergencyDND" className="text-sm font-medium text-gray-700">
                      Allow emergency notifications during Do Not Disturb
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Coverage & Scheduling */}
          <NotificationCategory title="Coverage & Scheduling" icon={Calendar} iconColor="text-purple-600">
            <div className="space-y-0">
              <NotificationRow
                label="Coverage Gaps"
                description="Get notified immediately when gaps appear in coverage"
                category="coverageGaps"
                settings={notifications.coverageGaps}
              />
              <NotificationRow
                label="Upcoming Shifts"
                description="Reminders before your shifts start"
                category="upcomingShifts"
                settings={notifications.upcomingShifts}
              />
              <NotificationRow
                label="Schedule Changes"
                description="When shifts are added, removed, or modified"
                category="scheduleChanges"
                settings={notifications.scheduleChanges}
              />
            </div>
          </NotificationCategory>

          {/* Care Updates */}
          <NotificationCategory title="Care Updates" icon={User} iconColor="text-blue-600">
            <div className="space-y-0">
              <NotificationRow
                label="Medication Reminders"
                description="Reminders for medication times"
                category="medicationReminders"
                settings={notifications.medicationReminders}
              />
              <NotificationRow
                label="Appointment Reminders"
                description="Upcoming medical appointments"
                category="appointmentReminders"
                settings={notifications.appointmentReminders}
              />
              <NotificationRow
                label="Care Notes"
                description="When team members add care notes"
                category="careNotes"
                settings={notifications.careNotes}
              />
            </div>
          </NotificationCategory>

          {/* Team Communication */}
          <NotificationCategory title="Team Communication" icon={MessageCircle} iconColor="text-green-600">
            <div className="space-y-0">
              <NotificationRow
                label="Team Updates"
                description="Messages and updates from team members"
                category="teamUpdates"
                settings={notifications.teamUpdates}
              />
              <NotificationRow
                label="Emergency Alerts"
                description="Critical alerts requiring immediate attention"
                category="emergencyAlerts"
                settings={notifications.emergencyAlerts}
              />
            </div>
          </NotificationCategory>

          {/* Summaries */}
          <NotificationCategory title="Daily & Weekly Summaries" icon={Clock} iconColor="text-orange-600">
            <div className="space-y-6">
              <div className="flex items-start justify-between py-4 border-b border-gray-100">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Daily Summary</div>
                  <div className="text-sm text-gray-600">Overview of the day's care activities</div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.dailySummary.enabled}
                      onChange={(e) => handleNotificationChange('dailySummary', 'enabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable</span>
                  </div>
                  {notifications.dailySummary.enabled && (
                    <input
                      type="time"
                      value={notifications.dailySummary.time}
                      onChange={(e) => handleNotificationChange('dailySummary', 'time', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                  )}
                </div>
              </div>
              
              <div className="flex items-start justify-between py-4">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Weekly Summary</div>
                  <div className="text-sm text-gray-600">Weekly care overview and upcoming schedule</div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notifications.weeklySummary.enabled}
                      onChange={(e) => handleNotificationChange('weeklySummary', 'enabled', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">Enable</span>
                  </div>
                  {notifications.weeklySummary.enabled && (
                    <>
                      <select
                        value={notifications.weeklySummary.day}
                        onChange={(e) => handleNotificationChange('weeklySummary', 'day', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="sunday">Sunday</option>
                        <option value="monday">Monday</option>
                        <option value="tuesday">Tuesday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="thursday">Thursday</option>
                        <option value="friday">Friday</option>
                        <option value="saturday">Saturday</option>
                      </select>
                      <input
                        type="time"
                        value={notifications.weeklySummary.time}
                        onChange={(e) => handleNotificationChange('weeklySummary', 'time', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </NotificationCategory>

          {/* System */}
          <NotificationCategory title="System" icon={AlertTriangle} iconColor="text-yellow-600">
            <NotificationRow
              label="System Maintenance"
              description="Scheduled maintenance and system updates"
              category="systemMaintenance"
              settings={notifications.systemMaintenance}
            />
          </NotificationCategory>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-700 mb-2 font-medium">Notification Methods:</div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Mail size={16} />
              Email
            </div>
            <div className="flex items-center gap-1">
              <Smartphone size={16} />
              SMS
            </div>
            <div className="flex items-center gap-1">
              <Bell size={16} />
              Browser/App Sound
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
            Save Notification Settings
          </button>
        </div>
      </div>
    </main>
  );
}

export default NotificationsView;