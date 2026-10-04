import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power, Wallet as WalletIcon, TrendingUp, CheckCircle, Star, MapPin } from 'lucide-react';
import { useWorkerStore } from '../store/workerStore';
import { useAuthStore } from '../store/authStore';
import { useSharedStore, Job } from '../../../../shared/sharedStore';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    isOnline,
    setIsOnline,
    walletBalance,
    earningsToday,
    jobsCompletedToday,
    averageRating,
    incomingJob,
    setIncomingJob,
    setActiveJob,
  } = useWorkerStore();

  const { jobs, acceptJob } = useSharedStore();

  const [timer, setTimer] = useState(45);
  const seenJobIds = useRef<Set<string>>(new Set());

  // ── Incoming job detection ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isOnline || !user?.serviceCategory) return;

    const category = user.serviceCategory.toLowerCase();

    const pendingForMe = jobs.find(
      (j) =>
        j.status === 'PENDING' &&
        j.category.toLowerCase() === category &&
        !seenJobIds.current.has(j.id)
    );

    if (pendingForMe && !incomingJob) {
      seenJobIds.current.add(pendingForMe.id);
      setTimer(45);
      setIncomingJob(pendingForMe as any);
    }
  }, [jobs, isOnline, user, incomingJob, setIncomingJob]);

  // ── 45-second countdown ───────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (incomingJob && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && incomingJob) {
      setIncomingJob(null); // Auto-decline on timeout
    }
    return () => clearInterval(interval);
  }, [incomingJob, timer, setIncomingJob]);

  const handleAccept = () => {
    if (incomingJob && user) {
      acceptJob(incomingJob.id, { id: user.id, name: user.fullName });
      setActiveJob({ ...(incomingJob as any), status: 'ACCEPTED' });
      setIncomingJob(null);
      navigate('/active-job');
    }
  };

  const handleDecline = () => {
    setIncomingJob(null);
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm ${
            isOnline
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          <Power size={18} className={isOnline ? 'text-green-600' : 'text-gray-500'} />
          {isOnline ? 'Online' : 'Offline'}
        </button>
      </div>

      {/* Status Banner */}
      {!isOnline && (
        <div className="mb-6 p-4 bg-gray-800 rounded-2xl text-center">
          <p className="text-gray-400 text-sm font-medium">
            You're offline. Toggle to <span className="text-white font-bold">Online</span> to receive job requests.
          </p>
        </div>
      )}

      {isOnline && !incomingJob && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            <p className="text-green-700 text-sm font-bold">Listening for {user?.serviceCategory} requests…</p>
          </div>
          <p className="text-green-600 text-xs">No incoming requests at the moment</p>
        </div>
      )}

      {/* Today's Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Today's Summary</h2>
        <div className="grid grid-cols-3 gap-4 divide-x divide-gray-100">
          <div className="text-center">
            <div className="flex justify-center mb-1"><TrendingUp size={20} className="text-brand-500" /></div>
            <p className="text-xl font-bold text-gray-900">₹{earningsToday}</p>
            <p className="text-xs text-gray-500 mt-1">Earnings</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1"><CheckCircle size={20} className="text-green-500" /></div>
            <p className="text-xl font-bold text-gray-900">{jobsCompletedToday}</p>
            <p className="text-xs text-gray-500 mt-1">Jobs</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-1"><Star size={20} className="text-yellow-400 fill-yellow-400" /></div>
            <p className="text-xl font-bold text-gray-900">{averageRating > 0 ? averageRating.toFixed(1) : '–'}</p>
            <p className="text-xs text-gray-500 mt-1">Rating</p>
          </div>
        </div>
      </div>

      {/* Wallet Quick View */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl shadow-md p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <WalletIcon size={20} />
            <span className="font-medium text-brand-50">Wallet Balance</span>
          </div>
          <button onClick={() => navigate('/wallet')} className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors">
            Recharge
          </button>
        </div>
        <div className="text-3xl font-bold mt-1">₹{walletBalance.toFixed(2)}</div>
        {walletBalance < 100 && (
          <p className="text-xs text-red-200 mt-2 font-medium bg-red-900/30 inline-block px-2 py-1 rounded-md">
            Low balance! Recharge to continue receiving jobs.
          </p>
        )}
      </div>

      {/* Incoming Job Modal */}
      {incomingJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            {/* Timer bar */}
            <div className="bg-brand-500 p-6 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-black/10">
                <div
                  className="h-full bg-white transition-all duration-1000 ease-linear"
                  style={{ width: `${(timer / 45) * 100}%` }}
                />
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                <span className="text-2xl font-bold text-white">{timer}s</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">New Job Request!</h3>
              <p className="text-brand-100 font-medium">{(incomingJob as any).category}</p>
            </div>

            <div className="p-6">
              {/* Customer + Address */}
              <div className="flex items-start gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="bg-brand-100 p-2 rounded-full text-brand-600 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">Customer</p>
                  <p className="font-bold text-gray-900">{(incomingJob as any).customerName}</p>
                  <p className="text-sm text-gray-600 mt-1">{(incomingJob as any).address}</p>
                  {(incomingJob as any).description && (
                    <p className="text-xs text-gray-400 mt-1 italic">"{(incomingJob as any).description}"</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Est. Labor Charge</span>
                <span className="text-2xl font-black text-green-600">₹{(incomingJob as any).estimatedLabor}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDecline}
                  className="py-3.5 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  DECLINE
                </button>
                <button
                  onClick={handleAccept}
                  className="py-3.5 px-4 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all"
                >
                  ACCEPT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
