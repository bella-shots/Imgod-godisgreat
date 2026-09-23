import { useState } from 'react';
import { 
  FolderTree, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  FileSpreadsheet, 
  FileText, 
  Terminal, 
  Info,
  Building2,
  FolderGit2
} from 'lucide-react';

const DRIVE_SCRIPT = `function createMasterDriveStructure() {
  const rootName = "MASTER COMPANY";
  const topFolders = ["Projects", "Finance", "HR", "Templates", "MOM", "Reports"];
  const sampleProjectName = "PROJECT_Phase1_Test";
  const projectSubFolders = [
    "01_Admin", "02_Checklist", "03_Expenses",
    "04_MOM", "05_Notes", "06_Files", "07_Reports"
  ];

  let rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), rootName);
  let topFolderMap = {};
  topFolders.forEach(name => topFolderMap[name] = getOrCreateFolder(rootFolder, name));

  let sampleProj = getOrCreateFolder(topFolderMap["Projects"], sampleProjectName);
  projectSubFolders.forEach(sub => getOrCreateFolder(sampleProj, sub));

  Logger.log("Created successfully! Root Link: " + rootFolder.getUrl());
}

function getOrCreateFolder(parent, name) {
  let f = parent.getFoldersByName(name);
  return f.hasNext() ? f.next() : parent.createFolder(name);
}`;

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'site' | 'sheets' | 'playbook'>('overview');

  const copyScript = () => {
    navigator.clipboard.writeText(DRIVE_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Master Company Portal</h1>
              <p className="text-xs text-slate-500 font-medium">Google-Native Operations Architecture • ₹0 Cost Gate</p>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            System Status & Roadmap
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'drive' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            Phase 1: Drive Hierarchy
          </button>
          <button
            onClick={() => setActiveTab('site')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'site' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Phase 2: Master Site Map
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sheets' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Phase 3: Data & Forms
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'playbook' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Architecture & Playbook
          </button>
        </div>
      </nav>

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Alert */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900">Architecture-First Spec-Driven Operations</h3>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  This system operates under the <strong>Google-Native Architecture</strong> (Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script) with a strict ₹0 additional software spend gate.
                </p>
              </div>
            </div>

            {/* 5-Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Phase 1 • In Verification
                  </span>
                  <FolderTree className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Google Drive Structure</h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  Authoritative root hierarchy with 6 top-level directories, sample project template, and strict access controls.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Spec: <code>01-google-drive-structure.md</code></span>
                  <button 
                    onClick={() => setActiveTab('drive')}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    View Setup →
                  </button>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs opacity-85">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Phase 2 • Up Next
                  </span>
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Master Google Site</h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  Portal & navigation layer: HOME, PROJECTS, FINANCE, HR, and REPORTS. Safe embeds without exposing raw data.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  Spec: <code>02-master-google-site.md</code>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs opacity-85">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Phase 3 • Scheduled
                  </span>
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Google Sheets + Forms</h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  13 structured operational data tables, 8 submission forms, stable IDs, and permission-protected tabs.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  Spec: <code>03-sheets-and-forms.md</code>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs opacity-85">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Phase 4 • Scheduled
                  </span>
                  <Terminal className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Apps Script Automation</h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  MOM email sender, ₹5,000 expense rule automation, OOP claim processing, salary carry-forward, and audit logs.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  Spec: <code>04-apps-script-automation.md</code>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs opacity-85">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    Phase 5 • Final Gate
                  </span>
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">Testing & Handover</h4>
                <p className="text-xs text-slate-500 mt-1.5">
                  End-to-end UAT checks, security audit, quota verification, maintenance documentation, and final delivery sign-off.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  Spec: <code>05-testing-permissions-handover.md</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'drive' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Visual Folder Tree */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-blue-600" />
                  Authoritative Google Drive Layout
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  14 Folders Total
                </span>
              </div>

              <div className="font-mono text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto leading-relaxed shadow-inner">
                <div className="text-amber-400 font-bold">MASTER COMPANY/</div>
                <div className="pl-4 text-slate-300">├── <span className="text-blue-400">Projects/</span></div>
                <div className="pl-8 text-slate-300">│   └── <span className="text-emerald-400">PROJECT_Phase1_Test/</span></div>
                <div className="pl-12 text-slate-400">│       ├── 01_Admin/</div>
                <div className="pl-12 text-slate-400">│       ├── 02_Checklist/</div>
                <div className="pl-12 text-slate-400">│       ├── 03_Expenses/</div>
                <div className="pl-12 text-slate-400">│       ├── 04_MOM/</div>
                <div className="pl-12 text-slate-400">│       ├── 05_Notes/</div>
                <div className="pl-12 text-slate-400">│       ├── 06_Files/</div>
                <div className="pl-12 text-slate-400">│       └── 07_Reports/</div>
                <div className="pl-4 text-slate-300">├── <span className="text-rose-400">Finance/</span> <span className="text-rose-500 font-sans text-[10px]">(Restricted)</span></div>
                <div className="pl-4 text-slate-300">├── <span className="text-rose-400">HR/</span> <span className="text-rose-500 font-sans text-[10px]">(Restricted)</span></div>
                <div className="pl-4 text-slate-300">├── <span className="text-amber-300">Templates/</span> <span className="text-slate-400 font-sans text-[10px]">(View-Only)</span></div>
                <div className="pl-4 text-slate-300">├── <span className="text-purple-400">MOM/</span></div>
                <div className="pl-4 text-slate-300">└── <span className="text-cyan-400">Reports/</span></div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span><strong>Finance & HR:</strong> Admin & authorized users only. Strict block on general staff.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span><strong>Templates:</strong> General staff get Viewer role to prevent accidental overwrites.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span><strong>Projects:</strong> Scoped per project to assigned personnel.</span>
                </div>
              </div>
            </div>

            {/* Quick Run Script */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-600" />
                    Automated 1-Click Apps Script
                  </h3>
                  <button
                    onClick={copyScript}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Script'}
                  </button>
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  Run this script once inside your Google account to automatically build all 14 folders with zero manual typing:
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-700 max-h-56 overflow-y-auto">
                  <pre>{DRIVE_SCRIPT}</pre>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">File: <code>Phase-1/setup_drive_structure.gs</code></span>
                <a
                  href="https://script.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Open Apps Script
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Phase 2: Master Google Site Map</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Single-entry portal for employees and administrators without custom code or hosting costs.
                </p>
              </div>
              <a
                href="https://sites.google.com/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
              >
                Create on Google Sites
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Page 1</div>
                <h4 className="font-bold text-slate-900 text-sm">HOME</h4>
                <p className="text-xs text-slate-500 mt-1">Company notices, quick links to standard forms, recent announcements.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Page 2</div>
                <h4 className="font-bold text-slate-900 text-sm">PROJECTS</h4>
                <p className="text-xs text-slate-500 mt-1">Active project catalog, countdowns, assigned folders and checklist views.</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Page 3</div>
                <h4 className="font-bold text-slate-900 text-sm">FINANCE</h4>
                <p className="text-xs text-slate-500 mt-1">Expense submission form, OOP claims, salary dashboard (restricted to authorized roles).</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Page 4</div>
                <h4 className="font-bold text-slate-900 text-sm">HR</h4>
                <p className="text-xs text-slate-500 mt-1">Employee directory, leave requests, profile updates (confidential records protected).</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-bold text-purple-600 uppercase mb-1">Page 5</div>
                <h4 className="font-bold text-slate-900 text-sm">REPORTS</h4>
                <p className="text-xs text-slate-500 mt-1">Management summaries, monthly status indices, and automated outputs.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sheets' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Phase 3: Structured Data & Forms Inventory</h3>
              <p className="text-xs text-slate-500 mt-1">
                Authoritative data structures defined in <code>context/feature-specs/03-sheets-and-forms.md</code>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  13 Authoritative Sheets / Tables
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {['Projects', 'Employees', 'Project_Members', 'Project_Notes', 'Project_MOM_Index', 'Budget_Given', 'Employee_Spending', 'OOP_Claims', 'Salary_Admin', 'Investments', 'HR_Admin', 'Report_Index', 'Lists_Config'].map((table) => (
                    <div key={table} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                      {table}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  8 Controlled Google Forms
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    'Create / Request Project Form',
                    'Employee Spending / Expense Form',
                    'Out-of-Pocket (OOP) Claim Form',
                    'Employee Update / HR Request Form',
                    'MOM Input & Minutes Form',
                    'Report Request Form (Optional)',
                    'Investment Entry Form (Admin Only)',
                    'Salary Entry Form (Admin Only)'
                  ].map((form) => (
                    <div key={form} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                      <span>{form}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Google Forms</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playbook' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Playbook & Code Standards</h3>
              <p className="text-xs text-slate-500 mt-1">
                Context-driven agentic rules enforced from <code>docs/AI-Ready-App-Building-Playbook.md</code>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Zero-Cost Gate</h4>
                <p className="text-slate-600 leading-relaxed">
                  Strictly ₹0.00 additional spend. Standard Google Accounts (free tier) power Sites, Sheets, Forms, Drive, and Apps Script.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Spec-Driven Workflow</h4>
                <p className="text-slate-600 leading-relaxed">
                  One bounded unit at a time. No jumping across phases without verified acceptance tests and human approval.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Data Ownership Invariants</h4>
                <p className="text-slate-600 leading-relaxed">
                  Sheets are authoritative for data; Drive is authoritative for files; Sites is presentation only (not a database).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
