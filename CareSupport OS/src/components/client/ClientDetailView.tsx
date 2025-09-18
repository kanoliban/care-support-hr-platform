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
  Download
} from 'lucide-react';
import ClientTimelineView from './ClientTimelineView';

interface Client {
  id: string;
  name: string;
  dateOfBirth: string;
  address: string;
  program: string;
  startDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  riskLevel: 'Low' | 'Medium' | 'High';
  diagnoses: string[];
  allergies: string[];
  guardian?: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  consents: {
    name: string;
    status: 'Valid' | 'Expired' | 'Missing';
    expirationDate?: string;
  }[];
  carePlan: {
    tasks: {
      id: string;
      name: string;
      frequency: string;
      status: 'Active' | 'Completed' | 'Overdue';
      lastCompleted?: string;
      controlId?: string;
    }[];
    lastUpdated: string;
  };
  incidents: {
    id: string;
    date: string;
    type: string;
    severity: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'Closed';
    description: string;
  }[];
}

const mockClient: Client = {
  id: 'client-001',
  name: 'John Smith',
  dateOfBirth: '1945-06-15',
  address: '123 Main St, Minneapolis, MN 55401',
  program: 'TX Medicaid',
  startDate: '2024-01-15',
  status: 'Active',
  riskLevel: 'Medium',
  diagnoses: ['Type 2 Diabetes', 'Hypertension', 'CHF'],
  allergies: ['Penicillin', 'Latex'],
  guardian: {
    name: 'Sarah Smith',
    relationship: 'Daughter',
    phone: '(555) 123-4567',
    email: 'sarah.smith@email.com'
  },
  consents: [
    {
      name: 'HIPAA Authorization',
      status: 'Valid',
      expirationDate: '2025-01-15'
    },
    {
      name: 'Service Agreement',
      status: 'Valid',
      expirationDate: '2025-01-15'
    },
    {
      name: 'Emergency Contact',
      status: 'Missing'
    }
  ],
  carePlan: {
    tasks: [
      {
        id: 'task-001',
        name: 'Blood Glucose Monitoring',
        frequency: 'Daily - Morning and Evening',
        status: 'Active',
        lastCompleted: '2024-04-15 08:00',
        controlId: 'CRD-1'
      },
      {
        id: 'task-002',
        name: 'Medication Administration',
        frequency: 'Daily - Three times',
        status: 'Active',
        lastCompleted: '2024-04-15 12:00',
        controlId: 'CRD-1'
      },
      {
        id: 'task-003',
        name: 'Weight Monitoring',
        frequency: 'Weekly',
        status: 'Overdue',
        lastCompleted: '2024-04-08 10:00'
      }
    ],
    lastUpdated: '2024-04-15'
  },
  incidents: [
    {
      id: 'inc-001',
      date: '2024-04-10',
      type: 'Fall',
      severity: 'Medium',
      status: 'Closed',
      description: 'Client experienced a fall in bathroom. No injuries reported.'
    },
    {
      id: 'inc-002',
      date: '2024-04-15',
      type: 'Medication Error',
      severity: 'Low',
      status: 'Open',
      description: 'Medication dose delayed by 2 hours.'
    }
  ]
};

function ClientDetailView() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewIncidentModal, setShowNewIncidentModal] = useState(false);

  // In a real app, fetch client data based on clientId
  const client = mockClient;

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/clients')}
            className="text-gray-500 hover:text-gray-700"
          >
            Clients
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{client.name}</span>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{client.name}</h1>
            <div className="text-sm text-gray-500 mt-1">
              Client since {client.startDate}
            </div>
            <div className="flex gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {client.program}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'Inactive'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {client.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.riskLevel === 'Low'
                  ? 'bg-green-100 text-green-800'
                  : client.riskLevel === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.riskLevel} Risk
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowNewIncidentModal(true)}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus size={16} />
              Report Incident
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export
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
            onClick={() => setActiveTab('care-plan')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'care-plan'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Care Plan
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'incidents'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Incidents
          </button>
          <button
            onClick={() => setActiveTab('consents')}
            className={`pb-4 text-sm font-medium border-b-2 ${
              activeTab === 'consents'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Consents & Documents
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Date of Birth</div>
                    <div>{client.dateOfBirth}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div>{client.address}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Program</div>
                    <div>{client.program}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Guardian Information</h2>
                {client.guardian ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div>{client.guardian.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Relationship</div>
                      <div>{client.guardian.relationship}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Contact</div>
                      <div>{client.guardian.phone}</div>
                      <div>{client.guardian.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500">No guardian information available</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Medical Information</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Diagnoses</div>
                    <div className="space-y-1">
                      {client.diagnoses.map((diagnosis, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>{diagnosis}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Allergies</div>
                    <div className="space-y-1">
                      {client.allergies.map((allergy, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          <span>{allergy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {client.incidents.slice(0, 3).map((incident) => (
                    <div key={incident.id} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                          <AlertCircle size={14} className="text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{incident.type}</div>
                        <div className="text-sm text-gray-500">{incident.date}</div>
                        <div className="text-sm text-gray-600 mt-1">{incident.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <ClientTimelineView clientId={clientId!} />
        )}

        {activeTab === 'care-plan' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Care Plan Tasks</h2>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {client.carePlan.tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{task.frequency}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{task.lastCompleted || 'Never'}</td>
                      <td className="px-6 py-4">
                        {task.controlId && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {task.controlId}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Incident Reports</h2>
                <button 
                  onClick={() => setShowNewIncidentModal(true)}
                  className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Report Incident
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {client.incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{incident.date}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{incident.type}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          incident.severity === 'Low'
                            ? 'bg-green-100 text-green-800'
                            : incident.severity === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {incident.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          incident.status === 'Open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{incident.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'consents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium">Consents & Documents</h2>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  <Plus size={16} />
                  Upload Document
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {client.consents.map((consent, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{consent.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          consent.status === 'Valid'
                            ? 'bg-green-100 text-green-800'
                            : consent.status === 'Expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {consent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {consent.expirationDate || 'N/A'}
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
      </div>
    </main>
  );
}

export default ClientDetailView;