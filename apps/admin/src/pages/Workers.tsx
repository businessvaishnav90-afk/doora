import { useState } from 'react';
import { Search, XCircle, FileText, Ban, AlertTriangle } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

export default function Workers() {
  const { kycFilter, setKycFilter } = useAdminStore();
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null);

  const workers = [
    { id: 1, name: 'Suresh Kumar', phone: '+91 9876543211', skill: 'Plumbing', kyc: 'pending', rating: 0, jobs: 0 },
    { id: 2, name: 'Manoj V', phone: '+91 9876543212', skill: 'Electrical', kyc: 'approved', rating: 4.8, jobs: 142 },
    { id: 3, name: 'Ajith Nair', phone: '+91 9876543213', skill: 'Carpentry', kyc: 'suspended', rating: 3.2, jobs: 41 },
  ];

  const filteredWorkers = kycFilter === 'ALL' 
    ? workers 
    : workers.filter(w => w.kyc === kycFilter.toLowerCase());

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Worker Verification & KYC</h1>
          <p className="text-slate-500 mt-1">Review onboarding documents and manage worker access.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'APPROVED'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setKycFilter(filter as any)}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${kycFilter === filter ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
              placeholder="Search workers..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Worker Profile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Skill / Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">KYC Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 font-bold">{worker.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{worker.name}</div>
                        <div className="text-xs text-slate-500">{worker.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900 font-medium">{worker.skill}</div>
                    <div className="text-xs text-slate-500">{worker.rating} ★ ({worker.jobs} jobs)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {worker.kyc === 'pending' && <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-800">Pending Review</span>}
                    {worker.kyc === 'approved' && <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-800">Approved</span>}
                    {worker.kyc === 'suspended' && <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-red-100 text-red-800">Suspended</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedWorker(worker)}
                      className="text-brand-600 hover:text-brand-900 font-bold bg-brand-50 px-3 py-1.5 rounded-lg"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Management Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Worker Governance: {selectedWorker.name}</h2>
              <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> KYC Documents</h3>
                <div className="space-y-3">
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Aadhaar Card.jpg</span>
                    <button className="text-brand-600 text-xs font-bold">View</button>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Trade_Certificate.pdf</span>
                    <button className="text-brand-600 text-xs font-bold">View</button>
                  </div>
                </div>

                {selectedWorker.kyc === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-green-600 text-white font-bold py-2 rounded-lg text-sm">Approve KYC</button>
                    <button className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-2 rounded-lg text-sm">Reject</button>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Governance Controls</h3>
                <p className="text-xs text-slate-500 mb-4">Take administrative action against this worker for policy violations or poor performance.</p>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-bold text-sm hover:bg-amber-100 transition-colors">
                    <span className="flex items-center gap-2"><Ban className="w-4 h-4" /> Suspend Account (7 Days)</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors">
                    <span className="flex items-center gap-2"><XCircle className="w-4 h-4" /> Permanently Block Worker</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
