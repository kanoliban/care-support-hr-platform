import React, { useState } from 'react';
import { Search, ChevronDown, Download, Plus, Filter, Clock, AlertCircle, History, FileText, Link as LinkIcon } from 'lucide-react';

const categories = [
  { name: 'All', count: 39 },
  { name: 'Caregiver docs', count: 15 },
  { name: 'Client docs', count: 12 },
  { name: 'Agency ops', count: 8 },
  { name: 'Policy docs', count: 4 },
];

const documents = [
  {
    id: 'license-jane',
    name: 'JaneDoe_RN_License2025.pdf',
    description: 'Registered Nurse License',
    frameworks: ['Credentialing'],
    category: 'Caregiver docs',
    subcategory: 'Licenses',
    owner: 'JD',
    status: 'OK',
    controls: ['CRD-1'],
    dueDate: '2025-06-15',
    expiresIn: '420 days',
    versions: [
      { version: 'v2', date: '2024-04-01', note: 'Updated license renewal' },
      { version: 'v1', date: '2023-04-01', note: 'Initial license upload' }
    ],
    linkedPolicy: null
  },
  {
    id: 'background-jane',
    name: 'JaneDoe_BackgroundCheck2024.pdf',
    description: 'Annual Background Check',
    frameworks: ['Credentialing'],
    category: 'Caregiver docs',
    subcategory: 'Background Checks',
    owner: 'JD',
    status: 'Expiring soon',
    controls: ['CRD-2'],
    dueDate: '2024-10-15',
    expiresIn: '180 days',
    versions: [
      { version: 'v1', date: '2023-10-15', note: 'Initial background check' }
    ],
    linkedPolicy: null,
    alert: 'Document expires in 180 days. Upload new background check to maintain CRD-2 compliance.'
  },
  {
    id: 'poc-template',
    name: 'PlanOfCareTemplate_v3.docx',
    description: 'Standard Plan of Care Documentation Template',
    frameworks: ['Plan-of-Care'],
    category: 'Policy docs',
    subcategory: 'Templates',
    owner: 'AS',
    status: 'OK',
    controls: ['POC-1'],
    dueDate: null,
    expiresIn: null,
    versions: [
      { version: 'v3', date: '2024-04-01', note: 'Updated medication section' },
      { version: 'v2', date: '2024-02-15', note: 'Added daily tasks checklist' },
      { version: 'v1', date: '2024-01-01', note: 'Initial template' }
    ],
    linkedPolicy: 'Plan-of-Care Documentation Policy'
  },
  {
    id: 'evv-procedure',
    name: 'EVV_Procedure_Reference2025.pdf',
    description: 'EVV Implementation Guidelines',
    frameworks: ['EVV'],
    category: 'Agency ops',
    subcategory: 'Procedures',
    owner: 'AS',
    status: 'OK',
    controls: ['EVV-1', 'EVV-2'],
    dueDate: '2025-01-01',
    expiresIn: '240 days',
    versions: [
      { version: 'v2', date: '2024-04-01', note: 'Updated for new EVV system' },
      { version: 'v1', date: '2024-01-01', note: 'Initial procedure document' }
    ],
    linkedPolicy: 'Electronic Visit Verification (EVV) Policy'
  },
  {
    id: 'training-cert',
    name: 'JaneDoe_MedTraining2024.pdf',
    description: 'Medication Administration Training Certificate',
    frameworks: ['Credentialing', 'Plan-of-Care'],
    category: 'Caregiver docs',
    subcategory: 'Training',
    owner: 'JD',
    status: 'Needs update',
    controls: ['CRD-1', 'POC-1'],
    dueDate: '2024-08-30',
    expiresIn: '120 days',
    versions: [
      { version: 'v1', date: '2023-08-30', note: 'Initial certification' }
    ],
    linkedPolicy: 'Medication Administration Policy',
    alert: 'Training certificate expires in 120 days. Schedule renewal training to maintain CRD-1 and POC-1 compliance.'
  }
];

function DocumentCard({ document, onClose }) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">{document.name}</h2>
              <p className="text-gray-600">{document.description}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'versions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Version History
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Framework</h3>
                  <div className="flex flex-wrap gap-2">
                    {document.frameworks.map((framework) => (
                      <span key={framework} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {framework}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    document.status === 'OK'
                      ? 'bg-green-100 text-green-800'
                      : document.status === 'Expiring soon'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {document.status}
                  </span>
                </div>
              </div>

              {document.alert && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">{document.alert}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Linked Controls</h3>
                <div className="space-y-2">
                  {document.controls.map((control) => (
                    <div key={control} className="flex items-center gap-2 text-sm text-gray-600">
                      <LinkIcon size={16} />
                      <span>{control}</span>
                    </div>
                  ))}
                </div>
              </div>

              {document.linkedPolicy && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Linked Policy</h3>
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <FileText size={16} />
                    <span>{document.linkedPolicy}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {document.versions.map((version, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                      <History size={14} className="text-purple-600" />
                    </div>
                    {index < document.versions.length - 1 && (
                      <div className="absolute top-6 left-3 w-px h-8 bg-gray-200" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{version.version}</div>
                    <div className="text-sm text-gray-500">{version.date}</div>
                    <div className="text-sm text-gray-600 mt-1">{version.note}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              Download
            </button>
            {document.status !== 'OK' && (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Upload new version
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const expiringCount = documents.filter(doc => doc.status === 'Expiring soon').length;
  const needsUpdateCount = documents.filter(doc => doc.status === 'Needs update').length;

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Documents</h1>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Export all
            </button>
            <button className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus size={16} />
              Add document
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Total Documents</div>
            <div className="text-2xl font-semibold">{documents.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Expiring Soon</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-yellow-600">{expiringCount}</div>
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Needs Update</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-red-600">{needsUpdateCount}</div>
              <AlertCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-48 flex-shrink-0">
            <h2 className="text-xs font-medium text-gray-500 uppercase mb-4">Category</h2>
            <nav>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    selectedCategory === category.name
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                  <span className="float-right text-gray-400">{category.count}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search all documents"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  Framework
                  <ChevronDown size={16} />
                </button>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  Status
                  <ChevronDown size={16} />
                </button>
                <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                  Expiring
                  <ChevronDown size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter size={20} />
                </button>
              </div>

              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-8 px-6 py-3">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires in</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedDocument(doc)}
                    >
                      <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-sm text-gray-500">{doc.description}</div>
                        {doc.controls.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <LinkIcon size={12} />
                            <span>{doc.controls.join(', ')}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {doc.frameworks.map((framework) => (
                            <span key={framework} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {framework}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{doc.category}</div>
                        <div className="text-sm text-gray-500">{doc.subcategory}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700">
                          {doc.owner}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'OK'
                            ? 'bg-green-100 text-green-800'
                            : doc.status === 'Expiring soon'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {doc.expiresIn || 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedDocument && (
        <DocumentCard 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </main>
  );
}

export default DocumentsView;