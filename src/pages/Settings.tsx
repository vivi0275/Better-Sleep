import { useState } from "react";
import { Bluetooth, Wifi, Moon, Vibrate, Volume2, Shield, Sun, ChevronRight, Palette, Save, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeCustomizer } from "@/hooks/useThemeCustomizer";
import { hslStringToHex, hexToHslString } from "@/lib/color";
import type { ThemeTokens } from "@/config/theme-presets";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const MAX_FAVORITES = 5;

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { toast } = useToast();
  const [favoriteName, setFavoriteName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const {
    presets,
    currentPresetId,
    setPreset,
    isCustomSelected,
    customTokens,
    updateCustomToken,
    resetToDefault,
    defaultPresetId,
    favorites,
    saveAsFavorite,
    deleteFavorite,
    canSaveFavorite,
  } = useThemeCustomizer();

  const customColorFields: Array<{ key: keyof ThemeTokens; label: string }> = [
    { key: "primary", label: "Primary" },
    { key: "accent", label: "Accent" },
    { key: "background", label: "Background" },
  ];

  const handleSaveFavorite = () => {
    if (!favoriteName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your favorite palette",
        variant: "destructive",
      });
      return;
    }

    const result = saveAsFavorite(favoriteName.trim());
    if (result.success) {
      toast({
        title: "Saved!",
        description: `"${favoriteName}" has been saved as a favorite`,
      });
      setFavoriteName("");
      setShowSaveDialog(false);
    } else {
      toast({
        title: "Cannot save",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteFavorite = (id: string, name: string) => {
    deleteFavorite(id);
    toast({
      title: "Deleted",
      description: `"${name}" has been removed from favorites`,
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((fav) => fav.id === id);
  };

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

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                <Palette className="w-4 h-4" />
                Theme Palettes
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {presets.map((preset) => {
                  const isActive = currentPresetId === preset.id;
                  const isFav = isFavorite(preset.id);
                  return (
                    <div
                      key={preset.id}
                      className={`relative rounded-2xl border p-4 transition ${
                        isActive ? "border-primary shadow-[0_0_20px_rgba(14,165,233,0.15)]" : "border-border/60"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setPreset(preset.id)}
                        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-foreground">{preset.name}</p>
                              {isFav && <Star className="w-4 h-4 text-primary fill-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{preset.description}</p>
                          </div>
                          <div className="flex gap-1">
                            {preset.preview.map((tone, index) => (
                              <span
                                key={`${preset.id}-${tone}-${index}`}
                                className="h-8 w-8 rounded-full border border-border/70"
                                style={{ backgroundColor: `hsl(${tone})` }}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                      {isFav && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
                              aria-label="Delete favorite"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Favorite?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{preset.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFavorite(preset.id, preset.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  );
                })}
              </div>

              {isCustomSelected && (
                <div className="space-y-4">
                  {/* Color Pickers */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {customColorFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`custom-${field.key}`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {field.label}
                        </Label>
                        <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2">
                          <Input
                            id={`custom-${field.key}`}
                            type="color"
                            value={hslStringToHex(customTokens[field.key])}
                            className="h-10 w-12 border-0 bg-transparent p-0"
                            onChange={(event) => updateCustomToken(field.key, hexToHslString(event.target.value))}
                          />
                          <span className="text-xs text-muted-foreground font-mono">{customTokens[field.key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save Favorite Button */}
                  {canSaveFavorite ? (
                    <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowSaveDialog(true)}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save as Favorite
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Save Favorite Palette</AlertDialogTitle>
                          <AlertDialogDescription>
                            Give your custom palette a name to save it. You can save up to {MAX_FAVORITES} favorites.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-4">
                          <Input
                            placeholder="Enter palette name..."
                            value={favoriteName}
                            onChange={(e) => setFavoriteName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleSaveFavorite();
                              }
                            }}
                            autoFocus
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setFavoriteName("")}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleSaveFavorite} disabled={!favoriteName.trim()}>
                            Save
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <div className="text-center p-4 rounded-xl border border-border/60 bg-muted/30">
                      <p className="text-sm text-muted-foreground">
                        Maximum {MAX_FAVORITES} favorites reached. Delete one to save a new favorite.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefault}
                  disabled={currentPresetId === defaultPresetId}
                  className="text-xs font-semibold"
                >
                  Reset to default
                </Button>
              </div>
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
