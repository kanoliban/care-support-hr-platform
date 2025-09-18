'use client';

import React from 'react';
import { useCareEvents } from '@/hooks/useCareEvents';
import { format } from 'date-fns';
import { RiNotificationLine, RiCloseLine } from '@remixicon/react';

export function CareNotifications() {
  const { notifications, markNotificationSent } = useCareEvents();
  
  // Get unsent notifications
  const unsentNotifications = notifications.filter(notif => !notif.sent);
  
  if (unsentNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {unsentNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${
            notification.type === 'alert' 
              ? 'bg-red-50 border-red-400 text-red-800'
              : notification.type === 'reminder'
              ? 'bg-blue-50 border-blue-400 text-blue-800'
              : notification.type === 'update'
              ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
              : 'bg-gray-50 border-gray-400 text-gray-800'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <RiNotificationLine className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs opacity-75 mt-1">
                  {format(notification.scheduledTime, 'MMM dd, h:mm aa')}
                </p>
              </div>
            </div>
            <button
              onClick={() => markNotificationSent(notification.id)}
              className="ml-2 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
