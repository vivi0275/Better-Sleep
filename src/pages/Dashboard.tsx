import { useState } from "react";
import { Moon, Thermometer, Sun, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import AlarmCard from "@/components/AlarmCard";
import EnvironmentCard from "@/components/EnvironmentCard";
import CalendarAlarms from "@/components/CalendarAlarms";
import FigmaViewer from "@/components/FigmaViewer";
import { FIGMA_CONFIG } from "@/config/figma";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Dashboard = () => {
  const [nextAlarm, setNextAlarm] = useState({
    time: "6:30 AM",
    label: "Tomorrow",
    type: "adaptive" as const,
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState("06:30");

  // Convert 12h format to 24h format for input
  const convertTo24Hour = (time12h: string) => {
    const [time, period] = time12h.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  // Convert 24h format to 12h format for display
  const convertTo12Hour = (time24h: string) => {
    const [hours, minutes] = time24h.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const sleepStats = {
    lastNight: "7h 24m",
    average: "7h 15m",
    quality: 85,
  };

  const environmentData = {
    temperature: 68,
    light: 12,
    optimal: false,
  };

  const handleEditAlarm = () => {
    setNewAlarmTime(convertTo24Hour(nextAlarm.time));
    setIsEditDialogOpen(true);
  };

  const handleSaveAlarm = () => {
    setNextAlarm({
      ...nextAlarm,
      time: convertTo12Hour(newAlarmTime),
    });
    setIsEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-20 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="fixed inset-0 bg-[var(--gradient-mesh)] opacity-50 pointer-events-none" />
      
      {/* Title centered at top */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Better Sleep
        </h1>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6 relative z-10">
        {/* Smart Suggestion */}
        <Card className="p-6 glass-card border-primary/30 glow-card animate-slide-up relative overflow-hidden group" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-500" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg animate-float">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2 text-lg">Smart Suggestion</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tomorrow's wake-up adjusted to 6:30 AM for your first meeting at 9:00 AM. 
                This gives you 30 minutes extra for morning routine.
              </p>
            </div>
          </div>
        </Card>

        {/* Next Alarm Card */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <AlarmCard alarm={nextAlarm} onEdit={handleEditAlarm} />
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Card className="group p-5 glass-card hover:glow-card transition-all duration-500 hover:scale-105 cursor-pointer border-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Moon className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Last Night</p>
            <p className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {sleepStats.lastNight}
            </p>
          </Card>
          
          <Card className="group p-5 glass-card hover:glow-card transition-all duration-500 hover:scale-105 cursor-pointer border-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Moon className="w-4 h-4 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Average</p>
            <p className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {sleepStats.average}
            </p>
          </Card>
          
          <Card className="group p-5 glass-card hover:glow-card transition-all duration-500 hover:scale-105 cursor-pointer border-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Sun className="w-4 h-4 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-medium mb-1">Quality</p>
            <p className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {sleepStats.quality}%
            </p>
          </Card>
        </div>

        {/* Environment Monitoring */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <EnvironmentCard data={environmentData} />
        </div>

        {/* Calendar Alarms */}
        <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <CalendarAlarms />
        </div>

        {/* Figma Design Integration - Dashboard */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <FigmaViewer 
            fileKey={FIGMA_CONFIG.fileKey}
            nodeIds={FIGMA_CONFIG.dashboardNodeIds}
            title="Design Dashboard"
          />
        </div>
      </main>

      {/* Edit Alarm Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Alarm Time</DialogTitle>
            <DialogDescription>
              Set a new wake-up time for your alarm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="alarm-time">Alarm Time</Label>
              <Input
                id="alarm-time"
                type="time"
                value={newAlarmTime}
                onChange={(e) => setNewAlarmTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSaveAlarm} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
