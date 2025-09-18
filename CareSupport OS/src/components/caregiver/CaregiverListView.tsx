import React, { useState } from 'react';
import { Search, ChevronDown, Plus, Filter, AlertCircle, Clock, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Caregiver {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Blocked';
  nextExpiry: string;
  expiryType: string;
  credentials: {
    total: number;
    expiringSoon: number;
    expired: number;
  };
  policies: {
    total: number;
    needsAcknowledgment: number;
  };
}

const caregivers: Caregiver[] = [
  {
    id: 'cg-001',
    name: 'Jane Doe, RN',
    role: 'Registered Nurse',
    status: 'Active',
    nextExpiry: '2024-06-15',
    expiryType: 'RN License',
    credentials: {
      total: 5,
      expiringSoon: 1,
      expired: 0
    },
    policies: {
      total: 8,
      needsAcknowledgment: 1
    }
  },
  {
    id: 'cg-002',
    name: 'John Smith, CNA',
    role: 'Certified Nursing Assistant',
    status: 'Active',
    nextExpiry: '2024-05-30',
    expiryType: 'Background Check',
    credentials: {
      total: 3,
      expiringSoon: 1,
      expired: 0
    },
    policies: {
      total: 8,
      needsAcknowledgment: 0
    }
  },
  {
    id: 'cg-003',
    name: 'Mary Johnson, LPN',
    role: 'Licensed Practical Nurse',
    status: 'Blocked',
    nextExpiry: '2024-04-01',
    expiryType: 'LPN License',
    credentials: {
      total: 4,
      expiringSoon: 0,
      expired: 1
    },
    policies: {
      total: 8,
      needsAcknowledgment: 2
    }
  }
];

function CaregiverListView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const handleCaregiverClick = (caregiverId: string) => {
    navigate(`/caregivers/${caregiverId}`);
  };

  const filteredCaregivers = caregivers.filter(caregiver => 
    caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caregiver.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCaregivers = caregivers.length;
  const expiringSoonCount = caregivers.reduce((sum, cg) => sum + cg.credentials.expiringSoon, 0);
  const expiredCount = caregivers.reduce((sum, cg) => sum + cg.credentials.expired, 0);
  const pendingAcknowledgments = caregivers.reduce((sum, cg) => sum + cg.policies.needsAcknowledgment, 0);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Caregivers</h1>
            <p className="text-gray-600">Manage caregiver credentials and compliance requirements</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Caregiver
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Caregivers</div>
            <div className="text-2xl font-semibold">{totalCaregivers}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Credentials Expiring Soon</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">{expiringSoonCount}</div>
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Expired Credentials</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">{expiredCount}</div>
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Pending Acknowledgments</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-purple-600">{pendingAcknowledgments}</div>
              <FileText size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search caregivers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Role
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Expiring
              <ChevronDown size={16} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caregiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credentials</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policies</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCaregivers.map((caregiver) => (
                <tr 
                  key={caregiver.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCaregiverClick(caregiver.id)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{caregiver.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {caregiver.credentials.expiringSoon > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {caregiver.credentials.expiringSoon} expiring soon
                        </span>
                      )}
                      {caregiver.credentials.expired > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {caregiver.credentials.expired} expired
                        </span>
                      )}
                      {caregiver.policies.needsAcknowledgment > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {caregiver.policies.needsAcknowledgment} pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {caregiver.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      caregiver.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : caregiver.status === 'On Leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {caregiver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{caregiver.nextExpiry}</div>
                    <div className="text-sm text-gray-500">{caregiver.expiryType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            caregiver.credentials.expired > 0
                              ? 'bg-red-500'
                              : caregiver.credentials.expiringSoon > 0
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${((caregiver.credentials.total - caregiver.credentials.expired) / caregiver.credentials.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {caregiver.credentials.total - caregiver.credentials.expired}/{caregiver.credentials.total}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full">
                        <div 
                          className="bg-purple-500 h-full rounded-full"
                          style={{ width: `${((caregiver.policies.total - caregiver.policies.needsAcknowledgment) / caregiver.policies.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {caregiver.policies.total - caregiver.policies.needsAcknowledgment}/{caregiver.policies.total}
                      </span>
                    </div>
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

export default CaregiverListView;