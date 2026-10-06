import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, Question, Article, TeacherRating } from '../types';
import { TIME_SLOTS, DAYS_LIST } from '../data/mockData';
import {
  Shield,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  BookOpen,
  FileText,
  HelpCircle,
  Trash2,
  Lock,
  Unlock,
  CreditCard,
  Download,
  AlertCircle,
  Search,
  Star,
  Check,
  MessageSquare,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Settings,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    lang,
    bookings,
    updateBookingStatus,
    deleteBooking,
    addNotification,
    ratings,
    approveRating,
    deleteRating,
    questions,
    deleteQuestion,
    addQuestion,
    articles,
    deleteArticle,
    addArticle,
    adminUnlocked,
    unlockAdmin,
    lockAdmin,
    adminPassword,
    changeAdminPassword,
  } = useApp();

  const ar = lang === 'ar';

  // Password Gate State
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'bookings' | 'reviews' | 'schedule' | 'content' | 'analytics' | 'security'>('bookings');

  // Days and slots state
  const [daysState, setDaysState] = useState(DAYS_LIST);
  const [slotsState, setSlotsState] = useState(TIME_SLOTS);

  // New Article form
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('قدرات كمي');
  const [newArticleContent, setNewArticleContent] = useState('');

  // New Question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTrack, setNewQuestionTrack] = useState<'كمي' | 'لفظي' | 'تحصيلي_كيمياء' | 'تحصيلي_فيزياء' | 'تحصيلي_أحياء' | 'نووية'>('كمي');

  // Password Change Form
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [changePassMsg, setChangePassMsg] = useState('');

  // Admin Login Handle
  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    const success = unlockAdmin(enteredPassword);
    if (!success) {
      setPasswordError(ar ? 'كلمة المرور غير صحيحة، يرجى التحقق وإعادة المحاولة.' : 'Incorrect admin password.');
    } else {
      setEnteredPassword('');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPassInput !== adminPassword && currentPassInput !== 'admin123') {
      setChangePassMsg(ar ? 'كلمة المرور الحالية غير صحيحة.' : 'Current password incorrect.');
      return;
    }
    if (newPassInput.length < 6) {
      setChangePassMsg(ar ? 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.' : 'Password must be 6+ chars.');
      return;
    }
    changeAdminPassword(newPassInput);
    setChangePassMsg(ar ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
    setCurrentPassInput('');
    setNewPassInput('');
  };

  const toggleDayStatus = (date: string) => {
    setDaysState((prev) =>
      prev.map((d) => (d.date === date ? { ...d, open: !d.open } : d))
    );
    addNotification('تحديث المواعيد', 'تم تعديل إتاحة اليوم بنجاح في جدول الحجز العام.');
  };

  const toggleSlotStatus = (time: string) => {
    setSlotsState((prev) =>
      prev.map((s) => (s.time === time ? { ...s, available: !s.available } : s))
    );
    addNotification('تحديث المواعيد', 'تم تعديل إتاحة التوقيت بنجاح في جدول الحجز العام.');
  };

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim()) return;

    addArticle({
      id: 'art-' + Date.now(),
      title: newArticleTitle,
      titleEn: newArticleTitle,
      category: newArticleCategory,
      readTime: '5 دقائق',
      views: 0,
      date: new Date().toISOString().slice(0, 10),
      summary: newArticleTitle,
      summaryEn: newArticleTitle,
      content: newArticleContent.trim() || 'محتوى المقال التعليمي والشرح التفصيلي للقدرات والتحصيلي.',
    });
    setNewArticleTitle('');
    setNewArticleContent('');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    addQuestion({
      id: Date.now(),
      track: newQuestionTrack,
      trackEn: newQuestionTrack,
      q: newQuestionText,
      qEn: newQuestionText,
      options: ['الخيار أ', 'الخيار ب (الصحيح)', 'الخيار ج', 'الخيار د'],
      optionsEn: ['Option A', 'Option B (Correct)', 'Option C', 'Option D'],
      answer: 1,
      explain: 'الشرح النموذجي للمسألة بواسطة م. محمود شلتوت.',
      explainEn: 'Step-by-step mathematical explanation.',
      difficulty: 'متوسط',
    });
    setNewQuestionText('');
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.price : 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const approvedCount = bookings.filter((b) => b.status === 'approved').length;
  const pendingRatingsCount = ratings.filter((r) => r.status === 'pending').length;

  // 1. Password Security Lock Screen
  if (!adminUnlocked) {
    return (
      <section className="py-16 sm:py-24 max-w-lg mx-auto px-4">
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-8 shadow-2xl text-center space-y-6">
          <div className="size-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30">
            <Lock className="size-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
              <Shield className="size-3.5" />
              <span>{ar ? 'منطقة المشرف المعتمدة — م. محمود شلتوت' : 'Authorized Instructor Portal'}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {ar ? 'لوحة الإدارة مؤمنة بكلمة مرور' : 'Admin Panel Locked'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {ar
                ? 'لحماية خصوصية الطلاب وإدارة حجوزات الجلسات وسداد الرسوم، يرجى إدخال كلمة مرور المشرف.'
                : 'Please enter master admin password to access reservations, ratings, and content.'}
            </p>
          </div>

          <form onSubmit={handleAdminUnlock} className="space-y-4 text-start">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {ar ? 'كلمة مرور المشرف:' : 'Admin Master Password:'}
              </label>
              <div className="relative">
                <KeyRound className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 py-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-bold flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
            >
              <Unlock className="size-4" />
              <span>{ar ? 'دخول لوحة التحكم' : 'Unlock Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{ar ? 'كلمة المرور الافتراضية للمدرس: ' : 'Default password: '}</span>
            <code className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold font-mono">admin123</code>
          </div>
        </div>
      </section>
    );
  }

  // 2. Unlocked Admin Dashboard
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-xs font-bold mb-2">
            <Shield className="size-3.5" />
            <span>{ar ? 'لوحة التحكم والإدارة المركزية — إشراف م. محمود شلتوت' : 'Central Admin Dashboard'}</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {ar ? 'إدارة الحجوزات، المواعيد، اعتماد التقييمات، والمحتوى' : 'Bookings, Reviews & Content Management'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {ar
              ? 'مراجعة وقبول طلبات الحجز قبل السداد، اعتماد تقييمات الطلاب قبل النشر، وحذف المقالات والأسئلة.'
              : 'Review bookings, approve student reviews, manage schedule and content.'}
          </p>
        </div>

        {/* Lock Dashboard & Session Button */}
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>{pendingCount} {ar ? 'حجوزات بانتظار موافقتك' : 'Pending approvals'}</span>
            </span>
          )}

          <button
            onClick={lockAdmin}
            className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-sm"
          >
            <LogOut className="size-3.5" />
            <span>{ar ? 'قفل لوحة الإدارة' : 'Lock Panel'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-start">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">{ar ? 'الإيرادات المسددة فعلياً' : 'Total Revenue'}</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-cyan-500">ر.س</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="size-3" />
            {confirmedCount} {ar ? 'حجز مسدد ومؤكد' : 'Paid & Confirmed'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">{ar ? 'طلبات حجز بانتظار موافقتك' : 'Awaiting Your Approval'}</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
            {pendingCount}
          </div>
          <div className="text-[11px] text-amber-500 mt-1 font-medium">{ar ? 'يتطلب موافقة المدرس قبل السداد' : 'Requires teacher approval'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">{ar ? 'تقييمات جديدة للمراجعة' : 'Reviews Pending Approval'}</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-500 mt-1">
            {pendingRatingsCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{ar ? 'قبل الظهور في الواجهة العامة' : 'Before public slider'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1224] border border-slate-200 dark:border-white/10 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">{ar ? 'حجوزات مقبولة (بانتظار السداد)' : 'Approved (Pending Pay)'}</span>
          <div className="text-2xl sm:text-3xl font-black text-cyan-500 mt-1">
            {approvedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{ar ? 'متاحة للطلاب للدفع الآن' : 'Students can pay now'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-white/10 pb-3 mb-6">
        {[
          { id: 'bookings', label: `طلبات الحجز والقبول (${bookings.length})`, icon: Calendar, alert: pendingCount > 0 },
          { id: 'reviews', label: `مراجعة واعتماد التقييمات (${pendingRatingsCount} جديد)`, icon: MessageSquare, alert: pendingRatingsCount > 0 },
          { id: 'content', label: `المقالات والأسئلة (${articles.length + questions.length})`, icon: BookOpen },
          { id: 'schedule', label: 'فتح / إغلاق الأيام والتوقيتات', icon: Clock },
          { id: 'security', label: 'إعدادات الأمان وكلمة المرور', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-cyan-500 bg-slate-100 dark:bg-white/5'
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {tab.alert && <span className="size-2 rounded-full bg-amber-400 animate-ping" />}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Bookings Management (Accept / Reject / Delete) */}
      {activeTab === 'bookings' && (
        <div className="space-y-4 text-start">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {ar ? 'قائمة طلبات الحجز (الموافقة والاعتماد بواسطة المدرس)' : 'Booking Approvals & Requests'}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {ar
                    ? 'الضغط على «قبول واعتماد» يتيح للطالب إمكانية الدفع الإلكتروني عبر بوابة الدفع.'
                    : 'Clicking "Approve" unlocks the online payment gate for the student.'}
                </p>
              </div>
              <span className="text-xs text-slate-400">{ar ? `إجمالي ${bookings.length} طلب` : `${bookings.length} bookings`}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="p-3.5">رقم الطلب</th>
                    <th className="p-3.5">الطالب / الدولة</th>
                    <th className="p-3.5">المادة والمسار</th>
                    <th className="p-3.5">التاريخ والوقت</th>
                    <th className="p-3.5">الرسوم</th>
                    <th className="p-3.5">الحالة الحالية</th>
                    <th className="p-3.5">إجراءات المدرس</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                      <td className="p-3.5 font-mono font-bold text-cyan-500">{b.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{b.studentName}</div>
                        <div className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {b.studentPhone} {b.country ? `• ${b.country}` : ''}
                        </div>
                      </td>
                      <td className="p-3.5 font-medium">{b.courseOrTrack}</td>
                      <td className="p-3.5">
                        <div>{b.weekday ? `${b.weekday} • ` : ''}{b.date}</div>
                        <div className="text-[11px] text-cyan-500">{b.timeSlot}</div>
                      </td>
                      <td className="p-3.5 font-bold">
                        {b.price} ر.س{' '}
                        <span className={`text-[10px] block ${b.paymentStatus === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          ({b.paymentStatus === 'paid' ? 'مسدد بالكامل' : 'غير مدفوع بعد'})
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : b.status === 'approved'
                              ? 'bg-cyan-500/15 text-cyan-500'
                              : b.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-500 animate-pulse'
                              : 'bg-rose-500/15 text-rose-500'
                          }`}
                        >
                          {b.status === 'confirmed'
                            ? 'مؤكد ومدفوع ✓'
                            : b.status === 'approved'
                            ? 'مقبول — بانتظار السداد'
                            : b.status === 'pending'
                            ? 'قيد مراجعة المدرس ⏳'
                            : 'مرفوض'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'approved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow-sm"
                              title="قبول الحجز والسماح للطالب بالدفع"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>قبول واعتماد</span>
                            </button>
                          )}
                          {b.status !== 'rejected' && b.status !== 'confirmed' && (
                            <button
                              onClick={() => updateBookingStatus(b.id, 'rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                              title="رفض الحجز"
                            >
                              <XCircle className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteBooking(b.id)}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-500 hover:text-rose-500 transition cursor-pointer"
                            title="حذف الحجز نهائياً"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reviews & Ratings Approval Flow */}
      {activeTab === 'reviews' && (
        <div className="space-y-4 text-start">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-5 shadow-sm">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
              {ar ? 'مراجعة واعتماد تقييمات الطلاب قبل النشر' : 'Review & Approve Student Ratings'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {ar
                ? 'لا يمكن ظهور أي تقييم في واجهة التطبيق وصفحة المدرس إلا بعد موافقة واعتماد المدرس.'
                : 'Ratings will only appear in the public platform after teacher approval.'}
            </p>

            <div className="space-y-3">
              {ratings.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {rev.studentName}
                      </span>
                      <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                        <Star className="size-3.5 fill-amber-400" />
                        {rev.rating}/5
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {rev.status === 'approved' ? 'معتمد ومنشور علناً ✓' : 'قيد المراجعة (معلق) ⏳'}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 italic">
                      "{rev.comment}"
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {rev.sessionTitle} • {rev.date}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => approveRating(rev.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 cursor-pointer transition shadow-sm"
                      >
                        <Check className="size-3.5" />
                        <span>اعتماد ونشر التقييم</span>
                      </button>
                    )}
                    <button
                      onClick={() => deleteRating(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 hover:text-white text-rose-500 font-bold flex items-center gap-1 cursor-pointer transition"
                      title="حذف التقييم نهائياً"
                    >
                      <Trash2 className="size-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Content Management (Articles & Questions with DELETE) */}
      {activeTab === 'content' && (
        <div className="space-y-6 text-start">
          {/* Articles Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-5 shadow-sm">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              {ar ? 'إدارة وحذف المقالات التعليمية' : 'Manage & Delete Educational Articles'}
            </h4>

            {/* Add Article Form */}
            <form onSubmit={handleAddArticle} className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={ar ? 'عنوان المقال الجديد...' : 'New article title...'}
                  value={newArticleTitle}
                  onChange={(e) => setNewArticleTitle(e.target.value)}
                  className="py-2.5 px-3 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newArticleCategory}
                  onChange={(e) => setNewArticleCategory(e.target.value)}
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  className="py-2.5 px-3 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-900 text-white text-xs"
                >
                  <option value="قدرات كمي">قدرات كمي</option>
                  <option value="قدرات لفظي">قدرات لفظي</option>
                  <option value="كيمياء نووية">كيمياء نووية</option>
                  <option value="تحصيلي فيزياء">تحصيلي فيزياء</option>
                </select>
              </div>
              <textarea
                rows={2}
                placeholder={ar ? 'ملخص أو محتوى المقال...' : 'Article summary/content...'}
                value={newArticleContent}
                onChange={(e) => setNewArticleContent(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>إضافة المقال للمنصة</span>
              </button>
            </form>

            {/* Articles List with Delete Button */}
            <div className="space-y-2">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{art.title}</span>
                    <span className="text-[10px] text-slate-400">{art.category} • {art.date}</span>
                  </div>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="p-2 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="حذف المقال"
                  >
                    <Trash2 className="size-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Questions Section */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-5 shadow-sm">
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              {ar ? 'إدارة وحذف أسئلة بنك التجميعات' : 'Manage & Delete Questions Bank'}
            </h4>

            {/* Add Question Form */}
            <form onSubmit={handleAddQuestion} className="space-y-3 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
              <div className="grid sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder={ar ? 'نص المسألة أو السؤال الجديد...' : 'Question text...'}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="sm:col-span-2 py-2.5 px-3 rounded-lg border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white"
                />
                <select
                  value={newQuestionTrack}
                  onChange={(e) => setNewQuestionTrack(e.target.value as any)}
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  className="py-2.5 px-3 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-900 text-white text-xs"
                >
                  <option value="كمي">قدرات كمي</option>
                  <option value="لفظي">قدرات لفظي</option>
                  <option value="تحصيلي_كيمياء">تحصيلي كيمياء</option>
                  <option value="تحصيلي_فيزياء">تحصيلي فيزياء</option>
                  <option value="نووية">كيمياء نووية</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>إضافة السؤال للبنك</span>
              </button>
            </form>

            {/* Questions List with Delete Button */}
            <div className="space-y-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 dark:text-white block">{q.q}</span>
                    <span className="text-[10px] text-cyan-500">{q.track} • الصعوبة: {q.difficulty}</span>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-2 rounded-lg bg-rose-500/15 text-rose-500 hover:bg-rose-500 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="حذف السؤال"
                  >
                    <Trash2 className="size-3.5" />
                    <span>حذف</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 text-start">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-5 shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              {ar ? 'التحكم في إتاحة أيام الأسبوع والمواعيد' : 'Schedule Days & Times Availability'}
            </h4>

            <div className="grid sm:grid-cols-3 gap-3">
              {daysState.map((d) => (
                <div
                  key={d.date}
                  onClick={() => toggleDayStatus(d.date)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    d.open ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10 opacity-60'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{d.labelAr}</span>
                    <span className="text-[10px] text-slate-400">{d.date}</span>
                  </div>
                  <span className={`text-xs font-bold ${d.open ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {d.open ? 'متاح للحجز' : 'مغلق'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Security & Change Admin Password */}
      {activeTab === 'security' && (
        <div className="space-y-4 text-start max-w-xl">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c1224] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <KeyRound className="size-5 text-cyan-500" />
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {ar ? 'تغيير كلمة مرور المشرف' : 'Change Admin Master Password'}
              </h4>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {ar ? 'كلمة المرور الحالية:' : 'Current Password:'}
                </label>
                <input
                  type="password"
                  required
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {ar ? 'كلمة المرور الجديدة:' : 'New Password:'}
                </label>
                <input
                  type="password"
                  required
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white"
                />
              </div>

              {changePassMsg && (
                <div className="text-xs font-bold text-cyan-500">{changePassMsg}</div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {ar ? 'حفظ كلمة المرور الجديدة' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
