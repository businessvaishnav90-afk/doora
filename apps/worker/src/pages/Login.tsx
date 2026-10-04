import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone, Lock, User, MapPin, Briefcase, Star, ArrowLeft, ArrowRight,
  Eye, EyeOff, CheckCircle2, AlertCircle, ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

type Step = 'PHONE' | 'LOGIN' | 'SIGNUP';

const SERVICE_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Deep Cleaning',
  'Appliance Repair',
  'Painter',
  'AC Technician',
  'CCTV / Security',
];

export default function Login() {
  const navigate = useNavigate();
  const { checkPhone, login, signup } = useAuthStore();

  const [step, setStep] = useState<Step>('PHONE');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [location, setLocation] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [animateKey, setAnimateKey] = useState(0);

  useEffect(() => {
    setAnimateKey(k => k + 1);
    setError('');
  }, [step]);

  const handlePhoneCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setChecking(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const nextStep = checkPhone(digits);
    setChecking(false);
    setStep(nextStep);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError('Password is required.'); return; }
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 500));
      login(phone, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Full name is required.'); return; }
    if (!serviceCategory) { setError('Please select a service category.'); return; }
    if (!qualifications.trim()) { setError('Experience / qualifications are required.'); return; }
    if (!location.trim()) { setError('Service city / location is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (!agreed) { setError('You must accept the Partner Terms to continue.'); return; }
    setLoading(true);
    setError('');
    try {
      await new Promise(r => setTimeout(r, 600));
      signup({ phone, password, fullName, serviceCategory, qualifications, location });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setPassword('');
    setError('');
    setStep('PHONE');
  };

  const formatPhoneDisplay = (raw: string) => {
    const d = raw.replace(/\D/g, '').slice(0, 10);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)} ${d.slice(5)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-emerald-950 flex items-center justify-center p-4">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl" />
      </div>

      <div
        key={animateKey}
        className="relative w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tight">Doora</span>
              <span className="block text-emerald-400 text-xs font-semibold tracking-wider uppercase">Partner Portal</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {step !== 'PHONE' && (
            <button
              onClick={handleBack}
              className="mb-4 flex items-center gap-1.5 text-slate-400 hover:text-white text-sm font-medium transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Change number
            </button>
          )}

          {/* ── PHONE STEP ── */}
          {step === 'PHONE' && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Partner Login</h1>
                <p className="text-slate-400 text-sm">Enter your phone to login or join Doora.</p>
              </div>

              <form onSubmit={handlePhoneCheck} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center gap-2 pointer-events-none">
                      <span className="text-sm font-bold text-emerald-400">+91</span>
                      <span className="w-px h-4 bg-white/20" />
                    </div>
                    <input
                      type="tel"
                      value={formatPhoneDisplay(phone)}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-16 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-semibold text-lg focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="98765 43210"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={checking || phone.replace(/\D/g, '').length < 10}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  {checking ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Continue <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── LOGIN STEP ── */}
          {step === 'LOGIN' && (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-xs font-semibold">Partner account found</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome back!</h1>
                <p className="text-slate-400 text-sm">
                  Logging in as <span className="text-emerald-400 font-medium">+91 {formatPhoneDisplay(phone)}</span>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="Your password"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Login to Account'}
                </button>
              </form>
            </>
          )}

          {/* ── SIGNUP STEP ── */}
          {step === 'SIGNUP' && (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                  <span className="text-emerald-400 text-xs font-semibold">New partner</span>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Join as a Partner</h1>
                <p className="text-slate-400 text-sm">
                  Registering <span className="text-emerald-400 font-medium">+91 {formatPhoneDisplay(phone)}</span>
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="e.g. Suresh Kumar"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Skill / Service Category</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full pl-11 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900" disabled>Select your trade</option>
                      {SERVICE_CATEGORIES.map(c => (
                        <option key={c} value={c} className="bg-slate-900">{c}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Experience / Qualifications</label>
                  <div className="relative">
                    <Star size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={qualifications}
                      onChange={(e) => setQualifications(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="e.g. 5 Years Exp, ITI Certified"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Service City / Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="e.g. Kochi, Kerala"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Set Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium focus:outline-none focus:border-emerald-500/60 focus:bg-white/10 transition-all"
                      placeholder="Min. 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Agreement */}
                <label className="flex items-start gap-3 cursor-pointer mt-2">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-white/20 bg-white/5 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                      {agreed && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 leading-snug">
                    I accept the{' '}
                    <span className="text-emerald-400 font-medium underline underline-offset-2">Doora Partner Terms</span>
                    {' '}&amp;{' '}
                    <span className="text-emerald-400 font-medium underline underline-offset-2">Platform Policies</span>
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    <AlertCircle size={15} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !agreed}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 active:scale-[0.98] mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'Register as Partner'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">
          Need a service?{' '}
          <a href="http://localhost:5173" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
            Open Customer App →
          </a>
        </p>
      </div>
    </div>
  );
}
