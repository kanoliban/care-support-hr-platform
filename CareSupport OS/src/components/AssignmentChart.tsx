import React from 'react';

function AssignmentChart() {
  const assigned = 4;
  const total = 104;
  const percentage = Math.round((assigned / total) * 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-lg font-medium mb-6">Assignment</h2>
      
      <div className="flex items-start gap-8">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
            <circle
              className="text-purple-500"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="text-2xl font-bold">{percentage}%</span>
            <span className="block text-sm text-gray-500">Assigned</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Unassigned</span>
            <span className="font-medium">{total - assigned}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Assigned</span>
            <span className="font-medium">{assigned}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Needs reassignment</span>
            <span className="font-medium">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentChart;