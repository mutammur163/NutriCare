import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, UtensilsCrossed, ClipboardList, Activity, Clock, Calendar } from 'lucide-react';
import { getDashboardMetrics } from '../services/dashboardService';
import { getAllChildren } from '../services/childrenService';
import type { DashboardMetrics, Child } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatDateTime, formatDate, isOverdue } from '../utils/date';

function StatCard({ icon, value, label, color, bg }: { icon: React.ReactNode; value: number; label: string; color: string; bg: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function activityTypeLabel(type: string): string {
  const m: Record<string, string> = {
    child_registered: 'Child registered',
    measurement_recorded: 'Measurement recorded',
    meal_planned: 'Meal plan created',
    distribution_recorded: 'Meal distributed',
    followup_created: 'Follow-up created',
    followup_completed: 'Follow-up completed',
  };
  return m[type] || type;
}

function getStatusBadge(status?: string) {
  const classes: Record<string, string> = {
    normal: 'badge-green',
    monitor: 'badge-amber',
    review: 'badge-red',
    unknown: 'badge-slate',
  };
  return <span className={`badge ${classes[status || 'unknown'] ?? 'badge-slate'}`}>{status || 'unknown'}</span>;
}

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [childMap, setChildMap] = useState<Record<string, Child>>({});

  useEffect(() => {
    const m = getDashboardMetrics();
    setMetrics(m);
    const children = getAllChildren();
    setChildMap(Object.fromEntries(children.map((c) => [c.id, c])));
  }, []);

  if (!metrics) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview for {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard icon={<Users size={18} />} value={metrics.totalChildren} label="Registered Children" color="#3d6b4f" bg="#e8f0eb" />
        <StatCard icon={<TrendingUp size={18} />} value={metrics.measurementsDue} label="Measurements Due" color="#b45309" bg="#fffbeb" />
        <StatCard icon={<UtensilsCrossed size={18} />} value={metrics.mealsDistributedToday} label="Servings Today" color="#1d4ed8" bg="#eff6ff" />
        <StatCard icon={<ClipboardList size={18} />} value={metrics.pendingFollowUps} label="Open Follow-ups" color="#b91c1c" bg="#fef2f2" />
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Weekly distribution chart */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h2 className="card-title">Weekly Meal Distribution (This Week)</h2>
          </div>
          {metrics.weeklyDistribution.some((d) => d.breakfast + d.lunch + d.snack > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metrics.weeklyDistribution} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="breakfast" name="Breakfast" fill="#3d6b4f" radius={[2,2,0,0]} />
                <Bar dataKey="lunch" name="Lunch" fill="#4e8762" radius={[2,2,0,0]} />
                <Bar dataKey="snack" name="Snack" fill="#a7c4b3" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <UtensilsCrossed className="empty-state-icon" />
              <div className="empty-state-title">No distribution records this week</div>
              <div className="empty-state-body">Record meal distribution to see weekly trends here.</div>
              <Link to="/distribution" className="btn btn-primary btn-sm">Record Distribution</Link>
            </div>
          )}
        </div>

        {/* Recent measurements */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Measurements</h2>
            <Link to="/growth" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {metrics.recentMeasurements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {metrics.recentMeasurements.map((m) => {
                const child = childMap[m.childId];
                return (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', background: 'var(--color-surface-2)', borderRadius: 4 }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{child?.fullName ?? 'Unknown'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>{formatDate(m.measurementDate)} · {m.weightKg}kg, {m.heightCm}cm</div>
                    </div>
                    {getStatusBadge(m.weightForAgeStatus)}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-body">No measurements recorded yet.</div>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          {metrics.recentActivity.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {metrics.recentActivity.map((a) => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <Activity size={12} style={{ color: 'var(--color-forest)', marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem' }}>{a.description}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} />
                      {formatDateTime(a.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-body">No recent activity.</div>
            </div>
          )}
        </div>

        {/* Follow-up reminders */}
        {metrics.upcomingReminders.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Overdue Follow-ups</h2>
              <Link to="/follow-ups" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {metrics.upcomingReminders.map((f) => {
                const child = childMap[f.childId];
                const overdue = isOverdue(f.dueDate);
                return (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '7px 10px', background: overdue ? 'var(--color-red-bg)' : 'var(--color-surface-2)', borderRadius: 4, border: overdue ? '1px solid #fca5a5' : '1px solid transparent' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{child?.fullName ?? 'Unknown child'}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={10} />
                        Due: {formatDate(f.dueDate)} · {f.reason.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <span className={`badge ${f.priority === 'high' ? 'badge-red' : f.priority === 'medium' ? 'badge-amber' : 'badge-slate'}`}>{f.priority}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
