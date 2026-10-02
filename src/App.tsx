import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ChildrenPage } from './pages/ChildrenPage';
import { ChildProfilePage } from './pages/ChildProfilePage';
import { GrowthMonitoringPage } from './pages/GrowthMonitoringPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { MealDistributionPage } from './pages/MealDistributionPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { EducationPage } from './pages/EducationPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AccessDenied() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <h1 style={{ fontSize: '1.25rem', margin: 0 }}>Access Denied</h1>
      <p style={{ color: 'var(--color-slate)', margin: 0 }}>You do not have permission to view this page.</p>
      <a href="/dashboard" style={{ color: 'var(--color-forest)' }}>← Return to Dashboard</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontSize: '0.8125rem', borderRadius: 4, border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
            duration: 3000,
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/education" element={<EducationPage />} />

            {/* Worker + Supervisor routes */}
            <Route path="/children" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><ChildrenPage /></ProtectedRoute>
            } />
            <Route path="/children/:id" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><ChildProfilePage /></ProtectedRoute>
            } />
            <Route path="/growth" element={<GrowthMonitoringPage />} />
            <Route path="/meal-planner" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><MealPlannerPage /></ProtectedRoute>
            } />
            <Route path="/distribution" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><MealDistributionPage /></ProtectedRoute>
            } />
            <Route path="/follow-ups" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><FollowUpsPage /></ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><ReportsPage /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute allowedRoles={['worker', 'supervisor']}><SettingsPage /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
