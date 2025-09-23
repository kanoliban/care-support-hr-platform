'use client';

import * as React from 'react';
import { RiAddLine, RiCloseLine } from '@remixicon/react';
import * as Label from '@/components/ui/label';
import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';

// Pre-defined care responsibilities based on Rob's actual care needs
const CARE_RESPONSIBILITIES = [
  // Medical & Health
  'Medical Monitoring',
  'Help with Meds',
  'Organize Meds',
  'Change Catheter',
  'Bowel Program',
  'Empty Leg Bag',
  'Change Leg Bag',
  
  // Physical Care
  'Transfer',
  'Range of Motion',
  'Dressing/Undressing',
  'Shower',
  'Bed Bath',
  
  // Daily Living
  'Eating',
  'Meal Prep',
  'Dishes',
  'Laundry',
  'Cleaning/Organizing',
  'Chores',
  
  // Mobility & Transportation
  'Driving',
  'Wheelchair Repair',
  
  // Outdoor Tasks
  'Mow Lawn',
  'Shovel/Plow',
  'Bring Meals',
  
  // Specialized Care
  'Overnight Supervision',
  'Work Assistance',
  'Adaptive Fitness',
  'Companionship',
] as const;

type CareResponsibility = typeof CARE_RESPONSIBILITIES[number];

interface CareResponsibilitiesSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function CareResponsibilitiesSelector({ 
  value, 
  onChange, 
  error 
}: CareResponsibilitiesSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Parse selected responsibilities from comma-separated string
  const selectedResponsibilities = React.useMemo(() => {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }, [value]);
  
  // Available responsibilities (not yet selected)
  const availableResponsibilities = React.useMemo(() => {
    return CARE_RESPONSIBILITIES.filter(
      responsibility => !selectedResponsibilities.includes(responsibility)
    );
  }, [selectedResponsibilities]);
  
  const handleAddResponsibility = (responsibility: CareResponsibility) => {
    const newSelected = [...selectedResponsibilities, responsibility];
    onChange(newSelected.join(', '));
    setIsOpen(false); // Close dropdown after selection
  };
  
  const handleRemoveResponsibility = (responsibility: string) => {
    const newSelected = selectedResponsibilities.filter(item => item !== responsibility);
    onChange(newSelected.join(', '));
  };
  
  const handleAddCustom = () => {
    const custom = prompt('Enter custom care responsibility:');
    if (custom && custom.trim()) {
      const newSelected = [...selectedResponsibilities, custom.trim()];
      onChange(newSelected.join(', '));
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="space-y-3">
      <Label.Root>Care Responsibilities *</Label.Root>
      
      {/* Selected Responsibilities */}
      {selectedResponsibilities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedResponsibilities.map((responsibility) => (
            <div
              key={responsibility}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm border border-primary-200"
            >
              <span>{responsibility}</span>
              <button
                type="button"
                onClick={() => handleRemoveResponsibility(responsibility)}
                className="ml-1 hover:bg-primary-100 rounded-full p-0.5 transition-colors"
              >
                <RiCloseLine className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add Responsibilities Button */}
      <div className="relative" ref={dropdownRef}>
        <Button.Root
          type="button"
          variant="neutral"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-start text-left border border-stroke-soft-200 bg-white text-text-strong-950 hover:bg-bg-soft-50",
            error && "border-red-500"
          )}
        >
          <RiAddLine className="size-4 mr-2" />
          Add care responsibilities...
        </Button.Root>
        
        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-stroke-soft-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <div className="p-2">
              {/* Pre-defined responsibilities */}
              {availableResponsibilities.length > 0 && (
                <div className="space-y-1">
                  {availableResponsibilities.map((responsibility) => (
                    <button
                      key={responsibility}
                      type="button"
                      onClick={() => handleAddResponsibility(responsibility)}
                      className="w-full text-left px-3 py-2 text-sm text-text-strong-950 bg-bg-soft-50 hover:bg-bg-soft-100 rounded-md transition-colors border border-stroke-soft-200 hover:border-stroke-soft-300"
                    >
                      {responsibility}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Custom responsibility */}
              <div className="border-t border-stroke-soft-200 pt-2 mt-2">
                <button
                  type="button"
                  onClick={handleAddCustom}
                  className="w-full text-left px-3 py-2 text-sm text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors border border-primary-200 hover:border-primary-300"
                >
                  + Add custom responsibility
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600">{error}</div>
      )}
      
      {/* Helper text */}
      <div className="text-xs text-text-sub-600">
        Select all care activities this team member can perform. This helps with scheduling and coverage planning.
      </div>
    </div>
  );
}
