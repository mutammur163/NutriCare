// =============================================================================
// FOLLOW-UP SERVICE
// =============================================================================

import type { FollowUpTask, FollowUpStatus, ActivityItem } from '../types';
import { loadStore, saveStore } from './store';
import { generateId } from '../utils/id';

function logActivity(item: Omit<ActivityItem, 'id'>): void {
  const store = loadStore();
  const activity: ActivityItem = { ...item, id: generateId('act') };
  store.activityLog = [activity, ...store.activityLog].slice(0, 100);
  saveStore(store);
}

export function getAllFollowUps(): FollowUpTask[] {
  return loadStore().followUpTasks;
}

export function getOpenFollowUps(): FollowUpTask[] {
  return loadStore().followUpTasks.filter((f) => f.status !== 'completed');
}

export function getFollowUpsByChild(childId: string): FollowUpTask[] {
  return loadStore().followUpTasks.filter((f) => f.childId === childId);
}

export function getOverdueFollowUps(): FollowUpTask[] {
  const today = new Date().toISOString().split('T')[0];
  return loadStore().followUpTasks.filter(
    (f) => f.status !== 'completed' && f.dueDate < today
  );
}

export function createFollowUp(data: Omit<FollowUpTask, 'id' | 'createdAt' | 'updatedAt'>): FollowUpTask {
  const store = loadStore();
  const task: FollowUpTask = {
    ...data,
    id: generateId('fu'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.followUpTasks.push(task);
  saveStore(store);
  logActivity({ type: 'followup_created', description: `Follow-up created: ${task.reason.replace('_', ' ')}`, timestamp: new Date().toISOString(), childId: task.childId });
  return task;
}

export function updateFollowUp(id: string, data: Partial<Omit<FollowUpTask, 'id' | 'createdAt'>>): FollowUpTask {
  const store = loadStore();
  const idx = store.followUpTasks.findIndex((f) => f.id === id);
  if (idx === -1) throw new Error('Follow-up not found.');
  store.followUpTasks[idx] = { ...store.followUpTasks[idx], ...data, updatedAt: new Date().toISOString() };
  if (data.status === 'completed' && !store.followUpTasks[idx].completedDate) {
    store.followUpTasks[idx].completedDate = new Date().toISOString().split('T')[0];
    logActivity({ type: 'followup_completed', description: `Follow-up completed`, timestamp: new Date().toISOString(), childId: store.followUpTasks[idx].childId });
  }
  saveStore(store);
  return store.followUpTasks[idx];
}

export function deleteFollowUp(id: string): void {
  const store = loadStore();
  store.followUpTasks = store.followUpTasks.filter((f) => f.id !== id);
  saveStore(store);
}

export function filterFollowUps(filters: { status?: FollowUpStatus | 'all'; assignedTo?: string; childId?: string }): FollowUpTask[] {
  let tasks = loadStore().followUpTasks;
  if (filters.status && filters.status !== 'all') {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters.assignedTo) {
    tasks = tasks.filter((t) => t.assignedTo === filters.assignedTo);
  }
  if (filters.childId) {
    tasks = tasks.filter((t) => t.childId === filters.childId);
  }
  return tasks.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
