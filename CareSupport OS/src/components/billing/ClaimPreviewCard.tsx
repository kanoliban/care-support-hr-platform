import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { Claim } from './types';

interface ClaimPreviewCardProps {
  claim: Claim;
  shifts: any[];
}

function ClaimPreviewCard({ claim, shifts }: ClaimPreviewCardProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(claim.amount);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText size={20} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-medium">{claim.payerName}</h4>
            <p className="text-sm text-gray-500">{claim.type === 'claim' ? 'Insurance Claim' : 'Invoice'}</p>
            {claim.formType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                {claim.formType}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">{formattedAmount}</div>
          <p className="text-sm text-gray-500">{shifts.length} shifts</p>
        </div>
      </div>

      {claim.complianceFlags && claim.complianceFlags.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h5 className="text-sm font-medium text-yellow-800">Compliance Warnings</h5>
              <ul className="mt-1 text-sm text-yellow-700">
                {claim.complianceFlags.map((flag, index) => (
                  <li key={index}>{flag.issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {shifts.map(shift => (
          <div key={shift.id} className="flex justify-between text-sm">
            <div>
              <span className="font-medium">{shift.client}</span>
              <span className="text-gray-500"> · </span>
              <span className="text-gray-500">{shift.date}</span>
            </div>
            <span>${shift.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimPreviewCard;