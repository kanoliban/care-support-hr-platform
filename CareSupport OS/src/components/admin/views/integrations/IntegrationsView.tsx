import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, Plus, Link as LinkIcon, 
  AlertCircle, CheckCircle, XCircle, Key, 
  ExternalLink, Copy, Eye, EyeOff, Trash2
} from 'lucide-react';
import { Integration } from '../../types';

// Mock data for demonstration
const integrations: Integration[] = [
  {
    id: 'int-001',
    name: 'State EVV Aggregator',
    type: 'EVV',
    status: 'Active',
    lastSync: '2024-04-15 10:30',
    config: {
      apiKey: 'sk_test_****1234',
      endpoint: 'https://api.evv-aggregator.com'
    }
  },
  {
    id: 'int-002',
    name: 'Claims Portal',
    type: 'Billing',
    status: 'Active',
    lastSync: '2024-04-15 09:45',
    config: {
      apiKey: 'sk_live_****5678',
      endpoint: 'https://api.claims-portal.com'
    }
  },
  {
    id: 'int-003',
    name: 'Payroll System',
    type: 'Payroll',
    status: 'Error',
    lastSync: '2024-04-14 15:20',
    config: {
      apiKey: 'sk_test_****9012',
      endpoint: 'https://api.payroll-system.com'
    }
  }
];

const apiKeys = [
  {
    id: 'key-001',
    name: 'Production API Key',
    key: 'sk_live_****abcd',
    created: '2024-01-15',
    lastUsed: '2024-04-15 11:30',
    environment: 'production'
  },
  {
    id: 'key-002',
    name: 'Test API Key',
    key: 'sk_test_****efgh',
    created: '2024-03-01',
    lastUsed: '2024-04-14 09:15',
    environment: 'test'
  }
];

function IntegrationsView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    // Show toast notification
  };

  const handleDeleteKey = (keyId: string) => {
    // Show confirmation modal
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Admin
          </button>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Integrations & API Keys</h1>
            <p className="text-gray-600 mt-1">Connect external systems and manage API access</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNewKeyModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Generate API Key
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Active Integrations</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">
                {integrations.filter(i => i.status === 'Active').length}
              </div>
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Failed Integrations</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">
                {integrations.filter(i => i.status === 'Error').length}
              </div>
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Active API Keys</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">{apiKeys.length}</div>
              <Key size={20} className="text-gray-600" />
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium">Connected Systems</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div 
                    key={integration.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <LinkIcon size={20} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-gray-500">Last sync: {integration.lastSync}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        integration.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {integration.status}
                      </span>
                      <button className="text-purple-600 hover:text-purple-700">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
           Continuing the IntegrationsView.tsx file content exactly where it left off:

          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium">API Keys</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {showKey === apiKey.id ? apiKey.key.replace('****', '1234') : apiKey.key}
                        </code>
                        <button 
                          onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showKey === apiKey.id ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button 
                          onClick={() => handleCopyKey(apiKey.key)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{apiKey.created}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{apiKey.lastUsed}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        apiKey.environment === 'production'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {apiKey.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteKey(apiKey.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-medium">Webhook Settings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift Completion Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="https://your-domain.com/webhooks/shifts"
                    />
                    <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                      Test
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compliance Alert Webhook URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                      placeholder="https://your-domain.com/webhooks/compliance"
                    />
                    <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
                      Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default IntegrationsView;