import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PomodoroState {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  onBreak: boolean;
  isLongBreak: boolean;
  timeLeft: number;
  isRunning: boolean;
  background: string;
  theme: "light" | "dark" | "system";
  breakCount: number;
  alarmSound: string;
  setWorkDuration: (v: number) => void;
  setBreakDuration: (v: number) => void;
  setLongBreakDuration: (v: number) => void;
  setTimeLeft: (v: number) => void;
  setOnBreak: (v: boolean) => void;
  setIsLongBreak: (v: boolean) => void;
  setBackground: (v: string) => void;
  setTheme: (v: "light" | "dark" | "system") => void;
  setAlarmSound: (v: string) => void;
  toggleRunning: () => void;
  switchMode: () => void;
  switchToBreak: () => void;
  switchToLongBreak: () => void;
  reset: () => void;
  tick: () => void;
  loadFromStorage: () => void;
  playAlarmSound: () => void;
  advanceToNextMode: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      workDuration: 25 * 60,
      breakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      onBreak: false,
      isLongBreak: false,
      timeLeft: 25 * 60,
      isRunning: false,
      background: "DOTS",
      theme: "dark",
      breakCount: 0,
      alarmSound: "bell",

      setWorkDuration: (v) => set({ workDuration: v }),
      setBreakDuration: (v) => set({ breakDuration: v }),
      setLongBreakDuration: (v) => set({ longBreakDuration: v }),
      setTimeLeft: (v) => set({ timeLeft: v }),
      setOnBreak: (v) => set({ onBreak: v }),
      setIsLongBreak: (v) => set({ isLongBreak: v }),
      setBackground: (v) => set({ background: v }),
      setTheme: (v) => set({ theme: v }),
      setAlarmSound: (v) => set({ alarmSound: v }),

      toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

      switchMode: () => {
        const { onBreak, workDuration, breakDuration, isLongBreak } = get();
        const next = !onBreak;
        set({
          onBreak: next,
          isLongBreak: false,
          timeLeft: next ? breakDuration : workDuration,
          isRunning: false,
        });
      },

      switchToBreak: () => {
        const { breakDuration } = get();
        set({
          onBreak: true,
          isLongBreak: false,
          timeLeft: breakDuration,
          isRunning: false,
        });
      },

      switchToLongBreak: () => {
        const { longBreakDuration } = get();
        set({
          onBreak: true,
          isLongBreak: true,
          timeLeft: longBreakDuration,
          breakCount: 0,
          isRunning: false,
        });
      },

      reset: () => {
        const {
          onBreak,
          isLongBreak,
          workDuration,
          breakDuration,
          longBreakDuration,
        } = get();
        set({
          timeLeft: onBreak
            ? isLongBreak
              ? longBreakDuration
              : breakDuration
            : workDuration,
          isRunning: false,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning) return;

        if (state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        }
      },

      advanceToNextMode: () => {
        const state = get();

        const nextBreak = !state.onBreak;
        let nextIsLongBreak = false;
        let nextBreakCount = state.breakCount;

        if (nextBreak) {
          nextBreakCount = state.breakCount + 1;
          nextIsLongBreak = nextBreakCount >= 4;
          if (nextIsLongBreak) {
            nextBreakCount = 0;
          }
        }

        set({
          onBreak: nextBreak,
          isLongBreak: nextIsLongBreak,
          breakCount: nextBreakCount,
          timeLeft: nextBreak
            ? nextIsLongBreak
              ? state.longBreakDuration
              : state.breakDuration
            : state.workDuration,
        });
      },

      playAlarmSound: () => {
        const { alarmSound } = get();
        const audio = new Audio(`/sounds/${alarmSound}.mp3`);
        audio.play().catch(() => {
          const beep = new Audio(
            "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
          );
          beep.play();
        });
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
