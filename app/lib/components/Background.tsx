"use client";

import { usePomodoroStore } from "../store/usePomodoroStore";
import { useMemo } from "react";

export default function Background() {
  const { background, theme } = usePomodoroStore();

  const imageUrl = useMemo(() => {
    switch (background) {
      case "MOUNTAINS":
        return "/backgrounds/mountains.jpg";
      case "FOREST":
        return "/backgrounds/forest.jpg";
      case "STEPS":
        return "/backgrounds/steps.jpg";
      case "SHOP":
        return "/backgrounds/shop.jpg";
      case "LIGHTS":
        return "/backgrounds/lights.jpg";
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
