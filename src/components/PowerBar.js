"use client";
import React from "react";
import { getFactionColors } from "@/utils/getFactionColors";

// Pure functional component for power bars
export const PowerBar = ({
  value,
  max = 1000,
  className = "",
  faction = "NPC",
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const ticks = Array.from({ length: 21 }, (_, i) => i * 5);
  const colors = getFactionColors(faction);

  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className={`h-full bg-gradient-to-r ${colors.powerBar} transition-all duration-1000 ease-out shadow-lg`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-t from-transparent via-white/20 to-white/30 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {ticks.map((tick) => (
            <div
              key={tick}
              className="w-px h-2 bg-white/40"
              style={{ marginLeft: tick === 0 ? "0" : "-0.5px" }}
            />
          ))}
        </div>
      </div>
      <div
        className={`text-xs font-semibold mt-1 text-center ${colors.textAccent}`}
      >
        Power
      </div>
    </div>
  );
};
