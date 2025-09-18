import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';

function DeniedClaimsView() {
  const deniedClaims = [
    {
      id: 'CLM-001',
      date: '2024-04-10',
      client: 'John Smith',
      payer: 'TX Medicaid',
      amount: 360.00,
      denialCode: 'CO-16',
      denialReason: 'Missing EVV verification',
      status: 'Denied',
      resolution: 'Upload EVV logs'
    }
  ];

  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denial Code</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {deniedClaims.map((claim) => (
            <tr key={claim.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{claim.id}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{claim.date}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{claim.client}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{claim.payer}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">${claim.amount.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{claim.denialCode}</div>
                    <div className="text-sm text-gray-500">{claim.denialReason}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {claim.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  {claim.resolution}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeniedClaimsView;