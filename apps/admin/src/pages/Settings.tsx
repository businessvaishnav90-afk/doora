import { Wrench, Tag, BellRing } from 'lucide-react';

export default function Settings() {
  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Categories & Marketing</h1>
        <p className="text-slate-500 mt-1">Manage system configurations and promotional engines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-500" /> Service Categories
            </h3>
            <button className="text-sm font-bold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg">Add New</button>
          </div>
          <div className="p-0">
            <table className="min-w-full divide-y divide-slate-100">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">Electrical Repair</p>
                    <p className="text-xs text-slate-500">Icon: Zap • Base Fee: ₹150</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">Edit</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">Plumbing</p>
                    <p className="text-xs text-slate-500">Icon: Droplet • Base Fee: ₹150</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
          {/* Promo Codes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-500" /> Promo Code Manager
            </h3>
            <div className="border border-slate-100 rounded-lg p-4 bg-slate-50 mb-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 tracking-wider">FIRST50</p>
                <p className="text-xs text-slate-500">Flat ₹50 Off • Expires Oct 31</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">Active</span>
            </div>
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold hover:bg-slate-50 transition-colors">
              + Create Promo Code
            </button>
          </div>

          {/* Push Notifications */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <BellRing className="w-5 h-5 text-brand-400" /> Push Notification Engine
            </h3>
            <p className="text-sm text-slate-400 mb-4">Broadcast messages to targeted segments.</p>
            
            <div className="space-y-3">
              <select className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm outline-none">
                <option>Target: All Online Workers (Surge Pricing)</option>
                <option>Target: All Customers (Promotional)</option>
              </select>
              <input type="text" placeholder="Notification Title" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm outline-none" />
              <textarea placeholder="Message body..." className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm outline-none h-20"></textarea>
              <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-brand-500/20">
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
