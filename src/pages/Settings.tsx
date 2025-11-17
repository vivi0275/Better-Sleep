import { Bluetooth, Wifi, Moon, Vibrate, Volume2, Shield, Sun, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 pb-20 transition-colors duration-300">
      {/* Title centered at top */}
      <div className="pt-8 pb-6 text-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Settings
        </h1>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Account - En haut */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Account
          </h2>
          <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 bg-primary/20">
                <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
                  A
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-1">Alex</h3>
                <p className="text-sm text-muted-foreground mb-2">alex@example.com</p>
                <Button variant="link" className="p-0 h-auto text-primary text-sm font-medium">
                  Edit Profile
                </Button>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-card to-card/80 shadow-sm border-border/50 mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Privacy & Security</p>
                <p className="text-xs text-muted-foreground">Control your data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

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
      </main>
    </div>
  );
};

export default Settings;
