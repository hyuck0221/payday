import { useState, useCallback } from 'react';
import { Settings } from '../types/settings';
import { decodeSettings, updateURL } from '../utils/urlParams';

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings | null>(() => {
    return decodeSettings(window.location.search);
  });
  const [editMode, setEditMode] = useState(false);

  const saveSettings = useCallback((s: Settings) => {
    updateURL(s);
    setSettingsState(s);
    setEditMode(false);
  }, []);

  const enterEditMode = useCallback(() => {
    setEditMode(true);
  }, []);

  const showWizard = !settings || editMode;

  return { settings, saveSettings, showWizard, enterEditMode };
}
