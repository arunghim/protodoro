"use client";

import { usePomodoroStore } from "../store/usePomodoroStore";
import { useState, useEffect } from "react";

export default function Background() {
  const { background, theme } = usePomodoroStore();
  const [videoError, setVideoError] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");

  const getVideoUrl = (bg: string) => {
    switch (bg) {
      case "DOTS":
        return "https://motionbgs.com/media/5280/abstract-dots.960x540.mp4";
      case "LINES":
        return "https://motionbgs.com/media/5281/abstract-lines.960x540.mp4";
      case "GRID":
        return "https://motionbgs.com/media/5282/abstract-grid.960x540.mp4";
      case "WAVES":
        return "https://motionbgs.com/media/5283/abstract-waves.960x540.mp4";
      case "GRADIENT":
        return "https://motionbgs.com/media/5291/color-gradient.960x540.mp4";
      case "VIDEO":
        return "https://motionbgs.com/media/5272/small-house-in-forest.960x540.mp4";
      default:
        return "";
    }
  };

  const getBackgroundStyle = () => {
    const isLight = theme === "light";

    if (background === "SOLID" || !background) {
      return { backgroundColor: isLight ? "#ffffff" : "#000000" };
    }

    return {};
  };

  useEffect(() => {
    setVideoError(false);
    const videoUrl = getVideoUrl(background);
    setCurrentVideo(videoUrl);
  }, [background]);

  const shouldShowVideo = background !== "SOLID" && currentVideo && !videoError;

  if (shouldShowVideo) {
    return (
      <div className="fixed inset-0 z-0 w-full h-[100dvh] pointer-events-auto overflow-hidden">
        <video
          key={currentVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onError={() => setVideoError(true)}
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] pointer-events-auto overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={getBackgroundStyle()}
      />
    </div>
  );
}
