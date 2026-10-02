// =============================================================================
// DATA STORE SERVICE — Centralized localStorage access layer
// All components must use this module. Direct localStorage access is forbidden.
// =============================================================================

import type { DataStore } from '../types';
import {
  defaultSettings,
  seedChildren,
  seedGrowthMeasurements,
  seedMealPlans,
  seedDistributionRecords,
  seedFollowUpTasks,
  seedEducationArticles,
  seedActivityLog,
} from '../data/seedData';

const STORE_KEY = 'anganwadi_data_v1';
const STORE_VERSION = 1;

function getEmptyStore(): DataStore {
  return {
    version: STORE_VERSION,
    children: [],
    growthMeasurements: [],
    mealPlans: [],
    distributionRecords: [],
    followUpTasks: [],
    educationArticles: [],
    settings: { ...defaultSettings },
    activityLog: [],
    isSeeded: false,
  };
}

function getSeededStore(): DataStore {
  return {
    version: STORE_VERSION,
    children: seedChildren,
    growthMeasurements: seedGrowthMeasurements,
    mealPlans: seedMealPlans,
    distributionRecords: seedDistributionRecords,
    followUpTasks: seedFollowUpTasks,
    educationArticles: seedEducationArticles,
    settings: { ...defaultSettings },
    activityLog: seedActivityLog,
    isSeeded: true,
  };
}

export function loadStore(): DataStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const store = getSeededStore();
      saveStore(store);
      return store;
    }
    const parsed: DataStore = JSON.parse(raw);
    if (parsed.version !== STORE_VERSION) {
      // Version mismatch: seed fresh (safe migration for demo)
      const store = getSeededStore();
      saveStore(store);
      return store;
    }
    // Ensure education articles are always present (static content)
    if (!parsed.educationArticles || parsed.educationArticles.length === 0) {
      parsed.educationArticles = seedEducationArticles;
    }
    // Branding migration: update old centre name silently
    if (parsed.settings?.centreName === 'Anganwadi Centre No. 14') {
      parsed.settings.centreName = 'NutriCare Centre No. 14';
      saveStore(parsed);
    }
    return parsed;
  } catch {
    const store = getSeededStore();
    saveStore(store);
    return store;
  }
}

export function saveStore(store: DataStore): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save data store:', e);
  }
}

export function resetToSeedData(): void {
  const store = getSeededStore();
  saveStore(store);
}

export function clearStore(): void {
  const store = getEmptyStore();
  store.educationArticles = seedEducationArticles;
  store.isSeeded = true;
  saveStore(store);
}
