import { TrendingUp, Moon, Clock, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import SleepChart from "@/components/SleepChart";

const Analytics = () => {
  const stats = [
    { label: "This Week", value: "7h 20m", change: "+15min", trend: "up" },
    { label: "Sleep Debt", value: "2h 30m", change: "-45min", trend: "down" },
    { label: "Consistency", value: "82%", change: "+5%", trend: "up" },
  ];

  const weeklyInsights = [
    { day: "Mon", quality: 85, duration: 7.2, bedtime: "10:30 PM", wakeup: "6:00 AM" },
    { day: "Tue", quality: 78, duration: 6.8, bedtime: "11:00 PM", wakeup: "6:00 AM" },
    { day: "Wed", quality: 90, duration: 7.5, bedtime: "10:15 PM", wakeup: "6:00 AM" },
    { day: "Thu", quality: 82, duration: 7.1, bedtime: "10:45 PM", wakeup: "6:00 AM" },
    { day: "Fri", quality: 72, duration: 6.5, bedtime: "11:30 PM", wakeup: "6:30 AM" },
    { day: "Sat", quality: 95, duration: 8.2, bedtime: "11:00 PM", wakeup: "7:30 AM" },
    { day: "Sun", quality: 88, duration: 7.8, bedtime: "10:30 PM", wakeup: "6:30 AM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Sleep Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your sleep patterns</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
              <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className={`text-xs flex items-center gap-1 ${
                stat.trend === "up" ? "text-accent" : "text-primary"
              }`}>
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </p>
            </Card>
          ))}
        </div>

        {/* Sleep Chart */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">7-Day Trend</h2>
          <SleepChart />
        </Card>

        {/* Achievement */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-md">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">3-Day Streak! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                You've maintained your sleep schedule for 3 consecutive days. Keep it up!
              </p>
            </div>
          </div>
        </Card>

        {/* Weekly Details */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">This Week</h2>
          <div className="space-y-3">
            {weeklyInsights.map((day) => (
              <div key={day.day} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-10">{day.day}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{day.duration}h</p>
                    <p className="text-xs text-muted-foreground">{day.quality}% quality</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{day.bedtime}</p>
                  <p className="text-xs text-muted-foreground">{day.wakeup}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
