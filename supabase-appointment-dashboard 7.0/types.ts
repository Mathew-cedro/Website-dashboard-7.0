

export interface Appointment {
  Appt_ID: number;
  Appt_DateTime: string;
  Status: string;
  Appt_type: string;
  Check_in_Time: string | null;
  [key: string]: any; 
}

export interface ChartDataPoint {
  name: string;
  value: number;
}