import React, { useState } from 'react';
import { Calendar, DollarSign, Clock, User, Download, Plus, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

interface CareExpense {
  id: string;
  date: string;
  teamMemberId: string;
  teamMemberName: string;
  hoursWorked: number;
  hourlyRate?: number;
  totalAmount: number;
  category: 'caregiver_payment' | 'medical_expense' | 'supplies' | 'transportation' | 'other';
  description: string;
  status: 'pending' | 'paid' | 'reimbursed';
  receiptUrl?: string;
}

// Mock data - in real implementation this would come from context
const mockExpenses: CareExpense[] = [
  {
    id: 'exp-001',
    date: '2024-08-29',
    teamMemberId: 'tm-001',
    teamMemberName: 'Jim Nelson, RN',
    hoursWorked: 8,
    hourlyRate: 35,
    totalAmount: 280,
    category: 'caregiver_payment',
    description: 'Regular day shift - medication management, vital signs',
    status: 'pending'
  },
  {
    id: 'exp-002', 
    date: '2024-08-28',
    teamMemberId: 'tm-002',
    teamMemberName: 'Jennifer Walsh',
    hoursWorked: 12,
    hourlyRate: 28,
    totalAmount: 336,
    category: 'caregiver_payment',
    description: 'Overnight shift - personal care, safety monitoring',
    status: 'paid'
  },
  {
    id: 'exp-003',
    date: '2024-08-28',
    teamMemberId: '',
    teamMemberName: 'Medical Supply',
    hoursWorked: 0,
    totalAmount: 45.99,
    category: 'medical_expense',
    description: 'Blood pressure monitor replacement',
    status: 'reimbursed'
  }
];

function ExpenseTracker() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('This Month');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const careContext = useCareCoordination();

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      expense.teamMemberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
  const pendingPayments = filteredExpenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.totalAmount, 0);
  const totalHours = filteredExpenses.reduce((sum, exp) => sum + exp.hoursWorked, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'caregiver_payment': return 'bg-purple-100 text-purple-800';
      case 'medical_expense': return 'bg-red-100 text-red-800';
      case 'supplies': return 'bg-blue-100 text-blue-800';
      case 'transportation': return 'bg-green-100 text-green-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'reimbursed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'caregiver_payment': return 'Caregiver Payment';
      case 'medical_expense': return 'Medical Expense';
      case 'supplies': return 'Care Supplies';
      case 'transportation': return 'Transportation';
      case 'other': return 'Other';
      default: return category;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Care Expenses</h1>
            <p className="text-gray-600">Track payments and care-related expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total This Month</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">${totalExpenses.toFixed(2)}</div>
              <DollarSign size={20} className="text-purple-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Pending Payments</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">${pendingPayments.toFixed(2)}</div>
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Care Hours</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-blue-600">{totalHours}</div>
              <Clock size={20} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Average Hourly</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold">
                ${totalHours > 0 ? (filteredExpenses.filter(exp => exp.hoursWorked > 0).reduce((sum, exp) => sum + exp.totalAmount, 0) / totalHours).toFixed(2) : '0.00'}
              </div>
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 flex items-center gap-4">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Calendar size={16} />
              {timeRange}
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search expenses or team members"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Category
            </button>
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              Status
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Filter size={20} />
            </button>
          </div>

          {/* Expenses Table */}
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr 
                  key={expense.id} 
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {expense.teamMemberName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{expense.description}</div>
                    {expense.receiptUrl && (
                      <div className="text-xs text-blue-600 mt-1">📎 Receipt attached</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                      {getCategoryDisplayName(expense.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.hoursWorked > 0 ? `${expense.hoursWorked} hrs` : '-'}
                    {expense.hourlyRate && (
                      <div className="text-xs text-gray-500">@${expense.hourlyRate}/hr</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${expense.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default ExpenseTracker;