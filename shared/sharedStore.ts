import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Canonical Types ──────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'worker';

export interface RegisteredUser {
  id: string;
  role: UserRole;
  phone: string; // stored as '91XXXXXXXXXX' (no + prefix)
  fullName: string;
  passwordHash: string; // plain-text, localStorage only
  createdAt: string;
  // Customer-specific
  address?: string;
  // Worker-specific
  serviceCategory?: string;
  qualifications?: string;
  location?: string;
}

export type JobStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: string;
  description: string;
  address: string;
  status: JobStatus;
  otp: string;
  estimatedLabor: number;
  createdAt: string;
  workerId?: string;
  workerName?: string;
  acceptedAt?: string;
  completedAt?: string;
  sparePartsCost?: number;
  totalBill?: number;
}

// ─── State Shape ──────────────────────────────────────────────────────────────

interface SharedState {
  users: RegisteredUser[];
  jobs: Job[];

  registerUser: (user: Omit<RegisteredUser, 'id' | 'createdAt'>) => RegisteredUser;
  findUserByPhone: (phone: string) => RegisteredUser | undefined;
  getUserById: (id: string) => RegisteredUser | undefined;

  createJob: (data: Omit<Job, 'id' | 'otp' | 'status' | 'createdAt'>) => Job;
  acceptJob: (jobId: string, worker: { id: string; name: string }) => void;
  updateJobStatus: (jobId: string, status: JobStatus, updates?: Partial<Job>) => void;

  getPendingJobs: () => Job[];
  getJobsByCustomer: (customerId: string) => Job[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSharedStore = create<SharedState>()(
  persist(
    (set, get) => ({
      users: [],
      jobs: [],

      registerUser: (userData) => {
        const newUser: RegisteredUser = {
          ...userData,
          id: `USR-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        broadcastChange();
        return newUser;
      },

      findUserByPhone: (phone) => {
        const normalized = normalizePhone(phone);
        return get().users.find((u) => u.phone === normalized);
      },

      getUserById: (id) => get().users.find((u) => u.id === id),

      createJob: (data) => {
        const newJob: Job = {
          ...data,
          id: `REQ-${Date.now().toString(36).toUpperCase()}`,
          status: 'PENDING',
          otp: Math.floor(1000 + Math.random() * 9000).toString(),
          estimatedLabor: data.estimatedLabor || 200,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ jobs: [...state.jobs, newJob] }));
        broadcastChange();
        return newJob;
      },

      acceptJob: (jobId, worker) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'ACCEPTED' as JobStatus,
                  workerId: worker.id,
                  workerName: worker.name,
                  acceptedAt: new Date().toISOString(),
                }
              : j
          ),
        }));
        broadcastChange();
      },

      updateJobStatus: (jobId, status, updates) => {
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === jobId ? { ...j, status, ...updates } : j
          ),
        }));
        broadcastChange();
      },

      getPendingJobs: () => get().jobs.filter((j) => j.status === 'PENDING'),

      getJobsByCustomer: (customerId) =>
        get().jobs.filter((j) => j.customerId === customerId),
    }),
    {
      name: 'doora-shared-v2',
    }
  )
);

// ─── Cross-Tab BroadcastChannel Sync ─────────────────────────────────────────

const CHANNEL_NAME = 'doora-sync';
let _bc: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null;
  if (!_bc) {
    try {
      _bc = new BroadcastChannel(CHANNEL_NAME);
      _bc.onmessage = () => {
        useSharedStore.persist.rehydrate();
      };
    } catch {
      // unsupported env
    }
  }
  return _bc;
}

function broadcastChange() {
  getBroadcastChannel()?.postMessage({ type: 'STATE_CHANGED' });
}

if (typeof window !== 'undefined') {
  getBroadcastChannel();
  window.addEventListener('storage', (e) => {
    if (e.key === 'doora-shared-v2') {
      useSharedStore.persist.rehydrate();
    }
  });
}

// ─── Phone Utilities ──────────────────────────────────────────────────────────

/** Normalizes phone to '91XXXXXXXXXX' (no +, no spaces) */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

/** Display phone: returns '+91 XXXXX XXXXX' */
export function displayPhone(phone: string): string {
  const n = normalizePhone(phone);
  if (n.length === 12) {
    return `+91 ${n.slice(2, 7)} ${n.slice(7)}`;
  }
  return phone;
}

/** Returns initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
