import React, { createContext, useContext, useState, useEffect } from 'react';

interface SystemSettings {
  coordinatorName: string;  // Changed from agencyName to coordinatorName
  timezone: string;
  dateFormat: string;
  branding: {
    primaryColor: string;
    logo?: string;
  };
}

interface SystemSettingsContextType {
  settings: SystemSettings;
  updateSettings: (settings: Partial<SystemSettings>) => void;
}

const defaultSettings: SystemSettings = {
  coordinatorName: 'Rob',  // Personal care coordinator name instead of agency
  timezone: 'America/Chicago',
  dateFormat: 'MM/DD/YYYY',
  branding: {
    primaryColor: '#9333EA'
  }
};

const SystemSettingsContext = createContext<SystemSettingsContextType | undefined>(undefined);

export function SystemSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    // Try to load settings from localStorage
    const savedSettings = localStorage.getItem('systemSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('systemSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      branding: {
        ...prev.branding,
        ...(newSettings.branding || {})
      }
    }));
  };

  return (
    <SystemSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SystemSettingsContext.Provider>
  );
}

export function useSystemSettings() {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error('useSystemSettings must be used within a SystemSettingsProvider');
  }
  return context;
}