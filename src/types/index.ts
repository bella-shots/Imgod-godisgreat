export type UserRole = 'admin' | 'project_manager' | 'employee';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Employee {
  Employee_ID: string;
  Name: string;
  Email: string;
  Role: 'admin' | 'project_manager' | 'employee';
  Department: string;
  Salary_Basis: number; // e.g. monthly ₹ in INR
  Active: boolean;
  Reimbursement_Eligible: boolean;
  Project_Access: string[]; // Project_IDs
  Joining_Date: string;
  HR_Notes?: string;
  Phone?: string;
}

export interface ProjectMember {
  Employee_ID: string;
  Employee_Name: string;
  Project_Role: string;
  Access_Level: 'Admin' | 'Editor' | 'Viewer';
  Active: boolean;
}

export interface ProjectFile {
  File_ID: string;
  File_Name: string;
  Type: 'Checklist Excel' | 'Expense Excel' | 'Brief' | 'Contract' | 'Other';
  URL: string;
  Uploaded_By: string;
  Uploaded_At: string;
  Size: string;
}

export interface ProjectNote {
  Note_ID: string;
  Project_ID: string;
  Date: string;
  Author_Email: string;
  Author_Name: string;
  Note: string;
  Status: 'Active' | 'Archived';
}

export interface ActionItem {
  Item_ID: string;
  Task: string;
  Assignee: string;
  Due_Date: string;
  Status: 'Pending' | 'In Progress' | 'Done';
}

export interface EmailDistributionLog {
  Recipient: string;
  Timestamp: string;
  Status: 'Sent' | 'Failed';
  Message_ID: string;
}

export interface MOMRecord {
  MOM_ID: string;
  Project_ID: string;
  Meeting_Date: string;
  Title: string;
  Version: number;
  Status: 'Draft' | 'Published';
  Drive_URL?: string;
  Published_At?: string;
  Published_By?: string;
  Attendees: string[];
  Agenda: string;
  Discussion_Summary: string;
  Action_Items: ActionItem[];
  Distribution_Logs?: EmailDistributionLog[];
}

export interface Project {
  Project_ID: string;
  Project_Name: string;
  Description: string;
  Owner: string;
  Start_Date: string;
  Event_Date: string; // Target milestone / event
  Status: 'Active' | 'Planning' | 'Completed' | 'On Hold';
  Drive_Folder_URL: string;
  Notes: string;
  Budget_Total: number;
  Spent_Total: number;
  Members: ProjectMember[];
  Files: ProjectFile[];
  MOM_Count?: number;
}

export interface BudgetGiven {
  Budget_ID: string;
  Date: string;
  Recipient: string;
  Recipient_Email: string;
  Amount: number;
  Purpose: string;
  Project_ID: string;
  Status: 'Allocated' | 'Disbursed' | 'Reconciled';
  Proof_URL?: string;
  Created_By: string;
}

export interface EmployeeSpending {
  Spending_ID: string;
  Employee_ID: string;
  Employee_Name: string;
  Date: string;
  Amount: number;
  Vendor: string;
  Purpose: string;
  Project_ID: string;
  Attachment_URL: string;
  Status: 'Submitted' | 'Verified' | 'Rejected';
  Verification_Notes?: string;
}

export interface OOPClaim {
  Claim_ID: string;
  Employee_ID: string;
  Employee_Name: string;
  Employee_Email: string;
  Month: string; // YYYY-MM
  Date: string;
  Purpose: string;
  Amount: number;
  Project_ID: string;
  Proof_URL: string;
  Status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  Approved_Amount?: number;
  Paid_Date?: string;
  Policy_Threshold_Exceeded: boolean; // Flagged if amount > ₹5,000 threshold
  Notes?: string;
}

export interface SalaryRecord {
  Salary_Record_ID: string;
  Employee_ID: string;
  Employee_Name: string;
  Month: string; // YYYY-MM
  Due_Amount: number;
  Paid_Amount: number;
  Prior_Carry_Forward: number;
  Pending_Carry_Forward: number; // (Due_Amount + Prior_Carry_Forward) - Paid_Amount
  Status: 'Due' | 'Partial' | 'Paid';
  Payment_Date?: string;
  Notes?: string;
}

export interface Investment {
  Investment_ID: string;
  Source_Person: string;
  Amount: number;
  Taken_Date: string;
  Expected_Return_Date: string;
  Actual_Return_Date?: string;
  Status: 'Active' | 'Matured' | 'Returned';
  Expected_Return_Rate?: string;
  Notes?: string;
}

export interface BuilderComponentStyle {
  textColor?: string;
  bgColor?: string;
  padding?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  borderWidth?: string;
  borderColor?: string;
}

export interface BuilderComponent {
  id: string;
  type: 'hero' | 'heading' | 'text' | 'card_grid' | 'button' | 'notice' | 'columns' | 'divider' | 'table';
  content: any;
  styles?: BuilderComponentStyle;
}

export interface CustomPage {
  Page_ID: string;
  Title: string;
  Slug: string;
  Category: string;
  Status: 'Published' | 'Draft';
  Created_At: string;
  Updated_At: string;
  Created_By: string;
  Components: BuilderComponent[];
  Custom_CSS?: string;
}
