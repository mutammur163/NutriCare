import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Download } from 'lucide-react';
import {
  getAllChildren, filterChildren, deleteChild,
  generateNextChildId, createChild, updateChild
} from '../services/childrenService';
import type { Child, ChildStatus, Sex } from '../types';
import { calculateAge, formatDate, todayISO } from '../utils/date';
import { exportChildrenCSV } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

function StatusBadge({ status }: { status: ChildStatus }) {
  const cls = status === 'active' ? 'badge-green' : status === 'inactive' ? 'badge-slate' : 'badge-amber';
  return <span className={`badge ${cls}`}>{status}</span>;
}

interface ChildFormData {
  childId: string;
  fullName: string;
  dateOfBirth: string;
  sex: Sex;
  centreId: string;
  parentName: string;
  contactNumber: string;
  address: string;
  dietaryRestrictions: string;
  allergies: string;
  feedingNotes: string;
  registrationDate: string;
  status: ChildStatus;
}

function ChildForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Partial<ChildFormData> & { childId?: string };
  onSave: (d: ChildFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ChildFormData>({
    childId: initial.childId ?? '',
    fullName: initial.fullName ?? '',
    dateOfBirth: initial.dateOfBirth ?? '',
    sex: initial.sex ?? 'male',
    centreId: 'centre-01',
    parentName: initial.parentName ?? '',
    contactNumber: initial.contactNumber ?? '',
    address: initial.address ?? '',
    dietaryRestrictions: initial.dietaryRestrictions ?? '',
    allergies: initial.allergies ?? '',
    feedingNotes: initial.feedingNotes ?? '',
    registrationDate: initial.registrationDate ?? todayISO(),
    status: initial.status ?? 'active',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChildFormData, string>>>({});

  function setField<K extends keyof ChildFormData>(key: K, value: ChildFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate(): boolean {
    const e: Partial<Record<keyof ChildFormData, string>> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
    if (!form.parentName.trim()) e.parentName = 'Parent name is required';
    if (!form.childId.trim()) e.childId = 'Child ID is required';
    if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
      e.dateOfBirth = 'Date of birth cannot be in the future';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  const inp = (id: keyof ChildFormData, label: string, required = false, inputProps: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="form-group">
      <label htmlFor={id} className={`form-label${required ? ' required' : ''}`}>{label}</label>
      <input
        id={id}
        className={`form-input${errors[id] ? ' error' : ''}`}
        value={form[id] as string}
        onChange={(e) => setField(id, e.target.value as any)}
        {...inputProps}
      />
      {errors[id] && <span className="form-error">{errors[id]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {inp('childId', 'Child ID', true, { placeholder: 'AWC14-001' })}
          {inp('fullName', 'Full Name', true, { placeholder: 'Child full name' })}
          {inp('dateOfBirth', 'Date of Birth', true, { type: 'date', max: todayISO() })}
          <div className="form-group">
            <label htmlFor="sex" className="form-label required">Sex</label>
            <select
              id="sex"
              className="form-input"
              value={form.sex}
              onChange={(e) => setField('sex', e.target.value as Sex)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          {inp('parentName', 'Parent / Caregiver Name', true)}
          {inp('contactNumber', 'Contact Number', false, { type: 'tel' })}
        </div>
        {inp('address', 'Address', false, { placeholder: 'Optional' })}
        <div className="form-group">
          <label htmlFor="dietaryRestrictions" className="form-label">Dietary Restrictions</label>
          <input
            id="dietaryRestrictions"
            className="form-input"
            value={form.dietaryRestrictions}
            onChange={(e) => setField('dietaryRestrictions', e.target.value)}
            placeholder="e.g. vegetarian (comma-separated)"
          />
          <span className="form-hint">Separate multiple entries with commas</span>
        </div>
        <div className="form-group">
          <label htmlFor="allergies" className="form-label">Allergies</label>
          <input
            id="allergies"
            className="form-input"
            value={form.allergies}
            onChange={(e) => setField('allergies', e.target.value)}
            placeholder="e.g. peanuts, milk (comma-separated)"
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedingNotes" className="form-label">Feeding Notes</label>
          <textarea
            id="feedingNotes"
            className="form-input"
            value={form.feedingNotes}
            onChange={(e) => setField('feedingNotes', e.target.value)}
            placeholder="Any relevant feeding notes"
            rows={2}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {inp('registrationDate', 'Registration Date', false, { type: 'date' })}
          <div className="form-group">
            <label htmlFor="childStatus" className="form-label">Status</label>
            <select
              id="childStatus"
              className="form-input"
              value={form.status}
              onChange={(e) => setField('status', e.target.value as ChildStatus)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Save Record</button>
      </div>
    </form>
  );
}

export function ChildrenPage() {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Child | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Child | null>(null);

  const load = useCallback(() => {
    const kids = filterChildren({
      status: statusFilter !== 'all' ? statusFilter : undefined,
      ageGroup: ageFilter !== 'all' ? ageFilter : undefined,
    }).filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.childId.toLowerCase().includes(q) ||
        c.parentName.toLowerCase().includes(q)
      );
    });
    setChildren(kids);
  }, [search, statusFilter, ageFilter]);

  useEffect(() => {
    load();
  }, [load]);

  function handleCreate(data: ChildFormData) {
    try {
      const allergies = data.allergies
        ? data.allergies.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const dietaryRestrictions = data.dietaryRestrictions
        ? data.dietaryRestrictions.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      createChild({ ...data, allergies, dietaryRestrictions });
      setShowForm(false);
      load();
      toast.success('Child record created successfully.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create record.');
    }
  }

  function handleEdit(data: ChildFormData) {
    if (!editing) return;
    try {
      const allergies = data.allergies
        ? data.allergies.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      const dietaryRestrictions = data.dietaryRestrictions
        ? data.dietaryRestrictions.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      updateChild(editing.id, { ...data, allergies, dietaryRestrictions });
      setEditing(null);
      setShowForm(false);
      load();
      toast.success('Record updated.');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update record.');
    }
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteChild(deleteTarget.id);
    setDeleteTarget(null);
    load();
    toast.success('Record deleted.');
  }

  const isWorker = user?.role === 'worker' || user?.role === 'supervisor';
  const nextId = generateNextChildId();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Children</h1>
          <p className="page-subtitle">{children.length} record{children.length !== 1 ? 's' : ''} shown</p>
        </div>
        {isWorker && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={exportChildrenCSV}>
              <Download size={13} /> Export CSV
            </button>
            <button
              id="btn-register-child"
              className="btn btn-primary btn-sm"
              onClick={() => { setEditing(null); setShowForm(true); }}
            >
              <Plus size={13} /> Register Child
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1, maxWidth: 280 }}>
          <Search size={13} className="search-icon" />
          <input
            id="children-search"
            className="form-input search-input"
            placeholder="Search by name, ID, or parent…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          id="status-filter"
          className="form-input"
          style={{ width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="transferred">Transferred</option>
        </select>
        <select
          id="age-filter"
          className="form-input"
          style={{ width: 'auto' }}
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        >
          <option value="all">All ages</option>
          <option value="6-12m">6–12 months</option>
          <option value="1-2y">1–2 years</option>
          <option value="2-3y">2–3 years</option>
          <option value="3-5y">3–5 years</option>
          <option value="5-6y">5–6 years</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {children.length === 0 ? (
          <div className="empty-state" style={{ padding: 40 }}>
            <div className="empty-state-title">No children found</div>
            <div className="empty-state-body">
              {search || statusFilter !== 'all' || ageFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Register the first child to get started.'}
            </div>
            {isWorker && !search && statusFilter === 'all' && ageFilter === 'all' && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
                <Plus size={12} /> Register Child
              </button>
            )}
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Child ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Parent / Caregiver</th>
                <th>Allergies</th>
                <th>Status</th>
                <th>Registered</th>
                {isWorker && <th style={{ width: 80 }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {children.map((child) => (
                <tr key={child.id}>
                  <td>
                    <code style={{ fontSize: '0.75rem', background: 'var(--color-surface-2)', padding: '2px 5px', borderRadius: 3 }}>
                      {child.childId}
                    </code>
                  </td>
                  <td><strong>{child.fullName}</strong></td>
                  <td style={{ color: 'var(--color-slate)' }}>{calculateAge(child.dateOfBirth)}</td>
                  <td style={{ textTransform: 'capitalize', color: 'var(--color-slate)' }}>{child.sex}</td>
                  <td>{child.parentName}</td>
                  <td>
                    {child.allergies.length > 0 ? (
                      <span className="badge badge-red">{child.allergies.join(', ')}</span>
                    ) : (
                      <span style={{ color: 'var(--color-slate)', fontSize: '0.75rem' }}>None</span>
                    )}
                  </td>
                  <td><StatusBadge status={child.status} /></td>
                  <td style={{ color: 'var(--color-slate)' }}>{formatDate(child.registrationDate)}</td>
                  {isWorker && (
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <Link to={`/children/${child.id}`} className="btn-icon" title="View profile">
                          <Eye size={13} />
                        </Link>
                        <button
                          className="btn-icon"
                          title="Edit"
                          onClick={() => { setEditing(child); setShowForm(true); }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Delete"
                          style={{ color: 'var(--color-red)' }}
                          onClick={() => setDeleteTarget(child)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Register / Edit form dialog */}
      {showForm && (
        <div className="dialog-overlay">
          <div className="dialog dialog-wide">
            <div className="dialog-header">
              <h2 className="dialog-title">{editing ? 'Edit Child Record' : 'Register Child'}</h2>
              <button className="btn-icon" onClick={() => { setShowForm(false); setEditing(null); }}>✕</button>
            </div>
            <ChildForm
              initial={
                editing
                  ? {
                      ...editing,
                      dietaryRestrictions: editing.dietaryRestrictions.join(', '),
                      allergies: editing.allergies.join(', '),
                    }
                  : { childId: nextId }
              }
              onSave={editing ? handleEdit : handleCreate}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 380 }}>
            <div className="dialog-header">
              <h2 className="dialog-title">Delete Child Record</h2>
            </div>
            <div className="dialog-body">
              <p style={{ margin: 0 }}>
                Are you sure you want to delete the record for <strong>{deleteTarget.fullName}</strong>?
              </p>
              <div className="notice notice-red" style={{ marginTop: 12 }}>
                This will also delete all linked growth measurements and follow-up tasks. This action cannot be undone.
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
