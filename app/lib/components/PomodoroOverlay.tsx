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

  const uppercaseBold = "uppercase font-extrabold tracking-widest";

  const labelText = onBreak ? "BREAK" : "FOCUS";

  const modeButtonClass = `cursor-pointer select-none px-3 py-1 rounded-full transition-colors duration-200 ${uppercaseBold} text-xs text-white hover:bg-white/10`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-96 bg-black/80 border border-white/30 text-white rounded-full px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-lg shadow-2xl z-30 font-mono">
      <div className="flex items-center justify-start w-32">
        <div
          onClick={switchMode}
          className={modeButtonClass}
          aria-label={`Switch to ${onBreak ? "Focus" : "Break"} Mode`}
        >
          <span>{labelText}</span>
        </div>
      </div>

      <span className="font-mono text-2xl font-light min-w-[70px] text-center text-white/95">
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-2 w-32 justify-end">
        <button
          onClick={toggleRunning}
          className="p-2 text-white hover:bg-white/10 hover:text-white rounded-full transition-colors duration-200"
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>
        <button
          onClick={reset}
          className="p-2 text-white hover:bg-white/10 hover:text-white rounded-full transition-colors duration-200"
          aria-label="Reset Timer"
        >
          <FaRedo size={16} />
        </button>
      </div>
    </div>
  );
}
