import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OOPClaim, SalaryRecord, Investment, BudgetGiven, EmployeeSpending } from '../../types';
import {
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Lock,
  DollarSign,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  Building,
  FileSpreadsheet
} from 'lucide-react';

export const FinanceHub: React.FC<{ initialSubTab?: string }> = ({ initialSubTab = 'oop' }) => {
  const {
    currentUser,
    oopClaims,
    addOOPClaim,
    approveOOPClaim,
    payOOPClaim,
    rejectOOPClaim,
    oopThreshold,
    salaryRecords,
    addSalaryRecord,
    processSalaryPayment,
    generateMonthlyCycle,
    budgets,
    addBudget,
    spendings,
    addSpending,
    verifySpending,
    investments,
    addInvestment,
    updateInvestmentStatus,
    projects,
    employees
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  // Modals
  const [showNewOOPModal, setShowNewOOPModal] = useState(false);
  const [showNewSpendingModal, setShowNewSpendingModal] = useState(false);
  const [showNewBudgetModal, setShowNewBudgetModal] = useState(false);
  const [showNewInvestmentModal, setShowNewInvestmentModal] = useState(false);
  const [selectedClaimForApproval, setSelectedClaimForApproval] = useState<OOPClaim | null>(null);
  const [approvalCustomAmount, setApprovalCustomAmount] = useState<number>(0);
  const [paymentModalRecord, setPaymentModalRecord] = useState<SalaryRecord | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(0);

  // OOP Form
  const [newOOPData, setNewOOPData] = useState({
    Employee_ID: currentUser.id,
    Month: '2026-09',
    Date: new Date().toISOString().split('T')[0],
    Purpose: '',
    Amount: 3500,
    Project_ID: projects[0]?.Project_ID || 'PRJ-101',
    Proof_URL: 'https://drive.google.com/file/d/receipt-sample'
  });

  // Spending Form
  const [newSpendingData, setNewSpendingData] = useState({
    Employee_ID: currentUser.id,
    Date: new Date().toISOString().split('T')[0],
    Amount: 5000,
    Vendor: '',
    Purpose: '',
    Project_ID: projects[0]?.Project_ID || 'PRJ-101',
    Attachment_URL: 'https://drive.google.com/file/d/invoice-sample'
  });

  // Budget Form
  const [newBudgetData, setNewBudgetData] = useState({
    Date: new Date().toISOString().split('T')[0],
    Recipient: employees[1]?.Name || 'Sarah Jenkins',
    Recipient_Email: employees[1]?.Email || 'sarah.j@company.com',
    Amount: 100000,
    Purpose: '',
    Project_ID: projects[0]?.Project_ID || 'PRJ-101',
    Status: 'Allocated' as BudgetGiven['Status'],
    Proof_URL: 'https://drive.google.com/file/d/budget-disburse-003',
    Created_By: currentUser.name
  });

  // Investment Form
  const [newInvestmentData, setNewInvestmentData] = useState({
    Source_Person: '',
    Amount: 500000,
    Taken_Date: new Date().toISOString().split('T')[0],
    Expected_Return_Date: '2027-09-23',
    Expected_Return_Rate: '12% p.a.',
    Notes: ''
  });

  // Selected Month for Salary View
  const [salaryMonthFilter, setSalaryMonthFilter] = useState('2026-09');

  // RBAC checks
  const isAdmin = currentUser.role === 'admin';

  // OOP Claims filtering (employees only see their own claims unless admin)
  const visibleOOPClaims = isAdmin
    ? oopClaims
    : oopClaims.filter(c => c.Employee_ID === currentUser.id);

  const handleCreateOOP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOOPData.Purpose || newOOPData.Amount <= 0) return;
    const emp = employees.find(e => e.Employee_ID === newOOPData.Employee_ID) || {
      Name: currentUser.name,
      Email: currentUser.email
    };
    addOOPClaim({
      Employee_ID: newOOPData.Employee_ID,
      Employee_Name: emp.Name,
      Employee_Email: emp.Email,
      Month: newOOPData.Month,
      Date: newOOPData.Date,
      Purpose: newOOPData.Purpose,
      Amount: newOOPData.Amount,
      Project_ID: newOOPData.Project_ID,
      Proof_URL: newOOPData.Proof_URL
    });
    setShowNewOOPModal(false);
    setNewOOPData({
      Employee_ID: currentUser.id,
      Month: '2026-09',
      Date: new Date().toISOString().split('T')[0],
      Purpose: '',
      Amount: 3500,
      Project_ID: projects[0]?.Project_ID || 'PRJ-101',
      Proof_URL: 'https://drive.google.com/file/d/receipt-sample'
    });
  };

  const handleCreateSpending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpendingData.Vendor || newSpendingData.Amount <= 0) return;
    const emp = employees.find(e => e.Employee_ID === newSpendingData.Employee_ID) || { Name: currentUser.name };
    addSpending({
      Employee_ID: newSpendingData.Employee_ID,
      Employee_Name: emp.Name,
      Date: newSpendingData.Date,
      Amount: newSpendingData.Amount,
      Vendor: newSpendingData.Vendor,
      Purpose: newSpendingData.Purpose,
      Project_ID: newSpendingData.Project_ID,
      Attachment_URL: newSpendingData.Attachment_URL
    });
    setShowNewSpendingModal(false);
  };

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetData.Purpose || newBudgetData.Amount <= 0) return;
    addBudget(newBudgetData);
    setShowNewBudgetModal(false);
  };

  const handleCreateInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvestmentData.Source_Person || newInvestmentData.Amount <= 0) return;
    addInvestment(newInvestmentData);
    setShowNewInvestmentModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span>Master Finance Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational Out-of-Pocket Claims (₹5,000 Rule), Spending Ledgers, Budgets, and Admin Salary Carry-Forward
          </p>
        </div>

        {/* Quick Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'oop', label: 'OOP Claims (₹5k Rule)' },
            { id: 'policy', label: 'Policy Engine' },
            { id: 'spending', label: 'Employee Spending' },
            { id: 'budget', label: 'Budget Given' },
            { id: 'salary', label: 'Salary Admin (Locked)', adminOnly: true },
            { id: 'investments', label: 'Investments', adminOnly: true }
          ].map(tab => {
            const isTabAdminOnly = tab.adminOnly && !isAdmin;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeSubTab === tab.id
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.adminOnly && <Lock className={`w-3 h-3 ${isAdmin ? 'text-blue-500' : 'text-slate-400'}`} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: OOP REIMBURSEMENT CLAIMS (F10 & B4-04) */}
      {activeSubTab === 'oop' && (
        <div className="space-y-4">
          
          {/* Policy Banner Notice */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h3 className="font-bold text-amber-900">Standard Allowance Policy: ₹{oopThreshold.toLocaleString()} Threshold</h3>
                <p className="text-amber-800 mt-0.5">
                  Routine business out-of-pocket expenses up to ₹{oopThreshold.toLocaleString()} are fast-tracked.
                  Claims exceeding ₹{oopThreshold.toLocaleString()} are automatically flagged for Admin review, supporting documentation verification, and optional split approval.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNewOOPModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Submit OOP Claim</span>
            </button>
          </div>

          {/* Claims Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Out-of-Pocket Claims Ledger ({visibleOOPClaims.length})
                </h3>
                <p className="text-xs text-slate-500">
                  {isAdmin
                    ? 'Showing all employee claims across projects (Admin View)'
                    : `Showing claims submitted by ${currentUser.name} (Self View)`}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-3">Claim ID</th>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Project</th>
                    <th className="p-3">Purpose &amp; Policy Notes</th>
                    <th className="p-3 text-right">Amount</th>
                    <th className="p-3 text-center">Threshold</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleOOPClaims.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        No reimbursement claims recorded yet.
                      </td>
                    </tr>
                  ) : (
                    visibleOOPClaims.map(claim => {
                      const exceeds = claim.Policy_Threshold_Exceeded;
                      return (
                        <tr key={claim.Claim_ID} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-blue-700">
                            {claim.Claim_ID}
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{claim.Employee_Name}</div>
                            <div className="text-[10px] text-slate-400">{claim.Employee_Email}</div>
                          </td>
                          <td className="p-3 text-slate-600 whitespace-nowrap">
                            {claim.Date}
                          </td>
                          <td className="p-3">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700">
                              {claim.Project_ID}
                            </span>
                          </td>
                          <td className="p-3 max-w-xs">
                            <div className="font-semibold text-slate-800">{claim.Purpose}</div>
                            {claim.Notes && (
                              <div className="text-[10px] text-slate-500 mt-0.5">{claim.Notes}</div>
                            )}
                            {claim.Proof_URL && (
                              <a
                                href={claim.Proof_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-blue-600 hover:underline block mt-0.5"
                              >
                                View Receipt Proof &rarr;
                              </a>
                            )}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                            ₹{claim.Amount.toLocaleString()}
                            {claim.Approved_Amount !== undefined && claim.Approved_Amount !== claim.Amount && (
                              <div className="text-[10px] text-emerald-600">
                                Appr: ₹{claim.Approved_Amount.toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            {exceeds ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                &gt; ₹5k Cap
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                claim.Status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : claim.Status === 'Approved'
                                  ? 'bg-blue-100 text-blue-800'
                                  : claim.Status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {claim.Status}
                            </span>
                            {claim.Paid_Date && (
                              <div className="text-[9px] text-slate-400 mt-0.5">{claim.Paid_Date}</div>
                            )}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap">
                            {isAdmin && claim.Status === 'Pending' && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedClaimForApproval(claim);
                                    setApprovalCustomAmount(claim.Amount);
                                  }}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                                >
                                  Review &amp; Approve
                                </button>
                                <button
                                  onClick={() => rejectOOPClaim(claim.Claim_ID)}
                                  className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded font-bold text-[11px]"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {isAdmin && claim.Status === 'Approved' && (
                              <button
                                onClick={() => payOOPClaim(claim.Claim_ID)}
                                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px]"
                              >
                                Mark Paid
                              </button>
                            )}
                            {!isAdmin && (
                              <span className="text-slate-400 text-[11px]">
                                {claim.Status === 'Pending' ? 'In Review' : claim.Status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: POLICY ENGINE & EXPLANATION */}
      {activeSubTab === 'policy' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>₹5,000 Out-of-Pocket Allowance Rule &amp; Automation Architecture (B4-04)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Documenting the exact Phase 4 rule specification as frozen in the Playbook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
              <div className="text-xs font-bold text-blue-900 uppercase">1. Standard Threshold</div>
              <div className="text-2xl font-black text-blue-700">₹{oopThreshold.toLocaleString()}</div>
              <p className="text-xs text-blue-800">
                Single claims under or equal to ₹5,000 undergo standard expedited review without secondary senior finance routing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
              <div className="text-xs font-bold text-amber-900 uppercase">2. Threshold Exceeded Alert</div>
              <div className="text-2xl font-black text-amber-700">&gt; ₹{oopThreshold.toLocaleString()}</div>
              <p className="text-xs text-amber-800">
                Any claim exceeding ₹5,000 is automatically tagged with <code>Policy_Threshold_Exceeded = true</code>, prompting Admin review.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <div className="text-xs font-bold text-emerald-900 uppercase">3. Split Payout Support</div>
              <div className="text-2xl font-black text-emerald-700">Configurable</div>
              <p className="text-xs text-emerald-800">
                Admins can approve up to ₹5,000 for immediate disbursement while deferring the remaining balance to the subsequent cycle.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-800">Playbook Excerpt (Authoritative Phase 4 Constraint):</h4>
            <blockquote className="italic text-slate-600 border-l-2 border-slate-300 pl-3 py-1">
              &ldquo;Implement only the exact interpretation approved for the project. Do not invent extra unapproved lines, approval behaviors, or arbitrary salary treatments. Preserve the ₹5,000 allowance wording as a configurable policy.&rdquo;
            </blockquote>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: EMPLOYEE SPENDING LEDGER (F07) */}
      {activeSubTab === 'spending' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Project Spending Records (F07)</h3>
              <p className="text-xs text-slate-500">Direct purchases and vendor payments logged across projects</p>
            </div>
            <button
              onClick={() => setShowNewSpendingModal(true)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Spending</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Spending ID</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Vendor &amp; Purpose</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {spendings.map(s => (
                  <tr key={s.Spending_ID} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{s.Spending_ID}</td>
                    <td className="p-3 font-bold text-slate-900">{s.Employee_Name}</td>
                    <td className="p-3 text-slate-600">{s.Date}</td>
                    <td className="p-3 font-mono text-blue-700">{s.Project_ID}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-800">{s.Vendor}</div>
                      <div className="text-[10px] text-slate-500">{s.Purpose}</div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{s.Amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        s.Status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {s.Status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isAdmin && s.Status === 'Submitted' ? (
                        <button
                          onClick={() => verifySpending(s.Spending_ID, true)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                        >
                          Verify Receipt
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: BUDGET GIVEN (F07) */}
      {activeSubTab === 'budget' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Budget Given to Persons (F07)</h3>
              <p className="text-xs text-slate-500">Authoritative advance allocations issued for project operations</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowNewBudgetModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Allocate Budget</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-3">Budget ID</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3">Created By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgets.map(b => (
                  <tr key={b.Budget_ID} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{b.Budget_ID}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{b.Recipient}</div>
                      <div className="text-[10px] text-slate-400">{b.Recipient_Email}</div>
                    </td>
                    <td className="p-3 text-slate-600">{b.Date}</td>
                    <td className="p-3 font-mono text-blue-700">{b.Project_ID}</td>
                    <td className="p-3 text-slate-800 max-w-xs">{b.Purpose}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                      ₹{b.Amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {b.Status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{b.Created_By}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SALARY ADMIN & CARRY-FORWARD (F09 & B4-05) - LOCKED TO ADMIN */}
      {activeSubTab === 'salary' && (
        <div>
          {!isAdmin ? (
            <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Access Restricted: Admin Only (Direct API Denial)</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Per the Permissions Matrix (Phase 1 &amp; 3), salary ledger records, carry-forward balances, and compensation data are strictly restricted to the Master Admin persona.
              </p>
              <div className="pt-2">
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-3 py-1 rounded border">
                  Current User: {currentUser.name} ({currentUser.role})
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Admin Carry Forward Explanation */}
              <div className="p-4 rounded-xl bg-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 font-mono text-[10px] font-bold">
                      Rule B4-05
                    </span>
                    <h3 className="font-bold text-sm">Salary Carry-Forward Formula</h3>
                  </div>
                  <p className="text-xs text-blue-200 mt-1 font-mono">
                    Pending_Carry_Forward = (Due_Amount + Prior_Carry_Forward) - Paid_Amount
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={salaryMonthFilter}
                    onChange={e => setSalaryMonthFilter(e.target.value)}
                    className="px-3 py-1.5 bg-blue-800 text-white rounded-lg text-xs font-semibold border border-blue-700"
                  >
                    <option value="2026-09">Cycle: September 2026</option>
                    <option value="2026-08">Cycle: August 2026</option>
                    <option value="2026-07">Cycle: July 2026</option>
                  </select>

                  <button
                    onClick={() => generateMonthlyCycle('2026-10')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-xs"
                  >
                    + Roll to Oct 2026
                  </button>
                </div>
              </div>

              {/* Salary Ledger Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Record ID</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Month</th>
                      <th className="p-3 text-right">Base Due</th>
                      <th className="p-3 text-right">Prior Carry-Forward</th>
                      <th className="p-3 text-right">Total Payable</th>
                      <th className="p-3 text-right">Paid Amount</th>
                      <th className="p-3 text-right text-rose-600">Pending Carry</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Disburse Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salaryRecords
                      .filter(r => r.Month === salaryMonthFilter)
                      .map(rec => {
                        const totalPayable = rec.Due_Amount + rec.Prior_Carry_Forward;
                        return (
                          <tr key={rec.Salary_Record_ID} className="hover:bg-slate-50">
                            <td className="p-3 font-mono font-bold text-slate-700">
                              {rec.Salary_Record_ID}
                            </td>
                            <td className="p-3 font-bold text-slate-900">{rec.Employee_Name}</td>
                            <td className="p-3 font-mono text-slate-600">{rec.Month}</td>
                            <td className="p-3 text-right font-mono">₹{rec.Due_Amount.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-slate-600">
                              {rec.Prior_Carry_Forward > 0 ? `+ ₹${rec.Prior_Carry_Forward.toLocaleString()}` : '—'}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900">
                              ₹{totalPayable.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono text-emerald-700 font-bold">
                              ₹{rec.Paid_Amount.toLocaleString()}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-rose-600">
                              ₹{rec.Pending_Carry_Forward.toLocaleString()}
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  rec.Status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : rec.Status === 'Partial'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {rec.Status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {rec.Status !== 'Paid' ? (
                                <button
                                  onClick={() => {
                                    setPaymentModalRecord(rec);
                                    setPaymentAmountInput(rec.Pending_Carry_Forward);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                                >
                                  Disburse / Pay
                                </button>
                              ) : (
                                <span className="text-emerald-700 font-semibold text-[11px]">Completed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 6: INVESTMENTS (F12) - LOCKED TO ADMIN */}
      {activeSubTab === 'investments' && (
        <div>
          {!isAdmin ? (
            <div className="bg-white rounded-xl border border-rose-200 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Access Restricted: Admin Only (Direct API Denial)</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Investment portfolios and debt obligations are confidential to Master Admin per the Phase 1 &amp; 3 access matrix.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Authoritative Investment Ledger (F12)</h3>
                  <p className="text-xs text-slate-500">Capital inflows, partner loans, and maturity dates</p>
                </div>
                <button
                  onClick={() => setShowNewInvestmentModal(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Record Investment</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="p-3">Investment ID</th>
                      <th className="p-3">Source / Partner</th>
                      <th className="p-3 text-right">Principal Amount</th>
                      <th className="p-3">Taken Date</th>
                      <th className="p-3">Expected Return</th>
                      <th className="p-3">Rate / Notes</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {investments.map(inv => (
                      <tr key={inv.Investment_ID} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{inv.Investment_ID}</td>
                        <td className="p-3 font-bold text-slate-900">{inv.Source_Person}</td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900 text-sm">
                          ₹{inv.Amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-slate-600">{inv.Taken_Date}</td>
                        <td className="p-3 text-slate-800 font-semibold">{inv.Expected_Return_Date}</td>
                        <td className="p-3 text-slate-600">
                          <div>{inv.Expected_Return_Rate}</div>
                          <div className="text-[10px] text-slate-400">{inv.Notes}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.Status === 'Returned' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {inv.Status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {inv.Status === 'Active' && (
                            <button
                              onClick={() => updateInvestmentStatus(inv.Investment_ID, 'Returned')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                            >
                              Mark Returned
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Submit OOP Claim */}
      {showNewOOPModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">File OOP Reimbursement Claim</h3>
            <form onSubmit={handleCreateOOP} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Employee</label>
                {isAdmin ? (
                  <select
                    value={newOOPData.Employee_ID}
                    onChange={e => setNewOOPData({ ...newOOPData, Employee_ID: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {employees.map(emp => (
                      <option key={emp.Employee_ID} value={emp.Employee_ID}>
                        {emp.Name} ({emp.Department})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.name} (${currentUser.email})`}
                    className="w-full px-3 py-2 border rounded-lg bg-slate-100 text-slate-600 font-semibold"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Claim Date</label>
                  <input
                    type="date"
                    value={newOOPData.Date}
                    onChange={e => setNewOOPData({ ...newOOPData, Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project</label>
                  <select
                    value={newOOPData.Project_ID}
                    onChange={e => setNewOOPData({ ...newOOPData, Project_ID: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {projects.map(p => (
                      <option key={p.Project_ID} value={p.Project_ID}>
                        {p.Project_ID}: {p.Project_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Claim Amount (INR ₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newOOPData.Amount}
                  onChange={e => setNewOOPData({ ...newOOPData, Amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                />
                
                {/* Real-time policy warning */}
                <div className="mt-1.5 p-2 rounded-lg text-[11px]">
                  {newOOPData.Amount > oopThreshold ? (
                    <div className="text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Exceeds standard ₹{oopThreshold.toLocaleString()} monthly allowance. Requires Admin review and supporting receipt verification.</span>
                    </div>
                  ) : (
                    <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Within ₹{oopThreshold.toLocaleString()} standard monthly threshold. Fast-track eligible.</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose / Description</label>
                <textarea
                  rows={2}
                  required
                  value={newOOPData.Purpose}
                  onChange={e => setNewOOPData({ ...newOOPData, Purpose: e.target.value })}
                  placeholder="e.g. Client meeting transit and emergency supplies"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Receipt / Google Drive Proof URL</label>
                <input
                  type="url"
                  value={newOOPData.Proof_URL}
                  onChange={e => setNewOOPData({ ...newOOPData, Proof_URL: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewOOPModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin OOP Review & Custom Approval */}
      {selectedClaimForApproval && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Admin Review: {selectedClaimForApproval.Claim_ID}</h3>
            <div className="space-y-2 text-xs bg-slate-50 p-3 rounded-lg">
              <div><strong>Employee:</strong> {selectedClaimForApproval.Employee_Name}</div>
              <div><strong>Purpose:</strong> {selectedClaimForApproval.Purpose}</div>
              <div><strong>Claimed Amount:</strong> ₹{selectedClaimForApproval.Amount.toLocaleString()}</div>
              {selectedClaimForApproval.Policy_Threshold_Exceeded && (
                <div className="text-amber-800 font-bold flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Exceeds standard ₹5,000 threshold.</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">
                Approved Amount (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                max={selectedClaimForApproval.Amount}
                value={approvalCustomAmount}
                onChange={e => setApprovalCustomAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-base"
              />
              <p className="text-[11px] text-slate-500">
                You can approve full amount (₹{selectedClaimForApproval.Amount.toLocaleString()}) or partial amount under ₹5,000 policy cap.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setSelectedClaimForApproval(null)}
                className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  approveOOPClaim(selectedClaimForApproval.Claim_ID, approvalCustomAmount);
                  setSelectedClaimForApproval(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Process Salary Payment */}
      {paymentModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Salary Disbursement</h3>
            <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg">
              <div><strong>Employee:</strong> {paymentModalRecord.Employee_Name}</div>
              <div><strong>Month:</strong> {paymentModalRecord.Month}</div>
              <div><strong>Base Due:</strong> ₹{paymentModalRecord.Due_Amount.toLocaleString()}</div>
              <div><strong>Prior Carry-Forward:</strong> ₹{paymentModalRecord.Prior_Carry_Forward.toLocaleString()}</div>
              <div className="pt-1 border-t text-sm font-bold text-slate-900">
                Total Pending: ₹{paymentModalRecord.Pending_Carry_Forward.toLocaleString()}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">
                Disbursement Payout Amount (INR ₹)
              </label>
              <input
                type="number"
                min="1"
                max={paymentModalRecord.Pending_Carry_Forward}
                value={paymentAmountInput}
                onChange={e => setPaymentAmountInput(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold text-base"
              />
              <p className="text-[11px] text-slate-500">
                Any remaining unpaid balance will automatically calculate as Pending Carry-Forward for the next cycle.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setPaymentModalRecord(null)}
                className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  processSalaryPayment(paymentModalRecord.Salary_Record_ID, paymentAmountInput);
                  setPaymentModalRecord(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
              >
                Disburse Funds
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Record Spending */}
      {showNewSpendingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Vendor Expense (F07)</h3>
            <form onSubmit={handleCreateSpending} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Vendor / Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud / Delhi Catering Hub"
                  value={newSpendingData.Vendor}
                  onChange={e => setNewSpendingData({ ...newSpendingData, Vendor: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={newSpendingData.Date}
                    onChange={e => setNewSpendingData({ ...newSpendingData, Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project</label>
                  <select
                    value={newSpendingData.Project_ID}
                    onChange={e => setNewSpendingData({ ...newSpendingData, Project_ID: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {projects.map(p => (
                      <option key={p.Project_ID} value={p.Project_ID}>
                        {p.Project_ID}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (INR ₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newSpendingData.Amount}
                  onChange={e => setNewSpendingData({ ...newSpendingData, Amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose</label>
                <input
                  type="text"
                  value={newSpendingData.Purpose}
                  onChange={e => setNewSpendingData({ ...newSpendingData, Purpose: e.target.value })}
                  placeholder="Brief business reason"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Invoice / Receipt Drive Link</label>
                <input
                  type="url"
                  value={newSpendingData.Attachment_URL}
                  onChange={e => setNewSpendingData({ ...newSpendingData, Attachment_URL: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewSpendingModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Budget */}
      {showNewBudgetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Allocate Operational Budget</h3>
            <form onSubmit={handleCreateBudget} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newBudgetData.Recipient}
                  onChange={e => setNewBudgetData({ ...newBudgetData, Recipient: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount (INR ₹)</label>
                  <input
                    type="number"
                    min="1000"
                    value={newBudgetData.Amount}
                    onChange={e => setNewBudgetData({ ...newBudgetData, Amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Project</label>
                  <select
                    value={newBudgetData.Project_ID}
                    onChange={e => setNewBudgetData({ ...newBudgetData, Project_ID: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {projects.map(p => (
                      <option key={p.Project_ID} value={p.Project_ID}>
                        {p.Project_ID}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose</label>
                <textarea
                  rows={2}
                  required
                  value={newBudgetData.Purpose}
                  onChange={e => setNewBudgetData({ ...newBudgetData, Purpose: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewBudgetModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Allocate Funds
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Investment */}
      {showNewInvestmentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Investment Capital</h3>
            <form onSubmit={handleCreateInvestment} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Source / Partner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Angel Investor / Partner Fund"
                  value={newInvestmentData.Source_Person}
                  onChange={e => setNewInvestmentData({ ...newInvestmentData, Source_Person: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Principal Amount (₹)</label>
                  <input
                    type="number"
                    value={newInvestmentData.Amount}
                    onChange={e => setNewInvestmentData({ ...newInvestmentData, Amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Return Terms</label>
                  <input
                    type="text"
                    value={newInvestmentData.Expected_Return_Rate}
                    onChange={e => setNewInvestmentData({ ...newInvestmentData, Expected_Return_Rate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Taken Date</label>
                  <input
                    type="date"
                    value={newInvestmentData.Taken_Date}
                    onChange={e => setNewInvestmentData({ ...newInvestmentData, Taken_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Return Date</label>
                  <input
                    type="date"
                    value={newInvestmentData.Expected_Return_Date}
                    onChange={e => setNewInvestmentData({ ...newInvestmentData, Expected_Return_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewInvestmentModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
