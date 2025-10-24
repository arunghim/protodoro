"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaPause, FaRedo, FaCog } from "react-icons/fa";
import { usePomodoroStore } from "./lib/store/usePomodoroStore";
import SettingsOverlay from "./lib/components/SettingsOverlay";
import Background from "./lib/components/Background";

const formatTime = (s: number) => {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export default function PomodoroPage() {
  const router = useRouter();
  const {
    timeLeft,
    onBreak,
    isRunning,
    toggleRunning,
    switchMode,
    reset,
    tick,
  } = usePomodoroStore();

  const [showSettings, setShowSettings] = useState(false);
  const uppercaseBold = "uppercase font-bold";

  useEffect(() => {
    const interval = setInterval(() => {
      const { isRunning } = usePomodoroStore.getState();
      if (isRunning) tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="min-h-screen w-full relative">
      <Background />

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="p-3 border border-white rounded-full bg-black/40 hover:bg-white hover:text-black transition-colors"
        >
          <FaCog size={20} className="text-white" />
        </button>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center text-white relative px-4">
        <div
          className={`w-full sm:w-[80%] max-w-2xl flex flex-col sm:flex-row mb-10 gap-2 justify-center ${uppercaseBold}`}
        >
          <button
            onClick={() => {
              if (onBreak) switchMode();
            }}
            className={`w-full sm:w-[28%] py-3 border border-white rounded-full ${
              !onBreak
                ? "bg-white text-black"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            } transition-colors`}
          >
            Pomodoro
          </button>

          <button
            onClick={() => {
              if (!onBreak) switchMode();
            }}
            className={`w-full sm:w-[28%] py-3 border border-white rounded-full ${
              onBreak
                ? "bg-white text-black"
                : "bg-transparent text-white hover:bg-white hover:text-black"
            } transition-colors`}
          >
            Break
          </button>

          <div className="w-full sm:w-[28%] flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={toggleRunning}
              className="flex-1 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-colors"
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-colors"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2
            className={`text-[6rem] sm:text-[10rem] md:text-[12rem] font-bold mb-6 leading-none text-white ${uppercaseBold}`}
          >
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col sm:flex-row gap-2">
          <button
            className={`px-4 py-2 border border-white bg-white text-black rounded-full ${uppercaseBold}`}
          >
            Pomodoro
          </button>
          <button
            onClick={() => router.push("/todo")}
            className={`px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full ${uppercaseBold}`}
          >
            Todo
          </button>
        </div>

        <SettingsOverlay
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </div>
  );
}
