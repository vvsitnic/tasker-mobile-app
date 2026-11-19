import { create } from "zustand";

export type Subtask = {
  id: string;
  label: string;
  dueDate: number;
  // isComplete: boolean;
};

type State = {
  subtasks: Subtask[];
  addSubtask: (label: string, dueDate: number) => void;
  updateSubtask: (
    id: string,
    patch: { label: string; dueDate: number },
  ) => void;
  // toggleSubtask: (id: string) => void;
  removeSubtask: (id: string) => void;
  clear: () => void;
};

export const useSubtasks = create<State>((set) => ({
  subtasks: [],
  addSubtask: (label, dueDate) =>
    set((s) => ({
      subtasks: [
        ...s.subtasks,
        { id: String(Date.now()), label, dueDate, isCompleted: false },
      ],
    })),
  // toggleSubtask: (id) =>
  //   set((s) => ({
  //     subtasks: s.subtasks.map((t) =>
  //       t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
  //     ),
  //   })),
  removeSubtask: (id) =>
    set((s) => ({ subtasks: s.subtasks.filter((t) => t.id !== id) })),
  updateSubtask: (id, patch) =>
    set((s) => ({
      subtasks: s.subtasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
  clear: () => set({ subtasks: [] }),
}));
