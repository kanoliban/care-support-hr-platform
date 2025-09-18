import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Calendar, 
  BookOpen, 
  Shield,
  Phone,
  Users,
  FileText,
  Search,
  Lightbulb
} from 'lucide-react';
import { useCareCoordination } from '../contexts/CareCoordinationContext';

function CareCompliance() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'standards' | 'guides'>('standards');
  
  const careContext = useCareCoordination();
  const { careRecipient } = careContext;

  // Mock compliance data - in real app would come from backend
  const complianceItems = [
    {
      id: '1',
      title: 'Medication Management',
      description: 'Proper storage, administration, and documentation of medications',
      category: 'medical',
      status: 'compliant',
      lastChecked: '2024-08-25',
      nextDue: '2024-09-01',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: '2',
      title: 'Emergency Procedures',
      description: 'Emergency contact information and response protocols',
      category: 'emergency',
      status: 'needs_attention',
      lastChecked: '2024-08-20',
      nextDue: '2024-08-30',
      assignedTo: 'All Team Members'
    },
    {
      id: '3',
      title: 'Fall Prevention',
      description: 'Environmental safety checks and mobility assistance',
      category: 'safety',
      status: 'overdue',
      lastChecked: '2024-08-15',
      nextDue: '2024-08-25',
      assignedTo: 'Mike Chen'
    },
    {
      id: '4',
      title: 'Care Documentation',
      description: 'Daily care logs and incident reporting',
      category: 'documentation',
      status: 'compliant',
      lastChecked: '2024-08-26',
      nextDue: '2024-09-02',
      assignedTo: 'Linda Rodriguez'
    },
    {
      id: '5',
      title: 'Infection Control',
      description: 'Hand hygiene and sanitization protocols',
      category: 'safety',
      status: 'compliant',
      lastChecked: '2024-08-24',
      nextDue: '2024-08-31',
      assignedTo: 'All Team Members'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? complianceItems 
    : complianceItems.filter(item => item.category === selectedCategory);

  const complianceStats = {
    total: complianceItems.length,
    compliant: complianceItems.filter(item => item.status === 'compliant').length,
    needsAttention: complianceItems.filter(item => item.status === 'needs_attention').length,
    overdue: complianceItems.filter(item => item.status === 'overdue').length
  };

  const overallScore = Math.round((complianceStats.compliant / complianceStats.total) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle size={16} />;
      case 'needs_attention':
        return <Clock size={16} />;
      case 'overdue':
        return <AlertTriangle size={16} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Care Standards & Resources</h1>
            <p className="text-gray-600">Quality standards, safety guidelines, and essential care resources</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-lg font-medium ${
              overallScore >= 90 ? 'bg-green-100 text-green-800' :
              overallScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {overallScore}% Compliant
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Standards</div>
            <div className="text-2xl font-semibold">{complianceStats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Compliant</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">{complianceStats.compliant}</div>
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Needs Attention</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">{complianceStats.needsAttention}</div>
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Overdue</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">{complianceStats.overdue}</div>
              <AlertTriangle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('standards')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'standards'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Standards & Compliance
            </button>
            <button
              onClick={() => setActiveTab('guides')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'guides'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Care Guides & Resources
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'standards' && (
          <div>
            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All Standards', count: complianceStats.total },
                  { key: 'safety', label: 'Safety', count: complianceItems.filter(i => i.category === 'safety').length },
                  { key: 'medical', label: 'Medical', count: complianceItems.filter(i => i.category === 'medical').length },
                  { key: 'documentation', label: 'Documentation', count: complianceItems.filter(i => i.category === 'documentation').length },
                  { key: 'emergency', label: 'Emergency', count: complianceItems.filter(i => i.category === 'emergency').length }
                ].map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Items */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          {item.lastChecked && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>Last checked: {new Date(item.lastChecked).toLocaleDateString()}</span>
                            </div>
                          )}
                          {item.nextDue && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>Next due: {new Date(item.nextDue).toLocaleDateString()}</span>
                            </div>
                          )}
                          {item.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>Assigned: {item.assignedTo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-medium capitalize">
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                        <button className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 font-medium">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Emergency Procedures */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Emergency Procedures</h3>
                  <p className="text-sm text-gray-600">Critical emergency response guides</p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/actions/emergency')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="font-medium text-gray-900">Emergency Contacts</div>
                  <div className="text-sm text-gray-600">Quick access to all emergency contacts</div>
                </button>
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <div className="font-medium text-red-900">Medical Emergency Steps</div>
                  <div className="text-sm text-red-700 mt-1">
                    1. Call 911 immediately<br/>
                    2. Contact primary emergency contact<br/>
                    3. Notify care coordinator<br/>
                    4. Document incident
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Quick Reference</h3>
                  <p className="text-sm text-gray-600">Essential care information</p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/care-recipient')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="font-medium text-gray-900">Care Profile</div>
                  <div className="text-sm text-gray-600">Medical conditions, medications, preferences</div>
                </button>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="font-medium text-green-900">Daily Care Essentials</div>
                  <div className="text-sm text-green-700 mt-1">
                    • Morning routine: 7:00 AM<br/>
                    • Medications: 8 AM, 2 PM, 8 PM<br/>
                    • Meals: 8 AM, 12 PM, 6 PM
                  </div>
                </div>
              </div>
            </div>

            {/* Care Team Tools */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Care Team Tools</h3>
                  <p className="text-sm text-gray-600">Communication and coordination</p>
                </div>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/schedule/team/contacts')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="font-medium text-gray-900">Team Contacts</div>
                  <div className="text-sm text-gray-600">Phone numbers and contact preferences</div>
                </button>
                <button 
                  onClick={() => navigate('/actions/update')}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="font-medium text-gray-900">Send Team Update</div>
                  <div className="text-sm text-gray-600">Communicate with the care team</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CareCompliance;