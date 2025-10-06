import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import ToggleSwitch from './ToggleSwitch';

const SettingsPage: React.FC = () => {
  const { settings, setSettings } = useSettings();
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  const handleThemeChange = (isDark: boolean) => {
    setSettings(s => ({ ...s, theme: isDark ? 'dark' : 'light' }));
  };

  const handleAnimationChange = (enabled: boolean) => {
    setSettings(s => ({ ...s, animationsEnabled: enabled }));
  };
  
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      setSettings(s => ({ ...s, notifications: { ...s.notifications, enabled: true } }));
    } else {
      setSettings(s => ({ ...s, notifications: { ...s.notifications, enabled: false } }));
    }
  };

  const handleNotificationsEnabledChange = (enabled: boolean) => {
    if (enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      setSettings(s => ({ ...s, notifications: { ...s.notifications, enabled } }));
    }
  };

  const handleNotificationTriggerChange = (key: 'onNew' | 'onCancelled', value: boolean) => {
    setSettings(s => ({
        ...s,
        notifications: { ...s.notifications, [key]: value }
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <SettingsCard title="Appearance">
        <SettingRow
          label="Dark Mode"
          description="Switch between light and dark themes."
        >
          <ToggleSwitch
            checked={settings.theme === 'dark'}
            onChange={handleThemeChange}
          />
        </SettingRow>
        <SettingRow
          label="Enable Animations"
          description="Turn on/off all application animations."
        >
          <ToggleSwitch
            checked={settings.animationsEnabled}
            onChange={handleAnimationChange}
          />
        </SettingRow>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <SettingRow
          label="Enable Browser Notifications"
          description="Receive alerts for important appointment updates."
        >
          <ToggleSwitch
            checked={settings.notifications.enabled && notificationPermission === 'granted'}
            onChange={handleNotificationsEnabledChange}
            disabled={notificationPermission === 'denied'}
          />
        </SettingRow>
        {notificationPermission === 'denied' && (
            <p className="text-sm text-red-500 mt-2 pl-4">You have blocked notifications. You must enable them in your browser settings.</p>
        )}

        {settings.notifications.enabled && notificationPermission === 'granted' && (
            <div className="pl-6 mt-4 pt-4 border-t border-light-border dark:border-slate-700 space-y-4">
                <CheckboxRow
                    label="Notify on New Appointment"
                    checked={settings.notifications.onNew}
                    onChange={(e) => handleNotificationTriggerChange('onNew', e.target.checked)}
                />
                 <CheckboxRow
                    label="Notify on Cancellation"
                    checked={settings.notifications.onCancelled}
                    onChange={(e) => handleNotificationTriggerChange('onCancelled', e.target.checked)}
                />
            </div>
        )}
      </SettingsCard>
    </div>
  );
};

// Helper sub-components for layout
const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-light-card dark:bg-twitch-card rounded-lg shadow-lg border border-light-border dark:border-slate-700">
    <div className="p-4 sm:p-6 border-b border-light-border dark:border-slate-700">
      <h2 className="text-xl font-bold text-light-text dark:text-white">{title}</h2>
    </div>
    <div className="p-4 sm:p-6 space-y-4">
      {children}
    </div>
  </div>
);

const SettingRow: React.FC<{ label: string; description: string; children: React.ReactNode }> = ({ label, description, children }) => (
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-light-text dark:text-slate-200">{label}</h3>
      <p className="text-sm text-light-text-secondary dark:text-slate-400">{description}</p>
    </div>
    {children}
  </div>
);

const CheckboxRow: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = ({label, checked, onChange}) => (
    <label className="flex items-center space-x-3 cursor-pointer">
        <input 
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-5 w-5 rounded bg-slate-300 dark:bg-slate-600 border-slate-400 dark:border-slate-500 text-twitch-purple focus:ring-twitch-purple"
        />
        <span className="text-light-text dark:text-slate-300">{label}</span>
    </label>
);

export default SettingsPage;