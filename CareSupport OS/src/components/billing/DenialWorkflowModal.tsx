import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, FileText, Upload } from 'lucide-react';
import { Claim, DenialReason } from './types';

interface DenialWorkflowModalProps {
  claim: Claim;
  denialReason: DenialReason;
  onClose: () => void;
  onResubmit: (claim: Claim) => void;
}

function DenialWorkflowModal({ claim, denialReason, onClose, onResubmit }: DenialWorkflowModalProps) {
  const [status, setStatus] = useState<'reviewing' | 'uploading' | 'ready'>('reviewing');
  const [files, setFiles] = useState<File[]>([]);

  const getActionSteps = () => {
    switch (denialReason.category) {
      case 'Missing Info':
        return [
          'Review missing documentation requirements',
          'Upload required documents',
          'Verify document completeness',
          'Resubmit claim'
        ];
      case 'Invalid Data':
        return [
          'Review error details',
          'Correct invalid information',
          'Validate corrected data',
          'Resubmit claim'
        ];
      case 'Coverage':
        return [
          'Verify patient eligibility',
          'Check service authorization',
          'Update coverage information',
          'Resubmit claim'
        ];
      case 'Compliance':
        return [
          'Review compliance requirements',
          'Address compliance gaps',
          'Document resolution',
          'Resubmit claim'
        ];
      default:
        return [
          'Review denial reason',
          'Take corrective action',
          'Document changes',
          'Resubmit claim'
        ];
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setStatus('ready');
    }
  };

  const handleResubmit = () => {
    // In a real app, this would upload files and update the claim
    onResubmit(claim);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Resolve Denied Claim</h2>
              <p className="text-sm text-gray-500">Claim ID: {claim.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-red-800">{denialReason.code}</h3>
                <p className="text-sm text-red-600">{denialReason.description}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Resolution Steps</h3>
              <div className="space-y-4">
                {getActionSteps().map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      <span className={`text-sm font-medium ${
                        index === 0 ? 'text-purple-600' : 'text-gray-500'
                      }`}>{index + 1}</span>
                    </div>
                    <span className={`text-sm ${
                      index === 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Required Documentation</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload required documents
                      </span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {files.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Uploaded Files</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FileText size={16} className="text-gray-400" />
                      <span>{file.name}</span>
                      <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleResubmit}
              disabled={status !== 'ready'}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Resubmit Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DenialWorkflowModal;