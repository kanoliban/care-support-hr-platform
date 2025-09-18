import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, MoreHorizontal, FileText, Clock, History } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

interface PolicyDetailProps {
  id: string;
  name: string;
  description: string;
  lastEditedBy: string;
  approvedBy: string;
  version: string;
  status: string;
  uploadMethod: string;
  framework: string;
  controls: Array<{
    framework: string;
    sectionCode: string;
    control: string;
    owner: string;
  }>;
  versions: Array<{
    version: string;
    date: string;
    changes: string;
  }>;
}

const policyDetails: Record<string, PolicyDetailProps> = {
  'evv-policy': {
    id: 'evv-policy',
    name: 'Electronic Visit Verification (EVV) Policy',
    description: 'Defines how caregivers must clock in/out using location-based or telephony data, in accordance with 21st Century Cures Act.',
    lastEditedBy: 'Jane Smith',
    approvedBy: 'Alex Smith (You)',
    version: 'v1.2',
    status: 'OK',
    uploadMethod: 'Via file upload (.pdf)',
    framework: 'EVV',
    controls: [
      {
        framework: 'EVV',
        sectionCode: 'EVV-1',
        control: 'Time logs must match scheduled hours',
        owner: 'System'
      },
      {
        framework: 'EVV',
        sectionCode: 'EVV-2',
        control: 'Every shift must have a verified location ping',
        owner: 'System'
      }
    ],
    versions: [
      {
        version: 'v1.2',
        date: 'Apr 30, 2024',
        changes: 'Updated telephony verification requirements'
      },
      {
        version: 'v1.1',
        date: 'Mar 15, 2024',
        changes: 'Added GPS location tracking requirements'
      },
      {
        version: 'v1.0',
        date: 'Jan 1, 2024',
        changes: 'Initial policy creation'
      }
    ]
  },
  'credential-policy': {
    id: 'credential-policy',
    name: 'Credential & Licensure Policy',
    description: 'Outlines required documents for new hires, annual background checks, license renewal intervals, etc.',
    lastEditedBy: 'John Doe',
    approvedBy: 'Pending Approval',
    version: 'v2.0',
    status: 'Draft',
    uploadMethod: 'Via file upload (.pdf)',
    framework: 'Credentialing',
    controls: [
      {
        framework: 'Credentialing',
        sectionCode: 'CRD-1',
        control: 'Caregiver license unexpired',
        owner: 'Admin'
      },
      {
        framework: 'Credentialing',
        sectionCode: 'CRD-2',
        control: 'Background checks updated annually',
        owner: 'Admin'
      }
    ],
    versions: [
      {
        version: 'v2.0',
        date: 'In Draft',
        changes: 'Updated background check requirements'
      },
      {
        version: 'v1.0',
        date: 'Feb 1, 2024',
        changes: 'Initial policy creation'
      }
    ]
  }
};

function PolicyDetailView() {
  const { policyId } = useParams<{ policyId: string }>();
  const navigate = useNavigate();
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [versionsExpanded, setVersionsExpanded] = useState(true);
  const [relatedExpanded, setRelatedExpanded] = useState(true);

  const policy = policyDetails[policyId || ''];

  if (!policy) {
    return <div>Policy not found</div>;
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate('/compliance/policies')}
            className="text-gray-500 hover:text-gray-700"
          >
            Policies
          </button>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-900">{policy.name}</span>
        </div>

        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{policy.name}</h1>
            <div className="text-sm text-gray-500 mt-1">Version {policy.version}</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} />
              Download template
            </button>
            {policy.status === 'Draft' ? (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                Submit for approval
              </button>
            ) : (
              <button className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2">
                Create new version
              </button>
            )}
          </div>
        </header>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setDetailsExpanded(!detailsExpanded)}
              className="w-full flex items-center gap-2 text-left font-medium p-4 hover:bg-gray-50 rounded-t-lg"
            >
              {detailsExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              Details
            </button>

            {detailsExpanded && (
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-2 gap-8 p-6">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600">{policy.description}</p>

                    <h3 className="font-medium mt-6 mb-2">Framework</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-purple-100 rounded-full text-sm text-purple-700">
                        {policy.framework}
                      </span>
                    </div>

                    <h3 className="font-medium mt-6 mb-2">Time sensitivity & recurrence</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>Review annually</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      policy.status === 'OK' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.status}
                    </span>

                    <h3 className="font-medium mt-6 mb-2">Last edited by</h3>
                    <p className="text-gray-600">{policy.lastEditedBy}</p>

                    <h3 className="font-medium mt-6 mb-2">Approved by</h3>
                    <p className="text-gray-600">{policy.approvedBy}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setVersionsExpanded(!versionsExpanded)}
              className="w-full flex items-center gap-2 text-left font-medium p-4 hover:bg-gray-50 rounded-t-lg"
            >
              {versionsExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              Version history
            </button>

            {versionsExpanded && (
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-6">
                  {policy.versions.map((version, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                          <History size={14} className="text-purple-600" />
                        </div>
                        {index < policy.versions.length - 1 && (
                          <div className="absolute top-6 left-3 w-px h-8 bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{version.version}</div>
                        <div className="text-sm text-gray-500">{version.date}</div>
                        <div className="text-sm text-gray-600 mt-1">{version.changes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => setRelatedExpanded(!relatedExpanded)}
              className="w-full flex items-center gap-2 text-left font-medium p-4 hover:bg-gray-50 rounded-t-lg"
            >
              {relatedExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              Related controls
            </button>

            {relatedExpanded && (
              <div className="border-t border-gray-200 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policy.controls.map((control, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{control.framework}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{control.sectionCode}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{control.control}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{control.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PolicyDetailView;