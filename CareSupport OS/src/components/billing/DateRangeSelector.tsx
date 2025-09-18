import React from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  onChange: (dates: { start: string; end: string }) => void;
  presets?: {
    label: string;
    start: string;
    end: string;
  }[];
}

function DateRangeSelector({ startDate, endDate, onChange, presets }: DateRangeSelectorProps) {
  const defaultPresets = [
    {
      label: 'Last Week',
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    {
      label: 'Last Month',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  ];

  const allPresets = presets || defaultPresets;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onChange({ start: e.target.value, end: endDate })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onChange({ start: startDate, end: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="flex flex-wrap gap-2">
          {allPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange({ start: preset.start, end: preset.end })}
              className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DateRangeSelector;