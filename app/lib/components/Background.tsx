"use client";

import { useEffect, useState } from "react";
import PixelBlast from "./PixelBlast";

export default function Background() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
          "ontouchstart" in window
      );

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 z-0 w-full h-[100dvh]">
      <PixelBlast
        variant="circle"
        pixelSize={1.5}
        color="#E5E5E5"
        patternScale={5}
        patternDensity={0.75}
        pixelSizeJitter={0.5}
        enableRipples={!isMobile}
        rippleSpeed={0.15}
        rippleThickness={0.125}
        rippleIntensityScale={0.125}
        liquid={!isMobile}
        liquidStrength={0.125}
        liquidRadius={0.125}
        liquidWobbleSpeed={0.25}
        speed={0.25}
        edgeFade={0.25}
        transparent={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
