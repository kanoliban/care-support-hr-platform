export interface CareEvent {
  id: string;
  title: string;
  type: CareEventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  assignedCaregiver?: string;
  client?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  notifications: string[];
  status: CareEventStatus;
  visibility: CareEventVisibility;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: CareEventMetadata;
}

export type CareEventType = 
  | 'care-shift' 
  | 'appointment' 
  | 'blocked-date';

export type CareEventStatus = 
  | 'scheduled' 
  | 'confirmed' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no-show';

export type CareEventVisibility = 
  | 'care-team-only' 
  | 'client-family' 
  | 'private-caregiver' 
  | 'public';

export interface CareEventMetadata {
  appointmentType?: 'medical' | 'therapy' | 'dental' | 'specialist';
  trainingTopic?: 'first-aid' | 'medication' | 'safety' | 'communication';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  attachments?: string[];
  notes?: string;
}

export interface CareEventNotification {
  id: string;
  eventId: string;
  type: 'reminder' | 'alert' | 'update' | 'cancellation';
  recipient: string;
  message: string;
  scheduledTime: Date;
  sent: boolean;
  deliveryMethod: 'email' | 'sms' | 'push' | 'in-app';
}

export interface CareEventCreateData {
  title: string;
  type: CareEventType;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  assignedCaregiver?: string;
  client?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
  notifications: string[];
  status: CareEventStatus;
  visibility: CareEventVisibility;
  metadata?: CareEventMetadata;
}

export interface CareEventUpdateData extends Partial<CareEventCreateData> {
  id: string;
}

// Field configuration for each event type
export interface EventTypeFieldConfig {
  fields: string[];
  required: string[];
  color: string;
  icon: string;
  defaultDuration: number;
  label: string;
}

export const getEventTypeFieldConfig = (type: CareEventType): EventTypeFieldConfig => {
  const configs: Record<CareEventType, EventTypeFieldConfig> = {
    'care-shift': {
      fields: ['title', 'dateTime', 'careRecipient', 'teamMembers', 'location', 'description', 'recurrence'],
      required: ['title', 'dateTime', 'careRecipient', 'teamMembers', 'location'],
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🏥',
      defaultDuration: 8,
      label: 'Care Shift',
    },
    'appointment': {
      fields: ['title', 'dateTime', 'careRecipient', 'location', 'recurrence'],
      required: ['title', 'dateTime', 'careRecipient', 'location'],
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🩺',
      defaultDuration: 1,
      label: 'Appointment',
    },
    'blocked-date': {
      fields: ['title', 'dateTime', 'teamMembers', 'description', 'recurrence'],
      required: ['title', 'dateTime', 'teamMembers'],
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: '🚫',
      defaultDuration: 8,
      label: 'Blocked Date',
    },
  };
  
  return configs[type];
};

// Legacy function for backward compatibility
export const getCareEventTypeConfig = (type: CareEventType) => {
  const config = getEventTypeFieldConfig(type);
  return {
    icon: config.icon,
    color: config.color,
    defaultDuration: config.defaultDuration,
    requiredFields: config.required,
  };
};

export const generateCareEventId = () => {
  return `care-event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validateCareEvent = (event: CareEventCreateData): string | null => {
  if (!event.title?.trim()) {
    return 'Please enter a care activity title';
  }

  const config = getCareEventTypeConfig(event.type);
  
  // Check required fields based on event type
  for (const requiredField of config.requiredFields) {
    if (!event[requiredField as keyof CareEventCreateData]) {
      const fieldLabel = requiredField === 'assignedCaregiver' ? 'care team member' : 
                        requiredField === 'client' ? 'client' : 'location';
      return `Please assign a ${fieldLabel} for ${event.type.replace('-', ' ')}`;
    }
  }

  // Validate time range
  if (event.endDate <= event.startDate) {
    return 'End time must be after start time';
  }

  return null;
};
