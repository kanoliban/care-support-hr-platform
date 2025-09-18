import React, { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const policies = [
  {
    id: 'evv-policy',
    name: 'Electronic Visit Verification (EVV) Policy',
    framework: 'EVV',
    version: 'v1.2',
    status: 'OK',
    lastApproved: 'Apr 30, 2024',
    acceptance: '46/46',
    description: 'Defines how caregivers must clock in/out using location-based or telephony data, in accordance with 21st Century Cures Act.'
  },
  {
    id: 'credential-policy',
    name: 'Credential & Licensure Policy',
    framework: 'Credentialing',
    version: 'v2.0',
    status: 'Draft',
    lastApproved: 'Pending',
    acceptance: '0/46',
    description: 'Outlines required documents for new hires, annual background checks, license renewal intervals, etc.'
  },
  {
    id: 'poc-policy',
    name: 'Plan-of-Care Documentation Policy',
    framework: 'Plan-of-Care',
    version: 'v1.0',
    status: 'OK',
    lastApproved: 'May 1, 2024',
    acceptance: '46/46',
    description: 'Specifies daily tasks, visit logs, medication checks, and mandatory forms for client care.'
  },
  {
    id: 'medication-policy',
    name: 'Medication Administration Policy',
    framework: 'Plan-of-Care',
    version: 'v1.1',
    status: 'OK',
    lastApproved: 'Apr 28, 2024',
    acceptance: '46/46',
    description: 'Guidelines for medication administration, documentation, and safety protocols.'
  },
  {
    id: 'training-policy',
    name: 'Caregiver Training Policy',
    framework: 'Credentialing',
    version: 'v1.0',
    status: 'OK',
    lastApproved: 'Apr 25, 2024',
    acceptance: '46/46',
    description: 'Defines required training programs, continuing education, and skill assessments.'
  }
];

function PolicyListView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);

  const handlePolicyClick = (policyId: string) => {
    navigate(`/compliance/policies/${policyId}`);
  };

  const approvedCount = policies.filter(p => p.status === 'OK').length;
  const draftCount = policies.filter(p => p.status === 'Draft').length;

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Policies</h1>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus size={16} />
              Add custom policy
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Settings size={16} />
              Edit SLAs
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              More
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Policies</div>
            <div className="text-2xl font-semibold">{policies.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Approved</div>
            <div className="text-2xl font-semibold text-green-600">{approvedCount}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Draft</div>
            <div className="text-2xl font-semibold text-yellow-600">{draftCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Framework
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Version
              <ChevronDown size={16} />
            </button>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="rounded border-gray-300"
              />
              Require my approval
            </label>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last approved on</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel acceptance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy) => (
                <tr 
                  key={policy.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePolicyClick(policy.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                    <div className="text-sm text-gray-500">{policy.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {policy.framework}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      policy.status === 'OK' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.lastApproved}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.acceptance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default PolicyListView;