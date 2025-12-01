import { useState, useEffect } from "react";
import { Moon, Thermometer, Sun, Clock, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useDeviceTime, formatTime12Hour, formatDate } from "@/hooks/useDeviceTime";
import { useAlarmRecommendation } from "@/hooks/useAlarmRecommendation";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

const Dashboard = () => {
  const deviceTime = useDeviceTime();
  const { events: calendarEvents } = useGoogleCalendar();
  
  // Calculate default alarm time based on next event or default
  const getDefaultAlarmTime = () => {
    if (calendarEvents.length > 0) {
      const nextEvent = calendarEvents[0];
      const eventTime = nextEvent.dateTime;
      // Set alarm 2 hours before event, minimum 6:00 AM
      const alarmDate = new Date(eventTime.getTime() - 2 * 60 * 60 * 1000);
      const minWakeTime = new Date(eventTime);
      minWakeTime.setHours(6, 0, 0, 0);
      const finalAlarmDate = alarmDate < minWakeTime ? minWakeTime : alarmDate;
      return finalAlarmDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    }
    return "6:30 AM";
  };

  const [nextAlarm, setNextAlarm] = useState({
    time: getDefaultAlarmTime(),
    label: calendarEvents.length > 0 ? `Before ${calendarEvents[0].title}` : "Tomorrow",
    type: "adaptive" as const,
    reasoning: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newAlarmTime, setNewAlarmTime] = useState("06:30");
  const [useAIRecommendation, setUseAIRecommendation] = useState(true);

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
    airQuality: 45, // AQI (Air Quality Index)
    noiseLevel: 32, // dB (decibels)
    optimal: false,
  };

  // Get next calendar event
  const nextEvent = calendarEvents.length > 0 ? {
    title: calendarEvents[0].title,
    time: calendarEvents[0].time,
    date: calendarEvents[0].date,
    dateTime: calendarEvents[0].dateTime,
    location: calendarEvents[0].location,
  } : undefined;

  // Get AI recommendation for alarm time
  const { 
    data: aiRecommendation, 
    isLoading: isLoadingAI, 
    error: aiError,
    refetch: refetchAI 
  } = useAlarmRecommendation({
    sleepData: {
      lastNight: sleepStats.lastNight,
      average: sleepStats.average,
      quality: sleepStats.quality,
      temperature: environmentData.temperature,
      light: environmentData.light,
      airQuality: environmentData.airQuality,
      noiseLevel: environmentData.noiseLevel,
    },
    environmentData: {
      temperature: environmentData.temperature,
      light: environmentData.light,
      airQuality: environmentData.airQuality,
      noiseLevel: environmentData.noiseLevel,
    },
    nextEvent,
    currentTime: deviceTime,
    enabled: useAIRecommendation,
  });

  // Update alarm when AI recommendation is available
  useEffect(() => {
    if (useAIRecommendation && aiRecommendation && !isLoadingAI) {
      console.log('AI Recommendation received:', aiRecommendation);
      setNextAlarm(prev => ({
        ...prev,
        time: aiRecommendation.recommendedTime,
        label: nextEvent ? `Before ${nextEvent.title}` : "AI Optimized",
        type: "adaptive",
        reasoning: aiRecommendation.reasoning,
      }));
    }
  }, [aiRecommendation, useAIRecommendation, isLoadingAI, nextEvent]);

  // Initialize with default time when calendar events are available
  useEffect(() => {
    if (calendarEvents.length > 0 && !useAIRecommendation && nextAlarm.time === "6:30 AM" && nextAlarm.label === "Tomorrow") {
      const defaultTime = getDefaultAlarmTime();
      setNextAlarm({
        time: defaultTime,
        label: `Before ${calendarEvents[0].title}`,
        type: "manual",
        reasoning: "",
      });
    }
  }, [calendarEvents, useAIRecommendation, nextAlarm.time, nextAlarm.label]);

  // Fallback to default if AI fails and we're still trying to use it
  useEffect(() => {
    if (useAIRecommendation && aiError && !isLoadingAI) {
      console.warn('AI failed, using default calculation');
      const defaultTime = getDefaultAlarmTime();
      setNextAlarm(prev => {
        // Only update if we don't have a valid AI recommendation
        if (prev.type === "adaptive" && !prev.reasoning) {
          return {
            ...prev,
            time: defaultTime,
            label: nextEvent ? `Before ${nextEvent.title}` : "Default",
            type: "manual",
          };
        }
        return prev;
      });
    }
  }, [aiError, isLoadingAI, useAIRecommendation, nextEvent]);

  // Log errors for debugging
  useEffect(() => {
    if (aiError) {
      console.error('AI Recommendation Error:', aiError);
    }
  }, [aiError]);

  const handleEditAlarm = () => {
    setNewAlarmTime(convertTo24Hour(nextAlarm.time));
    setIsEditDialogOpen(true);
  };

  const handleSaveAlarm = () => {
    setNextAlarm({
      ...nextAlarm,
      time: convertTo12Hour(newAlarmTime),
      type: "manual",
    });
    setUseAIRecommendation(false); // Disable AI when manually set
    setIsEditDialogOpen(false);
  };

  const handleUseAIRecommendation = () => {
    setUseAIRecommendation(true);
    refetchAI();
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
        {/* Current Device Time */}
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{formatTime12Hour(deviceTime)}</span>
          <span className="text-xs">•</span>
          <span className="text-xs">{formatDate(deviceTime)}</span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6 relative z-10">
        {/* Next Alarm Card */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="group p-8 glass-card border-0 glow-card hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 group-hover:from-primary/15 group-hover:to-accent/15 transition-all duration-500" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">Next Alarm</span>
                </div>
                <div className="flex items-center gap-2">
                  {nextAlarm.type === "adaptive" && (
                    <Badge variant="secondary" className="glass-card border-accent/30 px-3 py-1">
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      <span className="font-medium">AI Optimized</span>
                    </Badge>
                  )}
                  {isLoadingAI && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  {!useAIRecommendation && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleUseAIRecommendation}
                      className="h-7 text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Use AI
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h2 className="text-6xl font-bold bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent tracking-tight">
                  {nextAlarm.time}
                  {isLoadingAI && (
                    <span className="ml-3 inline-flex items-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </span>
                  )}
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                  {isLoadingAI ? 'Calculating optimal time...' : nextAlarm.label}
                </p>
                {nextAlarm.reasoning && nextAlarm.type === "adaptive" && (
                  <p className="text-sm text-muted-foreground mt-2 italic">
                    {nextAlarm.reasoning}
                  </p>
                )}
                {aiError && (
                  <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive font-medium">
                      {aiError.isRateLimit || (aiError as any)?.status === 429
                        ? 'Rate limit exceeded. Please try again later.'
                        : `Unable to get AI recommendation: ${aiError.message || 'Unknown error'}`}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetchAI()}
                      className="mt-2 text-xs"
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full border-primary/30 hover:bg-primary/10"
                  onClick={handleEditAlarm}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Change Alarm
                </Button>
              </div>
            </div>
          </Card>
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
