import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ClipboardCheck } from 'lucide-react';
import {
  getAllDistributionRecords, createDistributionRecord,
  updateDistributionRecord, deleteDistributionRecord,
  getDistributionByDateRange, getMealCategoryLabel
} from '../services/mealService';
import type { MealDistributionRecord, MealCategory } from '../types';
import { formatDate, todayISO } from '../utils/date';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack'];

function DistributionForm({ initial, onSave, onCancel }: {
  initial?: Partial<MealDistributionRecord>;
  onSave: (data: Omit<MealDistributionRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [category, setCategory] = useState<MealCategory>(initial?.mealCategory ?? 'breakfast');
  const [plannedDish, setPlannedDish] = useState(initial?.plannedDish ?? '');
  const [actualDish, setActualDish] = useState(initial?.actualDish ?? '');
  const [target, setTarget] = useState(String(initial?.targetServings ?? '15'));
  const [actual, setActual] = useState(String(initial?.actualServings ?? ''));
  const [wasted, setWasted] = useState(String(initial?.wastedServings ?? ''));
  const [subs, setSubs] = useState(initial?.substitutions ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: typeof errors = {};
    if (!date) e.date = 'Date required';
    if (!plannedDish.trim()) e.plannedDish = 'Planned dish required';
    if (!actualDish.trim()) e.actualDish = 'Actual dish required';
    if (!actual || isNaN(parseInt(actual))) e.actual = 'Actual servings required';
    if (!target || isNaN(parseInt(target))) e.target = 'Target servings required';
    const t = parseInt(target);
    const a = parseInt(actual);
    if (t < 0) e.target = 'Target cannot be negative';
    if (a < 0) e.actual = 'Actual cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      date, mealCategory: category, plannedDish, actualDish,
      targetServings: parseInt(target), actualServings: parseInt(actual),
      wastedServings: wasted ? parseInt(wasted) : undefined,
      substitutions: subs || undefined, notes: notes || undefined,
      recordedBy: user?.name ?? 'Worker',
    });
  }

  const targetNum = parseInt(target) || 0;
  const actualNum = parseInt(actual) || 0;
  const pct = targetNum > 0 ? Math.round((actualNum / targetNum) * 100) : null;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label required">Date</label>
            <input type="date" className={`form-input${errors.date ? ' error' : ''}`} value={date} onChange={(e) => setDate(e.target.value)} />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label className="form-label required">Meal Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value as MealCategory)}>
              {MEAL_CATEGORIES.map((c) => <option key={c} value={c}>{getMealCategoryLabel(c)}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label required">Planned Dish</label>
          <input className={`form-input${errors.plannedDish ? ' error' : ''}`} value={plannedDish} onChange={(e) => setPlannedDish(e.target.value)} placeholder="What was planned?" />
          {errors.plannedDish && <span className="form-error">{errors.plannedDish}</span>}
        </div>

        <div className="form-group">
          <label className="form-label required">Actual Dish Distributed</label>
          <input className={`form-input${errors.actualDish ? ' error' : ''}`} value={actualDish} onChange={(e) => setActualDish(e.target.value)} placeholder="What was actually served?" />
          {errors.actualDish && <span className="form-error">{errors.actualDish}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label required">Target Servings</label>
            <input type="number" min="0" className={`form-input${errors.target ? ' error' : ''}`} value={target} onChange={(e) => setTarget(e.target.value)} />
            {errors.target && <span className="form-error">{errors.target}</span>}
          </div>
          <div className="form-group">
            <label className="form-label required">Actual Servings</label>
            <input type="number" min="0" className={`form-input${errors.actual ? ' error' : ''}`} value={actual} onChange={(e) => setActual(e.target.value)} />
            {errors.actual && <span className="form-error">{errors.actual}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Wasted Servings</label>
            <input type="number" min="0" className="form-input" value={wasted} onChange={(e) => setWasted(e.target.value)} />
          </div>
        </div>

        {pct !== null && (
          <div className={`notice ${pct >= 90 ? 'notice-green' : pct >= 70 ? 'notice-amber' : 'notice-red'}`}>
            Distribution rate: <strong>{pct}%</strong>
            {pct < 70 && ' — significantly below target. Please note the reason.'}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Substitutions / Unavailable Ingredients</label>
          <input className="form-input" value={subs} onChange={(e) => setSubs(e.target.value)} placeholder="e.g. Tomato chutney used instead of coconut" />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>

        <div className="notice notice-amber" style={{ fontSize: '0.7rem' }}>
          Note: Servings distributed ≠ servings consumed. Do not equate these values.
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Record</button>
      </div>
    </form>
  );
}

export function MealDistributionPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<MealDistributionRecord[]>([]);
  const [dateFilter, setDateFilter] = useState(todayISO());
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<MealDistributionRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MealDistributionRecord | null>(null);
  const isWorker = user?.role === 'worker' || user?.role === 'supervisor';

  function load() {
    // Show last 30 days
    const end = todayISO();
    const start = format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const all = getDistributionByDateRange(start, end);
    setRecords(all.filter((r) => !dateFilter || r.date === dateFilter));
  }

  useEffect(() => { load(); }, [dateFilter]);

  // Chart: last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd');
    const dayRecs = getAllDistributionRecords().filter((r) => r.date === d);
    return {
      date: format(new Date(d), 'EEE'),
      target: dayRecs.reduce((s, r) => s + r.targetServings, 0),
      actual: dayRecs.reduce((s, r) => s + r.actualServings, 0),
    };
  });

  function handleSave(data: Omit<MealDistributionRecord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      if (editTarget) {
        updateDistributionRecord(editTarget.id, data);
        toast.success('Record updated.');
      } else {
        createDistributionRecord(data);
        toast.success('Distribution recorded.');
      }
      setShowForm(false);
      setEditTarget(null);
      load();
    } catch (err: any) {
      toast.error(err.message ?? 'Error saving record.');
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteDistributionRecord(deleteTarget.id);
    setDeleteTarget(null);
    load();
    toast.success('Record deleted.');
  }

  const totals = records.reduce((acc, r) => {
    acc.target += r.targetServings;
    acc.actual += r.actualServings;
    return acc;
  }, { target: 0, actual: 0 });
  const distRate = totals.target > 0 ? Math.round((totals.actual / totals.target) * 100) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Meal Distribution</h1>
          <p className="page-subtitle">Track planned vs. actual meal servings</p>
        </div>
        {isWorker && (
          <button className="btn btn-primary btn-sm" onClick={() => { setEditTarget(null); setShowForm(true); }}><Plus size={12} /> Record Distribution</button>
        )}
      </div>

      {/* 7-day chart */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><h2 className="card-title">Last 7 Days — Planned vs. Actual</h2></div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="target" name="Target Servings" fill="#d1d5db" radius={[2,2,0,0]} />
            <Bar dataKey="actual" name="Actual Servings" fill="#3d6b4f" radius={[2,2,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filter and summary */}
      <div className="filter-bar">
        <div className="form-group">
          <input type="date" className="form-input" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setDateFilter('')}>Show All (30 days)</button>
        {distRate !== null && (
          <span className={`badge ${distRate >= 90 ? 'badge-green' : distRate >= 70 ? 'badge-amber' : 'badge-red'}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
            {distRate}% distributed {dateFilter ? `on ${formatDate(dateFilter)}` : '(30 days)'}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {records.length === 0 ? (
          <div className="empty-state">
            <ClipboardCheck className="empty-state-icon" />
            <div className="empty-state-title">No distribution records</div>
            <div className="empty-state-body">{dateFilter ? `No records for ${formatDate(dateFilter)}.` : 'No records in the last 30 days.'}</div>
            {isWorker && <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Plus size={12} /> Record Distribution</button>}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Meal</th>
                <th>Planned Dish</th>
                <th>Actual Dish</th>
                <th>Target</th>
                <th>Actual</th>
                <th>Rate</th>
                <th>Substitutions</th>
                {isWorker && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {[...records].sort((a, b) => b.date.localeCompare(a.date) || a.mealCategory.localeCompare(b.mealCategory)).map((r) => {
                const rate = r.targetServings > 0 ? Math.round((r.actualServings / r.targetServings) * 100) : null;
                return (
                  <tr key={r.id}>
                    <td>{formatDate(r.date)}</td>
                    <td>{getMealCategoryLabel(r.mealCategory)}</td>
                    <td>{r.plannedDish}</td>
                    <td>{r.actualDish}</td>
                    <td>{r.targetServings}</td>
                    <td><strong>{r.actualServings}</strong></td>
                    <td>
                      {rate !== null ? (
                        <span className={`badge ${rate >= 90 ? 'badge-green' : rate >= 70 ? 'badge-amber' : 'badge-red'}`}>{rate}%</span>
                      ) : '—'}
                    </td>
                    <td style={{ color: 'var(--color-slate)', fontSize: '0.75rem', maxWidth: 200 }}>{r.substitutions || '—'}</td>
                    {isWorker && (
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button className="btn-icon" title="Edit" onClick={() => { setEditTarget(r); setShowForm(true); }}><Edit2 size={12} /></button>
                          <button className="btn-icon" title="Delete" style={{ color: 'var(--color-red)' }} onClick={() => setDeleteTarget(r)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Form dialog */}
      {showForm && (
        <div className="dialog-overlay">
          <div className="dialog dialog-wide">
            <div className="dialog-header">
              <h2 className="dialog-title">{editTarget ? 'Edit Distribution Record' : 'Record Meal Distribution'}</h2>
              <button className="btn-icon" onClick={() => { setShowForm(false); setEditTarget(null); }}>&times;</button>
            </div>
            <DistributionForm initial={editTarget ?? undefined} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null); }} />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 380 }}>
            <div className="dialog-header"><h2 className="dialog-title">Delete Record</h2></div>
            <div className="dialog-body">
              <p>Delete distribution record for <strong>{getMealCategoryLabel(deleteTarget.mealCategory)}</strong> on <strong>{formatDate(deleteTarget.date)}</strong>?</p>
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
