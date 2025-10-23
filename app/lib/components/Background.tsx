"use client";

import PixelBlast from "./PixelBlast";

export default function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <PixelBlast
        variant="circle"
        pixelSize={1.5}
        color="##D3D3D3"
        patternScale={5}
        patternDensity={0.5}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.15}
        rippleThickness={1.5}
        rippleIntensityScale={2.5}
        liquid
        liquidStrength={1.25}
        liquidRadius={1.25}
        liquidWobbleSpeed={5}
        speed={0.5}
        edgeFade={0.25}
        transparent
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
