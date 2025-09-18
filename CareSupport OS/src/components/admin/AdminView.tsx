import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Settings, Link as LinkIcon, History, 
  Shield, Building2, Bell, Palette, Globe,
  Database, Key, AlertCircle
} from 'lucide-react';

const adminModules = [
  {
    id: 'users',
    title: 'User & Role Management',
    description: 'Manage user accounts, roles, and access permissions',
    icon: Users,
    path: '/admin/users',
    badge: '24 active'
  },
  {
    id: 'settings',
    title: 'System Settings',
    description: 'Configure agency information and system preferences',
    icon: Settings,
    path: '/admin/settings'
  },
  {
    id: 'integrations',
    title: 'Integrations & API Keys',
    description: 'Connect external systems and manage API access',
    icon: LinkIcon,
    path: '/admin/integrations',
    badge: '3 connected'
  },
  {
    id: 'logs',
    title: 'Logs & Overrides',
    description: 'View system activity and compliance override history',
    icon: History,
    path: '/admin/logs'
  },
  {
    id: 'compliance',
    title: 'Advanced Compliance Settings',
    description: 'Configure state-specific rules and compliance controls',
    icon: Shield,
    path: '/admin/compliance'
  }
];

function AdminView() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-gray-600 mt-1">
            Manage system-wide settings, user accounts, advanced compliance controls, and integrations
          </p>
        </header>

        <div className="grid grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <module.icon className="text-purple-600" size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{module.title}</h3>
                    {module.badge && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{module.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-medium mb-4">Quick Settings</h2>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Building2 size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Agency Information</div>
                    <div className="text-sm text-gray-500">Update agency name and contact details</div>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Edit
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Bell size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Notification Settings</div>
                    <div className="text-sm text-gray-500">Configure system-wide notifications</div>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Configure
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Branding</div>
                    <div className="text-sm text-gray-500">Customize logo and brand colors</div>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Customize
                </button>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Domain Settings</div>
                    <div className="text-sm text-gray-500">Manage custom domain configuration</div>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-medium mb-4">System Status</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database size={16} className="text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Database Status</div>
                  <div className="font-medium text-green-600">Healthy</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Last backup: 2 hours ago</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Key size={16} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">API Status</div>
                  <div className="font-medium">All Systems Operational</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">3 active integrations</div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertCircle size={16} className="text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Compliance Status</div>
                  <div className="font-medium text-yellow-600">2 Warnings</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">Review required</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminView;