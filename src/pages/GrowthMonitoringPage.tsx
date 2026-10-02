import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, Download, Edit2, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { getActiveChildren } from '../services/childrenService';
import {
  getMeasurementsByChild, addMeasurement, updateMeasurement,
  deleteMeasurement, interpretGrowth
} from '../services/growthService';
import type { Child, GrowthMeasurement } from '../types';
import { calculateAge, formatDate, todayISO } from '../utils/date';
import { exportGrowthCSV } from '../services/reportService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function StatusBadge({ status }: { status?: string }) {
  const cls = status === 'normal' ? 'badge-green' : status === 'monitor' ? 'badge-amber' : status === 'review' ? 'badge-red' : 'badge-slate';
  return <span className={`badge ${cls}`}>{status ?? 'unknown'}</span>;
}

function MeasurementForm({ child, initial, onSave, onCancel }: {
  child: Child;
  initial?: Partial<GrowthMeasurement>;
  onSave: (data: { measurementDate: string; weightKg: number; heightCm: number; notes: string }) => void;
  onCancel: () => void;
}) {
  const [date, setDate] = useState(initial?.measurementDate ?? todayISO());
  const [weight, setWeight] = useState(String(initial?.weightKg ?? ''));
  const [height, setHeight] = useState(String(initial?.heightCm ?? ''));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<ReturnType<typeof interpretGrowth> | null>(null);

  useEffect(() => {
    if (date && weight && height) {
      const w = parseFloat(weight);
      const h = parseFloat(height);
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        setPreview(interpretGrowth(child, date, w, h));
      }
    }
  }, [date, weight, height, child]);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!date) e.date = 'Date is required';
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) e.weight = 'Valid weight required';
    if (!height || isNaN(parseFloat(height)) || parseFloat(height) <= 0) e.height = 'Valid height required';
    if (parseFloat(weight) > 60) e.weight = 'Implausible weight value. Please verify.';
    if (parseFloat(height) > 180) e.height = 'Implausible height value. Please verify.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave({ measurementDate: date, weightKg: parseFloat(weight), heightCm: parseFloat(height), notes });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ gridColumn: '1/-1' }}>
            <label className="form-label required">Measurement Date</label>
            <input type="date" className={`form-input${errors.date ? ' error' : ''}`} value={date} max={todayISO()}
              onChange={(e) => setDate(e.target.value)} />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label required">Weight (kg)</label>
            <input type="number" step="0.1" min="0.1" max="60" className={`form-input${errors.weight ? ' error' : ''}`} value={weight}
              onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 12.5" />
            {errors.weight && <span className="form-error">{errors.weight}</span>}
          </div>
          <div className="form-group">
            <label className="form-label required">Height (cm)</label>
            <input type="number" step="0.1" min="1" max="180" className={`form-input${errors.height ? ' error' : ''}`} value={height}
              onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 89.5" />
            {errors.height && <span className="form-error">{errors.height}</span>}
          </div>
        </div>

        {preview && (
          <div className={`notice ${preview.requiresProfessionalReview ? 'notice-red' : preview.weightForAgeStatus === 'monitor' ? 'notice-amber' : 'notice-green'}`}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Growth Screening Preview</div>
            <div style={{ fontSize: '0.75rem', marginBottom: 2 }}>Indicator: {preview.indicator}</div>
            <div style={{ fontSize: '0.75rem', marginBottom: 2 }}>Standard: {preview.referenceStandard}</div>
            <div style={{ fontSize: '0.75rem', display: 'flex', gap: 8 }}>
              <span>Weight-for-age: <StatusBadge status={preview.weightForAgeStatus} /></span>
              <span>Height-for-age: <StatusBadge status={preview.heightForAgeStatus} /></span>
            </div>
            {preview.requiresProfessionalReview && (
              <div style={{ marginTop: 6, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: '0.7rem' }}>Professional review recommended. This is a software screening flag, NOT a clinical diagnosis.</span>
              </div>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional measurement notes" />
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Measurement</button>
      </div>
    </form>
  );
}

export function GrowthMonitoringPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState(params.get('child') ?? '');
  const [measurements, setMeasurements] = useState<GrowthMeasurement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<GrowthMeasurement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GrowthMeasurement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const kids = getActiveChildren();
    setChildren(kids);
    if (!selectedChildId && kids.length > 0) setSelectedChildId(kids[0].id);
  }, []);

  useEffect(() => {
    if (selectedChildId) setMeasurements(getMeasurementsByChild(selectedChildId));
    else setMeasurements([]);
  }, [selectedChildId]);

  const selectedChild = children.find((c) => c.id === selectedChildId);
  const isWorker = user?.role === 'worker' || user?.role === 'supervisor';

  const chartData = measurements.map((m) => ({
    date: format(new Date(m.measurementDate), 'MMM yy'),
    weight: m.weightKg,
    height: m.heightCm,
  }));

  function handleSave(data: { measurementDate: string; weightKg: number; heightCm: number; notes: string }) {
    if (!selectedChild) return;
    try {
      if (editTarget) {
        updateMeasurement(editTarget.id, data, selectedChild);
        toast.success('Measurement updated.');
      } else {
        addMeasurement({ ...data, childId: selectedChild.id, recordedBy: user?.name ?? 'Worker' }, selectedChild);
        toast.success('Measurement recorded.');
      }
      setMeasurements(getMeasurementsByChild(selectedChild.id));
      setShowForm(false);
      setEditTarget(null);
    } catch (err: any) {
      toast.error(err.message ?? 'Error saving measurement.');
    }
  }

  function handleDelete() {
    if (!deleteTarget || !selectedChildId) return;
    deleteMeasurement(deleteTarget.id);
    setMeasurements(getMeasurementsByChild(selectedChildId));
    setDeleteTarget(null);
    toast.success('Measurement deleted.');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Growth Monitoring</h1>
          <p className="page-subtitle">WHO Child Growth Standards (2006) — Screening only, not diagnostic</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {selectedChildId && <button className="btn btn-secondary btn-sm" onClick={() => exportGrowthCSV(selectedChildId)}><Download size={13} /> Export CSV</button>}
          {isWorker && selectedChild && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditTarget(null); setShowForm(true); }}><Plus size={13} /> Add Measurement</button>
          )}
        </div>
      </div>

      {/* Child selector */}
      <div className="filter-bar">
        <div className="form-group" style={{ flex: 1, maxWidth: 320 }}>
          <select className="form-input" value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}>
            <option value="">— Select a child —</option>
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.childId})</option>
            ))}
          </select>
        </div>
      </div>

      {selectedChild && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          {/* Info */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Child Information</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Name', selectedChild.fullName],
                ['ID', selectedChild.childId],
                ['Date of Birth', formatDate(selectedChild.dateOfBirth)],
                ['Age', calculateAge(selectedChild.dateOfBirth)],
                ['Sex', selectedChild.sex],
                ['Allergies', selectedChild.allergies.join(', ') || 'None'],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)', minWidth: 110 }}>{l}</span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <div className="card-header"><h2 className="card-title">Growth Trend</h2></div>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="w" tick={{ fontSize: 10 }} unit=" kg" width={42} />
                  <YAxis yAxisId="h" orientation="right" tick={{ fontSize: 10 }} unit=" cm" width={42} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="w" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3d6b4f" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 5 }} />
                  <Line yAxisId="h" type="monotone" dataKey="height" name="Height (cm)" stroke="#b45309" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: 20 }}>
                <div className="empty-state-body">Record at least 2 measurements to see a growth trend chart.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Measurement table */}
      {selectedChild && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Measurement History</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{measurements.length} record{measurements.length !== 1 ? 's' : ''}</span>
          </div>
          {measurements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-body">No measurements recorded for this child yet.</div>
              {isWorker && <button className="btn btn-primary btn-sm" onClick={() => { setEditTarget(null); setShowForm(true); }}><Plus size={12} /> Add First Measurement</button>}
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight (kg)</th>
                    <th>Height (cm)</th>
                    <th>Weight Status</th>
                    <th>Height Status</th>
                    <th>Recorded By</th>
                    {isWorker && <th>Actions</th>}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...measurements].reverse().map((m) => (
                    <React.Fragment key={m.id}>
                      <tr>
                        <td>{formatDate(m.measurementDate)}</td>
                        <td><strong>{m.weightKg}</strong></td>
                        <td><strong>{m.heightCm}</strong></td>
                        <td><StatusBadge status={m.weightForAgeStatus} /></td>
                        <td><StatusBadge status={m.heightForAgeStatus} /></td>
                        <td style={{ color: 'var(--color-slate)' }}>{m.recordedBy}</td>
                        {isWorker && (
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="btn-icon" title="Edit" onClick={() => { setEditTarget(m); setShowForm(true); }}><Edit2 size={12} /></button>
                              <button className="btn-icon" title="Delete" style={{ color: 'var(--color-red)' }} onClick={() => setDeleteTarget(m)}><Trash2 size={12} /></button>
                            </div>
                          </td>
                        )}
                        <td>
                          <button className="btn-icon" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                            {expandedId === m.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                      </tr>
                      {expandedId === m.id && (
                        <tr>
                          <td colSpan={8}>
                            <div style={{ padding: '8px 12px', background: 'var(--color-surface-2)', fontSize: '0.75rem', borderRadius: 4 }}>
                              {m.notes && <div style={{ marginBottom: 6 }}><strong>Notes:</strong> {m.notes}</div>}
                              {m.interpretationNote && (
                                <div style={{ whiteSpace: 'pre-line' }}><strong>Interpretation:</strong> {m.interpretationNote}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!selectedChild && (
        <div className="empty-state card">
          <div className="empty-state-body">Select a child from the dropdown above to view growth records.</div>
        </div>
      )}

      {/* Form dialog */}
      {showForm && selectedChild && (
        <div className="dialog-overlay">
          <div className="dialog dialog-wide">
            <div className="dialog-header">
              <h2 className="dialog-title">{editTarget ? 'Edit Measurement' : 'Add Measurement'} — {selectedChild.fullName}</h2>
              <button className="btn-icon" onClick={() => { setShowForm(false); setEditTarget(null); }}>&times;</button>
            </div>
            <MeasurementForm
              child={selectedChild}
              initial={editTarget ?? undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditTarget(null); }}
            />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 380 }}>
            <div className="dialog-header"><h2 className="dialog-title">Delete Measurement</h2></div>
            <div className="dialog-body">
              <p>Delete measurement recorded on <strong>{formatDate(deleteTarget.measurementDate)}</strong>?</p>
              <div className="notice notice-red" style={{ marginTop: 10 }}>This action cannot be undone.</div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
