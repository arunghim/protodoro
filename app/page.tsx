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
    theme,
  } = usePomodoroStore();
  const [showSettings, setShowSettings] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");
  const uppercaseBold = "uppercase font-bold";

  useEffect(() => {
    const applyTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        setCurrentTheme(systemTheme);
      } else {
        setCurrentTheme(theme);
      }
    };

    applyTheme();
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", applyTheme);
    
    return () => {
      window.matchMedia("(prefers-color-scheme: light)").removeEventListener("change", applyTheme);
    };
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [tick]);

  const isLight = currentTheme === "light";
  const bgColor = isLight ? "bg-white" : "bg-black";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/50" : "border-white/50";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const invertedBg = isLight ? "bg-black" : "bg-white";
  const invertedText = isLight ? "text-white" : "text-black";
  const buttonBg = isLight ? "bg-white/80" : "bg-black/40";
  const activeButtonBg = isLight ? "bg-black text-white" : "bg-white text-black";

  return (
    <div className={`relative min-h-[100dvh] overflow-hidden ${bgColor} ${textColor}`}>
      <Background />

      <div className="absolute top-4 right-4 z-50 pointer-events-auto">
        <button
          onClick={() => setShowSettings(true)}
          className={`p-3 border ${borderColor} ${buttonBg} ${textColor} backdrop-blur-md hover:${invertedBg} hover:${invertedText} transition-colors shadow-lg rounded-full`}
        >
          <FaCog size={20} />
        </button>
      </div>

      <div className={`relative z-10 flex flex-col items-center justify-center ${textColor} px-4 font-mono min-h-[100dvh] pointer-events-none`}>
        <div
          className={`w-full max-w-2xl flex flex-col sm:flex-row mb-10 gap-4 sm:gap-6 justify-center ${uppercaseBold} pointer-events-auto`}
        >
          <button
            onClick={() => onBreak && switchMode()}
            className={`w-full sm:w-1/4 py-3 border rounded-full transition-all duration-300 ${
              !onBreak
                ? `${activeButtonBg} border-current shadow-xl`
                : `${buttonBg} ${textColor} ${borderColor} ${hoverBg}`
            } ${uppercaseBold}`}
          >
            FOCUS
          </button>

          <button
            onClick={() => !onBreak && switchMode()}
            className={`w-full sm:w-1/4 py-3 border rounded-full transition-all duration-300 ${
              onBreak
                ? `${activeButtonBg} border-current shadow-xl`
                : `${buttonBg} ${textColor} ${borderColor} ${hoverBg}`
            } ${uppercaseBold}`}
          >
            BREAK
          </button>

          <div className="w-full sm:w-1/4 flex gap-4 mt-0">
            <button
              onClick={toggleRunning}
              className={`flex-1 py-3 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md`}
            >
              {isRunning ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={reset}
              className={`flex-1 py-3 border ${borderColor} ${buttonBg} ${textColor} hover:${invertedBg} hover:${invertedText} flex items-center justify-center rounded-full transition-colors backdrop-blur-md shadow-md`}
            >
              <FaRedo />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2
            className={`text-7xl sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-bold mb-6 leading-none ${textColor} ${uppercaseBold}`}
          >
            {formatTime(timeLeft)}
          </h2>
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
