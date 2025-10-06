import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface NotificationSettings {
  enabled: boolean;
  onNew: boolean;
  onCancelled: boolean;
}

interface Settings {
  theme: Theme;
  animationsEnabled: boolean;
  notifications: NotificationSettings;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const defaultSettings: Settings = {
  theme: 'dark',
  animationsEnabled: true,
  notifications: {
    enabled: false,
    onNew: true,
    onCancelled: true,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('dashboard-settings');
      if (storedSettings) {
        // Merge stored settings with defaults to avoid errors if new settings are added
        return { ...defaultSettings, ...JSON.parse(storedSettings) };
      }
    } catch (error) {
      console.error('Could not parse settings from localStorage', error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('dashboard-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Could not save settings to localStorage', error);
    }
    
    // Apply theme to the root element
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(settings.theme);

  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
