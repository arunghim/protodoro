"use client";

import { useEffect, useRef, useState } from "react";
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
  } = usePomodoroStore();

  const [activeTab, setActiveTab] = useState("TIMER");
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

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

  const tabs = ["TIMER", "SOUND", "THEME"];

  const controlButtonClass =
    "p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors";

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50">
      <div
        ref={overlayRef}
        className="w-[500px] min-h-[350px] flex border border-white/30 rounded-2xl bg-black/80 backdrop-blur-xl shadow-2xl transition-all duration-300 relative font-mono"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          aria-label="CLOSE SETTINGS"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex flex-col w-1/3 p-4 border-r border-white/20">
          <h3 className="text-xl font-extrabold text-white mb-2 uppercase tracking-wider border-b border-white/20 pb-2">
            SETTINGS
          </h3>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-bold rounded-lg text-left transition-all duration-300 ${
                activeTab === tab
                  ? "text-white border border-white/30 hover:bg-white/5"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 flex flex-col gap-6">
          {activeTab === "TIMER" && (
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex justify-between items-center">
                <label className="text-base text-white font-medium uppercase tracking-wider">
                  FOCUS TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white text-center text-xl w-8">
                    {formatMinutes(workDuration)}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleDurationChange("work", 1)}
                      className={controlButtonClass}
                      aria-label="INCREASE FOCUS TIME"
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleDurationChange("work", -1)}
                      className={controlButtonClass}
                      disabled={workDuration <= 60}
                      aria-label="DECREASE FOCUS TIME"
                    >
                      <FaChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <label className="text-base text-white font-medium uppercase tracking-wider">
                  BREAK TIME
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-white text-center text-xl w-8">
                    {formatMinutes(breakDuration)}
                  </span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleDurationChange("break", 1)}
                      className={controlButtonClass}
                      aria-label="INCREASE BREAK TIME"
                    >
                      <FaChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleDurationChange("break", -1)}
                      className={controlButtonClass}
                      disabled={breakDuration <= 60}
                      aria-label="DECREASE BREAK TIME"
                    >
                      <FaChevronDown size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "SOUND" && (
            <div className="text-md text-white/60 uppercase mt-8">
              <p className="mt-2 text-sm italic">FEATURE COMING SOON.</p>
            </div>
          )}

          {activeTab === "THEME" && (
            <div className="text-md text-white/60 uppercase mt-8">
              <p className="mt-2 text-sm italic">FEATURE COMING SOON.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
