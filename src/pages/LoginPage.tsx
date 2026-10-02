import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, LogIn, AlertCircle } from 'lucide-react';
import { login as authLogin } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_CREDENTIALS } from '../data/demoUsers';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = authLogin(email.trim(), password);
      if (result.success && result.user) {
        login(result.user);
        navigate('/dashboard');
      } else {
        setError(result.error ?? 'Login failed.');
      }
      setLoading(false);
    }, 400);
  }

  function autofill(credIdx: number) {
    setEmail(DEMO_CREDENTIALS[credIdx].email);
    setPassword(DEMO_CREDENTIALS[credIdx].password);
    setError('');
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, background: 'var(--color-forest)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Leaf size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>NutriCare</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-slate)', marginTop: 2, marginBottom: 0 }}>Child Nutrition &amp; Meal Planning System</p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-slate)', marginTop: 6 }}>Sign in to continue</p>
        </div>

        {/* Login card */}
        <div className="card" style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label htmlFor="email" className="form-label required">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label required">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: 36 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="btn-icon"
                    style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)' }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="notice notice-red" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                <LogIn size={14} />
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="card" style={{ marginTop: 16, padding: '16px 20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Demo accounts — click to autofill
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DEMO_CREDENTIALS.map((cred, idx) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => autofill(idx)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', border: '1px solid var(--color-border)', borderRadius: 4, background: 'var(--color-surface-2)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                onMouseOver={(e) => (e.currentTarget.style.background = 'var(--color-forest-muted)')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'var(--color-surface-2)')}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-charcoal)' }}>{cred.user.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>{cred.email}</div>
                </div>
                <span className="badge badge-forest" style={{ textTransform: 'capitalize' }}>{cred.user.role}</span>
              </button>
            ))}
          </div>
          <div className="notice notice-amber" style={{ marginTop: 12, fontSize: '0.7rem' }}>
            These credentials are hardcoded for demonstration only. Replace with real authentication before deployment.
          </div>
        </div>
      </div>
    </div>
  );
}
