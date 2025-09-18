import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, Download, Plus, Filter, FileText, Download as DownloadIcon, Eye, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ResourcePreviewModal from './ResourcePreviewModal';

// Update the mock data to include better documentation links and descriptions
const resources = [
  {
    id: 'onboarding-checklist',
    name: 'New Caregiver Onboarding Checklist',
    description: 'Comprehensive checklist for onboarding new caregivers, including required documentation and training.',
    category: 'Onboarding',
    format: 'PDF',
    lastUpdated: '2024-04-15',
    size: '245 KB',
    documentation: {
      title: 'How to Use the Onboarding Checklist',
      description: 'Step-by-step guide for completing the onboarding process',
      url: '/resources/knowledge-base/caregiver-onboarding'
    },
    downloadUrl: '#',
    metadata: {
      author: 'HR Team',
      lastModifiedBy: 'Jane Smith',
      tags: ['onboarding', 'checklist', 'documentation'],
      views: 156,
      downloads: 45,
      comments: 3
    },
    versions: [
      {
        version: 'v2.1',
        date: '2024-04-15',
        changes: 'Updated compliance requirements'
      },
      {
        version: 'v2.0',
        date: '2024-03-01',
        changes: 'Major revision with new sections'
      },
      {
        version: 'v1.0',
        date: '2024-01-15',
        changes: 'Initial version'
      }
    ]
  },
  {
    id: 'care-plan-template',
    name: 'Plan-of-Care Template',
    description: 'Standardized template for creating detailed client care plans with task lists and schedules.',
    category: 'Plan-of-Care',
    format: 'DOCX',
    lastUpdated: '2024-04-14',
    size: '380 KB',
    documentation: {
      title: 'How to Use the Care Plan Template',
      description: 'Step-by-step guide for creating care plans',
      url: '/resources/knowledge-base/care-plan-setup'
    },
    downloadUrl: '#',
    metadata: {
      author: 'Clinical Team',
      lastModifiedBy: 'Dr. Sarah Johnson',
      tags: ['care-plan', 'template', 'documentation'],
      views: 234,
      downloads: 89,
      comments: 5
    }
  },
  {
    id: 'evv-checklist',
    name: 'EVV Troubleshooting Flowchart',
    description: 'Step-by-step guide for resolving common EVV verification issues.',
    category: 'EVV',
    format: 'PDF',
    lastUpdated: '2024-04-13',
    size: '156 KB',
    documentation: {
      title: 'How to Use the EVV Troubleshooting Guide',
      description: 'Guide for resolving EVV issues',
      url: '/resources/knowledge-base/evv-requirements'
    },
    downloadUrl: '#',
    metadata: {
      author: 'Tech Support',
      lastModifiedBy: 'Mike Chen',
      tags: ['evv', 'troubleshooting', 'compliance'],
      views: 312,
      downloads: 145,
      comments: 8
    }
  },
  {
    id: 'billing-checklist',
    name: 'Billing Cycle End Checklist',
    description: 'Monthly checklist for verifying billing compliance and claim readiness.',
    category: 'Billing & Claims',
    format: 'XLSX',
    lastUpdated: '2024-04-12',
    size: '275 KB',
    documentation: {
      title: 'How to Use the Billing Checklist',
      description: 'Guide for completing billing cycle verification',
      url: '/resources/knowledge-base/billing-cycle'
    },
    downloadUrl: '#',
    metadata: {
      author: 'Finance Team',
      lastModifiedBy: 'Lisa Thompson',
      tags: ['billing', 'compliance', 'checklist'],
      views: 189,
      downloads: 67,
      comments: 2
    }
  },
  {
    id: 'incident-report',
    name: 'Incident Report Form',
    description: 'Standard form for documenting and reporting client incidents or accidents.',
    category: 'Compliance',
    format: 'PDF',
    lastUpdated: '2024-04-11',
    size: '198 KB',
    documentation: {
      title: 'How to Use the Incident Report Form',
      description: 'Guide for incident documentation and reporting',
      url: '/resources/knowledge-base/incident-reporting'
    },
    downloadUrl: '#',
    metadata: {
      author: 'Quality Assurance',
      lastModifiedBy: 'Robert Davis',
      tags: ['incident', 'reporting', 'safety'],
      views: 145,
      downloads: 34,
      comments: 1
    }
  }
];

const categories = [
  { name: 'All Categories', count: resources.length },
  { name: 'Onboarding', count: resources.filter(r => r.category === 'Onboarding').length },
  { name: 'Plan-of-Care', count: resources.filter(r => r.category === 'Plan-of-Care').length },
  { name: 'EVV', count: resources.filter(r => r.category === 'EVV').length },
  { name: 'Billing & Claims', count: resources.filter(r => r.category === 'Billing & Claims').length },
  { name: 'Compliance', count: resources.filter(r => r.category === 'Compliance').length }
];

const formats = ['All Formats', 'PDF', 'DOCX', 'XLSX'];

function ResourceLibraryView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormat, setSelectedFormat] = useState('All Formats');
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [previewResource, setPreviewResource] = useState<typeof resources[0] | null>(null);

  const handleSelectResource = (resourceId: string) => {
    setSelectedResources(prev => {
      if (prev.includes(resourceId)) {
        return prev.filter(id => id !== resourceId);
      }
      return [...prev, resourceId];
    });
  };

  const handleBulkDownload = () => {
    // In a real app, this would trigger downloads of selected resources
    console.log('Downloading resources:', selectedResources);
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || resource.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All Formats' || resource.format === selectedFormat;
    return matchesSearch && matchesCategory && matchesFormat;
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

        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">Resource Library</h1>
              <p className="text-gray-600 mt-2">Download templates, forms, and checklists for your agency</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedResources.length > 0 && (
                <button 
                  onClick={handleBulkDownload}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <DownloadIcon size={16} />
                  Download Selected ({selectedResources.length})
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0 space-y-6">
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
                    <span className={`${
                      selectedCategory === category.name
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }`}>{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Format</h2>
              </div>
              <div className="p-2">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedFormat === format
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {format}
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
                      type="search"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                      role="search"
                    />
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Filter size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <div className="grid gap-4">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText size={16} className="text-purple-600" />
                            <span className="text-sm text-purple-600">{resource.category}</span>
                          </div>
                          <h3 className="font-medium mb-2">{resource.name}</h3>
                          <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div>
                              <span>{resource.format} · {resource.size}</span>
                            </div>
                            <div>
                              <span>Updated {resource.lastUpdated}</span>
                            </div>
                            {resource.metadata && (
                              <>
                                <div>
                                  <span>{resource.metadata.views} views</span>
                                </div>
                                <div>
                                  <span>{resource.metadata.downloads} downloads</span>
                                </div>
                              </>
                            )}
                          </div>
                          {resource.metadata?.tags && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {resource.metadata.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => setPreviewResource(resource)}
                            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye size={16} />
                            Preview
                          </button>
                          <a
                            href={resource.documentation.url}
                            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2 group"
                            title={`View guide: ${resource.documentation.title}`}
                          >
                            <Book size={16} className="text-gray-400 group-hover:text-gray-600" />
                            <span>How to Use</span>
                          </a>
                          <button
                            onClick={() => handleSelectResource(resource.id)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                          >
                            <Download size={16} />
                            {selectedResources.includes(resource.id) ? 'Selected' : 'Download'}
                          </button>
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

      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
          onDownload={() => {
            handleSelectResource(previewResource.id);
            handleBulkDownload();
          }}
        />
      )}
    </main>
  );
}

export default ResourceLibraryView;