import React from 'react';
import { format } from 'date-fns';
import { RiCloseLine, RiEditLine, RiDeleteBinLine, RiCheckLine } from '@remixicon/react';
import * as Button from '@/components/ui/button';
import * as Label from '@/components/ui/label';
import { CalendarData } from './big-calendar';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarData | null;
  onEdit?: (event: CalendarData) => void;
  onDelete?: (event: CalendarData) => void;
  onToggleComplete?: (event: CalendarData) => void;
}

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  onEdit,
  onDelete,
  onToggleComplete,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null;

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

  const handleToggleComplete = () => {
    onToggleComplete?.(event);
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

          {/* Event Content */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">Title</Label.Root>
              <p className="text-text-strong-950 mt-1">{event.title}</p>
            </div>

            {/* Time */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">Time</Label.Root>
              <p className="text-text-strong-950 mt-1">
                {format(event.startDate, 'MMM dd, yyyy')} • {format(event.startDate, 'h:mm a')} - {format(event.endDate, 'h:mm a')}
              </p>
            </div>

            {/* Type */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">Type</Label.Root>
              <p className="text-text-strong-950 mt-1 capitalize">{event.type || 'Event'}</p>
            </div>

            {/* Location */}
            {event.location && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Location</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.location}</p>
              </div>
            )}

            {/* Platform */}
            {event.platform && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">Platform</Label.Root>
                <p className="text-text-strong-950 mt-1">{event.platform}</p>
              </div>
            )}

            {/* People */}
            {event.people && event.people.length > 0 && (
              <div>
                <Label.Root className="text-sm font-medium text-text-sub-600">People</Label.Root>
                <div className="flex flex-wrap gap-2 mt-2">
                  {event.people.map((person, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {person.image ? (
                        <img
                          className="w-6 h-6 rounded-full object-cover"
                          src={person.image}
                          alt={person.alt}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-bg-soft-200 flex items-center justify-center text-xs font-medium">
                          {person.alt.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-text-strong-950">{person.alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <Label.Root className="text-sm font-medium text-text-sub-600">Status</Label.Root>
              <p className="text-text-strong-950 mt-1">
                {event.completed ? '✅ Completed' : '⏳ Pending'}
              </p>
            </div>
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
              variant="neutral"
              mode="outline"
              size="medium"
              onClick={handleToggleComplete}
              className="flex-1"
            >
              <RiCheckLine size={16} className="mr-2" />
              {event.completed ? 'Mark Pending' : 'Mark Complete'}
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
