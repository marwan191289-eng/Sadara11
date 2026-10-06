import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  TrendingUp,
  Award,
  Plus,
  MessageSquare,
} from 'lucide-react';

export const TestimonialSlider: React.FC = () => {
  const { lang, t, ratings, openRatingModal } = useApp();
  const ar = lang === 'ar';

  // Only show APPROVED ratings as strictly requested by the user
  const approvedRatings = ratings.filter((r) => r.status === 'approved');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused || approvedRatings.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % approvedRatings.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, approvedRatings.length]);

  const handlePrev = () => {
    if (approvedRatings.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + approvedRatings.length) % approvedRatings.length);
  };

  const handleNext = () => {
    if (approvedRatings.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % approvedRatings.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        ar ? handlePrev() : handleNext();
      } else {
        ar ? handleNext() : handlePrev();
      }
    }
    touchStartX.current = null;
  };

  const current = approvedRatings[currentIndex] || approvedRatings[0];

  return (
    <section
      className="py-16 sm:py-20 bg-slate-50 dark:bg-[#070b18] border-b border-slate-200 dark:border-white/10 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-3">
            <Award className="size-3.5" />
            <span>+12,480 طالب وطالبة في السعودية والخليج العربي</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.testimonials.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.testimonials.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        {approvedRatings.length > 0 && current && (
          <div
            className="relative max-w-4xl mx-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0e152a] p-6 sm:p-10 shadow-2xl relative transition-all duration-500 text-start">
              <Quote className="size-12 text-cyan-500/20 absolute top-6 ltr:right-8 rtl:left-8 pointer-events-none" />

              <div className="grid md:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Student Avatar & Rating */}
                <div className="md:col-span-4 flex flex-col items-center text-center p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                  <div className="size-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 mb-3 shadow-md">
                    <div className="w-full h-full bg-[#0c1328] rounded-[14px] flex items-center justify-center font-bold text-cyan-400 text-xl">
                      {current.studentName.slice(0, 2)}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {current.studentName}
                  </h3>
                  <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {current.sessionTitle}
                  </span>

                  <div className="mt-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < current.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="mt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                    معتمد رسمياً من المدرس ✓
                  </span>
                </div>

                {/* Quote Content */}
                <div className="md:col-span-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                        {current.date}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-500">
                        تجربة تدريبية حقيقية 1447
                      </span>
                    </div>

                    <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed italic">
                      "{current.comment}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>وضوح الشرح: {current.clarity || 5}/5</span>
                    <span>إدارة الوقت: {current.timeManagement || 5}/5</span>
                    <span>حل المسائل: {current.problemSolving || 5}/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="size-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronRight className="size-5 rtl:rotate-0 ltr:rotate-180" />
              </button>

              <div className="flex items-center gap-1.5">
                {approvedRatings.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-300 dark:bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="size-11 rounded-2xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-white flex items-center justify-center transition cursor-pointer shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronLeft className="size-5 rtl:rotate-0 ltr:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* Add Review Action */}
        <div className="mt-10 text-center">
          <button
            onClick={openRatingModal}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs sm:text-sm cursor-pointer transition shadow-sm"
          >
            <Plus className="size-4" />
            <span>{ar ? 'أضف تقييمك ورأيك في الجلسات (يُنشر بعد اعتماد المدرس)' : 'Submit Your Review'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
