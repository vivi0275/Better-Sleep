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
    <Card className="p-6 glass-card border-0 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Environment</h2>
          {!data.optimal && (
            <Badge variant="outline" className="border-destructive/50 text-destructive glass-card">
              <AlertCircle className="w-3 h-3 mr-1.5" />
              Not Optimal
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent hover:from-primary/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{data.temperature}°F</p>
              <p className="text-xs text-muted-foreground font-medium">Temperature</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent hover:from-accent/15 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{data.light}</p>
              <p className="text-xs text-muted-foreground font-medium">Light (lux)</p>
            </div>
          </div>
        </div>
        
        {!data.optimal && (
          <div className="mt-6 p-4 glass-card rounded-xl border border-destructive/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              💡 Temperature is slightly high. Consider lowering to 65-68°F for optimal sleep quality.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnvironmentCard;
