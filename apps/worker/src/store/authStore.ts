import { create } from 'zustand';
import { useSharedStore, normalizePhone, RegisteredUser } from '../../../../shared/sharedStore';

export type WorkerAuthStep = 'PHONE' | 'LOGIN' | 'SIGNUP';

interface WorkerAuthState {
  user: RegisteredUser | null;
  isLoading: boolean;
  step: WorkerAuthStep;
  checkedPhone: string;

  initialize: () => void;
  checkPhone: (phone: string) => WorkerAuthStep;
  login: (phone: string, password: string) => void;
  signup: (data: {
    phone: string;
    password: string;
    fullName: string;
    serviceCategory: string;
    qualifications: string;
    location: string;
  }) => void;
  logout: () => void;
  resetStep: () => void;
}

const SESSION_KEY = 'doora_worker_session';

export const useAuthStore = create<WorkerAuthState>((set, get) => ({
  user: null,
  isLoading: true,
  step: 'PHONE',
  checkedPhone: '',

  initialize: () => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const userId = JSON.parse(raw) as string;
        const user = useSharedStore.getState().getUserById(userId);
        if (user && user.role === 'worker') {
          set({ user, isLoading: false });
          return;
        }
      }
    } catch {
      // ignore
    }
    set({ user: null, isLoading: false });
  },

  checkPhone: (phone) => {
    const existing = useSharedStore.getState().findUserByPhone(phone);
    const nextStep: WorkerAuthStep = existing ? 'LOGIN' : 'SIGNUP';
    set({ step: nextStep, checkedPhone: normalizePhone(phone) });
    return nextStep;
  },

  login: (phone, password) => {
    const user = useSharedStore.getState().findUserByPhone(phone);
    if (!user) throw new Error('No account found for this phone number.');
    if (user.role !== 'worker') throw new Error('This number is registered as a Customer. Use the Customer App.');
    if (user.passwordHash !== password) throw new Error('Incorrect password. Please try again.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user.id));
    set({ user, step: 'PHONE', checkedPhone: '' });
  },

  signup: ({ phone, password, fullName, serviceCategory, qualifications, location }) => {
    const existing = useSharedStore.getState().findUserByPhone(phone);
    if (existing) throw new Error('This phone number is already registered. Please login.');

    const newUser = useSharedStore.getState().registerUser({
      role: 'worker',
      phone: normalizePhone(phone),
      fullName,
      passwordHash: password,
      serviceCategory,
      qualifications,
      location,
    });
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser.id));
    set({ user: newUser, step: 'PHONE', checkedPhone: '' });
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    set({ user: null, step: 'PHONE', checkedPhone: '' });
  },

  resetStep: () => set({ step: 'PHONE', checkedPhone: '' }),
}));
