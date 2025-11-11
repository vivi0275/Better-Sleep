import { Bell, Moon, Thermometer, Sun } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Smart Alarm</h1>
            <p className="text-sm text-muted-foreground">Good evening, rest well</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Next Alarm Card */}
        <AlarmCard alarm={nextAlarm} />

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-primary" />
              <p className="text-xs text-muted-foreground">Last Night</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{sleepStats.lastNight}</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-accent" />
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{sleepStats.average}</p>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-accent" />
              <p className="text-xs text-muted-foreground">Quality</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{sleepStats.quality}%</p>
          </Card>
        </div>

        {/* Sleep Chart */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Sleep Pattern</h2>
          <SleepChart />
        </Card>

        {/* Environment Monitoring */}
        <EnvironmentCard data={environmentData} />

        {/* AI Recommendation */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Moon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Smart Suggestion</h3>
              <p className="text-sm text-muted-foreground">
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
