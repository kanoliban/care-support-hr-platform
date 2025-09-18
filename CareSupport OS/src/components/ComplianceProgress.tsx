import React from 'react';
import { ChevronRight } from 'lucide-react';

function ComplianceProgress() {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Compliance progress</h2>
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">SOC 2</h3>
          <ChevronRight size={20} className="text-gray-400" />
        </div>
        
        <div className="mb-4">
          <span className="text-5xl font-bold">99%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div className="bg-green-500 h-2 rounded-full" style={{ width: '99%' }}></div>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>103 controls complete</span>
          <span>104 total</span>
        </div>
      </div>
    </section>
  );
}

export default ComplianceProgress;