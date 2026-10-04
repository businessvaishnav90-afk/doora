import { create } from 'zustand';

interface AdminState {
  kycFilter: 'ALL' | 'PENDING' | 'APPROVED';
  setKycFilter: (filter: 'ALL' | 'PENDING' | 'APPROVED') => void;
  disputeActionModal: string | null;
  setDisputeActionModal: (disputeId: string | null) => void;
  // Dashboard mock metrics
  metrics: {
    dailyGMV: number;
    platformRevenue: number;
    activeJobs: number;
    pendingKYC: number;
    activeWorkers: number;
  };
}

export const useAdminStore = create<AdminState>((set) => ({
  kycFilter: 'PENDING',
  setKycFilter: (filter) => set({ kycFilter: filter }),
  disputeActionModal: null,
  setDisputeActionModal: (id) => set({ disputeActionModal: id }),
  metrics: {
    dailyGMV: 145000,
    platformRevenue: 29000,
    activeJobs: 142,
    pendingKYC: 18,
    activeWorkers: 324,
  }
}));
