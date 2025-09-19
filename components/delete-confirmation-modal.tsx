import React from 'react';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import { RiDeleteBinLine, RiCloseLine } from '@remixicon/react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

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
              Are you sure you want to delete this event?
            </Label.Root>
            <div className="bg-bg-soft-50 rounded-lg p-3 border border-stroke-soft-200">
              <p className="text-text-strong-950 font-medium">{eventTitle}</p>
            </div>
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
              onClick={onConfirm}
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
