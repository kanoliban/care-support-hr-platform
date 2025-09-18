import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Users, 
  Eye,
  Settings,
  ChevronRight,
  Shield,
  BookOpen
} from 'lucide-react';

function SettingsView() {
  const navigate = useNavigate();
  const location = useLocation();

  const settingsPages = [
    {
      id: 'care-profile',
      title: 'Care Profile',
      description: 'Care recipient information, needs, and preferences',
      icon: User,
      path: '/settings/care-profile',
      color: 'blue'
    },
    {
      id: 'care-standards',
      title: 'Care Standards',
      description: 'Care protocols, compliance requirements, and quality standards',
      icon: Shield,
      path: '/settings/care-standards',
      color: 'red'
    },
    {
      id: 'preferences',
      title: 'My Preferences',
      description: 'Personal settings and care coordination preferences',
      icon: BookOpen,
      path: '/settings/preferences',
      color: 'indigo'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage alerts, reminders, and communication preferences',
      icon: Bell,
      path: '/settings/notifications',
      color: 'green'
    },
    {
      id: 'permissions',
      title: 'Team Permissions',
      description: 'Control what team members can see and do',
      icon: Users,
      path: '/settings/permissions',
      color: 'purple'
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      description: 'Visual, audio, and interaction accessibility options',
      icon: Eye,
      path: '/settings/accessibility',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'purple':
        return 'bg-purple-100 text-purple-600';
      case 'orange':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Settings size={28} className="text-gray-600" />
            Settings
          </h1>
          <p className="text-gray-600">Customize your CareSupport experience</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsPages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => navigate(page.path)}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 text-left group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(page.color)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{page.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{page.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Settings */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Quick Settings</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Display</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Theme</div>
                    <div className="text-sm text-gray-600">Light mode</div>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                    <option>Light</option>
                    <option>Dark</option>
                    <option>Auto</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Language</div>
                    <div className="text-sm text-gray-600">English</div>
                  </div>
                  <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Notifications</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Coverage Gaps</div>
                    <div className="text-sm text-gray-600">Immediate alerts</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Daily Summary</div>
                    <div className="text-sm text-gray-600">8:00 AM</div>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsView;