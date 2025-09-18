import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Filter, AlertCircle, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  program: string;
  status: 'Active' | 'Inactive' | 'Pending';
  riskLevel: 'Low' | 'Medium' | 'High';
  complianceScore: number;
  lastUpdated: string;
  alerts: number;
  missingDocs: number;
  carePlanStatus: 'Complete' | 'Needs Review' | 'Incomplete';
}

const clients: Client[] = [
  {
    id: 'client-001',
    name: 'John Smith',
    program: 'TX Medicaid',
    status: 'Active',
    riskLevel: 'Medium',
    complianceScore: 92,
    lastUpdated: '2 hours ago',
    alerts: 2,
    missingDocs: 1,
    carePlanStatus: 'Needs Review'
  },
  {
    id: 'client-002',
    name: 'Mary Johnson',
    program: 'Private Pay',
    status: 'Active',
    riskLevel: 'Low',
    complianceScore: 98,
    lastUpdated: '1 day ago',
    alerts: 0,
    missingDocs: 0,
    carePlanStatus: 'Complete'
  },
  {
    id: 'client-003',
    name: 'Robert Davis',
    program: 'MN Elderly Waiver',
    status: 'Active',
    riskLevel: 'High',
    complianceScore: 85,
    lastUpdated: '30 minutes ago',
    alerts: 3,
    missingDocs: 2,
    carePlanStatus: 'Incomplete'
  }
];

function ClientListView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('All Programs');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedRisk, setSelectedRisk] = useState('All Risk Levels');

  const handleClientClick = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Clients</h1>
            <p className="text-gray-600">Manage client records and compliance requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/compliance/clients/new')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Client
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Active Clients</div>
            <div className="text-2xl font-semibold">{clients.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Compliance Alerts</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">
                {clients.reduce((sum, client) => sum + client.alerts, 0)}
              </div>
              <AlertCircle size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Missing Documents</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">
                {clients.reduce((sum, client) => sum + client.missingDocs, 0)}
              </div>
              <FileText size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clients"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Program
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Risk Level
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Care Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleClientClick(client.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {client.alerts > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {client.alerts} alerts
                        </span>
                      )}
                      {client.missingDocs > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {client.missingDocs} missing
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {client.program}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.riskLevel === 'Low' 
                        ? 'bg-green-100 text-green-800'
                        : client.riskLevel === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.riskLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            client.complianceScore >= 95
                              ? 'bg-green-500'
                              : client.complianceScore >= 80
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${client.complianceScore}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{client.complianceScore}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.carePlanStatus === 'Complete'
                        ? 'bg-green-100 text-green-800'
                        : client.carePlanStatus === 'Needs Review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {client.carePlanStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {client.lastUpdated}
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

export default ClientListView;