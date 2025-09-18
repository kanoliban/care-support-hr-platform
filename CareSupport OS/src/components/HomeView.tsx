import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, AlertCircle, FileText, Users, Shield,
  Calendar, CreditCard, ChevronRight, Building2,
  BookOpen, CheckCircle, XCircle, ArrowRight
} from 'lucide-react';
import { useSystemSettings } from '../contexts/SystemSettingsContext';

function HomeView() {
  const navigate = useNavigate();
  const { settings } = useSystemSettings();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const stats = {
    shiftsToday: {
      total: 24,
      flagged: 3,
      missingEvv: 2
    },
    compliance: {
      controlsOk: 103,
      totalControls: 104,
      score: 95
    },
    claims: {
      pending: 12,
      denied: 4,
      total: 156
    },
    credentials: {
      expiringSoon: 3,
      expired: 1,
      total: 55
    }
  };

  const flaggedItems = [
    {
      id: 'shift-423',
      type: 'shift',
      issue: 'Caregiver license expired',
      priority: 'high',
      module: 'scheduling',
      time: '2 hours ago'
    },
    {
      id: 'claim-789',
      type: 'claim',
      issue: 'Missing EVV logs',
      priority: 'medium',
      module: 'billing',
      time: '4 hours ago'
    },
    {
      id: 'cred-112',
      type: 'credential',
      issue: 'Background check expires in 7 days',
      priority: 'low',
      module: 'caregivers',
      time: '1 day ago'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 'audit-001',
      title: 'Medicaid Audit',
      date: '2024-04-22',
      daysUntil: 7,
      type: 'audit',
      description: 'State health department compliance review'
    },
    {
      id: 'renewal-001',
      title: 'State License Renewal',
      date: '2024-05-01',
      daysUntil: 15,
      type: 'renewal',
      description: 'Agency license renewal deadline'
    }
  ];

  const getModuleUrl = (module: string) => {
    switch (module) {
      case 'scheduling': return '/schedule';
      case 'billing': return '/billing';
      case 'caregivers': return '/caregivers';
      case 'compliance': return '/compliance';
      default: return '/';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">
            {getTimeOfDay()}, {settings.agencyName}
          </h1>
          <p className="text-gray-600 mt-1">Here's your compliance and operations overview</p>
        </header>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => navigate('/compliance')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Compliance Health</div>
              <Shield size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">{stats.compliance.score}%</div>
            <div className="text-sm text-green-600">
              {stats.compliance.controlsOk}/{stats.compliance.totalControls} controls OK
            </div>
          </button>

          <button 
            onClick={() => navigate('/schedule')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Today's Shifts</div>
              <Clock size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">{stats.shiftsToday.total}</div>
            {(stats.shiftsToday.flagged > 0 || stats.shiftsToday.missingEvv > 0) && (
              <div className="text-sm text-red-600">
                {stats.shiftsToday.flagged} flagged · {stats.shiftsToday.missingEvv} missing EVV
              </div>
            )}
          </button>

          <button 
            onClick={() => navigate('/caregivers')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Credentials</div>
              <Users size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">{stats.credentials.expiringSoon + stats.credentials.expired}</div>
            <div className="text-sm text-yellow-600">
              {stats.credentials.expiringSoon} expiring soon · {stats.credentials.expired} expired
            </div>
          </button>

          <button 
            onClick={() => navigate('/billing')}
            className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500">Claims</div>
              <CreditCard size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-semibold mb-2">{stats.claims.pending}</div>
            {stats.claims.denied > 0 && (
              <div className="text-sm text-red-600">
                {stats.claims.denied} denied claims
              </div>
            )}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Flagged Items */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">Flagged Items</h2>
                <button 
                  onClick={() => navigate('/compliance/controls')}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  View all
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {flaggedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(getModuleUrl(item.module))}
                    className="w-full p-4 hover:bg-gray-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <AlertCircle size={16} className={getPriorityColor(item.priority)} />
                      <div className="text-left">
                        <div className="font-medium">{item.issue}</div>
                        <div className="text-sm text-gray-500">
                          {item.time} · ID: {item.id}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access Resources */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Quick Access</h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/resources/knowledge-base')}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={20} className="text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-purple-600">Knowledge Base</div>
                    <div className="text-sm text-gray-500">Documentation & guides</div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/resources/library')}
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium group-hover:text-purple-600">Resource Library</div>
                    <div className="text-sm text-gray-500">Templates & forms</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Upcoming Deadlines</h2>
              </div>
              <div className="p-4 space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-start gap-3">
                    <Calendar size={16} className="text-purple-600 mt-0.5" />
                    <div>
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-gray-500">
                        {deadline.description}
                      </div>
                      <div className="text-sm text-purple-600 mt-1">
                        {deadline.daysUntil} days remaining
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouraging Message */}
            {flaggedItems.length > 0 ? (
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-purple-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-700">
                      We can tackle these step by step—start with the {flaggedItems.length} top priority issues above.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      All flagged items cleared—great work maintaining compliance!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeView;