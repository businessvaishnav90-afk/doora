import { ShieldAlert, UserPlus, FileText } from 'lucide-react';

export default function Roles() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Staff Roles & Audit Logs</h1>
        <p className="text-slate-500 mt-1">Manage sub-admins and track all administrative actions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Staff List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-slate-600" /> Administrative Staff
            </h3>
            <button className="text-sm font-bold text-white bg-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800">
              <UserPlus className="w-4 h-4" /> Add Staff
            </button>
          </div>
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">Admin Owner</td>
                <td className="px-6 py-4 text-sm"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-bold">Super Admin</span></td>
                <td className="px-6 py-4"><span className="text-green-600 font-medium text-sm">Active Now</span></td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-bold text-slate-900">Priya K</td>
                <td className="px-6 py-4 text-sm"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">Verification Desk</span></td>
                <td className="px-6 py-4"><span className="text-slate-400 font-medium text-sm">Offline</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            <h3 className="font-bold text-slate-900">Immutable Audit Log</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <ul className="divide-y divide-slate-100">
              <li className="p-4 hover:bg-slate-50">
                <p className="text-sm text-slate-900"><span className="font-bold">Admin Owner</span> updated Global Commission to 15%</p>
                <p className="text-xs text-slate-400 mt-1">Today, 10:45 AM</p>
              </li>
              <li className="p-4 hover:bg-slate-50">
                <p className="text-sm text-slate-900"><span className="font-bold">Priya K</span> approved KYC for worker 'Suresh Kumar'</p>
                <p className="text-xs text-slate-400 mt-1">Yesterday, 4:20 PM</p>
              </li>
              <li className="p-4 hover:bg-slate-50">
                <p className="text-sm text-slate-900"><span className="font-bold">Admin Owner</span> issued refund (₹450) for Dispute #REQ-8812</p>
                <p className="text-xs text-slate-400 mt-1">Oct 20, 2026, 2:10 PM</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
