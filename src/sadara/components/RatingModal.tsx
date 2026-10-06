import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose }) => {
  const { lang, addRating, addNotification, user, isLoggedIn, openAuthModal } = useApp();
  const ar = lang === 'ar';

  const [studentName, setStudentName] = useState(user.name || '');
  const [sessionTitle, setSessionTitle] = useState('شرح القدرات والتحصيلي والكيمياء النووية');
  const [rating, setRating] = useState(5);
  const [clarity, setClarity] = useState(5);
  const [timeManagement, setTimeManagement] = useState(5);
  const [problemSolving, setProblemSolving] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    addRating({
      studentName: studentName || user.name || 'طالب من صدارة',
      sessionTitle,
      rating,
      clarity,
      timeManagement,
      problemSolving,
      comment,
    });

    setIsSubmitted(true);
    confetti({ particleCount: 40, spread: 60 });
    addNotification(
      ar ? 'تم إرسال تقييمك بنجاح' : 'Review submitted successfully',
      ar ? 'سيتم مراجعة تقييمك واعتماده من المدرس قبل ظهوره علناً على المنصة.' : 'Your review will be displayed after teacher approval.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1328] shadow-2xl p-6 sm:p-8 text-start my-8 text-slate-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
            <Star className="size-3.5 fill-amber-400" />
            <span>{ar ? 'تقييم تجربة التعلم مع م. محمود شلتوت' : 'Rate Your Learning Experience'}</span>
          </div>
          <h3 className="text-xl font-black">
            {isSubmitted ? (ar ? 'شكراً لتقييمك الصادق!' : 'Thank you for your review!') : (ar ? 'أضف تقييمك ورأيك في الجلسات' : 'Submit Your Rating')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {ar
              ? 'ملاحظة: لضمان مصداقية التقييمات، تُعرض الآراء على التطبيق بعد مراجعة واعتماد المدرس.'
              : 'Note: Reviews appear publicly after teacher approval in the dashboard.'}
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-9" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {ar
                ? 'تم استلام تقييمك وحفظه بنجاح! سيقوم المهندس محمود شلتوت باعتماده في لوحة الإدارة ليظهر في شريط آراء الطلاب.'
                : 'Your review was received! The instructor will approve it shortly.'}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              {ar ? 'إغلاق' : 'Close'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {ar ? 'اسمك الكريم:' : 'Your Name:'}
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="مثال: فيصل الغامدي"
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {ar ? 'موضوع أو عنوان الجلسة / الدورة:' : 'Session / Course Topic:'}
              </label>
              <input
                type="text"
                required
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {ar ? 'التقييم العام (من 1 إلى 5 نجوم):' : 'Overall Rating:'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 cursor-pointer transition transform hover:scale-110"
                  >
                    <Star
                      className={`size-7 ${
                        s <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-500 ms-2">{rating}/5 نجوم</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {ar ? 'رأيك وتجربتك بالتفصيل:' : 'Your Feedback / Comment:'}
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={ar ? 'اكتب تجربتك مع المهندس محمود شلتوت وأثر الشرح على فهمك للقدرات والتحصيلي...' : 'Write your detailed review...'}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
              {ar
                ? '⏳ سيتم إرسال هذا التقييم إلى لوحة تحكم المدرس للمراجعة والاعتماد قبل عرضه في الواجهة العامة.'
                : '⏳ This review will go to the teacher dashboard for approval before appearing publicly.'}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Send className="size-4" />
              <span>{ar ? 'إرسال التقييم للمراجعة والاعتماد' : 'Submit Review'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
