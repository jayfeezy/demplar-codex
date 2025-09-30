"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotif } from "@/providers/NotifProvider";
import { useChar } from "@/providers/CharProvider";
import clsx from "clsx";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { slugify } from "@/utils/slugify";
import { useMeta } from "@/providers/MetaContext";

const DemplarApp = () => {
  const { chars, setChars, sel, setSel } = useChar();
  const { favorites, toggleFavorite, isFavorite, removeFavorite } =
    useFavorites();
  const { notify } = useNotif();
  const { setTitle, setDescription } = useMeta();

  useEffect(() => {
    setTitle("Favorites");
    //setDescription("Knights Demplar");
  }, [setTitle, setDescription]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <span className="mr-3">❤️</span>
          My Favorite Characters
        </h3>

        {(!favorites &&
          ![...favorites].filter((e) =>
            chars.find((f) => {
              f._id = e;
            })
          )) ||
        favorites.size === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">💔</div>
            <p className="text-lg mb-2">No favorites yet</p>
            <p className="text-sm mb-6">
              Start adding characters to your favorites to see them here!
            </p>
            <Link
              href="characters"
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
            >
              Browse Characters →
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-gray-600">
              You have{" "}
              {!!favorites.size &&
                [...favorites].filter((e) => chars.find((f) => f._id === e))
                  .length}{" "}
              favorite
              {favorites.size !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {Array.from(favorites).map((charId) => {
                const char = chars.find((c) => c._id === charId);
                if (!char) return null;

                return (
                  <div key={char._id} className="relative group">
                    <Link
                      onClick={() => {
                        // setSel(char);
                        notify(`Viewing ${char.name}! ⚔️`);
                      }}
                      href={`/characters/${slugify(char.name)}`}
                      className="inline-block w-full aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-red-400 transition-all hover:shadow-lg"
                    >
                      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                        {char?.cardImage ? (
                          // Update to next Image component
                          <img
                            src={
                              char?.cardImage
                                ? urlFor(char?.cardImage)
                                    .width(250)
                                    .height(250)
                                    .url()
                                : ""
                            }
                            alt={char.name || ""}
                            className="w-full h-full object-cover"
                            // onError={(e) => {
                            //   e.target.style.display = "none";
                            //   e.target.nextSibling.style.display = "flex";
                            // }}
                          />
                        ) : (
                          <img
                            src={urlFor(
                              "https://cdn.sanity.io/images/b8j3518v/production/9f8b24620df68414a0b8046f1f7d02e7ba440ce4-286x291.png"
                            )
                              .width(250)
                              .height(250)
                              .url()}
                            alt={char.name || ""}
                            className="w-full h-full object-cover"
                            // onError={(e) => {
                            //   e.target.style.display = "none";
                            //   e.target.nextSibling.style.display = "flex";
                            // }}
                          />
                        )}
                        <div
                          className={clsx(
                            `
                            w-full h-full items-center justify-center text-2xl font-bold text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200`,

                            char.profileUrl ? "hidden" : "flex"
                          )}
                          style={char.profileUrl ? { display: "none" } : {}}
                        >
                          {char.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>

                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          oldClass="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
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
                    </Link>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(char._id);
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
