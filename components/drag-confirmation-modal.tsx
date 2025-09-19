import React from 'react';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import { RiDragMoveLine, RiCloseLine } from '@remixicon/react';

interface DragConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dragType: 'this' | 'this-and-following' | 'all') => void;
  eventTitle: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
  isDragging?: boolean;
  newTime?: string;
}

export function DragConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  isRecurring = false,
  recurrencePattern,
  isDragging = false,
  newTime,
}: DragConfirmationModalProps) {
  const [selectedDragType, setSelectedDragType] = React.useState<'this' | 'this-and-following' | 'all'>('this');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDragType);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-md shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                <RiDragMoveLine className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-strong-950">
                  Reschedule Event
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-2 rounded hover:bg-bg-weak-50 flex items-center justify-center"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <Label.Root className="text-sm font-medium text-text-sub-600 mb-2">
              {isRecurring ? 'How would you like to reschedule this recurring event?' : 'Are you sure you want to reschedule this event?'}
            </Label.Root>
            
            <div className="bg-bg-soft-50 rounded-lg p-3 border border-stroke-soft-200 mb-4">
              <p className="text-text-strong-950 font-medium">{eventTitle}</p>
              {isRecurring && recurrencePattern && (
                <p className="text-sm text-text-sub-600 mt-1">Recurring: {recurrencePattern}</p>
              )}
              {newTime && (
                <p className="text-sm text-primary-600 mt-1">New time: {newTime}</p>
              )}
            </div>

            {/* Recurring Event Options */}
            {isRecurring && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dragType"
                      value="this"
                      checked={selectedDragType === 'this'}
                      onChange={(e) => setSelectedDragType(e.target.value as 'this')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-text-strong-950">This event</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dragType"
                      value="this-and-following"
                      checked={selectedDragType === 'this-and-following'}
                      onChange={(e) => setSelectedDragType(e.target.value as 'this-and-following')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-text-strong-950">This and following events</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="dragType"
                      value="all"
                      checked={selectedDragType === 'all'}
                      onChange={(e) => setSelectedDragType(e.target.value as 'all')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-text-strong-950">All events</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button.Root
              variant="neutral"
              onClick={onClose}
              disabled={isDragging}
              className="flex-1"
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant="primary"
              onClick={handleConfirm}
              disabled={isDragging}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isDragging ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Rescheduling...
                </>
              ) : (
                <>
                  <RiDragMoveLine size={16} />
                  Reschedule Event
                </>
              )}
            </Button.Root>
          </div>

          {/* Info Message */}
          <div className="mt-4 text-center">
            <p className="text-sm text-text-sub-600">This will update the event time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
