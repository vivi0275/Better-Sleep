import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SleepChartProps {
  data?: Array<{ day: string; hours: number }>;
}

const defaultData = [
  { day: "Mon", hours: 7.2 },
  { day: "Tue", hours: 6.8 },
  { day: "Wed", hours: 7.5 },
  { day: "Thu", hours: 7.1 },
  { day: "Fri", hours: 6.5 },
  { day: "Sat", hours: 8.2 },
  { day: "Sun", hours: 7.8 },
];

const SleepChart = ({ data = defaultData }: SleepChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis 
          dataKey="day" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value.toFixed(1)}h`, "Sleep"]}
        />
        <Area 
          type="monotone" 
          dataKey="hours" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fill="url(#sleepGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SleepChart;
