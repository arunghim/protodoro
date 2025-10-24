import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PomodoroState {
  workDuration: number;
  breakDuration: number;
  onBreak: boolean;
  timeLeft: number;
  isRunning: boolean;
  setWorkDuration: (v: number) => void;
  setBreakDuration: (v: number) => void;
  setTimeLeft: (v: number) => void;
  setOnBreak: (v: boolean) => void;
  toggleRunning: () => void;
  switchMode: () => void;
  reset: () => void;
  tick: () => void;
  loadFromStorage: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      workDuration: 25 * 60,
      breakDuration: 5 * 60,
      onBreak: false,
      timeLeft: 25 * 60,
      isRunning: false,

      setWorkDuration: (v) => set({ workDuration: v }),
      setBreakDuration: (v) => set({ breakDuration: v }),
      setTimeLeft: (v) => set({ timeLeft: v }),
      setOnBreak: (v) => set({ onBreak: v }),

      toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),
      switchMode: () => {
        const { onBreak, workDuration, breakDuration } = get();
        const next = !onBreak;
        set({
          onBreak: next,
          timeLeft: next ? breakDuration : workDuration,
          isRunning: false,
        });
      },
      reset: () => {
        const { onBreak, workDuration, breakDuration } = get();
        set({
          timeLeft: onBreak ? breakDuration : workDuration,
          isRunning: false,
        });
      },
      tick: () => {
        const { timeLeft, switchMode } = get();
        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else {
          switchMode();
        }
      },
      loadFromStorage: () => {
        const saved = localStorage.getItem("pomodoro-storage");
        if (saved) {
          const data = JSON.parse(saved).state;
          set(data);
        }
      },
    }),
    { name: "pomodoro-storage" }
  )
);
