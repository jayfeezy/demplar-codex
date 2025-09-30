"use client";
import React, { useState } from "react";

export const ProfileImage = ({ src, alt, size = "w-8 h-8" }) => {
  const [error, setError] = useState(false);
  if (!src || src.trim() === "" || error) {
    return (
      // <div
      //   className={`${size} rounded-xl bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-gray-300 shadow-lg`}
      // >
      //   {alt
      //     ?.split(" ")
      //     .map((n) => n[0])
      //     .join("")
      //     .substring(0, 2)
      //     .toUpperCase() || "NA"}
      // </div>
      <img
        src="https://cdn.sanity.io/images/b8j3518v/production/9f8b24620df68414a0b8046f1f7d02e7ba440ce4-286x291.png"
        alt={alt}
        className={`${size} rounded-xl object-cover border-2 border-yellow-400 shadow-lg`}
        onError={() => setError(true)}
      />
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
