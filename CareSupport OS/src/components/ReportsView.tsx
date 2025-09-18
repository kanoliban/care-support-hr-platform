import React, { useState } from 'react';
import { Search, ChevronDown, FileText, Building2, Clock, AlertCircle, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';

const reports = [
  {
    id: 'care-delivery-overview',
    title: 'Care Delivery Overview',
    description: 'Gain a top-level view of compliance across EVV, Credentialing, and Plan-of-Care',
    icon: FileText,
    charts: ['Tests', 'Risk', '+3'],
    createdBy: 'System'
  },
  {
    id: 'credential-expiration',
    title: 'Credential Expiration Report',
    description: 'Track upcoming license renewals and certification requirements',
    icon: Clock,
    charts: ['Credentialing'],
    createdBy: 'System'
  },
  {
    id: 'policy-acceptance',
    title: 'Policy Acceptance Logs',
    description: 'Monitor policy acknowledgment status across all personnel',
    icon: Building2,
    charts: ['Personnel'],
    createdBy: 'System'
  }
];

function ProgramOverview() {
  const [dateRange, setDateRange] = useState('Last 30 days (Aug 11, 2024 - Sep 10, 2024)');
  const [selectedFramework, setSelectedFramework] = useState('All Frameworks');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
            {dateRange}
            <ChevronDown size={16} />
          </button>
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
            {selectedFramework}
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
          Share
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Task completion rate within SLA over the last 30 days</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Completed by due date</span>
              <span className="text-2xl font-bold">95%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp size={16} />
              <span>12% compared to previous period</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Past due completion</span>
              <span className="text-2xl font-bold">4%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '4%' }} />
            </div>
            <div className="flex items-center text-sm text-red-600">
              <ArrowDown size={16} />
              <span>2% compared to previous period</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Incomplete</span>
              <span className="text-2xl font-bold">1%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full mb-2">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '1%' }} />
            </div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUp size={16} />
              <span>3% compared to previous period</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Compliance Risk Over Time</h2>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-1/6">
                <div className="h-32 bg-green-500 rounded-t" />
                <div className="h-16 bg-yellow-500" />
                <div className="h-8 bg-red-500" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Aug 13</span>
            <span>Aug 20</span>
            <span>Aug 27</span>
            <span>Sep 03</span>
            <span>Sep 10</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Framework Progress</h2>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">EVV Compliance</span>
                <span>98%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Credentialing</span>
                <span>95%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Plan-of-Care</span>
                <span>92%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOverview, setShowOverview] = useState(false);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Reports</h1>
            <p className="text-gray-600">View reports for insights into your care delivery compliance and operations</p>
          </div>
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            Submit feedback
          </button>
        </header>

        {!showOverview ? (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created by</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr 
                      key={report.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => report.id === 'care-delivery-overview' && setShowOverview(true)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <report.icon size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-500">{report.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{report.createdBy}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {report.charts.map((chart, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {chart}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ExternalLink size={16} className="text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <button
                onClick={() => setShowOverview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Reports
              </button>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900">Care Delivery Overview</span>
            </div>
            <ProgramOverview />
          </>
        )}
      </div>
    </main>
  );
}

export default ReportsView;