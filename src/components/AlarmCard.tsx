import { Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AlarmCardProps {
  alarm: {
    time: string;
    label: string;
    type: "adaptive" | "manual";
  };
}

const AlarmCard = ({ alarm }: AlarmCardProps) => {
  return (
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
          {alarm.type === "adaptive" && (
            <Badge variant="secondary" className="glass-card border-accent/30 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1.5" />
              <span className="font-medium">AI Optimized</span>
            </Badge>
          )}
        </div>
        <div className="space-y-3">
          <h2 className="text-6xl font-bold bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent tracking-tight">
            {alarm.time}
          </h2>
          <p className="text-muted-foreground font-medium text-lg">{alarm.label}</p>
        </div>
      </div>
    </Card>
  );
};

export default AlarmCard;
