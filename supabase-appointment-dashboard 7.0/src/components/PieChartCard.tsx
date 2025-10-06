import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface PieChartCardProps {
  title: string;
  data: ChartDataPoint[];
}

const COLORS = ['#9146FF', '#f97316', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-light-card dark:bg-twitch-dark p-2 border border-light-border dark:border-slate-700 rounded-md shadow-lg">
        <p className="text-light-text dark:text-slate-200">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const PieChartCard: React.FC<PieChartCardProps> = ({ title, data }) => {
  const { settings } = useSettings();
  const animationClass = settings.animationsEnabled ? 'animate-slide-in-up' : '';
  
  if (!data || data.length === 0) {
    return (
        <div className="bg-light-card dark:bg-twitch-card p-6 rounded-2xl shadow-lg border border-light-border dark:border-slate-700 flex flex-col items-center justify-center min-h-[400px]">
            <h3 className="text-xl font-bold text-light-text dark:text-slate-200 mb-4">{title}</h3>
            <p className="text-light-text-secondary dark:text-slate-400 text-center px-4">
              {'No data available for this chart.'}
            </p>
        </div>
    );
  }
  
  return (
    <div className={`bg-light-card dark:bg-twitch-card p-6 rounded-2xl shadow-lg border border-light-border dark:border-slate-700 ${animationClass}`}>
      <h3 className="text-xl font-bold text-light-text dark:text-slate-200 mb-4 text-center">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartCard;