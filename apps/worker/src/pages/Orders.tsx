import React, { useState } from 'react';
import { useWorkerStore } from '../store/workerStore';
import { Calendar, Clock, User, Star, AlertCircle } from 'lucide-react';

export default function Orders() {
  const { orders } = useWorkerStore();
  const [activeTab, setActiveTab] = useState<'COMPLETED' | 'CANCELLED'>('COMPLETED');

  const filteredOrders = orders.filter(o => o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-6 pt-6 pb-2 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Job History</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`pb-3 font-semibold text-sm transition-colors relative ${
              activeTab === 'COMPLETED' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Completed Jobs
            {activeTab === 'COMPLETED' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('CANCELLED')}
            className={`pb-3 font-semibold text-sm transition-colors relative ${
              activeTab === 'CANCELLED' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Cancelled Jobs
            {activeTab === 'CANCELLED' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full" />
            )}
          </button>
        </div>
      </div>

      <div className="p-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No {activeTab.toLowerCase()} jobs yet</h3>
            <p className="text-gray-500 text-sm max-w-[200px]">
              When you {activeTab === 'COMPLETED' ? 'finish' : 'cancel'} jobs, they will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredOrders.map(job => (
              <div key={job.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 uppercase tracking-wider mb-2 inline-block">
                      {job.serviceCategory}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg">{job.subService}</h3>
                  </div>
                  {job.status === 'COMPLETED' ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Earned</p>
                      <p className="font-black text-green-600 text-xl">₹{job.totalBill || job.estimatedLabor}</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-2 rounded-lg text-red-600">
                      <AlertCircle size={24} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="font-medium">{job.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50">
                    <Clock size={16} className="text-gray-400" />
                    <span className="font-medium">{job.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3 border-t border-b border-gray-100 mb-4">
                  <div className="bg-brand-50 p-2 rounded-full text-brand-600">
                    <User size={18} />
                  </div>
                  <span className="font-medium text-gray-900">{job.customerName}</span>
                </div>

                {job.status === 'COMPLETED' && job.rating && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100/50">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={star <= (job.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-200 fill-yellow-200'} 
                        />
                      ))}
                      <span className="ml-2 font-bold text-yellow-700">{job.rating}.0</span>
                    </div>
                    {job.feedback && (
                      <p className="text-sm text-yellow-800 italic">"{job.feedback}"</p>
                    )}
                  </div>
                )}

                {job.status === 'CANCELLED' && job.cancellationReason && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-100/50">
                    <p className="text-sm text-red-800 font-medium mb-1">Cancellation Reason:</p>
                    <p className="text-sm text-red-700">{job.cancellationReason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
