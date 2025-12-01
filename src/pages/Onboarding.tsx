import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/hooks/useAuth";

const PERSON_TYPES = [
  { value: "athlete", label: "Regular athlete" },
  { value: "occasional", label: "Occasional exerciser" },
  { value: "sedentary", label: "Sedentary" },
  { value: "active", label: "Active (physical work)" },
];

const SLEEP_PROBLEMS = [
  { value: "insomnia", label: "Insomnia" },
  { value: "wake-ups", label: "Frequent wake-ups" },
  { value: "snoring", label: "Snoring" },
  { value: "apnea", label: "Sleep apnea" },
  { value: "stress", label: "Stress/anxiety" },
  { value: "none", label: "No problems" },
];

const SLEEP_DURATIONS = [
  { value: "less-6h", label: "Less than 6h" },
  { value: "6-7h", label: "6-7 hours" },
  { value: "7-8h", label: "7-8 hours" },
  { value: "8-9h", label: "8-9 hours" },
  { value: "more-9h", label: "More than 9h" },
];

const SLEEP_QUALITIES = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "average", label: "Average" },
  { value: "poor", label: "Poor" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { data, updateAge, updateWeight, updatePersonType, updateSleepProblems, updateSleepHabits, isComplete } = useOnboarding();
  const { completeOnboarding, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Redirect to home when onboarding is completed
  useEffect(() => {
    if (user?.hasCompletedOnboarding) {
      // Use setTimeout to ensure state is fully updated
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 50);
    }
  }, [user?.hasCompletedOnboarding, navigate]);

  const steps = [
    {
      title: "Personal Information",
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="age">What is your age?</Label>
            <Input
              id="age"
              type="number"
              placeholder="e.g., 25"
              value={data.age || ""}
              onChange={(e) => updateAge(parseInt(e.target.value) || 0)}
              min={1}
              max={120}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">What is your weight (kg)?</Label>
            <Input
              id="weight"
              type="number"
              placeholder="e.g., 70"
              value={data.weight || ""}
              onChange={(e) => updateWeight(parseFloat(e.target.value) || 0)}
              min={1}
              max={300}
            />
          </div>
        </div>
      ),
      canContinue: data.age !== null && data.weight !== null,
    },
    {
      title: "Person Type",
      component: (
        <div className="space-y-4">
          <Label>What type of person are you?</Label>
          <RadioGroup
            value={data.personType || ""}
            onValueChange={updatePersonType}
          >
            {PERSON_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <RadioGroupItem value={type.value} id={type.value} />
                <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ),
      canContinue: data.personType !== null,
    },
    {
      title: "Sleep Problems",
      component: (
        <div className="space-y-4">
          <Label>Do you have any sleep problems? (multiple choices possible)</Label>
          <div className="space-y-3">
            {SLEEP_PROBLEMS.map((problem) => (
              <div key={problem.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <Checkbox
                  id={problem.value}
                  checked={data.sleepProblems.includes(problem.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      updateSleepProblems([...data.sleepProblems, problem.value]);
                    } else {
                      updateSleepProblems(data.sleepProblems.filter((p) => p !== problem.value));
                    }
                  }}
                />
                <Label htmlFor={problem.value} className="flex-1 cursor-pointer">
                  {problem.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      ),
      canContinue: data.sleepProblems.length > 0,
    },
    {
      title: "Sleep Habits",
      component: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bedtime">What time do you usually go to bed?</Label>
            <Input
              id="bedtime"
              type="time"
              value={data.sleepHabits.bedtime || ""}
              onChange={(e) => updateSleepHabits({ bedtime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wakeTime">What time do you usually wake up?</Label>
            <Input
              id="wakeTime"
              type="time"
              value={data.sleepHabits.wakeTime || ""}
              onChange={(e) => updateSleepHabits({ wakeTime: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>How many hours do you sleep on average per night?</Label>
            <RadioGroup
              value={data.sleepHabits.sleepDuration || ""}
              onValueChange={(value) => updateSleepHabits({ sleepDuration: value })}
            >
              {SLEEP_DURATIONS.map((duration) => (
                <div key={duration.value} className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                  <RadioGroupItem value={duration.value} id={duration.value} />
                  <Label htmlFor={duration.value} className="flex-1 cursor-pointer">
                    {duration.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>How do you evaluate the quality of your sleep?</Label>
            <RadioGroup
              value={data.sleepHabits.sleepQuality || ""}
              onValueChange={(value) => updateSleepHabits({ sleepQuality: value })}
            >
              {SLEEP_QUALITIES.map((quality) => (
                <div key={quality.value} className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                  <RadioGroupItem value={quality.value} id={quality.value} />
                  <Label htmlFor={quality.value} className="flex-1 cursor-pointer">
                    {quality.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      ),
      canContinue:
        data.sleepHabits.bedtime !== null &&
        data.sleepHabits.wakeTime !== null &&
        data.sleepHabits.sleepDuration !== null &&
        data.sleepHabits.sleepQuality !== null,
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step, finish onboarding
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    if (isComplete) {
      // Complete onboarding - this will update the user state
      // The useEffect will handle the navigation when hasCompletedOnboarding becomes true
      completeOnboarding();
    }
  };

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated mesh background */}
      <div className="fixed inset-0 bg-[var(--gradient-mesh)] opacity-50 pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="p-8 glass-card border-0 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {currentStepData.title}
          </h2>

          <div className="min-h-[400px] mb-6">
            {currentStepData.component}
          </div>

          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 border-primary/30 hover:bg-primary/10"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!currentStepData.canContinue}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {currentStep === totalSteps ? "Finish" : "Next"}
              {currentStep < totalSteps && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

