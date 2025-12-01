import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sparkles } from "lucide-react";

const OnboardingIntro = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden flex items-center justify-center">
      {/* Animated mesh background */}
      <div className="fixed inset-0 bg-[var(--gradient-mesh)] opacity-50 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center shadow-2xl">
              <Moon className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 tracking-tight">
          Better Sleep
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          Optimize your sleep with artificial intelligence
        </p>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          size="lg"
          className="w-full max-w-xs h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingIntro;

