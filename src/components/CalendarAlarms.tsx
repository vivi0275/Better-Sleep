import { Calendar, Clock, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  location?: string;
  alarmTime: string;
}

interface CalendarAlarmsProps {
  events?: CalendarEvent[];
}

const CalendarAlarms = ({ events }: CalendarAlarmsProps) => {
  // Données d'exemple si pas d'événements fournis
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

  const displayEvents = events || defaultEvents;

  return (
    <Card className="p-6 glass-card border-0 hover:shadow-xl transition-shadow duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Calendar Alarms</h2>
          <p className="text-xs text-muted-foreground">Alarms based on your schedule</p>
        </div>
      </div>

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
                      <span>{event.location}</span>
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

      <div className="mt-4 pt-4 border-t border-border/50">
        <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
          <Calendar className="w-4 h-4 mr-2" />
          Connect Google Calendar
        </Button>
      </div>
    </Card>
  );
};

export default CalendarAlarms;

