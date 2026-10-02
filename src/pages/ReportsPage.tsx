import { useState, useEffect } from 'react';
import { Download, Printer, FileText } from 'lucide-react';
import { getReportData, exportChildrenCSV, exportGrowthCSV, exportDistributionCSV, exportFollowUpsCSV } from '../services/reportService';
import { formatDateTime } from '../utils/date';

export function ReportsPage() {
  const [report, setReport] = useState<ReturnType<typeof getReportData> | null>(null);

  useEffect(() => {
    setReport(getReportData());
  }, []);

  if (!report) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Generated at {formatDateTime(report.generatedAt)} · Demo data</p>
        </div>
        <button className="btn btn-secondary btn-sm no-print" onClick={() => window.print()}><Printer size={12} /> Print</button>
      </div>

      <div className="notice notice-amber" style={{ marginBottom: 16, fontSize: '0.75rem' }}>
        <strong>Demo Report</strong> — All data is fictional. Do not use for clinical or administrative decisions. Export CSV for further analysis.
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Children', value: report.totalChildren },
          { label: 'Active Children', value: report.activeChildren },
          { label: 'New Registrations (30d)', value: report.recentRegistrations },
          { label: 'Total Measurements', value: report.totalMeasurements },
          { label: 'Measurements (30d)', value: report.measurementsThisMonth },
          { label: 'Total Distributions', value: report.totalDistributions },
          { label: 'Distributions (30d)', value: report.distributionsThisMonth },
          { label: 'Total Follow-ups', value: report.totalFollowUps },
          { label: 'Open Follow-ups', value: report.openFollowUps },
          { label: 'Completed Follow-ups', value: report.completedFollowUps },
          { label: 'Meal Plans Created', value: report.totalMealPlans },
        ].map((item) => (
          <div key={item.label} className="stat-card" style={{ flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{item.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Export section */}
      <div className="card no-print">
        <div className="card-header">
          <h2 className="card-title"><FileText size={14} style={{ display: 'inline', marginRight: 6 }} />Export Reports</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Children Registration Summary', desc: 'All child records with demographic and registration information', fn: exportChildrenCSV },
            { label: 'Growth Measurement History', desc: 'All growth records with WHO screening status', fn: () => exportGrowthCSV() },
            { label: 'Meal Distribution Records', desc: 'All distribution records (last 30 days)', fn: () => exportDistributionCSV() },
            { label: 'Follow-up Task Summary', desc: 'All follow-up tasks with status and notes', fn: exportFollowUpsCSV },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: 4 }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{item.desc}</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={item.fn}><Download size={12} /> CSV</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
