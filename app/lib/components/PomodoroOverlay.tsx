"use client";

import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { usePomodoroStore } from "../store/usePomodoroStore";
import { useState, useEffect, useRef } from "react";

export default function PomodoroOverlay() {
  const {
    timeLeft,
    onBreak,
    isLongBreak,
    isRunning,
    toggleRunning,
    switchMode,
    switchToBreak,
    switchToLongBreak,
    reset,
    theme,
  } = usePomodoroStore();
  const [showOverlay, setShowOverlay] = useState(true);
  const checkCountRef = useRef(0);

  useEffect(() => {
    const checkOverlap = () => {
      const overlay = document.querySelector("[data-pomodoro-overlay]");
      const buttons = document.querySelector("[data-nav-buttons]");

      if (!overlay || !buttons) {
        if (checkCountRef.current < 50) {
          checkCountRef.current += 1;
          setTimeout(checkOverlap, 100);
        }
        return;
      }

      const overlayRect = overlay.getBoundingClientRect();
      const buttonsRect = buttons.getBoundingClientRect();

      const overlap = !(
        overlayRect.right < buttonsRect.left ||
        overlayRect.left > buttonsRect.right ||
        overlayRect.bottom < buttonsRect.top ||
        overlayRect.top > buttonsRect.bottom
      );

      setShowOverlay(!overlap);
    };

    const initialCheck = setTimeout(checkOverlap, 100);

    const interval = setInterval(checkOverlap, 200);
    window.addEventListener("resize", checkOverlap);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      window.removeEventListener("resize", checkOverlap);
    };
  }, []);

  useEffect(() => {
    if (!showOverlay) {
      const timer = setTimeout(() => {
        const checkOverlap = () => {
          const overlay = document.querySelector("[data-pomodoro-overlay]");
          const buttons = document.querySelector("[data-nav-buttons]");

          if (!overlay || !buttons) return;

          const overlayRect = overlay.getBoundingClientRect();
          const buttonsRect = buttons.getBoundingClientRect();

          const overlap = !(
            overlayRect.right < buttonsRect.left ||
            overlayRect.left > buttonsRect.right ||
            overlayRect.bottom < buttonsRect.top ||
            overlayRect.top > buttonsRect.bottom
          );

          setShowOverlay(!overlap);
        };
        checkOverlap();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [showOverlay]);

  const handleModeSwitch = (mode: "focus" | "break" | "longBreak") => {
    if (isRunning) {
      toggleRunning();
    }

    if (mode === "focus") {
      switchMode();
    } else if (mode === "break") {
      switchToBreak();
    } else if (mode === "longBreak") {
      switchToLongBreak();
    }
  };

  if (timeLeft === undefined) return null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const uppercaseBold = "uppercase font-bold";

  const getCurrentMode = () => {
    if (!onBreak) return "FOCUS";
    return isLongBreak ? "LONG BREAK" : "BREAK";
  };

  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white/80" : "bg-black/80";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/50" : "border-white/50";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const activeButtonBg = isLight
    ? "bg-black text-white"
    : "bg-white text-black";
  const buttonBg = isLight ? "bg-white/40" : "bg-black/40";

  const modeButtonClass = `cursor-pointer select-none px-3 sm:px-4 py-1.5 ${textColor} ${hoverBg} rounded-full transition-colors duration-200 ${uppercaseBold} text-xs sm:text-sm`;

  return (
    <div
      data-pomodoro-overlay
      className={`hidden sm:flex fixed bottom-4 left-1/2 -translate-x-1/2 w-96 ${bgColor} border ${borderColor} ${textColor} rounded-full px-6 py-2 items-center justify-between gap-4 backdrop-blur-lg shadow-2xl z-30 font-mono transition-opacity duration-300 ${
        showOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-start w-auto">
        <div
          onClick={() => {
            if (onBreak && isLongBreak) {
              handleModeSwitch("break");
            } else if (onBreak && !isLongBreak) {
              handleModeSwitch("focus");
            } else {
              handleModeSwitch("break");
            }
          }}
          className={modeButtonClass}
          aria-label={`Switch to ${
            onBreak ? (isLongBreak ? "Break" : "Focus") : "Break"
          } Mode`}
        >
          <span>{getCurrentMode()}</span>
        </div>
      </div>

      <span
        className={`font-mono text-xl font-light min-w-[70px] text-center ${textColor}/95`}
      >
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-2 w-auto justify-end">
        <button
          onClick={toggleRunning}
          className={`p-2 ${textColor} ${hoverBg} rounded-full transition-colors duration-200 flex items-center justify-center`}
          aria-label={isRunning ? "Pause Timer" : "Start Timer"}
        >
          {isRunning ? <FaPause size={16} /> : <FaPlay size={16} />}
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
