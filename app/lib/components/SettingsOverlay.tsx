"use client";

import { useState } from "react";
import { usePomodoroStore } from "../store/usePomodoroStore";
import { FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";

interface SettingsOverlayProps {
  show: boolean;
  onClose: () => void;
}

export default function SettingsOverlay({
  show,
  onClose,
}: SettingsOverlayProps) {
  const {
    workDuration,
    breakDuration,
    onBreak,
    setWorkDuration,
    setBreakDuration,
    timeLeft,
    setTimeLeft,
    background,
    setBackground,
    theme,
    setTheme,
  } = usePomodoroStore();

  const [activeTab, setActiveTab] = useState("TIMER");

  if (!show) return null;

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60);

  const handleDurationChange = (mode: "work" | "break", change: number) => {
    const isWork = mode === "work";
    const currentDuration = isWork ? workDuration : breakDuration;
    const setDuration = isWork ? setWorkDuration : setBreakDuration;
    const isOnBreak = onBreak;

    const newMinutes = Math.max(1, formatMinutes(currentDuration) + change);
    const newDuration = newMinutes * 60;

    if (newDuration === currentDuration) return;

    const diff = newDuration - currentDuration;
    setDuration(newDuration);

    if ((isWork && !isOnBreak) || (!isWork && isOnBreak)) {
      setTimeLeft(timeLeft + diff);
    }
  };

  const tabs = ["TIMER", "SOUND", "THEME", "BACKGROUND"];
  
  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white/80" : "bg-black/80";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/30" : "border-white/30";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const activeButtonBg = isLight ? "bg-black text-white" : "bg-white text-black";
  const buttonBg = isLight ? "bg-white/40" : "bg-black/40";

  const controlButtonClass = `p-1.5 ${textColor}/80 hover:${textColor} ${hoverBg} rounded transition-colors pointer-events-auto`;

  const backgroundOptions = [
    "DOTS",
    "LINES", 
    "GRID",
    "WAVES",
    "SOLID",
    "GRADIENT"
  ];

  const themeOptions = [
    "LIGHT",
    "DARK", 
    "SYSTEM"
  ];

  const buttonClass = `px-6 py-3 border ${borderColor} rounded-full uppercase font-bold transition-colors pointer-events-auto`;

  return (
    <div className="absolute top-4 sm:top-16 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-32px)] sm:w-[500px] pointer-events-auto">
      <div className={`min-h-[75vh] sm:min-h-[350px] flex flex-col sm:flex-row border ${borderColor} rounded-2xl ${bgColor} ${textColor} backdrop-blur-xl shadow-2xl transition-all duration-300 relative font-mono overflow-hidden`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 ${textColor}/70 hover:${textColor} transition-colors z-10 pointer-events-auto`}
          aria-label="CLOSE SETTINGS"
        >
          <FaTimes size={20} />
        </button>

        <div className={`flex flex-col w-full sm:w-1/3 p-4 border-b sm:border-b-0 sm:border-r ${borderColor} order-2 sm:order-1`}>
          <h3 className={`text-lg sm:text-xl font-extrabold ${textColor} mb-2 uppercase tracking-wider border-b ${borderColor} pb-2`}>
            SETTINGS
          </h3>
          <div className="flex flex-row gap-2 sm:flex-col sm:gap-0 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-lg text-center sm:text-left transition-all duration-300 pointer-events-auto ${
                  activeTab === tab
                    ? `${activeButtonBg} border ${borderColor}`
                    : `${textColor}/60 hover:${textColor} ${hoverBg}`
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-6 order-1 sm:order-2 overflow-y-auto">
          {activeTab === "TIMER" && (
            <div className="flex flex-col gap-4 sm:gap-6 mt-8">
              <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                <label className={`text-sm sm:text-base ${textColor} font-medium uppercase tracking-wider`}>
                  FOCUS TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className={`${textColor} text-center text-lg sm:text-xl w-8`}>
                    {formatMinutes(workDuration)}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleDurationChange("work", 1)}
                      className={controlButtonClass}
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleDurationChange("work", -1)}
                      className={controlButtonClass}
                      disabled={workDuration <= 60}
                    >
                      <FaChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
              <div className={`flex justify-between items-center py-2 border-b ${borderColor}`}>
                <label className={`text-sm sm:text-base ${textColor} font-medium uppercase tracking-wider`}>
                  BREAK TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className={`${textColor} text-center text-lg sm:text-xl w-8`}>
                    {formatMinutes(breakDuration)}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleDurationChange("break", 1)}
                      className={controlButtonClass}
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleDurationChange("break", -1)}
                      className={controlButtonClass}
                      disabled={breakDuration <= 60}
                    >
                      <FaChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SOUND" && (
            <div className={`text-md ${textColor}/60 uppercase mt-8`}>
              <p className="mt-2 text-sm italic">FEATURE COMING SOON.</p>
            </div>
          )}

          {activeTab === "THEME" && (
            <div className="flex flex-col gap-4 mt-8">
              <h3 className={`text-sm sm:text-base ${textColor} font-medium uppercase tracking-wider mb-2`}>
                SELECT THEME
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {themeOptions.map((themeOption) => (
                  <button
                    key={themeOption}
                    className={`${buttonClass} ${
                      theme === themeOption.toLowerCase()
                        ? `${activeButtonBg}`
                        : `${buttonBg} ${textColor} hover:${activeButtonBg.replace('bg-', 'hover:bg-').replace('text-', 'hover:text-')}`
                    }`}
                    onClick={() => setTheme(themeOption.toLowerCase() as "light" | "dark" | "system")}
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "BACKGROUND" && (
            <div className="flex flex-col gap-4 mt-8">
              <h3 className={`text-sm sm:text-base ${textColor} font-medium uppercase tracking-wider mb-2`}>
                SELECT BACKGROUND
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {backgroundOptions.map((bgOption) => (
                  <button
                    key={bgOption}
                    className={`${buttonClass} ${
                      background === bgOption
                        ? `${activeButtonBg}`
                        : `${buttonBg} ${textColor} hover:${activeButtonBg.replace('bg-', 'hover:bg-').replace('text-', 'hover:text-')}`
                    }`}
                    onClick={() => setBackground(bgOption)}
                  >
                    {bgOption}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}