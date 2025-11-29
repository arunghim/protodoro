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
    longBreakDuration,
    onBreak,
    isLongBreak,
    setWorkDuration,
    setBreakDuration,
    setLongBreakDuration,
    timeLeft,
    setTimeLeft,
    background,
    setBackground,
    theme,
    setTheme,
    alarmSound,
    setAlarmSound,
  } = usePomodoroStore();

  const [activeTab, setActiveTab] = useState("TIMER");

  if (!show) return null;

  const formatMinutes = (seconds: number) => Math.floor(seconds / 60);

  const handleDurationChange = (
    mode: "work" | "break" | "longBreak",
    change: number
  ) => {
    const currentDuration =
      mode === "work"
        ? workDuration
        : mode === "break"
        ? breakDuration
        : longBreakDuration;

    const setDuration =
      mode === "work"
        ? setWorkDuration
        : mode === "break"
        ? setBreakDuration
        : setLongBreakDuration;

    const isActiveMode =
      (mode === "work" && !onBreak) ||
      (mode === "break" && onBreak && !isLongBreak) ||
      (mode === "longBreak" && isLongBreak);

    const newMinutes = Math.max(1, formatMinutes(currentDuration) + change);
    const newDuration = newMinutes * 60;

    if (newDuration === currentDuration) return;

    const diff = newDuration - currentDuration;
    setDuration(newDuration);

    if (isActiveMode) {
      setTimeLeft(timeLeft + diff);
    }
  };

  const playSoundPreview = (soundId: string) => {
    const audio = new Audio(`/sounds/${soundId}.mp3`);
    audio.play().catch(() => {
      const beep = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
      );
      beep.play();
    });
  };

  const handleSoundSelect = (soundId: string) => {
    setAlarmSound(soundId);
    playSoundPreview(soundId);
  };

  const tabs = ["TIMER", "SOUND", "THEME", "BACKGROUND"];

  const isLight = theme === "light";
  const bgColor = isLight ? "bg-white/80" : "bg-black/80";
  const textColor = isLight ? "text-black" : "text-white";
  const borderColor = isLight ? "border-black/30" : "border-white/30";
  const hoverBg = isLight ? "hover:bg-black/10" : "hover:bg-white/10";
  const activeButtonBg = isLight
    ? "bg-black text-white"
    : "bg-white text-black";
  const buttonBg = isLight ? "bg-white/40" : "bg-black/40";

  const controlButtonClass = `p-1.5 ${textColor}/80 hover:${textColor} ${hoverBg} rounded transition-colors pointer-events-auto`;

  const backgroundOptions = [
    "DOTS",
    "LINES",
    "GRID",
    "WAVES",
    "SOLID",
    "GRADIENT",
    "VIDEO",
  ];

  const themeOptions = ["LIGHT", "DARK", "SYSTEM"];

  const soundOptions = [
    { id: "bell", name: "BELL" },
    { id: "chime", name: "CHIME" },
    { id: "digital", name: "DIGITAL" },
    { id: "nature", name: "NATURE" },
  ];

  const buttonClass = `px-6 py-3 border ${borderColor} rounded-full uppercase font-bold transition-colors pointer-events-auto`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
      <div
        className="w-full max-w-[500px] h-[65vh] max-h-[550px] flex flex-col sm:flex-row border border-gray-300 rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl transition-all duration-300 relative font-mono overflow-hidden"
        style={{
          backgroundColor: isLight
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(0, 0, 0, 0.9)",
          borderColor: isLight
            ? "rgba(0, 0, 0, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
        }}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 ${textColor}/70 hover:${textColor} transition-colors z-10 pointer-events-auto`}
          aria-label="CLOSE SETTINGS"
        >
          <FaTimes size={20} />
        </button>

        <div
          className={`flex flex-col w-full sm:w-1/3 p-4 border-b sm:border-b-0 sm:border-r ${borderColor} overflow-y-auto scrollbar-hide`}
        >
          <h3
            className={`text-lg font-extrabold ${textColor} mb-3 uppercase tracking-wider border-b ${borderColor} pb-2 flex-shrink-0`}
          >
            SETTINGS
          </h3>
          <div className="flex flex-row gap-2 sm:flex-col sm:gap-1 overflow-x-auto sm:overflow-x-visible pb-1 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 py-2 px-3 text-sm font-bold rounded-lg text-center sm:text-left transition-all duration-300 pointer-events-auto ${
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

        <div className="flex-1 p-4 sm:p-5 flex flex-col overflow-y-auto scrollbar-hide">
          {activeTab === "TIMER" && (
            <div className="flex flex-col gap-4">
              <div
                className={`flex justify-between items-center py-2 border-b ${borderColor} mt-12`}
              >
                <label
                  className={`text-sm ${textColor} font-medium uppercase tracking-wider`}
                >
                  FOCUS TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className={`${textColor} text-center text-lg w-8`}>
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
              <div
                className={`flex justify-between items-center py-2 border-b ${borderColor}`}
              >
                <label
                  className={`text-sm ${textColor} font-medium uppercase tracking-wider`}
                >
                  BREAK TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className={`${textColor} text-center text-lg w-8`}>
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
              <div
                className={`flex justify-between items-center py-2 border-b ${borderColor}`}
              >
                <label
                  className={`text-sm ${textColor} font-medium uppercase tracking-wider`}
                >
                  LONG BREAK
                </label>
                <div className="flex items-center gap-2">
                  <span className={`${textColor} text-center text-lg w-8`}>
                    {formatMinutes(longBreakDuration)}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleDurationChange("longBreak", 1)}
                      className={controlButtonClass}
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleDurationChange("longBreak", -1)}
                      className={controlButtonClass}
                      disabled={longBreakDuration <= 60}
                    >
                      <FaChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SOUND" && (
            <div className="flex flex-col gap-3">
              <h3
                className={`text-sm ${textColor} font-medium uppercase tracking-wider mb-3`}
              >
                ALARM SOUND
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {soundOptions.map((sound) => (
                  <button
                    key={sound.id}
                    className={`${buttonClass} ${
                      alarmSound === sound.id
                        ? `${activeButtonBg}`
                        : `${buttonBg} ${textColor} hover:${activeButtonBg
                            .replace("bg-", "hover:bg-")
                            .replace("text-", "hover:text-")}`
                    }`}
                    onClick={() => handleSoundSelect(sound.id)}
                  >
                    {sound.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "THEME" && (
            <div className="flex flex-col gap-3">
              <h3
                className={`text-sm ${textColor} font-medium uppercase tracking-wider mb-3`}
              >
                SELECT THEME
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {themeOptions.map((themeOption) => (
                  <button
                    key={themeOption}
                    className={`${buttonClass} ${
                      theme === themeOption.toLowerCase()
                        ? `${activeButtonBg}`
                        : `${buttonBg} ${textColor} hover:${activeButtonBg
                            .replace("bg-", "hover:bg-")
                            .replace("text-", "hover:text-")}`
                    }`}
                    onClick={() =>
                      setTheme(
                        themeOption.toLowerCase() as "light" | "dark" | "system"
                      )
                    }
                  >
                    {themeOption}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "BACKGROUND" && (
            <div className="flex flex-col gap-3">
              <h3
                className={`text-sm ${textColor} font-medium uppercase tracking-wider mb-3`}
              >
                SELECT BACKGROUND
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {backgroundOptions.map((bgOption) => (
                  <button
                    key={bgOption}
                    className={`${buttonClass} ${
                      background === bgOption
                        ? `${activeButtonBg}`
                        : `${buttonBg} ${textColor} hover:${activeButtonBg
                            .replace("bg-", "hover:bg-")
                            .replace("text-", "hover:text-")}`
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
