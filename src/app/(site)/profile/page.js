"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Share } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { ProfileImage } from "@/components/ProfileImage";
import { PowerBar } from "@/components/PowerBar";
import { LoreBar } from "@/components/LoreBar";
import { getFactionColors } from "@/utils/getFactionColors";
import { useNotif } from "@/providers/NotifProvider";
import { useChar } from "@/providers/CharProvider";
import clsx from "clsx";
import { urlFor } from "@/sanity/lib/image";
import { useMeta } from "@/providers/MetaContext";
// need to clsx this page still

// Pure functions for character data transformation
const getFaction = (char) => (char.id === 69 ? "NPC" : char.faction);
const getPowerLevel = (char) => Math.min(char.level * 10, 1000);
const getLoreLevel = (char) => 100; // Updated lore level for all characters
// Pure functional component for the main application
const DemplarApp = () => {
  const { notify } = useNotif();
  const { chars, setChars, sel, setSel } = useChar();
  const { favorites, toggleFavorite, isFavorite, removeFavorite } =
    useFavorites();
  const { setTitle, setDescription } = useMeta();

  useEffect(() => {
    setTitle("Profile");
    //setDescription("Knights Demplar");
  }, [setTitle, setDescription]);

  // Pure computed values (no side effects)
  const statsChars = chars.filter((c) => c.id !== 69);

  // Event handlers (side effects isolated)
  const handleToggleFavorite = (charId) => {
    toggleFavorite(charId);
    notify(
      isFavorite(charId) ? "Removed from favorites 💔" : "Added to favorites ❤️"
    );
  };

  const shareCharacter = (char) => {
    const url = `${window.location.origin}/?char=${char.id}`;
    const text = `Check out ${char.name} - Level ${char.level} ${char.className} from Demplar! ⚔️`;

    if (navigator.share) {
      navigator.share({ title: `${char.name} - Demplar`, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      notify("Character link copied to clipboard! 📋");
    }
  };

  return (
    <>
      {!sel && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Character Selected
              </h3>
              <p className="text-gray-600 mb-8">
                Choose a character to view their detailed profile
              </p>

              <Link
                href="/characters"
                className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
              >
                Browse Characters →
              </Link>
            </div>
          </div>
        </div>
      )}

      {sel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow border">
            {(() => {
              const faction = getFaction(sel);
              const colors = getFactionColors(faction?.name);

              return (
                <>
                  <div
                    className={clsx(
                      `bg-gradient-to-r text-white p-6 rounded-t-xl`,
                      colors.headerGradient
                    )}
                  >
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                      <div className="flex-shrink-0">
                        <ProfileImage
                          src={urlFor(sel?.cardImage)
                            .width(150)
                            .height(150)
                            .url()}
                          alt={sel.name}
                          size="w-24 h-24 sm:w-32 sm:h-32"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-3xl sm:text-4xl font-bold mb-3">
                          {sel.name}
                        </h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                          <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg">
                            Level {sel.level}
                          </div>
                          <div className="bg-white/20 text-white px-4 py-2 rounded-full font-semibold">
                            {faction?.name}
                          </div>
                        </div>

                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                          <div className="text-sm font-medium text-white/90 uppercase tracking-wide mb-3">
                            Character Stats
                          </div>
                          <div className="space-y-3">
                            <PowerBar
                              value={getPowerLevel(sel)}
                              faction={faction?.name}
                              className="w-full"
                            />
                            <LoreBar
                              value={getLoreLevel(sel)}
                              faction={faction?.name}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className={`${colors.statBg} rounded-lg p-4`}>
                        <div
                          className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                        >
                          Class
                        </div>
                        <div className={`text-lg font-bold text-gray-800`}>
                          {sel.className}
                        </div>
                      </div>
                      <div className={`${colors.statBg} rounded-lg p-4`}>
                        <div
                          className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                        >
                          Location
                        </div>
                        <div className={`text-lg font-bold text-gray-800`}>
                          {sel.location?.name}
                        </div>
                      </div>
                      {sel.twitterHandle && (
                        <div
                          className={`${colors.statBg} rounded-lg p-4 sm:col-span-2`}
                        >
                          <div
                            className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}
                          >
                            Social Media
                          </div>
                          <a
                            href={`https://x.com/${sel.twitterHandle.replace(
                              "@",
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-lg font-bold ${colors.textAccent} hover:opacity-80 transition-colors`}
                          >
                            {sel.twitterHandle}
                          </a>
                        </div>
                      )}
                    </div>

                    <div
                      className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}
                    >
                      <h4
                        className={`text-lg font-bold mb-4 flex items-center ${colors.textAccent}`}
                      >
                        <span className="mr-2">📊</span>
                        Detailed Character Statistics
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-medium ${colors.textAccent}`}
                              >
                                Combat Power
                              </span>
                            </div>
                            <PowerBar
                              value={getPowerLevel(sel)}
                              faction={faction?.name}
                              className="w-full"
                            />
                            <div className="text-xs text-slate-600 mt-2">
                              Based on level and combat experience
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-sm font-medium ${colors.textAccent}`}
                              >
                                Lore Knowledge
                              </span>
                            </div>
                            <LoreBar
                              value={getLoreLevel(sel)}
                              faction={faction?.name}
                              className="w-full"
                            />
                            <div className="text-xs text-slate-600 mt-2">
                              Understanding of Demplar mysteries
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white rounded-lg p-4 border border-slate-100">
                            <div className="text-sm font-medium text-slate-700 mb-3">
                              Character Metrics
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Experience Level
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {sel.level}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Power Rank
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {statsChars.filter((c) => c.level > sel.level)
                                    .length + 1}{" "}
                                  of {statsChars.length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Faction
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {faction?.name}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Has Profile Image
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {sel.profileUrl ? "Yes" : "No"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border border-slate-100">
                            <div className="text-sm font-medium text-slate-700 mb-3">
                              Power Breakdown
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Base Power
                                </span>
                                <span
                                  className={`text-xs font-bold ${colors.textAccent}`}
                                >
                                  {Math.min(sel.level * 8, 800)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-slate-600">
                                  Experience Bonus
                                </span>
                                <span
                                  className={`text-xs font-bold ${colors.textAccent}`}
                                >
                                  {Math.min(sel.level * 2, 200)}
                                </span>
                              </div>
                              <div className="border-t border-slate-200 pt-1 mt-2">
                                <div className="flex justify-between">
                                  <span className="text-xs font-medium text-slate-700">
                                    Power Status
                                  </span>
                                  <span
                                    className={`text-xs font-bold ${colors.textAccent}`}
                                  >
                                    Active
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}
                    >
                      <h4
                        className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}
                      >
                        <span className="mr-2">⚔️</span>
                        Abilities & Techniques
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-purple-100">
                        {sel.skills && sel.skills.length > 0 ? (
                          <ul className="space-y-2 text-gray-700">
                            {sel.skills.map((tag, idx) => (
                              <li key={idx}>
                                {idx + 1}. {tag}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 italic">
                            No Abilities or Techniques available
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}
                    >
                      <h4
                        className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}
                      >
                        <span className="mr-2">✨</span>
                        Signature Traits
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-amber-100">
                        {sel.talents && sel.talents.length > 0 ? (
                          <ul className="space-y-2 text-gray-700">
                            {sel.talents.map((tag, idx) => (
                              <li key={idx}>
                                {idx + 1}. {tag}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 italic">
                            No Traits available
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}
                    >
                      <h4
                        className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}
                      >
                        <span className="mr-2">⚡</span>
                        Character Buffs & Abilities
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-green-100">
                        {sel.buffs && sel.buffs.length > 0 ? (
                          <ul className="space-y-2 text-gray-700">
                            {sel.buffs.map((tag, idx) => (
                              <li key={idx}>
                                {idx + 1}. {tag}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500 italic">
                            No Traits available
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}
                    >
                      <h4
                        className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}
                      >
                        <span className="mr-2">🔗</span>
                        Pond0x Referral Link
                      </h4>
                      <div className="bg-white rounded-lg p-4 border border-blue-100">
                        {sel?.pondRefCode ? (
                          <a
                            href={`https://www.pond0x.com/swap/solana?ref=${sel?.pondRefCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${colors.textAccent} hover:opacity-80 font-semibold underline transition-opacity`}
                          >
                            {sel?.name}&apos;s Pond0x Referral Link
                          </a>
                        ) : (
                          <span className="text-gray-500 italic">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>

          <div className="bg-white rounded-xl shadow border p-6">
            {(() => {
              const faction = getFaction(sel);
              const colors = getFactionColors(faction);

              return (
                <>
                  <h4 className="font-bold mb-4 flex items-center justify-between">
                    <span>Quick Actions</span>
                    <button
                      onClick={() => handleToggleFavorite(sel.id)}
                      className={`p-2 rounded ${
                        isFavorite(sel.id)
                          ? "text-red-500 bg-red-50"
                          : "text-gray-400 bg-gray-50"
                      } hover:text-red-500`}
                    >
                      {isFavorite(sel.id) ? "❤️" : "🤍"}
                    </button>
                  </h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => shareCharacter(sel)}
                      className={`w-full px-4 py-2 ${colors.button} text-white rounded hover:opacity-90 flex items-center justify-center space-x-2 transition-all`}
                    >
                      <Share className="w-4 h-4" />
                      <span>Share Character</span>
                    </button>

                    <div
                      className={`bg-gradient-to-br ${colors.profileBg} rounded-lg p-4 border ${colors.borderAccent}`}
                    >
                      <h5 className={`font-semibold mb-3 ${colors.textAccent}`}>
                        Stats Overview
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-xs font-medium ${colors.textAccent}`}
                            >
                              Power
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${colors.powerBar} h-2 rounded-full transition-all duration-500`}
                              style={{
                                width: `${(getPowerLevel(sel) / 1000) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span
                              className={`text-xs font-medium ${colors.textAccent}`}
                            >
                              Lore
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${colors.loreBar} h-2 rounded-full transition-all duration-500`}
                              style={{
                                width: `${(getLoreLevel(sel) / 1000) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setSel(null);
                          notify("Returned to character selection 🔙");
                        }}
                        className={`w-full ${colors.button} text-white px-6 py-3 rounded-lg hover:opacity-90 font-semibold transition-all flex items-center justify-center space-x-2`}
                      >
                        <span>←</span>
                        <span>Back to Character Selection</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default DemplarApp;
