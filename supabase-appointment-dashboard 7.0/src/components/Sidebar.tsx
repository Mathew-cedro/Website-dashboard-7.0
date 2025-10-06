import React from 'react';
import HeaderIcon from './HeaderIcon';

type Page = 'Dashboard' | 'Settings';

interface NavItemProps {
  icon: React.ReactNode;
  label: Page;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 text-left ${
          active
            ? 'bg-twitch-purple text-white shadow-lg'
            : 'text-light-text-secondary dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <span className="w-6 h-6">{icon}</span>
        <span className="ml-4 font-semibold">{label}</span>
      </button>
    </li>
  );
};

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems: { label: Page; icon: React.ReactNode }[] = [
    {
      label: 'Dashboard',
      icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
    },
    {
        label: 'Settings',
        icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M15 21h2.25a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5h-9A2.25 2.25 0 006 6.75v12A2.25 2.25 0 008.25 21H11m0-12.875a3.375 3.375 0 00-3.375 3.375V15a3.375 3.375 0 006.75 0v-4.5a3.375 3.375 0 00-3.375-3.375z" /></svg>,
    }
  ];

  return (
    <nav className="w-64 bg-light-card dark:bg-twitch-card p-4 flex flex-col border-r border-light-border dark:border-slate-700 shadow-2xl">
      <div className="flex justify-center items-center py-4 mb-4">
        <HeaderIcon />
      </div>
      <div className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(item => (
            <NavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activePage === item.label}
                onClick={() => setActivePage(item.label)}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;