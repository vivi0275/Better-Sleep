import { Thermometer, Sun, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EnvironmentCardProps {
  data: {
    temperature: number;
    light: number;
    optimal: boolean;
  };
}

const EnvironmentCard = ({ data }: EnvironmentCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-md border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Environment</h2>
        {!data.optimal && (
          <Badge variant="outline" className="border-destructive/50 text-destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Optimal
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Thermometer className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data.temperature}°F</p>
            <p className="text-xs text-muted-foreground">Temperature</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Sun className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{data.light} lux</p>
            <p className="text-xs text-muted-foreground">Light Level</p>
          </div>
        </div>
      </div>
      
      {!data.optimal && (
        <div className="mt-4 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
          <p className="text-xs text-muted-foreground">
            Temperature is slightly high. Consider lowering to 65-68°F for optimal sleep.
          </p>
        </div>
      )}
    </Card>
  );
};

export default EnvironmentCard;
