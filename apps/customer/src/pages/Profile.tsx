import { useState } from 'react';
import { MapPin, Wallet, LifeBuoy, Languages, Shield, LogOut, ChevronRight, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [language, setLanguage] = useState<'english' | 'malayalam'>('english');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const t = (en: string, ml: string) => language === 'english' ? en : ml;

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex justify-between items-center mb-6 pt-2">
        <h1 className="text-2xl font-bold">{t('Profile', 'പ്രൊഫൈൽ')}</h1>
        <button 
          className="flex items-center gap-2 text-sm font-semibold bg-white px-3 py-1.5 rounded-full border border-border-color shadow-sm"
          onClick={() => setLanguage(l => l === 'english' ? 'malayalam' : 'english')}
        >
          <Languages size={16} className="text-primary" />
          {language === 'english' ? 'EN' : 'മലയാളം'}
        </button>
      </div>

      {/* User Info Card */}
      <div className="card flex items-center gap-4 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
        <img 
          src={user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?u=customer'} 
          alt="Profile" 
          className="w-16 h-16 rounded-full border-2 border-primary" 
          style={{ width: '64px', height: '64px' }}
        />
        <div>
          <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || 'Customer Name'}</h2>
          <p className="text-sm text-muted">{user?.email || 'customer@example.com'}</p>
          <p className="text-sm text-muted">+91 98765 43210</p>
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="card p-0 overflow-hidden">
          
          {/* Wallet */}
          <div className="flex items-center p-4 border-b border-border-color cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-primary-light bg-opacity-10 rounded-full mr-4" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
              <Wallet size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{t('Doora Wallet', 'ഡൂറ വാലറ്റ്')}</h4>
              <p className="text-xs text-muted">Balance: ₹1,250.00</p>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>

          {/* Saved Addresses */}
          <div className="flex items-center p-4 border-b border-border-color cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-2 rounded-full mr-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
              <MapPin size={20} style={{ color: '#10b981' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{t('Saved Addresses', 'സേവ് ചെയ്ത വിലാസങ്ങൾ')}</h4>
              <p className="text-xs text-muted">Home, Work, Parents</p>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>

          {/* Help & Support */}
          <div className="flex items-center p-4 border-b border-border-color cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-2 rounded-full mr-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <LifeBuoy size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{t('Help & Support', 'സഹായം & പിന്തുണ')}</h4>
              <p className="text-xs text-muted">24/7 Chat & Dispute Resolution</p>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>

          {/* Compliance */}
          <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="p-2 rounded-full mr-4" style={{ backgroundColor: 'rgba(100, 116, 139, 0.1)' }}>
              <Shield size={20} className="text-muted" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{t('Privacy & Terms', 'സ്വകാര്യത & നിബന്ധനകൾ')}</h4>
              <p className="text-xs text-muted">Policies & Compliance</p>
            </div>
            <ChevronRight size={20} className="text-muted" />
          </div>
          
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          className="btn btn-outline w-full flex items-center justify-center gap-2"
          onClick={() => logout()}
        >
          <LogOut size={18} /> {t('Logout', 'ലോഗൗട്ട്')}
        </button>
        
        <button 
          className="w-full text-center text-sm font-semibold text-danger py-4 flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition-colors"
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} /> {t('Delete My Account & Data', 'എന്റെ അക്കൗണ്ട് ഇല്ലാതാക്കുക')}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card max-w-sm w-full animate-slide-up">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#fee2e2' }}>
                <AlertTriangle size={32} className="text-danger" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Account?</h3>
              <p className="text-sm text-muted">This action is irreversible. All your personal data, wallet balance, and booking history will be permanently deleted from Doora servers.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                className="btn btn-danger w-full"
                onClick={() => {
                  setShowDeleteModal(false);
                  logout();
                }}
              >
                Yes, Delete Permanently
              </button>
              <button 
                className="btn btn-outline w-full"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
