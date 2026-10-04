import { useState } from 'react';
import { MapPin, Bell, Zap, Droplets, Wrench, Hammer, PaintRoller, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSharedStore } from '../../../../shared/sharedStore';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { id: 'Electrician',     name: 'Electrical',       icon: <Zap size={28} className="text-primary" />,         color: '#6366f1' },
  { id: 'Plumber',         name: 'Plumbing',          icon: <Droplets size={28} className="text-primary" />,     color: '#60a5fa' },
  { id: 'Appliance Repair',name: 'Appliance Repair',  icon: <Wrench size={28} className="text-primary" />,       color: '#f43f5e' },
  { id: 'Carpenter',       name: 'Carpentry',         icon: <Hammer size={28} className="text-primary" />,       color: '#d97706' },
  { id: 'Painter',         name: 'Painting',          icon: <PaintRoller size={28} className="text-primary" />,  color: '#10b981' },
  { id: 'Deep Cleaning',   name: 'Cleaning',          icon: <Sparkles size={28} className="text-primary" />,     color: '#8b5cf6' },
];

export default function Home() {
  const { user } = useAuthStore();
  const { createJob } = useSharedStore();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBookNow = () => {
    if (!user || !selectedCategory) return;
    setBooking(true);

    // Small delay for UX
    setTimeout(() => {
      createJob({
        customerId: user.id,
        customerName: user.fullName,
        customerPhone: user.phone,
        category: selectedCategory,
        description: description || `${selectedCategory} service requested`,
        address: user.address || 'Location not set',
        estimatedLabor: 200,
      });
      setBooked(true);
      setBooking(false);
      // Navigate to bookings after brief flash
      setTimeout(() => navigate('/bookings'), 1200);
    }, 700);
  };

  const resetFlow = () => {
    setSelectedCategory(null);
    setDescription('');
    setBooked(false);
  };

  // ── Booking Confirm View ──
  if (selectedCategory && booked) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Request Sent!</h2>
        <p className="text-muted text-sm mb-6">Your <strong>{selectedCategory}</strong> request is live.<br />Nearby workers will be notified.</p>
        <button className="btn btn-primary" onClick={() => navigate('/bookings')}>
          View My Bookings
        </button>
      </div>
    );
  }

  // ── Category Detail View ──
  if (selectedCategory) {
    return (
      <div className="animate-slide-up">
        <div className="flex items-center gap-4 mb-6">
          <button className="btn-outline" style={{ padding: '8px' }} onClick={resetFlow}>
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold capitalize">{selectedCategory} Service</h2>
        </div>

        <div className="card mb-6">
          <div className="badge badge-primary mb-4">Estimated: ₹200 – ₹500</div>
          <p className="text-sm text-muted mb-4">
            Describe your problem so we can match you with the best available professional in your area.
          </p>

          <div className="flex flex-col gap-4">
            <textarea
              className="input-field"
              rows={3}
              placeholder={`Describe your ${selectedCategory.toLowerCase()} issue (e.g. "Ceiling fan not working")...`}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-muted">Service Address</p>
                <p className="text-sm font-medium">{user?.address || 'Not set – update in Profile'}</p>
              </div>
            </div>

            <button
              className="btn btn-primary w-full mt-2"
              onClick={handleBookNow}
              disabled={booking}
            >
              {booking ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                '🔔 Book Now / Request Service'
              )}
            </button>
          </div>
        </div>

        <p className="text-xs text-muted text-center">
          By booking, you agree to Doora's Terms. A worker will be alerted instantly.
        </p>
      </div>
    );
  }

  // ── Main Service Grid ──
  return (
    <div className="animate-fade-in">
      {/* Location Header */}
      <div className="flex items-center justify-between mb-8 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <MapPin size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted font-semibold uppercase tracking-wider">Your Location</p>
            <h1 className="font-bold">{user?.address || 'Set your location'}</h1>
          </div>
        </div>
        <button className="p-2 bg-white rounded-full shadow-sm relative">
          <Bell size={20} />
        </button>
      </div>

      <div className="mb-6">
        <p className="text-muted text-sm mb-1">Hello, {user?.fullName?.split(' ')[0]} 👋</p>
        <h2 className="text-2xl font-bold mb-1">What do you need help with?</h2>
        <p className="text-muted">Select a service to get started</p>
      </div>

      {/* Service Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className="card text-center cursor-pointer flex flex-col items-center justify-center gap-3"
            style={{ padding: '24px 16px' }}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <div className="p-4 rounded-full" style={{ backgroundColor: `${cat.color}15` }}>
              {cat.icon}
            </div>
            <h3 className="font-semibold text-sm">{cat.name}</h3>
            <span className="text-xs text-muted flex items-center gap-1">
              Book <ChevronRight size={12} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
