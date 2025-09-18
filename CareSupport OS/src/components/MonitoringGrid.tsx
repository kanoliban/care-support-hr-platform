import React from 'react';
import { FileText, TestTube, Building2, File, ChevronRight, AlertCircle } from 'lucide-react';

const monitoringItems = [
  {
    title: 'Policies',
    icon: FileText,
    needsAttention: 0,
    complete: 15,
    total: 15,
  },
  {
    title: 'Tests',
    icon: TestTube,
    needsAttention: 7,
    complete: 141,
    total: 148,
  },
  {
    title: 'Vendors',
    icon: Building2,
    needsAttention: 0,
    complete: 46,
    total: 46,
  },
  {
    title: 'Documents',
    icon: File,
    needsAttention: 2,
    complete: 37,
    total: 39,
  },
];

function MonitoringCard({ item }) {
  const progress = (item.complete / item.total) * 100;
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <item.icon size={20} className="text-purple-600" />
          <h3 className="text-lg font-medium">{item.title}</h3>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Needs attention</span>
        <AlertCircle size={16} className="text-gray-400" />
      </div>

      <div className="mb-4">
        <span className="text-4xl font-bold">{item.needsAttention}</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
        <div
          className="bg-green-500 h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>{item.complete} OK</span>
        <span>{item.total} total</span>
      </div>
    </div>
  );
}

function MonitoringGrid() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Monitoring</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {monitoringItems.map((item, index) => (
          <MonitoringCard key={index} item={item} />
        ))}
      </div>
    </section>
  );
}

export default MonitoringGrid;