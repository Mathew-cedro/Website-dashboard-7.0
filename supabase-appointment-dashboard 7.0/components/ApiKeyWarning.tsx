import React from 'react';

const ApiKeyWarning: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-twitch-dark text-light-text dark:text-white p-4">
      <div className="max-w-2xl w-full bg-light-card dark:bg-twitch-card p-8 rounded-2xl shadow-2xl border border-light-border dark:border-red-700/50 text-center animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-6">
          <svg
            className="h-10 w-10 text-red-600 dark:text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-light-text dark:text-slate-100">
          Gemini API Key is Missing
        </h1>
        <p className="mt-4 text-base sm:text-lg text-light-text-secondary dark:text-slate-400">
          To bring this dashboard to life, you need to provide a valid Gemini API key.
        </p>
        <div className="mt-6 text-left bg-slate-100 dark:bg-twitch-dark p-4 rounded-lg border border-light-border dark:border-slate-700">
          <p className="font-semibold text-light-text dark:text-slate-200">Action Required:</p>
          <ol className="list-decimal list-inside mt-2 space-y-2 text-sm text-light-text-secondary dark:text-slate-400">
            <li>Go to your project settings on your hosting platform (e.g., Vercel, Netlify).</li>
            <li>Find the section for "Environment Variables".</li>
            <li>
              Add a new variable named{' '}
              <code className="bg-slate-200 dark:bg-slate-900/50 text-twitch-purple font-mono p-1 rounded">
                API_KEY
              </code>
              .
            </li>
            <li>Paste your Gemini API key as the value and save.</li>
            <li>Redeploy your application for the changes to take effect.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyWarning;
