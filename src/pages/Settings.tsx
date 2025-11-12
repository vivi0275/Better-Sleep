import { Bluetooth, Wifi, Bell, Moon, Vibrate, Volume2, User, Shield, Sun, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Device Connection */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Device Connection
          </h2>
          <div className="space-y-3">
            <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bluetooth className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Bluetooth</p>
                    <p className="text-xs text-muted-foreground">Smart Alarm - Connected</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Wi-Fi Sync</p>
                    <p className="text-xs text-muted-foreground">Auto-sync enabled</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </div>
        </div>

        {/* Alarm Settings */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Alarm Settings
          </h2>
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50 space-y-6">
            <div className="space-y-3">
              <Label htmlFor="volume" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Alarm Volume
              </Label>
              <Slider defaultValue={[70]} max={100} step={1} id="volume" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="vibration" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Vibrate className="w-4 h-4" />
                Vibration
              </Label>
              <Switch id="vibration" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gentle" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Gentle Wake
              </Label>
              <Switch id="gentle" defaultChecked />
            </div>
          </Card>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Appearance
          </h2>
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm font-medium text-foreground flex items-center gap-2">
                {isDark ? (
                  <>
                    <Moon className="w-4 h-4" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    Light Mode
                  </>
                )}
              </Label>
              <Switch 
                id="dark-mode" 
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Notifications
          </h2>
          <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sleep-tips" className="text-sm font-medium text-foreground">
                Sleep Tips
              </Label>
              <Switch id="sleep-tips" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="reminders" className="text-sm font-medium text-foreground">
                Bedtime Reminders
              </Label>
              <Switch id="reminders" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="insights" className="text-sm font-medium text-foreground">
                Weekly Insights
              </Label>
              <Switch id="insights" />
            </div>
          </Card>
        </div>

        {/* Account */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Account
          </h2>
          <div className="space-y-3">
            <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Profile</p>
                  <p className="text-xs text-muted-foreground">Manage your account</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Privacy & Security</p>
                  <p className="text-xs text-muted-foreground">Control your data</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
