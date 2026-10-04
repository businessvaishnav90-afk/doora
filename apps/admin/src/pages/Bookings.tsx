import { Search, AlertCircle, RefreshCcw, DollarSign } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { useSharedStore } from '../../../../shared/sharedStore';

export default function Bookings() {
  const { disputeActionModal, setDisputeActionModal } = useAdminStore();
  const { jobs } = useSharedStore();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bookings & Dispute Resolution</h1>
          <p className="text-slate-500 mt-1">Master order registry and customer/worker dispute management.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-brand-500"
              placeholder="Search Job ID, Customer, or Worker..."
            />
          </div>
        </div>

        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Job ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Participants</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {jobs.length > 0 ? jobs.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{b.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{b.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">C: {b.customerName || b.customerId}</div>
                  <div className="text-sm text-slate-500">W: {b.workerName || 'Pending'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${b.status === 'Requested' ? 'bg-yellow-100 text-yellow-800' : b.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <button 
                     onClick={() => setDisputeActionModal(b.id)}
                     className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200"
                   >
                     View
                   </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No bookings found. Waiting for new customer requests...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dispute Resolution Modal */}
      {disputeActionModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl">
            <div className="p-4 border-b border-red-100 bg-red-50 flex justify-between items-center">
              <h3 className="font-bold text-red-900 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Action: {disputeActionModal}</h3>
              <button onClick={() => setDisputeActionModal(null)} className="text-red-400 hover:text-red-600 font-bold">Close</button>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                 <p className="text-sm text-slate-600">Details for job {disputeActionModal} are displayed here. You can manage disputes or override status.</p>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50">
                  <RefreshCcw className="w-4 h-4" /> Issue Full Refund (₹450)
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-700">
                  <DollarSign className="w-4 h-4" /> Apply Penalty to Worker (-₹200)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
