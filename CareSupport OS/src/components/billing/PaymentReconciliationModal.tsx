import React, { useState } from 'react';
import { X, DollarSign, AlertCircle, ChevronDown } from 'lucide-react';
import { Payment, Claim } from './types';

interface PaymentReconciliationModalProps {
  payment: Payment;
  onClose: () => void;
  onSave: (payment: Payment) => void;
}

function PaymentReconciliationModal({ payment, onClose, onSave }: PaymentReconciliationModalProps) {
  const [allocations, setAllocations] = useState(
    payment.claims.map(claim => ({
      claimId: claim.claimId,
      amount: claim.amount,
      adjustments: claim.adjustments || []
    }))
  );

  const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.amount, 0);
  const unallocated = payment.amount - totalAllocated;

  const handleAllocationChange = (claimId: string, amount: number) => {
    setAllocations(prev => 
      prev.map(alloc => 
        alloc.claimId === claimId 
          ? { ...alloc, amount } 
          : alloc
      )
    );
  };

  const handleSave = () => {
    onSave({
      ...payment,
      claims: allocations
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Payment Reconciliation</h2>
              <p className="text-sm text-gray-500">Payment ID: {payment.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-500">Total Payment</div>
                <div className="text-2xl font-semibold">${payment.amount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Unallocated</div>
                <div className={`text-2xl font-semibold ${unallocated !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${unallocated.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {allocations.map((allocation) => (
              <div key={allocation.claimId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-medium">Claim {allocation.claimId}</div>
                    <div className="text-sm text-gray-500">Original Amount: ${allocation.amount.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Paid Amount:</span>
                    <input
                      type="number"
                      value={allocation.amount}
                      onChange={(e) => handleAllocationChange(allocation.claimId, parseFloat(e.target.value))}
                      className="w-32 px-3 py-1 border border-gray-200 rounded"
                    />
                  </div>
                </div>

                {allocation.adjustments && allocation.adjustments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Adjustments</h4>
                    <div className="space-y-2">
                      {allocation.adjustments.map((adj, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-yellow-500" />
                            <span>{adj.description}</span>
                          </div>
                          <span className="text-red-600">-${adj.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="mt-4 text-purple-600 text-sm font-medium">
                  Add Adjustment
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={unallocated !== 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Save Allocations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReconciliationModal;