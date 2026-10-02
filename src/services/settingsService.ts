// =============================================================================
// SETTINGS SERVICE
// =============================================================================

import type { CentreSettings } from '../types';
import { loadStore, saveStore } from './store';

export function getSettings(): CentreSettings {
  return loadStore().settings;
}

export function updateSettings(data: Partial<CentreSettings>): CentreSettings {
  const store = loadStore();
  store.settings = { ...store.settings, ...data, lastUpdated: new Date().toISOString() };
  saveStore(store);
  return store.settings;
}
