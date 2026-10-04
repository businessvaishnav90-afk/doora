import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useWorkerStore, Job } from '../store/workerStore';
import { 
  MapPin, Phone, MessageSquare, ShieldAlert, Clock, 
  Plus, CheckCircle2, Mic, PlaySquare
} from 'lucide-react';

type JobPhase = 'navigation' | 'arrival' | 'execution' | 'billing' | 'completed';

export default function ActiveJob() {
  const navigate = useNavigate();
  const { activeJob, setActiveJob, addOrder, addTransaction, setWalletBalance, walletBalance } = useWorkerStore();
  const [phase, setPhase] = useState<JobPhase>('navigation');
  
  // Phase 2: Arrival
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // Phase 3: Execution
  const [timer, setTimer] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [extraPartsCost, setExtraPartsCost] = useState(0);
  const [showPartsAdder, setShowPartsAdder] = useState(false);
  
  // Phase 4: Billing
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(null);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'execution') {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  if (!activeJob) {
    return <Navigate to="/" />;
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const completeJob = () => {
    const laborCost = activeJob.estimatedLabor;
    const totalCost = laborCost + extraPartsCost;
    
    const completedJob: Job = {
      ...activeJob,
      status: 'COMPLETED',
      totalBill: totalCost,
      sparePartsCost: extraPartsCost
    };
    
    addOrder(completedJob);
    
    // Update wallet and transactions if paid online or commission logic
    // For simplicity, assuming full amount goes to wallet to match requirement
    setWalletBalance(walletBalance + totalCost);
    addTransaction({
      id: `TXN-${Math.floor(Math.random() * 10000)}`,
      type: 'credit',
      amount: totalCost,
      description: `Job Completed - ${activeJob.subService}`,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    });
    
    setActiveJob(null);
    navigate('/');
  };

  const handleCancelJob = () => {
     // In a real app, this would show a cancel reason modal
     const cancelledJob: Job = {
        ...activeJob,
        status: 'CANCELLED',
        cancellationReason: 'Worker cancelled due to emergency'
     };
     addOrder(cancelledJob);
     setActiveJob(null);
     navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative z-[100] h-[100dvh]">
      {/* Dynamic Header */}
      <div className="bg-white px-6 py-4 shadow-sm z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold px-2 py-1 bg-brand-50 text-brand-600 rounded-md">ACTIVE JOB</span>
          <span className="font-bold text-gray-900">ID: {activeJob.id}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{activeJob.serviceCategory} - {activeJob.subService}</h1>
        <p className="text-sm text-gray-500">{activeJob.customerName}</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        
        {/* Phase 1: Navigation */}
        {phase === 'navigation' && (
          <div className="p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="h-48 bg-blue-50 relative">
                {/* Fake Map */}
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <MapPin size={40} className="text-blue-600 drop-shadow-md" />
                  <div className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-md mt-2">
                    {activeJob.distance} away • 12 mins
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 bg-white">
                <button className="flex items-center justify-center gap-2 py-3 bg-brand-50 text-brand-700 font-semibold rounded-xl border border-brand-100">
                  <Phone size={18} /> Call
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200">
                  <MessageSquare size={18} /> Chat
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setPhase('arrival')}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} />
              Arrived at Location
            </button>
            <button 
              onClick={handleCancelJob}
              className="w-full py-4 text-red-600 font-bold rounded-2xl mt-4"
            >
              Cancel Job
            </button>
          </div>
        )}

        {/* Phase 2: Arrival & Start */}
        {phase === 'arrival' && (
          <div className="p-6 flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95">
            <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-6">
              <PlaySquare size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Job</h2>
            <p className="text-gray-500 text-center mb-8">Ask the customer for the 4-digit start code to begin work safely.</p>
            
            <div className="flex gap-4 mb-10">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="number"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-14 h-16 bg-white border-2 border-gray-200 rounded-xl text-center text-2xl font-black text-gray-900 focus:border-brand-500 focus:outline-none"
                  placeholder="-"
                />
              ))}
            </div>

            <button 
              onClick={() => setPhase('execution')}
              disabled={otp.join('').length < 4}
              className="w-full py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50 transition-all"
            >
              Verify & Start Timer
            </button>
          </div>
        )}

        {/* Phase 3: Execution */}
        {phase === 'execution' && (
          <div className="p-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center mb-6">
              <p className="text-gray-500 font-medium mb-2 uppercase tracking-widest text-xs">Work in Progress</p>
              <div className="text-6xl font-black text-gray-900 font-mono tracking-tight flex justify-center items-center gap-2">
                <Clock size={40} className="text-brand-500 animate-pulse" />
                {formatTime(timer)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <button 
                onClick={() => setShowPartsAdder(true)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 active:bg-gray-50"
              >
                <div className="bg-blue-50 text-blue-600 p-3 rounded-full">
                  <Plus size={24} />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Add Parts Cost</span>
                {extraPartsCost > 0 && <span className="text-xs font-bold text-green-600">+₹{extraPartsCost}</span>}
              </button>
              
              <button 
                onClick={() => setIsRecording(!isRecording)}
                className={`p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center gap-2 transition-colors ${
                  isRecording ? 'bg-red-500 border-red-600 text-white' : 'bg-white border-gray-100 text-gray-900 active:bg-gray-50'
                }`}
              >
                <div className={isRecording ? 'text-white animate-pulse' : 'bg-red-50 text-red-600 p-3 rounded-full'}>
                  {isRecording ? <Mic size={32} /> : <ShieldAlert size={24} />}
                </div>
                <span className={`font-semibold text-sm ${isRecording ? 'text-white' : ''}`}>
                  {isRecording ? 'Recording SOS...' : 'Safety SOS'}
                </span>
              </button>
            </div>

            <button 
              onClick={() => setPhase('billing')}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl shadow-lg mt-8"
            >
              Finish Work
            </button>
          </div>
        )}

        {/* Phase 4: Billing */}
        {phase === 'billing' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Bill</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 border-dashed">
                <span className="text-gray-600 font-medium">Labor Charge</span>
                <span className="font-bold text-gray-900">₹{activeJob.estimatedLabor}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 border-dashed">
                <span className="text-gray-600 font-medium">Extra Parts</span>
                <span className="font-bold text-gray-900">₹{extraPartsCost}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-gray-50 -mx-5 px-5 -mb-5 rounded-b-2xl">
                <span className="font-black text-gray-900">Total Collectible</span>
                <span className="text-2xl font-black text-green-600">₹{activeJob.estimatedLabor + extraPartsCost}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-4 px-1">Payment Method Confirmed</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  paymentMethod === 'cash' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                Cash Received
              </button>
              <button 
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${
                  paymentMethod === 'online' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 bg-white text-gray-500'
                }`}
              >
                Paid Online
              </button>
            </div>

            <button 
              onClick={completeJob}
              disabled={!paymentMethod}
              className="w-full py-4 bg-brand-500 text-white font-bold rounded-2xl shadow-lg disabled:opacity-50"
            >
              Complete Job & Rate Customer
            </button>
          </div>
        )}
      </div>

      {/* Parts Adder Modal */}
      {showPartsAdder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Spare Parts Cost</h3>
            <input 
              type="number"
              value={extraPartsCost || ''}
              onChange={(e) => setExtraPartsCost(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xl font-bold mb-6 focus:outline-none focus:border-brand-500"
              placeholder="Amount in ₹"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPartsAdder(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
