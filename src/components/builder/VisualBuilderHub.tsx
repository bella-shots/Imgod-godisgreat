import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomPage, BuilderComponent } from '../../types';
import {
  Palette,
  Layout,
  Type,
  Image as ImageIcon,
  Grid,
  CheckCircle,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Globe,
  Sparkles,
  Layers,
  Sliders,
  Code,
  Eye,
  AlertCircle
} from 'lucide-react';

export const VisualBuilderHub: React.FC = () => {
  const { customPages, createCustomPage, updateCustomPage, deleteCustomPage, publishCustomPage, currentUser } = useApp();

  const [selectedPageId, setSelectedPageId] = useState<string>(customPages[0]?.Page_ID || '');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showHtmlExport, setShowHtmlExport] = useState(false);
  const [showNewPageModal, setShowNewPageModal] = useState(false);

  // New Page Form
  const [newPageData, setNewPageData] = useState({
    Title: '',
    Slug: '',
    Category: 'Internal Guidelines',
    Template: 'blank'
  });

  const currentPage = customPages.find(p => p.Page_ID === selectedPageId) || customPages[0];

  const selectedComponent = currentPage?.Components.find(c => c.id === selectedComponentId);

  // Pre-configured component templates to add
  const addComponent = (type: BuilderComponent['type']) => {
    if (!currentPage) return;
    const newId = `cmp-${Date.now()}`;
    let newComp: BuilderComponent;

    switch (type) {
      case 'hero':
        newComp = {
          id: newId,
          type: 'hero',
          content: {
            title: 'New Section Header',
            subtitle: 'Add an engaging description or mission statement here.',
            badge: 'Update'
          },
          styles: {
            bgColor: 'bg-gradient-to-r from-blue-900 to-indigo-900',
            textColor: 'text-white',
            padding: 'py-10 px-8',
            borderRadius: 'lg'
          }
        };
        break;

      case 'heading':
        newComp = {
          id: newId,
          type: 'heading',
          content: { text: 'Section Heading', level: 'h2' },
          styles: { fontSize: '2xl', textColor: 'text-slate-900' }
        };
        break;

      case 'text':
        newComp = {
          id: newId,
          type: 'text',
          content: { text: 'Write comprehensive departmental policy or instructions here.' },
          styles: { fontSize: 'base', textColor: 'text-slate-700' }
        };
        break;

      case 'notice':
        newComp = {
          id: newId,
          type: 'notice',
          content: {
            title: 'Important Protocol Notice',
            body: 'Guidelines for submitting invoices before month-end.'
          },
          styles: {
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-900',
            borderColor: 'border-amber-300',
            padding: 'p-4',
            borderRadius: 'md'
          }
        };
        break;

      case 'card_grid':
        newComp = {
          id: newId,
          type: 'card_grid',
          content: {
            cards: [
              { title: 'Step 1: Planning', desc: 'Define required milestones and review with team lead.', tag: 'Phase 1' },
              { title: 'Step 2: Execution', desc: 'Deploy assets and log all related expenses.', tag: 'Phase 2' },
              { title: 'Step 3: Verification', desc: 'Reconcile budgets and submit final MOM.', tag: 'Phase 3' }
            ]
          },
          styles: { padding: 'py-4' }
        };
        break;

      case 'button':
        newComp = {
          id: newId,
          type: 'button',
          content: { label: 'Submit Internal Request &rarr;', link: '#' },
          styles: { bgColor: 'bg-blue-600', textColor: 'text-white', borderRadius: 'md', padding: 'px-4 py-2' }
        };
        break;

      case 'divider':
        newComp = {
          id: newId,
          type: 'divider',
          content: {},
          styles: { padding: 'py-4' }
        };
        break;

      default:
        newComp = {
          id: newId,
          type: 'text',
          content: { text: 'Default text block' }
        };
    }

    const updatedComponents = [...currentPage.Components, newComp];
    updateCustomPage(currentPage.Page_ID, { Components: updatedComponents });
    setSelectedComponentId(newId);
  };

  const updateComponentContent = (id: string, newContent: any) => {
    if (!currentPage) return;
    const updated = currentPage.Components.map(c => (c.id === id ? { ...c, content: newContent } : c));
    updateCustomPage(currentPage.Page_ID, { Components: updated });
  };

  const updateComponentStyle = (id: string, newStyle: any) => {
    if (!currentPage) return;
    const updated = currentPage.Components.map(c =>
      c.id === id ? { ...c, styles: { ...c.styles, ...newStyle } } : c
    );
    updateCustomPage(currentPage.Page_ID, { Components: updated });
  };

  const deleteComponent = (id: string) => {
    if (!currentPage) return;
    const updated = currentPage.Components.filter(c => c.id !== id);
    updateCustomPage(currentPage.Page_ID, { Components: updated });
    if (selectedComponentId === id) setSelectedComponentId(null);
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    if (!currentPage) return;
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= currentPage.Components.length) return;
    const arr = [...currentPage.Components];
    const temp = arr[index];
    arr[index] = arr[newIdx];
    arr[newIdx] = temp;
    updateCustomPage(currentPage.Page_ID, { Components: arr });
  };

  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageData.Title) return;
    const slug = newPageData.Slug || newPageData.Title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const created = createCustomPage({
      Title: newPageData.Title,
      Slug: slug,
      Category: newPageData.Category,
      Status: 'Draft',
      Created_By: currentUser.name,
      Components: [
        {
          id: `cmp-${Date.now()}`,
          type: 'hero',
          content: {
            title: newPageData.Title,
            subtitle: 'Add page introductory notes and purpose here.',
            badge: 'Draft Page'
          },
          styles: {
            bgColor: 'bg-gradient-to-r from-slate-900 to-indigo-950',
            textColor: 'text-white',
            padding: 'py-8 px-6',
            borderRadius: 'lg'
          }
        }
      ]
    });
    setSelectedPageId(created.Page_ID);
    setShowNewPageModal(false);
  };

  const getCanvasWidthClass = () => {
    switch (devicePreview) {
      case 'mobile':
        return 'max-w-[375px] shadow-2xl border border-slate-300';
      case 'tablet':
        return 'max-w-[768px] shadow-xl border border-slate-300';
      default:
        return 'max-w-4xl shadow-xs';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Page Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Palette className="w-6 h-6 text-indigo-600" />
            <span>Full Visual Page Builder (F15-F20)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Design, style, and publish custom internal company pages with modular components and responsive previews
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Page Dropdown */}
          <select
            value={selectedPageId}
            onChange={e => {
              setSelectedPageId(e.target.value);
              setSelectedComponentId(null);
            }}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            {customPages.map(page => (
              <option key={page.Page_ID} value={page.Page_ID}>
                {page.Title} ({page.Status})
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewPageModal(true)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Page</span>
          </button>

          {/* Device Preview Switcher (F16) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`p-1.5 rounded-lg ${devicePreview === 'desktop' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevicePreview('tablet')}
              className={`p-1.5 rounded-lg ${devicePreview === 'tablet' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`p-1.5 rounded-lg ${devicePreview === 'mobile' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Publish / Draft Toggle (F20) */}
          {currentPage && (
            <button
              onClick={() => publishCustomPage(currentPage.Page_ID, currentPage.Status !== 'Published')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 ${
                currentPage.Status === 'Published'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentPage.Status === 'Published' ? 'Published (Live)' : 'Publish Page'}</span>
            </button>
          )}

          <button
            onClick={() => setShowHtmlExport(!showHtmlExport)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
            title="Export Clean HTML"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Builder Layout: Left Component Palette, Center Interactive Canvas, Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Palette: Component Drawer (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Component Elements (F15)</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                { type: 'hero', label: 'Hero Banner', desc: 'Prominent header with badge & gradient', icon: Sparkles },
                { type: 'heading', label: 'Section Heading', desc: 'H1, H2, or H3 typography block', icon: Type },
                { type: 'text', label: 'Text Paragraph', desc: 'Body content & markdown guidance', icon: Layout },
                { type: 'card_grid', label: '3-Card Grid', desc: 'Multi-column feature or step cards', icon: Grid },
                { type: 'notice', label: 'Callout Alert', desc: 'Notice box for important policy rules', icon: AlertCircle },
                { type: 'button', label: 'CTA Action Button', desc: 'Interactive link or submission prompt', icon: Plus },
                { type: 'divider', label: 'Horizontal Divider', desc: 'Clean section separation rule', icon: Sliders }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => addComponent(item.type as any)}
                    className="w-full text-left p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all flex items-start gap-2.5 group"
                  >
                    <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-indigo-900">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Page Info */}
          {currentPage && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs text-xs space-y-2">
              <div className="font-bold text-slate-800">Page Properties</div>
              <div className="text-slate-500">Slug: <span className="font-mono text-slate-700 font-semibold">/{currentPage.Slug}</span></div>
              <div className="text-slate-500">Category: <span className="text-slate-700 font-semibold">{currentPage.Category}</span></div>
              <div className="text-slate-500">Created by: <span className="text-slate-700 font-semibold">{currentPage.Created_By}</span></div>
              <div className="text-slate-500">Components: <span className="font-bold text-slate-800">{currentPage.Components.length} blocks</span></div>
            </div>
          )}
        </div>

        {/* Center: Live Interactive Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className={`w-full bg-slate-100/70 p-4 sm:p-6 rounded-2xl min-h-[650px] flex justify-center`}>
            <div className={`w-full bg-white rounded-xl p-6 transition-all duration-300 space-y-4 ${getCanvasWidthClass()}`}>
              
              {/* Canvas Header */}
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono uppercase font-bold text-[10px] tracking-wider">
                  Live Canvas: {currentPage?.Title}
                </span>
                <span className="capitalize font-medium">{devicePreview} View</span>
              </div>

              {/* Render Components */}
              {currentPage?.Components.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                  <p>Page is currently empty.</p>
                  <p>Click any component in the left drawer to add blocks to the canvas.</p>
                </div>
              ) : (
                currentPage?.Components.map((comp, idx) => {
                  const isSelected = comp.id === selectedComponentId;
                  return (
                    <div
                      key={comp.id}
                      onClick={() => setSelectedComponentId(comp.id)}
                      className={`relative group rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 ring-offset-2'
                          : 'hover:ring-1 hover:ring-slate-300'
                      }`}
                    >
                      {/* Component Reorder & Delete Toolbar */}
                      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-1 bg-slate-900 text-white p-1 rounded-md text-[10px]">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            moveComponent(idx, 'up');
                          }}
                          disabled={idx === 0}
                          className="p-0.5 hover:text-blue-300 disabled:opacity-30"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            moveComponent(idx, 'down');
                          }}
                          disabled={idx === currentPage.Components.length - 1}
                          className="p-0.5 hover:text-blue-300 disabled:opacity-30"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            deleteComponent(comp.id);
                          }}
                          className="p-0.5 hover:text-rose-400"
                          title="Delete Component"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Component Renderers */}
                      {comp.type === 'hero' && (
                        <div className={`rounded-xl p-6 sm:p-8 ${comp.styles?.bgColor || 'bg-slate-900'} ${comp.styles?.textColor || 'text-white'}`}>
                          {comp.content.badge && (
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 mb-2">
                              {comp.content.badge}
                            </span>
                          )}
                          <h2 className="text-xl sm:text-2xl font-black">{comp.content.title}</h2>
                          <p className="mt-2 text-xs sm:text-sm text-slate-200">{comp.content.subtitle}</p>
                        </div>
                      )}

                      {comp.type === 'heading' && (
                        <h2 className={`font-extrabold text-slate-900 ${
                          comp.styles?.fontSize === '3xl' ? 'text-2xl sm:text-3xl' : 'text-xl'
                        }`}>
                          {comp.content.text}
                        </h2>
                      )}

                      {comp.type === 'text' && (
                        <p className={`text-slate-700 leading-relaxed text-xs sm:text-sm`}>
                          {comp.content.text}
                        </p>
                      )}

                      {comp.type === 'notice' && (
                        <div className={`p-4 rounded-xl border ${comp.styles?.bgColor || 'bg-amber-50'} ${comp.styles?.borderColor || 'border-amber-200'} ${comp.styles?.textColor || 'text-amber-900'}`}>
                          <div className="font-bold text-xs">{comp.content.title}</div>
                          <p className="mt-1 text-xs opacity-90">{comp.content.body}</p>
                        </div>
                      )}

                      {comp.type === 'card_grid' && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {comp.content.cards?.map((card: any, i: number) => (
                            <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50">
                              <span className="text-[10px] font-bold text-indigo-600 uppercase">{card.tag}</span>
                              <h4 className="font-bold text-xs text-slate-900 mt-1">{card.title}</h4>
                              <p className="text-[11px] text-slate-500 mt-1">{card.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {comp.type === 'button' && (
                        <div>
                          <button className={`px-4 py-2 rounded-lg text-xs font-bold shadow-xs ${comp.styles?.bgColor || 'bg-blue-600'} ${comp.styles?.textColor || 'text-white'}`}>
                            {comp.content.label}
                          </button>
                        </div>
                      )}

                      {comp.type === 'divider' && (
                        <div className="py-2">
                          <hr className="border-slate-200" />
                        </div>
                      )}

                    </div>
                  );
                })
              )}

            </div>
          </div>
        </div>

        {/* Right Inspector: Style & Content Controls (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>Inspector &amp; Styles (F17)</span>
            </h3>

            {!selectedComponent ? (
              <div className="text-xs text-slate-400 italic py-4 text-center">
                Click any component in the canvas to inspect and customize its content and styles.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Type: {selectedComponent.type}
                  </span>
                </div>

                {/* Content Editor depending on type */}
                {selectedComponent.type === 'hero' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Hero Title</label>
                    <input
                      type="text"
                      value={selectedComponent.content.title}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          title: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                    <label className="font-bold text-slate-700 block">Subtitle</label>
                    <textarea
                      rows={2}
                      value={selectedComponent.content.subtitle}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          subtitle: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                    <label className="font-bold text-slate-700 block">Badge Tag</label>
                    <input
                      type="text"
                      value={selectedComponent.content.badge}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          badge: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                )}

                {selectedComponent.type === 'heading' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Heading Text</label>
                    <input
                      type="text"
                      value={selectedComponent.content.text}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          text: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                )}

                {selectedComponent.type === 'text' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Paragraph Content</label>
                    <textarea
                      rows={4}
                      value={selectedComponent.content.text}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          text: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                )}

                {selectedComponent.type === 'notice' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Notice Title</label>
                    <input
                      type="text"
                      value={selectedComponent.content.title}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          title: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                    <label className="font-bold text-slate-700 block">Body Notice</label>
                    <textarea
                      rows={3}
                      value={selectedComponent.content.body}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          body: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                )}

                {selectedComponent.type === 'button' && (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">Button Label</label>
                    <input
                      type="text"
                      value={selectedComponent.content.label}
                      onChange={e =>
                        updateComponentContent(selectedComponent.id, {
                          ...selectedComponent.content,
                          label: e.target.value
                        })
                      }
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                )}

                {/* Style Controls (F17) */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="font-bold text-slate-700">Styling Options</div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Color Palette</label>
                    <div className="flex gap-1">
                      {[
                        { name: 'Indigo', bg: 'bg-indigo-900', text: 'text-white' },
                        { name: 'Slate', bg: 'bg-slate-900', text: 'text-white' },
                        { name: 'Blue', bg: 'bg-blue-600', text: 'text-white' },
                        { name: 'Amber', bg: 'bg-amber-50', text: 'text-amber-900' },
                        { name: 'Emerald', bg: 'bg-emerald-800', text: 'text-white' }
                      ].map(pal => (
                        <button
                          key={pal.name}
                          onClick={() =>
                            updateComponentStyle(selectedComponent.id, {
                              bgColor: pal.bg,
                              textColor: pal.text
                            })
                          }
                          className={`w-6 h-6 rounded-full border border-slate-300 ${pal.bg}`}
                          title={pal.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => deleteComponent(selectedComponent.id)}
                    className="w-full py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-bold"
                  >
                    Delete Block
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Clean HTML Exporter Modal */}
      {showHtmlExport && currentPage && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-3">
            <h3 className="text-base font-bold text-slate-900">Clean HTML / CSS Export</h3>
            <p className="text-xs text-slate-500">
              Generated static HTML representation ready to be embedded into Google Sites or static hosting:
            </p>
            <pre className="p-3 bg-slate-900 text-emerald-400 text-[11px] rounded-lg overflow-x-auto max-h-60 font-mono">
{`<!-- Master Portal Custom Page: ${currentPage.Title} -->
<div class="custom-page-container max-w-4xl mx-auto py-8">
  ${currentPage.Components.map(c => `<!-- ${c.type} block -->\n  <div class="page-block ${c.type}">${JSON.stringify(c.content)}</div>`).join('\n  ')}
</div>`}
            </pre>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHtmlExport(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Page */}
      {showNewPageModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Create New Custom Portal Page</h3>
            <form onSubmit={handleCreatePage} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Logistics & Travel Handbook"
                  value={newPageData.Title}
                  onChange={e => setNewPageData({ ...newPageData, Title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. travel-handbook-2026"
                  value={newPageData.Slug}
                  onChange={e => setNewPageData({ ...newPageData, Slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={newPageData.Category}
                  onChange={e => setNewPageData({ ...newPageData, Category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="HR & Finance Policy">HR &amp; Finance Policy</option>
                  <option value="Project Documentation">Project Documentation</option>
                  <option value="Event Brief">Event Brief</option>
                  <option value="Operational Manual">Operational Manual</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewPageModal(false)}
                  className="px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                >
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
