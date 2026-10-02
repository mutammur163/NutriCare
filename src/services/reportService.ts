// =============================================================================
// REPORT / EXPORT SERVICE — CSV generation and report data
// =============================================================================

import type { Child, GrowthMeasurement, FollowUpTask, MealDistributionRecord } from '../types';
import { loadStore } from './store';
import { format } from 'date-fns';
import { calculateAge } from '../utils/date';

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ];
  return lines.join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportChildrenCSV(): void {
  const store = loadStore();
  const headers = ['Child ID', 'Full Name', 'Date of Birth', 'Age', 'Sex', 'Parent Name', 'Contact', 'Status', 'Registration Date', 'Dietary Restrictions', 'Allergies'];
  const rows = store.children.map((c) => [
    c.childId,
    c.fullName,
    c.dateOfBirth,
    calculateAge(c.dateOfBirth),
    c.sex,
    c.parentName,
    c.contactNumber ?? '',
    c.status,
    c.registrationDate,
    c.dietaryRestrictions.join('; '),
    c.allergies.join('; '),
  ]);
  downloadCSV(toCSV(headers, rows), `children_report_${format(new Date(), 'yyyyMMdd')}.csv`);
}

export function exportGrowthCSV(childId?: string): void {
  const store = loadStore();
  let measurements = store.growthMeasurements;
  if (childId) measurements = measurements.filter((m) => m.childId === childId);
  const childMap = Object.fromEntries(store.children.map((c) => [c.id, c]));
  const headers = ['Child ID', 'Full Name', 'Date of Birth', 'Measurement Date', 'Age at Measurement (months)', 'Weight (kg)', 'Height (cm)', 'Weight-for-Age Status', 'Height-for-Age Status', 'Notes', 'Recorded By'];
  const rows = measurements
    .sort((a, b) => a.measurementDate.localeCompare(b.measurementDate))
    .map((m) => {
      const child = childMap[m.childId];
      return [
        child?.childId ?? m.childId,
        child?.fullName ?? 'Unknown',
        child?.dateOfBirth ?? '',
        m.measurementDate,
        child ? String(Math.floor((new Date(m.measurementDate).getTime() - new Date(child.dateOfBirth).getTime()) / (30.44 * 24 * 60 * 60 * 1000))) : '',
        String(m.weightKg),
        String(m.heightCm),
        m.weightForAgeStatus ?? 'unknown',
        m.heightForAgeStatus ?? 'unknown',
        m.notes ?? '',
        m.recordedBy,
      ];
    });
  downloadCSV(toCSV(headers, rows), `growth_report_${format(new Date(), 'yyyyMMdd')}.csv`);
}

export function exportDistributionCSV(startDate?: string, endDate?: string): void {
  const store = loadStore();
  let records = store.distributionRecords;
  if (startDate) records = records.filter((r) => r.date >= startDate);
  if (endDate) records = records.filter((r) => r.date <= endDate);
  const headers = ['Date', 'Meal Category', 'Planned Dish', 'Actual Dish', 'Target Servings', 'Actual Servings', 'Wasted', 'Substitutions', 'Notes', 'Recorded By'];
  const rows = records
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((r) => [
      r.date,
      r.mealCategory.replace('_', ' '),
      r.plannedDish,
      r.actualDish,
      String(r.targetServings),
      String(r.actualServings),
      String(r.wastedServings ?? ''),
      r.substitutions ?? '',
      r.notes ?? '',
      r.recordedBy,
    ]);
  downloadCSV(toCSV(headers, rows), `distribution_report_${format(new Date(), 'yyyyMMdd')}.csv`);
}

export function exportFollowUpsCSV(): void {
  const store = loadStore();
  const childMap = Object.fromEntries(store.children.map((c) => [c.id, c]));
  const headers = ['Child ID', 'Child Name', 'Reason', 'Created Date', 'Due Date', 'Priority', 'Status', 'Assigned To', 'Notes', 'Resolution Notes'];
  const rows = store.followUpTasks.map((f) => {
    const child = childMap[f.childId];
    return [
      child?.childId ?? f.childId,
      child?.fullName ?? 'Unknown',
      f.reason.replace('_', ' '),
      f.createdDate,
      f.dueDate,
      f.priority,
      f.status.replace('_', ' '),
      f.assignedTo,
      f.notes ?? '',
      f.resolutionNotes ?? '',
    ];
  });
  downloadCSV(toCSV(headers, rows), `followups_report_${format(new Date(), 'yyyyMMdd')}.csv`);
}

// Report data for on-screen display
export function getReportData() {
  const store = loadStore();
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysAgo = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  return {
    totalChildren: store.children.length,
    activeChildren: store.children.filter((c) => c.status === 'active').length,
    recentRegistrations: store.children.filter((c) => c.registrationDate >= thirtyDaysAgo).length,
    totalMeasurements: store.growthMeasurements.length,
    measurementsThisMonth: store.growthMeasurements.filter((m) => m.measurementDate >= thirtyDaysAgo).length,
    totalDistributions: store.distributionRecords.length,
    distributionsThisMonth: store.distributionRecords.filter((r) => r.date >= thirtyDaysAgo).length,
    totalFollowUps: store.followUpTasks.length,
    openFollowUps: store.followUpTasks.filter((f) => f.status !== 'completed').length,
    completedFollowUps: store.followUpTasks.filter((f) => f.status === 'completed').length,
    totalMealPlans: store.mealPlans.length,
    generatedAt: new Date().toISOString(),
  };
}
