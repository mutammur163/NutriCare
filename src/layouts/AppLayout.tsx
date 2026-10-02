import { Outlet } from 'react-router-dom';
import { Sidebar, MobileNav } from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { getSettings } from '../services/settingsService';
import { useState, useEffect } from 'react';

export function AppLayout() {
  const { user } = useAuth();
  const [centreName, setCentreName] = useState('NutriCare Centre');

  useEffect(() => {
    const s = getSettings();
    setCentreName(s.centreName);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Sidebar — desktop */}
      <div style={{ display: 'flex', flexShrink: 0 }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <header className="main-header">
          {/* Mobile menu trigger */}
          <div style={{ display: 'none' }} className="mobile-menu-trigger">
            <MobileNav />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {centreName}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', textAlign: 'right' }}>
              <div style={{ fontWeight: 500, color: 'var(--color-charcoal)' }}>{user?.name}</div>
              <div style={{ textTransform: 'capitalize' }}>{user?.role}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <Outlet />
        </main>

        {/* Demo notice */}
        <div style={{ padding: '6px 20px', background: '#fef3c7', borderTop: '1px solid #fde68a', fontSize: '0.7rem', color: '#92400e', textAlign: 'center' }}>
          ⚠ Demo mode — all records are fictional and stored in your browser. Not for clinical use.
        </div>
      </div>
    </div>
  );
}
