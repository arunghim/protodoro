"use client";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { usePomodoroStore } from "../store/usePomodoroStore";

export default function PomodoroOverlay() {
  const { timeLeft, onBreak, isRunning, toggleRunning, switchMode, reset, theme } =
    usePomodoroStore();

  if (timeLeft === undefined) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const uppercaseBold = "uppercase font-bold";

  const labelText = onBreak ? "BREAK" : "FOCUS";

  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white/80" : "bg-black/80";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/50" : "border-white/50";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const activeButtonBg = isLight ? "bg-black text-white" : "bg-white text-black";
  const buttonBg = isLight ? "bg-white/40" : "bg-black/40";

  const modeButtonClass = `cursor-pointer select-none px-4 py-1.5 ${textColor} ${hoverBg} rounded-full transition-colors duration-200 ${uppercaseBold} text-sm`;

  return (
    <div className={`fixed bottom-4 left-4 w-[calc(100%-32px)] sm:w-96 lg:left-1/2 lg:-translate-x-1/2 lg:w-96 ${bgColor} border ${borderColor} ${textColor} rounded-full px-6 py-2 flex items-center justify-between gap-4 backdrop-blur-lg shadow-2xl z-30 font-mono`}>
      <div className="flex items-center justify-start w-auto">
        <div
          onClick={switchMode}
          className={modeButtonClass}
          aria-label={`Switch to ${onBreak ? "Focus" : "Break"} Mode`}
        >
          <span>{labelText}</span>
        </div>
      </div>

      <span className={`font-mono text-xl font-light min-w-[70px] text-center ${textColor}/95`}>
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-2 w-auto justify-end">
        <button
          onClick={toggleRunning}
          className={`p-2 ${textColor} ${hoverBg} rounded-full transition-colors duration-200 flex items-center justify-center`}
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? (
            <FaPause size={16} />
          ) : (
            <FaPlay size={16} />
          )}
        </button>
        <button
          onClick={reset}
          className={`p-2 ${textColor} ${hoverBg} rounded-full transition-colors duration-200 flex items-center justify-center`}
          aria-label="Reset Timer"
        >
          <FaRedo size={16} />
        </button>
      </div>
    </div>
  );
}
