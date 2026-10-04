import { create } from 'zustand';

export type JobStatus = 'searching' | 'accepted' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  serviceId: string;
  categoryId: string;
  status: JobStatus;
  createdAt: string;
  description: string;
  budget?: string;
  estimatedPrice: string;
  assignedWorker?: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    completedJobs: number;
  };
  otp?: string;
}

interface CustomerState {
  activeBookings: Booking[];
  pastBookings: Booking[];
  currentLocation: string;
  
  // Actions
  setCurrentLocation: (location: string) => void;
  createBookingRequest: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: JobStatus, updates?: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  activeBookings: [], // Strict rule: MUST START EMPTY
  pastBookings: [],
  currentLocation: 'Kaloor, Kochi',
  
  setCurrentLocation: (location) => set({ currentLocation: location }),
  
  createBookingRequest: (booking) => set((state) => {
    const newBooking: Booking = {
      ...booking,
      id: `job-${Math.random().toString(36).substring(2, 9)}`,
      status: 'searching',
      createdAt: new Date().toISOString(),
    };
    return { activeBookings: [...state.activeBookings, newBooking] };
  }),
  
  updateBookingStatus: (id, status, updates) => set((state) => ({
    activeBookings: state.activeBookings.map(b => 
      b.id === id ? { ...b, status, ...updates } : b
    )
  })),
  
  cancelBooking: (id) => set((state) => {
    const booking = state.activeBookings.find(b => b.id === id);
    if (!booking) return state;
    
    return {
      activeBookings: state.activeBookings.filter(b => b.id !== id),
      pastBookings: [...state.pastBookings, { ...booking, status: 'cancelled' }]
    };
  })
}));
