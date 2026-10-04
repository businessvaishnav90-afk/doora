import { create } from 'zustand';

export interface Job {
  id: string;
  serviceCategory: string;
  subService: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  distance: string;
  estimatedLabor: number;
  status: 'PENDING' | 'ACCEPTED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  otp?: string;
  sparePartsCost?: number;
  totalBill?: number;
  cancellationReason?: string;
  rating?: number;
  feedback?: string;
  date?: string;
  time?: string;
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface WorkerState {
  isOnline: boolean;
  incomingJob: Job | null;
  activeJob: Job | null;
  walletBalance: number;
  earningsToday: number;
  jobsCompletedToday: number;
  averageRating: number;
  serviceRadius: number;
  orders: Job[];
  transactions: Transaction[];

  setIsOnline: (status: boolean) => void;
  setIncomingJob: (job: Job | null) => void;
  setActiveJob: (job: Job | null) => void;
  setWalletBalance: (balance: number) => void;
  setServiceRadius: (radius: number) => void;
  addOrder: (job: Job) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useWorkerStore = create<WorkerState>((set) => ({
  isOnline: false,
  incomingJob: null,
  activeJob: null,
  walletBalance: 0,
  earningsToday: 0,
  jobsCompletedToday: 0,
  averageRating: 0,
  serviceRadius: 5,
  orders: [],
  transactions: [],

  setIsOnline: (status) => set({ isOnline: status }),
  setIncomingJob: (job) => set({ incomingJob: job }),
  setActiveJob: (job) => set({ activeJob: job }),
  setWalletBalance: (balance) => set({ walletBalance: balance }),
  setServiceRadius: (radius) => set({ serviceRadius: radius }),
  addOrder: (job) => set((state) => ({ orders: [job, ...state.orders] })),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
}));
