import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAppointments, subscribeToAppointmentChanges, unsubscribeFromChanges } from './services/supabaseService';
import { generateStatusFacts, generateAppointmentTypeFacts, generateCheckInFacts, generateOverallCheckInFacts } from './services/factService';
import PieChartCard from './components/PieChartCard';
import FactCard from './components/FactCard';
import LoadingSpinner from './components/LoadingSpinner';
import RecentAppointmentsList from './components/RecentAppointmentsList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SettingsPage from './components/SettingsPage';
import LineChartCard from './components/LineChartCard';
import { Appointment, ChartDataPoint } from './types';
import { useSettings } from './contexts/SettingsContext';
import ApiKeyWarning from './components/ApiKeyWarning';

type Page = 'Dashboard' | 'Settings';

const App: React.FC = () => {
  // Early return if API key is not set in the environment
  if (!import.meta.env.VITE_API_KEY) {
    return <ApiKeyWarning />;
  }
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [statusFacts, setStatusFacts] = useState<string[]>([]);
  const [appointmentTypeFacts, setAppointmentTypeFacts] = useState<string[]>([]);
  const [checkInFacts, setCheckInFacts] = useState<string[]>([]);
  const [overallCheckInFacts, setOverallCheckInFacts] = useState<string[]>([]);
  const [factsLoading, setFactsLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const { settings } = useSettings();

  const handleDbChange = useCallback((payload: any) => {
    loadData(false); 

    if (!settings.notifications.enabled || !('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }
    
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT' && settings.notifications.onNew) {
      new Notification('New Appointment Scheduled', {
        body: `A new "${newRecord.Appt_type}" appointment has been added.`,
      });
    }

    if (eventType === 'UPDATE' && settings.notifications.onCancelled && oldRecord.Status !== 'Cancelled' && newRecord.Status === 'Cancelled') {
      new Notification('Appointment Cancelled', {
        body: `The "${newRecord.Appt_type}" appointment has been cancelled.`,
      });
    }
  }, [settings.notifications]);

  const loadData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      setError(null);
      const appointmentData = await fetchAppointments();
      setAppointments(appointmentData);
    } catch (err) {
      setError(err instanceof Error ? `Failed to load data: ${err.message}` : "An unknown error occurred.");
      setAppointments([]);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(true);
    const channel = subscribeToAppointmentChanges(handleDbChange);
    return () => {
      unsubscribeFromChanges(channel);
    };
  }, [loadData, handleDbChange]);

  const recentAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => b.Appt_ID - a.Appt_ID).slice(0, 5);
  }, [appointments]);

  const allCheckInAppointments = useMemo(() => appointments.filter(a => !!a.Check_in_Time), [appointments]);

  const { checkInAppointments, mostRecentDayFormatted } = useMemo(() => {
    const appointmentsWithCheckIn = appointments.filter(a => a.Check_in_Time && !isNaN(new Date(a.Appt_DateTime).getTime()));
    if (appointmentsWithCheckIn.length === 0) {
      return { checkInAppointments: [], mostRecentDayFormatted: null };
    }

    // Find the most recent date from Appt_DateTime for appointments that have a Check_in_Time
    const mostRecentDate = appointmentsWithCheckIn
      .map(a => new Date(a.Appt_DateTime))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    if (!mostRecentDate) {
       return { checkInAppointments: [], mostRecentDayFormatted: null };
    }
    
    const mostRecentDateStr = mostRecentDate.toISOString().split('T')[0];

    const filteredAppointments = appointments.filter(a => {
      if (!a.Check_in_Time || isNaN(new Date(a.Appt_DateTime).getTime())) return false;
      const apptDateStr = new Date(a.Appt_DateTime).toISOString().split('T')[0];
      return apptDateStr === mostRecentDateStr;
    });

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let formattedDate;
    if (mostRecentDateStr === today) {
      formattedDate = 'Today';
    } else if (mostRecentDateStr === yesterday) {
      formattedDate = 'Yesterday';
    } else {
      formattedDate = mostRecentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    return { checkInAppointments: filteredAppointments, mostRecentDayFormatted: formattedDate };
  }, [appointments]);

  useEffect(() => {
    const generateAllFacts = async () => {
        if (appointments.length > 0) {
            setFactsLoading(true);
            try {
                const [statusResult, typeResult, checkInResult, overallCheckInResult] = await Promise.all([
                    generateStatusFacts(appointments),
                    generateAppointmentTypeFacts(appointments),
                    generateCheckInFacts(checkInAppointments, mostRecentDayFormatted),
                    generateOverallCheckInFacts(allCheckInAppointments)
                ]);
                setStatusFacts(statusResult);
                setAppointmentTypeFacts(typeResult);
                setCheckInFacts(checkInResult);
                setOverallCheckInFacts(overallCheckInResult);
            } catch (err) {
                console.error("Failed to generate facts:", err);
                const errorFact = ["Could not generate insights at this time."];
                setStatusFacts(errorFact);
                setAppointmentTypeFacts(errorFact);
                setCheckInFacts(errorFact);
                setOverallCheckInFacts(errorFact);
            } finally {
                setFactsLoading(false);
            }
        } else {
            setStatusFacts([]);
            setAppointmentTypeFacts([]);
            setCheckInFacts([]);
            setOverallCheckInFacts([]);
        }
    };

    if (!loading) { // Only generate facts after initial data load is complete
        generateAllFacts();
    }
  }, [appointments, checkInAppointments, allCheckInAppointments, loading, mostRecentDayFormatted]);

  const processChartData = useCallback((data: Appointment[], key: keyof Appointment): ChartDataPoint[] => {
    const counts = data.reduce((acc, item) => {
      const value = String(item[key]);
      if (value) acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, []);
  
  const statusChartData = useMemo(() => processChartData(appointments, 'Status'), [appointments, processChartData]);
  const apptTypeChartData = useMemo(() => processChartData(appointments, 'Appt_type'), [appointments, processChartData]);

  const checkInChartData = useMemo(() => {
    const countsByHour: Record<string, number> = {};
    // Initialize all hours from 00:00 to 23:00 to ensure a full day's axis
    for (let i = 0; i < 24; i++) {
        const hourString = i.toString().padStart(2, '0') + ':00';
        countsByHour[hourString] = 0;
    }

    checkInAppointments.forEach(appt => {
        if (appt.Check_in_Time) {
            const hour = appt.Check_in_Time.substring(0, 2);
            const hourString = hour + ':00';
            if (countsByHour.hasOwnProperty(hourString)) {
                countsByHour[hourString]++;
            }
        }
    });
    
    return Object.entries(countsByHour).map(([hour, count]) => ({ hour, count }));
  }, [checkInAppointments]);

  const overallCheckInChartData = useMemo(() => {
    const countsByHour: Record<string, number> = {};
    for (let i = 0; i < 24; i++) {
        const hourString = i.toString().padStart(2, '0') + ':00';
        countsByHour[hourString] = 0;
    }

    allCheckInAppointments.forEach(appt => {
        if (appt.Check_in_Time) {
            const hour = appt.Check_in_Time.substring(0, 2);
            const hourString = hour + ':00';
            if (countsByHour.hasOwnProperty(hourString)) {
                countsByHour[hourString]++;
            }
        }
    });
    
    return Object.entries(countsByHour).map(([hour, count]) => ({ hour, count }));
  }, [allCheckInAppointments]);

  if (loading) {
    return <LoadingSpinner />;
  }
  
  const animationClass = settings.animationsEnabled ? 'animate-fade-in' : '';

  const renderFactList = (facts: string[]) => {
    if (factsLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <div className="text-center text-light-text-secondary dark:text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto animate-spin text-twitch-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
             <p className="mt-2">Generating insights with Gemini...</p>
          </div>
        </div>
      );
    }
     if (appointments.length === 0 || facts.length === 0) {
      return (
         <p className="text-light-text-secondary dark:text-slate-400 text-center">
            {'No data to generate facts.'}
         </p>
      )
    }
    return (
       <div className="flex flex-col gap-4">
        {facts.map((fact, index) => (
          <FactCard key={`fact-${index}`} fact={fact} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-light-bg dark:bg-twitch-dark text-light-text dark:text-white font-sans overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto scrollbar-thin ${animationClass}`}>
          <div className="container mx-auto">
            {activePage === 'Dashboard' && (
               <>
                {error ? (
                  <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                  </div>
                ) : (
                  <>
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                      <PieChartCard title="Appointments by Status" data={statusChartData} />
                      <PieChartCard title="Appointments by Type" data={apptTypeChartData} />
                    </section>
                    
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                      <LineChartCard title={`Hourly Check-ins (${mostRecentDayFormatted || 'Most Recent Day'})`} data={checkInChartData} />
                      <LineChartCard title="Overall Hourly Check-ins (All Time)" data={overallCheckInChartData} />
                    </section>
                    
                    <RecentAppointmentsList appointments={recentAppointments} />

                    <section className="mt-12">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-7xl mx-auto">
                        <div>
                          <h2 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-slate-200">
                            Status Insights
                          </h2>
                          {renderFactList(statusFacts)}
                        </div>
                         <div>
                          <h2 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-slate-200">
                            Type Insights
                          </h2>
                          {renderFactList(appointmentTypeFacts)}
                        </div>
                         <div>
                          <h2 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-slate-200">
                            Check-in Insights ({mostRecentDayFormatted || 'Recent'})
                          </h2>
                          {renderFactList(checkInFacts)}
                        </div>
                         <div>
                          <h2 className="text-2xl font-bold text-center mb-6 text-light-text dark:text-slate-200">
                            Overall Check-in Insights
                          </h2>
                          {renderFactList(overallCheckInFacts)}
                        </div>
                      </div>
                    </section>
                  </>
                )}
               </>
            )}
            {activePage === 'Settings' && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;