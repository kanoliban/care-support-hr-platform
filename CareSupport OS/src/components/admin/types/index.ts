export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Locked' | 'Pending';
  lastLogin: string;
  permissions: string[];
}

export interface Role {
  name: string;
  description: string;
  permissions: string[];
}

export interface SystemSettings {
  agencyName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  timezone: string;
  dateFormat: string;
  notificationPreferences: {
    shiftReminders: boolean;
    complianceAlerts: boolean;
    billingNotifications: boolean;
  };
  branding: {
    logo?: string;
    primaryColor: string;
  };
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Error';
  lastSync?: string;
  config: Record<string, any>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: 'user' | 'system' | 'compliance';
}