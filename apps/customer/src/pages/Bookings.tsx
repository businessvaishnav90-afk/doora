import { useState } from 'react';
import { ShieldCheck, Navigation, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSharedStore, Job } from '../../../../shared/sharedStore';

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  PENDING:     { label: 'Searching Workers…', badgeClass: 'badge-warning' },
  ACCEPTED:    { label: 'Worker Assigned',     badgeClass: 'badge-success' },
  ARRIVED:     { label: 'Worker Arrived',      badgeClass: 'badge-success' },
  IN_PROGRESS: { label: 'In Progress',         badgeClass: 'badge-primary' },
  COMPLETED:   { label: 'Completed',           badgeClass: '' },
  CANCELLED:   { label: 'Cancelled',           badgeClass: '' },
};

function JobCard({ job }: { job: Job }) {
  const cfg = STATUS_CONFIG[job.status] ?? { label: job.status, badgeClass: '' };
  const isActive = !['COMPLETED', 'CANCELLED'].includes(job.status);

  return (
    <div className={`card ${isActive ? 'border-primary' : 'opacity-75'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold">{job.category} Service</h3>
          <p className="text-xs text-muted mt-0.5">ID: {job.id}</p>
          <p className="text-xs text-muted">{new Date(job.createdAt).toLocaleString('en-IN')}</p>
        </div>
        <span className={`badge ${cfg.badgeClass}`}>{cfg.label}</span>
      </div>

      {job.status === 'PENDING' && (
        <div className="text-center py-4">
          <div className="loader-spinner animate-spin mx-auto mb-3" />
          <p className="font-semibold text-sm">Broadcasting to nearby workers…</p>
          <p className="text-xs text-muted mt-1">Workers matching "{job.category}" are being notified</p>
        </div>
      )}

      {['ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(job.status) && (
        <div className="mt-2 space-y-3">
          {job.workerName && (
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold shrink-0">
                {job.workerName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm">{job.workerName}</p>
                <p className="text-xs text-muted">Assigned Worker</p>
              </div>
            </div>
          )}
          <div className="bg-white border-2 border-dashed border-border-color rounded-xl p-4 text-center">
            <p className="text-xs text-muted mb-1 flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-success" />
              Share this OTP with worker to start
            </p>
            <h2 className="text-3xl font-bold tracking-widest text-primary">{job.otp}</h2>
          </div>
        </div>
      )}

      {job.status === 'COMPLETED' && (
        <div className="flex items-center gap-2 mt-2 p-3 bg-green-50 rounded-xl">
          <CheckCircle size={18} className="text-success shrink-0" />
          <div>
            <p className="text-sm font-bold">Service Completed</p>
            {job.totalBill && <p className="text-xs text-muted">Total: ₹{job.totalBill}</p>}
          </div>
        </div>
      )}

      {job.status === 'CANCELLED' && (
        <div className="flex items-center gap-2 mt-2 p-3 bg-red-50 rounded-xl">
          <XCircle size={18} className="text-danger shrink-0" />
          <p className="text-sm font-medium text-danger">Request Cancelled</p>
        </div>
      )}

      {job.description && (
        <p className="text-xs text-muted mt-3 pt-3 border-t border-border-color">
          "{job.description}"
        </p>
      )}
    </div>
  );
}

export default function Bookings() {
  const { user } = useAuthStore();
  const { jobs } = useSharedStore();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const navigate = useNavigate();

  const myJobs = user ? jobs.filter(j => j.customerId === user.id) : [];
  const activeJobs = myJobs.filter(j => !['COMPLETED', 'CANCELLED'].includes(j.status));
  const pastJobs = myJobs.filter(j => ['COMPLETED', 'CANCELLED'].includes(j.status));

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 pt-2">Your Bookings</h1>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-full shadow-sm mb-6 border border-border-color">
        <button
          className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${activeTab === 'active' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-primary'}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activeJobs.length})
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all ${activeTab === 'past' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-primary'}`}
          onClick={() => setActiveTab('past')}
        >
          History ({pastJobs.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {activeTab === 'active' && (
          <div className="flex flex-col gap-4">
            {activeJobs.length === 0 ? (
              <div className="card text-center py-12 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)' }}>
                  <Navigation size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">No Active Bookings</h3>
                <p className="text-muted text-sm mb-6">Book a service and a nearby professional will respond in real-time.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                  Book a Service Now
                </button>
              </div>
            ) : (
              activeJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="flex flex-col gap-4">
            {pastJobs.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <Clock size={40} className="mx-auto mb-3 opacity-30" />
                <p>No past bookings yet.</p>
              </div>
            ) : (
              pastJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}
