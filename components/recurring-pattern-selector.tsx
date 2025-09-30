'use client';

import * as React from 'react';
import { cn } from '@/utils/cn';
import * as Label from '@/components/ui/label';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';

// Day options for recurring pattern
const dayOptions = [
  { value: 'monday', label: 'M' },
  { value: 'tuesday', label: 'T' },
  { value: 'wednesday', label: 'W' },
  { value: 'thursday', label: 'T' },
  { value: 'friday', label: 'F' },
  { value: 'saturday', label: 'S' },
  { value: 'sunday', label: 'S' }
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export interface RecurringPatternData {
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number;
  daysOfWeek: string[];
  endDate?: string;
}

export interface RecurringPatternSelectorProps {
  pattern: RecurringPatternData;
  onPatternChange: (pattern: RecurringPatternData) => void;
  showDaysSelection?: boolean;
  className?: string;
}

export function RecurringPatternSelector({
  pattern,
  onPatternChange,
  showDaysSelection = true,
  className
}: RecurringPatternSelectorProps) {
  
  const handleRecurringChange = (field: keyof RecurringPatternData, value: any) => {
    onPatternChange({ ...pattern, [field]: value });
  };

  const handleDayToggle = (day: string) => {
    const newDays = pattern.daysOfWeek.includes(day)
      ? pattern.daysOfWeek.filter(d => d !== day)
      : [...pattern.daysOfWeek, day];
    handleRecurringChange('daysOfWeek', newDays);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label.Root>Frequency</Label.Root>
          <Select.Root
            value={pattern.frequency}
            onValueChange={(value) => handleRecurringChange('frequency', value)}
          >
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {frequencyOptions.map(option => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div>
          <Label.Root>Every</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                type="number"
                min="1"
                value={pattern.interval}
                onChange={(e) => handleRecurringChange('interval', parseInt(e.target.value) || 1)}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      {/* Days Selection - Show for weekly */}
      {showDaysSelection && pattern.frequency === 'weekly' && (
        <div>
          <Label.Root>Repeat on</Label.Root>
          <div className="flex gap-1 mt-2">
            {dayOptions.map(day => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={cn(
                  "w-10 h-10 text-sm font-medium border rounded-lg transition-colors",
                  pattern.daysOfWeek.includes(day.value)
                    ? 'bg-purple-500 border-purple-500 text-white'
                    : 'border-stroke-soft-200 hover:border-stroke-soft-300 hover:bg-bg-soft-50 text-text-strong-950'
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* End Date */}
      <div>
        <Label.Root>End Date (Optional)</Label.Root>
        <Input.Root>
          <Input.Wrapper>
            <Input.Input
              type="date"
              value={pattern.endDate || ''}
              onChange={(e) => handleRecurringChange('endDate', e.target.value)}
            />
          </Input.Wrapper>
        </Input.Root>
      </div>

      {/* Summary */}
      <div className="p-3 bg-bg-soft-50 rounded border border-stroke-soft-200">
        <p className="text-sm text-text-sub-600">
          {`Repeat ${pattern.frequency} every ${pattern.interval} ${
            pattern.frequency === 'daily' ? 'day(s)' :
            pattern.frequency === 'weekly' ? 'week(s)' :
            'month(s)'
          }`}
          {pattern.frequency === 'weekly' && pattern.daysOfWeek.length > 0 && (
            <span> on {pattern.daysOfWeek.map(d => dayOptions.find(day => day.value === d)?.label).join(', ')}</span>
          )}
          {pattern.endDate && (
            <span> until {new Date(pattern.endDate).toLocaleDateString()}</span>
          )}
        </p>
      </div>
    </div>
  );
}
