"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaPause, FaRedo, FaCog } from "react-icons/fa";
import { usePomodoroStore } from "./lib/store/usePomodoroStore";
import SettingsOverlay from "./lib/components/SettingsOverlay";
import Background from "./lib/components/Background";

const formatTime = (s: number) => {
  if (s < 0) return "--:--";
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
};

export default function PomodoroPage() {
  const router = useRouter();
  const {
    timeLeft,
    onBreak,
    isLongBreak,
    isRunning,
    toggleRunning,
    switchMode,
    switchToLongBreak,
    switchToBreak,
    reset,
    tick,
    theme,
    alarmSound,
    playAlarmSound,
    advanceToNextMode,
  } = usePomodoroStore();
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTimeLeft, setTransitionTimeLeft] = useState(0);
  const uppercaseBold = "uppercase font-bold";

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: light)")
          .matches
          ? "light"
          : "dark";
        setCurrentTheme(systemTheme);
      } else {
        setCurrentTheme(theme);
      }
    };

    applyTheme();
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addEventListener("change", applyTheme);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: light)")
        .removeEventListener("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    const handleTick = () => {
      if (isTransitioning) {
        if (transitionTimeLeft > 0) {
          setTransitionTimeLeft(transitionTimeLeft - 1);
        } else {
          setIsTransitioning(false);
          advanceToNextMode();
        }
      } else if (isRunning && timeLeft === 0 && !isTransitioning) {
        setIsTransitioning(true);
        setTransitionTimeLeft(5);
        playAlarmSound();

        const soundInterval = setInterval(() => {
          playAlarmSound();
        }, 1000);

        setTimeout(() => {
          clearInterval(soundInterval);
        }, 5000);
      } else {
        tick();
      }
    };

    const interval = setInterval(handleTick, 1000);
    return () => clearInterval(interval);
  }, [
    tick,
    isRunning,
    timeLeft,
    isTransitioning,
    transitionTimeLeft,
    playAlarmSound,
    advanceToNextMode,
  ]);

  const handleModeSwitch = (mode: "focus" | "break" | "longBreak") => {
    if (isRunning) {
      toggleRunning();
    }

    if (isTransitioning) {
      setIsTransitioning(false);
    }

    if (mode === "focus") {
      switchMode();
    } else if (mode === "break") {
      switchToBreak();
    } else if (mode === "longBreak") {
      switchToLongBreak();
    }
  };

  const handleReset = () => {
    if (isTransitioning) {
      setIsTransitioning(false);
    }
    reset();
  };

  const isLight = currentTheme === "light";
  const bgColor = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/50" : "border-white/50";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const invertedBg = isLight ? "bg-black" : "bg-white";
  const invertedText = isLight ? "text-white" : "text-black";
  const buttonBg = isLight ? "bg-white/80" : "bg-black/40";
  const activeButtonBg = isLight
    ? "bg-black text-white"
    : "bg-white text-black";

  const displayTime = isTransitioning ? -1 : timeLeft;

  return (
    <div
      className={`relative min-h-[100dvh] overflow-hidden ${bgColor} ${textColor}`}
    >
      <Background />

      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setShowSettings(true)}
          className={`p-3 border ${borderColor} ${buttonBg} ${textColor} backdrop-blur-md hover:${invertedBg} hover:${invertedText} transition-colors shadow-lg rounded-full`}
        >
          <FaCog size={20} />
        </button>
      </div>

      <div
        className={`relative z-10 flex flex-col items-center justify-center ${textColor} px-4 font-mono min-h-[100dvh] pointer-events-none`}
      >
        <div
          className={`w-full max-w-3xl flex flex-row mb-10 gap-2 sm:gap-3 justify-center ${uppercaseBold} pointer-events-auto mt-16`}
        >
          <button
            onClick={() => handleModeSwitch("focus")}
            className={`py-2 px-4 sm:py-2 sm:px-6 border rounded-full transition-all duration-300 text-sm sm:text-base ${
              !onBreak && !isTransitioning
                ? `${activeButtonBg} border-current shadow-xl`
                : `${buttonBg} ${textColor} ${borderColor} ${hoverBg}`
            } ${uppercaseBold}`}
            disabled={isTransitioning}
          >
            FOCUS
          </button>

          <button
            onClick={() => handleModeSwitch("break")}
            className={`py-2 px-4 sm:py-2 sm:px-6 border rounded-full transition-all duration-300 text-sm sm:text-base ${
              onBreak && !isLongBreak && !isTransitioning
                ? `${activeButtonBg} border-current shadow-xl`
                : `${buttonBg} ${textColor} ${borderColor} ${hoverBg}`
            } ${uppercaseBold}`}
            disabled={isTransitioning}
          >
            BREAK
          </button>

          <button
            onClick={() => handleModeSwitch("longBreak")}
            className={`py-2 px-4 sm:py-2 sm:px-6 border rounded-full transition-all duration-300 text-sm sm:text-base ${
              isLongBreak && !isTransitioning
                ? `${activeButtonBg} border-current shadow-xl`
                : `${buttonBg} ${textColor} ${borderColor} ${hoverBg}`
            } ${uppercaseBold}`}
            disabled={isTransitioning}
          >
            LONG BREAK
          </button>

          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={toggleRunning}
              className={`py-2 px-3 sm:py-3 sm:px-4 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md ${
                isTransitioning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isTransitioning}
            >
              {isRunning && !isTransitioning ? (
                <FaPause size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <FaPlay size={14} className="sm:w-4 sm:h-4" />
              )}
            </button>
            <button
              onClick={handleReset}
              className={`py-2 px-3 sm:py-3 sm:px-4 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md`}
            >
              <FaRedo size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl px-4 flex">
            <h2
              className={`font-bold mb-6 leading-none ${textColor} ${uppercaseBold} ${
                isTransitioning ? "animate-pulse" : ""
              } text-center flex-1
      text-[7rem] sm:text-[9rem] md:text-[8rem] lg:text-[10.5rem]
      leading-none whitespace-nowrap
      transition-all duration-300`}
            >
              {formatTime(displayTime)}
            </h2>
          </div>

          {isTransitioning && (
            <p
              className={`text-lg ${textColor}/70 uppercase tracking-wider animate-pulse`}
            >
              Time's up! Next mode in {transitionTimeLeft}s
            </p>
          )}
        </div>

        <div className="fixed bottom-4 right-4 flex flex-col sm:flex-row gap-2 z-30 pointer-events-auto">
          <button
            className={`px-6 py-3 border ${borderColor} ${activeButtonBg} rounded-full ${uppercaseBold} transition-colors`}
          >
            POMODORO
          </button>
          <button
            onClick={() => router.push("/todo")}
            className={`px-6 py-3 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} rounded-full ${uppercaseBold} transition-colors`}
          >
            TODO
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <SettingsOverlay
            show={showSettings}
            onClose={() => setShowSettings(false)}
          />
        </div>
      )}
    </div>
  );
}
