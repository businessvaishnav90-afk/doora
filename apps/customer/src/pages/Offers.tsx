import { Tag, Copy, Share2, CheckCircle2, Gift } from 'lucide-react';
import { useState } from 'react';

const PROMO_CODES = [
  { code: 'FIRST100', desc: 'Flat ₹100 off on your first booking', valid: 'Dec 31, 2026' },
  { code: 'DOORA50', desc: '50% off on plumbing services up to ₹200', valid: 'Nov 15, 2026' },
];

const DEALS = [
  { title: 'Monsoon Shield', desc: 'AC Service + Roof Checking', price: '₹999', oldPrice: '₹1499' },
  { title: 'Deep Clean', desc: 'Bathroom + Kitchen Deep Cleaning', price: '₹1299', oldPrice: '₹1999' },
];

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="animate-fade-in pb-4">
      <h1 className="text-2xl font-bold mb-6 pt-2">Offers & Rewards</h1>

      {/* Refer & Earn Banner */}
      <div className="card mb-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}>
        <div className="relative z-10 flex flex-col items-start gap-3">
          <div className="p-2 bg-white bg-opacity-20 rounded-full inline-block">
            <Gift size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Refer & Earn ₹500</h2>
          <p className="text-sm opacity-90 mb-2">Invite your friends to Doora and get ₹500 wallet cash when they complete their first booking.</p>
          
          <div className="flex w-full gap-2 mt-2">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-md font-mono font-bold tracking-widest flex-1 text-center border border-white border-opacity-30">
              ROHIT500
            </div>
            <button className="btn bg-white text-primary" style={{ padding: '8px 16px' }}>
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
      </div>

      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Tag size={20} className="text-primary" /> Active Promo Codes
      </h3>
      
      <div className="flex flex-col gap-4 mb-8">
        {PROMO_CODES.map(promo => (
          <div key={promo.code} className="card border-dashed border-2 border-primary-light flex items-center justify-between" style={{ backgroundColor: '#fafafa' }}>
            <div>
              <div className="badge badge-primary mb-2 font-mono text-sm">{promo.code}</div>
              <p className="text-sm font-semibold">{promo.desc}</p>
              <p className="text-xs text-muted mt-1">Valid till {promo.valid}</p>
            </div>
            <button 
              className="p-3 bg-white rounded-full shadow-sm text-primary transition-all hover:bg-primary hover:text-white"
              onClick={() => handleCopy(promo.code)}
            >
              {copiedCode === promo.code ? <CheckCircle2 size={20} className="text-success" /> : <Copy size={20} />}
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-lg mb-4">Seasonal Bundles</h3>
      <div className="flex flex-col gap-4">
        {DEALS.map(deal => (
          <div key={deal.title} className="card flex gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="text-warning" size={32} />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <h4 className="font-bold">{deal.title}</h4>
              <p className="text-xs text-muted mb-2">{deal.desc}</p>
              <div className="flex items-end gap-2">
                <span className="font-bold text-primary">{deal.price}</span>
                <span className="text-xs text-muted line-through mb-0.5">{deal.oldPrice}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.875rem' }}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Temporary icon to replace missing import for deals
function Sparkles(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
      <path d="M20 3v4"/>
      <path d="M22 5h-4"/>
      <path d="M4 17v2"/>
      <path d="M5 18H3"/>
    </svg>
  );
}
