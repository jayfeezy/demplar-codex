"use client";
import React, { useState } from "react";
import { ProfileImage } from "@/components/ProfileImage";
import { getFactionColors } from "@/utils/getFactionColors";
import { characters } from "@/lib/characters";

// Pure functions for character data transformation
const getFaction = (char) => (char.id === 69 ? "NPC" : char.faction);
const getPowerLevel = (char) => Math.min(char.level * 10, 1000);
const getLoreLevel = (char) => 100; // Updated lore level for all characters

// Pure functional component for the main application
const DemplarApp = () => {
  const [chars, setChars] = useState(characters);
  const [compareChars, setCompareChars] = useState([]);

  // Pure computed values (no side effects)
  const statsChars = chars.filter((c) => c.id !== 69);

  // Event handlers (side effects isolated)
  const handleToggleFavorite = (charId) => {
    toggleFavorite(charId);
    notify(
      isFavorite(charId) ? "Removed from favorites 💔" : "Added to favorites ❤️"
    );
  };

  const toggleCompare = (char) => {
    const existingIndex = compareChars.findIndex((c) => c.id === char.id);

    if (existingIndex >= 0) {
      setCompareChars(compareChars.filter((c) => c.id !== char.id));
      notify(`Removed ${char.name} from comparison 📊`);
    } else if (compareChars.length < 3) {
      setCompareChars([...compareChars, char]);
      notify(`Added ${char.name} to comparison ⚖️`);
    } else {
      notify("Maximum 3 characters for comparison! 🚫");
    }
  };

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          Character Comparison
        </h3>
        {compareChars.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">⚖️</div>
            <p className="text-lg mb-2">
              No characters selected for comparison
            </p>
            <p className="text-sm">
              Enable compare mode and click the + button next to characters to
              add them!
            </p>
            <p className="text-xs mt-2 text-gray-400">
              You can compare up to 3 characters at once
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">
                Comparing {compareChars.length} character
                {compareChars.length > 1 ? "s" : ""}
              </h4>
              <button
                onClick={() => {
                  setCompareChars([]);
                  notify("Cleared all comparisons 🗑️");
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Clear All
              </button>
            </div>

            {/* Character Cards Grid */}
            <div
              className={`grid gap-4 ${
                compareChars.length === 1
                  ? "grid-cols-1"
                  : compareChars.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {compareChars.map((char) => {
                const faction = getFaction(char);
                const colors = getFactionColors(faction);

                return (
                  <div
                    key={char.id}
                    className={`${colors.gradient} border-2 ${colors.border} rounded-xl relative`}
                  >
                    <button
                      onClick={() => toggleCompare(char)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center shadow-md"
                    >
                      ✕
                    </button>

                    {/* Character Header */}
                    <div
                      className={`bg-gradient-to-r ${colors.headerGradient} text-white p-4 rounded-t-xl`}
                    >
                      <div className="flex flex-col items-center text-center">
                        <ProfileImage
                          src={char.profileUrl}
                          alt={char.name}
                          size="w-20 h-20"
                        />
                        <h5 className="font-bold text-xl mt-3">{char.name}</h5>
                        <div className="mt-2 flex gap-2">
                          <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm">
                            Level {char.level}
                          </span>
                          <span className="bg-white/20 text-white px-3 py-1 rounded-full font-semibold text-sm">
                            {faction}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Character Details */}
                    <div className="p-4 space-y-4">
                      {/* Basic Info */}
                      <div className="space-y-2">
                        <div className={`${colors.statBg} rounded-lg p-3`}>
                          <div
                            className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}
                          >
                            Class
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            {char.className}
                          </div>
                        </div>
                        <div className={`${colors.statBg} rounded-lg p-3`}>
                          <div
                            className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}
                          >
                            Location
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            {char.location}
                          </div>
                        </div>
                      </div>

                      {/* Stats Bars */}
                      <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                        <div
                          className={`text-xs font-medium uppercase tracking-wide mb-3 ${colors.textAccent}`}
                        >
                          Combat Stats
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                Power
                              </span>
                              <span className="text-xs font-bold text-gray-800">
                                {getPowerLevel(char)}/1000
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${colors.powerBar} h-2 rounded-full transition-all duration-500`}
                                style={{
                                  width: `${
                                    (getPowerLevel(char) / 1000) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-gray-600">
                                Lore
                              </span>
                              <span className="text-xs font-bold text-gray-800">
                                {getLoreLevel(char)}/1000
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`bg-gradient-to-r ${colors.loreBar} h-2 rounded-full transition-all duration-500`}
                                style={{
                                  width: `${
                                    (getLoreLevel(char) / 1000) * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ranking Info */}
                      <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                        <div
                          className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                        >
                          Rankings
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">
                              Power Rank
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              #
                              {statsChars.filter((c) => c.level > char.level)
                                .length + 1}{" "}
                              of {statsChars.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs text-gray-600">
                              Faction Rank
                            </span>
                            <span className="text-xs font-bold text-gray-800">
                              #
                              {statsChars.filter(
                                (c) =>
                                  c.faction === char.faction &&
                                  c.level > char.level
                              ).length + 1}{" "}
                              in {faction}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Buffs */}
                      <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                        <div
                          className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                        >
                          Buffs & Abilities
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {char.buffs}
                        </p>
                      </div>

                      {/* Social */}
                      {char.twitterHandle && (
                        <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                          <div
                            className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                          >
                            Social
                          </div>
                          <a
                            href={`https://x.com/${char.twitterHandle.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm font-semibold ${colors.textAccent} hover:opacity-80 transition-opacity`}
                          >
                            {char.twitterHandle}
                          </a>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="pt-2 space-y-2">
                        <button
                          onClick={() => {
                            setSel(char);
                            setTab("profile");
                            notify(`Viewing ${char.name}! ⚔️`);
                          }}
                          className={`w-full ${colors.button} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
                        >
                          View Full Profile
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(char.id)}
                          className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                            isFavorite(char.id)
                              ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {isFavorite(char.id)
                            ? "❤️ Favorited"
                            : "🤍 Add to Favorites"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparison Summary Table */}
            {compareChars.length > 1 && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-lg font-semibold mb-4 text-gray-800">
                  Quick Comparison
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-3 text-gray-600 font-medium">
                          Attribute
                        </th>
                        {compareChars.map((char) => (
                          <th
                            key={char.id}
                            className="text-center py-2 px-3 text-gray-800 font-bold"
                          >
                            {char.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-600">Level</td>
                        {compareChars.map((char) => (
                          <td
                            key={char.id}
                            className="text-center py-2 px-3 font-semibold"
                          >
                            {char.level}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-600">Faction</td>
                        {compareChars.map((char) => (
                          <td key={char.id} className="text-center py-2 px-3">
                            {char.faction}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-600">Power</td>
                        {compareChars.map((char) => (
                          <td key={char.id} className="text-center py-2 px-3">
                            {getPowerLevel(char)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-600">Lore</td>
                        {compareChars.map((char) => (
                          <td key={char.id} className="text-center py-2 px-3">
                            {getLoreLevel(char)}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 text-gray-600">
                          Overall Rank
                        </td>
                        {compareChars.map((char) => (
                          <td key={char.id} className="text-center py-2 px-3">
                            #
                            {statsChars.filter((c) => c.level > char.level)
                              .length + 1}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemplarApp;
