import React from 'react';
import { X, Clock, AlertCircle, FileText } from 'lucide-react';
import { Shift } from './types';

interface ShiftDetailModalProps {
  shift: Shift;
  onClose: () => void;
  onUpdate: (shift: Shift) => void;
}

function ShiftDetailModal({ shift, onClose, onUpdate }: ShiftDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Shift Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
                <div className="text-lg font-medium">{shift.clientName}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Caregiver</h3>
                <div className="text-lg font-medium">{shift.caregiverName}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Schedule</h3>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span>
                  {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Compliance Status</h3>
              {shift.complianceStatus.checks.map((check, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 mb-2 ${
                    check.status === 'Pass'
                      ? 'text-green-600'
                      : check.status === 'Warning'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  <AlertCircle size={16} />
                  <span>{check.message}</span>
                </div>
              ))}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Plan of Care Tasks</h3>
              <div className="space-y-2">
                {shift.planOfCareTasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Handle reassign
              }}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Reassign Caregiver
            </button>
            {shift.status !== 'Blocked' && (
              <button
                onClick={() => {
                  // Handle cancel shift
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Cancel Shift
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShiftDetailModal;