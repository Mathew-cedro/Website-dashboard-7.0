import { Appointment } from '../types';
import { generateFacts } from './geminiService';

// Helper to create a summary of data for a specific key
const createSummary = (appointments: Appointment[], key: keyof Appointment) => {
    const total = appointments.length;
    const counts = appointments.reduce((acc, item) => {
        const value = String(item[key]);
        if (value && value !== 'null' && value !== 'undefined') {
             acc[value] = (acc[value] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);
    return { total, counts };
};

// Helper for check-in time summary
const createCheckInSummary = (checkInAppointments: Appointment[]) => {
    const total = checkInAppointments.length;
    const countsByHour: Record<string, number> = {};
    checkInAppointments.forEach(appt => {
        if (appt.Check_in_Time) {
            const hour = appt.Check_in_Time.substring(0, 2) + ':00';
            countsByHour[hour] = (countsByHour[hour] || 0) + 1;
        }
    });
    const peakHour = Object.keys(countsByHour).length > 0
        ? Object.keys(countsByHour).reduce((a, b) => countsByHour[a] > countsByHour[b] ? a : b)
        : 'N/A';

    return { total, countsByHour, peakHour };
};

export const generateStatusFacts = async (appointments: Appointment[]): Promise<string[]> => {
    if (appointments.length === 0) return [];
    const summary = createSummary(appointments, 'Status');
    if (Object.keys(summary.counts).length === 0) return ["No status data available."];
    const prompt = `
        Analyze the following appointment status data and generate exactly 5 insightful, brief facts for a dashboard.
        The data represents the count of each status. Be creative and vary the sentence structure.
        Total appointments: ${summary.total}.
        Status counts: ${JSON.stringify(summary.counts)}.
    `;
    return generateFacts(prompt);
};

export const generateAppointmentTypeFacts = async (appointments: Appointment[]): Promise<string[]> => {
    if (appointments.length === 0) return [];
    const summary = createSummary(appointments, 'Appt_type');
    if (Object.keys(summary.counts).length === 0) return ["No appointment type data available."];
    const prompt = `
        Analyze the following appointment type data and generate exactly 5 insightful, brief facts for a dashboard.
        The data shows how many appointments of each type there are. Be creative and vary the sentence structure.
        Total appointments: ${summary.total}.
        Type counts: ${JSON.stringify(summary.counts)}.
    `;
    return generateFacts(prompt);
};

export const generateCheckInFacts = async (checkInAppointments: Appointment[], dayLabel: string | null): Promise<string[]> => {
    const dayDescription = dayLabel ? `${dayLabel.toLowerCase()}` : "the most recent day";
    if (checkInAppointments.length === 0) return [`No check-in data available for ${dayDescription}.`];
    const summary = createCheckInSummary(checkInAppointments);
    const prompt = `
        Analyze the following appointment check-in time data from ${dayDescription} and generate exactly 5 insightful, brief facts for a dashboard.
        The data shows the number of check-ins per hour. Be creative and highlight trends like peak hours, lulls, or patterns for the day's activity.
        Total check-ins for the day: ${summary.total}.
        Check-ins per hour: ${JSON.stringify(summary.countsByHour)}.
        The busiest hour was ${summary.peakHour}.
    `;
    return generateFacts(prompt);
};

export const generateOverallCheckInFacts = async (allCheckInAppointments: Appointment[]): Promise<string[]> => {
    if (allCheckInAppointments.length === 0) return ["No overall check-in data available."];
    const summary = createCheckInSummary(allCheckInAppointments);
    const prompt = `
        Analyze the following overall appointment check-in time data across all time and generate exactly 5 insightful, brief facts for a dashboard.
        The data shows the total number of check-ins per hour. Be creative and highlight long-term trends like the most common peak hours, quietest periods, or consistent patterns.
        Total check-ins (all time): ${summary.total}.
        Check-ins per hour (all time): ${JSON.stringify(summary.countsByHour)}.
        The busiest hour overall is ${summary.peakHour}.
    `;
    return generateFacts(prompt);
};