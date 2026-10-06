import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LogOut,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

type Mode = 'login' | 'register' | 'reset';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    emailSignIn,
    emailSignUp,
    sendPasswordReset,
    socialLogin,
    lang,
    isLoggedIn,
    user,
    logout,
    setActiveTab,
  } = useApp();

  const ar = lang === 'ar';
  const Arrow = ar ? ArrowLeft : ArrowRight;

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Social account popup simulator state
  const [socialModalProvider, setSocialModalProvider] = useState<string | null>(null);
  const [socialInputName, setSocialInputName] = useState('');
  const [socialInputEmail, setSocialInputEmail] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setBusy(true);

    let err: string | null = null;
    if (mode === 'login') {
      err = await emailSignIn(email, password);
    } else if (mode === 'register') {
      err = await emailSignUp(name, email, password, phone);
      if (!err) {
        setInfo(ar ? 'تم إنشاء الحساب بنجاح! تم تسجيل دخولك كطالب في منصة صدارة.' : 'Account created successfully! You are now logged in as a student.');
      }
    } else {
      err = await sendPasswordReset(email);
      if (!err) {
        setInfo(ar ? 'تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset instructions sent to your email.');
      }
    }

    setBusy(false);
    if (err) setError(err);
  };

  const handleStartSocial = (provider: string) => {
    setError('');
    setSocialModalProvider(provider);
    setSocialInputName('');
    setSocialInputEmail('');
  };

  const handleConfirmSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socialModalProvider) return;
    if (!socialInputName.trim() || !socialInputEmail.trim()) {
      setError(ar ? 'يرجى إدخال اسمك وبريدك الإلكتروني للمتابعة' : 'Please enter your name and email to continue');
      return;
    }
    setBusy(true);
    const err = await socialLogin(socialModalProvider, {
      name: socialInputName.trim(),
      email: socialInputEmail.trim(),
    });
    setBusy(false);
    if (err) {
      setError(err);
    } else {
      setSocialModalProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1328] shadow-2xl p-6 sm:p-8 text-start my-8 text-slate-900 dark:text-white transition-colors">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
          title="إغلاق"
        >
          <X className="size-5" />
        </button>

        {/* If already logged in, show authenticated user session details */}
        {isLoggedIn ? (
          <div className="text-center py-4 space-y-5">
            <div className="relative size-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-white dark:bg-[#090e1f] rounded-[14px] flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <GraduationCap className="size-10 text-cyan-500" />
                )}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-2">
                <ShieldCheck className="size-3.5" />
                <span>{user.role === 'admin' ? (ar ? 'حساب المشرف المعتمد' : 'Admin Account') : (ar ? 'حساب طالب مسجل' : 'Registered Student')}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
              {user.phone && <p className="text-[11px] text-slate-400 font-mono mt-0.5">{user.phone}</p>}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  closeAuthModal();
                  if (user.role === 'admin') {
                    setActiveTab('admin');
                  } else {
                    setActiveTab('student');
                  }
                }}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>{user.role === 'admin' ? (ar ? 'الانتقال إلى لوحة الإدارة 🔒' : 'Go to Admin Panel') : (ar ? 'الانتقال إلى بوابة الطالب والدروس ✨' : 'Go to Student Portal')}</span>
                <Arrow className="size-4" />
              </button>

              <button
                onClick={() => {
                  logout();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs cursor-pointer transition flex items-center justify-center gap-2"
              >
                <LogOut className="size-3.5" />
                <span>{ar ? 'تسجيل الخروج من الحساب' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        ) : socialModalProvider ? (
          /* Real Social Account Input Form */
          <div className="space-y-4">
            <div className="text-center mb-4">
              <div className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto mb-2 text-xl font-bold">
                {socialModalProvider === 'google' ? '🔴' : socialModalProvider === 'apple' ? '🍏' : '💼'}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {ar ? `المتابعة بحساب ${socialModalProvider.toUpperCase()}` : `Continue with ${socialModalProvider}`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ar ? 'أدخل اسمك الحقيقي وبريدك للربط الفوري وإنشاء حسابك' : 'Enter your name and email to link your account'}
              </p>
            </div>

            <form onSubmit={handleConfirmSocial} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {ar ? 'الاسم الكامل للطالب:' : 'Full Name:'}
                </label>
                <div className="relative">
                  <User className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={socialInputName}
                    onChange={(e) => setSocialInputName(e.target.value)}
                    placeholder={ar ? 'مثال: فهد عبد الله القحطاني' : 'e.g. Fahad Al-Qahtani'}
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {ar ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={socialInputEmail}
                    onChange={(e) => setSocialInputEmail(e.target.value)}
                    placeholder={`user@${socialModalProvider}.com`}
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSocialModalProvider(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  {ar ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  <span>{ar ? 'تأكيد ودخول المنصة' : 'Confirm & Sign In'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
                <Sparkles className="size-3.5" />
                <span>{ar ? 'بوابة التسجيل الموحدة — قياس 1447' : 'Unified Student Portal'}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {mode === 'login'
                  ? (ar ? 'تسجيل الدخول' : 'Sign In')
                  : mode === 'register'
                  ? (ar ? 'إنشاء حساب طالب جديد' : 'Create New Student Account')
                  : (ar ? 'استعادة كلمة المرور' : 'Reset Password')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {ar ? 'منصة صدارة — إشراف المهندس محمود إسماعيل شلتوت' : 'Sadara Academy Gateway'}
              </p>
            </div>

            {/* Segmented Mode Tabs */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setInfo('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                  mode === 'login'
                    ? 'bg-white dark:bg-[#0e1630] text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ar ? 'تسجيل الدخول' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setInfo('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition cursor-pointer text-center ${
                  mode === 'register'
                    ? 'bg-white dark:bg-[#0e1630] text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ar ? 'حساب جديد' : 'Sign Up'}
              </button>
            </div>

            {/* Social Logins: Gmail, Apple, LinkedIn, X, Facebook, GitHub */}
            {mode !== 'reset' && (
              <div className="space-y-2 mb-5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartSocial('google')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span className="text-sm">🔴</span>
                    <span>Gmail / Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartSocial('apple')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span className="text-sm">🍏</span>
                    <span>iCloud / Apple</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartSocial('linkedin')}
                    title="LinkedIn"
                    className="py-2 px-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span>💼</span>
                    <span className="hidden sm:inline text-[11px]">LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartSocial('x')}
                    title="X / Twitter"
                    className="py-2 px-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span>𝕏</span>
                    <span className="hidden sm:inline text-[11px]">Twitter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartSocial('facebook')}
                    title="Facebook"
                    className="py-2 px-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span>🔵</span>
                    <span className="hidden sm:inline text-[11px]">Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartSocial('github')}
                    title="GitHub"
                    className="py-2 px-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition text-slate-800 dark:text-slate-200"
                  >
                    <span>🐙</span>
                    <span className="hidden sm:inline text-[11px]">GitHub</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 my-3 text-xs text-slate-400">
                  <span className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                  <span>{ar ? 'أو بالبريد الإلكتروني' : 'or with email'}</span>
                  <span className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {ar ? 'الاسم الثلاثي للطالب:' : 'Full Name:'}
                    </label>
                    <div className="relative">
                      <User className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={ar ? 'مثال: محمد عبد الله السبيعي' : 'e.g. Mohammed Al-Subaie'}
                        className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {ar ? 'رقم الجوال / واتساب:' : 'WhatsApp Phone:'}
                    </label>
                    <div className="relative">
                      <Phone className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+966 50 123 4567"
                        className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {ar ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <div className="relative">
                  <Mail className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                    <span>{ar ? 'كلمة المرور:' : 'Password:'}</span>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('reset');
                          setError('');
                          setInfo('');
                        }}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        {ar ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full ltr:pl-9 ltr:pr-10 rtl:pr-9 rtl:pl-10 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#070d1e] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
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
              )}

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-500 font-bold flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {info && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>{info}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                <span>
                  {mode === 'login'
                    ? (ar ? 'تسجيل الدخول' : 'Sign In')
                    : mode === 'register'
                    ? (ar ? 'إنشاء حساب وتفعيل' : 'Create Account & Activate')
                    : (ar ? 'إرسال رابط الاستعادة' : 'Send Reset Link')}
                </span>
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' ? (
                <>
                  <span>{ar ? 'طالب جديد؟ ' : "New student? "}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                      setInfo('');
                    }}
                    className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    {ar ? 'إنشاء حساب الآن' : 'Register now'}
                  </button>
                </>
              ) : (
                <>
                  <span>{ar ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                      setInfo('');
                    }}
                    className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                  >
                    {ar ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
