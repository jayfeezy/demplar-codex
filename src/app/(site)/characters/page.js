"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { ProfileImage } from "@/components/ProfileImage";
import { PowerBar } from "@/components/PowerBar";
import { LoreBar } from "@/components/LoreBar";
import { getFactionColors } from "@/utils/getFactionColors";
import { useChar } from "@/providers/CharProvider";
import { useNotif } from "@/providers/NotifProvider";
import clsx from "clsx";
import { urlFor } from "@/sanity/lib/image";
import { slugify } from "@/utils/slugify";

const getFaction = (char) => (char._id === 69 ? "NPC" : char.faction);
const getPowerLevel = (char) => Math.min(char.level * 10, 1000);
const getLoreLevel = (char) => 100;

const DemplarApp = () => {
  const { chars, setChars, sel, setSel, compChar, setCompChar } = useChar();
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [levelFilter, setLevelFilter] = useState("all");
  const [factionFilter, setFactionFilter] = useState("all");
  const { toggleFavorite, isFavorite } = useFavorites();
  const [compareMode, setCompareMode] = useState(false);
  const { notify } = useNotif();

  // Pure function for filtering characters
  const getFilteredChars = () => {
    let filtered = chars.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c?.className?.toLowerCase().includes(search.toLowerCase());

      const levelRanges = {
        "1-10": [1, 10],
        "11-20": [11, 20],
        "21-30": [21, 30],
        "31-40": [31, 40],
        "41-50": [41, 50],
        "50+": [51, Infinity],
      };

      const matchesLevel =
        levelFilter === "all" ||
        (levelRanges[levelFilter] &&
          c.level >= levelRanges[levelFilter][0] &&
          c.level <= levelRanges[levelFilter][1]);

      const matchesFaction =
        factionFilter === "all" || c.faction === factionFilter;

      return matchesSearch && matchesLevel && matchesFaction;
    });

    filtered.sort((a, b) => {
      const aFav = isFavorite(a._id);
      const bFav = isFavorite(b._id);
      if (aFav !== bFav) return bFav - aFav;
      if (a.level !== b.level) return b.level - a.level;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  };

  const filtered = getFilteredChars();

  const toggleCompare = (char) => {
    const existingIndex = compChar.findIndex((c) => c._id === char._id);

    if (existingIndex >= 0) {
      setCompChar(compChar.filter((c) => c._id !== char._id));
      notify(`Removed ${char.name} from comparison 📊`);
    } else if (compChar.length < 3) {
      setCompChar([...compChar, char]);
      notify(`Added ${char.name} to comparison ⚖️`);
    } else {
      notify("Maximum 3 characters for comparison! 🚫");
    }
  };
  return (
    <>
      <div className="space-y-6">
        <div className="relative w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShow(true)}
                onBlur={() => setTimeout(() => setShow(false), 200)}
                className="bg-white text-black pl-10 pr-4 py-2 rounded border-2 border-yellow-600 focus:border-yellow-400 w-full"
              />
            </div>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-white text-black px-3 py-2 rounded border-2 border-yellow-600 focus:border-yellow-400"
            >
              <option value="all">All Levels</option>
              <option value="1-10">Level 1-10</option>
              <option value="11-20">Level 11-20</option>
              <option value="21-30">Level 21-30</option>
              <option value="31-40">Level 31-40</option>
              <option value="41-50">Level 41-50</option>
              <option value="50+">Level 50+</option>
            </select>
            <select
              value={factionFilter}
              onChange={(e) => setFactionFilter(e.target.value)}
              className="bg-white text-black px-3 py-2 rounded border-2 border-yellow-600 focus:border-yellow-400"
            >
              <option value="all">All Factions</option>
              <option value="Demplar">Demplar</option>
              <option value="Pond">Pond</option>
              <option value="Pork">Pork</option>
            </select>
            <button
              onClick={() => setShow(!show)}
              className="bg-yellow-600 text-black px-3 py-2 rounded hover:bg-yellow-500 w-full sm:w-auto"
            >
              <ChevronDown
                className={clsx(
                  `w-5 h-5 transition-transform mx-auto sm:mx-0`,
                  show ? "rotate-180" : ""
                )}
              />
            </button>
            <button
              onClick={() => {
                setCompareMode(!compareMode);
                notify(
                  compareMode
                    ? "Compare mode disabled 📊"
                    : "Compare mode enabled! Click + next to characters to compare ⚖️"
                );
                if (!compareMode) setCompChar([]);
              }}
              className={clsx(
                `px-3 py-2 rounded w-full sm:w-auto transition-all hover:opacity-80`,
                compareMode
                  ? "bg-purple-600 text-white"
                  : "bg-gray-600 text-white"
              )}
            >
              ⚖️ Compare {compChar.length > 0 && `(${compChar.length})`}
            </button>
            {show && filtered && filtered.length >= 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-yellow-600 rounded shadow-lg max-h-60 sm:max-h-80 overflow-y-auto z-50">
                {filtered.map((c) => (
                  <div
                    key={c._id}
                    className={clsx(
                      `w-full text-left px-4 py-3 hover:bg-yellow-50 border-b flex items-center space-x-3`,
                      sel && sel._id === c._id ? "bg-yellow-100" : ""
                    )}
                  >
                    <Link
                      onClick={() => {
                        setSel(c);
                        setShow(false);
                        setSearch("");
                        notify(`Viewing ${c.name}'s profile! ⚔️`);
                      }}
                      href={`/characters/${slugify(c.name)}`}
                      className="flex items-center space-x-3 flex-1"
                    >
                      <ProfileImage
                        src={
                          c?.cardImage
                            ? urlFor(c?.cardImage).width(150).height(150).url()
                            : ""
                        }
                        alt={c.name}
                        size="w-8 h-8 sm:w-10 sm:h-10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {c.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          Level {c.level} • {c.className}
                        </div>
                      </div>
                      {/* <div className="text-xs text-gray-400">#{c._id}</div> */}
                    </Link>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(c._id);
                          notify(
                            isFavorite(c._id)
                              ? "Removed from favorites 💔"
                              : "Added to favorites ❤️"
                          );
                        }}
                        className={clsx(
                          `p-1 rounded hover:text-red-500`,
                          isFavorite(c._id) ? "text-red-500" : "text-gray-400"
                        )}
                        title={
                          isFavorite(c._id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        {isFavorite(c._id) ? "❤️" : "🤍"}
                      </button>
                      {compareMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompare(c);
                          }}
                          className={clsx(
                            `p-1 rounded text-xs font-bold transition-all`,
                            compChar.find((ch) => ch._id === c._id)
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-600 hover:bg-purple-100"
                          )}
                          title={
                            compChar.find((ch) => ch._id === c._id)
                              ? "Remove from comparison"
                              : "Add to comparison"
                          }
                        >
                          {compChar.find((ch) => ch._id === c._id) ? "✓" : "+"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-6 text-gray-500 text-center">
                    No characters found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span className="mr-3">👥</span>
              Character Database
              <span className="ml-auto text-sm font-normal text-gray-500">
                Showing {filtered.length} of {chars.length} characters
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((char) => {
                const faction = getFaction(char);
                const colors = getFactionColors(faction);

                return (
                  <div
                    key={char._id}
                    className={clsx(
                      `rounded-xl p-6 hover:shadow-xl transition-all duration-300 border-2 hover:-translate-y-1`,
                      colors.gradient,
                      colors.border
                    )}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <ProfileImage
                        src={
                          char?.cardImage
                            ? urlFor(char?.cardImage)
                                .width(150)
                                .height(150)
                                .url()
                            : ""
                        }
                        alt={char.name}
                        size="w-16 h-16"
                      />
                      <div className="flex-1 min-w-0">
                        <h4
                          className={clsx(
                            `font-bold text-lg truncate mb-2`,
                            colors.textAccent
                          )}
                        >
                          {char.name}
                        </h4>
                        <div
                          className={clsx(
                            `text-sm font-bold px-3 py-1 rounded-full text-white inline-block mb-1 shadow-md`,
                            colors.levelBg
                          )}
                        >
                          Level {char.level}
                        </div>
                        <div
                          className={clsx(
                            `text-xs font-semibold px-2 py-1 rounded-full text-white inline-block uppercase tracking-wide shadow-sm`,
                            colors.factionBg
                          )}
                        >
                          {faction?.name}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleFavorite(char._id);
                          notify(
                            isFavorite(char._id)
                              ? "Removed from favorites 💔"
                              : "Added to favorites ❤️"
                          );
                        }}
                        className={clsx(
                          `p-2 rounded-full transition-all duration-200 shadow-sm`,
                          isFavorite(char._id)
                            ? "text-red-500 bg-red-50 hover:bg-red-100"
                            : "text-gray-400 bg-white/50 hover:bg-white hover:text-red-400"
                        )}
                      >
                        {isFavorite(char._id) ? "❤️" : "🤍"}
                      </button>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div
                        className={clsx(
                          `rounded-lg p-3 border bg-white/70`,
                          colors.borderAccent
                        )}
                      >
                        <div
                          className={clsx(
                            `text-xs font-medium uppercase tracking-wide mb-1`,
                            colors.textAccent
                          )}
                        >
                          Class
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {char.className}
                        </div>
                      </div>
                      <div
                        className={clsx(
                          `rounded-lg p-3 border bg-white/70`,
                          colors.borderAccent
                        )}
                      >
                        <div
                          className={clsx(
                            `text-xs font-medium uppercase tracking-wide mb-1`,
                            colors.textAccent
                          )}
                        >
                          Location
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {char?.location?.name}
                        </div>
                      </div>

                      <div
                        className={clsx(
                          `bg-white/70 rounded-lg p-3 border`,
                          colors.borderAccent
                        )}
                      >
                        <div
                          className={clsx(
                            `text-xs font-medium uppercase tracking-wide mb-2`,
                            colors.textAccent
                          )}
                        >
                          Character Stats
                        </div>
                        <div className="space-y-2">
                          <PowerBar
                            value={getPowerLevel(char)}
                            faction={faction?.name}
                            className="w-full"
                          />
                          <LoreBar
                            value={getLoreLevel(char)}
                            faction={faction?.name}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        onClick={() => {
                          setSel(char);
                          notify(`Viewing ${char.name}! ⚔️`);
                        }}
                        // href="profile"
                        href={`/characters/${slugify(char.name)}`}
                        className={clsx(
                          `flex-1 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg`,
                          colors.button
                        )}
                      >
                        View Profile
                      </Link>
                      {compareMode && (
                        <button
                          onClick={() => toggleCompare(char)}
                          className={clsx(
                            `px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200`,
                            compChar.find((c) => c._id === char._id)
                              ? "bg-purple-600 text-white shadow-md"
                              : "bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-600"
                          )}
                        >
                          {compChar.find((c) => c._id === char._id) ? "✓" : "+"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-lg">No characters found</p>
                <p className="text-sm">
                  Try adjusting your search or filter settings
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DemplarApp;
