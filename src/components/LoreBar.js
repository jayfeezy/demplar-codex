"use client";
import React from "react";
import { getFactionColors } from "@/utils/getFactionColors";

// Pure functional component for lore bars
export const LoreBar = ({
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
          className={`h-full bg-gradient-to-r ${colors.loreBar} transition-all duration-1000 ease-out shadow-lg relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-t from-transparent via-white/20 to-white/30 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold opacity-70">?</span>
          </div>
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
        Lore
      </div>
    </div>
  );
};
