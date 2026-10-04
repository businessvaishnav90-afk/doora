import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPhone, verifyPhoneOtp } from '../../../../shared/supabase-client';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { initialize } = useAuthStore();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setError('');
    
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error: authError } = await signInWithPhone(formattedPhone);
    setLoading(false);
    
    if (authError && !import.meta.env.DEV) {
      setError(authError.message);
    } else {
      if (authError) console.warn('Bypassing SMS error for local dev:', authError.message);
      setStep('OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }
    setLoading(true);
    setError('');
    
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    let authError = null;

    if (import.meta.env.DEV && (otp === '1234' || otp === '123456')) {
      console.log('Using mock OTP bypass');
      useAuthStore.getState().setUser({ id: 'mock-admin-123', phone: formattedPhone, full_name: 'Mock Admin' });
    } else {
      const { error } = await verifyPhoneOtp(formattedPhone, otp);
      authError = error;
    }
    
    setLoading(false);
    
    if (authError) {
      setError(authError.message);
    } else {
      if (!(import.meta.env.DEV && (otp === '1234' || otp === '123456'))) {
        await initialize();
      }
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">D</span>
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {step === 'PHONE' ? 'Sign in with your registered admin phone number.' : 'Check your phone for the verification code.'}
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={step === 'PHONE' ? handleSendOtp : handleVerifyOtp} className="space-y-6">
              {step === 'PHONE' ? (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 sm:text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="block w-full pl-12 rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                      placeholder="Enter admin number"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-slate-700">
                    Verification Code
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="block w-full rounded-lg border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 text-center tracking-[0.5em] font-bold"
                      placeholder="000000"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg bg-slate-900 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : step === 'PHONE' ? 'Send Code' : 'Verify & Access'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative w-0 flex-1 bg-slate-900">
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="text-center">
             <h1 className="text-6xl font-bold text-white mb-4">Doora Central</h1>
             <p className="text-slate-400 text-xl max-w-md mx-auto">
               The control center for connecting customers with skilled local professionals.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
