import React from 'react';

function CompletionStatus() {
  const stats = {
    testsCompleted: 132,
    totalTests: 133,
    documentsCompleted: 37,
    totalDocuments: 38,
    controlsCompleted: 103,
    totalControls: 104,
  };

  const testPercentage = Math.round((stats.testsCompleted / stats.totalTests) * 100);
  const documentPercentage = Math.round((stats.documentsCompleted / stats.totalDocuments) * 100);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium mb-6">Completion</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Controls OK</span>
          <span className="text-2xl font-bold">99%</span>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          {stats.controlsCompleted} controls
          <span className="mx-2">·</span>
          {stats.totalControls} total
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Test</span>
            <span className="text-sm">{stats.testsCompleted}/{stats.totalTests}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${testPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{testPercentage}%</div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Document</span>
            <span className="text-sm">{stats.documentsCompleted}/{stats.totalDocuments}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${documentPercentage}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">{documentPercentage}%</div>
        </div>
      </div>
    </div>
  );
}

export default CompletionStatus;