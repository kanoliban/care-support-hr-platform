import React from 'react';
import { Building2 } from 'lucide-react';

function EmptyAuditsView() {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <Building2 size={48} className="text-gray-400" />
      </div>
      <h2 className="text-xl font-semibold mb-4">Add your first audit</h2>
      
      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            Grant access to state health department or insurance auditors to begin the review process
          </p>
          <button className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            Manage auditor access
          </button>
        </div>
        
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            Schedule an audit and manage the timeline, documentation, and access requirements
          </p>
          <button className="w-full px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
            Add audit
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmptyAuditsView;