import React from 'react';

interface TestDragModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestDragModal({ isOpen, onClose }: TestDragModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h3 className="text-lg font-semibold mb-4">Test Drag Modal</h3>
        <p className="mb-4">This is a test modal to verify it works.</p>
        <button 
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
