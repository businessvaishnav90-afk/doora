import { Users, AlertCircle, CheckCircle2, TrendingUp, AlertOctagon, MapPin } from 'lucide-react';
import { useAdminStore } from '../store/adminStore';

export default function Dashboard() {
  const { metrics } = useAdminStore();

  const stats = [
    { name: 'Daily GMV', value: `₹${metrics.dailyGMV.toLocaleString()}`, change: '+12%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Platform Revenue', value: `₹${metrics.platformRevenue.toLocaleString()}`, change: '+12%', icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-100' },
    { name: 'Active Jobs', value: metrics.activeJobs, change: 'Live', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending KYC', value: metrics.pendingKYC, change: 'Needs Review', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Online Workers', value: metrics.activeWorkers, change: 'Available', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Operations Control Center</h1>
        <p className="text-slate-500 mt-1">Live monitoring of platform health and active requests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Operations Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Real-Time Operations Map</h3>
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div className="flex-1 bg-slate-100 relative">
             <div className="absolute inset-0 flex items-center justify-center flex-col">
               <MapPin className="text-slate-300 w-16 h-16 mb-2" />
               <p className="text-slate-500 font-medium">Mapbox / Google Maps Integration Placeholder</p>
               <p className="text-sm text-slate-400">Displaying dense worker clusters and active jobs</p>
             </div>
             
             {/* Dummy Map Markers */}
             <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
             <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-brand-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
             <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
          </div>
        </div>

        {/* Urgent Alerts Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50 flex items-center gap-2">
            <AlertOctagon className="text-red-600 w-5 h-5" />
            <h3 className="text-lg font-bold text-red-900">Urgent Alerts Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* SOS Alert */}
            <div className="border border-red-200 bg-red-50 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">EMERGENCY SOS</span>
                <span className="text-xs text-red-400">2 mins ago</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">Worker: Suresh Kumar</p>
              <p className="text-sm text-slate-600 mb-3">Triggered SOS at location 9.9312° N, 76.2673° E.</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg">View Location</button>
                <button className="flex-1 bg-white text-slate-700 border border-slate-200 text-xs font-bold py-2 rounded-lg">Dispatch Police</button>
              </div>
            </div>

            {/* Dispute Alert */}
            <div className="border border-amber-200 bg-amber-50 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded uppercase tracking-wider">Job Dispute</span>
                <span className="text-xs text-amber-600">14 mins ago</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">Job #REQ-8812</p>
              <p className="text-sm text-slate-600 mb-3">Customer claims worker left without completing the plumbing repair.</p>
              <button className="w-full bg-white text-amber-700 border border-amber-200 text-xs font-bold py-2 rounded-lg">Review Case</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
