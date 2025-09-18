import React from 'react';
import { DollarSign, FileText } from 'lucide-react';

function PaymentsView() {
  const payments = [
    {
      id: 'PMT-001',
      date: '2024-04-15',
      payer: 'TX Medicaid',
      amount: 4850.00,
      method: 'ACH',
      reference: 'ACH-123456',
      status: 'Received',
      claims: 12
    }
  ];

  return (
    <div>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{payment.id}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{payment.date}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{payment.payer}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{payment.method}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{payment.reference}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-900">{payment.claims}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {payment.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentsView;