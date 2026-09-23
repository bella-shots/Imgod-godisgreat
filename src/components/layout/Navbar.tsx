import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  FolderKanban,
  Receipt,
  Users,
  BarChart3,
  Palette,
  Globe,
  RotateCcw,
  ShieldCheck,
  UserCheck,
  Briefcase,
  ChevronDown,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAction: (actionType: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickAction
}) => {
  const { currentUser, setCurrentUser, availableUsers, oopClaims, momRecords, resetToDemoData } = useApp();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const pendingClaimsCount = oopClaims.filter(c => c.Status === 'Pending').length;
  const draftMomCount = momRecords.filter(m => m.Status === 'Draft').length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            <ShieldCheck className="w-3 h-3" /> Master Admin
          </span>
        );
      case 'project_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Briefcase className="w-3 h-3" /> Project Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3 h-3" /> Employee
          </span>
        );
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Building2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: draftMomCount > 0 ? `${draftMomCount} Draft MOM` : undefined },
    { id: 'finance', label: 'Finance', icon: Receipt, badge: pendingClaimsCount > 0 ? `${pendingClaimsCount} Pending` : undefined },
    { id: 'hr', label: 'HR Directory', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'builder', label: 'Visual Builder', icon: Palette, highlight: true },
    { id: 'pages', label: 'Published Pages', icon: Globe }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-sm group-hover:scale-105 transition-transform">
                <span className="text-xl tracking-tighter">MP</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base group-hover:text-blue-600 transition-colors">
                    MASTER PORTAL
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                    2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Internal Company Operations Hub</p>
              </div>
            </button>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action & User Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action Button */}
            <div className="relative">
              <button
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {quickActionOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs font-medium">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                    Fast Operations
                  </div>
                  <button
                    onClick={() => {
                      onOpenQuickAction('oop');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>File OOP Claim (₹5k Rule)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">₹</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenQuickAction('spending');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700"
                  >
                    Submit Vendor Expense
                  </button>
                  <button
                    onClick={() => {
                      onOpenQuickAction('mom');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700"
                  >
                    Draft Project MOM (Minutes)
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      onOpenQuickAction('newPage');
                      setQuickActionOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Create Custom Page in Builder</span>
                  </button>
                </div>
              )}
            </div>

            {/* Current Role Persona Selector (RBAC Demonstration) */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Switch simulated user persona to test permissions"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left text-xs leading-tight">
                  <div className="font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">Simulated User Persona (RBAC)</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Switch personas to test permission matrices (Admin vs PM vs Employee).
                    </p>
                  </div>
                  <div className="py-1">
                    {availableUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 text-xs hover:bg-slate-50 flex items-center justify-between ${
                          currentUser.id === user.id ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-800">{user.name}</div>
                          <div className="text-[11px] text-slate-500">{user.email}</div>
                          <div className="text-[10px] text-slate-400">{user.department}</div>
                        </div>
                        <div className="text-right">
                          {getRoleBadge(user.role)}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 p-2">
                    <button
                      onClick={() => {
                        if (window.confirm('Reset all portal data back to original seed data?')) {
                          resetToDemoData();
                          setUserDropdownOpen(false);
                        }
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Demo Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile nav sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-slate-50/80 overflow-x-auto text-xs">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-2.5 py-1 rounded-md font-semibold whitespace-nowrap ${
              activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
