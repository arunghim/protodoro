"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaPause, FaRedo, FaCog } from "react-icons/fa";
import { usePomodoroStore } from "./lib/store/usePomodoroStore";
import SettingsOverlay from "./lib/components/SettingsOverlay";
import Background from "./lib/components/Background";

const formatTime = (s: number) =>
  `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

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
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <Background />

      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="p-3 border border-white/50 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white hover:text-black transition-colors shadow-lg"
        >
          <FaCog size={20} />
        </button>
      </div>

      <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center text-white px-4 font-mono min-h-[100dvh]">
        <div
          className={`w-full max-w-2xl flex flex-col sm:flex-row mb-10 gap-4 sm:gap-6 justify-center ${uppercaseBold} pointer-events-auto`}
        >
          <button
            onClick={() => onBreak && switchMode()}
            className={`w-full sm:w-1/4 py-3 border rounded-full transition-all duration-300 ${
              !onBreak
                ? "bg-white text-black border-white shadow-xl"
                : "bg-black/40 text-white border-white/50 hover:bg-white/10"
            } ${uppercaseBold}`}
          >
            FOCUS
          </button>

          <button
            onClick={() => !onBreak && switchMode()}
            className={`w-full sm:w-1/4 py-3 border rounded-full transition-all duration-300 ${
              onBreak
                ? "bg-white text-black border-white shadow-xl"
                : "bg-black/40 text-white border-white/50 hover:bg-white/10"
            } ${uppercaseBold}`}
          >
            BREAK
          </button>

          <div className="w-full sm:w-1/4 flex gap-4 mt-0">
            <button
              onClick={toggleRunning}
              className="flex-1 py-3 border border-white/50 bg-black/40 text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md"
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 border border-white/50 bg-black/40 text-white hover:bg-white hover:text-black flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center pointer-events-auto">
          <h2
            className={`text-7xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold mb-6 leading-none text-white ${uppercaseBold}`}
          >
            {formatTime(timeLeft)}
          </h2>
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col sm:flex-row gap-2 z-30 pointer-events-auto">
          <button
            className={`px-6 py-3 border border-white/80 bg-white text-black rounded-full ${uppercaseBold} transition-colors`}
          >
            POMODORO
          </button>
          <button
            onClick={() => router.push("/todo")}
            className={`px-6 py-3 border border-white bg-transparent text-white hover:bg-white hover:text-black rounded-full ${uppercaseBold} transition-colors`}
          >
            TODO
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
