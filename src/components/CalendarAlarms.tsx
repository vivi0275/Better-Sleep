import { Calendar, Clock, MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  dateTime?: Date;
  location?: string;
  alarmTime: string;
}

interface CalendarAlarmsProps {
  events?: CalendarEvent[];
}

const CalendarAlarms = ({ events }: CalendarAlarmsProps) => {
  const {
    isInitialized,
    isAuthenticated,
    events: googleEvents,
    loading,
    error,
    userEmail,
    signIn,
    signOut,
    refreshEvents,
  } = useGoogleCalendar();

  // Default events to display
  const defaultEvents: CalendarEvent[] = [
    {
      id: "1",
      title: "Team Meeting",
      time: "9:00 AM",
      date: "Tomorrow",
      location: "Conference Room A",
      alarmTime: "6:30 AM",
    },
    {
      id: "2",
      title: "Doctor Appointment",
      time: "2:00 PM",
      date: "Dec 20",
      location: "Medical Center",
      alarmTime: "7:00 AM",
    },
    {
      id: "3",
      title: "Gym Session",
      time: "7:00 AM",
      date: "Dec 21",
      alarmTime: "6:00 AM",
    },
    {
      id: "4",
      title: "Project Deadline",
      time: "10:00 AM",
      date: "Dec 22",
      alarmTime: "7:30 AM",
    },
  ];

  // Helper function to parse time string to minutes for comparison
  const parseTimeToMinutes = (timeStr: string): number => {
    if (timeStr === 'All Day') return 0;
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return hour24 * 60 + parseInt(minutes);
  };

  // Helper function to get date key for grouping (YYYY-MM-DD format)
  const getDateKey = (event: CalendarEvent): string => {
    if (event.dateTime) {
      const date = new Date(event.dateTime);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    // Fallback: use the date string as key
    return event.date;
  };

  // Get all events and filter to show only first and last event per day
  const getFilteredEvents = (eventList: CalendarEvent[]): CalendarEvent[] => {
    // Group events by date
    const eventsByDate = new Map<string, CalendarEvent[]>();
    
    eventList.forEach(event => {
      const dateKey = getDateKey(event);
      if (!eventsByDate.has(dateKey)) {
        eventsByDate.set(dateKey, []);
      }
      eventsByDate.get(dateKey)!.push(event);
    });

    // For each date, keep only first (earliest) and last (latest) event
    const filteredEvents: CalendarEvent[] = [];
    
    eventsByDate.forEach((dayEvents, dateKey) => {
      if (dayEvents.length === 0) return;
      
      // Sort events by time
      const sortedEvents = [...dayEvents].sort((a, b) => {
        const timeA = parseTimeToMinutes(a.time);
        const timeB = parseTimeToMinutes(b.time);
        return timeA - timeB;
      });

      // Show only the first (earliest) event of the day
      filteredEvents.push(sortedEvents[0]);
    });

    // Sort all filtered events by date and time
    return filteredEvents.sort((a, b) => {
      // First sort by dateTime if available, otherwise by date string
      const dateA = a.dateTime ? a.dateTime.getTime() : new Date(a.date).getTime();
      const dateB = b.dateTime ? b.dateTime.getTime() : new Date(b.date).getTime();
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      // If same date, sort by time
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });
  };

  // Get all events
  const allEvents = isAuthenticated && googleEvents.length > 0
    ? googleEvents.map(e => ({
        id: e.id,
        title: e.title,
        time: e.time,
        date: e.date,
        dateTime: e.dateTime,
        location: e.location,
        alarmTime: e.alarmTime,
      }))
    : events || defaultEvents;

  // Filter to show only first and last event per day
  const displayEvents = getFilteredEvents(allEvents);

  return (
    <Card className="p-6 glass-card border-0 hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Calendar Alarms</h2>
          <p className="text-xs text-muted-foreground">
            {isAuthenticated && userEmail 
              ? `Connected to ${userEmail}`
              : 'Alarms based on your schedule'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      {loading && isAuthenticated ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading calendar events...</span>
        </div>
      ) : displayEvents.length > 0 ? (
        <div className="space-y-3">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-gradient-to-br from-card/50 to-card/30 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground text-sm">{event.title}</h3>
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      {event.date}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{event.time}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-primary">{event.alarmTime}</div>
                  <div className="text-xs text-muted-foreground">Wake-up</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isAuthenticated ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No upcoming events found.</p>
        </div>
      ) : null}

      <div className="mt-4 pt-4 border-t border-border/50">
        {!isInitialized ? (
          <div className="text-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Initializing Google Calendar...</p>
          </div>
        ) : isAuthenticated ? (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full border-primary/30 hover:bg-primary/10"
              onClick={refreshEvents}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Events
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-xs text-muted-foreground"
              onClick={signOut}
            >
              Disconnect Google Calendar
            </Button>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full border-primary/30 hover:bg-primary/10"
            onClick={signIn}
            disabled={!isInitialized || !!error}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Connect Google Calendar
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CalendarAlarms;

