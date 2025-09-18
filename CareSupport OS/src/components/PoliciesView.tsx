import React, { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, Plus, Settings } from 'lucide-react';

const policies = [
  {
    name: 'Code of Conduct',
    framework: 'SOC 2',
    status: 'OK',
    lastApproved: 'Apr 30, 2024',
    acceptance: '46/46'
  },
  {
    name: 'Information Security Policy (AUP)',
    framework: 'SOC 2',
    status: 'OK',
    lastApproved: 'Apr 30, 2024',
    acceptance: '46/46'
  },
  {
    name: 'Information Security Roles and Responsibilities',
    framework: 'SOC 2',
    status: 'OK',
    lastApproved: 'Apr 30, 2024',
    acceptance: '46/46'
  },
  // Add more policies as shown in the image
];

function PoliciesView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Policies</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
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
              Type
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frameworks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last approved on</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personnel acceptance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {policies.map((policy, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.framework}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.lastApproved}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{policy.acceptance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
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

export default PoliciesView;