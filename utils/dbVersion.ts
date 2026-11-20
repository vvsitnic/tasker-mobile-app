import { create } from 'zustand';

type DbVersionState = {
  version: number;
  bump: () => void;
};

export const useDbVersion = create<DbVersionState>((set) => ({
  version: 0,
  bump: () => set((s) => ({ version: s.version + 1 })),
}));