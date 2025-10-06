import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-light-card dark:bg-twitch-card p-4 sm:p-6 border-b border-light-border dark:border-slate-700 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-title tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-twitch-purple to-pink-500">
              Appointment Dashboard
            </h1>
            <p className="text-light-text-secondary dark:text-slate-400 mt-1 text-sm sm:text-base">Your Appointment Data, Visualized in Real-Time</p>
          </div>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Live
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;