import React, { useState } from 'react';
import { Search, ChevronDown, ExternalLink } from 'lucide-react';

interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  owner: string;
  status: 'Not ready' | 'Ready for audit' | 'Flagged by auditor' | 'Accepted' | 'Not applicable';
  lastUpdated: string;
}

interface AuditDetailViewProps {
  audit: {
    title: string;
    firm: string;
    dateRange: string;
    progress: {
      notReady: number;
      ready: number;
      flagged: number;
      accepted: number;
      notApplicable: number;
    };
    evidence: EvidenceItem[];
  };
  onClose: () => void;
}

function AuditDetailView({ audit, onClose }: AuditDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filteredEvidence = audit.evidence.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalItems = audit.progress.notReady + audit.progress.ready + 
                    audit.progress.flagged + audit.progress.accepted + 
                    audit.progress.notApplicable;

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{audit.title}</h1>
            <div className="text-sm text-gray-500 mt-1">
              {audit.firm} · {audit.dateRange}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              View SLAs
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              Export
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </header>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Audit progress</h2>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="flex h-full">
              {audit.progress.notReady > 0 && (
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(audit.progress.notReady / totalItems) * 100}%` }} 
                />
              )}
              {audit.progress.ready > 0 && (
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(audit.progress.ready / totalItems) * 100}%` }} 
                />
              )}
              {audit.progress.flagged > 0 && (
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(audit.progress.flagged / totalItems) * 100}%` }} 
                />
              )}
              {audit.progress.accepted > 0 && (
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(audit.progress.accepted / totalItems) * 100}%` }} 
                />
              )}
              {audit.progress.notApplicable > 0 && (
                <div 
                  className="h-full bg-gray-300" 
                  style={{ width: `${(audit.progress.notApplicable / totalItems) * 100}%` }} 
                />
              )}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Not ready for audit: {audit.progress.notReady}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span>Ready for audit: {audit.progress.ready}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Flagged by auditor: {audit.progress.flagged}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Accepted: {audit.progress.accepted}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span>Not applicable: {audit.progress.notApplicable}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search evidence"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                Type
                <ChevronDown size={16} />
              </button>
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                Status
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvidence.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700">
                      {item.owner}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Ready for audit'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'Flagged by auditor'
                        ? 'bg-yellow-100 text-yellow-800'
                        : item.status === 'Accepted'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'Not applicable'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.lastUpdated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AuditDetailView;