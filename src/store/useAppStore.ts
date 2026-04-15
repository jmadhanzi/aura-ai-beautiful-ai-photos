import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider?: string;
}

interface AppState {
  currentUser: User | null;
  selectedPlan: 'weekly' | 'monthly' | 'annual';
  isProUser: boolean;
  onboardingComplete: boolean;
  setCurrentUser: (user: User | null) => void;
  setSelectedPlan: (plan: 'weekly' | 'monthly' | 'annual') => void;
  setIsProUser: (val: boolean) => void;
  setOnboardingComplete: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  selectedPlan: 'annual',
  isProUser: false,
  onboardingComplete: false,
  setCurrentUser: (user) => set({ currentUser: user }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setIsProUser: (val) => set({ isProUser: val }),
  setOnboardingComplete: (val) => set({ onboardingComplete: val }),
}));
