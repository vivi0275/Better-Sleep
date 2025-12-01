import { useState, useEffect } from "react";
import { Thermometer, Sun, AlertCircle, Wind, Volume2, Settings2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type EnvironmentVariable = 'temperature' | 'light' | 'airQuality' | 'noiseLevel';

interface EnvironmentData {
  temperature: number;
  light: number;
  airQuality?: number;
  noiseLevel?: number;
  optimal: boolean;
}

interface EnvironmentCardProps {
  data: EnvironmentData;
}

const STORAGE_KEY = 'environment-visible-variables';

// Variable definitions with icons and labels
const VARIABLE_DEFINITIONS: Record<EnvironmentVariable, { 
  icon: typeof Thermometer; 
  label: string; 
  unit: string;
  color: string;
}> = {
  temperature: {
    icon: Thermometer,
    label: 'Temperature',
    unit: '°F',
    color: 'from-primary to-primary/70',
  },
  light: {
    icon: Sun,
    label: 'Light',
    unit: 'lux',
    color: 'from-accent to-accent/70',
  },
  airQuality: {
    icon: Wind,
    label: 'Air Quality',
    unit: 'AQI',
    color: 'from-blue-500 to-blue-400',
  },
  noiseLevel: {
    icon: Volume2,
    label: 'Noise Level',
    unit: 'dB',
    color: 'from-purple-500 to-purple-400',
  },
};

const EnvironmentCard = ({ data }: EnvironmentCardProps) => {
  // Always show temperature and light (first 2)
  const defaultVisible: EnvironmentVariable[] = ['temperature', 'light'];
  
  const [visibleVariables, setVisibleVariables] = useState<EnvironmentVariable[]>(() => {
    // Load from localStorage or use defaults
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure temperature and light are always included
          const combined = [...new Set([...defaultVisible, ...parsed])];
          return combined.filter(v => v === 'temperature' || v === 'light' || parsed.includes(v));
        } catch {
          return defaultVisible;
        }
      }
    }
    return defaultVisible;
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Save to localStorage when visibleVariables change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only save the additional variables (not temperature and light)
      const additional = visibleVariables.filter(v => !defaultVisible.includes(v));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(additional));
    }
  }, [visibleVariables]);

  const toggleVariable = (variable: EnvironmentVariable) => {
    // Temperature and light cannot be toggled off
    if (defaultVisible.includes(variable)) return;
    
    setVisibleVariables(prev => {
      if (prev.includes(variable)) {
        return prev.filter(v => v !== variable);
      } else {
        return [...prev, variable];
      }
    });
  };

  const getVariableValue = (variable: EnvironmentVariable): number | undefined => {
    switch (variable) {
      case 'temperature':
        return data.temperature;
      case 'light':
        return data.light;
      case 'airQuality':
        return data.airQuality;
      case 'noiseLevel':
        return data.noiseLevel;
      default:
        return undefined;
    }
  };

  const getVariableColor = (variable: EnvironmentVariable): string => {
    return VARIABLE_DEFINITIONS[variable].color;
  };

  const displayedVariables = visibleVariables.filter(v => {
    const value = getVariableValue(v);
    return value !== undefined;
  });

  return (
    <>
      <Card className="p-6 glass-card border-0 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent group-hover:from-primary/10 transition-all duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Environment</h2>
            <div className="flex items-center gap-2">
              {!data.optimal && (
                <Badge variant="outline" className="border-destructive/50 text-destructive glass-card">
                  <AlertCircle className="w-3 h-3 mr-1.5" />
                  Not Optimal
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="h-8 w-8 p-0"
                title="Customize environment variables"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className={`grid gap-6 ${
            displayedVariables.length === 2 ? 'grid-cols-2' : 
            displayedVariables.length === 3 ? 'grid-cols-3' : 
            displayedVariables.length === 4 ? 'grid-cols-2' : 
            'grid-cols-2'
          }`}>
            {displayedVariables.map((variable) => {
              const value = getVariableValue(variable);
              if (value === undefined) return null;
              
              const Icon = VARIABLE_DEFINITIONS[variable].icon;
              const label = VARIABLE_DEFINITIONS[variable].label;
              const unit = VARIABLE_DEFINITIONS[variable].unit;
              const colorClass = getVariableColor(variable);
              
              return (
                <div
                  key={variable}
                  className={`flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br ${
                    variable === 'temperature' ? 'from-primary/10 to-transparent hover:from-primary/15' :
                    variable === 'light' ? 'from-accent/10 to-transparent hover:from-accent/15' :
                    variable === 'airQuality' ? 'from-blue-500/10 to-transparent hover:from-blue-500/15' :
                    'from-purple-500/10 to-transparent hover:from-purple-500/15'
                  } transition-all duration-300`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {value}{variable === 'temperature' ? '°F' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {label} {unit && `(${unit})`}
                    </p>
                  </div>
                </div>
              );
            })}
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

      {/* Customize Variables Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize Environment Variables</DialogTitle>
            <DialogDescription>
              Select which environment variables to display. Temperature and Light are always visible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {(['temperature', 'light', 'airQuality', 'noiseLevel'] as EnvironmentVariable[]).map((variable) => {
              const Icon = VARIABLE_DEFINITIONS[variable].icon;
              const label = VARIABLE_DEFINITIONS[variable].label;
              const unit = VARIABLE_DEFINITIONS[variable].unit;
              const isChecked = visibleVariables.includes(variable);
              const hasValue = getVariableValue(variable) !== undefined;
              const isRequired = defaultVisible.includes(variable);
              
              return (
                <div key={variable} className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 hover:bg-accent/5 transition-colors">
                  <Checkbox
                    id={variable}
                    checked={isChecked}
                    onCheckedChange={() => toggleVariable(variable)}
                    disabled={!hasValue || isRequired}
                  />
                  <Label
                    htmlFor={variable}
                    className={`flex items-center gap-3 flex-1 ${isRequired ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{label}</p>
                        {isRequired && (
                          <span className="text-xs text-muted-foreground">(Always visible)</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{unit}</p>
                      {!hasValue && (
                        <p className="text-xs text-destructive mt-1">No data available</p>
                      )}
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnvironmentCard;
