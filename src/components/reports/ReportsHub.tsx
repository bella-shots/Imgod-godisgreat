import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Users,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export const ReportsHub: React.FC = () => {
  const {
    projects,
    employees,
    budgets,
    spendings,
    oopClaims,
    salaryRecords,
    investments,
    currentUser
  } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const isAdmin = currentUser.role === 'admin';

  // Overall calculations
  const totalProjectBudget = projects.reduce((sum, p) => sum + p.Budget_Total, 0);
  const totalVerifiedSpend = spendings.filter(s => s.Status === 'Verified').reduce((sum, s) => sum + s.Amount, 0);
  const totalPendingClaims = oopClaims.filter(c => c.Status === 'Pending').reduce((sum, c) => sum + c.Amount, 0);
  const totalApprovedPaidClaims = oopClaims
    .filter(c => c.Status === 'Paid' || c.Status === 'Approved')
    .reduce((sum, c) => sum + (c.Approved_Amount || c.Amount), 0);

  const totalSalaryDue = salaryRecords.reduce((sum, s) => sum + s.Due_Amount, 0);
  const totalSalaryPaid = salaryRecords.reduce((sum, s) => sum + s.Paid_Amount, 0);
  const totalPendingCarryForward = salaryRecords
    .filter(s => s.Month === '2026-09') // latest cycle
    .reduce((sum, s) => sum + s.Pending_Carry_Forward, 0);

  const totalActiveInvestments = investments
    .filter(i => i.Status === 'Active')
    .reduce((sum, i) => sum + i.Amount, 0);

  // CSV Exporter
  const exportToCSV = (tableName: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header => {
            const val = row[header];
            if (typeof val === 'object') {
              return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            }
            return `"${String(val ?? '').replace(/"/g, '""')}"`;
          })
          .join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${tableName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(tableName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const exportSheets = [
    { id: 'projects', name: 'Projects', desc: 'Authoritative Project records & budget metadata', data: projects, sensitive: false },
    { id: 'employees', name: 'Employees', desc: 'Master staff directory & Google Account mappings', data: employees, sensitive: true },
    { id: 'budget_given', name: 'Budget_Given', desc: 'Authoritative allocations disbursed for operations', data: budgets, sensitive: true },
    { id: 'employee_spending', name: 'Employee_Spending', desc: 'Operational receipts, vendors, and line items', data: spendings, sensitive: false },
    { id: 'oop_claims', name: 'OOP_Claims', desc: 'Out-of-pocket claims & ₹5,000 threshold status', data: oopClaims, sensitive: true },
    { id: 'salary_admin', name: 'Salary_Admin', desc: 'Monthly dues, disbursements & carry-forward history', data: salaryRecords, sensitive: true, adminOnly: true },
    { id: 'investments', name: 'Investments', desc: 'Capital tranches, terms & maturity tracking', data: investments, sensitive: true, adminOnly: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span>Master Reports &amp; Schema Exports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational Summaries, Financial Reconciliation, and Phase 3 Google Sheet CSV Exports (F11, B4-09)
          </p>
        </div>

        {downloadSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Downloaded {downloadSuccess}.csv</span>
          </div>
        )}
      </div>

      {/* Financial Reconciliation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Total Project Budget</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalProjectBudget.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Verified: ₹{totalVerifiedSpend.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">OOP Reimbursements</div>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalApprovedPaidClaims.toLocaleString()}</div>
          <div className="text-xs text-amber-600 font-semibold mt-1">Pending: ₹{totalPendingClaims.toLocaleString()}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Salary Disbursed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {isAdmin ? `₹${totalSalaryPaid.toLocaleString()}` : 'Confidential'}
          </div>
          <div className="text-xs text-rose-600 font-semibold mt-1">
            {isAdmin ? `Pending Carry: ₹${totalPendingCarryForward.toLocaleString()}` : 'Admin only'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold uppercase text-slate-400">Active Capital Inflows</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {isAdmin ? `₹${totalActiveInvestments.toLocaleString()}` : 'Confidential'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isAdmin ? `${investments.filter(i => i.Status === 'Active').length} Active Tranches` : 'Admin only'}
          </div>
        </div>
      </div>

      {/* Phase 3 Sheet Schema Exporters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <span>Authoritative Google Sheet Exports (Phase 3 Schema)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Download raw structured data matching the exact columns and relations documented in Phase-3-Sheet-Schema.md
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {exportSheets.map(sheet => {
            const isBlocked = sheet.adminOnly && !isAdmin;
            return (
              <div
                key={sheet.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{sheet.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                      {sheet.data.length} records
                    </span>
                    {sheet.sensitive && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800">
                        Sensitive Tab
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{sheet.desc}</p>
                </div>

                <div>
                  {isBlocked ? (
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-lg">
                      Admin Only
                    </span>
                  ) : (
                    <button
                      onClick={() => exportToCSV(sheet.name, sheet.data)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
