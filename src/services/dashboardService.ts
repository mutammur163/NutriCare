// =============================================================================
// DASHBOARD SERVICE — Aggregates metrics from real stored data
// =============================================================================

import type { DashboardMetrics } from '../types';
import { loadStore } from './store';
import { getChildrenWithOverdueMeasurements } from './growthService';
import { getOverdueFollowUps, getOpenFollowUps } from './followUpService';
import { getTodayDistribution, getWeeklyDistributionData } from './mealService';
import { format } from 'date-fns';

export function getDashboardMetrics(): DashboardMetrics {
  const store = loadStore();
  const activeChildren = store.children.filter((c) => c.status === 'active');
  const overdueIds = getChildrenWithOverdueMeasurements();
  const openFollowUps = getOpenFollowUps();
  const todayDist = getTodayDistribution();
  const todayServings = todayDist.reduce((sum, r) => sum + r.actualServings, 0);

  const recentMeasurements = store.growthMeasurements
    .slice()
    .sort((a, b) => new Date(b.measurementDate).getTime() - new Date(a.measurementDate).getTime())
    .slice(0, 6);

  const recentActivity = store.activityLog
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  const weeklyDistribution = getWeeklyDistributionData();
  const upcomingReminders = getOverdueFollowUps().slice(0, 5);

  return {
    totalChildren: store.children.length,
    activeChildren: activeChildren.length,
    measurementsDue: overdueIds.length,
    mealsDistributedToday: todayServings,
    pendingFollowUps: openFollowUps.length,
    recentMeasurements,
    recentActivity,
    weeklyDistribution,
    upcomingReminders,
  };
}
