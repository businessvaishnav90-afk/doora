import { Wallet, ArrowDownToLine, TrendingUp, AlertTriangle } from 'lucide-react';
import { useWorkerStore } from '../store/workerStore';

export default function Earnings() {
  const { walletBalance } = useWorkerStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Earnings & Ledger</h2>
      </div>

      <div className="p-6">
        {/* Wallet Balance Card */}
        <div className={`p-6 rounded-3xl shadow-sm mb-6 ${walletBalance < 0 ? 'bg-red-500 text-white' : 'bg-slate-900 text-white'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 opacity-70" />
              <span className="text-sm font-medium opacity-90">Wallet Balance</span>
            </div>
            {walletBalance < 0 && <AlertTriangle className="w-6 h-6 text-red-200" />}
          </div>
          
          <h3 className="text-4xl font-bold mb-6">₹{walletBalance.toFixed(2)}</h3>

          {walletBalance < 0 ? (
            <div>
              <p className="text-sm text-red-100 mb-4 leading-relaxed">
                Your wallet balance is negative due to pending platform commission fees from cash jobs. Please recharge to continue receiving job broadcasts.
              </p>
              <button className="w-full py-3 bg-white text-red-600 font-bold rounded-xl active:scale-95 transition-transform">
                Recharge via UPI
              </button>
            </div>
          ) : (
            <button className="w-full py-3 bg-brand-500 text-white font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
              <ArrowDownToLine className="w-5 h-5" /> Withdraw to Bank
            </button>
          )}
        </div>

        {/* Performance Summary */}
        <h3 className="font-bold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">Today's Earnings</p>
            <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> ₹850
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-semibold mb-1 uppercase">Completed Jobs</p>
            <p className="text-2xl font-bold text-brand-600">3</p>
          </div>
        </div>

        {/* Ledger History */}
        <h3 className="font-bold text-gray-900 mb-4">Recent Transactions</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-900 text-sm">Platform Commission (Cash Job)</p>
              <p className="text-xs text-gray-500">Oct 24, 2026 • #REQ-9921</p>
            </div>
            <p className="font-bold text-red-500">-₹30.00</p>
          </div>
          <div className="p-4 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-900 text-sm">Job Payout (Digital)</p>
              <p className="text-xs text-gray-500">Oct 24, 2026 • #REQ-8812</p>
            </div>
            <p className="font-bold text-green-500">+₹450.00</p>
          </div>
          <div className="p-4 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-bold text-gray-900 text-sm">Wallet Recharge</p>
              <p className="text-xs text-gray-500">Oct 23, 2026 • UPI TXN</p>
            </div>
            <p className="font-bold text-green-500">+₹500.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
