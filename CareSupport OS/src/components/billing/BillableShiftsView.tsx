import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

function BillableShiftsView() {
  const shifts = [
    {
      id: 'shift-001',
      date: '2024-04-15',
      time: '9:00 AM - 5:00 PM',
      client: 'John Smith',
      caregiver: 'Jane Doe, RN',
      payer: 'TX Medicaid',
      rate: 45.00,
      hours: 8,
      amount: 360.00,
      status: 'Ready',
      complianceStatus: {
        evv: true,
        credentials: true,
        planOfCare: true
      }
    },
    {
      id: 'shift-002',
      date: '2024-04-15',
      time: '2:00 PM - 6:00 PM',
      client: 'Mary Johnson',
      caregiver: 'Robert Wilson, CNA',
      payer: 'Private Pay',
      rate: 35.00,
      hours: 4,
      amount: 140.00,
      status: 'Flagged',
      complianceStatus: {
        evv: false,
        credentials: true,
        planOfCare: true
      }
    }
  ];

  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caregiver</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shifts.map((shift) => (
            <tr key={shift.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{shift.date}</div>
                <div className="text-sm text-gray-500">{shift.time}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{shift.client}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{shift.caregiver}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{shift.payer}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{shift.hours}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">${shift.amount.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shift.status === 'Ready'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {shift.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">EVV</span>
                    {shift.complianceStatus.evv ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Cred</span>
                    {shift.complianceStatus.credentials ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">POC</span>
                    {shift.complianceStatus.planOfCare ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-red-500" />
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BillableShiftsView;