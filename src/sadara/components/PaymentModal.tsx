import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { SITE_INFO } from '../data/mockData';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Printer,
  Download,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  Sparkles,
  QrCode,
  Building,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ booking, isOpen, onClose }) => {
  const { lang, markBookingPaid, addNotification } = useApp();
  const ar = lang === 'ar';

  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'visa' | 'apple_pay' | 'stc_pay' | 'paypal'>('mada');
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');

  // Form Fields
  const [cardNumber, setCardNumber] = useState('4588 3200 4810 5923');
  const [cardHolder, setCardHolder] = useState(booking?.studentName || 'عبد الرحمن الشهري');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('784');
  const [stcPhone, setStcPhone] = useState(booking?.studentPhone || '0594756878');

  // 3D Secure OTP
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceNumber] = useState(() => 'INV-' + Math.floor(100000 + Math.random() * 900000));
  const [transactionId] = useState(() => 'TXN-' + Date.now().toString(36).toUpperCase());

  if (!isOpen || !booking) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(val);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtpAndComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      markBookingPaid(booking.id);
      setStep('success');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      addNotification(
        ar ? 'تم سداد الرسوم وتأكيد الحجز بنجاح' : 'Payment confirmed & booking activated',
        ar ? `تم تفعيل موعدك مع ${SITE_INFO.instructorAr} ورابط الجلسة جاهز الآن.` : `Meeting link is unlocked.`
      );
    }, 1200);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0c1328] shadow-2xl p-6 sm:p-8 text-start my-8 text-slate-900 dark:text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
            <ShieldCheck className="size-3.5" />
            <span>{ar ? 'بوابة الدفع الإلكتروني المعتمدة والآمنة 100%' : '100% Certified Secure Payment'}</span>
          </div>
          <h3 className="text-2xl font-black">
            {step === 'success'
              ? (ar ? 'تم تأكيد الدفع وإصدار الفاتورة الضريبية 🎉' : 'Payment Confirmed & Invoice Issued 🎉')
              : step === 'otp'
              ? (ar ? 'التحقق المصرفي الآمن (3D Secure)' : '3D Secure Bank Verification')
              : (ar ? 'سداد رسوم الحجز بعد موافقة المدرس' : 'Complete Payment for Approved Booking')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {ar
              ? 'موافقة المدرس: معتمدة ومسجلة ✓ | مشفرة بواسطة بروتوكول TLS 256-bit'
              : 'Teacher approval: Verified ✓ | Protected by 256-bit TLS'}
          </p>
        </div>

        {/* Step 1: Payment Method & Details */}
        {step === 'details' && (
          <form onSubmit={handleInitiatePayment} className="space-y-5">
            {/* Booking Summary Box */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>{booking.courseOrTrack}</span>
                <span className="text-cyan-600 dark:text-cyan-400 text-base">{booking.price} {ar ? 'ر.س' : 'SAR'}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-cyan-500" />
                  {booking.weekday} • {booking.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5 text-cyan-500" />
                  {booking.timeSlot}
                </span>
                <span className="flex items-center gap-1">
                  <Video className="size-3.5 text-cyan-500" />
                  {booking.platform === 'zoom' ? 'Zoom Meeting' : 'Google Meet'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-cyan-500/15 pt-1.5 flex justify-between">
                <span>{ar ? 'المدرس المشرف: المهندس محمود شلتوت' : 'Instructor: Eng. Mahmoud Shaltoot'}</span>
                <span>{ar ? 'حالة الطلب: تمت الموافقة عليه رسمياً' : 'Status: Officially Approved'}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                {ar ? 'اختر وسيلة الدفع المفضلة:' : 'Select Payment Method:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'mada', label: 'مدى (Mada)', icon: '🇸🇦' },
                  { id: 'apple_pay', label: 'Apple Pay', icon: '' },
                  { id: 'visa', label: 'Visa / MC', icon: '💳' },
                  { id: 'stc_pay', label: 'STC Pay', icon: '📱' },
                  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer font-bold text-xs flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === m.id
                        ? 'border-cyan-500 bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-cyan-500/40'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Credit / Debit / Mada Card Fields */}
            {(paymentMethod === 'mada' || paymentMethod === 'visa') && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    {ar ? 'اسم حامل البطاقة (كما هو مدون بالبطاقة)' : 'Cardholder Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="e.g. Abdulrahman Al-Shehri"
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                    <span>{ar ? 'رقم البطاقة المصرفية' : 'Card Number'}</span>
                    <span className="text-[10px] text-cyan-500 font-mono">
                      {paymentMethod === 'mada' ? '🇸🇦 مدى معتمدة' : '💳 فيزا / ماستركارد'}
                    </span>
                  </label>
                  <div className="relative">
                    <CreditCard className="size-4 text-slate-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full ltr:pl-9 rtl:pr-9 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 tracking-wider"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      {ar ? 'تاريخ الانتهاء (شهر/سنة)' : 'Expiry (MM/YY)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-center"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center justify-between">
                      <span>{ar ? 'رمز الأمان (CVV)' : 'CVV'}</span>
                      <Lock className="size-3 text-slate-400" />
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-white/15 bg-white dark:bg-[#0c1224] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Apple Pay Form */}
            {paymentMethod === 'apple_pay' && (
              <div className="p-6 rounded-2xl bg-black text-white text-center space-y-3">
                <div className="text-3xl font-black">Pay</div>
                <p className="text-xs text-slate-300">
                  {ar
                    ? 'اضغط على زر Apple Pay للدفع بلمسة واحدة عبر Face ID أو Touch ID'
                    : 'Click Apple Pay to complete instant purchase with Touch/Face ID'}
                </p>
                <div className="text-xs font-mono text-emerald-400 font-bold">
                  {booking.price} SAR ({booking.courseOrTrack})
                </div>
              </div>
            )}

            {/* STC Pay Form */}
            {paymentMethod === 'stc_pay' && (
              <div className="p-4 rounded-2xl bg-purple-900/10 border border-purple-500/20 space-y-3">
                <label className="text-xs font-bold text-purple-700 dark:text-purple-300 block">
                  {ar ? 'رقم جوال حساب STC Pay المسجل:' : 'Registered STC Pay Mobile Number:'}
                </label>
                <div className="flex gap-2">
                  <span className="px-3 py-2.5 rounded-xl border border-purple-300 dark:border-purple-500/30 bg-purple-500/10 font-mono text-xs font-bold">
                    +966
                  </span>
                  <input
                    type="tel"
                    required
                    value={stcPhone}
                    onChange={(e) => setStcPhone(e.target.value)}
                    placeholder="5xxxxxxxx"
                    className="flex-1 py-2.5 px-3 rounded-xl border border-purple-300 dark:border-purple-500/30 bg-white dark:bg-[#0c1224] text-xs font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-purple-600 dark:text-purple-300">
                  {ar ? 'سيصلك طلب تفويض فوري على تطبيق STC Pay للسداد.' : 'You will receive an instant approval prompt on STC Pay.'}
                </p>
              </div>
            )}

            {/* PayPal Form */}
            {paymentMethod === 'paypal' && (
              <div className="p-5 rounded-2xl bg-blue-900/10 border border-blue-500/20 text-center space-y-2">
                <span className="text-2xl font-black text-blue-500">PayPal</span>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {ar ? 'سيتم ربط حسابك وسداد الرسوم بالريال السعودي أو الدولار الأمريكي.' : 'Checkout securely with your PayPal account.'}
                </p>
              </div>
            )}

            {/* Total and Submit */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">
                  {ar ? 'المبلغ الإجمالي المستحق للسداد:' : 'Total Amount Due:'}
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {booking.price} <span className="text-xs text-cyan-500 font-bold">{ar ? 'ر.س' : 'SAR'}</span>
                </span>
                <span className="text-[10px] text-slate-400 block">{ar ? '(شامل ضريبة القيمة المضافة 15%)' : '(VAT Included)'}</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Lock className="size-4" />
                <span>{isProcessing ? (ar ? 'جاري الاتصال بالبنك...' : 'Connecting to Bank...') : (ar ? `سداد ${booking.price} ر.س الآن` : `Pay ${booking.price} SAR`)}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: 3D Secure Bank Verification */}
        {step === 'otp' && (
          <div className="space-y-6 text-center py-2">
            <div className="size-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto border border-blue-500/20">
              <Building className="size-8" />
            </div>

            <div>
              <h4 className="text-xl font-black">
                {ar ? 'التحقق المصرفي للبنك — رمز الأمان' : 'Bank 3D-Secure Verification'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {ar
                  ? `أرسل البنك رسالة نصية قصيرة (SMS) تحتوي على رمز الأمان لمرة واحدة إلى هاتفك المسجل لتأكيد سداد ${booking.price} ر.س.`
                  : `A one-time OTP was sent via SMS to your registered bank mobile to authorize ${booking.price} SAR.`}
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full py-3.5 px-4 rounded-xl border-2 border-cyan-500 bg-slate-50 dark:bg-white/5 text-center font-mono text-2xl tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setOtpCode('4819')}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer block mx-auto"
              >
                {ar ? 'تعبئة رمز التحقق التجريبي (4819)' : 'Auto-fill demo OTP (4819)'}
              </button>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                {ar ? 'تعديل البيانات' : 'Back'}
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleVerifyOtpAndComplete}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25"
              >
                <CheckCircle2 className="size-4" />
                <span>{isProcessing ? (ar ? 'جاري التحقق...' : 'Verifying...') : (ar ? 'تأكيد السداد النهائي' : 'Confirm & Activate')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success & Official Tax Invoice */}
        {step === 'success' && (
          <div className="space-y-6 text-start">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <div className="size-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-7" />
              </div>
              <div>
                <h4 className="font-black text-emerald-600 dark:text-emerald-400 text-base">
                  {ar ? 'تم السداد بنجاح وتأكيد الحجز رسمياً!' : 'Payment Successful & Booking Confirmed!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {ar ? 'أصبح موعدك مع المهندس محمود شلتوت مؤكداً ومثبتاً في الجدول.' : 'Your session is officially booked and active.'}
                </p>
              </div>
            </div>

            {/* Official Printable Tax Invoice Card */}
            <div id="tax-invoice-receipt" className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{SITE_INFO.nameAr} — {SITE_INFO.taglineAr}</div>
                  <div className="text-[10px] text-slate-400">الرقم الضريبي: 302194857200003</div>
                </div>
                <div className="text-end">
                  <div className="font-bold text-cyan-600 dark:text-cyan-400">{invoiceNumber}</div>
                  <div className="text-[10px] text-slate-400">{transactionId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">{ar ? 'اسم الطالب:' : 'Student:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{booking.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{ar ? 'تاريخ وساعة الجلسة:' : 'Schedule:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{booking.weekday} {booking.date} • {booking.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{ar ? 'المادة / الباقة:' : 'Package:'}</span>
                  <span className="font-bold text-slate-800 dark:text-white">{booking.courseOrTrack}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">{ar ? 'وسيلة الدفع والحالة:' : 'Payment:'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{ar ? 'مسدد بالكامل (مدفوع)' : 'Paid in Full'}</span>
                </div>
              </div>

              {/* Direct Unlocked Meeting Link */}
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold block">{ar ? 'رابط الدخول للجلسة المباشرة:' : 'Meeting Room URL:'}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">
                    {booking.platform === 'zoom' ? 'https://zoom.us/j/9475687802' : 'https://meet.google.com/sadara-tutoring'}
                  </span>
                </div>
                <a
                  href={booking.platform === 'zoom' ? 'https://zoom.us/j/9475687802' : 'https://meet.google.com/sadara-tutoring'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                >
                  <ExternalLink className="size-3.5" />
                  <span>{ar ? 'دخول الغرفة' : 'Join'}</span>
                </a>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={printReceipt}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Printer className="size-4" />
                <span>{ar ? 'طباعة الفاتورة والإيصال' : 'Print Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs text-center cursor-pointer transition shadow-md shadow-cyan-500/25"
              >
                <span>{ar ? 'تم، العودة إلى بوابة الطالب' : 'Done, Back to Student Portal'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
