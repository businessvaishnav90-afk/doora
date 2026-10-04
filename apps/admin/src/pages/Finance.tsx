import { useState } from 'react';
import { Banknote, TrendingUp, Download, CheckCircle2 } from 'lucide-react';

export default function Finance() {
  const [globalCommission, setGlobalCommission] = useState(15);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Commission Engine</h1>
          <p className="text-slate-500 mt-1">Configure platform fees and process worker payouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Commission Engine */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> Platform Commission
          </h3>
          <p className="text-sm text-slate-500 mb-6">Set the global percentage deducted from every completed job.</p>
          
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">Global Rate (%)</label>
              <input 
                type="number" 
                value={globalCommission}
                onChange={(e) => setGlobalCommission(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-3 text-lg font-bold outline-none focus:border-brand-500"
              />
            </div>
            <button className="bg-slate-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-slate-800">
              Update
            </button>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-green-600" /> Pending Worker Payouts
            </h3>
            <button className="text-xs font-bold bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Process Batch
            </button>
          </div>
          <div className="p-0 overflow-y-auto max-h-64">
            <table className="min-w-full divide-y divide-slate-200">
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-bold text-slate-900">Suresh Kumar</p>
                      <p className="text-xs text-slate-500">HDFC Bank •••• 4421</p>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <p className="text-lg font-bold text-green-600">₹{1500 * i}.00</p>
                      <p className="text-xs text-amber-600">Requested Today</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ledger */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Financial Ledger</h3>
          <button className="text-sm font-medium text-slate-600 border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">TXN-99812A</td>
              <td className="px-6 py-4 text-sm text-slate-500">Platform Commission (Cash Job #REQ-881)</td>
              <td className="px-6 py-4 text-sm font-bold text-green-600">+₹30.00</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Settled</span></td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">TXN-99813B</td>
              <td className="px-6 py-4 text-sm text-slate-500">Digital Job Payment (#REQ-882)</td>
              <td className="px-6 py-4 text-sm font-bold text-slate-900">₹450.00</td>
              <td className="px-6 py-4"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Processing Escrow</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
