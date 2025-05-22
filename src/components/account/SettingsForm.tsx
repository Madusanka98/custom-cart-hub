
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/context/ThemeContext';

export function SettingsForm() {
  const { isDarkMode, toggleTheme } = useTheme();

  // Handle theme toggle
  const handleThemeToggle = (checked: boolean) => {
    if (checked !== isDarkMode) {
      toggleTheme();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <p className="text-sm text-muted-foreground">
            Toggle between light and dark theme
          </p>
        </div>
        <Switch
          id="dark-mode"
          checked={isDarkMode}
          onCheckedChange={handleThemeToggle}
        />
      </div>
    </div>
  );
}
