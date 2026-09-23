import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Employee } from '../../types';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  Lock,
  Edit,
  CheckCircle2,
  XCircle,
  FolderKanban
} from 'lucide-react';

export const HRDirectory: React.FC = () => {
  const { currentUser, employees, addEmployee, updateEmployee, toggleEmployeeActive, projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const [newEmployeeData, setNewEmployeeData] = useState({
    Name: '',
    Email: '',
    Role: 'employee' as Employee['Role'],
    Department: 'Engineering',
    Salary_Basis: 65000,
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: ['PRJ-101'],
    Joining_Date: new Date().toISOString().split('T')[0],
    HR_Notes: '',
    Phone: '+91 98000 00000'
  });

  const departments = ['All', ...Array.from(new Set(employees.map(e => e.Department)))];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.Employee_ID.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.Department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployeeData.Name || !newEmployeeData.Email) return;
    addEmployee(newEmployeeData);
    setShowAddModal(false);
    setNewEmployeeData({
      Name: '',
      Email: '',
      Role: 'employee',
      Department: 'Engineering',
      Salary_Basis: 65000,
      Active: true,
      Reimbursement_Eligible: true,
      Project_Access: ['PRJ-101'],
      Joining_Date: new Date().toISOString().split('T')[0],
      HR_Notes: '',
      Phone: '+91 98000 00000'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Master HR &amp; Employee Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Authoritative Employee Records, Google Account Mappings &amp; Project Access Control (F08, Phase 3 Schema)
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase mr-1">Dept:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                departmentFilter === dept
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Employee ID</th>
                <th className="p-3">Full Name</th>
                <th className="p-3">Role &amp; Title</th>
                <th className="p-3">Department</th>
                <th className="p-3">Project Access</th>
                <th className="p-3 text-center">OOP Eligible</th>
                <th className="p-3 text-right">Salary Basis</th>
                <th className="p-3 text-center">Status</th>
                {isAdmin && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => (
                <tr key={emp.Employee_ID} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-mono font-bold text-blue-700">
                    {emp.Employee_ID}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{emp.Name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{emp.Email}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      emp.Role === 'admin'
                        ? 'bg-red-100 text-red-800'
                        : emp.Role === 'project_manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {emp.Role === 'admin' ? 'Master Admin' : emp.Role === 'project_manager' ? 'Project Manager' : 'Employee'}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{emp.Department}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {emp.Project_Access.map(pId => (
                        <span key={pId} className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                          {pId}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {emp.Reimbursement_Eligible ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>No</span>
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {isAdmin ? (
                      <span className="text-slate-900">₹{emp.Salary_Basis.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px] flex items-center justify-end gap-1">
                        <Lock className="w-3 h-3" /> Confidential
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      emp.Active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {emp.Active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-3 text-right">
                      <button
                        onClick={() => toggleEmployeeActive(emp.Employee_ID)}
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          emp.Active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {emp.Active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Employee */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Company Employee</h3>
            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sen"
                  value={newEmployeeData.Name}
                  onChange={e => setNewEmployeeData({ ...newEmployeeData, Name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (Google Account)</label>
                  <input
                    type="email"
                    required
                    placeholder="user@company.com"
                    value={newEmployeeData.Email}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newEmployeeData.Phone}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role</label>
                  <select
                    value={newEmployeeData.Role}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Role: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="employee">Employee</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="admin">Master Admin</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={newEmployeeData.Department}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Department: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Monthly Salary Basis (₹)</label>
                  <input
                    type="number"
                    value={newEmployeeData.Salary_Basis}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Salary_Basis: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newEmployeeData.Joining_Date}
                    onChange={e => setNewEmployeeData({ ...newEmployeeData, Joining_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Assigned Projects (comma separated IDs)</label>
                <input
                  type="text"
                  value={newEmployeeData.Project_Access.join(', ')}
                  onChange={e =>
                    setNewEmployeeData({
                      ...newEmployeeData,
                      Project_Access: e.target.value.split(',').map(s => s.trim())
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reimbEligible"
                  checked={newEmployeeData.Reimbursement_Eligible}
                  onChange={e =>
                    setNewEmployeeData({ ...newEmployeeData, Reimbursement_Eligible: e.target.checked })
                  }
                  className="rounded"
                />
                <label htmlFor="reimbEligible" className="font-bold text-slate-700">
                  Eligible for Out-of-Pocket Reimbursements (₹5,000 threshold workflow)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
