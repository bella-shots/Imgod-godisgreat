import { useState } from 'react';
import { 
  FolderTree, 
  ExternalLink, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet, 
  Terminal, 
  Info,
  Building2,
  FolderGit2,
  Lock,
  Clock,
  ShieldAlert,
  FileCode2,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'status' | 'phase1' | 'phase2' | 'architecture'>('status');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 leading-tight">Master Company Operations Portal</h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Google-Native System
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Sites • Sheets • Forms • Drive • Apps Script • ₹0 Spend Gate</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href="https://drive.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />
              Drive
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://sites.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              Sites
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://docs.google.com/spreadsheets" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Sheets
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a 
              href="https://script.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Terminal className="w-3.5 h-3.5" />
              Apps Script
              <ExternalLink className="w-3 h-3 text-blue-500" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'status' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Status & Governance
          </button>
          <button
            onClick={() => setActiveTab('phase1')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'phase1' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Phase 1: Drive Foundation (CLOSED)
          </button>
          <button
            onClick={() => setActiveTab('phase2')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'phase2' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Phase 2: Master Site Spec (UNBLOCKED)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'architecture' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Playbook & Data Invariants
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'status' && (
          <div className="space-y-6">
            {/* Executive Status Banner */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-blue-900">Repository Execution Gate Active</h3>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    This portal operates strictly as the <strong>Status Console</strong> for the Google-Native Enterprise Architecture.
                    All operational records, file storage, user interactions, and automation live natively in Google Cloud (Sites, Sheets, Forms, Drive, and Apps Script).
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-xs">
                Zero Cost: ₹0.00
              </span>
            </div>

            {/* Current Phase Execution Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Lifecycle Gate</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">Phase 2 — Master Google Site</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Unblocked — Awaiting Authorization
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Gate Rule:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Per <code>Main Prompt/Main-Prompt.md</code> (Section 21), Phase 2 is unblocked following Phase 1 completion, but implementation is strictly held until explicit human authorization is issued.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Authoritative Prompt:</span>
                  <p className="text-slate-600 leading-relaxed font-mono">
                    Phase-2/ChatGPT Prompt/Prompt-001.md
                  </p>
                </div>
              </div>
            </div>

            {/* 5-Phase Roadmap Pipeline */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">5-Phase Master Plan Roadmap</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
                {/* Phase 1 */}
                <div className="bg-white p-4 rounded-xl border-2 border-emerald-400 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Phase 1
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Google Drive Foundation</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Canonical hierarchy & 8:40 PM read-only permission audit verified.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-semibold text-emerald-700">
                    STATUS: CLOSED & PASS
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="bg-white p-4 rounded-xl border-2 border-amber-300 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Phase 2
                    </span>
                    <Clock className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Master Google Site</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Portal layout: HOME, PROJECTS, FINANCE, HR, REPORTS.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-semibold text-amber-700">
                    STATUS: UNBLOCKED
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Phase 3
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Sheets + Forms</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    13 structured operational tables & 8 input forms.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    STATUS: BLOCKED
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Phase 4
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Apps Script Automation</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Calculations, triggers, salary ledger & MOM email dispatch.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    STATUS: BLOCKED
                  </div>
                </div>

                {/* Phase 5 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 opacity-60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Phase 5
                    </span>
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Testing & Handover</h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Full UAT, multi-user permissions, quota audit, handover.
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                    STATUS: BLOCKED
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phase1' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Phase 1 Closed & Verified
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Authoritative Google Drive Structure</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hierarchy verified in admin Google Drive root; all 14 paths verified.
                </p>
              </div>
              <a 
                href="https://drive.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Open Google Drive <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Tree Structure Display */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <div className="text-emerald-400 font-bold mb-2">📁 MASTER COMPANY (Root - Private)</div>
              <div className="pl-4 space-y-1">
                <div>├── 📁 Projects/</div>
                <div className="pl-6">└── 📁 PROJECT_Phase1_Test/</div>
                <div className="pl-12 space-y-0.5 text-slate-400">
                  <div>├── 01_Admin/</div>
                  <div>├── 02_Checklist/</div>
                  <div>├── 03_Expenses/</div>
                  <div>├── 04_MOM/</div>
                  <div>├── 05_Notes/</div>
                  <div>├── 06_Files/</div>
                  <div>└── 07_Reports/</div>
                </div>
                <div>├── 📁 Finance/ (Restricted Admin-Only)</div>
                <div>├── 📁 HR/ (Restricted Admin-Only)</div>
                <div>├── 📁 Templates/ (Protected Masters)</div>
                <div>├── 📁 MOM/ (Minutes Archives)</div>
                <div>└── 📁 Reports/ (Management Outputs)</div>
              </div>
            </div>

            {/* Verification Results Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-700">Test ID</th>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-700">Requirement</th>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-700">Status</th>
                    <th className="px-4 py-2.5 text-left font-bold text-slate-700">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">P1-01 to P1-04</td>
                    <td className="px-4 py-2 text-slate-600">Root folder, 6 top-level directories & sample project subfolders</td>
                    <td className="px-4 py-2"><span className="text-emerald-700 font-bold">PASS</span></td>
                    <td className="px-4 py-2 text-slate-500">Verified via Apps Script execution (26-Sep-2026)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">P1-05 & P1-06</td>
                    <td className="px-4 py-2 text-slate-600">Restricted Finance & HR access (zero ordinary employee exposure)</td>
                    <td className="px-4 py-2"><span className="text-emerald-700 font-bold">PASS</span></td>
                    <td className="px-4 py-2 text-slate-500">8:40 PM Audit: Verified PRIVATE (0 editors, 0 viewers)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">P1-07 & P1-08</td>
                    <td className="px-4 py-2 text-slate-600">Project isolation & zero public link exposure</td>
                    <td className="px-4 py-2"><span className="text-emerald-700 font-bold">PASS</span></td>
                    <td className="px-4 py-2 text-slate-500">8:40 PM Audit: General access Restricted (0 public links)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono font-bold text-slate-900">P1-09 to P1-11</td>
                    <td className="px-4 py-2 text-slate-600">Naming convention, template protection & zero-cost gate</td>
                    <td className="px-4 py-2"><span className="text-emerald-700 font-bold">PASS</span></td>
                    <td className="px-4 py-2 text-slate-500">Standard Google Drive personal account used. ₹0.00 spend</td>
                  </tr>
                  <tr className="bg-emerald-50">
                    <td className="px-4 py-2 font-mono font-bold text-emerald-900">P1-12</td>
                    <td className="px-4 py-2 font-bold text-emerald-900">Phase 1 Official Closure</td>
                    <td className="px-4 py-2"><span className="text-emerald-800 font-extrabold">CLOSED</span></td>
                    <td className="px-4 py-2 text-emerald-800 font-medium">All criteria verified and recorded in repository</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'phase2' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  Ready for Phase 2 Implementation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">Master Google Site Navigation & Page Blueprint</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Specification per <code>Phase-2/ChatGPT Prompt/Prompt-001.md</code> and <code>Phase-2-Page-Map.md</code>.
                </p>
              </div>
              <a 
                href="https://sites.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Google Sites <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Page Blueprint Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">1. HOME</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Landing page: Welcome banner, quick navigation cards, company links, and notice board.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">2. PROJECTS</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Project directory hub: Access guidance, Phase 1 project folder links, Phase 3/4 placeholders.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">3. FINANCE</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Controlled entry: Reserved buttons for Submit Expense & Submit OOP Claim Forms. Zero salary data exposure.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">4. HR</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Employee hub: Reserved sections for Employee Information & HR Requests. Zero private record exposure.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 text-xs block mb-1">5. REPORTS</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Management reporting: Reserved placeholders for Management, Project, Finance, and HR reports.
                </p>
              </div>
            </div>

            {/* Invariants Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Phase 2 Invariants & Prohibitions
              </div>
              <p className="leading-relaxed text-amber-800">
                Phase 2 is strictly the <strong>Master Google Site presentation layer</strong>.
                It does not authorize React/Vite, custom databases, Firebase, operational Sheets, Google Forms, or Apps Script automations.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Governance & Architecture Principles</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Rules enforced from <code>AGENTS.md</code> and <code>context/ai-workflow-rules.md</code>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero Additional Cost Gate
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Strictly ₹0.00 additional spend. Powered entirely by standard Google Accounts (Sites, Sheets, Forms, Drive, Apps Script). No paid hosting, databases, or third-party SaaS.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                  <FileCode2 className="w-4 h-4 text-blue-600" />
                  Data Ownership Invariants
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Google Drive is authoritative for files; Google Sheets is authoritative for structured data; Google Sites is presentation only; Google Apps Script is authoritative for automation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-2 font-bold text-slate-900 text-sm">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  Spec-Driven Bounded Cycles
                </div>
                <p className="text-slate-600 leading-relaxed">
                  One bounded unit at a time. No jumping ahead to future phases. Observable verification is required before closing gates.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        Master Company Repository • Controlled Specification Foundation • ₹0 Spend Gate
      </footer>
    </div>
  );
}
