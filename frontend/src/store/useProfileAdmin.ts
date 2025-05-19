
import { create } from "zustand";

interface Admin{
    id: number;
    email: string;
    role: string;
}

interface ProfileAdminState {
    admin: Admin | null;
    setAdmin: (admin: Admin) => void;
    clearAdmin: () => void;
}

export const useProfileAdmin = create<ProfileAdminState>((set) => ({
    admin: null,
    setAdmin: (admin) => set({ admin }),
    clearAdmin: () => set({ admin: null }),
}));
