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
    <Card className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Next Alarm</span>
        </div>
        {alarm.type === "adaptive" && (
          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/30">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Optimized
          </Badge>
        )}
      </div>
      <div className="space-y-2">
        <h2 className="text-5xl font-bold text-foreground tracking-tight">{alarm.time}</h2>
        <p className="text-muted-foreground">{alarm.label}</p>
      </div>
    </Card>
  );
};

export default AlarmCard;
