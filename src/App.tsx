import { useSettings } from './hooks/useSettings';
import { useCountdown } from './hooks/useCountdown';
import { useTheme } from './hooks/useTheme';
import { Wizard } from './components/wizard/Wizard';
import { Dashboard } from './components/dashboard/Dashboard';

export default function App() {
  const { settings, saveSettings, showWizard, enterEditMode } = useSettings();
  const state = useCountdown(settings);
  const { theme, setTheme } = useTheme(settings?.theme ?? 'system');

  if (showWizard) {
    return (
      <Wizard
        initialSettings={settings ?? undefined}
        onComplete={saveSettings}
      />
    );
  }

  if (!settings || !state) {
    return null;
  }

  return (
    <Dashboard
      settings={settings}
      state={state}
      onEdit={enterEditMode}
      theme={theme}
      onThemeChange={setTheme}
    />
  );
}
