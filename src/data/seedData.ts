import {
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
  CurrentUser
} from '../types';

export const SEED_USERS: CurrentUser[] = [
  {
    id: 'EMP-001',
    name: 'Vikram Mehta',
    email: 'vikram.m@company.com',
    role: 'admin',
    department: 'Executive / Finance & Admin'
  },
  {
    id: 'EMP-002',
    name: 'Sarah Jenkins',
    email: 'sarah.j@company.com',
    role: 'project_manager',
    department: 'Product & Operations'
  },
  {
    id: 'EMP-003',
    name: 'Alex Rivera',
    email: 'alex.r@company.com',
    role: 'employee',
    department: 'Engineering'
  }
];

export const SEED_EMPLOYEES: Employee[] = [
  {
    Employee_ID: 'EMP-001',
    Name: 'Vikram Mehta',
    Email: 'vikram.m@company.com',
    Role: 'admin',
    Department: 'Finance & Operations',
    Salary_Basis: 125000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101', 'PRJ-102', 'PRJ-103'],
    Joining_Date: '2023-04-01',
    HR_Notes: 'Master Company Admin & Banking Signatory',
    Phone: '+91 98201 12345'
  },
  {
    Employee_ID: 'EMP-002',
    Name: 'Sarah Jenkins',
    Email: 'sarah.j@company.com',
    Role: 'project_manager',
    Department: 'Product & Operations',
    Salary_Basis: 95000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101', 'PRJ-103'],
    Joining_Date: '2023-08-15',
    HR_Notes: 'Lead on Enterprise Platform & Logistics',
    Phone: '+91 98202 23456'
  },
  {
    Employee_ID: 'EMP-003',
    Name: 'Alex Rivera',
    Email: 'alex.r@company.com',
    Role: 'employee',
    Department: 'Engineering',
    Salary_Basis: 75000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101', 'PRJ-102'],
    Joining_Date: '2024-01-10',
    HR_Notes: 'Senior Fullstack Specialist',
    Phone: '+91 98203 34567'
  },
  {
    Employee_ID: 'EMP-004',
    Name: 'Priya Sharma',
    Email: 'priya.s@company.com',
    Role: 'employee',
    Department: 'Design & Brand',
    Salary_Basis: 70000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101', 'PRJ-102', 'PRJ-103'],
    Joining_Date: '2024-03-01',
    HR_Notes: 'Lead UI/UX Designer',
    Phone: '+91 98204 45678'
  },
  {
    Employee_ID: 'EMP-005',
    Name: 'Rohan Deshmukh',
    Email: 'rohan.d@company.com',
    Role: 'employee',
    Department: 'Field Logistics',
    Salary_Basis: 55000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-102'],
    Joining_Date: '2024-06-15',
    HR_Notes: 'Onsite Vendor Coordination',
    Phone: '+91 98205 56789'
  },
  {
    Employee_ID: 'EMP-006',
    Name: 'Neha Kapoor',
    Email: 'neha.k@company.com',
    Role: 'employee',
    Department: 'HR & People Ops',
    Salary_Basis: 65000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101'],
    Joining_Date: '2024-07-01',
    HR_Notes: 'Talent Acquisition & Employee Engagement',
    Phone: '+91 98206 67890'
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    Project_ID: 'PRJ-101',
    Project_Name: 'Phoenix Master Portal Launch',
    Description: 'Centralized company operational hub connecting finance, HR, project check-ins and visual page builder.',
    Owner: 'Sarah Jenkins',
    Start_Date: '2026-09-01',
    Event_Date: '2026-10-15',
    Status: 'Active',
    Drive_Folder_URL: 'https://drive.google.com/drive/folders/phoenix-master-portal',
    Notes: 'Critical Q4 company milestone. All teams must complete Phase 1 through 5 check-ins.',
    Budget_Total: 350000,
    Spent_Total: 142500,
    Members: [
      { Employee_ID: 'EMP-002', Employee_Name: 'Sarah Jenkins', Project_Role: 'Project Manager', Access_Level: 'Admin', Active: true },
      { Employee_ID: 'EMP-001', Employee_Name: 'Vikram Mehta', Project_Role: 'Sponsor & Finance Admin', Access_Level: 'Admin', Active: true },
      { Employee_ID: 'EMP-003', Employee_Name: 'Alex Rivera', Project_Role: 'Tech Lead', Access_Level: 'Editor', Active: true },
      { Employee_ID: 'EMP-004', Employee_Name: 'Priya Sharma', Project_Role: 'Design Specialist', Access_Level: 'Editor', Active: true }
    ],
    Files: [
      {
        File_ID: 'FIL-101',
        File_Name: 'Project-101-Master-Checklist.xlsx',
        Type: 'Checklist Excel',
        URL: 'https://docs.google.com/spreadsheets/d/phoenix-checklist',
        Uploaded_By: 'Sarah Jenkins',
        Uploaded_At: '2026-09-05',
        Size: '48 KB'
      },
      {
        File_ID: 'FIL-102',
        File_Name: 'Q3-Q4-Expense-Breakdown.xlsx',
        Type: 'Expense Excel',
        URL: 'https://docs.google.com/spreadsheets/d/phoenix-expenses',
        Uploaded_By: 'Vikram Mehta',
        Uploaded_At: '2026-09-12',
        Size: '64 KB'
      }
    ]
  },
  {
    Project_ID: 'PRJ-102',
    Project_Name: 'Annual Tech Summit & Vendor Expo',
    Description: 'Flagship client & partner expo with onsite equipment, stalls, and multi-vendor coordination.',
    Owner: 'Rohan Deshmukh',
    Start_Date: '2026-08-15',
    Event_Date: '2026-11-20',
    Status: 'Active',
    Drive_Folder_URL: 'https://drive.google.com/drive/folders/tech-summit-2026',
    Notes: 'Logistics budget locked at ₹5,00,000. Equipment rentals require advance receipt signoffs.',
    Budget_Total: 500000,
    Spent_Total: 215000,
    Members: [
      { Employee_ID: 'EMP-005', Employee_Name: 'Rohan Deshmukh', Project_Role: 'Event Lead', Access_Level: 'Admin', Active: true },
      { Employee_ID: 'EMP-001', Employee_Name: 'Vikram Mehta', Project_Role: 'Finance Director', Access_Level: 'Admin', Active: true },
      { Employee_ID: 'EMP-003', Employee_Name: 'Alex Rivera', Project_Role: 'AV & Tech Infra', Access_Level: 'Editor', Active: true }
    ],
    Files: [
      {
        File_ID: 'FIL-103',
        File_Name: 'Vendor_Quotations_Consolidated.xlsx',
        Type: 'Expense Excel',
        URL: 'https://docs.google.com/spreadsheets/d/summit-vendors',
        Uploaded_By: 'Rohan Deshmukh',
        Uploaded_At: '2026-09-10',
        Size: '112 KB'
      }
    ]
  },
  {
    Project_ID: 'PRJ-103',
    Project_Name: 'Infrastructure Migration & Security Audit',
    Description: 'Migration of internal records, compliance verification, and access controls review.',
    Owner: 'Alex Rivera',
    Start_Date: '2026-09-10',
    Event_Date: '2026-12-05',
    Status: 'Planning',
    Drive_Folder_URL: 'https://drive.google.com/drive/folders/infra-audit-2026',
    Notes: 'Zero-cost tool migration verifying Google Drive, Sheets, and Apps Script access.',
    Budget_Total: 180000,
    Spent_Total: 34000,
    Members: [
      { Employee_ID: 'EMP-003', Employee_Name: 'Alex Rivera', Project_Role: 'Infra Architect', Access_Level: 'Admin', Active: true },
      { Employee_ID: 'EMP-002', Employee_Name: 'Sarah Jenkins', Project_Role: 'Operations Reviewer', Access_Level: 'Editor', Active: true }
    ],
    Files: []
  }
];

export const SEED_NOTES: ProjectNote[] = [
  {
    Note_ID: 'NOT-001',
    Project_ID: 'PRJ-101',
    Date: '2026-09-15',
    Author_Email: 'sarah.j@company.com',
    Author_Name: 'Sarah Jenkins',
    Note: 'Google Drive folder hierarchy established. All permissions aligned with the Phase 1 Matrix.',
    Status: 'Active'
  },
  {
    Note_ID: 'NOT-002',
    Project_ID: 'PRJ-101',
    Date: '2026-09-18',
    Author_Email: 'alex.r@company.com',
    Author_Name: 'Alex Rivera',
    Note: 'Phase 3 Sheets schema validated. The ₹5,000 OOP allowance split logic is ready for review.',
    Status: 'Active'
  },
  {
    Note_ID: 'NOT-003',
    Project_ID: 'PRJ-102',
    Date: '2026-09-19',
    Author_Email: 'rohan.d@company.com',
    Author_Name: 'Rohan Deshmukh',
    Note: 'Main convention hall deposit paid. Awaiting stage lighting setup quote.',
    Status: 'Active'
  }
];

export const SEED_MOM_RECORDS: MOMRecord[] = [
  {
    MOM_ID: 'MOM-2026-001',
    Project_ID: 'PRJ-101',
    Meeting_Date: '2026-09-16',
    Title: 'Sprint 1 Review: Architecture & Zero-Cost Infrastructure Gate',
    Version: 2,
    Status: 'Published',
    Drive_URL: 'https://docs.google.com/document/d/mom-2026-001',
    Published_At: '2026-09-16T17:30:00Z',
    Published_By: 'sarah.j@company.com',
    Attendees: ['sarah.j@company.com', 'vikram.m@company.com', 'alex.r@company.com', 'priya.s@company.com'],
    Agenda: 'Review Zero-Cost Gate, confirm ₹5,000 OOP threshold policy, and sign off Phase 1 checklist.',
    Discussion_Summary: 'Agreed that standard Google accounts are used to avoid paid seat licensing. Vikram approved the salary carry-forward formula for unpaid monthly balances. Sarah confirmed the project timeline target.',
    Action_Items: [
      { Item_ID: 'ACT-01', Task: 'Finalize Drive folder root permissions', Assignee: 'Alex Rivera', Due_Date: '2026-09-22', Status: 'Done' },
      { Item_ID: 'ACT-02', Task: 'Review OOP ₹5,000 threshold notification rule', Assignee: 'Vikram Mehta', Due_Date: '2026-09-24', Status: 'In Progress' },
      { Item_ID: 'ACT-03', Task: 'Build Visual Page Builder wireframes', Assignee: 'Priya Sharma', Due_Date: '2026-09-25', Status: 'Pending' }
    ],
    Distribution_Logs: [
      { Recipient: 'sarah.j@company.com', Timestamp: '2026-09-16T17:31:00Z', Status: 'Sent', Message_ID: 'MSG-88192' },
      { Recipient: 'vikram.m@company.com', Timestamp: '2026-09-16T17:31:00Z', Status: 'Sent', Message_ID: 'MSG-88193' },
      { Recipient: 'alex.r@company.com', Timestamp: '2026-09-16T17:31:00Z', Status: 'Sent', Message_ID: 'MSG-88194' },
      { Recipient: 'priya.s@company.com', Timestamp: '2026-09-16T17:31:00Z', Status: 'Sent', Message_ID: 'MSG-88195' }
    ]
  },
  {
    MOM_ID: 'MOM-2026-002',
    Project_ID: 'PRJ-102',
    Meeting_Date: '2026-09-19',
    Title: 'Vendor Expo Budget Allocation & Stage Stalls',
    Version: 1,
    Status: 'Draft',
    Drive_URL: 'https://docs.google.com/document/d/mom-2026-002',
    Attendees: ['rohan.d@company.com', 'vikram.m@company.com'],
    Agenda: 'Examine ₹5,00,000 allocation, equipment advance, and food stall contracts.',
    Discussion_Summary: 'Rohan requested ₹75,000 emergency buffer for sound engineer advance. Vikram requested official tax invoices for any expense exceeding ₹10,000.',
    Action_Items: [
      { Item_ID: 'ACT-04', Task: 'Obtain 3 sound vendor quotes', Assignee: 'Rohan Deshmukh', Due_Date: '2026-09-26', Status: 'Pending' }
    ]
  }
];

export const SEED_BUDGET_GIVEN: BudgetGiven[] = [
  {
    Budget_ID: 'BDG-001',
    Date: '2026-09-02',
    Recipient: 'Sarah Jenkins',
    Recipient_Email: 'sarah.j@company.com',
    Amount: 150000,
    Purpose: 'Sprint 1 & 2 operational tooling and cloud resources',
    Project_ID: 'PRJ-101',
    Status: 'Allocated',
    Proof_URL: 'https://drive.google.com/file/d/budget-disburse-001',
    Created_By: 'Vikram Mehta'
  },
  {
    Budget_ID: 'BDG-002',
    Date: '2026-08-20',
    Recipient: 'Rohan Deshmukh',
    Recipient_Email: 'rohan.d@company.com',
    Amount: 250000,
    Purpose: 'Venue deposit and sound system contractor advance',
    Project_ID: 'PRJ-102',
    Status: 'Disbursed',
    Proof_URL: 'https://drive.google.com/file/d/budget-disburse-002',
    Created_By: 'Vikram Mehta'
  }
];

export const SEED_EMPLOYEE_SPENDING: EmployeeSpending[] = [
  {
    Spending_ID: 'SPD-2026-01',
    Employee_ID: 'EMP-002',
    Employee_Name: 'Sarah Jenkins',
    Date: '2026-09-08',
    Amount: 18500,
    Vendor: 'CloudNet Server Hosting',
    Purpose: 'Staging environment reserved capacity',
    Project_ID: 'PRJ-101',
    Attachment_URL: 'https://drive.google.com/file/d/inv-cloudnet-991',
    Status: 'Verified',
    Verification_Notes: 'Matched against authorized IT budget line'
  },
  {
    Spending_ID: 'SPD-2026-02',
    Employee_ID: 'EMP-005',
    Employee_Name: 'Rohan Deshmukh',
    Date: '2026-09-14',
    Amount: 42000,
    Vendor: 'Grand Pavilion Center',
    Purpose: 'Advance venue deposit for Tech Summit',
    Project_ID: 'PRJ-102',
    Attachment_URL: 'https://drive.google.com/file/d/receipt-pavilion-04',
    Status: 'Verified'
  },
  {
    Spending_ID: 'SPD-2026-03',
    Employee_ID: 'EMP-003',
    Employee_Name: 'Alex Rivera',
    Date: '2026-09-18',
    Amount: 8500,
    Vendor: 'FastDNS & SSL Security',
    Purpose: 'Domain security and Wildcard certificate',
    Project_ID: 'PRJ-101',
    Attachment_URL: 'https://drive.google.com/file/d/receipt-dns-772',
    Status: 'Submitted'
  }
];

// Note the ₹5,000 threshold rule:
// Amounts <= 5,000 are standard OOP claims eligible for swift approval.
// Amounts > 5,000 trigger policy threshold flag requiring explicit Admin signoff.
export const SEED_OOP_CLAIMS: OOPClaim[] = [
  {
    Claim_ID: 'OOP-2026-001',
    Employee_ID: 'EMP-003',
    Employee_Name: 'Alex Rivera',
    Employee_Email: 'alex.r@company.com',
    Month: '2026-09',
    Date: '2026-09-10',
    Purpose: 'Team client meeting refreshments & local metro transit',
    Amount: 3200,
    Project_ID: 'PRJ-101',
    Proof_URL: 'https://drive.google.com/file/d/receipt-metro-tea',
    Status: 'Approved',
    Approved_Amount: 3200,
    Policy_Threshold_Exceeded: false,
    Notes: 'Within standard ₹5,000 monthly allowance.'
  },
  {
    Claim_ID: 'OOP-2026-002',
    Employee_ID: 'EMP-003',
    Employee_Name: 'Alex Rivera',
    Employee_Email: 'alex.r@company.com',
    Month: '2026-09',
    Date: '2026-09-17',
    Purpose: 'Emergency high-speed optical fiber connection for offsite dev day',
    Amount: 6800,
    Project_ID: 'PRJ-101',
    Proof_URL: 'https://drive.google.com/file/d/receipt-broadband-isp',
    Status: 'Pending',
    Policy_Threshold_Exceeded: true,
    Notes: 'Exceeds standard ₹5,000 single claim/allowance guideline. Marked for Admin review.'
  },
  {
    Claim_ID: 'OOP-2026-003',
    Employee_ID: 'EMP-004',
    Employee_Name: 'Priya Sharma',
    Employee_Email: 'priya.s@company.com',
    Month: '2026-09',
    Date: '2026-09-12',
    Purpose: 'Design vector stock licenses and typography bundle',
    Amount: 4500,
    Project_ID: 'PRJ-101',
    Proof_URL: 'https://drive.google.com/file/d/receipt-type-stock',
    Status: 'Paid',
    Approved_Amount: 4500,
    Paid_Date: '2026-09-15',
    Policy_Threshold_Exceeded: false,
    Notes: 'Processed with mid-month reimbursement batch.'
  },
  {
    Claim_ID: 'OOP-2026-004',
    Employee_ID: 'EMP-005',
    Employee_Name: 'Rohan Deshmukh',
    Employee_Email: 'rohan.d@company.com',
    Month: '2026-09',
    Date: '2026-09-15',
    Purpose: 'Inter-city travel fuel & toll receipts for site inspection',
    Amount: 5900,
    Project_ID: 'PRJ-102',
    Proof_URL: 'https://drive.google.com/file/d/toll-fuel-slips',
    Status: 'Approved',
    Approved_Amount: 5000,
    Policy_Threshold_Exceeded: true,
    Notes: 'Approved up to ₹5,000 policy threshold; remaining ₹900 deferred to next cycle.'
  }
];

// Salary records exhibiting monthly Carry-Forward calculation (Phase 4 / B4-05 rule):
// Pending_Carry_Forward = (Due_Amount + Prior_Carry_Forward) - Paid_Amount
export const SEED_SALARY_RECORDS: SalaryRecord[] = [
  {
    Salary_Record_ID: 'SAL-2026-07-001',
    Employee_ID: 'EMP-001',
    Employee_Name: 'Vikram Mehta',
    Month: '2026-07',
    Due_Amount: 125000,
    Paid_Amount: 125000,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 0,
    Status: 'Paid',
    Payment_Date: '2026-08-01',
    Notes: 'Fully disbursed.'
  },
  {
    Salary_Record_ID: 'SAL-2026-07-002',
    Employee_ID: 'EMP-002',
    Employee_Name: 'Sarah Jenkins',
    Month: '2026-07',
    Due_Amount: 95000,
    Paid_Amount: 95000,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 0,
    Status: 'Paid',
    Payment_Date: '2026-08-01',
    Notes: 'Fully disbursed.'
  },
  {
    Salary_Record_ID: 'SAL-2026-08-001',
    Employee_ID: 'EMP-001',
    Employee_Name: 'Vikram Mehta',
    Month: '2026-08',
    Due_Amount: 125000,
    Paid_Amount: 100000,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 25000,
    Status: 'Partial',
    Payment_Date: '2026-09-01',
    Notes: 'Cashflow alignment; ₹25,000 carry forward to September.'
  },
  {
    Salary_Record_ID: 'SAL-2026-08-002',
    Employee_ID: 'EMP-002',
    Employee_Name: 'Sarah Jenkins',
    Month: '2026-08',
    Due_Amount: 95000,
    Paid_Amount: 95000,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 0,
    Status: 'Paid',
    Payment_Date: '2026-09-01',
    Notes: 'Fully disbursed.'
  },
  {
    Salary_Record_ID: 'SAL-2026-08-003',
    Employee_ID: 'EMP-003',
    Employee_Name: 'Alex Rivera',
    Month: '2026-08',
    Due_Amount: 75000,
    Paid_Amount: 60000,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 15000,
    Status: 'Partial',
    Payment_Date: '2026-09-01',
    Notes: '₹15,000 carry forward to September.'
  },
  {
    Salary_Record_ID: 'SAL-2026-09-001',
    Employee_ID: 'EMP-001',
    Employee_Name: 'Vikram Mehta',
    Month: '2026-09',
    Due_Amount: 125000,
    Paid_Amount: 0,
    Prior_Carry_Forward: 25000,
    Pending_Carry_Forward: 150000,
    Status: 'Due',
    Notes: 'Includes ₹25,000 carried forward from August.'
  },
  {
    Salary_Record_ID: 'SAL-2026-09-002',
    Employee_ID: 'EMP-002',
    Employee_Name: 'Sarah Jenkins',
    Month: '2026-09',
    Due_Amount: 95000,
    Paid_Amount: 0,
    Prior_Carry_Forward: 0,
    Pending_Carry_Forward: 95000,
    Status: 'Due',
    Notes: 'Regular monthly cycle.'
  },
  {
    Salary_Record_ID: 'SAL-2026-09-003',
    Employee_ID: 'EMP-003',
    Employee_Name: 'Alex Rivera',
    Month: '2026-09',
    Due_Amount: 75000,
    Paid_Amount: 0,
    Prior_Carry_Forward: 15000,
    Pending_Carry_Forward: 90000,
    Status: 'Due',
    Notes: 'Includes ₹15,000 carried forward from August.'
  }
];

export const SEED_INVESTMENTS: Investment[] = [
  {
    Investment_ID: 'INV-2025-01',
    Source_Person: 'Kailash Singhania (Angel Partner)',
    Amount: 1200000,
    Taken_Date: '2025-10-15',
    Expected_Return_Date: '2026-10-15',
    Status: 'Active',
    Expected_Return_Rate: '12% p.a.',
    Notes: 'Working capital line for enterprise infrastructure ramp.'
  },
  {
    Investment_ID: 'INV-2026-02',
    Source_Person: 'Asha Ventures LLP',
    Amount: 2500000,
    Taken_Date: '2026-02-01',
    Expected_Return_Date: '2027-02-01',
    Status: 'Active',
    Expected_Return_Rate: '14% convertible note',
    Notes: 'Expansion tranche for regional logistics and events.'
  },
  {
    Investment_ID: 'INV-2024-03',
    Source_Person: 'Rajesh Vora',
    Amount: 800000,
    Taken_Date: '2024-06-01',
    Expected_Return_Date: '2025-06-01',
    Actual_Return_Date: '2025-05-28',
    Status: 'Returned',
    Expected_Return_Rate: '10% flat',
    Notes: 'Returned in full with interest on 28-May-2025.'
  }
];

export const SEED_CUSTOM_PAGES: CustomPage[] = [
  {
    Page_ID: 'PG-001',
    Title: 'Company Travel & OOP Reimbursement Policy',
    Slug: 'reimbursement-guidelines',
    Category: 'HR & Finance Policy',
    Status: 'Published',
    Created_At: '2026-09-01',
    Updated_At: '2026-09-18',
    Created_By: 'Vikram Mehta',
    Components: [
      {
        id: 'cmp-1',
        type: 'hero',
        content: {
          title: 'Company Out-of-Pocket Expense & Reimbursement Policy',
          subtitle: 'Clear, transparent rules governing company purchases, the ₹5,000 monthly allowance guideline, and receipt submissions.',
          badge: 'Official Handbook 2026'
        },
        styles: {
          bgColor: 'bg-gradient-to-r from-blue-900 to-indigo-800',
          textColor: 'text-white',
          padding: 'py-12 px-8',
          borderRadius: 'lg'
        }
      },
      {
        id: 'cmp-2',
        type: 'notice',
        content: {
          title: 'The ₹5,000 Standard Allowance Principle',
          body: 'All regular out-of-pocket expenses up to ₹5,000 per claim or monthly batch undergo expedited manager review. Expenses exceeding ₹5,000 must include prior project manager endorsement and official GST tax receipts.'
        },
        styles: {
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-900',
          borderColor: 'border-amber-300',
          padding: 'p-5',
          borderRadius: 'md'
        }
      },
      {
        id: 'cmp-3',
        type: 'card_grid',
        content: {
          cards: [
            {
              title: 'Eligible Purchases',
              desc: 'Client lunch/refreshments, local transport/cab receipts, project hardware adaptors, emergency office supplies.',
              tag: 'Allowed'
            },
            {
              title: 'Mandatory Receipts',
              desc: 'Digital photos or PDFs uploaded to Google Drive. Handwritten vouchers must show vendor phone and date.',
              tag: 'Required'
            },
            {
              title: 'Payout Cycle',
              desc: 'Approved claims are processed on the 15th and 30th of every calendar month directly to verified employee bank accounts.',
              tag: 'Schedule'
            }
          ]
        },
        styles: {
          padding: 'py-6'
        }
      }
    ]
  },
  {
    Page_ID: 'PG-002',
    Title: 'Project Phoenix: Master Kickoff & Deliverables',
    Slug: 'project-phoenix-kickoff',
    Category: 'Project Documentation',
    Status: 'Published',
    Created_At: '2026-09-10',
    Updated_At: '2026-09-15',
    Created_By: 'Sarah Jenkins',
    Components: [
      {
        id: 'cmp-4',
        type: 'hero',
        content: {
          title: 'Project Phoenix Master Portal Architecture',
          subtitle: 'The 5-Phase rollout roadmap for our internal company operational master site.',
          badge: 'Confidential Internal'
        },
        styles: {
          bgColor: 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900',
          textColor: 'text-white',
          padding: 'py-10 px-8',
          borderRadius: 'lg'
        }
      },
      {
        id: 'cmp-5',
        type: 'heading',
        content: {
          text: 'Key Project Deliverables',
          level: 'h2'
        },
        styles: {
          fontSize: '2xl',
          textColor: 'text-slate-900'
        }
      },
      {
        id: 'cmp-6',
        type: 'text',
        content: {
          text: 'Project Phoenix consolidates Google Drive structure, Master Google Site navigation, operational Google Sheets, Apps Script email automations, and a visual website builder for custom departmental hubs.'
        },
        styles: {
          fontSize: 'base',
          textColor: 'text-slate-700'
        }
      }
    ]
  }
];
