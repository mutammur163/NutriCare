import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ClipboardList, User } from 'lucide-react';
import { getChildById } from '../services/childrenService';
import { getMeasurementsByChild } from '../services/growthService';
import { getFollowUpsByChild } from '../services/followUpService';
import type { Child, GrowthMeasurement, FollowUpTask } from '../types';
import { calculateAge, formatDate, formatDateTime } from '../utils/date';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'normal' ? 'badge-green' : status === 'monitor' ? 'badge-amber' : status === 'review' ? 'badge-red' : 'badge-slate';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function ChildProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const [measurements, setMeasurements] = useState<GrowthMeasurement[]>([]);
  const [followUps, setFollowUps] = useState<FollowUpTask[]>([]);

  useEffect(() => {
    if (!id) return;
    const c = getChildById(id);
    setChild(c ?? null);
    setMeasurements(getMeasurementsByChild(id));
    setFollowUps(getFollowUpsByChild(id));
  }, [id]);

  if (!child) return <div className="empty-state"><div className="empty-state-title">Child not found.</div><Link to="/children" className="btn btn-secondary btn-sm">← Back</Link></div>;

  const chartData = measurements.map((m) => ({
    date: format(new Date(m.measurementDate), 'MMM yy'),
    weight: m.weightKg,
    height: m.heightCm,
  }));

  return (
    <div>
      <div className="breadcrumb"><Link to="/children">Children</Link><span>›</span><span>{child.fullName}</span></div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to="/children" className="btn btn-secondary btn-sm"><ArrowLeft size={12} /> Back</Link>
          <div>
            <h1 className="page-title">{child.fullName}</h1>
            <p className="page-subtitle">{child.childId} · {calculateAge(child.dateOfBirth)} · {child.sex}</p>
          </div>
        </div>
        <span className={`badge ${child.status === 'active' ? 'badge-green' : 'badge-slate'}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>{child.status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Profile details */}
        <div className="card">
          <div className="card-header"><h2 className="card-title"><User size={14} style={{ display: 'inline', marginRight: 6 }} />Profile</h2></div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              ['Date of Birth', formatDate(child.dateOfBirth)],
              ['Age', calculateAge(child.dateOfBirth)],
              ['Sex', child.sex],
              ['Registration Date', formatDate(child.registrationDate)],
              ['Parent / Caregiver', child.parentName],
              ['Contact', child.contactNumber || '—'],
              ['Address', child.address || '—'],
              ['Dietary Restrictions', child.dietaryRestrictions.join(', ') || 'None'],
              ['Allergies', child.allergies.join(', ') || 'None'],
              ['Feeding Notes', child.feedingNotes || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-slate)', minWidth: 140 }}>{label}</span>
                <span style={{ fontSize: '0.8125rem' }}>{value}</span>
              </div>
            ))}
          </div>
          {child.allergies.length > 0 && (
            <div className="notice notice-red" style={{ marginTop: 14 }}>
              ⚠ Allergy record: {child.allergies.join(', ')}. Check all meals before serving.
            </div>
          )}
        </div>

        {/* Growth chart */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><TrendingUp size={14} style={{ display: 'inline', marginRight: 6 }} />Growth Trend</h2>
            <Link to={`/growth?child=${child.id}`} className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="w" tick={{ fontSize: 10 }} unit=" kg" width={40} />
                <YAxis yAxisId="h" orientation="right" tick={{ fontSize: 10 }} unit=" cm" width={40} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <Line yAxisId="w" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3d6b4f" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="h" type="monotone" dataKey="height" name="Height (cm)" stroke="#4e8762" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-body">At least 2 measurements needed to show a trend.</div>
              <Link to={`/growth?child=${child.id}`} className="btn btn-primary btn-sm">Add Measurement</Link>
            </div>
          )}
          {measurements.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)', marginBottom: 6 }}>Latest Measurement</div>
              {(() => {
                const latest = measurements[measurements.length - 1];
                return (
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>Weight</div><div style={{ fontWeight: 600 }}>{latest.weightKg} kg</div></div>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>Height</div><div style={{ fontWeight: 600 }}>{latest.heightCm} cm</div></div>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>Date</div><div style={{ fontWeight: 600 }}>{formatDate(latest.measurementDate)}</div></div>
                    <div><div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>Weight Status</div><StatusBadge status={latest.weightForAgeStatus ?? 'unknown'} /></div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Follow-ups */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title"><ClipboardList size={14} style={{ display: 'inline', marginRight: 6 }} />Follow-ups</h2>
            <Link to="/follow-ups" className="btn btn-secondary btn-sm">Manage</Link>
          </div>
          {followUps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {followUps.map((f) => (
                <div key={f.id} style={{ padding: '8px 10px', background: 'var(--color-surface-2)', borderRadius: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{f.reason.replace(/_/g, ' ')}</span>
                    <span className={`badge ${f.status === 'completed' ? 'badge-green' : f.status === 'in_progress' ? 'badge-blue' : 'badge-amber'}`}>{f.status.replace('_', ' ')}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>Due: {formatDate(f.dueDate)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 20 }}>
              <div className="empty-state-body">No follow-up tasks for this child.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
