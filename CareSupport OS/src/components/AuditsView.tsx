import React, { useState } from 'react';
import { Search, MoreHorizontal, Plus, ChevronDown } from 'lucide-react';
import EmptyAuditsView from './EmptyAuditsView';
import AuditCard from './audit/AuditCard';
import AuditDetailView from './audit/AuditDetailView';

const audits = [
  {
    id: 'state-health-2025',
    title: 'State Department Health Audit',
    status: 'In progress',
    firm: 'Minnesota Dept. of Health',
    teamMembers: ['RC', 'AS', 'JD'],
    timeline: [
      { event: 'Auditor gets access', date: 'June 1, 2025' },
      { event: 'Audit starts', date: 'June 1, 2025' },
      { event: 'Audit ends', date: 'July 31, 2025' }
    ],
    progress: {
      notReady: 12,
      ready: 185,
      flagged: 5,
      accepted: 0,
      notApplicable: 9
    },
    frameworks: ['EVV', 'Credentialing', 'Plan-of-Care'],
    evidence: [
      {
        id: 'evv-1',
        name: 'EVV Shift Logs - Q2 2025',
        type: 'Document',
        owner: 'RC',
        status: 'Ready for audit',
        lastUpdated: '2 hours ago'
      },
      {
        id: 'cred-1',
        name: 'Caregiver Licenses & Certifications',
        type: 'Document',
        owner: 'AS',
        status: 'Not ready',
        lastUpdated: '1 day ago'
      },
      {
        id: 'poc-1',
        name: 'Client Care Plans',
        type: 'Document',
        owner: 'JD',
        status: 'Flagged by auditor',
        lastUpdated: '3 hours ago'
      }
    ],
    dateRange: 'June 1, 2025 - July 31, 2025'
  },
  {
    id: 'blue-cross-2025',
    title: 'Blue Cross Insurance Review',
    status: 'Scheduled',
    firm: 'Blue Cross Audit Team',
    teamMembers: ['JA', 'KS'],
    timeline: [
      { event: 'Auditor gets access', date: 'August 10, 2025' },
      { event: 'Audit starts', date: 'August 10, 2025' },
      { event: 'Audit ends', date: 'September 5, 2025' }
    ],
    progress: {
      notReady: 8,
      ready: 35,
      flagged: 0,
      accepted: 0,
      notApplicable: 2
    },
    frameworks: ['Credentialing', 'Plan-of-Care'],
    evidence: [
      {
        id: 'cred-2',
        name: 'Provider Credentials',
        type: 'Document',
        owner: 'JA',
        status: 'Ready for audit',
        lastUpdated: '1 day ago'
      },
      {
        id: 'poc-2',
        name: 'Service Documentation',
        type: 'Document',
        owner: 'KS',
        status: 'Not ready',
        lastUpdated: '5 hours ago'
      }
    ],
    dateRange: 'August 10, 2025 - September 5, 2025'
  }
];

function AuditsView() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);

  const selectedAuditData = audits.find(audit => audit.id === selectedAudit);

  return (
    <main className="flex-1 overflow-hidden">
      {selectedAudit ? (
        <AuditDetailView 
          audit={selectedAuditData!}
          onClose={() => setSelectedAudit(null)}
        />
      ) : (
        <div className="p-8">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Audits</h1>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                <Plus size={16} />
                Add Audit
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <MoreHorizontal size={20} />
              </button>
            </div>
          </header>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6">
                <button
                  onClick={() => setActiveTab('active')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'active'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'completed'
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Audit firm
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Framework
              <ChevronDown size={16} />
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
              <ChevronDown size={16} />
            </button>
          </div>

          {activeTab === 'active' ? (
            <div className="space-y-4">
              {audits.map((audit) => (
                <AuditCard
                  key={audit.id}
                  {...audit}
                  onOpen={() => setSelectedAudit(audit.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyAuditsView />
          )}
        </div>
      )}
    </main>
  );
}

export default AuditsView;