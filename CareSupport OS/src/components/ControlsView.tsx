import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ChevronDown, Plus, Filter, Clock, AlertCircle, FileText, 
  Shield, Building2, Book, Users, CheckCircle, XCircle, ChevronRight,
  ExternalLink, LayoutGrid, List, MoreHorizontal
} from 'lucide-react';

// Mock data based on compliance requirements
const controls = [
  {
    id: 'EVV-1',
    title: 'Time logs must match scheduled hours',
    description: 'Verify that caregiver clock-in/out times align with scheduled shift hours within acceptable variance.',
    owner: 'System',
    source: 'CareSupport',
    frameworks: ['EVV'],
    tests: '2/2',
    status: 'OK',
    framework: 'EVV',
    category: 'Verification',
    lastChecked: '2024-04-15',
    checks: [
      { name: 'Time Variance Check', status: 'Pass' },
      { name: 'Schedule Match', status: 'Pass' }
    ]
  },
  {
    id: 'EVV-2',
    title: 'Every shift must have a verified location ping',
    description: 'Ensure GPS location data or telephony verification is recorded for each visit.',
    owner: 'System',
    source: 'CareSupport',
    frameworks: ['EVV'],
    tests: '1/2',
    status: 'Failing',
    framework: 'EVV',
    category: 'Verification',
    lastChecked: '2024-04-15',
    checks: [
      { name: 'Location Data Present', status: 'Fail' },
      { name: 'Data Accuracy', status: 'Pass' }
    ]
  },
  {
    id: 'CRD-1',
    title: 'Caregiver license unexpired',
    description: 'Verify that all active caregivers maintain current, valid professional licenses.',
    owner: 'Admin',
    source: 'CareSupport',
    frameworks: ['Credentialing'],
    tests: '2/2',
    status: 'OK',
    framework: 'Credentialing',
    category: 'Licensing',
    lastChecked: '2024-04-14',
    checks: [
      { name: 'License Validity', status: 'Pass' },
      { name: 'Expiration Check', status: 'Pass' }
    ]
  },
  {
    id: 'CRD-2',
    title: 'Background checks updated annually',
    description: 'Ensure background checks are renewed every 365 days for all active caregivers.',
    owner: 'Unassigned',
    source: 'CareSupport',
    frameworks: ['Credentialing'],
    tests: '0/1',
    status: 'Needs attention',
    framework: 'Credentialing',
    category: 'Background Checks',
    lastChecked: '2024-04-13',
    checks: [
      { name: 'Annual Renewal', status: 'Warning' }
    ]
  },
  {
    id: 'POC-1',
    title: 'Daily tasks documented for each client visit',
    description: 'Verify that caregivers complete required documentation for all tasks specified in the care plan.',
    owner: 'Caregiver',
    source: 'CareSupport',
    frameworks: ['Plan-of-Care'],
    tests: '1/3',
    status: 'Failing',
    framework: 'Plan-of-Care',
    category: 'Documentation',
    lastChecked: '2024-04-12',
    checks: [
      { name: 'Task Documentation', status: 'Fail' },
      { name: 'Care Plan Match', status: 'Pass' },
      { name: 'Timeliness', status: 'Fail' }
    ]
  },
  {
    id: 'POC-2',
    title: 'Medication administration logs complete',
    description: 'Ensure all medication-related tasks are documented with time, dose, and route of administration.',
    owner: 'Caregiver',
    source: 'CareSupport',
    frameworks: ['Plan-of-Care'],
    tests: '3/3',
    status: 'OK',
    framework: 'Plan-of-Care',
    category: 'Medication',
    lastChecked: '2024-04-15',
    checks: [
      { name: 'Medication Details', status: 'Pass' },
      { name: 'Time Stamp', status: 'Pass' },
      { name: 'Administration Route', status: 'Pass' }
    ]
  }
];

const frameworks = [
  { name: 'All Frameworks', count: controls.length },
  { name: 'EVV', count: controls.filter(c => c.framework === 'EVV').length },
  { name: 'Credentialing', count: controls.filter(c => c.framework === 'Credentialing').length },
  { name: 'Plan-of-Care', count: controls.filter(c => c.framework === 'Plan-of-Care').length }
];

const categories = [
  { name: 'All Categories', count: controls.length },
  { name: 'Verification', count: controls.filter(c => c.category === 'Verification').length },
  { name: 'Licensing', count: controls.filter(c => c.category === 'Licensing').length },
  { name: 'Background Checks', count: controls.filter(c => c.category === 'Background Checks').length },
  { name: 'Documentation', count: controls.filter(c => c.category === 'Documentation').length },
  { name: 'Medication', count: controls.filter(c => c.category === 'Medication').length }
];

function ControlsView() {
  const navigate = useNavigate();
  const [view, setView] = useState<'card' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All Frameworks');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedControl, setExpandedControl] = useState<string | null>(null);

  const totalControls = controls.length;
  const passingControls = controls.filter(c => c.status === 'OK').length;
  const failingControls = controls.filter(c => c.status === 'Failing').length;
  const needsAttentionControls = controls.filter(c => c.status === 'Needs attention').length;

  const filteredControls = controls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFramework = selectedFramework === 'All Frameworks' || control.framework === selectedFramework;
    const matchesCategory = selectedCategory === 'All Categories' || control.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || control.status === selectedStatus;
    return matchesSearch && matchesFramework && matchesCategory && matchesStatus;
  });

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/compliance')}
            className="text-gray-500 hover:text-gray-700"
          >
            Compliance
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">Controls</span>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Controls</h1>
            <p className="text-gray-600">Monitor and manage compliance controls across frameworks</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === 'card' ? 'list' : 'card')}
              className="p-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              title={view === 'card' ? 'Switch to list view' : 'Switch to card view'}
            >
              {view === 'card' ? <List size={20} /> : <LayoutGrid size={20} />}
            </button>
            <button 
              onClick={() => navigate('/compliance/controls/new')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add control
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Controls</div>
            <div className="text-2xl font-semibold">{totalControls}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Passing</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-green-600">{passingControls}</div>
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Failing</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">{failingControls}</div>
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Needs Attention</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">{needsAttentionControls}</div>
              <AlertCircle size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Frameworks</h2>
              </div>
              <div className="p-2">
                {frameworks.map((framework) => (
                  <button
                    key={framework.name}
                    onClick={() => setSelectedFramework(framework.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                      selectedFramework === framework.name
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{framework.name}</span>
                    <span className={selectedFramework === framework.name ? 'text-purple-600' : 'text-gray-400'}>
                      {framework.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
              <div className="p-4 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search controls..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  Status
                  <ChevronDown size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter size={20} />
                </button>
              </div>

              {view === 'list' ? (
                <div className="p-4">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredControls.map((control) => (
                        <tr key={control.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{control.id}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{control.title}</div>
                            <div className="text-sm text-gray-500">{control.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.owner}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{control.source}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {control.frameworks.map((framework) => (
                                <span key={framework} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  {framework}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                              control.status === 'OK' 
                                ? 'bg-green-100 text-green-800'
                                : control.status === 'Failing'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {control.tests}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4">
                  <div className="space-y-4">
                    {filteredControls.map((control) => (
                      <div
                        key={control.id}
                        className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-purple-600">{control.framework}</span>
                              <span className="text-gray-300">·</span>
                              <span className="text-sm text-gray-500">{control.category}</span>
                            </div>
                            <h3 className="font-medium mb-2">{control.title}</h3>
                            <p className="text-gray-600 text-sm">{control.description}</p>
                            
                            <div className="flex items-center gap-4 mt-4">
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Owner:</span> {control.owner}
                              </div>
                              <div className="text-sm text-gray-500">
                                <span className="font-medium">Last checked:</span> {control.lastChecked}
                              </div>
                            </div>

                            {expandedControl === control.id && (
                              <div className="mt-6 space-y-4 border-t pt-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Checks</h4>
                                  <div className="space-y-2">
                                    {control.checks.map((check, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        {check.status === 'Pass' ? (
                                          <CheckCircle size={16} className="text-green-500" />
                                        ) : check.status === 'Warning' ? (
                                          <AlertCircle size={16} className="text-yellow-500" />
                                        ) : (
                                          <XCircle size={16} className="text-red-500" />
                                        )}
                                        <span className="text-sm">{check.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              control.status === 'OK'
                                ? 'bg-green-100 text-green-800'
                                : control.status === 'Failing'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {control.tests}
                            </span>
                            <button
                              onClick={() => setExpandedControl(
                                expandedControl === control.id ? null : control.id
                              )}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <ChevronRight
                                size={16}
                                className={`transform transition-transform ${
                                  expandedControl === control.id ? 'rotate-90' : ''
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ControlsView;