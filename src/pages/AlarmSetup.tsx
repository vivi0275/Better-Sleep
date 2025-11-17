import { useState } from "react";
import { Plus, Calendar, Sparkles, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FigmaViewer from "@/components/FigmaViewer";
import { FIGMA_CONFIG } from "@/config/figma";

const AlarmSetup = () => {
  const [alarms, setAlarms] = useState([
    { id: 1, time: "6:30 AM", enabled: true, days: ["Mon", "Tue", "Wed", "Thu", "Fri"], adaptive: true },
    { id: 2, time: "8:00 AM", enabled: false, days: ["Sat", "Sun"], adaptive: false },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Alarms</h1>
          <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-4">
        {/* Calendar Sync Card */}
        <Card className="p-6 bg-gradient-to-br from-accent/10 to-transparent border-accent/30 shadow-md">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Calendar Integration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Sync with your calendar for smart wake-up suggestions
              </p>
              <Button variant="outline" className="border-accent/50 hover:bg-accent/10">
                Connect Calendar
              </Button>
            </div>
          </div>
        </Card>

        {/* Alarms List */}
        {alarms.map((alarm) => (
          <Card key={alarm.id} className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">{alarm.time}</h2>
              </div>
              <Switch checked={alarm.enabled} />
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {alarm.days.map((day) => (
                <span
                  key={day}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {day}
                </span>
              ))}
            </div>
            
            {alarm.adaptive && (
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  AI-powered adaptive timing enabled
                </span>
              </div>
            )}
          </Card>
        ))}

        {/* Sleep Schedule Setup */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h3 className="font-semibold text-foreground mb-4">Sleep Goal</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="bedtime" className="text-muted-foreground">Bedtime</Label>
              <span className="text-lg font-semibold text-foreground">10:30 PM</span>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="waketime" className="text-muted-foreground">Wake Time</Label>
              <span className="text-lg font-semibold text-foreground">6:30 AM</span>
            </div>
            
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Sleep</span>
                <span className="text-lg font-bold text-primary">8h 0m</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Figma Design Integration - Alarm Setup */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <FigmaViewer 
            fileKey={FIGMA_CONFIG.fileKey}
            nodeIds={FIGMA_CONFIG.alarmSetupNodeIds}
            title="Design Alarm Setup"
          />
        </div>
      </main>
    </div>
  );
};

export default AlarmSetup;
