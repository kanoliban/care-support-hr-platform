import React from 'react';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import { RiDeleteBinLine, RiCloseLine } from '@remixicon/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deletionType: 'this' | 'this-and-following' | 'all') => void;
  eventTitle: string;
  isRecurring?: boolean;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  isRecurring = false,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  const [selectedDeletionType, setSelectedDeletionType] = React.useState<'this' | 'this-and-following' | 'all'>('this');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedDeletionType);
  };

  const getDeletionDescription = () => {
    switch (selectedDeletionType) {
      case 'this':
        return 'Only this occurrence will be deleted.';
      case 'this-and-following':
        return 'This occurrence and all future occurrences will be deleted.';
      case 'all':
        return 'All occurrences of this recurring event will be deleted.';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-md shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error-50 rounded-full flex items-center justify-center">
                <RiDeleteBinLine className="w-5 h-5 text-error-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-strong-950">
                  Delete Event
                </h3>
                <p className="text-sm text-text-sub-600">
                  This action cannot be undone
                </p>
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
              {isRecurring ? 'How would you like to delete this recurring event?' : 'Are you sure you want to delete this event?'}
            </Label.Root>
            <div className="bg-bg-soft-50 rounded-lg p-3 border border-stroke-soft-200 mb-4">
              <p className="text-text-strong-950 font-medium">{eventTitle}</p>
              {isRecurring && (
                <p className="text-sm text-text-sub-600 mt-1">This is a recurring event</p>
              )}
            </div>

            {/* Recurring Event Options */}
            {isRecurring && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deletionType"
                      value="this"
                      checked={selectedDeletionType === 'this'}
                      onChange={(e) => setSelectedDeletionType(e.target.value as 'this')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-text-strong-950">This event</span>
                      <p className="text-xs text-text-sub-600">Only this occurrence will be deleted</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deletionType"
                      value="this-and-following"
                      checked={selectedDeletionType === 'this-and-following'}
                      onChange={(e) => setSelectedDeletionType(e.target.value as 'this-and-following')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-text-strong-950">This and following events</span>
                      <p className="text-xs text-text-sub-600">This occurrence and all future occurrences will be deleted</p>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="deletionType"
                      value="all"
                      checked={selectedDeletionType === 'all'}
                      onChange={(e) => setSelectedDeletionType(e.target.value as 'all')}
                      className="w-4 h-4 text-primary-600 border-stroke-soft-300 focus:ring-primary-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-text-strong-950">All events</span>
                      <p className="text-xs text-text-sub-600">All occurrences of this recurring event will be deleted</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Deletion Description */}
            {isRecurring && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                <p className="text-sm text-primary-800">{getDeletionDescription()}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button.Root
              variant="neutral"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button.Root>
            <Button.Root
              variant="error"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <RiDeleteBinLine size={16} />
                  Delete Event
                </>
              )}
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
