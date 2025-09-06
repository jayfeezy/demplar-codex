"use client";
import React, { useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { characters } from "@/lib/characters";

const DemplarApp = () => {
  const [user, setUser] = useState({ role: "master" });
  const [chars, setChars] = useState(characters);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("home");
  const { favorites, toggleFavorite, isFavorite, removeFavorite } =
    useFavorites();

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

  const notify = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">❤️</span>
          My Favorite Characters
        </h3>

        {favorites.size === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-lg mb-2">No favorites yet</p>
            <p className="text-sm mb-6">
              Start adding characters to your favorites to see them here!
            </p>
            <button
              onClick={() => setTab("characters")}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
            >
              Browse Characters →
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              You have {favorites.size} favorite
              {favorites.size !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Array.from(favorites).map((charId) => {
                const char = chars.find((c) => c.id === charId);
                if (!char) return null;

                return (
                  <div key={char.id} className="relative group">
                    <button
                      onClick={() => {
                        setSel(char);
                        setTab("profile");
                        notify(`Viewing ${char.name}! ⚔️`);
                      }}
                      className="w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-400 transition-all hover:shadow-lg"
                    >
                      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                        {char.profileUrl ? (
                          <img
                            src={char.profileUrl}
                            alt={char.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`${
                            char.profileUrl ? "hidden" : "flex"
                          } w-full h-full items-center justify-center text-2xl font-bold text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200`}
                          style={char.profileUrl ? { display: "none" } : {}}
                        >
                          {char.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                            <div className="text-xs font-bold truncate">
                              {char.name}
                            </div>
                            <div className="text-xs opacity-90">
                              Lv. {char.level}
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(char.id);
                        notify(`${char.name} removed from favorites 💔`);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                      title="Remove from favorites"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemplarApp;
