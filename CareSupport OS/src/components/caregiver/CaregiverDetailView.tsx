import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Clock, 
  AlertCircle, 
  FileText, 
  Users, 
  Shield,
  Calendar,
  History,
  Download,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react';
import CaregiverTimelineView from './CaregiverTimelineView';

interface Caregiver {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  status: 'Active' | 'On Leave' | 'Blocked';
  credentials: Credential[];
  policyAcknowledgments: PolicyAcknowledgment[];
  supervisor?: string;
  availability?: {
    weeklyHours: number;
    preferences: string[];
  };
}

interface Credential {
  id: string;
  type: string;
  identifier: string;
  issuingState: string;
  issueDate: string;
  expirationDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  controlId?: string;
  document?: string;
}

interface PolicyAcknowledgment {
  id: string;
  policyName: string;
  version: string;
  acknowledgedDate: string;
  status: 'Acknowledged' | 'Pending' | 'Expired';
}

const mockCaregivers: Record<string, Caregiver> = {
  'cg-001': {
    id: 'cg-001',
    name: 'Jane Doe, RN',
    role: 'Registered Nurse',
    email: 'jane.doe@example.com',
    phone: '(555) 123-4567',
    address: '123 Healthcare Ave, Minneapolis, MN 55401',
    startDate: '2023-01-15',
    status: 'Active',
    credentials: [
      {
        id: 'cred-001',
        type: 'RN License',
        identifier: 'RN123456',
        issuingState: 'MN',
        issueDate: '2023-06-15',
        expirationDate: '2024-06-15',
        status: 'Valid',
        controlId: 'CRD-1'
      },
      {
        id: 'cred-002',
        type: 'Background Check',
        identifier: 'BGC789012',
        issuingState: 'MN',
        issueDate: '2023-05-30',
        expirationDate: '2024-05-30',
        status: 'Valid',
        controlId: 'CRD-2'
      },
      {
        id: 'cred-003',
        type: 'CPR Certification',
        identifier: 'CPR345678',
        issuingState: 'MN',
        issueDate: '2023-03-15',
        expirationDate: '2024-03-15',
        status: 'Valid'
      }
    ],
    policyAcknowledgments: [
      {
        id: 'pol-001',
        policyName: 'Medication Administration Policy',
        version: 'v2.0',
        acknowledgedDate: '2024-01-15',
        status: 'Acknowledged'
      },
      {
        id: 'pol-002',
        policyName: 'Infection Control Policy',
        version: 'v3.1',
        acknowledgedDate: '2024-02-01',
        status: 'Acknowledged'
      },
      {
        id: 'pol-003',
        policyName: 'Plan-of-Care Documentation Policy',
        version: 'v1.0',
        acknowledgedDate: '',
        status: 'Pending'
      }
    ],
    supervisor: 'Alex Smith',
    availability: {
      weeklyHours: 40,
      preferences: ['Day Shift', 'Weekdays']
    }
  }
};

function CaregiverDetailView() {
  const { caregiverId } = useParams<{ caregiverId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const caregiver = mockCaregivers[caregiverId || ''];

  if (!caregiver) {
    return <div>Caregiver not found</div>;
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/caregivers')}
            className="text-gray-500 hover:text-gray-700"
          >
            Caregivers
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{caregiver.name}</span>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{caregiver.name}</h1>
            <div className="text-sm text-gray-500 mt-1">
              Started {caregiver.startDate}
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {caregiver.role}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                caregiver.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : caregiver.status === 'On Leave'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {caregiver.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              More
              <ChevronDown size={16} />
            </button>
          </div>
        </header>

        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'schedule'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'credentials'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Credentials
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'policies'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Policies
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <span>{caregiver.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  <span>{caregiver.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{caregiver.address}</span>
                </div>
                {caregiver.supervisor && (
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span>Reports to: {caregiver.supervisor}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-4">Availability</h2>
              {caregiver.availability ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Weekly Hours</div>
                    <div className="font-medium">{caregiver.availability.weeklyHours} hours</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Preferences</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {caregiver.availability.preferences.map((pref, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No availability information set</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <CaregiverTimelineView caregiverId={caregiverId!} />
        )}

        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Credentials & Certifications</h2>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Credential
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {caregiver.credentials.map((credential) => (
                    <tr key={credential.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{credential.type}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{credential.identifier}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{credential.issuingState}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{credential.issueDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{credential.expirationDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          credential.status === 'Valid'
                            ? 'bg-green-100 text-green-800'
                            : credential.status === 'Expiring Soon'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {credential.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {credential.controlId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {credential.controlId}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Policy Acknowledgments</h2>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acknowledged On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {caregiver.policyAcknowledgments.map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{policy.policyName}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{policy.version}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          policy.status === 'Acknowledged'
                            ? 'bg-green-100 text-green-800'
                            : policy.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {policy.acknowledgedDate || 'Not yet acknowledged'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                          {policy.status === 'Pending' ? 'Acknowledge' : 'View'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CaregiverDetailView;