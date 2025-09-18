import React, { useState } from 'react';
import { 
  ArrowLeft, Search, ChevronDown, Plus, Filter, Clock, AlertCircle, Users, 
  Book, Download, Eye, Video, Star, Trophy, X, Play, CheckCircle, FileText,
  ExternalLink, ChevronRight, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGuideProgress } from './hooks/useGuideProgress';

interface SetupGuide {
  id: string;
  title: string;
  description: string;
  category: 'Agency Setup' | 'Client Management' | 'Caregiver Management' | 'Compliance' | 'Billing';
  estimatedTime: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  steps: {
    title: string;
    description: string;
    action: {
      label: string;
      path: string;
    };
    videoUrl?: string;
  }[];
  resources: {
    type: 'guide' | 'template';
    title: string;
    description: string;
    path: string;
  }[];
}

const setupGuides: SetupGuide[] = [
  {
    id: 'agency-setup',
    title: 'Agency Setup Guide',
    description: 'Configure your agency profile, service area, and team settings',
    category: 'Agency Setup',
    estimatedTime: '30 min',
    status: 'Not Started',
    steps: [
      {
        title: 'Agency Profile',
        description: 'Enter your agency details and service area information',
        action: {
          label: 'Complete Profile',
          path: '/admin/agency'
        },
        videoUrl: '/videos/agency-setup'
      },
      {
        title: 'Team Management',
        description: 'Add team members and configure user roles',
        action: {
          label: 'Manage Team',
          path: '/admin/users'
        }
      }
    ],
    resources: [
      {
        type: 'guide',
        title: 'Agency Setup Guide',
        description: 'Step-by-step guide to configuring your agency',
        path: '/resources/guides/agency-setup'
      },
      {
        type: 'template',
        title: 'Setup Checklist',
        description: 'Track your setup progress',
        path: '/resources/templates/setup-checklist'
      }
    ]
  },
  {
    id: 'compliance-setup',
    title: 'Compliance Setup Guide',
    description: 'Set up your compliance frameworks, policies, and documentation requirements',
    category: 'Compliance',
    estimatedTime: '45 min',
    status: 'Not Started',
    steps: [
      {
        title: 'Framework Selection',
        description: 'Choose the compliance frameworks that apply to your agency',
        action: {
          label: 'Select Frameworks',
          path: '/compliance'
        }
      },
      {
        title: 'Policy Setup',
        description: 'Configure agency policies and procedures',
        action: {
          label: 'Manage Policies',
          path: '/compliance/policies'
        }
      }
    ],
    resources: [
      {
        type: 'guide',
        title: 'Compliance Guide',
        description: 'Understanding compliance requirements',
        path: '/resources/guides/compliance'
      },
      {
        type: 'template',
        title: 'Policy Templates',
        description: 'Ready-to-use policy templates',
        path: '/resources/templates/policies'
      }
    ]
  },
  // Add other guides...
];

const categories = [
  { name: 'All Categories', count: setupGuides.length },
  { name: 'Agency Setup', count: setupGuides.filter(g => g.category === 'Agency Setup').length },
  { name: 'Compliance', count: setupGuides.filter(g => g.category === 'Compliance').length },
  { name: 'Client Management', count: setupGuides.filter(g => g.category === 'Client Management').length },
  { name: 'Caregiver Management', count: setupGuides.filter(g => g.category === 'Caregiver Management').length },
  { name: 'Billing', count: setupGuides.filter(g => g.category === 'Billing').length }
];

function GuideDetailModal({ guide, onClose }: { guide: SetupGuide; onClose: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const { 
    status,
    completedSteps,
    progress,
    completeStep,
    isStepCompleted,
    markComplete
  } = useGuideProgress(guide.id);

  const handleCompleteStep = (stepIndex: number) => {
    completeStep(stepIndex);
  };

  return (
    <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-purple-600">{guide.category}</span>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">{guide.estimatedTime}</span>
              </div>
              <h2 className="text-xl font-semibold">{guide.title}</h2>
              <p className="text-gray-600 mt-1">{guide.description}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {guide.steps.map((step, index) => {
              const isCompleted = completedSteps.includes(index);
              const isActive = activeStep === index;

              return (
                <div 
                  key={index}
                  className={`relative flex gap-4 ${
                    isActive ? 'opacity-100' : 'opacity-60'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-100'
                        : isActive
                        ? 'bg-purple-100'
                        : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-purple-600' : 'text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    {index < guide.steps.length - 1 && (
                      <div className="absolute top-8 left-4 bottom-0 w-px bg-gray-200" />
                    )}
                  </div>

                  <div className="flex-1 pb-8">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="font-medium mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{step.description}</p>

                      <div className="flex items-center gap-4">
                        <a
                          href={step.action.path}
                          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                            isCompleted
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle size={16} />
                              Completed
                            </>
                          ) : (
                            <>
                              <ChevronRight size={16} />
                              {step.action.label}
                            </>
                          )}
                        </a>
                        {step.videoUrl && (
                          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                            <Video size={16} />
                            <span>Watch Tutorial</span>
                          </button>
                        )}
                        {!isCompleted && (
                          <button
                            onClick={() => handleCompleteStep(index)}
                            className="text-purple-600 hover:text-purple-700 text-sm"
                          >
                            Mark as complete
                          </button>
                        )}
                      </div>
                    </div>

                    {isActive && guide.resources.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Helpful Resources</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {guide.resources.map((resource, resourceIndex) => (
                            <a
                              key={resourceIndex}
                              href={resource.path}
                              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
                            >
                              {resource.type === 'guide' ? (
                                <Book size={20} className="text-purple-600" />
                              ) : (
                                <Download size={20} className="text-purple-600" />
                              )}
                              <div>
                                <div className="font-medium group-hover:text-purple-600">
                                  {resource.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {resource.description}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress sidebar */}
      <div className="w-80 border-l border-gray-200 p-6 overflow-auto">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Progress</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    className="text-gray-100"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="32"
                    cy="32"
                  />
                  <circle
                    className="text-purple-600"
                    strokeWidth="4"
                    strokeDasharray={188.5}
                    strokeDashoffset={188.5 * (1 - progress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="30"
                    cx="32"
                    cy="32"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-lg font-semibold">{progress}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Steps completed</div>
                <div className="font-medium">{completedSteps.length} of {guide.steps.length}</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Time</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>{guide.estimatedTime} remaining</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Achievements</h3>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                progress >= 25 ? 'bg-purple-50' : 'bg-gray-50'
              }`}>
                <Trophy size={16} className={progress >= 25 ? 'text-purple-600' : 'text-gray-400'} />
                <div>
                  <div className="text-sm font-medium">First Steps</div>
                  <div className="text-xs text-gray-500">Complete 25% of the guide</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                progress >= 50 ? 'bg-purple-50' : 'bg-gray-50'
              }`}>
                <Star size={16} className={progress >= 50 ? 'text-purple-600' : 'text-gray-400'} />
                <div>
                  <div className="text-sm font-medium">Halfway There</div>
                  <div className="text-xs text-gray-500">Complete 50% of the guide</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                progress === 100 ? 'bg-purple-50' : 'bg-gray-50'
              }`}>
                <Trophy size={16} className={progress === 100 ? 'text-purple-600' : 'text-gray-400'} />
                <div>
                  <div className="text-sm font-medium">Setup Master</div>
                  <div className="text-xs text-gray-500">Complete all guide steps</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Need Help?</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Schedule setup call
              </button>
              <a 
                href="/resources/knowledge-base"
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <ExternalLink size={16} />
                <span>View documentation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GettingStartedView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedGuide, setSelectedGuide] = useState<SetupGuide | null>(null);

  const filteredGuides = setupGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>
        </div>

        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Getting Started with CareSupport.com</h1>
            <p className="text-gray-600 mt-2">
              Follow these guides to set up your agency and start delivering care
            </p>
          </div>
          <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            Schedule setup call
          </button>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Setup Progress</div>
            <div className="text-2xl font-semibold">20%</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: '20%' }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Estimated Time</div>
            <div className="text-2xl font-semibold">2h</div>
            <div className="text-sm text-gray-500 mt-2">Total setup time</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Guides Completed</div>
            <div className="text-2xl font-semibold">1/5</div>
            <div className="text-sm text-gray-500 mt-2">Setup guides</div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Categories</h2>
              </div>
              <div className="p-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                      selectedCategory === category.name
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={selectedCategory === category.name ? 'text-purple-600' : 'text-gray-400'}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search guides..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {filteredGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-purple-600">{guide.category}</span>
                            <span className="text-gray-300">·</span>
                            <span className="text-sm text-gray-500">{guide.estimatedTime}</span>
                          </div>
                          <h3 className="font-medium mb-2">{guide.title}</h3>
                          <p className="text-gray-600 text-sm">{guide.description}</p>
                          
                          <div className="flex items-center gap-4 mt-4">
                            <button
                              onClick={() => setSelectedGuide(guide)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                              Start Guide
                            </button>
                            {guide.steps[0].videoUrl && (
                              <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
                                <Play size={16} />
                                <span>Watch Overview</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            guide.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : guide.status === 'In Progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {guide.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GuideDetailModal guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
        </div>
      )}
    </main>
  );
}

export default GettingStartedView;