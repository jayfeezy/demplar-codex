"use client";
// Pure function for faction color schemes
export const getFactionColors = (faction) => {
  const colorSchemes = {
    Demplar: {
      gradient: "bg-gradient-to-br from-red-50 via-gray-50 to-gray-100",
      border: "border-red-300 hover:border-red-500",
      levelBg: "bg-gradient-to-r from-red-600 to-gray-600",
      factionBg: "bg-gradient-to-r from-gray-500 to-gray-700",
      button:
        "bg-gradient-to-r from-red-600 via-red-700 to-gray-600 hover:from-red-700 hover:via-red-800 hover:to-gray-700",
      textAccent: "text-red-700",
      borderAccent: "border-red-200",
      powerBar: "from-red-400 via-red-500 to-gray-600",
      loreBar: "from-gray-400 via-red-500 to-red-600",
      headerGradient: "from-red-600 to-gray-700",
      profileBg: "from-red-50 to-gray-50",
      statBg: "bg-red-50 border-red-200",
    },
    Pork: {
      gradient: "bg-gradient-to-br from-black via-gray-800 to-pink-100",
      border: "border-pink-300 hover:border-pink-500",
      levelBg: "bg-gradient-to-r from-black to-pink-600",
      factionBg: "bg-gradient-to-r from-pink-600 to-pink-400",
      button:
        "bg-gradient-to-r from-black via-gray-800 to-pink-600 hover:from-gray-900 hover:via-gray-700 hover:to-pink-700",
      textAccent: "text-pink-700",
      borderAccent: "border-pink-200",
      powerBar: "from-black via-gray-700 to-pink-500",
      loreBar: "from-pink-400 via-pink-500 to-black",
      headerGradient: "from-black to-pink-600",
      profileBg: "from-gray-900 to-pink-50",
      statBg: "bg-pink-50 border-pink-200",
    },
    Pond: {
      gradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-green-100",
      border: "border-green-300 hover:border-green-500",
      levelBg: "bg-gradient-to-r from-blue-600 to-green-600",
      factionBg: "bg-gradient-to-r from-green-600 to-green-400",
      button:
        "bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 hover:from-blue-700 hover:via-blue-800 hover:to-green-700",
      textAccent: "text-green-700",
      borderAccent: "border-green-200",
      powerBar: "from-blue-400 via-blue-500 to-green-600",
      loreBar: "from-green-400 via-emerald-500 to-blue-600",
      headerGradient: "from-blue-600 to-green-600",
      profileBg: "from-blue-50 to-green-50",
      statBg: "bg-green-50 border-green-200",
    },
    NPC: {
      gradient: "bg-gradient-to-br from-gray-50 to-white",
      border: "border-gray-300 hover:border-gray-500",
      levelBg: "bg-blue-600",
      factionBg: "bg-gray-500",
      button:
        "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
      textAccent: "text-gray-700",
      borderAccent: "border-gray-200",
      powerBar: "from-gray-400 via-gray-500 to-gray-600",
      loreBar: "from-gray-400 via-gray-500 to-gray-600",
      headerGradient: "from-gray-600 to-gray-700",
      profileBg: "from-gray-50 to-white",
      statBg: "bg-gray-50 border-gray-200",
    },
  };

  return colorSchemes[faction] || colorSchemes["NPC"];
};
