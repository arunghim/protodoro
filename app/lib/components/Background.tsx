"use client";

import { usePomodoroStore } from "../store/usePomodoroStore";

export default function Background() {
  const { background } = usePomodoroStore();

  const getBackgroundStyle = () => {
    switch (background) {
      case "DOTS":
        return { backgroundImage: 'url("/backgrounds/dots.png")' };
      case "LINES":
        return { backgroundImage: 'url("/backgrounds/lines.png")' };
      case "GRID":
        return { backgroundImage: 'url("/backgrounds/grid.png")' };
      case "WAVES":
        return { backgroundImage: 'url("/backgrounds/waves.png")' };
      case "SOLID":
        return { backgroundColor: '#1a1a1a' };
      case "GRADIENT":
        return { 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        };
      default:
        return { backgroundImage: 'url("/backgrounds/dots.png")' };
    }
  };

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh] pointer-events-auto overflow-hidden">
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={getBackgroundStyle()}
      />
    </div>
  );
}
