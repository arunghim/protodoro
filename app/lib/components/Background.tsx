"use client";

import { usePomodoroStore } from "../store/usePomodoroStore";
import { useMemo } from "react";

export default function Background() {
  const { background, theme } = usePomodoroStore();

  const imageUrl = useMemo(() => {
    switch (background) {
      case "DOTS":
        return "";
      case "LINES":
        return "";
      case "GRID":
        return "";
      case "WAVES":
        return "";
      case "GRADIENT":
        return "";
      default:
        return "";
    }
  }, [background]);

  const isLight = theme === "light";

  const style = useMemo(() => {
    if (!imageUrl || background === "SOLID") {
      return { backgroundColor: isLight ? "#ffffff" : "#000000" };
    }

    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }, [imageUrl, background, isLight]);

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] pointer-events-none overflow-hidden">
      <div
        className="w-full h-full transition-all duration-500"
        style={style}
      />
    </div>
  );
}