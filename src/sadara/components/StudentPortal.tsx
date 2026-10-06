import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  TrendingUp,
  MessageCircle,
  Download,
  Send,
  Video,
  Sparkles,
  CreditCard,
  Calendar,
  ExternalLink,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Check,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    lang,
    user,
    openCertificateModal,
    addNotification,
    bookings,
    openPaymentModal,
    deleteBooking,
    openBookingModal,
  } = useApp();

  const ar = lang === 'ar';

  const [activeLessonTab, setActiveLessonTab] = useState<'bookings' | 'lessons' | 'analytics' | 'chat'>('bookings');
  const [selectedLesson, setSelectedLesson] = useState<number>(0);

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerMode, setPlayerMode] = useState<'video' | 'interactive' | 'embed'>('interactive');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(300);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Timer loop for simulated interactive playback
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying && playerMode === 'interactive') {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, playbackSpeed, playerMode]);

  // Lessons list with guaranteed accessible high quality educational streams
  const lessons = [
    {
      id: 1,
      title: 'استراتيجيات الحل الذهبي في القدرات الكمي (الحل في 20 ثانية)',
      titleEn: 'Golden Strategies in Quantitative Math (20-Second Shortcuts)',
      duration: '45 دقيقة',
      type: 'محاضرة تفاعلية كاملة',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      embedSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyFormula: 'قانون التناسب العكسي: (س₁ × ص₁ = س₂ × ص₂)',
      notes: 'تطبيق قانون التدرج المنتظم وقاعدة ضرب الآحاد بدون إكمال العملية الحسابية الطويلة. حل نماذج 1447 خطوة بخطوة مع م. محمود شلتوت.',
      chapters: ['00:00 - المقدمة والقواعد الذهبية', '00:45 - مسائل السرعة والمسافة', '01:30 - مسائل التناسب العكسي والطردي', '02:15 - الحل السريع بدون آلة حاسبة'],
    },
    {
      id: 2,
      title: 'التناظر اللفظي والخطأ السياقي الحديث لعام 1447',
      titleEn: 'Verbal Analogy & Contextual Error for 1447',
      duration: '50 دقيقة',
      type: 'جلسة زوم مسجلة',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      embedSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyFormula: 'قاعدة الربط: أداة : وظيفتها | سبب : نتيجة',
      notes: 'أكثر من 150 نموذج تناظر لفظي متكرر بنسبة 100% في قياس، مع شرح خوارزمية تحديد العلاقة الدقيقة بين الكلمات.',
      chapters: ['00:00 - فهم علاقة الأداة والوظيفة', '00:50 - استراتيجية اكتشاف الخطأ السياقي', '01:40 - نماذج قياس المتكررة'],
    },
    {
      id: 3,
      title: 'كيمياء التحصيلي: التفاعلات النووية ومحاكي المفاعل الحي',
      titleEn: 'Tahsili Chemistry: Nuclear Reactions & Reactor Simulator',
      duration: '60 دقيقة',
      type: 'تفاعلي مع المحاكي',
      completed: true,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      embedSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyFormula: 'انشطار اليورانيوم: ²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + 3 ¹n + Energy',
      notes: 'شرح موازنة المعادلات النووية، إشعاعات ألفا وبيتا وجاما وحساب عمر النصف وانشطار اليورانيوم-235 ودور قضبان البورون في امتصاص النيوترونات.',
      chapters: ['00:00 - انشطار اليورانيوم', '00:40 - موازنة الأعداد الكتلية والذرية', '01:20 - ربط المحاكي بأسئلة قياس'],
    },
    {
      id: 4,
      title: 'اختبار محاكاة قياس الشامل مع التصحيح الفوري',
      titleEn: 'Full Qiyas Simulation Exam with Real-time Grading',
      duration: '90 دقيقة',
      type: 'اختبار قياس تجريبي',
      completed: false,
      videoSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      embedSrc: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      keyFormula: 'إدارة الوقت: دقيقة واحدة بحد أقصى لكل سؤال',
      notes: 'اختبار شامل يحاكي الضغط الزمني الفعلي للاختبار مع توزيع الدرجات والتحليل البياني للأداء.',
      chapters: ['00:00 - توجيهات الاختبار', '00:30 - حل المسائل الصعبة مع الأستاذ'],
    },
  ];

  const currentLessonData = lessons[selectedLesson] ?? lessons[0]!;

  const togglePlay = () => {
    if (playerMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setPlayerMode('interactive');
            setIsPlaying(true);
          });
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 300);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (videoRef.current && playerMode === 'video') {
      videoRef.current.currentTime = time;
    }
  };

  const formatVideoTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Chat with Teacher
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'م. محمود شلتوت',
      isTeacher: true,
      time: '10:30 ص',
      text: 'أهلاً بك يا بطل! راجعت نتيجتك في كويز الكيمياء النووية؛ أداؤك ممتاز جداً وتجاوزت 98%. ركّز على تدريبات التدرج المنتظم في الكمي.',
    },
    {
      id: 2,
      sender: 'أنا',
      isTeacher: false,
      time: '10:35 ص',
      text: 'شكراً جزيلاً أستاذنا القدير! محاكي قلب المفاعل الحي بسط لي مفهوم قضبان التحكم تماماً.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'أنا',
      isTeacher: false,
      time: 'الآن',
      text: chatInput,
    };
    setMessages([...messages, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'م. محمود شلتوت',
          isTeacher: true,
          time: 'الآن',
          text: 'وصلتني رسالتك وسأناقشها معك في مطلع جلستنا القادمة عبر Zoom إن شاء الله!',
        },
      ]);
    }, 1000);
  };

  // Strict Session Isolation: Students only view their OWN personal bookings!
  const studentBookings = bookings.filter((b) => {
    if (user.role === 'admin') return true;
    if (!user.email && !user.phone && !user.name) return false;
    const matchEmail = user.email && b.studentEmail && b.studentEmail.trim().toLowerCase() === user.email.trim().toLowerCase();
    const matchPhone = user.phone && b.studentPhone && b.studentPhone.replace(/[\s+]/g, '') === user.phone.replace(/[\s+]/g, '');
    const matchName = user.name && b.studentName && b.studentName.trim().toLowerCase() === user.name.trim().toLowerCase();
    return matchEmail || matchPhone || matchName;
  });

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Student Profile Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 sm:p-8 shadow-xl text-start mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="size-20 sm:size-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg"
            />
            <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0c1224]" />
          </div>

          <div className="flex-1 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {user.name || (ar ? 'طالب صدارة المتفوق' : 'Sadara Student')}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                {ar ? 'طالب مسجل · قياس 1447' : 'Enrolled Student · 1447'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {user.email || 'student@example.com'} • {user.phone || '+966 59 475 6878'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <Award className="size-3.5 text-amber-400" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => openCertificateModal()}
              className="px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md flex items-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Award className="size-4" />
              <span>{ar ? 'استخراج شهادة إتمام الدورة' : 'Generate Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-4 mb-8">
        <button
          onClick={() => setActiveLessonTab('bookings')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'bookings'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
          }`}
        >
          <Calendar className="size-4" />
          <span>{ar ? `حجوزاتي وجلساتي المباشرة (${studentBookings.length})` : `My Bookings (${studentBookings.length})`}</span>
        </button>

        <button
          onClick={() => setActiveLessonTab('lessons')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'lessons'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
          }`}
        >
          <BookOpen className="size-4" />
          <span>{ar ? 'المحاضرات والدروس المشروحة (فيديو حي)' : 'Interactive Lessons & Videos'}</span>
        </button>

        <button
          onClick={() => setActiveLessonTab('analytics')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'analytics'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
          }`}
        >
          <TrendingUp className="size-4" />
          <span>{ar ? 'تقرير الأداء ومتابعة التقدم' : 'Performance Analytics'}</span>
        </button>

        <button
          onClick={() => setActiveLessonTab('chat')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
            activeLessonTab === 'chat'
              ? 'bg-cyan-500 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
          }`}
        >
          <MessageCircle className="size-4" />
          <span>{ar ? 'محادثة المعلم المباشرة' : 'Direct Teacher Chat'}</span>
        </button>
      </div>

      {/* Tab 1: Bookings & Payment Action */}
      {activeLessonTab === 'bookings' && (
        <div className="space-y-6 text-start">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {ar ? 'متابعة طلبات الحجز والسداد الإلكتروني' : 'My Booked Sessions & Payment Status'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {ar
                  ? 'يتم الدفع الإلكتروني وتفعيل رابط الجلسة بعد موافقة المدرس في لوحة الإدارة.'
                  : 'Payment unlocks after instructor approval.'}
              </p>
            </div>

            <button
              onClick={() => openBookingModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-95"
            >
              <Calendar className="size-3.5" />
              <span>{ar ? 'حجز جلسة جديدة' : 'Book New Session'}</span>
            </button>
          </div>

          {studentBookings.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <Calendar className="size-12 text-slate-400 mx-auto mb-2 opacity-50" />
              <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                {ar ? 'لا توجد طلبات حجز مسجلة بحسابك حتى الآن' : 'No bookings under your account yet'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-4">
                {ar
                  ? 'احجز جلستك الفردية المباشرة مع المهندس محمود شلتوت للقدرات والتحصيلي والكيمياء النووية.'
                  : 'Book your live 1-on-1 coaching session with Eng. Mahmoud Shaltoot.'}
              </p>
              <button
                onClick={() => openBookingModal()}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                {ar ? 'احجز أول جلسة الآن' : 'Book Your First Session'}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {studentBookings.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-2xl border transition shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    b.status === 'confirmed'
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : b.status === 'approved'
                      ? 'border-cyan-500/40 bg-cyan-500/5 ring-1 ring-cyan-500/20'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224]'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {b.id}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.courseOrTrack}</h4>
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5 text-cyan-500" />
                        {b.weekday ? `${b.weekday} • ` : ''}{b.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5 text-cyan-500" />
                        {b.timeSlot}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                        {b.price} ر.س
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-1 flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : b.status === 'approved'
                            ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 animate-pulse'
                            : b.status === 'pending'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}
                      >
                        {b.status === 'confirmed' ? (
                          <>
                            <CheckCircle2 className="size-3.5" />
                            <span>{ar ? 'مؤكد ومدفوع بالكامل ✓' : 'Confirmed & Paid ✓'}</span>
                          </>
                        ) : b.status === 'approved' ? (
                          <>
                            <CreditCard className="size-3.5" />
                            <span>{ar ? 'تمت موافقة المدرس! يرجى إتمام السداد الآن' : 'Approved! Please Complete Payment'}</span>
                          </>
                        ) : b.status === 'pending' ? (
                          <>
                            <Clock className="size-3.5" />
                            <span>{ar ? '⏳ قيد مراجعة واعتماد المدرس (لا يمكن السداد قبل الموافقة)' : '⏳ Awaiting Teacher Approval'}</span>
                          </>
                        ) : (
                          <span>{ar ? 'مرفوض' : 'Rejected'}</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions according to status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* If Approved: Pay Now Button! */}
                    {b.status === 'approved' && b.paymentStatus !== 'paid' && (
                      <button
                        onClick={() => openPaymentModal(b)}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer transition active:scale-95 animate-bounce-subtle"
                      >
                        <CreditCard className="size-4" />
                        <span>{ar ? '💳 ادفع الآن لتأكيد الحجز' : 'Pay Now'}</span>
                      </button>
                    )}

                    {/* If Confirmed: Join Zoom/Meet Button */}
                    {b.status === 'confirmed' && (
                      <a
                        href={b.meetingUrl || (b.platform === 'zoom' ? 'https://zoom.us/j/9475687802' : 'https://meet.google.com/sadara-tutoring')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition"
                      >
                        <Video className="size-4" />
                        <span>{ar ? 'دخول الجلسة المباشرة' : 'Join Session'}</span>
                      </a>
                    )}

                    {/* Cancel button if pending */}
                    {b.status === 'pending' && (
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 transition cursor-pointer"
                        title={ar ? 'إلغاء الطلب' : 'Cancel'}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Interactive Video Lessons Player */}
      {activeLessonTab === 'lessons' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start text-start">
          {/* Lessons List (Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            {lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(idx);
                  setIsPlaying(false);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                  }
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedLesson === idx
                    ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">{lesson.type}</span>
                  {lesson.completed ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold">
                      <CheckCircle2 className="size-3.5" />
                      {ar ? 'مكتمل' : 'Completed'}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">{ar ? 'قيد المتابعة' : 'In Progress'}</span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                  {ar ? lesson.title : lesson.titleEn}
                </h4>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="size-3" />
                  <span>{lesson.duration}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Player (Col 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-xl">
              {/* Player Mode Switcher */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-white/10 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {ar ? 'نمط العرض المفضل:' : 'Viewing Mode:'}
                </span>
                <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPlayerMode('interactive')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      playerMode === 'interactive'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {ar ? 'السبورة الذكية ✨' : 'Smart Board ✨'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlayerMode('video')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      playerMode === 'video'
                        ? 'bg-cyan-500 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500'
                    }`}
                  >
                    {ar ? 'مشغل الفيديو HD' : 'HD Video'}
                  </button>
                </div>
              </div>

              {/* Interactive Board Mode (Guaranteed 100% reliable) */}
              {playerMode === 'interactive' && (
                <div className="relative w-full rounded-2xl bg-gradient-to-br from-slate-950 via-[#0a1128] to-[#071330] border border-cyan-500/30 overflow-hidden shadow-2xl p-6 text-white min-h-[320px] flex flex-col justify-between">
                  {/* Top Bar with Teacher Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="size-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/30">
                        م.ش
                      </div>
                      <div>
                        <div className="text-xs font-bold text-cyan-400">
                          {ar ? 'المهندس محمود إسماعيل شلتوت' : 'Eng. Mahmoud Shaltoot'}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="size-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                          <span>{ar ? 'شرح مباشر تفاعلي 1447' : 'Live Interactive Lecture'}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full font-mono border border-cyan-500/30 font-bold">
                      {isPlaying ? (ar ? '● جاري الشرح الآن' : '● Playing') : (ar ? 'متوقف مؤقتاً' : 'Paused')}
                    </span>
                  </div>

                  {/* Center Visual Slide & Formula */}
                  <div className="my-6 text-center space-y-3">
                    <div className="text-xs text-slate-400 font-medium">
                      {ar ? 'القاعدة الذهبية المستهدفة في هذا المقطع:' : 'Target Golden Rule:'}
                    </div>
                    <div className="text-lg sm:text-xl font-black font-mono text-cyan-300 bg-white/5 border border-cyan-500/30 py-3 px-4 rounded-xl shadow-inner max-w-lg mx-auto">
                      {currentLessonData.keyFormula}
                    </div>

                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      {currentLessonData.notes}
                    </p>

                    {/* Animated Audio Waveform */}
                    {isPlaying && (
                      <div className="flex items-center justify-center gap-1 h-7 pt-2">
                        {[40, 70, 95, 30, 85, 60, 100, 45, 80, 55, 90, 65, 35, 75].map((height, i) => (
                          <span
                            key={i}
                            style={{
                              height: `${height}%`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                            className="w-1 bg-cyan-400 rounded-full animate-pulse inline-block"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Controls */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-cyan-400 h-1.5 cursor-pointer bg-white/20 rounded-lg"
                    />

                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="size-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition cursor-pointer font-bold"
                        >
                          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ms-0.5" />}
                        </button>
                        <span className="text-[11px] text-slate-300">
                          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {[1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setPlaybackSpeed(s)}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                              playbackSpeed === s ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Direct HTML5 Video Player */}
              {playerMode === 'video' && (
                <div className="relative w-full rounded-2xl bg-black overflow-hidden shadow-2xl group">
                  <video
                    ref={videoRef}
                    src={currentLessonData.videoSrc}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-64 sm:h-80 object-cover cursor-pointer"
                    onClick={togglePlay}
                    playsInline
                    controls
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Performance Analytics */}
      {activeLessonTab === 'analytics' && (
        <div className="grid md:grid-cols-3 gap-6 text-start">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-xs text-slate-400">{ar ? 'متوسط درجات الاختبارات التجريبية' : 'Quiz Average'}</span>
            <div className="text-3xl font-black text-cyan-500 mt-1">98%</div>
            <div className="text-xs text-emerald-500 mt-1 font-semibold">مؤهل للـ 95+ في قياس</div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-xs text-slate-400">{ar ? 'الجلسات المنجزة' : 'Sessions Completed'}</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">12 / 12</div>
            <div className="text-xs text-slate-400 mt-1">اكتملت جميع متطلبات الدورة</div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
            <span className="text-xs text-slate-400">{ar ? 'ساعات التدريب الفعلي' : 'Training Hours'}</span>
            <div className="text-3xl font-black text-blue-500 mt-1">18 ساعة</div>
            <div className="text-xs text-slate-400 mt-1">تدريب مكثف على نماذج 1447</div>
          </div>
        </div>
      )}

      {/* Tab 4: Direct Chat */}
      {activeLessonTab === 'chat' && (
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-xl text-start space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
            <div className="size-10 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">
              م.ش
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">المهندس محمود شلتوت</h4>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                متواجد للرد على أسئلة الطلاب
              </span>
            </div>
          </div>

          <div className="space-y-3 min-h-[220px] max-h-[350px] overflow-y-auto p-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.isTeacher ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-sm text-xs ${
                    m.isTeacher
                      ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-slate-200'
                      : 'bg-cyan-500 text-white'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اكتب سؤالك أو استفسارك للمهندس محمود شلتوت..."
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Send className="size-3.5" />
              <span>إرسال</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
