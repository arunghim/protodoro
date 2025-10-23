"use client";

import PixelBlast from "./PixelBlast";

export default function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <PixelBlast
        variant="circle"
        pixelSize={6}
        color="#FFFFFF"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
