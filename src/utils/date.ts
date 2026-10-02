// Date utility functions

import { differenceInMonths, differenceInYears, format, parseISO, isValid } from 'date-fns';

export function calculateAge(dateOfBirth: string): string {
  try {
    const dob = parseISO(dateOfBirth);
    if (!isValid(dob)) return 'Unknown';
    const now = new Date();
    const years = differenceInYears(now, dob);
    const months = differenceInMonths(now, dob) % 12;
    if (years === 0) return `${differenceInMonths(now, dob)} months`;
    if (months === 0) return `${years} year${years !== 1 ? 's' : ''}`;
    return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
  } catch {
    return 'Unknown';
  }
}

export function calculateAgeMonths(dateOfBirth: string): number {
  try {
    return differenceInMonths(new Date(), parseISO(dateOfBirth));
  } catch {
    return 0;
  }
}

export function formatDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, 'dd MMM yyyy, h:mm a');
  } catch {
    return dateStr;
  }
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function isOverdue(dueDateStr: string): boolean {
  return dueDateStr < todayISO();
}

export function getAgeGroupLabel(ageGroup: string): string {
  const labels: Record<string, string> = {
    '6-12m': '6–12 Months',
    '1-2y': '1–2 Years',
    '2-3y': '2–3 Years',
    '3-5y': '3–5 Years',
    '5-6y': '5–6 Years',
  };
  return labels[ageGroup] || ageGroup;
}
