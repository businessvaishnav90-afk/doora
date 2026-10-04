import { create } from 'zustand';

interface AdminUser {
  id: string;
  phone: string;
  fullName: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isLoading: boolean;
  initialize: () => void;
  login: (phone: string, password: string) => void;
  logout: () => void;
}

// Admin credentials stored here — single admin account
const ADMIN_PHONE = '9999999999';
const ADMIN_PASSWORD = 'admin123';
const SESSION_KEY = 'doora_admin_session';

export const useAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isLoading: true,

  initialize: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const user = JSON.parse(raw) as AdminUser;
        set({ user, isLoading: false });
        return;
      }
    } catch {
      // ignore
    }
    set({ user: null, isLoading: false });
  },

  login: (phone, password) => {
    const digits = phone.replace(/\D/g, '');
    if (digits !== ADMIN_PHONE) throw new Error('No admin account found for this number.');
    if (password !== ADMIN_PASSWORD) throw new Error('Incorrect admin password.');

    const user: AdminUser = {
      id: 'ADMIN-001',
      phone: digits,
      fullName: 'Doora Admin',
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null });
  },
}));
