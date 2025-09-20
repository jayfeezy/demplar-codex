"use client";
import React from "react";
import Link from "next/link";
import { characters } from "@/lib/characters";
import { useNotif } from "@/providers/NotifProvider";
import { useChar } from "@/providers/CharProvider";
import { useDark } from "@/providers/DarkProvider";
import clsx from "clsx";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { slugify } from "@/utils/slugify";
import { useRouter } from "next/navigation";

const DemplarApp = () => {
  const { notify } = useNotif();
  const { chars, setSel } = useChar();
  const { darkMode } = useDark();
  const router = useRouter();

  // Pure computed values (no side effects)
  const statsChars = chars.filter((c) => c._id !== 69);
  const stats = {
    total: statsChars.length,
    avg: Math.round(
      statsChars.reduce((s, c) => s + c.level, 0) / statsChars.length
    ),
    max: Math.max(...statsChars.map((c) => c.level)),
    imgs: statsChars.filter((c) => c.profileUrl).length,
  };

  return (
    <div className="space-y-8">
      <div
        className={clsx(
          `rounded-xl shadow-xl p-8 sm:p-12 transition-colors duration-300`,
          darkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
            : "bg-gradient-to-br from-purple-900 to-purple-800 text-white"
        )}
      >
        <div className="text-center">
          <div
            className={clsx(
              `text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-300`,
              darkMode ? "text-gray-300" : "text-purple-200"
            )}
          >
            Welcome to
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">
            ⚔️ The Demplar Codex ⚔️
          </h1>
          <p
            className={clsx(
              `text-2xl sm:text-3xl font-bold tracking-wide mb-8 transition-colors duration-300`,
              darkMode ? "text-gray-100" : "text-purple-100"
            )}
          >
            Home of the legendary Demplarverse
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              [stats.total, "Characters"],
              [stats.avg, "Avg Level"],
              // Update news to context
              // ["2 News Articles"],
            ].map(([value, label]) => (
              <div key={label} className="bg-white/20 px-6 py-3 rounded-lg">
                <span className="text-yellow-300 font-bold text-lg">
                  {value || <LoadingSpinner />}
                </span>
                <div
                  className={clsx(
                    `text-sm transition-colors duration-300`,
                    darkMode ? "text-gray-300" : "text-purple-200"
                  )}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Leaderboard Preview Section */}
      <div className="bg-white rounded-xl shadow-xl border p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center text-gray-800">
          <span className="mr-3">🏆</span>
          Leaderboard Highlights
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Top 3 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
            <h3 className="text-lg font-bold mb-4 text-yellow-800 flex items-center">
              <span className="mr-2">👑</span>
              Top 3 Overall Champions
            </h3>
            <div className="space-y-3">
              {(() => {
                const topOverall = [...chars]
                  .filter((c) => c.id !== 69)
                  .sort((a, b) => b.level - a.level)
                  .slice(0, 3);

                const medals = ["🥇", "🥈", "🥉"];

                return topOverall.map((char, index) => (
                  <Link
                    key={char._id}
                    onClick={(e) => {
                      setSel(char);
                      notify(`Viewing ${char.name}! ⚔️`);
                    }}
                    href={`/characters/${slugify(char.name)}`}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg hover:bg-yellow-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{medals[index]}</span>
                      <div className="text-left">
                        <div className="font-bold text-gray-800 group-hover:text-yellow-700">
                          {char.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {char.className}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-yellow-600">
                        Lv. {char.level}
                      </div>
                      <div className="text-xs text-gray-500">
                        {char.faction.name}
                      </div>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          </div>

          {/* Faction Leaders */}
          <div className="space-y-4">
            {(() => {
              const factions = ["Demplar", "Pond", "Pork"];
              const factionColors = {
                Demplar: {
                  bg: "from-red-50 to-gray-50",
                  border: "border-red-200",
                  title: "text-red-800",
                  hover: "hover:bg-red-50",
                  level: "text-red-600",
                  icon: "⚔️",
                },
                Pond: {
                  bg: "from-blue-50 to-green-50",
                  border: "border-green-200",
                  title: "text-green-800",
                  hover: "hover:bg-green-50",
                  level: "text-green-600",
                  icon: "🌊",
                },
                Pork: {
                  bg: "from-pink-50 to-gray-50",
                  border: "border-pink-200",
                  title: "text-pink-800",
                  hover: "hover:bg-pink-50",
                  level: "text-pink-600",
                  icon: "🐷",
                },
              };

              return factions.map((faction) => {
                const factionChars = chars
                  .filter(
                    (c) =>
                      c?.faction?.name?.toLowerCase() ===
                        faction?.toLowerCase() && c._id !== 69
                  )
                  .sort((a, b) => b.level - a.level)
                  .slice(0, 2);

                const colors = factionColors[faction];

                return (
                  <div
                    key={faction}
                    className={clsx(
                      `bg-gradient-to-br rounded-lg p-4 border-2`,
                      colors.bg,
                      colors.border
                    )}
                  >
                    <h4
                      className={clsx(
                        `text-sm font-bold mb-3 flex items-center`,
                        colors.title
                      )}
                    >
                      <span className="mr-2">{colors.icon}</span>
                      {faction} Leaders
                    </h4>
                    <div className="space-y-2">
                      {factionChars.map((char, index) => (
                        <Link
                          key={char._id}
                          onClick={() => {
                            setSel(char);
                            notify(`Viewing ${char.name}! ⚔️`);
                          }}
                          href={`/characters/${slugify(char.name)}`}
                          className={clsx(
                            `w-full flex items-center justify-between p-2 bg-white rounded hover:shadow-md transition-all group`,
                            colors.hover
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-gray-500">
                              #{index + 1}
                            </span>
                            <div className="text-left">
                              <div className="text-sm font-bold text-gray-800 group-hover:text-gray-900">
                                {char.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-[120px]">
                                {char.className}
                              </div>
                            </div>
                          </div>
                          <div
                            className={clsx(`text-lg font-bold`, colors.level)}
                          >
                            Lv. {char.level}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="characters"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            View Full Character Rankings →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Link
          onClick={(e) => {
            e.preventDefault();
            const randomChar =
              characters[Math.floor(Math.random() * characters.length)];
            notify(`Surprise! Viewing ${randomChar.name} 🎲`);
            router.push(`/characters/${slugify(randomChar.name)}`);
          }}
          href="#"
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
            🎲
          </div>
          <div className="font-bold text-lg text-blue-800 mb-2">
            Random Character
          </div>
          <div className="text-sm text-blue-600">Discover someone new!</div>
        </Link>

        <Link
          href="characters"
          className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:border-red-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
            👥
          </div>
          <div className="font-bold text-lg text-red-800 mb-2">
            Browse Characters
          </div>
          <div className="text-sm text-red-600">Search & explore all!</div>
        </Link>

        <Link
          href="news"
          className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
            📰
          </div>
          <div className="font-bold text-lg text-green-800 mb-2">
            Latest News
          </div>
          <div className="text-sm text-green-600">Read the updates!</div>
        </Link>

        <Link
          href="compare"
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
            ⚖️
          </div>
          <div className="font-bold text-lg text-purple-800 mb-2">
            Compare Heroes
          </div>
          <div className="text-sm text-purple-600">Battle analysis!</div>
        </Link>

        <Link
          href="suggestions"
          className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
        >
          <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
            📧
          </div>
          <div className="font-bold text-lg text-orange-800 mb-2">
            Send Feedback
          </div>
          <div className="text-sm text-orange-600">Share your ideas!</div>
        </Link>
      </div>
    </div>
  );
};

export default DemplarApp;
