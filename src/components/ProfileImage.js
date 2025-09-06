"use client";
import React, { useState } from "react";

export const ProfileImage = ({ src, alt, size = "w-8 h-8" }) => {
  const [error, setError] = useState(false);
  if (!src || src.trim() === "" || error) {
    return (
      <div
        className={`${size} rounded-xl bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-gray-300 shadow-lg`}
      >
        {alt
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() || "NA"}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`${size} rounded-xl object-cover border-2 border-yellow-400 shadow-lg`}
      onError={() => setError(true)}
    />
  );
};
