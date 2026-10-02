import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, TrendingUp, UtensilsCrossed, ClipboardList,
  ClipboardCheck, BookOpen, FileText, Settings, LogOut, Menu, X,
  Leaf, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface NavItemDef {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItemDef[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={16} />, label: 'Dashboard', roles: ['worker', 'supervisor', 'parent'] },
  { to: '/children', icon: <Users size={16} />, label: 'Children', roles: ['worker', 'supervisor'] },
  { to: '/growth', icon: <TrendingUp size={16} />, label: 'Growth Monitoring', roles: ['worker', 'supervisor', 'parent'] },
  { to: '/meal-planner', icon: <UtensilsCrossed size={16} />, label: 'Meal Planner', roles: ['worker', 'supervisor'] },
  { to: '/distribution', icon: <ClipboardCheck size={16} />, label: 'Meal Distribution', roles: ['worker', 'supervisor'] },
  { to: '/follow-ups', icon: <ClipboardList size={16} />, label: 'Follow-ups', roles: ['worker', 'supervisor'] },
  { to: '/education', icon: <BookOpen size={16} />, label: 'Nutrition Education', roles: ['worker', 'supervisor', 'parent'] },
  { to: '/reports', icon: <FileText size={16} />, label: 'Reports', roles: ['worker', 'supervisor'] },
  { to: '/settings', icon: <Settings size={16} />, label: 'Settings', roles: ['worker', 'supervisor'] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="sidebar-logo">
        <div style={{ width: 26, height: 26, background: 'var(--color-forest)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Leaf size={14} color="#fff" />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, opacity: 0.95 }}>NutriCare</div>
            <div style={{ fontSize: '0.65rem', opacity: 0.6, fontWeight: 400 }}>Child Nutrition</div>
          </div>
        )}
        <button
          className="btn-icon"
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.6)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : <Menu size={14} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && user && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '8px 0', color: 'rgba(255,255,255,0.6)' }}
          title={collapsed ? 'Log out' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}

// Mobile nav overlay
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const visibleItems = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <button className="btn-icon" onClick={() => setOpen(true)} aria-label="Open menu">
        <Menu size={18} />
      </button>
      {open && (
        <div className="dialog-overlay" onClick={() => setOpen(false)}>
          <div
            style={{ position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, background: 'var(--color-charcoal)', display: 'flex', flexDirection: 'column', zIndex: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>Menu</span>
              <button className="btn-icon" onClick={() => setOpen(false)} style={{ color: 'rgba(255,255,255,0.6)' }}><X size={16} /></button>
            </div>
            <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
                <LogOut size={16} /><span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
