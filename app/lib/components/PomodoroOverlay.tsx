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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/70 border border-white text-white rounded-full px-6 py-2 flex items-center gap-3 backdrop-blur-md z-50">
      <div
        onClick={switchMode}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <span className="uppercase font-bold tracking-wide">
          {onBreak ? "Break" : "Focus"}
        </span>
      </div>

      <span className="font-mono text-lg min-w-[60px] text-center">
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleRunning}
          className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          {isRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
        </button>
        <button
          onClick={reset}
          className="p-2 border border-white rounded-full hover:bg-white hover:text-black transition-colors"
        >
          <FaRedo size={14} />
        </button>
      </div>
    </div>
  );
}
