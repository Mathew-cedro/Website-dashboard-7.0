import React from 'react';
import { Appointment } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface RecentAppointmentsListProps {
  appointments: Appointment[];
}

const AppointmentItem: React.FC<{ appointment: Appointment, index: number }> = ({ appointment, index }) => {
  const { settings } = useSettings();
  const statusColor = appointment.Status === 'Completed' ? 'text-green-500' :
                      appointment.Status === 'Scheduled' ? 'text-blue-500' :
                      appointment.Status === 'Cancelled' ? 'text-red-500' :
                      'text-yellow-500';

  const animationClass = settings.animationsEnabled ? 'animate-slide-in-up' : '';

  return (
    <li 
      className={`bg-light-card dark:bg-twitch-card/50 p-4 rounded-lg border border-light-border dark:border-slate-700 flex justify-between items-center ${animationClass}`}
      style={{ animationDelay: settings.animationsEnabled ? `${index * 100}ms` : '0ms' }}
    >
      <div>
        <p className="font-bold text-light-text dark:text-slate-200">{appointment.Appt_type}</p>
        <p className={`text-sm font-semibold ${statusColor}`}>{appointment.Status}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-light-text-secondary dark:text-slate-400">
          {new Date(appointment.Appt_DateTime).toLocaleDateString()}
        </p>
        <p className="text-xs text-light-text-secondary dark:text-slate-500">
          {new Date(appointment.Appt_DateTime).toLocaleTimeString()}
        </p>
      </div>
    </li>
  );
};

const RecentAppointmentsList: React.FC<RecentAppointmentsListProps> = ({ appointments }) => {
  const { settings } = useSettings();
  const animationClass = settings.animationsEnabled ? 'animate-fade-in' : '';

  return (
    <section className={`mt-12 ${animationClass}`}>
      <h2 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-slate-200">
        Recent Appointments
      </h2>
      {appointments.length > 0 ? (
        <ul className="space-y-3 max-w-3xl mx-auto">
          {appointments.map((appt, index) => (
            <AppointmentItem key={appt.Appt_ID} appointment={appt} index={index} />
          ))}
        </ul>
      ) : (
        <div className="bg-light-card dark:bg-twitch-card text-center p-6 rounded-lg border border-light-border dark:border-slate-700 max-w-3xl mx-auto">
          <p className="text-light-text-secondary dark:text-slate-400">No recent appointments to display.</p>
        </div>
      )}
    </section>
  );
};

export default RecentAppointmentsList;