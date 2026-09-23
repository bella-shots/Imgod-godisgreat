import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { ProjectsHub } from './components/projects/ProjectsHub';
import { FinanceHub } from './components/finance/FinanceHub';
import { HRDirectory } from './components/hr/HRDirectory';
import { ReportsHub } from './components/reports/ReportsHub';
import { VisualBuilderHub } from './components/builder/VisualBuilderHub';
import { CustomPageView } from './components/builder/CustomPageView';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [financeSubTab, setFinanceSubTab] = useState<string>('oop');

  const handleOpenQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'oop':
        setFinanceSubTab('oop');
        setActiveTab('finance');
        break;
      case 'spending':
        setFinanceSubTab('spending');
        setActiveTab('finance');
        break;
      case 'mom':
        setActiveTab('projects');
        break;
      case 'newPage':
        setActiveTab('builder');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAction={handleOpenQuickAction}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <HomeDashboard
            onNavigate={setActiveTab}
            onOpenQuickAction={handleOpenQuickAction}
          />
        )}
        {activeTab === 'projects' && <ProjectsHub />}
        {activeTab === 'finance' && <FinanceHub initialSubTab={financeSubTab} />}
        {activeTab === 'hr' && <HRDirectory />}
        {activeTab === 'reports' && <ReportsHub />}
        {activeTab === 'builder' && <VisualBuilderHub />}
        {activeTab === 'pages' && (
          <CustomPageView onOpenBuilder={() => setActiveTab('builder')} />
        )}
      </main>

      {/* System Footer with Zero-Cost & Master Plan Alignment */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              MP
            </div>
            <span className="font-bold text-slate-700">Master Company Operations Portal</span>
            <span>&bull;</span>
            <span className="text-slate-400">Phase 1 through 5 Handover</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>₹0 Additional Spend Gate Verified</span>
            </span>
            <span>&bull;</span>
            <span>Standard Google Accounts RBAC</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
