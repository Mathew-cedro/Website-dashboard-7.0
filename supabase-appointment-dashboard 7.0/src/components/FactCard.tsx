import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface FactCardProps {
  fact: string;
  index: number;
}

const FactCard: React.FC<FactCardProps> = ({ fact, index }) => {
  const { settings } = useSettings();
  const animationClass = settings.animationsEnabled ? 'animate-slide-in-up' : '';

  return (
    <div 
      className={`bg-light-card dark:bg-twitch-card p-4 rounded-xl shadow-lg border border-light-border dark:border-slate-700 flex items-start space-x-4 ${animationClass}`}
      style={{ animationDelay: settings.animationsEnabled ? `${index * 100}ms` : '0ms' }}
    >
      <div className="flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <p className="text-light-text-secondary dark:text-slate-300">{fact}</p>
    </div>
  );
};

export default FactCard;