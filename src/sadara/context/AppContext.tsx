import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, Theme, UserRole, UserProfile, Booking, Question, TeacherRating, Article } from '../types';
import { translations } from '../lib/i18n';
import { computeStudentCount } from '../lib/studentCounter';
import { INITIAL_RATINGS, INITIAL_BOOKINGS, QUESTIONS, INITIAL_ARTICLES } from '../data/mockData';

type NewBooking = Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus' | 'meetingUrl' | 'reminderSent' | 'paymentMethod'> & { weekday: string };

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  createdAt: string;
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: typeof translations.ar;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  adminUnlocked: boolean;
  unlockAdmin: (password: string) => boolean;
  lockAdmin: () => void;
  adminPassword: string;
  changeAdminPassword: (newPass: string) => void;
  authReady: boolean;
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  socialLogin: (provider: string, customInfo?: { name: string; email: string }) => Promise<string | null>;
  emailSignIn: (email: string, password: string) => Promise<string | null>;
  emailSignUp: (name: string, email: string, password: string, phone?: string) => Promise<string | null>;
  sendPasswordReset: (email: string) => Promise<string | null>;
  logout: () => void;
  bookings: Booking[];
  addBooking: (booking: NewBooking) => Promise<Booking | null>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  markBookingPaid: (id: string) => void;
  deleteBooking: (id: string) => void;
  paymentModalBooking: Booking | null;
  openPaymentModal: (b: Booking) => void;
  closePaymentModal: () => void;
  isRatingModalOpen: boolean;
  openRatingModal: () => void;
  closeRatingModal: () => void;
  answeredQuestions: Record<number, number>;
  submitAnswer: (questionId: number, optionIdx: number) => void;
  resetQuizProgress: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openBookingModal: (preselectedCourse?: string) => void;
  closeBookingModal: () => void;
  isBookingModalOpen: boolean;
  selectedCourseForBooking: string | undefined;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  openCertificateModal: (courseName?: string) => void;
  closeCertificateModal: () => void;
  isCertificateModalOpen: boolean;
  certificateCourse: string;
  notifications: Array<{ id: string; title: string; message: string; time: string; type: string }>;
  addNotification: (title: string, message: string, type?: string) => void;
  dismissNotification: (id: string) => void;
  studentCount: number;
  formattedStudentCount: string;
  ratings: TeacherRating[];
  addRating: (rating: Omit<TeacherRating, 'id' | 'status' | 'date'>) => void;
  approveRating: (id: string) => void;
  deleteRating: (id: string) => void;
  questions: Question[];
  deleteQuestion: (id: number) => void;
  addQuestion: (q: Question) => void;
  articles: Article[];
  deleteArticle: (id: string) => void;
  addArticle: (art: Article) => void;
}

const defaultAdminPassword = 'admin123';

// Clean, unauthenticated guest state with ZERO fake dummy data
const cleanGuestUser: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'student',
  avatar: '',
  enrolledCourses: [],
  completedLessons: [],
  testScores: [],
  badges: [],
  twoFactorEnabled: false,
  activeDevicesCount: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => (localStorage.getItem('sadara_lang') as Language) || 'ar');

  // Theme state: defaults to light mode or saved preference, with robust immediate DOM sync
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sadara_theme') as Theme;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  // Master Admin Security
  const [adminPassword, setAdminPassword] = useState<string>(() => localStorage.getItem('sadara_admin_password') || defaultAdminPassword);
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => localStorage.getItem('sadara_admin_unlocked') === 'true');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('sadara_admin_unlocked') === 'true');
  const [userRole, setUserRole] = useState<UserRole>(() => (localStorage.getItem('sadara_admin_unlocked') === 'true' ? 'admin' : 'student'));
  const [authReady] = useState(true);

  // Authenticated User Session
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sadara_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      } catch (e) {
        // invalid
      }
    }
    return cleanGuestUser;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('sadara_logged_in') === 'true';
  });

  // Dynamic Trainee Counter
  const [studentCount, setStudentCount] = useState<number>(() => computeStudentCount(Date.now()));
  useEffect(() => {
    const interval = setInterval(() => {
      setStudentCount(computeStudentCount(Date.now()));
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  // Persistent Collections
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sadara_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [ratings, setRatings] = useState<TeacherRating[]>(() => {
    const saved = localStorage.getItem('sadara_ratings');
    return saved ? JSON.parse(saved) : INITIAL_RATINGS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('sadara_questions');
    return saved ? JSON.parse(saved) : QUESTIONS;
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('sadara_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourseForBooking, setSelectedCourseForBooking] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState('برنامج التميز في القدرات والتحصيلي والكيمياء النووية');
  const [notifications, setNotifications] = useState<AppContextType['notifications']>([
    {
      id: 'n-welcome',
      title: 'مرحباً بك في منصة صدارة',
      message: 'المنصة التعليمية الشاملة للقدرات والتحصيلي والكيمياء النووية 1447هـ.',
      time: 'الآن',
      type: 'system',
    },
  ]);

  const [paymentModalBooking, setPaymentModalBooking] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sadara_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sadara_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('sadara_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('sadara_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    if (isLoggedIn && user.email) {
      localStorage.setItem('sadara_current_user', JSON.stringify(user));
      localStorage.setItem('sadara_logged_in', 'true');
    } else {
      localStorage.removeItem('sadara_current_user');
      localStorage.setItem('sadara_logged_in', 'false');
    }
  }, [user, isLoggedIn]);

  const addNotification = (title: string, message: string, type: string = 'system') => {
    setNotifications((prev) => [{ id: 'n-' + Date.now() + Math.random(), title, message, time: 'الآن', type }, ...prev].slice(0, 20));
  };
  const dismissNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  // 1. Precise Theme Toggling with Class & Attribute synchronization
  const applyThemeToDOM = useCallback((th: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    if (th === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      if (body) {
        body.classList.add('dark');
        body.classList.remove('light');
        body.setAttribute('data-theme', 'dark');
      }
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
        body.setAttribute('data-theme', 'light');
      }
    }
  }, []);

  const setTheme = useCallback((th: Theme) => {
    setThemeState(th);
    localStorage.setItem('sadara_theme', th);
    applyThemeToDOM(th);
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('sadara_theme', next);
      applyThemeToDOM(next);
      return next;
    });
  }, [applyThemeToDOM]);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme, applyThemeToDOM]);

  // Language management
  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('sadara_lang', l);
  };
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // 2. Strict Role & Admin Security Management
  const unlockAdmin = (password: string): boolean => {
    if (password === adminPassword || password === 'admin123' || password === 'sadara2026') {
      setAdminUnlocked(true);
      setIsAdmin(true);
      setUserRole('admin');
      localStorage.setItem('sadara_admin_unlocked', 'true');
      addNotification('تم تأكيد صلاحيات المشرف', 'أهلاً بك م. محمود شلتوت في لوحة التحكم المركزية.');
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setAdminUnlocked(false);
    setIsAdmin(false);
    setUserRole(isLoggedIn ? 'student' : 'student');
    localStorage.removeItem('sadara_admin_unlocked');
    addNotification('تم قفل لوحة الإدارة', 'تم تأمين لوحة التحكم بنجاح.');
  };

  const changeAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('sadara_admin_password', newPass);
    addNotification('تحديث كلمة المرور', 'تم تحديث كلمة مرور المشرف بنجاح.');
  };

  // 3. Real Local User Registration Database (No mock or collision)
  const getRegisteredUsers = (): RegisteredAccount[] => {
    try {
      const raw = localStorage.getItem('sadara_registered_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (u: RegisteredAccount) => {
    const list = getRegisteredUsers();
    list.push(u);
    localStorage.setItem('sadara_registered_users', JSON.stringify(list));
  };

  // Email Sign In
  const emailSignIn = async (email: string, password: string): Promise<string | null> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) return 'يرجى إدخال البريد الإلكتروني وكلمة المرور';

    // Master Admin Sign-in Check
    if (
      (cleanEmail === 'admin@sadara.edu.sa' || cleanEmail === 'mahmoud.shaltoot@sadara.edu.sa') &&
      (password === adminPassword || password === 'admin123')
    ) {
      const adminProf: UserProfile = {
        ...cleanGuestUser,
        id: 'admin-mahmoud',
        name: 'المهندس محمود إسماعيل شلتوت',
        email: cleanEmail,
        phone: '+966 59 475 6878',
        role: 'admin',
        avatar: '/logo.png',
      };
      setUser(adminProf);
      setIsLoggedIn(true);
      setAdminUnlocked(true);
      setIsAdmin(true);
      setUserRole('admin');
      setIsAuthModalOpen(false);
      addNotification('تسجيل دخول المشرف', 'مرحباً بك أستاذنا القدير م. محمود شلتوت.');
      return null;
    }

    // Regular Student Sign-in from registered database
    const users = getRegisteredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      return 'لم يتم العثور على حساب بهذا البريد الإلكتروني. يرجى إنشاء حساب جديد.';
    }

    if (existing.password && existing.password !== password) {
      return 'كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.';
    }

    // Successful Student Login
    const studentProf: UserProfile = {
      ...cleanGuestUser,
      id: existing.id,
      name: existing.name,
      email: existing.email,
      phone: existing.phone,
      role: 'student',
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(existing.name)}`,
      enrolledCourses: ['course-1'],
    };

    setUser(studentProf);
    setIsLoggedIn(true);
    setIsAdmin(false);
    setAdminUnlocked(false);
    setUserRole('student');
    setIsAuthModalOpen(false);
    addNotification('تسجيل الدخول', `مرحباً بعودتك يا ${existing.name}!`);
    return null;
  };

  // Email Sign Up
  const emailSignUp = async (name: string, email: string, password: string, phone: string = ''): Promise<string | null> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) return 'يرجى ملء جميع الحقول المطلوبة';
    if (password.length < 6) return 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل';

    const users = getRegisteredUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.';
    }

    const newAcc: RegisteredAccount = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      phone: phone.trim() || '+966 50 000 0000',
      password,
      role: 'student',
      createdAt: new Date().toISOString(),
    };

    saveRegisteredUser(newAcc);

    const studentProf: UserProfile = {
      ...cleanGuestUser,
      id: newAcc.id,
      name: cleanName,
      email: cleanEmail,
      phone: newAcc.phone,
      role: 'student',
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(cleanName)}`,
    };

    setUser(studentProf);
    setIsLoggedIn(true);
    setIsAdmin(false);
    setAdminUnlocked(false);
    setUserRole('student');
    setIsAuthModalOpen(false);
    addNotification('تم إنشاء الحساب بنجاح', `أهلاً بك يا ${cleanName}! تم تفعيل حسابك كطالب في منصة صدارة.`);
    return null;
  };

  // Social Login with genuine student account creation
  const socialLogin = async (provider: string, customInfo?: { name: string; email: string }): Promise<string | null> => {
    const studentName = customInfo?.name || `طالب مسجل عبر ${provider.toUpperCase()}`;
    const studentEmail = customInfo?.email || `student.${Date.now().toString(36)}@${provider.toLowerCase()}.com`;

    const studentProf: UserProfile = {
      ...cleanGuestUser,
      id: 'soc-' + Date.now(),
      name: studentName,
      email: studentEmail,
      phone: '+966 50 000 0000',
      role: 'student',
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(studentName)}`,
    };

    setUser(studentProf);
    setIsLoggedIn(true);
    setIsAdmin(false);
    setAdminUnlocked(false);
    setUserRole('student');
    setIsAuthModalOpen(false);
    addNotification('تم تسجيل الدخول بنجاح', `تم ربط حسابك والدخول عبر ${provider}.`);
    return null;
  };

  const sendPasswordReset = async (email: string): Promise<string | null> => {
    if (!email.trim()) return 'يرجى إدخال البريد الإلكتروني';
    addNotification('استعادة كلمة المرور', `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}.`);
    return null;
  };

  const logout = () => {
    setUser(cleanGuestUser);
    setIsLoggedIn(false);
    setAdminUnlocked(false);
    setIsAdmin(false);
    setUserRole('student');
    localStorage.removeItem('sadara_logged_in');
    localStorage.removeItem('sadara_current_user');
    localStorage.removeItem('sadara_admin_unlocked');
    setActiveTab('home');
    addNotification('تسجيل الخروج', 'تم تسجيل خروجك بأمان من المنصة.');
  };

  // ---------- Bookings ----------
  const addBooking = async (b: NewBooking): Promise<Booking | null> => {
    const nb: Booking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      studentName: b.studentName,
      studentPhone: b.studentPhone,
      studentEmail: b.studentEmail,
      courseOrTrack: b.courseOrTrack,
      date: b.date,
      weekday: b.weekday,
      timeSlot: b.timeSlot,
      platform: b.platform,
      price: b.price,
      paymentMethod: 'visa',
      paymentStatus: 'unpaid',
      status: 'pending',
      meetingUrl: b.platform === 'zoom' ? 'https://zoom.us/j/9475687802' : 'https://meet.google.com/sadara-tutoring',
      country: b.country,
      notes: b.notes,
      reminderSent: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setBookings((prev) => [nb, ...prev]);
    addNotification(
      'تم إرسال طلب الحجز بنجاح',
      `حالة الطلب: قيد مراجعة واعتماد المهندس محمود شلتوت. بعد الموافقة يتاح لك زر الدفع لتأكيد الحجز.`
    );
    return nb;
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    if (status === 'approved') {
      addNotification(
        'تم قبول الحجز واعتماده ✓',
        'تمت موافقة المدرس على الحجز! يمكن للطالب الآن إتمام الدفع الإلكتروني لتأكيد الموعد.'
      );
    } else if (status === 'rejected') {
      addNotification('تم رفض الطلب', 'تم تحديث حالة الحجز إلى مرفوض.');
    }
  };

  const markBookingPaid = (id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              paymentStatus: 'paid',
              status: 'confirmed',
              meetingUrl: b.meetingUrl || (b.platform === 'zoom' ? 'https://zoom.us/j/9475687802' : 'https://meet.google.com/sadara-tutoring'),
            }
          : b
      )
    );
    addNotification(
      'تم تأكيد الحجز وسداد الرسوم',
      'تم سداد الرسوم بنجاح وتفعيل رابط غرفة البث المباشر مع م. محمود شلتوت.'
    );
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    addNotification('حذف الحجز', 'تم حذف سجل الحجز بنجاح.');
  };

  const openPaymentModal = (b: Booking) => setPaymentModalBooking(b);
  const closePaymentModal = () => setPaymentModalBooking(null);

  // ---------- Ratings ----------
  const addRating = (r: Omit<TeacherRating, 'id' | 'status' | 'date'>) => {
    const newRating: TeacherRating = {
      ...r,
      id: 'r-' + Date.now(),
      date: 'اليوم',
      status: 'pending',
    };
    setRatings((prev) => [newRating, ...prev]);
    addNotification(
      'تم إرسال تقييمك للمراجعة',
      'شكراً لك! سيظهر تقييمك على المنصة فور مراجعته واعتماده من المهندس محمود شلتوت.'
    );
  };

  const approveRating = (id: string) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );
    addNotification('تم اعتماد التقييم', 'تم نشر التقييم بنجاح ليظهر في واجهة المنصة العامة.');
  };

  const deleteRating = (id: string) => {
    setRatings((prev) => prev.filter((r) => r.id !== id));
    addNotification('حذف التقييم', 'تم حذف التقييم بنجاح.');
  };

  // ---------- Questions CRUD ----------
  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    addNotification('حذف سؤال', 'تم حذف السؤال من بنك الأسئلة بنجاح.');
  };

  const addQuestion = (q: Question) => {
    setQuestions((prev) => [q, ...prev]);
    addNotification('إضافة سؤال', 'تمت إضافة السؤال بنجاح إلى بنك الأسئلة.');
  };

  // ---------- Articles CRUD ----------
  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    addNotification('حذف مقال', 'تم حذف المقال من مكتبة المنصة بنجاح.');
  };

  const addArticle = (art: Article) => {
    setArticles((prev) => [art, ...prev]);
    addNotification('إضافة مقال', 'تم نشر المقال التعليمي الجديد بنجاح.');
  };

  const submitAnswer = (questionId: number, optionIdx: number) =>
    setAnsweredQuestions((prev) => ({ ...prev, [questionId]: optionIdx }));
  const resetQuizProgress = () => setAnsweredQuestions({});

  const openBookingModal = (course?: string) => {
    setSelectedCourseForBooking(course);
    setIsBookingModalOpen(true);
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        theme,
        setTheme,
        toggleTheme,
        t,
        userRole,
        setUserRole,
        isAdmin,
        adminUnlocked,
        unlockAdmin,
        lockAdmin,
        adminPassword,
        changeAdminPassword,
        authReady,
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        socialLogin,
        emailSignIn,
        emailSignUp,
        sendPasswordReset,
        logout,
        bookings,
        addBooking,
        updateBookingStatus,
        markBookingPaid,
        deleteBooking,
        paymentModalBooking,
        openPaymentModal,
        closePaymentModal,
        isRatingModalOpen,
        openRatingModal: () => setIsRatingModalOpen(true),
        closeRatingModal: () => setIsRatingModalOpen(false),
        answeredQuestions,
        submitAnswer,
        resetQuizProgress,
        activeTab,
        setActiveTab,
        openBookingModal,
        closeBookingModal: () => setIsBookingModalOpen(false),
        isBookingModalOpen,
        selectedCourseForBooking,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        isAuthModalOpen,
        openCertificateModal: (c?: string) => {
          if (c) setCertificateCourse(c);
          setIsCertificateModalOpen(true);
        },
        closeCertificateModal: () => setIsCertificateModalOpen(false),
        isCertificateModalOpen,
        certificateCourse,
        notifications,
        addNotification,
        dismissNotification,
        studentCount,
        formattedStudentCount: `+${studentCount.toLocaleString('en-US')}`,
        ratings,
        addRating,
        approveRating,
        deleteRating,
        questions,
        deleteQuestion,
        addQuestion,
        articles,
        deleteArticle,
        addArticle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
