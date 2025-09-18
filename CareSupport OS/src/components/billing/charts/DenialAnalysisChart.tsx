import React from 'react';
import { DenialReason } from '../types';

interface DenialAnalysisChartProps {
  data: {
    category: DenialReason['category'];
    count: number;
    amount: number;
  }[];
}

function DenialAnalysisChart({ data }: DenialAnalysisChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  const getCategoryColor = (category: DenialReason['category']) => {
    const colors = {
      'Missing Info': 'bg-red-500',
      'Invalid Data': 'bg-orange-500',
      'Coverage': 'bg-yellow-500',
      'Compliance': 'bg-purple-500',
      'Other': 'bg-gray-500'
    };
    return colors[category];
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Denials by Category</h3>
          <div className="relative pt-1">
            <div className="flex mb-2 h-4 overflow-hidden rounded-full">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`${getCategoryColor(item.category)} transition-all`}
                  style={{ width: `${(item.count / total) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.category}</div>
                    <div className="text-sm text-gray-500">
                      {item.count} claims ({((item.count / total) * 100).toFixed(1)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-4">Impact by Amount</h3>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.category}</span>
                  <span className="font-medium">${item.amount.toLocaleString()}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div
                      className={`${getCategoryColor(item.category)} transition-all`}
                      style={{ width: `${(item.amount / totalAmount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DenialAnalysisChart;