"use client";
import { useState, useEffect } from "react";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    // Make sure window exists (browser environment)
    if (typeof window === "undefined") return new Set();

    try {
      const saved = localStorage.getItem("demplarFavorites");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error("Error loading favorites:", error);
      return new Set();
    }
  });

  // Persist favorites whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "demplarFavorites",
        JSON.stringify(Array.from(favorites))
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

  const toggleFavorite = (charId) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      if (newFavs.has(charId)) {
        newFavs.delete(charId);
      } else {
        newFavs.add(charId);
      }
      return newFavs;
    });
  };

  const isFavorite = (charId) => favorites.has(charId);

  const removeFavorite = (charId) => {
    setFavorites((prev) => {
      const newFavs = new Set(prev);
      newFavs.delete(charId);
      return newFavs;
    });
  };

  return { favorites, toggleFavorite, isFavorite, removeFavorite };
};
