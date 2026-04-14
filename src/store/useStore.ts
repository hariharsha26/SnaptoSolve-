import { create } from "zustand";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  points: number;
  rank: string;
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved" | "escalated";
  location: { lat: number; lng: number; address: string };
  imageUrl: string;
  timestamp: number;
  upvotes: number;
  department: string;
  assignedOfficer?: string;
  slaDeadline: number;
}

interface AppState {
  user: User | null;
  theme: "light" | "dark";
  complaints: Complaint[];
  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  theme: "light",
  complaints: [],
  setUser: (user) => set({ user }),
  toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
  addComplaint: (complaint) => set((state) => ({ complaints: [complaint, ...state.complaints] })),
  updateComplaint: (id, updates) =>
    set((state) => ({
      complaints: state.complaints.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
}));
