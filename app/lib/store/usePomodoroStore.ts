"use client";
import { create } from "zustand";

interface PomodoroState {
  workDuration: number;
  breakDuration: number;
  onBreak: boolean;
  timeLeft: number;
  isRunning: boolean;
  intervalId?: NodeJS.Timeout;
  setWorkDuration: (v: number) => void;
  setBreakDuration: (v: number) => void;
  setTimeLeft: (v: number) => void;
  setOnBreak: (v: boolean) => void;
  toggleRunning: () => void;
  switchMode: () => void;
  reset: () => void;
}

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  onBreak: false,
  timeLeft: 25 * 60,
  isRunning: false,
  intervalId: undefined,
  setWorkDuration: (v) => set({ workDuration: v }),
  setBreakDuration: (v) => set({ breakDuration: v }),
  setTimeLeft: (v) => set({ timeLeft: v }),
  setOnBreak: (v) => set({ onBreak: v }),
  toggleRunning: () => {
    const { isRunning, intervalId } = get();
    if (isRunning) {
      if (intervalId) clearInterval(intervalId);
      set({ isRunning: false, intervalId: undefined });
    } else {
      const id = setInterval(() => {
        const { timeLeft, onBreak, workDuration, breakDuration } = get();
        let newTime = timeLeft - 1;
        let nextBreak = onBreak;
        if (newTime <= 0) {
          nextBreak = !onBreak;
          newTime = nextBreak ? breakDuration : workDuration;
        }
        set({ timeLeft: newTime, onBreak: nextBreak });
      }, 1000);
      set({ isRunning: true, intervalId: id });
    }
  },
  switchMode: () => {
    const { onBreak, workDuration, breakDuration } = get();
    const nextBreak = !onBreak;
    set({
      onBreak: nextBreak,
      timeLeft: nextBreak ? breakDuration : workDuration,
    });
  },
  reset: () => {
    const { intervalId, onBreak, workDuration, breakDuration } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      timeLeft: onBreak ? breakDuration : workDuration,
      isRunning: false,
      intervalId: undefined,
    });
  },
}));
