import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, DollarSign, FileText, Filter, Search, ChevronDown, Plus } from 'lucide-react';
import BillableShiftsView from './BillableShiftsView';
import DeniedClaimsView from './DeniedClaimsView';
import PaymentsView from './PaymentsView';
import ReportsView from './ReportsView';
import ClaimGenerationWizard from './ClaimGenerationWizard';

type BillingTab = 'billable' | 'denied' | 'payments' | 'reports';

function BillingView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BillingTab>('billable');
  const [dateRange, setDateRange] = useState('This Week (Apr 15 - Apr 21)');
  const [showGenerateWizard, setShowGenerateWizard] = useState(false);

  const stats = {
    readyToBill: 24,
    flaggedShifts: 3,
    pendingClaims: 12,
    totalAmount: 4850.00
  };

  const handleGenerateClaims = (claims: Claim[]) => {
    // In a real app, this would send the claims to the backend
    console.log('Generated claims:', claims);
    setShowGenerateWizard(false);
    // Optionally refresh the billable shifts list
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Billing</h1>
            <p className="text-gray-600">Manage claims and payments</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <FileText size={16} />
              Export Claims
            </button>
            <button 
              onClick={() => setShowGenerateWizard(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Generate Claims
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Ready to Bill</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">{stats.readyToBill}</div>
              <Clock size={20} className="text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Flagged Shifts</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">{stats.flaggedShifts}</div>
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Pending Claims</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">{stats.pendingClaims}</div>
              <FileText size={20} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Amount</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">${stats.totalAmount.toLocaleString()}</div>
              <DollarSign size={20} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-4">
              <button
                onClick={() => setActiveTab('billable')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'billable'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Billable Shifts
              </button>
              <button
                onClick={() => setActiveTab('denied')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'denied'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Denied Claims
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'payments'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payments
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'reports'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Reports
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                {dateRange}
                <ChevronDown size={16} />
              </button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by client, caregiver, or claim ID"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                Payer
                <ChevronDown size={16} />
              </button>
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                Status
                <ChevronDown size={16} />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'billable' && <BillableShiftsView />}
            {activeTab === 'denied' && <DeniedClaimsView />}
            {activeTab === 'payments' && <PaymentsView />}
            {activeTab === 'reports' && <ReportsView />}
          </div>
        </div>
      </div>

      {showGenerateWizard && (
        <ClaimGenerationWizard
          onClose={() => setShowGenerateWizard(false)}
          onGenerate={handleGenerateClaims}
        />
      )}
    </main>
  );
}

export default BillingView;