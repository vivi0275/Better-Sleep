import { useState } from "react";
import { TrendingUp, Moon, Clock, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SleepChart from "@/components/SleepChart";

type Period = "week" | "month" | "year";

const Analytics = () => {
  const [period, setPeriod] = useState<Period>("week");

  const stats = [
    { label: "This Week", value: "7h 20m", change: "+15min", trend: "up" },
    { label: "Sleep Debt", value: "2h 30m", change: "-45min", trend: "down" },
    { label: "Consistency", value: "82%", change: "+5%", trend: "up" },
  ];

  const weeklyInsights = [
    { day: "Mon", quality: 85, duration: 7.2, durationFormatted: "7h 42m", bedtime: "10:30 PM", wakeup: "6:00 AM" },
    { day: "Tue", quality: 72, duration: 6.5, durationFormatted: "6h 30m", bedtime: "11:00 PM", wakeup: "6:00 AM" },
    { day: "Wed", quality: 92, duration: 8.2, durationFormatted: "8h 12m", bedtime: "10:15 PM", wakeup: "6:00 AM" },
    { day: "Thu", quality: 83, duration: 7.5, durationFormatted: "7h 30m", bedtime: "10:45 PM", wakeup: "6:00 AM" },
    { day: "Fri", quality: 68, duration: 6.2, durationFormatted: "6h 12m", bedtime: "11:30 PM", wakeup: "6:30 AM" },
    { day: "Sat", quality: 88, duration: 9.1, durationFormatted: "9h 6m", bedtime: "11:00 PM", wakeup: "7:30 AM" },
    { day: "Sun", quality: 86, duration: 7.6, durationFormatted: "7h 36m", bedtime: "10:30 PM", wakeup: "6:30 AM" },
  ];

  const getQualityBadgeColor = (quality: number) => {
    if (quality >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (quality >= 70) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  // Monthly data (4 weeks)
  const monthlyData = [
    { week: "Week 1", hours: 7.2, quality: 82 },
    { week: "Week 2", hours: 7.5, quality: 85 },
    { week: "Week 3", hours: 7.1, quality: 80 },
    { week: "Week 4", hours: 7.3, quality: 83 },
  ];

  // Generate yearly data (12 months)
  const yearlyData = [
    { month: "Jan", hours: 7.2, quality: 82 },
    { month: "Feb", hours: 7.5, quality: 85 },
    { month: "Mar", hours: 7.1, quality: 80 },
    { month: "Apr", hours: 7.3, quality: 83 },
    { month: "May", hours: 7.4, quality: 84 },
    { month: "Jun", hours: 7.6, quality: 86 },
    { month: "Jul", hours: 7.2, quality: 81 },
    { month: "Aug", hours: 7.3, quality: 82 },
    { month: "Sep", hours: 7.5, quality: 85 },
    { month: "Oct", hours: 7.4, quality: 84 },
    { month: "Nov", hours: 7.1, quality: 80 },
    { month: "Dec", hours: 7.3, quality: 83 },
  ];

  const getChartData = () => {
    if (period === "week") {
      return weeklyInsights.map((day) => ({ day: day.day, hours: day.duration }));
    } else if (period === "month") {
      return monthlyData.map((week) => ({ day: week.week, hours: week.hours }));
    } else {
      return yearlyData.map((month) => ({ day: month.month, hours: month.hours }));
    }
  };

  const getBreakdownData = () => {
    if (period === "week") {
      return weeklyInsights;
    } else if (period === "month") {
      return monthlyData.map((week, i) => ({
        day: week.week,
        quality: Math.round(week.quality),
        duration: week.hours,
        durationFormatted: `${Math.floor(week.hours)}h ${Math.round((week.hours % 1) * 60)}m`,
      }));
    } else {
      return yearlyData.map((month) => ({
        day: month.month,
        quality: month.quality,
        duration: month.hours,
        durationFormatted: `${Math.floor(month.hours)}h ${Math.round((month.hours % 1) * 60)}m`,
      }));
    }
  };

  const getBreakdownTitle = () => {
    if (period === "week") return "Weekly Breakdown";
    if (period === "month") return "Monthly Breakdown";
    return "Yearly Breakdown";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20">
      {/* Title centered at top */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          Your Sleep
        </h1>
        <div className="max-w-2xl mx-auto px-6">
          <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger 
                value="week"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="year"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Sleep Duration Graph */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Sleep Duration</h2>
          <SleepChart data={getChartData()} />
        </Card>

        {/* Breakdown */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">{getBreakdownTitle()}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getBreakdownData().map((item) => (
              <div
                key={item.day}
                className="flex-shrink-0 w-24 p-3 bg-secondary/50 rounded-lg border border-border/50"
              >
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-2">{item.day}</p>
                  <p className="text-sm font-semibold text-foreground mb-2">{item.durationFormatted}</p>
                  <div className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-medium border ${getQualityBadgeColor(item.quality)}`}>
                    {item.quality}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

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
      </main>
    </div>
  );
};

export default Analytics;
