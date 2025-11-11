import { Bell, Moon, Thermometer, Sun, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SleepChart from "@/components/SleepChart";
import AlarmCard from "@/components/AlarmCard";
import EnvironmentCard from "@/components/EnvironmentCard";

const Dashboard = () => {
  const nextAlarm = {
    time: "6:30 AM",
    label: "Tomorrow",
    type: "adaptive" as const,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 pb-20 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="fixed inset-0 bg-[var(--gradient-mesh)] opacity-50 pointer-events-none" />
      
      <header className="sticky top-0 z-10 glass-card px-6 py-4 backdrop-blur-2xl border-b border-white/10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Alarm
            </h1>
            <p className="text-sm text-muted-foreground font-light">Good evening, rest well</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6 relative z-10">
        {/* Next Alarm Card */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <AlarmCard alarm={nextAlarm} />
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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

        {/* Sleep Chart */}
        <Card className="p-6 glass-card border-0 animate-slide-up hover:shadow-xl transition-shadow duration-500" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Sleep Pattern</h2>
          <SleepChart />
        </Card>

        {/* Environment Monitoring */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <EnvironmentCard data={environmentData} />
        </div>

        {/* AI Recommendation */}
        <Card className="p-6 glass-card border-primary/30 glow-card animate-slide-up relative overflow-hidden group" style={{ animationDelay: '0.5s' }}>
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
      </main>
    </div>
  );
};

export default Dashboard;
