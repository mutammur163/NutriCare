import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ClipboardList, AlertTriangle } from 'lucide-react';
import {
  getAllFollowUps, createFollowUp, updateFollowUp, deleteFollowUp, filterFollowUps
} from '../services/followUpService';
import { getAllChildren } from '../services/childrenService';
import type { FollowUpTask, FollowUpStatus, FollowUpReason, FollowUpPriority, Child } from '../types';
import { formatDate, todayISO, isOverdue } from '../utils/date';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const REASONS: { value: FollowUpReason; label: string }[] = [
  { value: 'measurement_due', label: 'Measurement Due' },
  { value: 'missing_records', label: 'Missing / Incomplete Records' },
  { value: 'professional_review', label: 'Professional Review Required' },
  { value: 'caregiver_meeting', label: 'Caregiver Meeting Required' },
  { value: 'post_referral', label: 'Post-Referral Follow-up' },
  { value: 'meal_concern', label: 'Meal Participation Concern' },
  { value: 'other', label: 'Other' },
];

function FollowUpForm({ initial, children, onSave, onCancel }: {
  initial?: Partial<FollowUpTask>;
  children: Child[];
  onSave: (data: Omit<FollowUpTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [childId, setChildId] = useState(initial?.childId ?? '');
  const [reason, setReason] = useState<FollowUpReason>(initial?.reason ?? 'measurement_due');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [priority, setPriority] = useState<FollowUpPriority>(initial?.priority ?? 'medium');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [status, setStatus] = useState<FollowUpStatus>(initial?.status ?? 'open');
  const [resolutionNotes, setResolutionNotes] = useState(initial?.resolutionNotes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: typeof errors = {};
    if (!childId) e.childId = 'Child required';
    if (!dueDate) e.dueDate = 'Due date required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      childId, reason, createdDate: initial?.createdDate ?? todayISO(), dueDate,
      priority, assignedTo: initial?.assignedTo ?? (user?.name ?? 'Worker'),
      notes: notes || undefined, status, resolutionNotes: resolutionNotes || undefined,
      completedDate: status === 'completed' ? (initial?.completedDate ?? todayISO()) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="form-group">
          <label className="form-label required">Child</label>
          <select className={`form-input${errors.childId ? ' error' : ''}`} value={childId} onChange={(e) => setChildId(e.target.value)}>
            <option value="">— Select child —</option>
            {children.filter((c) => c.status === 'active').map((c) => (
              <option key={c.id} value={c.id}>{c.fullName} ({c.childId})</option>
            ))}
          </select>
          {errors.childId && <span className="form-error">{errors.childId}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label required">Reason</label>
            <select className="form-input" value={reason} onChange={(e) => setReason(e.target.value as FollowUpReason)}>
              {REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">Due Date</label>
            <input type="date" className={`form-input${errors.dueDate ? ' error' : ''}`} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            {errors.dueDate && <span className="form-error">{errors.dueDate}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={priority} onChange={(e) => setPriority(e.target.value as FollowUpPriority)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as FollowUpStatus)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Describe the concern or context" />
        </div>

        {(status === 'completed' || initial?.status === 'completed') && (
          <div className="form-group">
            <label className="form-label">Resolution Notes</label>
            <textarea className="form-input" value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} rows={2} placeholder="What action was taken?" />
          </div>
        )}

        <div className="notice notice-blue" style={{ fontSize: '0.7rem' }}>
          Follow-up tasks are operational reminders only. Do not use them to make medical diagnoses or imply neglect from missing records.
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}

export function FollowUpsPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [childMap, setChildMap] = useState<Record<string, Child>>({});
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<FollowUpTask | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FollowUpTask | null>(null);
  const isWorker = user?.role === 'worker' || user?.role === 'supervisor';

  function load() {
    const kids = getAllChildren();
    setChildren(kids);
    setChildMap(Object.fromEntries(kids.map((c) => [c.id, c])));
    setTasks(filterFollowUps({ status: statusFilter }));
  }

  useEffect(() => { load(); }, [statusFilter]);

  function handleSave(data: Omit<FollowUpTask, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      if (editTarget) {
        updateFollowUp(editTarget.id, data);
        toast.success('Follow-up updated.');
      } else {
        createFollowUp(data);
        toast.success('Follow-up created.');
      }
      setShowForm(false);
      setEditTarget(null);
      load();
    } catch (err: any) {
      toast.error(err.message ?? 'Error saving follow-up.');
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteFollowUp(deleteTarget.id);
    setDeleteTarget(null);
    load();
    toast.success('Follow-up deleted.');
  }

  function quickComplete(task: FollowUpTask) {
    updateFollowUp(task.id, { status: 'completed', completedDate: todayISO() });
    load();
    toast.success('Marked as completed.');
  }

  const openCount = tasks.filter((t) => t.status !== 'completed').length;
  const overdueCount = tasks.filter((t) => t.status !== 'completed' && isOverdue(t.dueDate)).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-ups</h1>
          <p className="page-subtitle">{openCount} open · {overdueCount > 0 ? <span style={{ color: 'var(--color-red)' }}>{overdueCount} overdue</span> : '0 overdue'}</p>
        </div>
        {isWorker && (
          <button className="btn btn-primary btn-sm" onClick={() => { setEditTarget(null); setShowForm(true); }}><Plus size={12} /> Create Follow-up</button>
        )}
      </div>

      {overdueCount > 0 && (
        <div className="notice notice-red" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <AlertTriangle size={14} />
          <span><strong>{overdueCount} follow-up{overdueCount !== 1 ? 's are' : ' is'} overdue.</strong> Please review and take action.</span>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        {(['all', 'open', 'in_progress', 'completed'] as const).map((s) => (
          <button key={s} className={`tab-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {tasks.length === 0 ? (
        <div className="empty-state card">
          <ClipboardList className="empty-state-icon" />
          <div className="empty-state-title">No follow-ups</div>
          <div className="empty-state-body">
            {statusFilter === 'all' ? 'No follow-up tasks created yet.' : `No tasks with status "${statusFilter}".`}
          </div>
          {isWorker && statusFilter === 'all' && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}><Plus size={12} /> Create Follow-up</button>
          )}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Child</th>
                <th>Reason</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Notes</th>
                {isWorker && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => {
                const child = childMap[t.childId];
                const overdue = t.status !== 'completed' && isOverdue(t.dueDate);
                return (
                  <tr key={t.id} style={{ background: overdue ? '#fff5f5' : undefined }}>
                    <td>
                      {child ? (
                        <Link to={`/children/${child.id}`} style={{ fontWeight: 500 }}>{child.fullName}</Link>
                      ) : <span style={{ color: 'var(--color-slate)' }}>Unknown</span>}
                    </td>
                    <td>{REASONS.find((r) => r.value === t.reason)?.label ?? t.reason}</td>
                    <td>
                      <span style={{ color: overdue ? 'var(--color-red)' : undefined, fontWeight: overdue ? 600 : undefined }}>
                        {formatDate(t.dueDate)}
                        {overdue && ' ⚠'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${t.priority === 'high' ? 'badge-red' : t.priority === 'medium' ? 'badge-amber' : 'badge-slate'}`}>{t.priority}</span>
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'completed' ? 'badge-green' : t.status === 'in_progress' ? 'badge-blue' : 'badge-amber'}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-slate)' }}>{t.assignedTo}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-slate)', maxWidth: 200 }}>{t.notes || '—'}</td>
                    {isWorker && (
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {t.status !== 'completed' && (
                            <button className="btn btn-secondary btn-sm" onClick={() => quickComplete(t)}>✓</button>
                          )}
                          <button className="btn-icon" onClick={() => { setEditTarget(t); setShowForm(true); }}><Edit2 size={12} /></button>
                          <button className="btn-icon" style={{ color: 'var(--color-red)' }} onClick={() => setDeleteTarget(t)}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Form dialog */}
      {showForm && (
        <div className="dialog-overlay">
          <div className="dialog dialog-wide">
            <div className="dialog-header">
              <h2 className="dialog-title">{editTarget ? 'Edit Follow-up' : 'Create Follow-up'}</h2>
              <button className="btn-icon" onClick={() => { setShowForm(false); setEditTarget(null); }}>&times;</button>
            </div>
            <FollowUpForm initial={editTarget ?? undefined} children={children} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null); }} />
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 380 }}>
            <div className="dialog-header"><h2 className="dialog-title">Delete Follow-up</h2></div>
            <div className="dialog-body">
              <p>Delete this follow-up task for <strong>{childMap[deleteTarget.childId]?.fullName ?? 'unknown child'}</strong>?</p>
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
