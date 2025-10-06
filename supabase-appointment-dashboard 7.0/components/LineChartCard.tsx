import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSettings } from '../contexts/SettingsContext';

interface LineChartCardProps {
  title: string;
  data: { hour: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-light-card dark:bg-twitch-dark p-2 border border-light-border dark:border-slate-700 rounded-md shadow-lg">
        <p className="text-light-text dark:text-slate-200">{`Time: ${label}`}</p>
        <p className="text-light-text-secondary dark:text-slate-300">{`Check-ins: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const LineChartCard: React.FC<LineChartCardProps> = ({ title, data }) => {
  const { settings } = useSettings();
  const animationClass = settings.animationsEnabled ? 'animate-slide-in-up' : '';

  const hasData = data && data.some(d => d.count > 0);

  if (!hasData) {
    return (
        <div className="bg-light-card dark:bg-twitch-card p-6 rounded-2xl shadow-lg border border-light-border dark:border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-xl font-bold text-light-text dark:text-slate-200 mb-4">{title}</h3>
            <p className="text-light-text-secondary dark:text-slate-400 text-center px-4">
              {'No check-in data available for the most recent day.'}
            </p>
        </div>
    );
  }

  return (
    <div className={`bg-light-card dark:bg-twitch-card p-6 rounded-2xl shadow-lg border border-light-border dark:border-slate-700 ${animationClass}`}>
      <h3 className="text-xl font-bold text-light-text dark:text-slate-200 mb-4 text-center">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart 
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
            <XAxis dataKey="hour" tick={{ fill: 'var(--light-text-secondary)' }} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--light-text-secondary)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="count" name="Check-ins" stroke="#9146FF" strokeWidth={2} activeDot={{ r: 8 }} dot={{r: 1}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;