import { GOOGLE_CALENDAR_CONFIG } from '@/config/googleCalendar';

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  htmlLink?: string;
}

export interface TransformedCalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  dateTime: Date;
  location?: string;
  alarmTime: string;
  description?: string;
}

/**
 * Calculate optimal wake-up time based on event start time
 * Default: 2 hours before event, minimum 6:00 AM
 */
function calculateAlarmTime(eventDateTime: string | Date): string {
  const eventDate = typeof eventDateTime === 'string' 
    ? new Date(eventDateTime) 
    : eventDateTime;
  
  // Set alarm 2 hours before event
  const alarmDate = new Date(eventDate.getTime() - 2 * 60 * 60 * 1000);
  
  // Minimum wake-up time: 6:00 AM
  const minWakeTime = new Date(eventDate);
  minWakeTime.setHours(6, 0, 0, 0);
  
  const finalAlarmDate = alarmDate < minWakeTime ? minWakeTime : alarmDate;
  
  return finalAlarmDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Transform Google Calendar events to app format
 */
export function transformCalendarEvents(
  events: GoogleCalendarEvent[]
): TransformedCalendarEvent[] {
  return events.map((event) => {
    const startDateTime = event.start.dateTime || event.start.date;
    const eventDate = new Date(startDateTime);
    
    return {
      id: event.id,
      title: event.summary || 'No Title',
      time: event.start.dateTime
        ? eventDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : 'All Day',
      date: eventDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      dateTime: eventDate,
      location: event.location,
      alarmTime: calculateAlarmTime(startDateTime),
      description: event.description,
    };
  });
}

/**
 * Mock Google Calendar events - Real events from victorpicart02@gmail.com
 * This simulates a successful Google Calendar connection
 */
function getMockCalendarEvents(): GoogleCalendarEvent[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  
  // Calculate dates - use December 2025, or next December if we're past that
  let targetYear = 2025;
  let targetMonth = 11; // December (0-indexed)
  
  // If we're past December 2025, use next year's December
  if (currentYear > 2025 || (currentYear === 2025 && currentMonth >= 11)) {
    targetYear = currentYear + 1;
  }
  
  const getDate = (day: number, month: number = 11, year: number = targetYear, hour: number = 0, minute: number = 0) => {
    const date = new Date(year, month, day, hour, minute);
    return date.toISOString();
  };

  return [
    // Monday, December 1
    {
      id: 'mock-1',
      summary: 'AI Ethics',
      start: { dateTime: getDate(1, targetMonth, targetYear, 10, 0) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 12, 0) },
    },
    {
      id: 'mock-2',
      summary: 'IOS Cod',
      start: { dateTime: getDate(1, targetMonth, targetYear, 12, 0) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 13, 0) },
    },
    {
      id: 'mock-3',
      summary: 'Climate Change',
      start: { dateTime: getDate(1, targetMonth, targetYear, 14, 15) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 14, 30) },
    },
    {
      id: 'mock-4',
      summary: 'Envoyer message',
      start: { dateTime: getDate(1, targetMonth, targetYear, 16, 0) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 17, 0) },
    },
    {
      id: 'mock-5',
      summary: 'Relancer syndica',
      start: { dateTime: getDate(1, targetMonth, targetYear, 17, 0) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 18, 0) },
    },
    {
      id: 'mock-6',
      summary: 'Bosser e',
      start: { dateTime: getDate(1, targetMonth, targetYear, 18, 0) },
      end: { dateTime: getDate(1, targetMonth, targetYear, 19, 0) },
    },
    // Tuesday, December 2
    {
      id: 'mock-7',
      summary: 'Entrepreneurship',
      start: { dateTime: getDate(2, targetMonth, targetYear, 9, 0) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 12, 0) },
    },
    {
      id: 'mock-8',
      summary: 'UC LAUNCH STARTUP ACCELERATOR DEMO DAY - 10TH ANNIVERSARY',
      description: 'Haas School of Business, 2220 Piedmont Ave, Berkeley, CA',
      location: 'Haas School of Business, 2220 Piedmont Ave, Berkeley, CA',
      start: { dateTime: getDate(2, targetMonth, targetYear, 10, 0) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 13, 30) },
    },
    {
      id: 'mock-9',
      summary: 'Well.Be',
      start: { dateTime: getDate(2, targetMonth, targetYear, 14, 0) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 16, 0) },
    },
    {
      id: 'mock-10',
      summary: 'Product Better Sleep à',
      start: { dateTime: getDate(2, targetMonth, targetYear, 14, 30) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 15, 30) },
    },
    {
      id: 'mock-11',
      summary: 'Envoyer cold mails à toutes les boîtes santé',
      start: { dateTime: getDate(2, targetMonth, targetYear, 16, 0) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 18, 0) },
    },
    {
      id: 'mock-12',
      summary: 'Bosser entretien',
      start: { dateTime: getDate(2, targetMonth, targetYear, 18, 0) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 19, 0) },
    },
    {
      id: 'mock-13',
      summary: 'BUILDdi',
      start: { dateTime: getDate(2, targetMonth, targetYear, 18, 10) },
      end: { dateTime: getDate(2, targetMonth, targetYear, 19, 10) },
    },
    // Wednesday, December 3
    {
      id: 'mock-14',
      summary: 'Victor <> Marcin,',
      start: { dateTime: getDate(3, targetMonth, targetYear, 9, 0) },
      end: { dateTime: getDate(3, targetMonth, targetYear, 10, 0) },
    },
    {
      id: 'mock-15',
      summary: 'Product Management',
      start: { dateTime: getDate(3, targetMonth, targetYear, 13, 30) },
      end: { dateTime: getDate(3, targetMonth, targetYear, 16, 30) },
    },
    {
      id: 'mock-16',
      summary: 'Future of Healthcare',
      start: { dateTime: getDate(3, targetMonth, targetYear, 18, 0) },
      end: { dateTime: getDate(3, targetMonth, targetYear, 20, 0) },
    },
    // Friday, December 5
    {
      id: 'mock-17',
      summary: 'Discussion IOS co',
      start: { dateTime: getDate(5, targetMonth, targetYear, 11, 30) },
      end: { dateTime: getDate(5, targetMonth, targetYear, 12, 30) },
    },
    {
      id: 'mock-18',
      summary: '[Entrepreneurship',
      start: { dateTime: getDate(5, targetMonth, targetYear, 17, 0) },
      end: { dateTime: getDate(5, targetMonth, targetYear, 18, 0) },
    },
    // Saturday, December 6
    {
      id: 'mock-19',
      summary: 'TEST',
      location: 'eHub: 223',
      start: { dateTime: getDate(6, targetMonth, targetYear, 14, 0) },
      end: { dateTime: getDate(6, targetMonth, targetYear, 15, 0) },
    },
    {
      id: 'mock-20',
      summary: 'Weekend Planning',
      start: { dateTime: getDate(6, targetMonth, targetYear, 18, 0) },
      end: { dateTime: getDate(6, targetMonth, targetYear, 19, 0) },
    },
    // Sunday, December 7
    {
      id: 'mock-21',
      summary: 'Morning Run',
      start: { dateTime: getDate(7, targetMonth, targetYear, 8, 0) },
      end: { dateTime: getDate(7, targetMonth, targetYear, 9, 0) },
    },
    {
      id: 'mock-22',
      summary: 'Family Time',
      start: { dateTime: getDate(7, targetMonth, targetYear, 15, 0) },
      end: { dateTime: getDate(7, targetMonth, targetYear, 17, 0) },
    },
    // Monday, December 8
    {
      id: 'mock-23',
      summary: 'Team Standup',
      start: { dateTime: getDate(8, targetMonth, targetYear, 9, 0) },
      end: { dateTime: getDate(8, targetMonth, targetYear, 9, 30) },
    },
    {
      id: 'mock-24',
      summary: 'Project Review',
      start: { dateTime: getDate(8, targetMonth, targetYear, 14, 0) },
      end: { dateTime: getDate(8, targetMonth, targetYear, 16, 0) },
    },
  ]
    .filter(event => {
      // Only show future events
      const eventDate = new Date(event.start.dateTime || event.start.date!);
      return eventDate >= now;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start.dateTime || a.start.date!);
      const dateB = new Date(b.start.dateTime || b.start.date!);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Load Google Calendar events - MOCKED VERSION
 * This simulates a successful Google Calendar API call
 */
export async function loadCalendarEvents(
  gapi: any,
  maxResults: number = 20
): Promise<GoogleCalendarEvent[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock events instead of real API call
  const allEvents = getMockCalendarEvents();
  // Return more events to ensure we have enough for multiple days
  return allEvents.slice(0, maxResults);
}

