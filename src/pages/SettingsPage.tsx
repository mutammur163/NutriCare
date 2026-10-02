import { useState, useEffect } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { getSettings, updateSettings } from '../services/settingsService';
import { resetToSeedData } from '../services/store';
import type { CentreSettings, Language } from '../types';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const [settings, setSettings] = useState<CentreSettings | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  if (!settings) return null;

  function handleChange(field: keyof CentreSettings, value: any) {
    setSettings((s) => s ? { ...s, [field]: value } : s);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    updateSettings(settings);
    setSaved(true);
    toast.success('Settings saved.');
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    resetToSeedData();
    setShowResetConfirm(false);
    toast.success('Demo data reset. Please refresh the page.');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure centre and application preferences</p>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {/* Centre settings */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Centre Information</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label htmlFor="centreName" className="form-label required">Centre Name</label>
                <input id="centreName" className="form-input" value={settings.centreName} onChange={(e) => handleChange('centreName', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="centreLocation" className="form-label">Centre Location</label>
                <input id="centreLocation" className="form-input" value={settings.centreLocation} onChange={(e) => handleChange('centreLocation', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="workerName" className="form-label">Worker Display Name</label>
                <input id="workerName" className="form-input" value={settings.workerDisplayName} onChange={(e) => handleChange('workerDisplayName', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Application Preferences</h2></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label htmlFor="language" className="form-label">Preferred Language</label>
                <select id="language" className="form-input" value={settings.preferredLanguage}
                  onChange={(e) => handleChange('preferredLanguage', e.target.value as Language)}>
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="budget" className="form-label">Default Serving Budget (₹)</label>
                <input id="budget" type="number" min="1" className="form-input" value={settings.defaultServingBudget}
                  onChange={(e) => handleChange('defaultServingBudget', parseFloat(e.target.value))} />
                <span className="form-hint">Used as default filter in meal planner suggestions</span>
              </div>
              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="notifications" checked={settings.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)} />
                <label htmlFor="notifications" className="form-label" style={{ margin: 0 }}>Enable notifications</label>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary"><Save size={13} /> {saved ? 'Saved!' : 'Save Settings'}</button>
        </div>
      </form>

      {/* Demo data reset */}
      <div className="card" style={{ marginTop: 20, borderColor: '#fca5a5' }}>
        <div className="card-header"><h2 className="card-title" style={{ color: 'var(--color-red)' }}>Demo Data Management</h2></div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', margin: '0 0 12px' }}>
          Reset all application data to the original fictional demo records. This will erase any records you have added during this session.
        </p>
        <button type="button" className="btn btn-danger" onClick={() => setShowResetConfirm(true)}>
          <RotateCcw size={13} /> Reset to Demo Data
        </button>
      </div>

      {/* Reset confirm dialog */}
      {showResetConfirm && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 420 }}>
            <div className="dialog-header"><h2 className="dialog-title">Reset Demo Data</h2></div>
            <div className="dialog-body">
              <p>This will <strong>permanently erase</strong> all data you have entered and restore the original fictional demo records.</p>
              <div className="notice notice-red" style={{ marginTop: 12 }}>
                All children, measurements, meal plans, distribution records, and follow-ups will be reset. This cannot be undone.
              </div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReset}><RotateCcw size={12} /> Yes, Reset Everything</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
