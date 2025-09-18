import React, { useState } from 'react';
import { ChevronRight, AlertCircle, CheckCircle, X, DollarSign, FileText, Calendar, Clock } from 'lucide-react';
import { Claim, PayerType } from './types';
import DateRangeSelector from './DateRangeSelector';
import ShiftComplianceCheck from './ShiftComplianceCheck';
import ClaimPreviewCard from './ClaimPreviewCard';
import { BillingService } from './services/BillingService';

interface ClaimGenerationWizardProps {
  onClose: () => void;
  onGenerate: (claims: Claim[]) => void;
}

const steps = [
  {
    id: 'date-range',
    title: 'Select Date Range',
    description: 'Choose the billing period and how you want to group the claims',
    icon: Calendar
  },
  {
    id: 'shifts',
    title: 'Select Billable Shifts',
    description: 'Review and select compliant shifts to include in claims',
    icon: Clock
  },
  {
    id: 'review',
    title: 'Review Claims',
    description: 'Review generated claims before submission',
    icon: FileText
  }
];

function ClaimGenerationWizard({ onClose, onGenerate }: ClaimGenerationWizardProps) {
  const [currentStep, setCurrentStep] = useState(steps[0].id);
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<'payer' | 'client'>('payer');

  // Mock data - in real app, this would be fetched based on date range
  const shifts = [
    {
      id: 'shift-001',
      date: '2024-04-15',
      time: '9:00 AM - 5:00 PM',
      client: 'John Smith',
      clientId: 'client-001',
      caregiver: 'Jane Doe, RN',
      payer: 'TX Medicaid',
      payerId: 'payer-001',
      payerType: 'Medicaid' as PayerType,
      rate: 45.00,
      hours: 8,
      amount: 360.00,
      status: 'Ready',
      complianceStatus: {
        evv: true,
        credentials: true,
        planOfCare: true
      }
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedShifts(shifts.filter(s => 
        Object.values(s.complianceStatus).every(status => status)
      ).map(s => s.id));
    } else {
      setSelectedShifts([]);
    }
  };

  const handleShiftSelect = (shiftId: string, checked: boolean) => {
    if (checked) {
      setSelectedShifts([...selectedShifts, shiftId]);
    } else {
      setSelectedShifts(selectedShifts.filter(id => id !== shiftId));
    }
  };

  const handleGenerate = () => {
    const selectedShiftData = shifts.filter(s => selectedShifts.includes(s.id));
    const claims = BillingService.generateClaims(selectedShiftData, groupBy);
    onGenerate(claims);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'date-range':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Select Date Range</h3>
              <DateRangeSelector
                startDate={dateRange.start}
                endDate={dateRange.end}
                onChange={setDateRange}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Group Claims By</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setGroupBy('payer')}
                  className={`flex-1 p-4 rounded-lg border ${
                    groupBy === 'payer'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium mb-1">Payer</h4>
                  <p className="text-sm text-gray-500">Group shifts by insurance or payment source</p>
                </button>
                <button
                  onClick={() => setGroupBy('client')}
                  className={`flex-1 p-4 rounded-lg border ${
                    groupBy === 'client'
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="font-medium mb-1">Client</h4>
                  <p className="text-sm text-gray-500">Group shifts by individual client</p>
                </button>
              </div>
            </div>
          </div>
        );

      case 'shifts':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Billable Shifts</h3>
            <div className="border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedShifts.length === shifts.length}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caregiver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedShifts.includes(shift.id)}
                          onChange={(e) => handleShiftSelect(shift.id, e.target.checked)}
                          disabled={!Object.values(shift.complianceStatus).every(status => status)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{shift.date}</div>
                        <div className="text-sm text-gray-500">{shift.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{shift.client}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shift.caregiver}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{shift.payer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">${shift.amount.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <ShiftComplianceCheck
                          checks={Object.entries(shift.complianceStatus).map(([type, status]) => ({
                            type,
                            status: status ? 'Pass' : 'Fail',
                            message: status ? 'OK' : 'Failed'
                          }))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'review':
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Review Claims</h3>
            <div className="space-y-4">
              {Object.entries(
                shifts
                  .filter(s => selectedShifts.includes(s.id))
                  .reduce((acc, shift) => {
                    const key = groupBy === 'payer' ? shift.payer : shift.client;
                    if (!acc[key]) {
                      acc[key] = {
                        shifts: [],
                        total: 0
                      };
                    }
                    acc[key].shifts.push(shift);
                    acc[key].total += shift.amount;
                    return acc;
                  }, {} as Record<string, { shifts: typeof shifts; total: number }>)
              ).map(([key, group]) => (
                <ClaimPreviewCard
                  key={key}
                  claim={{
                    id: 'preview',
                    type: group.shifts[0].payerType === 'Private Pay' ? 'invoice' : 'claim',
                    shiftIds: group.shifts.map(s => s.id),
                    clientId: group.shifts[0].clientId,
                    clientName: group.shifts[0].client,
                    payerId: group.shifts[0].payerId,
                    payerName: group.shifts[0].payer,
                    payerType: group.shifts[0].payerType,
                    amount: group.total,
                    status: 'Ready'
                  }}
                  shifts={group.shifts}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Generate Claims</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep === step.id
                      ? 'bg-purple-600 text-white'
                      : currentStepIndex > index
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${
                      currentStepIndex > index ? 'bg-green-100' : 'bg-gray-100'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {renderStepContent()}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            {currentStepIndex > 0 && (
              <button
                onClick={() => setCurrentStep(steps[currentStepIndex - 1].id)}
                className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (currentStepIndex < steps.length - 1) {
                  setCurrentStep(steps[currentStepIndex + 1].id);
                } else {
                  handleGenerate();
                }
              }}
              disabled={currentStep === 'shifts' && selectedShifts.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentStep === 'review' ? (
                <>
                  <FileText size={16} />
                  Generate Claims
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimGenerationWizard;