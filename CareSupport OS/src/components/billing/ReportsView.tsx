import React from 'react';
import { BarChart3, PieChart, FileText } from 'lucide-react';

function ReportsView() {
  const reports = [
    {
      id: 'billing-summary',
      name: 'Billing Summary',
      description: 'Overview of claims, payments, and aging by payer',
      icon: BarChart3,
      lastRun: '1 hour ago'
    },
    {
      id: 'denial-analysis',
      name: 'Denial Analysis',
      description: 'Breakdown of claim denials by reason and resolution status',
      icon: PieChart,
      lastRun: '1 day ago'
    },
    {
      id: 'compliance-impact',
      name: 'Compliance Impact',
      description: 'How compliance issues affect billing and revenue',
      icon: FileText,
      lastRun: '1 week ago'
    }
  ];

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <button
          key={report.id}
          className="w-full bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 text-left flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <report.icon size={24} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{report.description}</p>
            <p className="text-xs text-gray-400 mt-2">Last generated: {report.lastRun}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

export default ReportsView;