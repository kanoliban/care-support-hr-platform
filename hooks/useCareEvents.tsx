'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CareEvent, 
  CareEventCreateData, 
  CareEventUpdateData, 
  CareEventNotification,
  generateCareEventId,
  validateCareEvent 
} from '@/types/care-events';

interface CareEventsContextType {
  events: CareEvent[];
  notifications: CareEventNotification[];
  createEvent: (eventData: CareEventCreateData) => Promise<CareEvent>;
  updateEvent: (eventData: CareEventUpdateData) => Promise<CareEvent>;
  deleteEvent: (eventId: string) => Promise<void>;
  getEventsByDateRange: (startDate: Date, endDate: Date) => CareEvent[];
  getEventsByClient: (clientId: string) => CareEvent[];
  getEventsByCaregiver: (caregiverId: string) => CareEvent[];
  sendNotification: (notification: Omit<CareEventNotification, 'id'>) => Promise<void>;
  markNotificationSent: (notificationId: string) => void;
}

const CareEventsContext = createContext<CareEventsContextType | undefined>(undefined);

export function CareEventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [notifications, setNotifications] = useState<CareEventNotification[]>([]);

  const createEvent = useCallback(async (eventData: CareEventCreateData): Promise<CareEvent> => {
    // Validate the event data
    const validationError = validateCareEvent(eventData);
    if (validationError) {
      throw new Error(validationError);
    }

    const newEvent: CareEvent = {
      id: generateCareEventId(),
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user', // TODO: Get from auth context
    };

    setEvents(prev => [...prev, newEvent]);

    // Create notifications based on the event
    const eventNotifications = await createEventNotifications(newEvent);
    setNotifications(prev => [...prev, ...eventNotifications]);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return newEvent;
  }, []);

  const updateEvent = useCallback(async (eventData: CareEventUpdateData): Promise<CareEvent> => {
    const { id, ...updateData } = eventData;
    
    let updatedEvent: CareEvent | undefined;
    setEvents(prev => prev.map(event => {
      if (event.id === id) {
        updatedEvent = { ...event, ...updateData, updatedAt: new Date() };
        return updatedEvent;
      }
      return event;
    }));

    // Create update notification
    if (updatedEvent) {
      await sendNotification({
        eventId: id,
        type: 'update',
        recipient: updatedEvent.assignedCaregiver || updatedEvent.client || 'care-team',
        message: `Care event "${updatedEvent.title}" has been updated`,
        scheduledTime: new Date(),
        sent: false,
        deliveryMethod: 'in-app',
      });
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return updatedEvent!;
  }, [sendNotification]);

  const deleteEvent = useCallback(async (eventId: string): Promise<void> => {
    let deletedEvent: CareEvent | undefined;
    
    setEvents(prev => {
      deletedEvent = prev.find(e => e.id === eventId);
      return prev.filter(event => event.id !== eventId);
    });
    
    // Remove associated notifications
    setNotifications(prev => prev.filter(notif => notif.eventId !== eventId));

    // Create cancellation notification
    if (deletedEvent) {
      await sendNotification({
        eventId: eventId,
        type: 'cancellation',
        recipient: deletedEvent.assignedCaregiver || deletedEvent.client || 'care-team',
        message: `Care event "${deletedEvent.title}" has been cancelled`,
        scheduledTime: new Date(),
        sent: false,
        deliveryMethod: 'in-app',
      });
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }, [sendNotification]);

  const getEventsByDateRange = useCallback((startDate: Date, endDate: Date): CareEvent[] => {
    return events.filter(event => 
      event.startDate >= startDate && event.startDate <= endDate
    );
  }, [events]);

  const getEventsByClient = useCallback((clientId: string): CareEvent[] => {
    return events.filter(event => event.client === clientId);
  }, [events]);

  const getEventsByCaregiver = useCallback((caregiverId: string): CareEvent[] => {
    return events.filter(event => event.assignedCaregiver === caregiverId);
  }, [events]);

  const sendNotification = useCallback(async (notificationData: Omit<CareEventNotification, 'id'>): Promise<void> => {
    const notification: CareEventNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
    };

    setNotifications(prev => [...prev, notification]);

    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 100));
  }, []);

  const markNotificationSent = useCallback((notificationId: string): void => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, sent: true }
        : notif
    ));
  }, []);

  const createEventNotifications = async (event: CareEvent): Promise<CareEventNotification[]> => {
    const notifications: Omit<CareEventNotification, 'id'>[] = [];

    // Reminder notifications based on event settings
    if (event.notifications.includes('30-min-before')) {
      const reminderTime = new Date(event.startDate.getTime() - 30 * 60 * 1000);
      if (reminderTime > new Date()) {
        notifications.push({
          eventId: event.id,
          type: 'reminder',
          recipient: event.assignedCaregiver || 'care-team',
          message: `Reminder: ${event.title} starts in 30 minutes`,
          scheduledTime: reminderTime,
          sent: false,
          deliveryMethod: 'in-app',
        });
      }
    }

    if (event.notifications.includes('1-hour-before')) {
      const reminderTime = new Date(event.startDate.getTime() - 60 * 60 * 1000);
      if (reminderTime > new Date()) {
        notifications.push({
          eventId: event.id,
          type: 'reminder',
          recipient: event.client || 'family',
          message: `Reminder: ${event.title} starts in 1 hour`,
          scheduledTime: reminderTime,
          sent: false,
          deliveryMethod: 'in-app',
        });
      }
    }

    // Coverage gap alerts (handled differently since it's not a CareEventType)
    if (event.type === 'blocked-date' && event.status === 'scheduled') {
      notifications.push({
        eventId: event.id,
        type: 'alert',
        recipient: 'care-coordinator',
        message: `URGENT: Coverage gap detected for ${event.client}`,
        scheduledTime: new Date(),
        sent: false,
        deliveryMethod: 'in-app',
      });
    }

    return notifications.map(notif => ({
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notif,
    }));
  };

  const value: CareEventsContextType = {
    events,
    notifications,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDateRange,
    getEventsByClient,
    getEventsByCaregiver,
    sendNotification,
    markNotificationSent,
  };

  return (
    <CareEventsContext.Provider value={value}>
      {children}
    </CareEventsContext.Provider>
  );
}

export function useCareEvents(): CareEventsContextType {
  const context = useContext(CareEventsContext);
  if (context === undefined) {
    throw new Error('useCareEvents must be used within a CareEventsProvider');
  }
  return context;
}
