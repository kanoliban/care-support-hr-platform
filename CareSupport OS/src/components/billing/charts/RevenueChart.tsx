import React from 'react';
import { PayerType } from '../types';

interface RevenueChartProps {
  data: {
    payer: PayerType;
    revenue: number;
    claims: number;
    trend: number;
  }[];
}

function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const maxRevenue = Math.max(...data.map(item => item.revenue));

  const getPayerColor = (payer: PayerType) => {
    const colors = {
      'Medicaid': 'bg-blue-500',
      'Medicare': 'bg-green-500',
      'Private Insurance': 'bg-purple-500',
      'Private Pay': 'bg-orange-500',
      'Other': 'bg-gray-500'
    };
    return colors[payer];
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Revenue by Payer</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-end mb-1">
                <div>
                  <div className="text-sm font-medium">{item.payer}</div>
                  <div className="text-sm text-gray-500">{item.claims} claims</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">${item.revenue.toLocaleString()}</div>
                  <div className={`text-sm ${item.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.trend >= 0 ? '+' : ''}{item.trend}%
                  </div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                  <div
                    className={`${getPayerColor(item.payer)} transition-all`}
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-semibold">${totalRevenue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Claims</div>
            <div className="text-2xl font-semibold">
              {data.reduce((sum, item) => sum + item.claims, 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevenueChart;