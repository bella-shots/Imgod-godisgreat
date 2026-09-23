import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  Receipt,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Sparkles,
  ShieldCheck,
  Building,
  TrendingUp
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: string) => void;
  onOpenQuickAction: (actionType: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenQuickAction
}) => {
  const {
    currentUser,
    projects,
    employees,
    oopClaims,
    spendings,
    budgets,
    momRecords,
    salaryRecords,
    customPages,
    oopThreshold
  } = useApp();

  const totalBudget = projects.reduce((acc, p) => acc + p.Budget_Total, 0);
  const totalSpent = spendings.filter(s => s.Status === 'Verified').reduce((acc, s) => acc + s.Amount, 0);
  const pendingClaims = oopClaims.filter(c => c.Status === 'Pending');
  const claimsOverThreshold = pendingClaims.filter(c => c.Policy_Threshold_Exceeded);
  const activeProjects = projects.filter(p => p.Status === 'Active');

  // Days remaining calculation helper
  const getDaysRemaining = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = new Date('2026-09-23T09:00:00').getTime(); // Current simulation date
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Company Master Operations Portal &bull; Zero-Cost Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Centralized company management for Projects, Finance, HR, MOM records, and the Visual Page Builder.
            Logged in as <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong> in <span className="text-blue-200">{currentUser.department}</span>.
          </p>
          
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuickAction('oop')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>File OOP Claim (₹5,000 Rule)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-all flex items-center gap-1.5"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Browse Active Projects ({activeProjects.length})</span>
            </button>
            <button
              onClick={() => onNavigate('builder')}
              className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Visual Page Builder</span>
            </button>
          </div>
        </div>

        {/* Decorative background grid */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Projects */}
        <div
          onClick={() => onNavigate('projects')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{activeProjects.length}</span>
            <span className="text-xs text-slate-500">/ {projects.length} Total</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Next milestone in {getDaysRemaining('2026-10-15')} days</span>
          </p>
        </div>

        {/* Metric 2: Financial Spend vs Budget */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Spend</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">₹{totalSpent.toLocaleString()}</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Allocated: ₹{totalBudget.toLocaleString()}</span>
              <span>{Math.round((totalSpent / totalBudget) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, Math.round((totalSpent / totalBudget) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 3: OOP Claims & ₹5k Rule Flag */}
        <div
          onClick={() => onNavigate('finance')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">OOP Claims</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{pendingClaims.length}</span>
            <span className="text-xs text-amber-600 font-semibold">Pending Review</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {claimsOverThreshold.length > 0 ? (
              <span className="text-amber-700 font-medium">
                &bull; {claimsOverThreshold.length} claim(s) exceed ₹{oopThreshold.toLocaleString()} cap
              </span>
            ) : (
              <span>All pending claims within standard allowance</span>
            )}
          </p>
        </div>

        {/* Metric 4: People & Directory */}
        <div
          onClick={() => onNavigate('hr')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Directory</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {employees.filter(e => e.Active).length}
            </span>
            <span className="text-xs text-slate-500">Active Staff</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            100% Google Account mapped identity
          </p>
        </div>

      </div>

      {/* Two Column Layout: Event Milestones & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Event Countdowns (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Project Event Milestones & Countdown</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Authoritative dates sourced from Master Projects sheet</p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              View All Projects &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {projects.map(project => {
              const days = getDaysRemaining(project.Event_Date);
              const isUrgent = days <= 30 && days > 0;
              return (
                <div
                  key={project.Project_ID}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {project.Project_ID}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{project.Project_Name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                        {project.Status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{project.Description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span>Lead: <strong className="text-slate-700">{project.Owner}</strong></span>
                      <span>Budget: <strong className="text-slate-700">₹{project.Budget_Total.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-medium">Target Date</div>
                      <div className="text-xs font-mono font-bold text-slate-700">{project.Event_Date}</div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl font-black text-center min-w-[76px] ${
                      isUrgent
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-200'
                    }`}>
                      <div className="text-base leading-none">{days}</div>
                      <div className="text-[9px] uppercase font-bold tracking-tight">Days Left</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Permissions & Security Status Box */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">Active Permissions (RBAC)</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enforcing Phase 1 & 3 Permissions Matrix for <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.role}).
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700 font-medium">Projects & Files</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  {currentUser.role === 'admin' ? 'Full Admin / Edit' : 'Read & Assigned Edit'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700 font-medium">OOP Claims Submissions</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                  All Employees Allowed
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700 font-medium">OOP Approval & Payout</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentUser.role === 'admin'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-amber-700 bg-amber-50'
                }`}>
                  {currentUser.role === 'admin' ? 'Authorized Signatory' : 'View Own Only'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700 font-medium">Salary Ledger & Carry-Forward</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  currentUser.role === 'admin'
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-rose-700 bg-rose-50'
                }`}>
                  {currentUser.role === 'admin' ? 'Restricted Admin Access' : 'Locked (Direct API Denied)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-700 font-medium">Visual Page Builder</span>
                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                  {currentUser.role === 'admin' ? 'Create & Publish' : 'Draft / View'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <div className="text-[11px] font-bold text-blue-900 uppercase">Architecture Note</div>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Targeting ₹0 additional spend with standard Google Accounts and client-side RBAC validation.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity & Published MOMs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Published Minutes of Meeting (MOM) with Email Log */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Minutes of Meeting (MOM)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Structured records with recipient email logs (Phase 4 automation)</p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              MOM Hub &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {momRecords.slice(0, 2).map(mom => (
              <div key={mom.MOM_ID} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-700">{mom.MOM_ID}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        mom.Status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {mom.Status} (v{mom.Version})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{mom.Title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mom.Discussion_Summary}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500 whitespace-nowrap">
                    {mom.Meeting_Date}
                  </div>
                </div>

                {mom.Distribution_Logs && mom.Distribution_Logs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Emailed to {mom.Distribution_Logs.length} attendees</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Log verified
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Departmental Pages / CMS Hub */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Custom Portal Pages (Visual CMS)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Published pages built with the Visual Page Builder</p>
            </div>
            <button
              onClick={() => onNavigate('builder')}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Open Builder &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {customPages.map(page => (
              <div
                key={page.Page_ID}
                onClick={() => onNavigate('pages')}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {page.Category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {page.Status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{page.Title}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">/{page.Slug}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
