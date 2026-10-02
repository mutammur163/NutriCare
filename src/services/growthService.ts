// =============================================================================
// GROWTH SERVICE — Growth measurement CRUD + WHO-based interpretation
// Indicators are based on documented WHO Child Growth Standards (2006).
// IMPORTANT: Software flags are NOT medical diagnoses.
// =============================================================================

import type { GrowthMeasurement, GrowthStatus, ActivityItem, Child } from '../types';
import { loadStore, saveStore } from './store';
import { generateId } from '../utils/id';
import { differenceInMonths } from 'date-fns';

function logActivity(item: Omit<ActivityItem, 'id'>): void {
  const store = loadStore();
  const activity: ActivityItem = { ...item, id: generateId('act') };
  store.activityLog = [activity, ...store.activityLog].slice(0, 100);
  saveStore(store);
}

// ---------------------------------------------------------------------------
// WHO Weight-for-Age median reference values (kg) — simplified lookup table
// Source: WHO Child Growth Standards (2006)
// These are approximate median (50th percentile) values for screening context only.
// Professional clinical assessment uses Z-score tables and full reference data.
// ---------------------------------------------------------------------------

// Returns approximate median weight in kg for age in months and sex
function getWhoBoyWeightMedian(ageMonths: number): number | null {
  const table: Record<number, number> = {
    0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5, 6: 7.9,
    7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6,
    15: 10.3, 18: 11.0, 21: 11.5, 24: 12.0, 27: 12.5, 30: 13.0,
    33: 13.5, 36: 14.0, 42: 15.0, 48: 16.0, 54: 17.0, 60: 18.3,
    66: 19.5, 72: 20.7,
  };
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev);
  return Math.abs(nearest - ageMonths) <= 3 ? table[nearest] : null;
}

function getWhoGirlWeightMedian(ageMonths: number): number | null {
  const table: Record<number, number> = {
    0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9, 6: 7.3,
    7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7, 12: 8.9,
    15: 9.6, 18: 10.2, 21: 10.9, 24: 11.5, 27: 12.0, 30: 12.6,
    33: 13.1, 36: 13.9, 42: 14.8, 48: 15.9, 54: 17.0, 60: 18.2,
    66: 19.5, 72: 21.0,
  };
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev);
  return Math.abs(nearest - ageMonths) <= 3 ? table[nearest] : null;
}

// Returns approximate median height in cm
function getWhoBoyHeightMedian(ageMonths: number): number | null {
  const table: Record<number, number> = {
    0: 49.9, 3: 61.4, 6: 67.6, 9: 72.3, 12: 75.7, 15: 79.1,
    18: 82.3, 21: 85.1, 24: 87.8, 27: 90.3, 30: 92.7, 33: 94.9,
    36: 96.1, 42: 99.9, 48: 103.3, 54: 106.4, 60: 110.0,
    66: 113.5, 72: 116.0,
  };
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev);
  return Math.abs(nearest - ageMonths) <= 3 ? table[nearest] : null;
}

function getWhoGirlHeightMedian(ageMonths: number): number | null {
  const table: Record<number, number> = {
    0: 49.1, 3: 59.8, 6: 65.7, 9: 70.1, 12: 74.0, 15: 77.5,
    18: 80.7, 21: 83.7, 24: 86.4, 27: 89.0, 30: 91.4, 33: 93.8,
    36: 95.1, 42: 98.7, 48: 102.7, 54: 106.2, 60: 109.4,
    66: 112.7, 72: 115.6,
  };
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - ageMonths) < Math.abs(prev - ageMonths) ? curr : prev);
  return Math.abs(nearest - ageMonths) <= 3 ? table[nearest] : null;
}

export interface GrowthInterpretation {
  weightForAgeStatus: GrowthStatus;
  heightForAgeStatus: GrowthStatus;
  interpretationNote: string;
  referenceStandard: string;
  indicator: string;
  requiresProfessionalReview: boolean;
}

export function interpretGrowth(
  child: Child,
  measurementDate: string,
  weightKg: number,
  heightCm: number
): GrowthInterpretation {
  const ageMonths = differenceInMonths(new Date(measurementDate), new Date(child.dateOfBirth));

  if (ageMonths < 0 || ageMonths > 72) {
    return {
      weightForAgeStatus: 'unknown',
      heightForAgeStatus: 'unknown',
      interpretationNote: 'Age outside the 0–72 month reference range. Measurements recorded; comparison not applicable.',
      referenceStandard: 'WHO Child Growth Standards (2006)',
      indicator: 'Weight-for-age, Height-for-age',
      requiresProfessionalReview: false,
    };
  }

  const isBoy = child.sex === 'male';
  const weightMedian = isBoy ? getWhoBoyWeightMedian(ageMonths) : getWhoGirlWeightMedian(ageMonths);
  const heightMedian = isBoy ? getWhoBoyHeightMedian(ageMonths) : getWhoGirlHeightMedian(ageMonths);

  let weightStatus: GrowthStatus = 'unknown';
  let heightStatus: GrowthStatus = 'unknown';
  const notes: string[] = [];

  if (weightMedian !== null) {
    const ratio = weightKg / weightMedian;
    if (ratio >= 0.9) {
      weightStatus = 'normal';
    } else if (ratio >= 0.75) {
      weightStatus = 'monitor';
      notes.push('Weight is moderately below the age median; monitor progress closely.');
    } else {
      weightStatus = 'review';
      notes.push('Weight is significantly below the age median; professional review is recommended.');
    }
  } else {
    notes.push('Weight reference data unavailable for this age.');
  }

  if (heightMedian !== null) {
    const ratio = heightCm / heightMedian;
    if (ratio >= 0.95) {
      heightStatus = 'normal';
    } else if (ratio >= 0.88) {
      heightStatus = 'monitor';
      notes.push('Height is moderately below the age median; monitor progress closely.');
    } else {
      heightStatus = 'review';
      notes.push('Height is significantly below the age median; professional review is recommended.');
    }
  } else {
    notes.push('Height reference data unavailable for this age.');
  }

  const requiresReview = weightStatus === 'review' || heightStatus === 'review';

  let interpretationNote = notes.length > 0 ? notes.join(' ') : 'Measurements are within the expected range for this age.';
  interpretationNote += '\n\nDISCLAIMER: This software flag is based on approximate WHO reference medians and is intended for screening purposes only. It is NOT a clinical diagnosis. Please consult a trained health professional for any clinical assessment.';

  return {
    weightForAgeStatus: weightStatus,
    heightForAgeStatus: heightStatus,
    interpretationNote,
    referenceStandard: 'WHO Child Growth Standards (2006)',
    indicator: `Weight-for-age, Height-for-age (Age at measurement: ${ageMonths} months)`,
    requiresProfessionalReview: requiresReview,
  };
}

// ---------------------------------------------------------------------------
// CRUD operations
// ---------------------------------------------------------------------------

export function getAllMeasurements(): GrowthMeasurement[] {
  return loadStore().growthMeasurements;
}

export function getMeasurementsByChild(childId: string): GrowthMeasurement[] {
  return loadStore()
    .growthMeasurements.filter((m) => m.childId === childId)
    .sort((a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime());
}

export function getLatestMeasurement(childId: string): GrowthMeasurement | undefined {
  const ms = getMeasurementsByChild(childId);
  return ms[ms.length - 1];
}

export function addMeasurement(
  data: Omit<GrowthMeasurement, 'id' | 'createdAt' | 'updatedAt' | 'weightForAgeStatus' | 'heightForAgeStatus' | 'interpretationNote'>,
  child: Child
): GrowthMeasurement {
  const interpretation = interpretGrowth(child, data.measurementDate, data.weightKg, data.heightCm);
  const store = loadStore();
  const measurement: GrowthMeasurement = {
    ...data,
    id: generateId('gm'),
    weightForAgeStatus: interpretation.weightForAgeStatus,
    heightForAgeStatus: interpretation.heightForAgeStatus,
    interpretationNote: interpretation.interpretationNote,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.growthMeasurements.push(measurement);
  saveStore(store);
  logActivity({ type: 'measurement_recorded', description: `Growth measurement recorded for ${child.fullName}`, timestamp: new Date().toISOString(), childId: child.id, childName: child.fullName });
  return measurement;
}

export function updateMeasurement(id: string, data: Partial<GrowthMeasurement>, child: Child): GrowthMeasurement {
  const store = loadStore();
  const idx = store.growthMeasurements.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error('Measurement not found.');
  const updated = { ...store.growthMeasurements[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.weightKg !== undefined || data.heightCm !== undefined || data.measurementDate !== undefined) {
    const interpretation = interpretGrowth(child, updated.measurementDate, updated.weightKg, updated.heightCm);
    updated.weightForAgeStatus = interpretation.weightForAgeStatus;
    updated.heightForAgeStatus = interpretation.heightForAgeStatus;
    updated.interpretationNote = interpretation.interpretationNote;
  }
  store.growthMeasurements[idx] = updated;
  saveStore(store);
  return updated;
}

export function deleteMeasurement(id: string): void {
  const store = loadStore();
  store.growthMeasurements = store.growthMeasurements.filter((m) => m.id !== id);
  saveStore(store);
}

export function getRecentMeasurements(limit = 5): GrowthMeasurement[] {
  return loadStore()
    .growthMeasurements.slice()
    .sort((a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime())
    .slice(0, limit);
}

// Children whose last measurement was more than 90 days ago (3 months)
export function getChildrenWithOverdueMeasurements(): string[] {
  const store = loadStore();
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return store.children
    .filter((c) => c.status === 'active')
    .filter((c) => {
      const latest = getLatestMeasurement(c.id);
      if (!latest) return true; // Never measured
      return new Date(latest.measurementDate) < ninetyDaysAgo;
    })
    .map((c) => c.id);
}
