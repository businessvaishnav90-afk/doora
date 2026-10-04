import React, { useState } from 'react';
import { useWorkerStore } from '../store/workerStore';
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Building2, Plus, ArrowUpRight } from 'lucide-react';

export default function Wallet() {
  const { walletBalance, transactions, addTransaction, setWalletBalance } = useWorkerStore();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleRecharge = () => {
    const amount = Number(rechargeAmount);
    if (amount > 0) {
      setWalletBalance(walletBalance + amount);
      addTransaction({
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        type: 'credit',
        amount: amount,
        description: 'Wallet Recharge via UPI',
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      setShowRechargeModal(false);
      setRechargeAmount('');
    }
  };

  const handleWithdraw = () => {
    if (walletBalance > 0) {
      const amount = walletBalance; // Withdraw all
      setWalletBalance(0);
      addTransaction({
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        type: 'debit',
        amount: amount,
        description: 'Withdrawal to Bank Account',
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
      });
      setShowWithdrawModal(false);
    }
  };

  // Dummy chart data
  const chartData = [
    { day: 'Mon', amount: 0 },
    { day: 'Tue', amount: 0 },
    { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 0 },
    { day: 'Fri', amount: 0 },
    { day: 'Sat', amount: 0 },
    { day: 'Sun', amount: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Wallet & Earnings</h1>
      </div>

      <div className="p-6 pt-2">
        {/* Wallet Balance Card */}
        <div className="bg-gray-900 rounded-3xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-brand-500/20 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <WalletIcon size={18} />
                <span className="text-sm font-medium">Available Balance</span>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-md text-gray-300">INR</span>
            </div>
            
            <div className="text-4xl font-black mb-1">₹{walletBalance.toFixed(2)}</div>
            
            {walletBalance < 100 && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-200 text-xs font-medium rounded-lg mb-6 border border-red-500/30">
                <AlertCircle size={14} />
                Low balance threshold (₹100)
              </div>
            )}
            
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowRechargeModal(true)}
                className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Recharge
              </button>
              <button 
                onClick={() => setShowWithdrawModal(true)}
                disabled={walletBalance === 0}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Building2 size={18} />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">Weekly Earnings</h2>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg px-2 py-1 focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          
          <div className="flex items-end justify-between h-32 gap-2 mb-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex flex-col items-center flex-1 gap-2">
                <div className="w-full bg-brand-100 rounded-t-md relative flex-1 flex items-end justify-center">
                  <div 
                    className="w-full bg-brand-500 rounded-t-md transition-all duration-500 min-h-[4px]" 
                    style={{ height: `${data.amount > 0 ? (data.amount / 1000) * 100 : 4}%` }} 
                  />
                </div>
                <span className="text-[10px] font-medium text-gray-400">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Total earned this week</span>
            <span className="text-lg font-black text-gray-900">₹0.00</span>
          </div>
        </div>

        {/* Transaction Ledger */}
        <h2 className="font-bold text-gray-900 mb-4 px-1">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-sm text-gray-500">Your earnings and recharges will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {transactions.map(txn => (
                <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${txn.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {txn.type === 'credit' ? <ArrowUpRight size={18} /> : <TrendingDown size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{txn.description}</p>
                      <p className="text-xs text-gray-500">{txn.date} • {txn.id}</p>
                    </div>
                  </div>
                  <div className={`font-black ${txn.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recharge Wallet</h3>
              <button onClick={() => setShowRechargeModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
            <input 
              type="number" 
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-lg mb-4 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="e.g. 500"
            />

            <div className="flex gap-2 mb-6">
              {[100, 200, 500].map(amt => (
                <button 
                  key={amt}
                  onClick={() => setRechargeAmount(amt.toString())}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-sm transition-colors border border-gray-200"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <button 
              onClick={handleRecharge}
              disabled={!rechargeAmount || Number(rechargeAmount) <= 0}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Pay via UPI
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw to Bank</h3>
            <p className="text-gray-500 text-sm mb-6">
              Transfer your entire wallet balance of <strong className="text-gray-900">₹{walletBalance.toFixed(2)}</strong> to your linked bank account ending in **4521.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleWithdraw}
                className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add missing icon 
function AlertCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>
  )
}
