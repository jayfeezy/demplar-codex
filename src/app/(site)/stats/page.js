"use client";
import React, { useEffect } from "react";
import clsx from "clsx";
import { useChar } from "@/providers/CharProvider";
import { useMeta } from "@/providers/MetaContext";

// Pure functional component for the main application
const DemplarApp = () => {
  const { chars } = useChar();
  const { setTitle, setDescription } = useMeta();

  useEffect(() => {
    setTitle("Stats");
    //setDescription("Knights Demplar");
  }, [setTitle, setDescription]);

  // Pure computed values (no side effects)
  const statsChars = chars.filter((c) => c.id !== 69);
  const stats = {
    total: statsChars.length,
    avg: Math.round(
      statsChars.reduce((s, c) => s + c.level, 0) / statsChars.length
    ),
    max: Math.max(...statsChars.map((c) => c.level)),
    imgs: statsChars.filter((c) => c.profileUrl).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Overall Database Statistics
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          <div className="text-center p-3 sm:p-6 bg-blue-50 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-xs sm:text-sm text-blue-700">
              Total Characters
            </div>
          </div>
          <div className="text-center p-3 sm:p-6 bg-green-50 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {stats.avg}
            </div>
            <div className="text-xs sm:text-sm text-green-700">
              Overall Avg Level
            </div>
          </div>
          <div className="text-center p-3 sm:p-6 bg-yellow-50 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {stats.max}
            </div>
            <div className="text-xs sm:text-sm text-yellow-700">
              Highest Level
            </div>
          </div>
          {/* <div className="text-center p-3 sm:p-6 bg-purple-50 rounded-xl">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600">
              {stats.imgs}
            </div>
            <div className="text-xs sm:text-sm text-purple-700">
              With Images
            </div>
          </div> */}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Faction Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {(() => {
            // Calculate faction statistics
            const factionStats = {};

            // Filter out NPC/Unknown characters and group by faction
            chars
              .filter((c) => c.id !== 69 && c?.faction?.name !== "NPC")
              .forEach((char) => {
                if (!factionStats[char?.faction?.name]) {
                  factionStats[char?.faction?.name] = {
                    characters: [],
                    totalLevel: 0,
                    count: 0,
                    highestChar: null,
                  };
                }

                factionStats[char?.faction?.name].characters.push(char);
                factionStats[char?.faction?.name].totalLevel += char.level;
                factionStats[char?.faction?.name].count++;

                if (
                  !factionStats[char?.faction?.name].highestChar ||
                  char.level >
                    factionStats[char?.faction?.name].highestChar.level
                ) {
                  factionStats[char?.faction?.name].highestChar = char;
                }
              });

            // Define faction order and colors
            const factionOrder = ["Demplar", "Pond", "Pork", "Undecided"];
            const factionColors = {
              Demplar: {
                bg: "bg-gradient-to-br from-red-50 to-gray-50",
                border: "border-red-200",
                accent: "text-red-700",
                statBg: "bg-red-100",
                icon: "⚔️",
              },
              Pond: {
                bg: "bg-gradient-to-br from-blue-50 to-green-50",
                border: "border-green-200",
                accent: "text-green-700",
                statBg: "bg-green-100",
                icon: "🌊",
              },
              Pork: {
                bg: "bg-gradient-to-br from-pink-50 to-gray-50",
                border: "border-pink-200",
                accent: "text-pink-700",
                statBg: "bg-pink-100",
                icon: "🐷",
              },
              Undecided: {
                bg: "bg-gradient-to-br from-purple-50 to-gray-50",
                border: "border-purple-200",
                accent: "text-purple-700",
                statBg: "bg-purple-100",
                icon: "❓",
              },
            };

            return factionOrder
              .map((faction) => {
                const stats = factionStats[faction];
                const colors = factionColors[faction];

                if (!stats) return null;

                const avgLevel = Math.round(stats.totalLevel / stats.count);

                return (
                  <div
                    key={faction}
                    className={clsx(
                      `rounded-xl p-4 sm:p-6 border-2`,
                      colors.bg,
                      colors.border
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4
                        className={clsx(
                          `text-lg sm:text-xl font-bold`,
                          colors.accent
                        )}
                      >
                        {faction}
                      </h4>
                      <span className="text-2xl">{colors.icon}</span>
                    </div>

                    <div className="space-y-3">
                      <div className={clsx(colors.statBg, `rounded-lg p-3`)}>
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Average Level
                        </div>
                        <div
                          className={clsx(`text-2xl font-bold`, colors.accent)}
                        >
                          {avgLevel}
                        </div>
                      </div>

                      <div className={clsx(`rounded-lg p-3`, colors.statBg)}>
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Total Members
                        </div>
                        <div
                          className={clsx(`text-2xl font-bold`, colors.accent)}
                        >
                          {stats.count}
                        </div>
                      </div>

                      <div className={clsx(`rounded-lg p-3`, colors.statBg)}>
                        <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                          Highest Level
                        </div>
                        <div className={clsx(`font-bold`, colors.accent)}>
                          <div className="text-lg">
                            {stats.highestChar.name}
                          </div>
                          <div className="text-xl">
                            Level {stats.highestChar.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
              .filter(Boolean);
          })()}
        </div>
      </div>
    </div>
  );
};

export default DemplarApp;
