// =============================================================================
// CHILDREN SERVICE — CRUD operations for child records
// =============================================================================

import type { Child, ActivityItem } from '../types';
import { loadStore, saveStore } from './store';
import { generateId } from '../utils/id';

function logActivity(item: Omit<ActivityItem, 'id'>): void {
  const store = loadStore();
  const activity: ActivityItem = { ...item, id: generateId('act') };
  store.activityLog = [activity, ...store.activityLog].slice(0, 100);
  saveStore(store);
}

export function getAllChildren(): Child[] {
  return loadStore().children;
}

export function getChildById(id: string): Child | undefined {
  return loadStore().children.find((c) => c.id === id);
}

export function getActiveChildren(): Child[] {
  return loadStore().children.filter((c) => c.status === 'active');
}

export function searchChildren(query: string): Child[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllChildren();
  return loadStore().children.filter(
    (c) =>
      c.fullName.toLowerCase().includes(q) ||
      c.childId.toLowerCase().includes(q) ||
      c.parentName.toLowerCase().includes(q)
  );
}

export function filterChildren(filters: { status?: string; ageGroup?: string }): Child[] {
  let children = getAllChildren();
  if (filters.status && filters.status !== 'all') {
    children = children.filter((c) => c.status === filters.status);
  }
  if (filters.ageGroup && filters.ageGroup !== 'all') {
    const now = new Date();
    children = children.filter((c) => {
      const dob = new Date(c.dateOfBirth);
      const ageMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
      switch (filters.ageGroup) {
        case '6-12m': return ageMonths >= 6 && ageMonths < 12;
        case '1-2y': return ageMonths >= 12 && ageMonths < 24;
        case '2-3y': return ageMonths >= 24 && ageMonths < 36;
        case '3-5y': return ageMonths >= 36 && ageMonths < 60;
        case '5-6y': return ageMonths >= 60 && ageMonths < 72;
        default: return true;
      }
    });
  }
  return children;
}

export function createChild(data: Omit<Child, 'id' | 'createdAt' | 'updatedAt'>): Child {
  const store = loadStore();
  // Check for duplicate childId
  if (store.children.some((c) => c.childId === data.childId)) {
    throw new Error(`Child ID ${data.childId} already exists.`);
  }
  const child: Child = {
    ...data,
    id: generateId('child'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.children.push(child);
  saveStore(store);
  logActivity({ type: 'child_registered', description: `Child ${child.fullName} (${child.childId}) registered`, timestamp: new Date().toISOString(), childId: child.id, childName: child.fullName });
  return child;
}

export function updateChild(id: string, data: Partial<Omit<Child, 'id' | 'createdAt'>>): Child {
  const store = loadStore();
  const idx = store.children.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Child record not found.');
  store.children[idx] = { ...store.children[idx], ...data, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.children[idx];
}

export function deleteChild(id: string): void {
  const store = loadStore();
  store.children = store.children.filter((c) => c.id !== id);
  // Also remove linked growth measurements and follow-ups
  store.growthMeasurements = store.growthMeasurements.filter((g) => g.childId !== id);
  store.followUpTasks = store.followUpTasks.filter((f) => f.childId !== id);
  saveStore(store);
}

export function generateNextChildId(): string {
  const store = loadStore();
  const existing = store.children
    .map((c) => {
      const match = c.childId.match(/AWC14-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));
  const max = existing.length > 0 ? Math.max(...existing) : 0;
  return `AWC14-${String(max + 1).padStart(3, '0')}`;
}
