"use client";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { usePomodoroStore } from "../store/usePomodoroStore";

export default function PomodoroOverlay() {
  const { timeLeft, onBreak, isRunning, toggleRunning, switchMode, reset } =
    usePomodoroStore();

  if (timeLeft === undefined) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 border border-white/30 text-white rounded-2xl px-6 py-3 flex items-center gap-4 backdrop-blur-md shadow-lg z-50">
      <div
        onClick={switchMode}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="uppercase font-bold tracking-wide text-sm">
          {onBreak ? "Break" : "Focus"}
        </span>
      </div>

      <span className="font-mono text-lg min-w-[70px] text-center">
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleRunning}
          className="p-2 border border-white/40 rounded-lg hover:bg-white hover:text-black transition-colors duration-200"
        >
          {isRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
        </button>
        <button
          onClick={reset}
          className="p-2 border border-white/40 rounded-lg hover:bg-white hover:text-black transition-colors duration-200"
        >
          <FaRedo size={14} />
        </button>
      </div>
    </div>
  );
}
