import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useWorkerStore } from '../store/workerStore';
import { ShieldCheck, Map, CreditCard, FileText, Globe, Phone, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, signOut } = useAuthStore();
  const { serviceRadius, setServiceRadius } = useWorkerStore();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'en' | 'ml'>('en');

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Profile Header Card */}
      <div className="bg-brand-500 pt-12 pb-6 px-6 text-white rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center overflow-hidden backdrop-blur-md">
              <span className="text-3xl font-black">{user?.fullName?.charAt(0).toUpperCase() || 'W'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-400 text-white p-1 rounded-full border-2 border-brand-500">
              <ShieldCheck size={14} />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.fullName || 'Worker Partner'}</h1>
            <p className="text-brand-100 font-medium">ID: {user?.id || 'WRK-7A89B2'} • +91 {user?.phone || 'XXXXXXXXXX'}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-md">{user?.serviceCategory || 'Service Professional'}</span>
              {user?.location && (
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white/20 rounded-md truncate max-w-[120px]">{user.location}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Service Radius Slider */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-50 p-2 rounded-lg text-brand-600">
                <Map size={20} />
              </div>
              <h2 className="font-bold text-gray-900">Service Radius</h2>
            </div>
            <span className="font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">{serviceRadius} km</span>
          </div>
          
          <input 
            type="range" 
            min="1" 
            max="15" 
            value={serviceRadius}
            onChange={(e) => setServiceRadius(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
          <div className="flex justify-between text-xs font-medium text-gray-400 mt-2 px-1">
            <span>1 km</span>
            <span>15 km</span>
          </div>
        </div>

        {/* KYC & Bank Details */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4 px-1">Verification Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 border border-gray-100">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Aadhaar / ID Card</p>
                  <p className="text-xs text-gray-500">Verified on Oct 2025</p>
                </div>
              </div>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 border border-gray-100">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Bank Account</p>
                  <p className="text-xs text-gray-500">Linked to **4521</p>
                </div>
              </div>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Settings & Support */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            {/* Language Switcher */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 p-2 rounded-lg text-gray-600 border border-gray-100">
                  <Globe size={18} />
                </div>
                <span className="font-semibold text-gray-900 text-sm">App Language</span>
              </div>
              <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-bold">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${language === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('ml')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${language === 'ml' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                >
                  മല
                </button>
              </div>
            </div>

            {/* Helpline */}
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 border border-blue-100">
                  <Phone size={18} />
                </div>
                <span className="font-semibold text-gray-900 text-sm">24/7 Support Helpline</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>

            {/* Logout */}
            <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-lg text-red-600 border border-red-100 group-hover:bg-red-100 transition-colors">
                  <LogOut size={18} />
                </div>
                <span className="font-semibold text-red-600 text-sm">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
