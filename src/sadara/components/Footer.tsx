import React from 'react';
import { useApp } from '../context/AppContext';
import { SITE_INFO } from '../data/mockData';
import {
  Atom,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Share2,
} from 'lucide-react';

export const Footer: React.FC<{ onOpenSocialModal?: () => void }> = ({ onOpenSocialModal }) => {
  const { lang, t, setActiveTab, openBookingModal } = useApp();

  const quickLinks = [
    { id: 'courses', label: lang === 'ar' ? 'باقات ودورات التدريب' : 'Courses & Packages' },
    { id: 'reactor', label: lang === 'ar' ? 'محاكي المفاعل النووي' : 'Nuclear Reactor Sim', highlight: true },
    { id: 'teacher', label: lang === 'ar' ? 'صفحة المدرس محمود شلتوت' : 'Eng. Mahmoud Shaltoot' },
    { id: 'student', label: lang === 'ar' ? 'بوابة الطالب والدروس' : 'Student Portal & Lessons' },
    { id: 'booking', label: lang === 'ar' ? 'حجز جلسة' : 'Book a Session' },
    { id: 'admin', label: lang === 'ar' ? 'الإدارة والتحكم' : 'Admin Control' },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#040711] text-slate-800 dark:text-slate-200 transition-colors duration-200">
      {/* Upper Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12">
          {/* Brand Info (Col 5) */}
          <div className="lg:col-span-5 text-start space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#080d1d] rounded-[10px] flex items-center justify-center">
                  <Atom className="size-6 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {lang === 'ar' ? SITE_INFO.nameAr : SITE_INFO.nameEn}
                </span>
                <span className="block text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                  {SITE_INFO.taglineAr}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            {/* Social Links Icons */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href={SITE_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 border border-slate-300/60 dark:border-white/10 flex items-center justify-center transition"
                title="واتساب"
              >
                <Phone className="size-4" />
              </a>

              <a
                href={SITE_INFO.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-cyan-500/20 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-300/60 dark:border-white/10 flex items-center justify-center transition font-bold text-xs"
                title="إكس / Twitter"
              >
                𝕏
              </a>

              <a
                href={SITE_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-xl bg-slate-200/60 dark:bg-white/5 hover:bg-rose-500/20 text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-300/60 dark:border-white/10 flex items-center justify-center transition font-bold text-xs"
                title="يوتيوب"
              >
                ▶
              </a>

              {onOpenSocialModal && (
                <button
                  onClick={onOpenSocialModal}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25 flex items-center gap-1.5 text-xs font-bold transition cursor-pointer"
                  title="مشاركة المنصة"
                >
                  <Share2 className="size-3.5" />
                  <span>{lang === 'ar' ? 'مشاركة وتنزيل البانر' : 'Share & Download Banner'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Navigation Links (Col 3) */}
          <div className="lg:col-span-3 text-start">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-white/10">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      if (link.id === 'booking') {
                        openBookingModal();
                      } else {
                        setActiveTab(link.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Official Contact Info (Col 4) */}
          <div className="lg:col-span-4 text-start">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-200 dark:border-white/10">
              {t.footer.contactUs}
            </h4>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <div>
                <span className="text-slate-500 dark:text-slate-500 block text-xs mb-1">{t.footer.phone}</span>
                <a
                  href={SITE_INFO.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 font-mono font-bold text-base flex items-center gap-2 transition"
                >
                  <Phone className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <bdi dir="ltr" className="inline-block font-mono tracking-wider">
                    +966 59 475 6878
                  </bdi>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-sans font-bold">
                    {lang === 'ar' ? 'واتساب فوري' : 'WhatsApp'}
                  </span>
                </a>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-500 block text-xs mb-1">{t.footer.email}</span>
                <a
                  href={`mailto:${SITE_INFO.email}`}
                  className="text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-2 transition"
                >
                  <Mail className="size-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{SITE_INFO.email}</span>
                </a>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-500 block text-xs mb-1">{t.footer.geo}</span>
                <div className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <MapPin className="size-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{lang === 'ar' ? SITE_INFO.locationAr : SITE_INFO.locationEn}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar — Exact Copyright matching the platform branding */}
      <div className="border-t border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-black/40 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="text-center md:text-start leading-relaxed">
            {lang === 'ar' ? SITE_INFO.copyrightAr : SITE_INFO.copyrightEn}
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 dark:border-cyan-500/40 bg-cyan-500/10 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-mono text-xs shadow-sm font-semibold">
              <span className="size-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Made by Marwan Negm</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
