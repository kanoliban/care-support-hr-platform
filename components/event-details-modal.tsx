import React from 'react';
import { format } from 'date-fns';
import { RiCloseLine, RiEditLine, RiDeleteBinLine } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import { CalendarData } from './big-calendar';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarData | null;
  onEdit?: (event: CalendarData) => void;
  onDelete?: (event: CalendarData) => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  console.log('[EVENT DETAILS MODAL DEBUG] Rendering with isOpen:', isOpen, 'event:', event?.title);
  if (!isOpen || !event) {
    console.log('[EVENT DETAILS MODAL DEBUG] Not rendering - isOpen:', isOpen, 'event:', event);
    return null;
  }

  const handleEdit = () => {
    onEdit?.(event);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete?.(event);
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-white-0 rounded-2xl w-full max-w-2xl shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-text-strong-950">
                Event Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-text-soft-400 hover:text-text-sub-600 transition-colors p-2 rounded hover:bg-bg-weak-50 flex items-center justify-center"
            >
              <RiCloseLine size={20} />
            </button>
          </div>

          {/* Event Content - Receipt of Created Event */}
          <div className="space-y-4">
            {/* Request Type */}
            {event.metadata?.requestType && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">What kind of help do you need?</Label.Root>
                <p className="text-text-strong-950 mt-1 capitalize">{event.metadata.requestType}</p>
              </div>
            )}

            {/* Request Details */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">Request Details</Label.Root>
              <p className="text-text-strong-950 mt-1">{event.title}</p>
            </div>

            {/* Care Recipient */}
            {event.client && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Who needs care?</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.client}</p>
              </div>
            )}

            {/* Who can help */}
            {event.assignedCaregiver && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Who can help?</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.assignedCaregiver}</p>
                {event.metadata?.customPersonContact && (
                  <p className="text-sm text-text-sub-600 mt-1">
                    Contact: {event.metadata.customPersonContact} ({event.metadata.customPersonContactType})
                  </p>
                )}
              </div>
            )}

            {/* When */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">When</Label.Root>
              <p className="text-text-strong-950 mt-1">
                {format(event.startDate, 'MMM dd, yyyy')} • {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
              </p>
              {event.isRecurring && event.recurrencePattern && (
                <p className="text-sm text-text-sub-600 mt-1">
                  Recurring: {event.recurrencePattern}
                </p>
              )}
            </div>

            {/* Where */}
            {(event.location || event.platform) && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Where will this happen?</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.location || event.platform}</p>
              </div>
            )}

            {/* Additional Notes */}
            {event.metadata?.notes && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Additional Notes</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.metadata.notes}</p>
              </div>
            )}

          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-stroke-soft-200">
            <Button.Root
              variant="neutral"
              mode="outline"
              size="medium"
              onClick={handleEdit}
              className="flex-1"
            >
              <RiEditLine size={16} className="mr-2" />
              Edit
            </Button.Root>
            
            <Button.Root
              variant="error"
              mode="outline"
              size="medium"
              onClick={handleDelete}
              className="flex-1"
            >
              <RiDeleteBinLine size={16} className="mr-2" />
              Delete
            </Button.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
