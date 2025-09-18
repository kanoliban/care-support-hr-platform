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
import { useCareCoordination } from '../../contexts/CareCoordinationContext';

function CareStandardsView() {
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
      title: 'Care Documentation',
      description: 'Daily care logs and incident reporting',
      category: 'documentation',
      status: 'compliant',
      lastChecked: '2024-08-26',
      nextDue: '2024-09-02',
      assignedTo: 'Professional Caregivers'
    },
    {
      id: '4',
      title: 'Safety Protocols',
      description: 'Fall prevention and home safety measures',
      category: 'safety',
      status: 'needs_review',
      lastChecked: '2024-08-15',
      nextDue: '2024-08-29',
      assignedTo: 'Linda Martinez'
    },
    {
      id: '5',
      title: 'Personal Hygiene Standards',
      description: 'Bathing, grooming, and personal care requirements',
      category: 'personal_care',
      status: 'compliant',
      lastChecked: '2024-08-24',
      nextDue: '2024-08-31',
      assignedTo: 'Family Caregivers'
    }
  ];

  const careGuides = [
    {
      id: '1',
      title: 'Dementia Care Best Practices',
      description: 'Evidence-based approaches for caring for individuals with dementia',
      category: 'medical',
      lastUpdated: '2024-08-20',
      readTime: '15 min',
      type: 'guide'
    },
    {
      id: '2',
      title: 'Safe Transfer Techniques',
      description: 'Proper body mechanics for moving and transferring care recipients',
      category: 'safety',
      lastUpdated: '2024-08-18',
      readTime: '10 min',
      type: 'video'
    },
    {
      id: '3',
      title: 'Medication Administration Checklist',
      description: 'Step-by-step checklist for safe medication administration',
      category: 'medical',
      lastUpdated: '2024-08-22',
      readTime: '5 min',
      type: 'checklist'
    },
    {
      id: '4',
      title: 'Emergency Response Protocols',
      description: 'What to do in medical emergencies and how to contact help',
      category: 'emergency',
      lastUpdated: '2024-08-15',
      readTime: '20 min',
      type: 'guide'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'needs_attention': return 'bg-red-100 text-red-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle size={16} className="text-green-600" />;
      case 'needs_attention': return <AlertTriangle size={16} className="text-red-600" />;
      case 'needs_review': return <Clock size={16} className="text-yellow-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medical': return <User size={16} className="text-red-600" />;
      case 'emergency': return <Phone size={16} className="text-orange-600" />;
      case 'documentation': return <FileText size={16} className="text-blue-600" />;
      case 'safety': return <Shield size={16} className="text-purple-600" />;
      case 'personal_care': return <Users size={16} className="text-pink-600" />;
      default: return <BookOpen size={16} className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Calendar size={16} className="text-blue-600" />;
      case 'checklist': return <CheckCircle size={16} className="text-green-600" />;
      case 'guide': return <BookOpen size={16} className="text-purple-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'medical', label: 'Medical' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'safety', label: 'Safety' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'personal_care', label: 'Personal Care' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? complianceItems 
    : complianceItems.filter(item => item.category === selectedCategory);

  const filteredGuides = selectedCategory === 'all' 
    ? careGuides 
    : careGuides.filter(guide => guide.category === selectedCategory);

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Shield size={28} className="text-red-600" />
            Care Standards
          </h1>
          <p className="text-gray-600">Monitor compliance requirements, care protocols, and quality standards</p>
        </header>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('standards')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'standards'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield size={16} />
                Compliance Standards
              </button>
              <button
                onClick={() => setActiveTab('guides')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'guides'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BookOpen size={16} />
                Care Guides & Resources
              </button>
            </nav>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'standards' && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-green-600">3</div>
                    <div className="text-sm text-gray-600">Compliant</div>
                  </div>
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-red-600">1</div>
                    <div className="text-sm text-gray-600">Need Attention</div>
                  </div>
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-yellow-600">1</div>
                    <div className="text-sm text-gray-600">Need Review</div>
                  </div>
                  <Clock size={24} className="text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold text-gray-900">85%</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                  <Shield size={24} className="text-gray-600" />
                </div>
              </div>
            </div>

            {/* Compliance Items */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Compliance Standards</h2>
                <p className="text-gray-600 text-sm">Monitor and track care quality requirements</p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredItems.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{item.title}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusIcon(item.status)}
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              {item.assignedTo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              Last checked: {new Date(item.lastChecked).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              Next due: {new Date(item.nextDue).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'guides' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search care guides and resources..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Care Guides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGuides.map(guide => (
                <div key={guide.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(guide.type)}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        guide.category === 'medical' ? 'bg-red-100 text-red-800' :
                        guide.category === 'safety' ? 'bg-purple-100 text-purple-800' :
                        guide.category === 'emergency' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {guide.category}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{guide.readTime}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Updated {new Date(guide.lastUpdated).toLocaleDateString()}
                    </span>
                    <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      View Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={20} className="text-blue-600" />
                <h3 className="font-medium text-blue-900">Quick Care Tips</h3>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <div>• Always wash hands before and after providing care</div>
                <div>• Document all care activities and observations</div>
                <div>• Maintain dignity and respect in all interactions</div>
                <div>• Report any changes in condition immediately</div>
                <div>• Follow medication schedules precisely</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default CareStandardsView;