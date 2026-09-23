import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CurrentUser,
  Employee,
  Project,
  ProjectNote,
  MOMRecord,
  BudgetGiven,
  EmployeeSpending,
  OOPClaim,
  SalaryRecord,
  Investment,
  CustomPage,
  BuilderComponent,
  ProjectMember,
  ProjectFile
} from '../types';
import {
  SEED_USERS,
  SEED_EMPLOYEES,
  SEED_PROJECTS,
  SEED_NOTES,
  SEED_MOM_RECORDS,
  SEED_BUDGET_GIVEN,
  SEED_EMPLOYEE_SPENDING,
  SEED_OOP_CLAIMS,
  SEED_SALARY_RECORDS,
  SEED_INVESTMENTS,
  SEED_CUSTOM_PAGES
} from '../data/seedData';

interface AppContextType {
  currentUser: CurrentUser;
  setCurrentUser: (user: CurrentUser) => void;
  availableUsers: CurrentUser[];
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'Project_ID' | 'Spent_Total'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addProjectMember: (projectId: string, member: ProjectMember) => void;
  removeProjectMember: (projectId: string, employeeId: string) => void;
  addProjectFile: (projectId: string, file: Omit<ProjectFile, 'File_ID' | 'Uploaded_At'>) => void;
  deleteProjectFile: (projectId: string, fileId: string) => void;

  // Notes
  notes: ProjectNote[];
  addProjectNote: (projectId: string, note: string) => void;
  deleteProjectNote: (noteId: string) => void;

  // MOM
  momRecords: MOMRecord[];
  addMOMRecord: (record: Omit<MOMRecord, 'MOM_ID' | 'Version' | 'Status'>) => MOMRecord;
  updateMOMRecord: (id: string, updates: Partial<MOMRecord>) => void;
  publishMOMRecord: (id: string) => void;

  // Finance - Budget
  budgets: BudgetGiven[];
  addBudget: (budget: Omit<BudgetGiven, 'Budget_ID'>) => void;
  updateBudgetStatus: (id: string, status: BudgetGiven['Status']) => void;

  // Finance - Spending
  spendings: EmployeeSpending[];
  addSpending: (spending: Omit<EmployeeSpending, 'Spending_ID' | 'Status'>) => void;
  verifySpending: (id: string, verified: boolean, notes?: string) => void;

  // Finance - OOP Claims & ₹5,000 Rule
  oopClaims: OOPClaim[];
  addOOPClaim: (claim: Omit<OOPClaim, 'Claim_ID' | 'Status' | 'Policy_Threshold_Exceeded'>) => void;
  approveOOPClaim: (id: string, approvedAmount?: number) => void;
  payOOPClaim: (id: string) => void;
  rejectOOPClaim: (id: string, reason?: string) => void;
  oopThreshold: number; // default 5000

  // Finance - Salary Admin & Carry-Forward
  salaryRecords: SalaryRecord[];
  addSalaryRecord: (record: Omit<SalaryRecord, 'Salary_Record_ID' | 'Pending_Carry_Forward'>) => void;
  processSalaryPayment: (id: string, paymentAmount: number, notes?: string) => void;
  generateMonthlyCycle: (targetMonth: string) => void;

  // Finance - Investments
  investments: Investment[];
  addInvestment: (investment: Omit<Investment, 'Investment_ID' | 'Status'>) => void;
  updateInvestmentStatus: (id: string, status: Investment['Status'], actualReturnDate?: string) => void;

  // HR
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'Employee_ID'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  toggleEmployeeActive: (id: string) => void;

  // Visual Page Builder
  customPages: CustomPage[];
  createCustomPage: (page: Omit<CustomPage, 'Page_ID' | 'Created_At' | 'Updated_At'>) => CustomPage;
  updateCustomPage: (id: string, updates: Partial<CustomPage>) => void;
  deleteCustomPage: (id: string) => void;
  publishCustomPage: (id: string, publish: boolean) => void;

  // System
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'master_portal_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helpers for local storage persistence
  const loadState = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (e) {
      console.warn(`Failed to read ${key} from storage:`, e);
      return defaultValue;
    }
  };

  const saveState = <T,>(key: string, value: T) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to write ${key} to storage:`, e);
    }
  };

  // State initialization
  const availableUsers = SEED_USERS;
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() =>
    loadState<CurrentUser>('currentUser', availableUsers[0])
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    loadState<Project[]>('projects', SEED_PROJECTS)
  );
  const [notes, setNotes] = useState<ProjectNote[]>(() =>
    loadState<ProjectNote[]>('notes', SEED_NOTES)
  );
  const [momRecords, setMomRecords] = useState<MOMRecord[]>(() =>
    loadState<MOMRecord[]>('mom_records', SEED_MOM_RECORDS)
  );
  const [budgets, setBudgets] = useState<BudgetGiven[]>(() =>
    loadState<BudgetGiven[]>('budgets', SEED_BUDGET_GIVEN)
  );
  const [spendings, setSpendings] = useState<EmployeeSpending[]>(() =>
    loadState<EmployeeSpending[]>('spendings', SEED_EMPLOYEE_SPENDING)
  );
  const [oopClaims, setOopClaims] = useState<OOPClaim[]>(() =>
    loadState<OOPClaim[]>('oop_claims', SEED_OOP_CLAIMS)
  );
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(() =>
    loadState<SalaryRecord[]>('salary_records', SEED_SALARY_RECORDS)
  );
  const [investments, setInvestments] = useState<Investment[]>(() =>
    loadState<Investment[]>('investments', SEED_INVESTMENTS)
  );
  const [employees, setEmployees] = useState<Employee[]>(() =>
    loadState<Employee[]>('employees', SEED_EMPLOYEES)
  );
  const [customPages, setCustomPages] = useState<CustomPage[]>(() =>
    loadState<CustomPage[]>('custom_pages', SEED_CUSTOM_PAGES)
  );

  const oopThreshold = 5000;

  // Persist on updates
  useEffect(() => saveState('currentUser', currentUser), [currentUser]);
  useEffect(() => saveState('projects', projects), [projects]);
  useEffect(() => saveState('notes', notes), [notes]);
  useEffect(() => saveState('mom_records', momRecords), [momRecords]);
  useEffect(() => saveState('budgets', budgets), [budgets]);
  useEffect(() => saveState('spendings', spendings), [spendings]);
  useEffect(() => saveState('oop_claims', oopClaims), [oopClaims]);
  useEffect(() => saveState('salary_records', salaryRecords), [salaryRecords]);
  useEffect(() => saveState('investments', investments), [investments]);
  useEffect(() => saveState('employees', employees), [employees]);
  useEffect(() => saveState('custom_pages', customPages), [customPages]);

  // Recalculate project spent totals from verified spendings
  useEffect(() => {
    setProjects(prev =>
      prev.map(proj => {
        const totalSpent = spendings
          .filter(s => s.Project_ID === proj.Project_ID && s.Status === 'Verified')
          .reduce((sum, s) => sum + s.Amount, 0);
        return proj.Spent_Total !== totalSpent ? { ...proj, Spent_Total: totalSpent } : proj;
      })
    );
  }, [spendings]);

  // Project methods
  const addProject = (projectData: Omit<Project, 'Project_ID' | 'Spent_Total'>): Project => {
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const newProject: Project = {
      ...projectData,
      Project_ID: newId,
      Spent_Total: 0
    };
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.Project_ID === id ? { ...p, ...updates } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.Project_ID !== id));
  };

  const addProjectMember = (projectId: string, member: ProjectMember) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.Project_ID !== projectId) return p;
        const exists = p.Members.some(m => m.Employee_ID === member.Employee_ID);
        if (exists) {
          return {
            ...p,
            Members: p.Members.map(m => (m.Employee_ID === member.Employee_ID ? member : m))
          };
        }
        return { ...p, Members: [...p.Members, member] };
      })
    );
  };

  const removeProjectMember = (projectId: string, employeeId: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.Project_ID === projectId
          ? { ...p, Members: p.Members.filter(m => m.Employee_ID !== employeeId) }
          : p
      )
    );
  };

  const addProjectFile = (projectId: string, file: Omit<ProjectFile, 'File_ID' | 'Uploaded_At'>) => {
    const newFile: ProjectFile = {
      ...file,
      File_ID: `FIL-${Math.floor(100 + Math.random() * 900)}`,
      Uploaded_At: new Date().toISOString().split('T')[0]
    };
    setProjects(prev =>
      prev.map(p => (p.Project_ID === projectId ? { ...p, Files: [newFile, ...p.Files] } : p))
    );
  };

  const deleteProjectFile = (projectId: string, fileId: string) => {
    setProjects(prev =>
      prev.map(p =>
        p.Project_ID === projectId
          ? { ...p, Files: p.Files.filter(f => f.File_ID !== fileId) }
          : p
      )
    );
  };

  // Notes
  const addProjectNote = (projectId: string, noteText: string) => {
    const newNote: ProjectNote = {
      Note_ID: `NOT-${Math.floor(1000 + Math.random() * 9000)}`,
      Project_ID: projectId,
      Date: new Date().toISOString().split('T')[0],
      Author_Email: currentUser.email,
      Author_Name: currentUser.name,
      Note: noteText,
      Status: 'Active'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteProjectNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.Note_ID !== noteId));
  };

  // MOM
  const addMOMRecord = (record: Omit<MOMRecord, 'MOM_ID' | 'Version' | 'Status'>): MOMRecord => {
    const year = new Date().getFullYear();
    const newMom: MOMRecord = {
      ...record,
      MOM_ID: `MOM-${year}-${Math.floor(100 + Math.random() * 900)}`,
      Version: 1,
      Status: 'Draft'
    };
    setMomRecords(prev => [newMom, ...prev]);
    return newMom;
  };

  const updateMOMRecord = (id: string, updates: Partial<MOMRecord>) => {
    setMomRecords(prev => prev.map(m => (m.MOM_ID === id ? { ...m, ...updates } : m)));
  };

  const publishMOMRecord = (id: string) => {
    setMomRecords(prev =>
      prev.map(m => {
        if (m.MOM_ID !== id) return m;
        const now = new Date().toISOString();
        const logs = m.Attendees.map(email => ({
          Recipient: email,
          Timestamp: now,
          Status: 'Sent' as const,
          Message_ID: `MSG-${Math.floor(10000 + Math.random() * 90000)}`
        }));
        return {
          ...m,
          Status: 'Published',
          Version: m.Version + 1,
          Published_At: now,
          Published_By: currentUser.email,
          Distribution_Logs: logs
        };
      })
    );
  };

  // Finance: Budgets
  const addBudget = (budgetData: Omit<BudgetGiven, 'Budget_ID'>) => {
    const newBudget: BudgetGiven = {
      ...budgetData,
      Budget_ID: `BDG-${Math.floor(100 + Math.random() * 900)}`
    };
    setBudgets(prev => [newBudget, ...prev]);
  };

  const updateBudgetStatus = (id: string, status: BudgetGiven['Status']) => {
    setBudgets(prev => prev.map(b => (b.Budget_ID === id ? { ...b, ...status ? { status } : {} } : b)));
  };

  // Finance: Spending
  const addSpending = (spendingData: Omit<EmployeeSpending, 'Spending_ID' | 'Status'>) => {
    const newSpending: EmployeeSpending = {
      ...spendingData,
      Spending_ID: `SPD-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      Status: 'Submitted'
    };
    setSpendings(prev => [newSpending, ...prev]);
  };

  const verifySpending = (id: string, verified: boolean, notesText?: string) => {
    setSpendings(prev =>
      prev.map(s =>
        s.Spending_ID === id
          ? {
              ...s,
              Status: verified ? 'Verified' : 'Rejected',
              Verification_Notes: notesText || (verified ? 'Approved by Finance' : 'Rejected - Receipt mismatch')
            }
          : s
      )
    );
  };

  // Finance: OOP Claims with ₹5,000 threshold policy
  const addOOPClaim = (claimData: Omit<OOPClaim, 'Claim_ID' | 'Status' | 'Policy_Threshold_Exceeded'>) => {
    const isExceeded = claimData.Amount > oopThreshold;
    const newClaim: OOPClaim = {
      ...claimData,
      Claim_ID: `OOP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      Status: 'Pending',
      Policy_Threshold_Exceeded: isExceeded,
      Notes: isExceeded
        ? `Exceeds standard ₹${oopThreshold.toLocaleString()} monthly single-claim threshold. Flagged for Admin signoff.`
        : `Within standard ₹${oopThreshold.toLocaleString()} monthly allowance.`
    };
    setOopClaims(prev => [newClaim, ...prev]);
  };

  const approveOOPClaim = (id: string, approvedAmount?: number) => {
    setOopClaims(prev =>
      prev.map(c => {
        if (c.Claim_ID !== id) return c;
        const finalApproved = approvedAmount !== undefined ? approvedAmount : c.Amount;
        return {
          ...c,
          Status: 'Approved',
          Approved_Amount: finalApproved,
          Notes:
            finalApproved < c.Amount
              ? `Approved partial ₹${finalApproved.toLocaleString()} under policy threshold. Excess ₹${(c.Amount - finalApproved).toLocaleString()} pending carry-forward.`
              : `Approved in full by ${currentUser.name}.`
        };
      })
    );
  };

  const payOOPClaim = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setOopClaims(prev =>
      prev.map(c =>
        c.Claim_ID === id
          ? {
              ...c,
              Status: 'Paid',
              Paid_Date: today
            }
          : c
      )
    );
  };

  const rejectOOPClaim = (id: string, reason?: string) => {
    setOopClaims(prev =>
      prev.map(c =>
        c.Claim_ID === id
          ? {
              ...c,
              Status: 'Rejected',
              Notes: reason || 'Claim rejected by Finance/Admin.'
            }
          : c
      )
    );
  };

  // Salary Carry-Forward Calculation
  // Rule B4-05: Pending_Carry_Forward = (Due_Amount + Prior_Carry_Forward) - Paid_Amount
  const addSalaryRecord = (record: Omit<SalaryRecord, 'Salary_Record_ID' | 'Pending_Carry_Forward'>) => {
    const pending = (record.Due_Amount + record.Prior_Carry_Forward) - record.Paid_Amount;
    const newRecord: SalaryRecord = {
      ...record,
      Salary_Record_ID: `SAL-${record.Month}-${Math.floor(100 + Math.random() * 900)}`,
      Pending_Carry_Forward: Math.max(0, pending),
      Status: record.Paid_Amount >= (record.Due_Amount + record.Prior_Carry_Forward)
        ? 'Paid'
        : record.Paid_Amount > 0
        ? 'Partial'
        : 'Due'
    };
    setSalaryRecords(prev => [newRecord, ...prev]);
  };

  const processSalaryPayment = (id: string, paymentAmount: number, notesText?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setSalaryRecords(prev =>
      prev.map(r => {
        if (r.Salary_Record_ID !== id) return r;
        const totalDueWithCarry = r.Due_Amount + r.Prior_Carry_Forward;
        const newPaid = r.Paid_Amount + paymentAmount;
        const newPending = Math.max(0, totalDueWithCarry - newPaid);
        const newStatus: SalaryRecord['Status'] = newPending === 0 ? 'Paid' : newPaid > 0 ? 'Partial' : 'Due';
        return {
          ...r,
          Paid_Amount: newPaid,
          Pending_Carry_Forward: newPending,
          Status: newStatus,
          Payment_Date: today,
          Notes: notesText || (newPending > 0 ? `Paid ₹${paymentAmount.toLocaleString()}; carry-forward ₹${newPending.toLocaleString()}` : 'Disbursed in full')
        };
      })
    );
  };

  // Automatically roll forward unpaid balances to the next monthly cycle
  const generateMonthlyCycle = (targetMonth: string) => {
    const activeEmployees = employees.filter(e => e.Active);
    const newRecords: SalaryRecord[] = activeEmployees.map(emp => {
      // Find prior month pending carry forward for this employee
      const priorRecords = salaryRecords
        .filter(r => r.Employee_ID === emp.Employee_ID && r.Month < targetMonth)
        .sort((a, b) => b.Month.localeCompare(a.Month));
      
      const priorCarryForward = priorRecords.length > 0 ? priorRecords[0].Pending_Carry_Forward : 0;
      const due = emp.Salary_Basis;
      const totalPending = due + priorCarryForward;

      return {
        Salary_Record_ID: `SAL-${targetMonth}-${emp.Employee_ID}`,
        Employee_ID: emp.Employee_ID,
        Employee_Name: emp.Name,
        Month: targetMonth,
        Due_Amount: due,
        Paid_Amount: 0,
        Prior_Carry_Forward: priorCarryForward,
        Pending_Carry_Forward: totalPending,
        Status: 'Due',
        Notes: priorCarryForward > 0 ? `Carried forward ₹${priorCarryForward.toLocaleString()} from prior cycle.` : 'New monthly cycle.'
      };
    });

    setSalaryRecords(prev => {
      // replace or append
      const existingFiltered = prev.filter(r => r.Month !== targetMonth);
      return [...newRecords, ...existingFiltered];
    });
  };

  // Investments
  const addInvestment = (investmentData: Omit<Investment, 'Investment_ID' | 'Status'>) => {
    const newInv: Investment = {
      ...investmentData,
      Investment_ID: `INV-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      Status: 'Active'
    };
    setInvestments(prev => [newInv, ...prev]);
  };

  const updateInvestmentStatus = (id: string, status: Investment['Status'], actualReturnDate?: string) => {
    setInvestments(prev =>
      prev.map(inv =>
        inv.Investment_ID === id
          ? {
              ...inv,
              Status: status,
              Actual_Return_Date: actualReturnDate || (status === 'Returned' ? new Date().toISOString().split('T')[0] : inv.Actual_Return_Date)
            }
          : inv
      )
    );
  };

  // HR
  const addEmployee = (empData: Omit<Employee, 'Employee_ID'>) => {
    const newEmp: Employee = {
      ...empData,
      Employee_ID: `EMP-${Math.floor(100 + Math.random() * 900)}`
    };
    setEmployees(prev => [...prev, newEmp]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.Employee_ID === id ? { ...e, ...updates } : e)));
  };

  const toggleEmployeeActive = (id: string) => {
    setEmployees(prev => prev.map(e => (e.Employee_ID === id ? { ...e, Active: !e.Active } : e)));
  };

  // Visual Page Builder
  const createCustomPage = (pageData: Omit<CustomPage, 'Page_ID' | 'Created_At' | 'Updated_At'>): CustomPage => {
    const today = new Date().toISOString().split('T')[0];
    const newPage: CustomPage = {
      ...pageData,
      Page_ID: `PG-${Math.floor(100 + Math.random() * 900)}`,
      Created_At: today,
      Updated_At: today
    };
    setCustomPages(prev => [newPage, ...prev]);
    return newPage;
  };

  const updateCustomPage = (id: string, updates: Partial<CustomPage>) => {
    const today = new Date().toISOString().split('T')[0];
    setCustomPages(prev =>
      prev.map(p => (p.Page_ID === id ? { ...p, ...updates, Updated_At: today } : p))
    );
  };

  const deleteCustomPage = (id: string) => {
    setCustomPages(prev => prev.filter(p => p.Page_ID !== id));
  };

  const publishCustomPage = (id: string, publish: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    setCustomPages(prev =>
      prev.map(p =>
        p.Page_ID === id ? { ...p, Status: publish ? 'Published' : 'Draft', Updated_At: today } : p
      )
    );
  };

  // Reset demo data
  const resetToDemoData = () => {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(LOCAL_STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
    setCurrentUser(SEED_USERS[0]);
    setProjects(SEED_PROJECTS);
    setNotes(SEED_NOTES);
    setMomRecords(SEED_MOM_RECORDS);
    setBudgets(SEED_BUDGET_GIVEN);
    setSpendings(SEED_EMPLOYEE_SPENDING);
    setOopClaims(SEED_OOP_CLAIMS);
    setSalaryRecords(SEED_SALARY_RECORDS);
    setInvestments(SEED_INVESTMENTS);
    setEmployees(SEED_EMPLOYEES);
    setCustomPages(SEED_CUSTOM_PAGES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers,
        projects,
        addProject,
        updateProject,
        deleteProject,
        addProjectMember,
        removeProjectMember,
        addProjectFile,
        deleteProjectFile,
        notes,
        addProjectNote,
        deleteProjectNote,
        momRecords,
        addMOMRecord,
        updateMOMRecord,
        publishMOMRecord,
        budgets,
        addBudget,
        updateBudgetStatus,
        spendings,
        addSpending,
        verifySpending,
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
        investments,
        addInvestment,
        updateInvestmentStatus,
        employees,
        addEmployee,
        updateEmployee,
        toggleEmployeeActive,
        customPages,
        createCustomPage,
        updateCustomPage,
        deleteCustomPage,
        publishCustomPage,
        resetToDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
