import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomPage } from '../../types';
import { Globe, Calendar, User, ArrowLeft, ExternalLink, Sparkles, CheckCircle } from 'lucide-react';

export const CustomPageView: React.FC<{ onOpenBuilder: () => void }> = ({ onOpenBuilder }) => {
  const { customPages } = useApp();
  const publishedPages = customPages.filter(p => p.Status === 'Published');
  const [selectedPageId, setSelectedPageId] = useState<string>(publishedPages[0]?.Page_ID || '');

  const currentPage = publishedPages.find(p => p.Page_ID === selectedPageId) || publishedPages[0];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            <span>Published Master Portal Pages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Internal Guidelines, Departmental Handbooks &amp; Project Documentation (Google Sites Presentation Layer)
          </p>
        </div>

        <button
          onClick={onOpenBuilder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Visual Editor</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-semibold">
        {publishedPages.map(page => (
          <button
            key={page.Page_ID}
            onClick={() => setSelectedPageId(page.Page_ID)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
              currentPage?.Page_ID === page.Page_ID
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>{page.Title}</span>
            <span className="text-[10px] opacity-80">/{page.Slug}</span>
          </button>
        ))}
      </div>

      {/* Rendered Live Page */}
      {currentPage ? (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          
          {/* Page Meta */}
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {currentPage.Category}
              </span>
              <span>Updated: {currentPage.Updated_At}</span>
              <span>By: {currentPage.Created_By}</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Live URL: company-portal.internal/{currentPage.Slug}
            </span>
          </div>

          {/* Components */}
          <div className="space-y-5">
            {currentPage.Components.map(comp => {
              if (comp.type === 'hero') {
                return (
                  <div
                    key={comp.id}
                    className={`rounded-2xl p-8 ${comp.styles?.bgColor || 'bg-slate-900'} ${
                      comp.styles?.textColor || 'text-white'
                    }`}
                  >
                    {comp.content.badge && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/20 mb-3">
                        {comp.content.badge}
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-black">{comp.content.title}</h2>
                    <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                      {comp.content.subtitle}
                    </p>
                  </div>
                );
              }

              if (comp.type === 'heading') {
                return (
                  <h2 key={comp.id} className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {comp.content.text}
                  </h2>
                );
              }

              if (comp.type === 'text') {
                return (
                  <p key={comp.id} className="text-sm text-slate-700 leading-relaxed">
                    {comp.content.text}
                  </p>
                );
              }

              if (comp.type === 'notice') {
                return (
                  <div
                    key={comp.id}
                    className={`p-5 rounded-xl border ${comp.styles?.bgColor || 'bg-amber-50'} ${
                      comp.styles?.borderColor || 'border-amber-200'
                    } ${comp.styles?.textColor || 'text-amber-900'}`}
                  >
                    <div className="font-bold text-sm">{comp.content.title}</div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed opacity-90">
                      {comp.content.body}
                    </p>
                  </div>
                );
              }

              if (comp.type === 'card_grid') {
                return (
                  <div key={comp.id} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {comp.content.cards?.map((card: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                          {card.tag}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-2">{card.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-normal">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                );
              }

              if (comp.type === 'button') {
                return (
                  <div key={comp.id} className="pt-2">
                    <button
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs ${
                        comp.styles?.bgColor || 'bg-blue-600'
                      } ${comp.styles?.textColor || 'text-white'}`}
                    >
                      {comp.content.label}
                    </button>
                  </div>
                );
              }

              if (comp.type === 'divider') {
                return <hr key={comp.id} className="border-slate-200 my-4" />;
              }

              return null;
            })}
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          No published custom pages available yet.
        </div>
      )}

    </div>
  );
};
