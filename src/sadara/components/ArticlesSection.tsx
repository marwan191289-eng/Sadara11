import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Clock, Eye, Calendar, BookOpen, Search, ArrowLeft, ArrowRight } from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const { lang, articles } = useApp();
  const ar = lang === 'ar';
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const activeArt = articles.find((a) => a.id === selectedArticle);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 text-start">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
          <BookOpen className="size-4" />
          <span>{ar ? 'مكتبة صدارة التعليمية المفتوحة' : 'Sadara Educational Library'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {ar ? 'مقالات واستراتيجيات التميز في قياس' : 'Articles & Strategies for Qiyas Excellence'}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {ar
            ? 'شروحات معمقة واستراتيجيات الحل السريع للمهندس محمود إسماعيل شلتوت.'
            : 'In-depth articles and fast solution shortcuts by Eng. Mahmoud Shaltoot.'}
        </p>

        {/* Search */}
        <div className="mt-5 relative max-w-md">
          <Search className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ar ? 'ابحث في المقالات والتجميعات...' : 'Search articles...'}
            className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Detail Modal / View */}
      {activeArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1224] p-6 sm:p-8 shadow-2xl my-8 text-start text-slate-900 dark:text-white space-y-4">
            <button
              onClick={() => setSelectedArticle(null)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold cursor-pointer"
            >
              {ar ? '← العودة للمقالات' : '← Back to Articles'}
            </button>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {activeArt.category}
            </span>
            <h3 className="text-2xl font-black">{activeArt.title}</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{activeArt.date}</span>
              <span>{activeArt.readTime}</span>
              <span>{activeArt.views} مشاهدة</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {activeArt.summary}
            </div>
            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line">
              {activeArt.content}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setSelectedArticle(art.id)}
            className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-md hover:shadow-xl hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  {art.category}
                </span>
                <span className="text-slate-400">{art.readTime}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                {art.summary}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-400">{art.date}</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                <span>{ar ? 'قراءة المقال' : 'Read Article'}</span>
                {ar ? <ArrowLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
