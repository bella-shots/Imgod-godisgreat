import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectMember, ProjectFile, MOMRecord } from '../../types';
import {
  FolderKanban,
  Plus,
  Calendar,
  ExternalLink,
  Users,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Search,
  Upload,
  Trash2,
  Edit,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ProjectsHub: React.FC = () => {
  const {
    currentUser,
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
    publishMOMRecord,
    employees
  } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.Project_ID || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'notes' | 'mom' | 'members'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewMOMModal, setShowNewMOMModal] = useState(false);
  const [showAddFileModal, setShowAddFileModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Form states
  const [newNoteText, setNewNoteText] = useState('');
  const [newProjectData, setNewProjectData] = useState({
    Project_Name: '',
    Description: '',
    Owner: currentUser.name,
    Start_Date: new Date().toISOString().split('T')[0],
    Event_Date: '2026-11-30',
    Status: 'Active' as Project['Status'],
    Drive_Folder_URL: 'https://drive.google.com/drive/folders/company-master',
    Notes: '',
    Budget_Total: 200000
  });

  const [newMOMData, setNewMOMData] = useState({
    Title: '',
    Meeting_Date: new Date().toISOString().split('T')[0],
    Agenda: '',
    Discussion_Summary: '',
    Attendees: [currentUser.email]
  });

  const [newActionItem, setNewActionItem] = useState({
    Task: '',
    Assignee: '',
    Due_Date: new Date().toISOString().split('T')[0]
  });
  const [actionItemsList, setActionItemsList] = useState<{ Item_ID: string; Task: string; Assignee: string; Due_Date: string; Status: 'Pending' }[]>([]);

  const [newFileData, setNewFileData] = useState({
    File_Name: '',
    Type: 'Checklist Excel' as ProjectFile['Type'],
    URL: 'https://docs.google.com/spreadsheets/d/sample-sheet',
    Size: '54 KB'
  });

  const [newMemberData, setNewMemberData] = useState({
    Employee_ID: employees[0]?.Employee_ID || '',
    Project_Role: 'Contributor',
    Access_Level: 'Editor' as ProjectMember['Access_Level']
  });

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.Project_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.Project_ID.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.Status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const currentProject = projects.find(p => p.Project_ID === selectedProjectId) || projects[0];

  const projectNotes = notes.filter(n => n.Project_ID === currentProject?.Project_ID);
  const projectMOMs = momRecords.filter(m => m.Project_ID === currentProject?.Project_ID);

  const getDaysRemaining = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = new Date('2026-09-23T09:00:00').getTime();
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectData.Project_Name) return;
    const created = addProject({
      ...newProjectData,
      Members: [
        {
          Employee_ID: currentUser.id,
          Employee_Name: currentUser.name,
          Project_Role: 'Project Owner',
          Access_Level: 'Admin',
          Active: true
        }
      ],
      Files: []
    });
    setSelectedProjectId(created.Project_ID);
    setShowNewProjectModal(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !currentProject) return;
    addProjectNote(currentProject.Project_ID, newNoteText.trim());
    setNewNoteText('');
  };

  const handleAddActionItem = () => {
    if (!newActionItem.Task || !newActionItem.Assignee) return;
    setActionItemsList(prev => [
      ...prev,
      {
        Item_ID: `ACT-${Date.now()}`,
        Task: newActionItem.Task,
        Assignee: newActionItem.Assignee,
        Due_Date: newActionItem.Due_Date,
        Status: 'Pending'
      }
    ]);
    setNewActionItem({ Task: '', Assignee: '', Due_Date: new Date().toISOString().split('T')[0] });
  };

  const handleCreateMOM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMOMData.Title || !currentProject) return;
    addMOMRecord({
      Project_ID: currentProject.Project_ID,
      Meeting_Date: newMOMData.Meeting_Date,
      Title: newMOMData.Title,
      Attendees: newMOMData.Attendees,
      Agenda: newMOMData.Agenda,
      Discussion_Summary: newMOMData.Discussion_Summary,
      Action_Items: actionItemsList,
      Drive_URL: `https://docs.google.com/document/d/mom-${Date.now()}`
    });
    setShowNewMOMModal(false);
    setActionItemsList([]);
    setNewMOMData({
      Title: '',
      Meeting_Date: new Date().toISOString().split('T')[0],
      Agenda: '',
      Discussion_Summary: '',
      Attendees: [currentUser.email]
    });
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileData.File_Name || !currentProject) return;
    addProjectFile(currentProject.Project_ID, {
      ...newFileData,
      Uploaded_By: currentUser.name
    });
    setShowAddFileModal(false);
    setNewFileData({
      File_Name: '',
      Type: 'Checklist Excel',
      URL: 'https://docs.google.com/spreadsheets/d/sample-sheet',
      Size: '45 KB'
    });
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.Employee_ID || !currentProject) return;
    const emp = employees.find(e => e.Employee_ID === newMemberData.Employee_ID);
    if (!emp) return;
    addProjectMember(currentProject.Project_ID, {
      Employee_ID: emp.Employee_ID,
      Employee_Name: emp.Name,
      Project_Role: newMemberData.Project_Role,
      Access_Level: newMemberData.Access_Level,
      Active: true
    });
    setShowAddMemberModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-600" />
            <span>Master Projects Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Phase 2 & 3 Authoritative Project Records, Member Access, Checklists & Minutes of Meeting (MOM)
          </p>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Master Project</span>
        </button>
      </div>

      {/* Main Grid: Left Sidebar Project Selector & Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Project Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Filters */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {['All', 'Active', 'Planning', 'Completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md font-semibold ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredProjects.map(proj => {
              const isSelected = proj.Project_ID === selectedProjectId;
              const days = getDaysRemaining(proj.Event_Date);
              return (
                <div
                  key={proj.Project_ID}
                  onClick={() => setSelectedProjectId(proj.Project_ID)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                      {proj.Project_ID}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      proj.Status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {proj.Status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{proj.Project_Name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{proj.Description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{proj.Members.length} members</span>
                    <span className="font-semibold text-slate-700">
                      {days > 0 ? `${days}d countdown` : 'Reached'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Selected Project Hub (8 cols) */}
        {currentProject && (
          <div className="lg:col-span-8 space-y-4">
            
            {/* Project Header Banner */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                      {currentProject.Project_ID}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {currentProject.Status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1.5">
                    {currentProject.Project_Name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    {currentProject.Description}
                  </p>
                </div>

                {/* Google Drive Link */}
                <a
                  href={currentProject.Drive_Folder_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold self-start transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Drive Folder</span>
                </a>
              </div>

              {/* Countdown & Financial Summary */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-400 font-medium text-[10px] uppercase">Project Owner</div>
                  <div className="font-bold text-slate-800 mt-0.5">{currentProject.Owner}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-400 font-medium text-[10px] uppercase">Event Date</div>
                  <div className="font-bold text-slate-800 mt-0.5">{currentProject.Event_Date}</div>
                  <div className="text-[10px] text-blue-600 font-semibold">{getDaysRemaining(currentProject.Event_Date)} days left</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-400 font-medium text-[10px] uppercase">Budget Total</div>
                  <div className="font-bold text-slate-800 mt-0.5">₹{currentProject.Budget_Total.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <div className="text-slate-400 font-medium text-[10px] uppercase">Verified Spend</div>
                  <div className="font-bold text-emerald-700 mt-0.5">₹{currentProject.Spent_Total.toLocaleString()}</div>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="mt-5 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
                {[
                  { id: 'overview', label: 'Overview & Notes' },
                  { id: 'mom', label: `Minutes of Meeting (${projectMOMs.length})` },
                  { id: 'files', label: `Checklists & Files (${currentProject.Files.length})` },
                  { id: 'members', label: `Team Members (${currentProject.Members.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-2.5 border-b-2 font-bold transition-all ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-tab 1: Overview & Notes (F14) */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                
                {/* Notes Feed */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span>Project Notes & Operational Stream (F14)</span>
                  </h3>

                  {/* Add note input */}
                  <form onSubmit={handleAddNote} className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNoteText}
                        onChange={e => setNewNoteText(e.target.value)}
                        placeholder="Add an operational note or check-in..."
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5">
                    {projectNotes.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">No notes recorded yet.</p>
                    ) : (
                      projectNotes.map(n => (
                        <div key={n.Note_ID} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-semibold text-slate-700">{n.Author_Name} ({n.Author_Email})</span>
                            <span>{n.Date}</span>
                          </div>
                          <p className="text-slate-800">{n.Note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2: Minutes of Meeting (MOM) (F13, B4-06, B4-07) */}
            {activeTab === 'mom' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Meeting Records & Versioned MOMs
                  </h3>
                  <button
                    onClick={() => setShowNewMOMModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Draft New MOM</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {projectMOMs.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                      No MOM records found for this project yet. Click &ldquo;Draft New MOM&rdquo; above.
                    </div>
                  ) : (
                    projectMOMs.map(mom => (
                      <div key={mom.MOM_ID} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-800">{mom.MOM_ID}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                mom.Status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {mom.Status} (v{mom.Version})
                              </span>
                              <span className="text-xs text-slate-400">&bull; {mom.Meeting_Date}</span>
                            </div>
                            <h4 className="font-bold text-base text-slate-900 mt-1">{mom.Title}</h4>
                          </div>

                          {mom.Status === 'Draft' ? (
                            <button
                              onClick={() => publishMOMRecord(mom.MOM_ID)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Publish &amp; Send to Attendees</span>
                            </button>
                          ) : (
                            <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Published &amp; Distributed</span>
                            </div>
                          )}
                        </div>

                        {/* Summary & Agenda */}
                        <div className="text-xs space-y-2">
                          <div>
                            <strong className="text-slate-500 uppercase text-[10px]">Agenda:</strong>
                            <p className="text-slate-800 mt-0.5">{mom.Agenda}</p>
                          </div>
                          <div>
                            <strong className="text-slate-500 uppercase text-[10px]">Discussion Summary:</strong>
                            <p className="text-slate-800 mt-0.5">{mom.Discussion_Summary}</p>
                          </div>
                          <div>
                            <strong className="text-slate-500 uppercase text-[10px]">Attendees:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {mom.Attendees.map(att => (
                                <span key={att} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                                  {att}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Items */}
                        {mom.Action_Items && mom.Action_Items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Action Items &amp; Owners
                            </h5>
                            <div className="space-y-1.5">
                              {mom.Action_Items.map(item => (
                                <div key={item.Item_ID} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                                  <span className="text-slate-800 font-medium">{item.Task}</span>
                                  <div className="flex items-center gap-3 text-slate-500">
                                    <span>Owner: <strong className="text-slate-700">{item.Assignee}</strong></span>
                                    <span>Due: <strong className="text-slate-700">{item.Due_Date}</strong></span>
                                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">
                                      {item.Status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Distribution Email Log (B4-06, B4-07) */}
                        {mom.Distribution_Logs && mom.Distribution_Logs.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-blue-600" />
                              <span>Email Distribution Audit Trail (Phase 4 Apps Script Mail)</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                              {mom.Distribution_Logs.map((log, idx) => (
                                <div key={idx} className="p-2 rounded bg-slate-50/80 border border-slate-100 flex items-center justify-between">
                                  <span className="font-mono text-slate-600 truncate mr-2">{log.Recipient}</span>
                                  <span className="text-emerald-700 font-semibold">{log.Status} &bull; {log.Message_ID}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 3: Checklists & Files (F06) */}
            {activeTab === 'files' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Project Checklists &amp; Attached Excel Workbooks (F06)
                  </h3>
                  <button
                    onClick={() => setShowAddFileModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload / Link Sheet</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                  {currentProject.Files.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      No files or checklists attached yet.
                    </div>
                  ) : (
                    currentProject.Files.map(file => (
                      <div key={file.File_ID} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{file.File_Name}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-semibold text-slate-700">{file.Type}</span>
                              <span>&bull;</span>
                              <span>{file.Size}</span>
                              <span>&bull;</span>
                              <span>By {file.Uploaded_By} on {file.Uploaded_At}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={file.URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                          >
                            Open in Google Sheets
                          </a>
                          <button
                            onClick={() => deleteProjectFile(currentProject.Project_ID, file.File_ID)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete file reference"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Sub-tab 4: Members (F05) */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">
                    Project Assigned Members &amp; Access Roles
                  </h3>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                  {currentProject.Members.map(member => (
                    <div key={member.Employee_ID} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {member.Employee_Name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{member.Employee_Name}</h4>
                          <p className="text-[11px] text-slate-500">{member.Project_Role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                          {member.Access_Level}
                        </span>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => removeProjectMember(currentProject.Project_ID, member.Employee_ID)}
                            className="text-slate-400 hover:text-rose-600 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Modal: New Project */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Master Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjectData.Project_Name}
                  onChange={e => setNewProjectData({ ...newProjectData, Project_Name: e.target.value })}
                  placeholder="e.g. Q4 Regional Operations Overhaul"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProjectData.Description}
                  onChange={e => setNewProjectData({ ...newProjectData, Description: e.target.value })}
                  placeholder="Brief summary of objectives and scope"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProjectData.Start_Date}
                    onChange={e => setNewProjectData({ ...newProjectData, Start_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Target Event Date</label>
                  <input
                    type="date"
                    value={newProjectData.Event_Date}
                    onChange={e => setNewProjectData({ ...newProjectData, Event_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Budget (INR ₹)</label>
                  <input
                    type="number"
                    value={newProjectData.Budget_Total}
                    onChange={e => setNewProjectData({ ...newProjectData, Budget_Total: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={newProjectData.Status}
                    onChange={e => setNewProjectData({ ...newProjectData, Status: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Active">Active</option>
                    <option value="Planning">Planning</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Draft MOM */}
      {showNewMOMModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900">Draft Project Minutes of Meeting (MOM)</h3>
            <form onSubmit={handleCreateMOM} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={newMOMData.Title}
                  onChange={e => setNewMOMData({ ...newMOMData, Title: e.target.value })}
                  placeholder="e.g. Sprint 2 Planning & Budget Signoff"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={newMOMData.Meeting_Date}
                    onChange={e => setNewMOMData({ ...newMOMData, Meeting_Date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Attendees (Emails)</label>
                  <input
                    type="text"
                    value={newMOMData.Attendees.join(', ')}
                    onChange={e => setNewMOMData({ ...newMOMData, Attendees: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="email1@company.com, email2@company.com"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Agenda</label>
                <input
                  type="text"
                  value={newMOMData.Agenda}
                  onChange={e => setNewMOMData({ ...newMOMData, Agenda: e.target.value })}
                  placeholder="Key agenda items discussed"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Discussion Summary</label>
                <textarea
                  rows={3}
                  value={newMOMData.Discussion_Summary}
                  onChange={e => setNewMOMData({ ...newMOMData, Discussion_Summary: e.target.value })}
                  placeholder="Summary of decisions, approvals, and outcomes"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Action items builder */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="font-bold text-slate-700 block mb-2">Add Action Item</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Task description"
                    value={newActionItem.Task}
                    onChange={e => setNewActionItem({ ...newActionItem, Task: e.target.value })}
                    className="px-2 py-1.5 bg-white border rounded"
                  />
                  <input
                    type="text"
                    placeholder="Assignee name"
                    value={newActionItem.Assignee}
                    onChange={e => setNewActionItem({ ...newActionItem, Assignee: e.target.value })}
                    className="px-2 py-1.5 bg-white border rounded"
                  />
                  <div className="flex gap-1">
                    <input
                      type="date"
                      value={newActionItem.Due_Date}
                      onChange={e => setNewActionItem({ ...newActionItem, Due_Date: e.target.value })}
                      className="px-2 py-1.5 bg-white border rounded text-[11px] flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddActionItem}
                      className="px-2 py-1 bg-blue-600 text-white rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {actionItemsList.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {actionItemsList.map((item, i) => (
                      <div key={i} className="text-[11px] bg-white p-1.5 rounded border flex justify-between">
                        <span>{item.Task} &bull; <strong>{item.Assignee}</strong></span>
                        <span className="text-slate-500">{item.Due_Date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewMOMModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Save MOM Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add File */}
      {showAddFileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Upload / Link Spreadsheet File</h3>
            <form onSubmit={handleAddFile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={newFileData.File_Name}
                  onChange={e => setNewFileData({ ...newFileData, File_Name: e.target.value })}
                  placeholder="e.g. Sprint_Vendor_Checklist.xlsx"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">File Category</label>
                <select
                  value={newFileData.Type}
                  onChange={e => setNewFileData({ ...newFileData, Type: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Checklist Excel">Checklist Excel</option>
                  <option value="Expense Excel">Expense Excel</option>
                  <option value="Brief">Brief</option>
                  <option value="Contract">Contract</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Google Sheets / Drive URL</label>
                <input
                  type="url"
                  value={newFileData.URL}
                  onChange={e => setNewFileData({ ...newFileData, URL: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddFileModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Attach File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Employee</label>
                <select
                  value={newMemberData.Employee_ID}
                  onChange={e => setNewMemberData({ ...newMemberData, Employee_ID: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {employees.map(emp => (
                    <option key={emp.Employee_ID} value={emp.Employee_ID}>
                      {emp.Name} ({emp.Department})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Project Role Title</label>
                <input
                  type="text"
                  value={newMemberData.Project_Role}
                  onChange={e => setNewMemberData({ ...newMemberData, Project_Role: e.target.value })}
                  placeholder="e.g. Lead Logistics Coordinator"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Access Level</label>
                <select
                  value={newMemberData.Access_Level}
                  onChange={e => setNewMemberData({ ...newMemberData, Access_Level: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Editor">Editor (Edit files, checklists, MOM)</option>
                  <option value="Admin">Admin (Full project control)</option>
                  <option value="Viewer">Viewer (Read only)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Assign Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
