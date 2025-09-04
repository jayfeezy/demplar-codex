import React, { useState, useEffect } from 'react';
import { User, Shield, LogOut, ChevronDown, Search, Eye, Settings, Download, Share } from 'lucide-react';

// Custom hook for managing favorites with localStorage
const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('demplarFavorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (error) {
      console.error('Error loading favorites:', error);
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('demplarFavorites', JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [favorites]);

  const toggleFavorite = (charId) => {
    setFavorites(prev => {
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
    setFavorites(prev => {
      const newFavs = new Set(prev);
      newFavs.delete(charId);
      return newFavs;
    });
  };

  return { favorites, toggleFavorite, isFavorite, removeFavorite };
};

// Pure component for profile images with error handling
const ProfileImage = ({ src, alt, size = "w-8 h-8" }) => {
  const [error, setError] = useState(false);
  if (!src || src.trim() === '' || error) {
    return (
      <div className={`${size} rounded-xl bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-gray-300 shadow-lg`}>
        {alt?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NA'}
      </div>
    );
  }
  return <img src={src} alt={alt} className={`${size} rounded-xl object-cover border-2 border-yellow-400 shadow-lg`} onError={() => setError(true)} />;
};

// News Article Component
const NewsArticle = ({ entry, index, isLatest, onDelete, canDelete }) => {
  const [showFull, setShowFull] = useState(false);
  const previewLength = 300; // Characters to show in preview
  const isLongArticle = entry.content.length > previewLength;
  
  // Process content for better formatting
  const formatContent = (content) => {
    // Split by double line breaks for paragraphs
    const paragraphs = content.split(/\n\n+/);
    
    return paragraphs.map((paragraph, pIndex) => {
      // Check for horizontal rule
      if (paragraph.trim() === '---') {
        return <hr key={pIndex} className="my-6 border-gray-300" />;
      }
      
      // Check for bullet points
      if (paragraph.trim().startsWith('•')) {
        const items = paragraph.split('\n').filter(line => line.trim().startsWith('•'));
        return (
          <ul key={pIndex} className="list-none space-y-2 my-4">
            {items.map((item, iIndex) => (
              <li key={iIndex} className="flex">
                <span className="mr-2 text-gray-500">•</span>
                <span className="flex-1">{item.replace(/^•\s*/, '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={pIndex} className="leading-relaxed mb-4 last:mb-0">
          {paragraph.split('\n').map((line, lIndex) => (
            <React.Fragment key={lIndex}>
              {line}
              {lIndex < paragraph.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };
  
  return (
    <article
      className={`rounded-xl border-2 transition-all hover:shadow-lg duration-300 ${
        isLatest 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300'
          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Article Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-start space-x-3 mb-3">
              <h4 className={`text-xl lg:text-2xl font-bold leading-tight ${
                isLatest ? 'text-blue-800' : 'text-gray-800'
              }`}>
                {entry.title}
              </h4>
              {isLatest && (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 text-blue-800 whitespace-nowrap mt-1">
                  Latest
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>📅</span>
                <time dateTime={entry.date}>
                  {new Date(entry.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </div>
              <div className="flex items-center space-x-1">
                <span>✍️</span>
                <span>{entry.author}</span>
              </div>
              {entry.content.length > 500 && (
                <div className="flex items-center space-x-1">
                  <span>📖</span>
                  <span>{Math.ceil(entry.content.split(' ').length / 200)} min read</span>
                </div>
              )}
            </div>
          </div>

          {canDelete && (
            <button
              onClick={() => onDelete(entry.id)}
              className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 ml-4"
              title="Delete article"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className={`px-6 pb-6 ${isLatest ? 'text-gray-700' : 'text-gray-600'}`}>
        {isLongArticle && !showFull ? (
          <>
            <div className="prose prose-sm sm:prose-base max-w-none">
              <p className="leading-relaxed">
                {entry.content.substring(0, previewLength)}...
              </p>
            </div>
            <button
              onClick={() => setShowFull(true)}
              className={`mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ${
                isLatest 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <span>📖</span>
              <span>Read Full Article</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <div className="prose prose-sm sm:prose-base max-w-none">
              <div className="article-content">
                {formatContent(entry.content)}
              </div>
            </div>
            {isLongArticle && (
              <button
                onClick={() => setShowFull(false)}
                className={`mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-all inline-flex items-center gap-2 ${
                  isLatest 
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <span>📖</span>
                <span>Show Less</span>
                <ChevronDown className="w-4 h-4 rotate-180" />
              </button>
            )}
          </>
        )}
      </div>
    </article>
  );
};

// Pure functional component for power bars
const PowerBar = ({ value, max = 1000, className = "", faction = "NPC" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const ticks = Array.from({ length: 21 }, (_, i) => i * 5);
  const colors = getFactionColors(faction);
  
  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r ${colors.powerBar} transition-all duration-1000 ease-out shadow-lg`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-t from-transparent via-white/20 to-white/30 animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {ticks.map(tick => (
            <div 
              key={tick}
              className="w-px h-2 bg-white/40"
              style={{ marginLeft: tick === 0 ? '0' : '-0.5px' }}
            />
          ))}
        </div>
      </div>
      <div className={`text-xs font-semibold mt-1 text-center ${colors.textAccent}`}>Power</div>
    </div>
  );
};

// Pure functional component for lore bars
const LoreBar = ({ value, max = 1000, className = "", faction = "NPC" }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const ticks = Array.from({ length: 21 }, (_, i) => i * 5);
  const colors = getFactionColors(faction);
  
  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div 
          className={`h-full bg-gradient-to-r ${colors.loreBar} transition-all duration-1000 ease-out shadow-lg relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-gradient-to-t from-transparent via-white/20 to-white/30 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-xs font-bold opacity-70">?</span>
          </div>
        </div>
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {ticks.map(tick => (
            <div 
              key={tick}
              className="w-px h-2 bg-white/40"
              style={{ marginLeft: tick === 0 ? '0' : '-0.5px' }}
            />
          ))}
        </div>
      </div>
      <div className={`text-xs font-semibold mt-1 text-center ${colors.textAccent}`}>Lore</div>
    </div>
  );
};

// Pure functions for character data transformation
const getFaction = (char) => char.id === 69 ? 'NPC' : char.faction;
const getPowerLevel = (char) => Math.min(char.level * 10, 1000);
const getLoreLevel = (char) => 100; // Updated lore level for all characters

// Pure function for faction color schemes
const getFactionColors = (faction) => {
  const colorSchemes = {
    'Demplar': {
      gradient: 'bg-gradient-to-br from-red-50 via-gray-50 to-gray-100',
      border: 'border-red-300 hover:border-red-500',
      levelBg: 'bg-gradient-to-r from-red-600 to-gray-600',
      factionBg: 'bg-gradient-to-r from-gray-500 to-gray-700',
      button: 'bg-gradient-to-r from-red-600 via-red-700 to-gray-600 hover:from-red-700 hover:via-red-800 hover:to-gray-700',
      textAccent: 'text-red-700',
      borderAccent: 'border-red-200',
      powerBar: 'from-red-400 via-red-500 to-gray-600',
      loreBar: 'from-gray-400 via-red-500 to-red-600',
      headerGradient: 'from-red-600 to-gray-700',
      profileBg: 'from-red-50 to-gray-50',
      statBg: 'bg-red-50 border-red-200'
    },
    'Pork': {
      gradient: 'bg-gradient-to-br from-black via-gray-800 to-pink-100',
      border: 'border-pink-300 hover:border-pink-500',
      levelBg: 'bg-gradient-to-r from-black to-pink-600',
      factionBg: 'bg-gradient-to-r from-pink-600 to-pink-400',
      button: 'bg-gradient-to-r from-black via-gray-800 to-pink-600 hover:from-gray-900 hover:via-gray-700 hover:to-pink-700',
      textAccent: 'text-pink-700',
      borderAccent: 'border-pink-200',
      powerBar: 'from-black via-gray-700 to-pink-500',
      loreBar: 'from-pink-400 via-pink-500 to-black',
      headerGradient: 'from-black to-pink-600',
      profileBg: 'from-gray-900 to-pink-50',
      statBg: 'bg-pink-50 border-pink-200'
    },
    'Pond': {
      gradient: 'bg-gradient-to-br from-blue-50 via-blue-100 to-green-100',
      border: 'border-green-300 hover:border-green-500',
      levelBg: 'bg-gradient-to-r from-blue-600 to-green-600',
      factionBg: 'bg-gradient-to-r from-green-600 to-green-400',
      button: 'bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 hover:from-blue-700 hover:via-blue-800 hover:to-green-700',
      textAccent: 'text-green-700',
      borderAccent: 'border-green-200',
      powerBar: 'from-blue-400 via-blue-500 to-green-600',
      loreBar: 'from-green-400 via-emerald-500 to-blue-600',
      headerGradient: 'from-blue-600 to-green-600',
      profileBg: 'from-blue-50 to-green-50',
      statBg: 'bg-green-50 border-green-200'
    },
    'NPC': {
      gradient: 'bg-gradient-to-br from-gray-50 to-white',
      border: 'border-gray-300 hover:border-gray-500',
      levelBg: 'bg-blue-600',
      factionBg: 'bg-gray-500',
      button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      textAccent: 'text-gray-700',
      borderAccent: 'border-gray-200',
      powerBar: 'from-gray-400 via-gray-500 to-gray-600',
      loreBar: 'from-gray-400 via-gray-500 to-gray-600',
      headerGradient: 'from-gray-600 to-gray-700',
      profileBg: 'from-gray-50 to-white',
      statBg: 'bg-gray-50 border-gray-200'
    }
  };
  
  return colorSchemes[faction] || colorSchemes['NPC'];
};

// Immutable character data
const characters = [
  { id: 1, name: "Rachel", level: 26, className: "Ninja Archivist", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Reem_Reviews" },
  { id: 2, name: "Versteckt", level: 1, className: "Submarine Builder", faction: "Pond", location: "Exit of Hatenashi", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@0xVersteckt" },
  { id: 3, name: "Rolla", level: 1, className: "Demplar", faction: "Pond", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@rollablazer" },
  { id: 4, name: "Alex", level: 30, className: "Fairy Berserker", faction: "Demplar", location: "Luminous", profileUrl: "https://images.ctfassets.net/b474hutgbdbv/2V3dKNSD41QjeLowfolcG3/e9a4eb087190d640b9c6c982a17480d4/image.png", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Alexgill81" },
  { id: 5, name: "Inspired", level: 11, className: "El Shooter", faction: "Pork", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Inspired6910" },
  { id: 6, name: "CertifiedLoverBull", level: 16, className: "Korathax, Golden Titan", faction: "Demplar", location: "Labrynth", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Certified0x" },
  { id: 7, name: "Tommy", level: 17, className: "Flame Assassin", faction: "Demplar", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 8, name: "True Warrior", level: 10, className: "Crown of the Dying Suns", faction: "Demplar", location: "Labrynth", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@itstruewarrior" },
  { id: 9, name: "Denojah", level: 26, className: "Pip Captain", faction: "Pond", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@DenOJah" },
  { id: 10, name: "Sir Nemo", level: 31, className: "Demplar Samurai", faction: "Demplar", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@GhostHorama" },
  { id: 11, name: "MDK", level: 11, className: "Pond Enigma", faction: "Pond", location: "Labrynth", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@mdk0x" },
  { id: 12, name: "American Hearts", level: 9, className: "Phunk Knight", faction: "Pork", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@DragYourShadow" },
  { id: 13, name: "Chair", level: 14, className: "Phunk Knight", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@vrycmfy" },
  { id: 14, name: "Jest", level: 12, className: "Jester", faction: "Pork", location: "Watchtower", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Albertletour" },
  { id: 15, name: "Meggy", level: 17, className: "Counter Culture Martial Artist", faction: "Demplar", location: "Thieves Den", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@MeggyKr" },
  { id: 16, name: "Wicked", level: 10, className: "Jerks Adventurer", faction: "Demplar", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@WICKEDNESS4Eva" },
  { id: 17, name: "Ponderer", level: 11, className: "Steampunk", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@inthepondwater" },
  { id: 18, name: "2Na", level: 8, className: "Mercenary", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@halon_1211" },
  { id: 19, name: "Blood E", level: 18, className: "Vampire Ninja", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@BigDaddyErac" },
  { id: 20, name: "Yoss0x", level: 12, className: "Phunk Knight", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Yoss0x2" },
  { id: 21, name: "Sizzler", level: 12, className: "Comrade Knight", faction: "Pork", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Sizzler187" },
  { id: 22, name: "MCO Wolf", level: 23, className: "Bloodmoon Reaver", faction: "Pond", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@MCOWOLF101" },
  { id: 23, name: "IfiHad", level: 10, className: "Mystic Troubadour", faction: "Pond", location: "Empathic Forgotten Quarry", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@DuncanDunkk" },
  { id: 24, name: "Aft3rparty", level: 10, className: "Mfpurr Knight", faction: "Demplar", location: "Thieves Den Main Rooms", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@aft3rpartyeth_" },
  { id: 25, name: "ThisNthat", level: 13, className: "Negotiator", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@this_n_that0x" },
  { id: 26, name: "Nexus", level: 13, className: "Tank", faction: "Demplar", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@nexuscsail" },
  { id: 27, name: "Vucci", level: 10, className: "Water Mage", faction: "Demplar", location: "Tavern", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Vucc1_VMG" },
  { id: 28, name: "Toss & Boerboel", level: 10, className: "Tank", faction: "Pond", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 29, name: "ArtOfKula", level: 11, className: "Disco Mage", faction: "Pork", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@theartofkula" },
  { id: 30, name: "Pylons", level: 20, className: "Phunk Knight", faction: "Pond", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@PylonsXPP" },
  { id: 31, name: "Dustin", level: 15, className: "Luminara", faction: "Pond", location: "Meltdown Island", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@ThatDustinShow" },
  { id: 32, name: "Cary", level: 20, className: "Phunk Knight", faction: "Pond", location: "Great Stone Quarry", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Cary0x2" },
  { id: 33, name: "Lasagna Techno Pirate", level: 25, className: "Rogue", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@nf_talk" },
  { id: 34, name: "WhiteCrypto", level: 5, className: "Ninja", faction: "Demplar", location: "Watchtower", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 35, name: "Sparrow", level: 41, className: "Solo Warden", faction: "Pond", location: "Luminous", profileUrl: "", buffs: "Training +5%, +5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Sparrow_X_" },
  { id: 36, name: "Rangiku", level: 40, className: "Blade Healer", faction: "Demplar", location: "Luminous", profileUrl: "https://images.ctfassets.net/b474hutgbdbv/3AYkauQlVdSQfVvdWtmaT/895be1409a709d60553bb820c213d45f/Rangiku.jpg", buffs: "Training +5%, +5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@rangichan" },
  { id: 37, name: "4Eyes", level: 12, className: "Light Mage", faction: "Pork", location: "Impala Mountains", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 38, name: "Mr Helm", level: 30, className: "Tank", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Mrhelm4" },
  { id: 39, name: "DizzyD", level: 30, className: "Time Mage", faction: "Pond", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@dizyd_eth" },
  { id: 40, name: "Megatron Chicken", level: 32, className: "Magic Chicken", faction: "Pork", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@ChickenLuver777" },
  { id: 41, name: "Naitsirk Comrade Phunk", level: 15, className: "Healer", faction: "Pond", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@naitsirk710" },
  { id: 42, name: "Victor Smash", level: 25, className: "Brawler", faction: "Pond", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Victor_Crypto07" },
  { id: 43, name: "Jayfeezy", level: 24, className: "Arcane Mage", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@JayFeezy" },
  { id: 44, name: "Von The Techsavvy", level: 37, className: "Time Traveler", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@vonZZZZZZZZZ" },
  { id: 45, name: "yuTj telluhwat Knight", level: 11, className: "Adventurer", faction: "Pork", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@I_lov_tj" },
  { id: 46, name: "Will Billy The Hill Billy", level: 23, className: "Stormcloak Farmer", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@willparkskc8puw" },
  { id: 47, name: "Fork Knight", level: 52, className: "Time Traveler", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@N___d____Y__" },
  { id: 48, name: "Ranger The Potato Knight", level: 15, className: "Tank", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@TheePotato_King" },
  { id: 49, name: "Kold Dragon", level: 32, className: "Dragon Knight", faction: "Demplar", location: "Luminous", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@OGkolddragon" },
  { id: 50, name: "Raptor", level: 12, className: "Mythical Beast", faction: "Demplar", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@TheRaptorRoost" },
  { id: 51, name: "Sumdog", level: 8, className: "Knight", faction: "Pork", location: "Badlands", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Sumdog9879" },
  { id: 52, name: "Paul The Blacksmith", level: 23, className: "Blacksmith", faction: "Pork", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 53, name: "AGZ Mage Thief", level: 13, className: "Portal User", faction: "Demplar", location: "Sewer 8", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 54, name: "Pauly", level: 10, className: "Mysterious", faction: "Pond", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 55, name: "Classmomma", level: 5, className: "OG Miner", faction: "Pond", location: "Great Stone Quarry", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@classmomma1206" },
  { id: 56, name: "Magpie", level: 16, className: "Light Mage", faction: "Demplar", location: "Tavern", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@MagpieMeme" },
  { id: 57, name: "WTF InATruck", level: 18, className: "Knight", faction: "Pond", location: "Empathic Forgotten Water", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@wtfinatruck" },
  { id: 58, name: "UnknownAssassin", level: 15, className: "Ninja", faction: "Pork", location: "Thieves Den", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@unknownlee515" },
  { id: 59, name: "Mitchell The Brave", level: 27, className: "Sea Soned Adventurer", faction: "Pond", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@MitchellC420" },
  { id: 60, name: "Matt Furie", level: 1, className: "Illustrator", faction: "Pond", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Matt_Furie" },
  { id: 61, name: "Younghover", level: 14, className: "Emoji Ninja", faction: "Demplar", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@younghover1996" },
  { id: 63, name: "Jay Vampiric", level: 14, className: "Vampire Ninja", faction: "Pond", location: "Badlands", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 64, name: "BrewLee", level: 25, className: "Martial Artist", faction: "Pork", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@TapuBulu0x" },
  { id: 65, name: "Sir Quiet", level: 17, className: "Undead Phunk Knight", faction: "Pond", location: "Impala Mountains", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@srquiet0x" },
  { id: 66, name: "Unempyd", level: 18, className: "Knight Captain", faction: "Pond", location: "Kingdom", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@unempyd" },
  { id: 67, name: "IamDon", level: 1, className: "Support", faction: "Pond", location: "Impala Mountains", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@iAmDon_eth" },
  { id: 68, name: "Outsider", level: 7, className: "Spirit Dragoon Phunk", faction: "Demplar", location: "Badlands", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 69, name: "Unknown [NPC]", level: 800, className: "Demplar", faction: "NPC", location: "Compression of Time", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 70, name: "MJDesigns", level: 4, className: "Druid", faction: "Demplar", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 71, name: "Daniel0x", level: 32, className: "Reaper", faction: "Pond", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Deag7" },
  { id: 72, name: "Jlee", level: 12, className: "Viking Bard", faction: "Pork", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@JLEEWALLS1" },
  { id: 73, name: "RhiannonNFT", level: 2, className: "Knight", faction: "Pork", location: "Library", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@RhiannonNft" },
  { id: 74, name: "DonDennis", level: 7, className: "Demplar", faction: "Pond", location: "Tavern", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@MadProducers" },
  { id: 75, name: "Sativa", level: 7, className: "Healer", faction: "Demplar", location: "Enchanted Forest", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "" },
  { id: 76, name: "Breathe", level: 29, className: "Water Mage", faction: "Pond", location: "Dark Cave of Unknown", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@SNftbreathe" },
  { id: 77, name: "Atlantis", level: 1, className: "Demplar", faction: "Demplar", location: "Tavern", profileUrl: "", buffs: "Training +5%, Crafting +5%, +5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@Altcoin_Q" },
  { id: 78, name: "Captain Cohiba", level: 17, className: "Knight Captain", faction: "Pond", location: "Wayameru", profileUrl: "", buffs: "+5% attack, +5% defense, +5% agility, +5% critical, +5% luck, +5% magic defense", twitterHandle: "@RedHornMagnm" }
];

// Pure functional component for the main application
const DemplarApp = () => {
  // State management (isolated side effects)
  const [user, setUser] = useState(null);
  const [chars, setChars] = useState(characters);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("home");
  const [notif, setNotif] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [levelFilter, setLevelFilter] = useState("all");
  const [factionFilter, setFactionFilter] = useState("all");
  const { favorites, toggleFavorite, isFavorite, removeFavorite } = useFavorites();
  const [compareMode, setCompareMode] = useState(false);
  const [compareChars, setCompareChars] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newsEntries, setNewsEntries] = useState([
    {
      id: 2,
      date: "2025-06-16",
      title: "[The Demplar Times] The Shadowmera Crisis",
      content: "Character players had been thrown in a loop, literally. It took them 2 game nights to be free from this never ending almost game finisher... We have seen similarities of Shadowmera to Kuja from FFIX as well as similarities of Ultimecia from FFVIII, this being Shadowmera Perfect form was a player character's shadow fused with a mythical sentient being called Leonidas from the compression of time....",
      author: "@DemplarOfficial"
    },
    {
      id: 1,
      date: "2025-06-03",
      title: "The Dark Portal Expedition",
      content: "Adventurers have travelled 1 month in real-time to visit Luminous, they have been moving deep in the caverns, befriending a mythical sentient being named Leonidas, encountered a massive Luminous Golem and defeated both a Luminous Bat & a Luminous T-Rex!",
      author: "@DemplarOfficial"
    }
  ]);

  // Pure computed values (no side effects)
  const statsChars = chars.filter(c => c.id !== 69);
  const stats = { 
    total: statsChars.length, 
    avg: Math.round(statsChars.reduce((s,c) => s + c.level, 0) / statsChars.length), 
    max: Math.max(...statsChars.map(c => c.level)), 
    imgs: statsChars.filter(c => c.profileUrl).length 
  };

  // Pure function for character of the day
  const getCharacterOfDay = () => {
    const today = new Date().toDateString();
    const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return characters[seed % characters.length];
  };

  const characterOfDay = getCharacterOfDay();

  // Pure function for filtering characters
  const getFilteredChars = () => {
    let filtered = chars.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.className.toLowerCase().includes(search.toLowerCase());
      
      const levelRanges = {
        "1-10": [1, 10],
        "11-20": [11, 20], 
        "21-30": [21, 30],
        "31-40": [31, 40],
        "41-50": [41, 50],
        "50+": [51, Infinity]
      };
      
      const matchesLevel = levelFilter === "all" || 
        (levelRanges[levelFilter] && c.level >= levelRanges[levelFilter][0] && c.level <= levelRanges[levelFilter][1]);
      
      const matchesFaction = factionFilter === "all" || c.faction === factionFilter;
      
      return matchesSearch && matchesLevel && matchesFaction;
    });
    
    filtered.sort((a, b) => {
      const aFav = isFavorite(a.id);
      const bFav = isFavorite(b.id);
      if (aFav !== bFav) return bFav - aFav;
      if (a.level !== b.level) return b.level - a.level;
      return a.name.localeCompare(b.name);
    });
    
    return filtered;
  };

  const filtered = getFilteredChars();

  // Event handlers (side effects isolated)
  const handleToggleFavorite = (charId) => {
    toggleFavorite(charId);
    notify(isFavorite(charId) ? 'Removed from favorites 💔' : 'Added to favorites ❤️');
  };

  const toggleCompare = (char) => {
    const existingIndex = compareChars.findIndex(c => c.id === char.id);
    
    if (existingIndex >= 0) {
      setCompareChars(compareChars.filter(c => c.id !== char.id));
      notify(`Removed ${char.name} from comparison 📊`);
    } else if (compareChars.length < 3) {
      setCompareChars([...compareChars, char]);
      notify(`Added ${char.name} to comparison ⚖️`);
    } else {
      notify('Maximum 3 characters for comparison! 🚫');
    }
  };

  const shareCharacter = (char) => {
    const url = `${window.location.origin}/?char=${char.id}`;
    const text = `Check out ${char.name} - Level ${char.level} ${char.className} from Demplar! ⚔️`;
    
    if (navigator.share) {
      navigator.share({ title: `${char.name} - Demplar`, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      notify('Character link copied to clipboard! 📋');
    }
  };

  const notify = msg => { setNotif(msg); setTimeout(() => setNotif(""), 3000); };
  
  const update = (id, field, val) => {
    setChars(p => p.map(c => c.id === id ? { ...c, [field]: val } : c));
    if (sel?.id === id) setSel(p => ({ ...p, [field]: val }));
  };

  const exp = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([`const characters=${JSON.stringify(chars,null,2)};`], {type:'text/javascript'}));
    a.download = 'demplar-chars.js';
    a.click();
    notify('Exported! 📊');
  };

  const addNewsEntry = () => {
    if (!newNewsTitle.trim() || !newNewsContent.trim()) {
      alert("Please fill in both title and content for the news article!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: newNewsTitle.trim(),
      content: newNewsContent.trim(),
      author: user?.role === 'master' ? 'Demplar News Team' : 'Guest Reporter'
    };

    setNewsEntries(prev => [newEntry, ...prev]);
    setNewNewsTitle("");
    setNewNewsContent("");
    notify('News article published! 📰');
  };

  const deleteNewsEntry = (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      setNewsEntries(prev => prev.filter(entry => entry.id !== id));
      notify("News article deleted! 🗑️");
    }
  };

  const sendEmail = (subject, body) => {
    const emailAddress = "your@email.com";
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailtoLink = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
    
    try {
      window.open(mailtoLink, '_self');
      notify('Opening email client... 📧');
    } catch (error) {
      const emailText = `To: ${emailAddress}\nSubject: ${subject}\n\n${body}`;
      navigator.clipboard.writeText(emailText).then(() => {
        notify('Email details copied to clipboard! 📋');
      }).catch(() => {
        notify(`Please email: ${emailAddress} with subject: ${subject}`);
      });
    }
  };

  const handleCustomEmail = () => {
    if (!customSubject.trim()) {
      alert("Please enter a subject for your message!");
      return;
    }

    const subject = `Demplar: ${customSubject.trim()}`;
    const body = `Hello!

Subject: ${customSubject.trim()}

Message:
${customMessage.trim() || '[Please add your message here]'}

Details:
- Date: ${new Date().toLocaleDateString()}
- Time: ${new Date().toLocaleTimeString()}
- User Role: ${user?.role || 'Unknown'}

Thank you!`;

    sendEmail(subject, body);
    setCustomSubject("");
    setCustomMessage("");
  };

  const attemptLogin = () => {
    setErr("");
    
    if (!username.trim() || !password.trim()) {
      const msg = `${!username.trim() ? 'Username' : 'Password'} is required!`;
      setErr(msg);
      return false;
    }
    
    const isValidLogin = 
      (username === "master" && password === "123456") ||
      (username === "viewer" && password === "123456") ||
      (username === "guest" && password === "guest");
    
    if (isValidLogin) {
      setUser({ username: username, role: username });
      setErr("");
      notify(`Welcome ${username}! ⚔️`);
      return true;
    } else {
      setErr("Invalid username or password");
      return false;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    attemptLogin();
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setTimeout(() => {
      setUser({ username: user, role: user });
      setErr("");
      notify(`Welcome ${user}! ⚔️`);
    }, 10);
  };

  // Login screen render
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-8 py-6 text-center">
          <div className="text-6xl mb-3">🐉</div>
          <h1 className="text-4xl font-bold text-white">DEMPLAR</h1>
          <p className="text-purple-200 mt-1">{characters.length} Characters • Complete Database</p>
        </div>
        <div className="p-8">
          {err && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="Enter username (try: master)" 
              required 
            />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
              placeholder="Enter password (try: 123456)" 
              required 
            />
            <button 
              type="submit" 
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-medium transition-colors border-2 border-purple-600 hover:border-purple-700"
            >
              🚀 Enter Realm
            </button>
          </form>
          
          <div className="mt-6">
            <div className="text-center text-sm text-gray-600 mb-3">Quick Login (for testing):</div>
            <div className="grid grid-cols-3 gap-2">
              {[['master','123456','👑'],['viewer','123456','👁️'],['guest','guest','🏃']].map(([u,p,i]) => 
                <button 
                  key={u} 
                  onClick={() => quickLogin(u, p)} 
                  className={`px-3 py-2 border-2 rounded text-xs hover:opacity-80 transition-opacity ${u==='master'?'bg-yellow-100 border-yellow-200 text-yellow-800':'bg-blue-100 border-blue-200 text-blue-800'}`}
                >
                  {i} {u}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main application render
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {notif && (
        <div className={`fixed top-4 right-4 z-50 border p-4 rounded-lg shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
          {notif}
        </div>
      )}
      
      <header className={`shadow-xl transition-colors duration-300 ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r from-purple-900 to-purple-800 text-white'}`}>
        <div className={`px-4 py-3 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-900/90 border-gray-700' : 'bg-slate-800/90 border-slate-700'}`}>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <h1 className="text-lg sm:text-xl font-bold">🐉 Demplar • {stats.total} Characters</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  setDarkMode(!darkMode);
                  notify(darkMode ? 'Light mode activated! ☀️' : 'Dark mode activated! 🌙');
                }}
                className={`px-3 py-1.5 border rounded text-xs sm:text-sm min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors duration-300 hover:opacity-80 ${darkMode ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-400' : 'bg-gray-600/20 border-gray-600/30 text-gray-300'}`}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className={`px-2 sm:px-3 py-1.5 border rounded text-xs sm:text-sm ${user.role === 'master' ? 'bg-yellow-600/20 border-yellow-600/30 text-yellow-400' : 'bg-blue-600/20 border-blue-600/30 text-blue-400'}`}>
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />{user.role}
              </div>
              <button 
                onClick={() => { setUser(null); notify("Logged out 👋"); }} 
                className={`px-2 sm:px-3 py-1.5 border rounded text-xs sm:text-sm min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors duration-300 ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-slate-600 hover:bg-slate-700'}`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-6 sm:space-y-0">
            <div className="text-4xl sm:text-6xl font-bold text-yellow-400">DEMPLAR</div>
            
            {tab !== "characters" && (
              <div className="bg-yellow-600/20 border-2 border-yellow-600/40 rounded-xl p-4 max-w-sm">
                <div className="text-center">
                  <div className="text-yellow-300 text-sm font-bold mb-2">🌟 CHARACTER OF THE DAY</div>
                  <button 
                    onClick={() => { 
                      setSel(characterOfDay); 
                      setTab('profile'); 
                      notify(`Viewing today's spotlight: ${characterOfDay.name} ⭐`); 
                    }}
                    className="group hover:scale-105 transition-transform"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ProfileImage src={characterOfDay.profileUrl} alt={characterOfDay.name} size="w-16 h-16" />
                      <div className="text-yellow-100 font-bold group-hover:text-yellow-50">{characterOfDay.name}</div>
                      <div className="text-yellow-200 text-sm">Level {characterOfDay.level} • {characterOfDay.className}</div>
                      <div className="text-yellow-300 text-xs opacity-75">Click to view profile →</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className={`shadow border-b sticky top-0 z-40 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {["home", "characters", "favorites", "profile", "stats", "compare", "news", "suggestions", "admin"].filter(t => t !== "admin" || user.role === "master").map(t => {
              const iconMap = {
                home: "🏠", characters: "👥", favorites: "❤️", compare: "⚖️", news: "📰", suggestions: "📧",
                profile: <User className="w-4 h-4" />, stats: <Eye className="w-4 h-4" />, admin: <Settings className="w-4 h-4" />
              };
              
              return (
                <button key={t} onClick={() => setTab(t)} className={`py-4 px-4 sm:px-6 border-b-2 font-medium capitalize flex items-center space-x-2 whitespace-nowrap min-w-max touch-manipulation transition-colors duration-300 ${tab === t ? (darkMode ? "border-yellow-500 text-yellow-400" : "border-yellow-600 text-yellow-600") : (darkMode ? "border-transparent text-gray-400 hover:text-gray-200" : "border-transparent text-gray-500 hover:text-gray-700")}`}>
                  <span className="text-lg">{iconMap[t]}</span>
                  <span className="text-sm sm:text-base">{t}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {tab === "home" && (
          <div className="space-y-8">
            <div className={`rounded-xl shadow-xl p-8 sm:p-12 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-purple-900 to-purple-800 text-white'}`}>
              <div className="text-center">
                <div className={`text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-purple-200'}`}>Welcome to</div>
                <h1 className="text-5xl sm:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-2xl">⚔️ The Demplar Codex ⚔️</h1>
                <p className={`text-2xl sm:text-3xl font-bold tracking-wide mb-8 transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-purple-100'}`}>Home of the legendary Demplarverse</p>
                <div className="flex flex-wrap justify-center gap-6">
                  {[
                    [stats.total, "Characters"],
                    [stats.avg, "Avg Level"], 
                    [newsEntries.length, "News Articles"]
                  ].map(([value, label]) => (
                    <div key={label} className="bg-white/20 px-6 py-3 rounded-lg">
                      <span className="text-yellow-300 font-bold text-lg">{value}</span>
                      <div className={`text-sm transition-colors duration-300 ${darkMode ? 'text-gray-300' : 'text-purple-200'}`}>{label}</div>
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
                        .filter(c => c.id !== 69)
                        .sort((a, b) => b.level - a.level)
                        .slice(0, 3);
                      
                      const medals = ['🥇', '🥈', '🥉'];
                      
                      return topOverall.map((char, index) => (
                        <button
                          key={char.id}
                          onClick={() => { setSel(char); setTab('profile'); notify(`Viewing ${char.name}! ⚔️`); }}
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
                              {char.faction}
                            </div>
                          </div>
                        </button>
                      ));
                    })()}
                  </div>
                </div>
                
                {/* Faction Leaders */}
                <div className="space-y-4">
                  {(() => {
                    const factions = ['Demplar', 'Pond', 'Pork'];
                    const factionColors = {
                      'Demplar': {
                        bg: 'from-red-50 to-gray-50',
                        border: 'border-red-200',
                        title: 'text-red-800',
                        hover: 'hover:bg-red-50',
                        level: 'text-red-600',
                        icon: '⚔️'
                      },
                      'Pond': {
                        bg: 'from-blue-50 to-green-50',
                        border: 'border-green-200',
                        title: 'text-green-800',
                        hover: 'hover:bg-green-50',
                        level: 'text-green-600',
                        icon: '🌊'
                      },
                      'Pork': {
                        bg: 'from-pink-50 to-gray-50',
                        border: 'border-pink-200',
                        title: 'text-pink-800',
                        hover: 'hover:bg-pink-50',
                        level: 'text-pink-600',
                        icon: '🐷'
                      }
                    };
                    
                    return factions.map(faction => {
                      const factionChars = chars
                        .filter(c => c.faction === faction && c.id !== 69)
                        .sort((a, b) => b.level - a.level)
                        .slice(0, 2);
                      
                      const colors = factionColors[faction];
                      
                      return (
                        <div 
                          key={faction}
                          className={`bg-gradient-to-br ${colors.bg} rounded-lg p-4 border-2 ${colors.border}`}
                        >
                          <h4 className={`text-sm font-bold mb-3 ${colors.title} flex items-center`}>
                            <span className="mr-2">{colors.icon}</span>
                            {faction} Leaders
                          </h4>
                          <div className="space-y-2">
                            {factionChars.map((char, index) => (
                              <button
                                key={char.id}
                                onClick={() => { setSel(char); setTab('profile'); notify(`Viewing ${char.name}! ⚔️`); }}
                                className={`w-full flex items-center justify-between p-2 bg-white rounded hover:shadow-md transition-all group ${colors.hover}`}
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
                                <div className={`text-lg font-bold ${colors.level}`}>
                                  Lv. {char.level}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setTab('characters')}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  View Full Character Rankings →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <button 
                onClick={() => {
                  const randomChar = characters[Math.floor(Math.random() * characters.length)];
                  setSel(randomChar);
                  setTab('profile');
                  notify(`Surprise! Viewing ${randomChar.name} 🎲`);
                }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">🎲</div>
                <div className="font-bold text-lg text-blue-800 mb-2">Random Character</div>
                <div className="text-sm text-blue-600">Discover someone new!</div>
              </button>

              <button 
                onClick={() => setTab('characters')}
                className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 hover:border-red-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">👥</div>
                <div className="font-bold text-lg text-red-800 mb-2">Browse Characters</div>
                <div className="text-sm text-red-600">Search & explore all!</div>
              </button>

              <button 
                onClick={() => setTab('news')}
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">📰</div>
                <div className="font-bold text-lg text-green-800 mb-2">Latest News</div>
                <div className="text-sm text-green-600">Read the updates!</div>
              </button>

              <button 
                onClick={() => setTab('compare')}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">⚖️</div>
                <div className="font-bold text-lg text-purple-800 mb-2">Compare Heroes</div>
                <div className="text-sm text-purple-600">Battle analysis!</div>
              </button>

              <button 
                onClick={() => setTab('suggestions')}
                className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 hover:border-orange-400 rounded-xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">📧</div>
                <div className="font-bold text-lg text-orange-800 mb-2">Send Feedback</div>
                <div className="text-sm text-orange-600">Share your ideas!</div>
              </button>
            </div>
          </div>
        )}

        {tab === "characters" && (
          <div className="space-y-6">
            <div className="relative w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    onFocus={() => setShow(true)}
                    onBlur={() => setTimeout(() => setShow(false), 200)}
                    className="bg-white text-black pl-10 pr-4 py-2 rounded border-2 border-yellow-600 focus:border-yellow-400 w-full" 
                  />
                </div>
                <select 
                  value={levelFilter} 
                  onChange={e => setLevelFilter(e.target.value)} 
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
                  onChange={e => setFactionFilter(e.target.value)} 
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
                  <ChevronDown className={`w-5 h-5 transition-transform mx-auto sm:mx-0 ${show ? 'rotate-180' : ''}`} />
                </button>
                <button 
                  onClick={() => {
                    setCompareMode(!compareMode);
                    notify(compareMode ? 'Compare mode disabled 📊' : 'Compare mode enabled! Click + next to characters to compare ⚖️');
                    if (!compareMode) setCompareChars([]);
                  }} 
                  className={`px-3 py-2 rounded w-full sm:w-auto transition-all ${compareMode ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'} hover:opacity-80`}
                >
                  ⚖️ Compare {compareChars.length > 0 && `(${compareChars.length})`}
                </button>
              </div>
              {show && filtered && filtered.length >= 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-yellow-600 rounded shadow-lg max-h-60 sm:max-h-80 overflow-y-auto z-50">
                  {filtered.map(c => (
                    <div key={c.id} className={`w-full text-left px-4 py-3 hover:bg-yellow-50 border-b flex items-center space-x-3 ${sel && sel.id === c.id ? 'bg-yellow-100' : ''}`}>
                      <button 
                        onClick={() => { 
                          setSel(c); 
                          setShow(false); 
                          setSearch(""); 
                          setTab('profile');
                          notify(`Viewing ${c.name}'s profile! ⚔️`); 
                        }} 
                        className="flex items-center space-x-3 flex-1"
                      >
                        <ProfileImage src={c.profileUrl} alt={c.name} size="w-8 h-8 sm:w-10 sm:h-10" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{c.name}</div>
                          <div className="text-xs sm:text-sm text-gray-500 truncate">Level {c.level} • {c.className}</div>
                        </div>
                        <div className="text-xs text-gray-400">#{c.id}</div>
                      </button>
                      <div className="flex space-x-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(c.id); }} 
                          className={`p-1 rounded ${isFavorite(c.id) ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
                          title={isFavorite(c.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isFavorite(c.id) ? '❤️' : '🤍'}
                        </button>
                        {compareMode && (
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              toggleCompare(c); 
                            }} 
                            className={`p-1 rounded text-xs font-bold transition-all ${compareChars.find(ch => ch.id === c.id) ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-purple-100'}`}
                            title={compareChars.find(ch => ch.id === c.id) ? 'Remove from comparison' : 'Add to comparison'}
                          >
                            {compareChars.find(ch => ch.id === c.id) ? '✓' : '+'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div className="px-4 py-6 text-gray-500 text-center">No characters found</div>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow border p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="mr-3">👥</span>
                  Character Database
                  <span className="ml-auto text-sm font-normal text-gray-500">
                    Showing {filtered.length} of {characters.length} characters
                  </span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map(char => {
                    const faction = getFaction(char);
                    const colors = getFactionColors(faction);
                    
                    return (
                      <div key={char.id} className={`${colors.gradient} rounded-xl p-6 hover:shadow-xl transition-all duration-300 border-2 ${colors.border} hover:-translate-y-1`}>
                        <div className="flex items-center space-x-4 mb-4">
                          <ProfileImage src={char.profileUrl} alt={char.name} size="w-16 h-16" />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-lg truncate mb-2 ${colors.textAccent}`}>{char.name}</h4>
                            <div className={`text-sm font-bold px-3 py-1 rounded-full ${colors.levelBg} text-white inline-block mb-1 shadow-md`}>
                              Level {char.level}
                            </div>
                            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${colors.factionBg} text-white inline-block uppercase tracking-wide shadow-sm`}>
                              {faction}
                            </div>
                          </div>
                          <button 
                            onClick={() => handleToggleFavorite(char.id)}
                            className={`p-2 rounded-full transition-all duration-200 ${isFavorite(char.id) ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-400 bg-white/50 hover:bg-white hover:text-red-400'} shadow-sm`}
                          >
                            {isFavorite(char.id) ? '❤️' : '🤍'}
                          </button>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className={`rounded-lg p-3 border bg-white/70 ${colors.borderAccent}`}>
                            <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}>Class</div>
                            <div className="text-sm font-semibold text-gray-800">{char.className}</div>
                          </div>
                          <div className={`rounded-lg p-3 border bg-white/70 ${colors.borderAccent}`}>
                            <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}>Location</div>
                            <div className="text-sm font-semibold text-gray-800">{char.location}</div>
                          </div>
                          
                          <div className={`bg-white/70 rounded-lg p-3 border ${colors.borderAccent}`}>
                            <div className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Character Stats</div>
                            <div className="space-y-2">
                              <PowerBar value={getPowerLevel(char)} faction={faction} className="w-full" />
                              <LoreBar value={getLoreLevel(char)} faction={faction} className="w-full" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => { setSel(char); setTab('profile'); notify(`Viewing ${char.name}! ⚔️`); }}
                            className={`flex-1 ${colors.button} text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
                          >
                            View Profile
                          </button>
                          {compareMode && (
                            <button 
                              onClick={() => toggleCompare(char)}
                              className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${compareChars.find(c => c.id === char.id) ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-600'}`}
                            >
                              {compareChars.find(c => c.id === char.id) ? '✓' : '+'}
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
                    <p className="text-sm">Try adjusting your search or filter settings</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "favorites" && (
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
                  <p className="text-sm mb-6">Start adding characters to your favorites to see them here!</p>
                  <button 
                    onClick={() => setTab('characters')}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-semibold transition-colors"
                  >
                    Browse Characters →
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 text-sm text-gray-600">
                    You have {favorites.size} favorite{favorites.size !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {Array.from(favorites).map(charId => {
                      const char = chars.find(c => c.id === charId);
                      if (!char) return null;
                      
                      return (
                        <div key={char.id} className="relative group">
                          <button
                            onClick={() => {
                              setSel(char);
                              setTab('profile');
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
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`${char.profileUrl ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-2xl font-bold text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200`}
                                style={char.profileUrl ? {display: 'none'} : {}}
                              >
                                {char.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                              
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                                  <div className="text-xs font-bold truncate">{char.name}</div>
                                  <div className="text-xs opacity-90">Lv. {char.level}</div>
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
        )}

        {tab === "profile" && !sel && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Character Selected</h3>
                <p className="text-gray-600 mb-8">Choose a character to view their detailed profile</p>
                
                <button 
                  onClick={() => setTab('characters')}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                >
                  Browse Characters →
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "profile" && sel && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow border">
              {(() => {
                const faction = getFaction(sel);
                const colors = getFactionColors(faction);
                
                return (
                  <>
                    <div className={`bg-gradient-to-r ${colors.headerGradient} text-white p-6 rounded-t-xl`}>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-shrink-0">
                          <ProfileImage src={sel.profileUrl} alt={sel.name} size="w-24 h-24 sm:w-32 sm:h-32" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-3xl sm:text-4xl font-bold mb-3">{sel.name}</h3>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-4">
                            <div className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg">
                              Level {sel.level}
                            </div>
                            <div className="bg-white/20 text-white px-4 py-2 rounded-full font-semibold">
                              {faction}
                            </div>
                          </div>
                          
                          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-sm font-medium text-white/90 uppercase tracking-wide mb-3">Character Stats</div>
                            <div className="space-y-3">
                              <PowerBar value={getPowerLevel(sel)} faction={faction} className="w-full" />
                              <LoreBar value={getLoreLevel(sel)} faction={faction} className="w-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`${colors.statBg} rounded-lg p-4`}>
                          <div className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Class</div>
                          <div className={`text-lg font-bold text-gray-800`}>{sel.className}</div>
                        </div>
                        <div className={`${colors.statBg} rounded-lg p-4`}>
                          <div className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Location</div>
                          <div className={`text-lg font-bold text-gray-800`}>{sel.location}</div>
                        </div>
                        {sel.twitterHandle && (
                          <div className={`${colors.statBg} rounded-lg p-4 sm:col-span-2`}>
                            <div className={`text-sm font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Social Media</div>
                            <a href={`https://x.com/${sel.twitterHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className={`text-lg font-bold ${colors.textAccent} hover:opacity-80 transition-colors`}>
                              {sel.twitterHandle}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}>
                        <h4 className={`text-lg font-bold mb-4 flex items-center ${colors.textAccent}`}>
                          <span className="mr-2">📊</span>
                          Detailed Character Statistics
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${colors.textAccent}`}>Combat Power</span>
                              </div>
                              <PowerBar value={getPowerLevel(sel)} faction={faction} className="w-full" />
                              <div className="text-xs text-slate-600 mt-2">
                                Based on level and combat experience
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-slate-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${colors.textAccent}`}>Lore Knowledge</span>
                              </div>
                              <LoreBar value={getLoreLevel(sel)} faction={faction} className="w-full" />
                              <div className="text-xs text-slate-600 mt-2">
                                Understanding of Demplar mysteries
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-white rounded-lg p-4 border border-slate-100">
                              <div className="text-sm font-medium text-slate-700 mb-3">Character Metrics</div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Experience Level</span>
                                  <span className="text-xs font-bold text-slate-800">{sel.level}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Power Rank</span>
                                  <span className="text-xs font-bold text-slate-800">
                                    {statsChars.filter(c => c.level > sel.level).length + 1} of {statsChars.length}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Faction</span>
                                  <span className="text-xs font-bold text-slate-800">{faction}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Has Profile Image</span>
                                  <span className="text-xs font-bold text-slate-800">{sel.profileUrl ? 'Yes' : 'No'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded-lg p-4 border border-slate-100">
                              <div className="text-sm font-medium text-slate-700 mb-3">Power Breakdown</div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Base Power</span>
                                  <span className={`text-xs font-bold ${colors.textAccent}`}>{Math.min(sel.level * 8, 800)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-600">Experience Bonus</span>
                                  <span className={`text-xs font-bold ${colors.textAccent}`}>{Math.min(sel.level * 2, 200)}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-1 mt-2">
                                  <div className="flex justify-between">
                                    <span className="text-xs font-medium text-slate-700">Power Status</span>
                                    <span className={`text-xs font-bold ${colors.textAccent}`}>Active</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}>
                        <h4 className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}>
                          <span className="mr-2">⚔️</span>
                          Abilities & Techniques
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-purple-100">
                          {sel.name === "Jayfeezy" ? (
                            <ol className="space-y-2 text-gray-700">
                              <li>1. Ice Barrier – Hybrid (Attack or Buff – Self or Team)</li>
                              <li>2. Arcane Insight – Buff (Self)</li>
                              <li>3. Ice Barrage – Attack (Enemy Party)</li>
                              <li>4. Mana Surge Boost – Buff (Team)</li>
                              <li>5. Thunder Crunch – Attack (Enemy)</li>
                            </ol>
                          ) : (
                            <span className="text-gray-500 italic">No Abilities or Techniques available</span>
                          )}
                        </div>
                      </div>

                      <div className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}>
                        <h4 className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}>
                          <span className="mr-2">✨</span>
                          Signature Traits
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-amber-100">
                          {sel.name === "Jayfeezy" ? (
                            <ol className="space-y-2 text-gray-700">
                              <li>1. Deep Thinker</li>
                              <li>2. Arcane Scholar</li>
                            </ol>
                          ) : (
                            <span className="text-gray-500 italic">No Traits available</span>
                          )}
                        </div>
                      </div>

                      <div className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}>
                        <h4 className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}>
                          <span className="mr-2">⚡</span>
                          Character Buffs & Abilities
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-green-100">
                          <p className={`leading-relaxed ${colors.textAccent}`}>{sel.buffs}</p>
                        </div>
                      </div>

                      <div className={`bg-gradient-to-r ${colors.profileBg} border ${colors.borderAccent} rounded-lg p-6`}>
                        <h4 className={`text-lg font-bold mb-3 flex items-center ${colors.textAccent}`}>
                          <span className="mr-2">🔗</span>
                          Pond0x Referral Link
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-blue-100">
                          {sel.name === "Jayfeezy" ? (
                            <a 
                              href="https://www.pond0x.com/swap/solana?ref=K3CqcBfG2S1hZ4Bkqb8DFdPMLfUutspVzZPKooNrFdwrWSApHZnmWLrec7kk"
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`${colors.textAccent} hover:opacity-80 font-semibold underline transition-opacity`}
                            >
                              Jayfeezy's Pond0x Referral Link
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
                      <button onClick={() => handleToggleFavorite(sel.id)} className={`p-2 rounded ${isFavorite(sel.id) ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'} hover:text-red-500`}>
                        {isFavorite(sel.id) ? '❤️' : '🤍'}
                      </button>
                    </h4>
                    <div className="space-y-3">
                      <button onClick={() => shareCharacter(sel)} className={`w-full px-4 py-2 ${colors.button} text-white rounded hover:opacity-90 flex items-center justify-center space-x-2 transition-all`}>
                        <Share className="w-4 h-4" />
                        <span>Share Character</span>
                      </button>
                      
                      <div className={`bg-gradient-to-br ${colors.profileBg} rounded-lg p-4 border ${colors.borderAccent}`}>
                        <h5 className={`font-semibold mb-3 ${colors.textAccent}`}>Stats Overview</h5>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs font-medium ${colors.textAccent}`}>Power</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${colors.powerBar} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${(getPowerLevel(sel) / 1000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className={`text-xs font-medium ${colors.textAccent}`}>Lore</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${colors.loreBar} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${(getLoreLevel(sel) / 1000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button 
                          onClick={() => { 
                            setSel(null); 
                            notify('Returned to character selection 🔙'); 
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

        {tab === "news" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-3">📰</span>
                Demplar News & Chronicles
              </h3>

              {user.role === 'master' && (
                <div className="mb-8 p-6 border-2 rounded-xl bg-blue-50 border-blue-200">
                  <h4 className="text-lg font-semibold mb-4 flex items-center text-blue-800">
                    <span className="mr-2">✍️</span>
                    Publish New Article
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        value={newNewsTitle}
                        onChange={(e) => setNewNewsTitle(e.target.value)}
                        placeholder="e.g., The Battle of Luminous"
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        maxLength={200}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {newNewsTitle.length}/200 characters
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Article Content *
                      </label>
                      <textarea
                        value={newNewsContent}
                        onChange={(e) => setNewNewsContent(e.target.value)}
                        placeholder="Write about the latest events, discoveries, or updates...

You can write detailed articles with multiple paragraphs. Use line breaks to separate sections for better readability.

Tips for formatting:
- Press Enter twice for paragraph breaks
- Use --- on its own line for section dividers
- Start lines with • for bullet points"
                        rows={12}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white border-gray-300 text-gray-900 placeholder-gray-500 font-sans"
                        maxLength={10000}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {newNewsContent.length}/10,000 characters
                      </div>
                    </div>

                    <button
                      onClick={addNewsEntry}
                      disabled={!newNewsTitle.trim() || !newNewsContent.trim()}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        newNewsTitle.trim() && newNewsContent.trim()
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      📰 Publish Article
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {newsEntries.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📰</div>
                    <p className="text-lg">No news articles yet</p>
                    <p className="text-sm">The newsroom awaits its first story...</p>
                  </div>
                ) : (
                  newsEntries
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((entry, index) => (
                      <NewsArticle
                        key={entry.id}
                        entry={entry}
                        index={index}
                        isLatest={index === 0}
                        onDelete={deleteNewsEntry}
                        canDelete={user.role === 'master'}
                      />
                    ))
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "suggestions" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-3">📧</span>
                Send Suggestions & Feedback
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">📋 Custom Message</h4>
                  <p className="text-sm text-gray-600 mb-4">Write your own subject and message:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject Line *
                      </label>
                      <input
                        type="text"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        placeholder="e.g., Level correction for Captain Cohiba"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={100}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {customSubject.length}/100 characters (will be prefixed with "Demplar: ")
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Add any additional details here..."
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        maxLength={500}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {customMessage.length}/500 characters
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCustomEmail}
                      disabled={!customSubject.trim()}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        customSubject.trim() 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      📧 Send Custom Message
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700 border-b pb-2">💡 Feedback Ideas</h4>
                  <p className="text-sm text-gray-600 mb-4">Some examples of feedback you can send:</p>
                  
                  <div className="space-y-3">
                    {[
                      { 
                        reason: "Character Update", 
                        description: "Report level changes or corrections",
                        icon: "✏️",
                        color: "green"
                      },
                      { 
                        reason: "Bug Report", 
                        description: "Search not working, images broken, etc.",
                        icon: "🐛",
                        color: "red"
                      },
                      { 
                        reason: "Feature Request", 
                        description: "Ideas for new features",
                        icon: "💡",
                        color: "yellow"
                      }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="w-full p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">
                              {item.reason}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mt-6">
                    <h5 className="font-semibold text-gray-700 mb-2">📋 Preview:</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>To:</strong> your@email.com</div>
                      <div><strong>Subject:</strong> Demplar: {customSubject || "[Your subject here]"}</div>
                      <div><strong>Your Role:</strong> {user?.role || 'Unknown'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "compare" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Character Comparison</h3>
              {compareChars.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">⚖️</div>
                  <p className="text-lg mb-2">No characters selected for comparison</p>
                  <p className="text-sm">Enable compare mode and click the + button next to characters to add them!</p>
                  <p className="text-xs mt-2 text-gray-400">You can compare up to 3 characters at once</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-semibold">Comparing {compareChars.length} character{compareChars.length > 1 ? 's' : ''}</h4>
                    <button 
                      onClick={() => {
                        setCompareChars([]);
                        notify('Cleared all comparisons 🗑️');
                      }}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {/* Character Cards Grid */}
                  <div className={`grid gap-4 ${
                    compareChars.length === 1 ? 'grid-cols-1' : 
                    compareChars.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 
                    'grid-cols-1 md:grid-cols-3'
                  }`}>
                    {compareChars.map(char => {
                      const faction = getFaction(char);
                      const colors = getFactionColors(faction);
                      
                      return (
                        <div key={char.id} className={`${colors.gradient} border-2 ${colors.border} rounded-xl relative`}>
                          <button 
                            onClick={() => toggleCompare(char)}
                            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center justify-center shadow-md"
                          >
                            ✕
                          </button>
                          
                          {/* Character Header */}
                          <div className={`bg-gradient-to-r ${colors.headerGradient} text-white p-4 rounded-t-xl`}>
                            <div className="flex flex-col items-center text-center">
                              <ProfileImage src={char.profileUrl} alt={char.name} size="w-20 h-20" />
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
                                <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}>Class</div>
                                <div className="text-sm font-semibold text-gray-800">{char.className}</div>
                              </div>
                              <div className={`${colors.statBg} rounded-lg p-3`}>
                                <div className={`text-xs font-medium uppercase tracking-wide mb-1 ${colors.textAccent}`}>Location</div>
                                <div className="text-sm font-semibold text-gray-800">{char.location}</div>
                              </div>
                            </div>
                            
                            {/* Stats Bars */}
                            <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                              <div className={`text-xs font-medium uppercase tracking-wide mb-3 ${colors.textAccent}`}>Combat Stats</div>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-gray-600">Power</span>
                                    <span className="text-xs font-bold text-gray-800">{getPowerLevel(char)}/1000</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`bg-gradient-to-r ${colors.powerBar} h-2 rounded-full transition-all duration-500`}
                                      style={{ width: `${(getPowerLevel(char) / 1000) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-medium text-gray-600">Lore</span>
                                    <span className="text-xs font-bold text-gray-800">{getLoreLevel(char)}/1000</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`bg-gradient-to-r ${colors.loreBar} h-2 rounded-full transition-all duration-500`}
                                      style={{ width: `${(getLoreLevel(char) / 1000) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Ranking Info */}
                            <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                              <div className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Rankings</div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-600">Power Rank</span>
                                  <span className="text-xs font-bold text-gray-800">
                                    #{statsChars.filter(c => c.level > char.level).length + 1} of {statsChars.length}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-gray-600">Faction Rank</span>
                                  <span className="text-xs font-bold text-gray-800">
                                    #{statsChars.filter(c => c.faction === char.faction && c.level > char.level).length + 1} in {faction}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Buffs */}
                            <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                              <div className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Buffs & Abilities</div>
                              <p className="text-xs text-gray-700 leading-relaxed">{char.buffs}</p>
                            </div>
                            
                            {/* Social */}
                            {char.twitterHandle && (
                              <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
                                <div className={`text-xs font-medium uppercase tracking-wide mb-2 ${colors.textAccent}`}>Social</div>
                                <a 
                                  href={`https://x.com/${char.twitterHandle.replace('@', '')}`} 
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
                                onClick={() => { setSel(char); setTab('profile'); notify(`Viewing ${char.name}! ⚔️`); }}
                                className={`w-full ${colors.button} text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
                              >
                                View Full Profile
                              </button>
                              <button 
                                onClick={() => handleToggleFavorite(char.id)}
                                className={`w-full px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                                  isFavorite(char.id) 
                                    ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {isFavorite(char.id) ? '❤️ Favorited' : '🤍 Add to Favorites'}
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
                      <h4 className="text-lg font-semibold mb-4 text-gray-800">Quick Comparison</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2 px-3 text-gray-600 font-medium">Attribute</th>
                              {compareChars.map(char => (
                                <th key={char.id} className="text-center py-2 px-3 text-gray-800 font-bold">
                                  {char.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-600">Level</td>
                              {compareChars.map(char => (
                                <td key={char.id} className="text-center py-2 px-3 font-semibold">
                                  {char.level}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-600">Faction</td>
                              {compareChars.map(char => (
                                <td key={char.id} className="text-center py-2 px-3">
                                  {char.faction}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-600">Power</td>
                              {compareChars.map(char => (
                                <td key={char.id} className="text-center py-2 px-3">
                                  {getPowerLevel(char)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-600">Lore</td>
                              {compareChars.map(char => (
                                <td key={char.id} className="text-center py-2 px-3">
                                  {getLoreLevel(char)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 px-3 text-gray-600">Overall Rank</td>
                              {compareChars.map(char => (
                                <td key={char.id} className="text-center py-2 px-3">
                                  #{statsChars.filter(c => c.level > char.level).length + 1}
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
        )}

        {tab === "stats" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Overall Database Statistics</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="text-center p-3 sm:p-6 bg-blue-50 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-xs sm:text-sm text-blue-700">Total Characters</div>
                </div>
                <div className="text-center p-3 sm:p-6 bg-green-50 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.avg}</div>
                  <div className="text-xs sm:text-sm text-green-700">Overall Avg Level</div>
                </div>
                <div className="text-center p-3 sm:p-6 bg-yellow-50 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.max}</div>
                  <div className="text-xs sm:text-sm text-yellow-700">Highest Level</div>
                </div>
                <div className="text-center p-3 sm:p-6 bg-purple-50 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.imgs}</div>
                  <div className="text-xs sm:text-sm text-purple-700">With Images</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Faction Breakdown</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {(() => {
                  // Calculate faction statistics
                  const factionStats = {};
                  
                  // Filter out NPC/Unknown characters and group by faction
                  chars.filter(c => c.id !== 69 && c.faction !== 'NPC').forEach(char => {
                    if (!factionStats[char.faction]) {
                      factionStats[char.faction] = {
                        characters: [],
                        totalLevel: 0,
                        count: 0,
                        highestChar: null
                      };
                    }
                    
                    factionStats[char.faction].characters.push(char);
                    factionStats[char.faction].totalLevel += char.level;
                    factionStats[char.faction].count++;
                    
                    if (!factionStats[char.faction].highestChar || char.level > factionStats[char.faction].highestChar.level) {
                      factionStats[char.faction].highestChar = char;
                    }
                  });
                  
                  // Define faction order and colors
                  const factionOrder = ['Demplar', 'Pond', 'Pork'];
                  const factionColors = {
                    'Demplar': {
                      bg: 'bg-gradient-to-br from-red-50 to-gray-50',
                      border: 'border-red-200',
                      accent: 'text-red-700',
                      statBg: 'bg-red-100',
                      icon: '⚔️'
                    },
                    'Pond': {
                      bg: 'bg-gradient-to-br from-blue-50 to-green-50',
                      border: 'border-green-200',
                      accent: 'text-green-700',
                      statBg: 'bg-green-100',
                      icon: '🌊'
                    },
                    'Pork': {
                      bg: 'bg-gradient-to-br from-pink-50 to-gray-50',
                      border: 'border-pink-200',
                      accent: 'text-pink-700',
                      statBg: 'bg-pink-100',
                      icon: '🐷'
                    }
                  };
                  
                  return factionOrder.map(faction => {
                    const stats = factionStats[faction];
                    const colors = factionColors[faction];
                    
                    if (!stats) return null;
                    
                    const avgLevel = Math.round(stats.totalLevel / stats.count);
                    
                    return (
                      <div key={faction} className={`${colors.bg} rounded-xl p-4 sm:p-6 border-2 ${colors.border}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`text-lg sm:text-xl font-bold ${colors.accent}`}>{faction}</h4>
                          <span className="text-2xl">{colors.icon}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className={`${colors.statBg} rounded-lg p-3`}>
                            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Average Level</div>
                            <div className={`text-2xl font-bold ${colors.accent}`}>{avgLevel}</div>
                          </div>
                          
                          <div className={`${colors.statBg} rounded-lg p-3`}>
                            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total Members</div>
                            <div className={`text-2xl font-bold ${colors.accent}`}>{stats.count}</div>
                          </div>
                          
                          <div className={`${colors.statBg} rounded-lg p-3`}>
                            <div className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Highest Level</div>
                            <div className={`font-bold ${colors.accent}`}>
                              <div className="text-lg">{stats.highestChar.name}</div>
                              <div className="text-xl">Level {stats.highestChar.level}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }).filter(Boolean);
                })()}
              </div>
            </div>
          </div>
        )}

        {tab === "admin" && user.role === "master" && (
          <div className="rounded-xl shadow border bg-white border-gray-200">
            <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 bg-red-50 border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center text-red-800">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />Admin Panel
              </h3>
              <button onClick={exp} className="w-full sm:w-auto px-4 py-2 rounded flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white">
                <Download className="w-4 h-4" /><span>Export All</span>
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="block sm:hidden space-y-4 max-h-96 overflow-y-auto">
                {chars.map(c => (
                  <div key={c.id} className="border rounded-lg p-4 space-y-3 border-gray-200 bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <ProfileImage src={c.profileUrl} alt={c.name} size="w-12 h-12" />
                      <div className="flex-1">
                        <input type="text" value={c.name} onChange={e => update(c.id, 'name', e.target.value)} className="font-medium w-full border rounded px-2 py-1 text-sm bg-transparent border-gray-300 text-gray-900" />
                        <div className="text-xs mt-1 text-gray-500">#{c.id}</div>
                      </div>
                      <button onClick={() => { setSel(c); setTab('profile'); notify(`Viewing ${c.name} ⚔️`); }} className="px-3 py-2 rounded text-sm bg-blue-500 hover:bg-blue-600 text-white">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Level</label>
                        <input type="number" value={c.level} onChange={e => update(c.id, 'level', +e.target.value||0)} className="w-full border rounded px-2 py-1 text-sm font-bold border-gray-300 text-gray-900" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">X Handle</label>
                        <input type="text" value={c.twitterHandle} onChange={e => update(c.id, 'twitterHandle', e.target.value)} placeholder="@username" className="w-full border rounded px-2 py-1 text-xs border-gray-300 text-gray-900 placeholder-gray-500" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Class</label>
                      <input type="text" value={c.className} onChange={e => update(c.id, 'className', e.target.value)} className="w-full border rounded px-2 py-1 text-sm border-gray-300 text-gray-900" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Location</label>
                      <input type="text" value={c.location} onChange={e => update(c.id, 'location', e.target.value)} className="w-full border rounded px-2 py-1 text-sm border-gray-300 text-gray-900" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Profile URL</label>
                      <input type="url" value={c.profileUrl} onChange={e => update(c.id, 'profileUrl', e.target.value)} placeholder="https://..." className="w-full border rounded px-2 py-1 text-xs border-gray-300 text-gray-900 placeholder-gray-500" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-gray-900">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b bg-gray-50 border-gray-200">
                      {['Character','Level','Class','Location','X Handle','Profile URL','Action'].map(h => 
                        <th key={h} className="text-left p-3 text-gray-700 bg-gray-50">{h}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {chars.map((c,i) => (
                      <tr key={c.id} className={`border-b border-gray-200 hover:bg-gray-50 ${i%2?'bg-gray-25':'bg-white'}`}>
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <ProfileImage src={c.profileUrl} alt={c.name} size="w-8 h-8" />
                            <div>
                              <input type="text" value={c.name} onChange={e => update(c.id, 'name', e.target.value)} className="font-medium bg-transparent border-none focus:border focus:rounded px-2 py-1 text-gray-900 focus:bg-white focus:border-blue-300 min-w-[120px]" />
                              <div className="text-xs text-gray-500">#{c.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <input type="number" value={c.level} onChange={e => update(c.id, 'level', +e.target.value||0)} className="w-16 text-center font-bold bg-transparent border-none focus:border focus:rounded px-2 py-1 text-gray-900 focus:bg-white focus:border-blue-300" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={c.className} onChange={e => update(c.id, 'className', e.target.value)} className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[150px] text-gray-900 focus:bg-white focus:border-blue-300" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={c.location} onChange={e => update(c.id, 'location', e.target.value)} className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[120px] text-gray-900 focus:bg-white focus:border-blue-300" />
                        </td>
                        <td className="p-3">
                          <input type="text" value={c.twitterHandle} onChange={e => update(c.id, 'twitterHandle', e.target.value)} placeholder="@username" className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[100px] text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-300" />
                        </td>
                        <td className="p-3">
                          <input type="url" value={c.profileUrl} onChange={e => update(c.id, 'profileUrl', e.target.value)} placeholder="https://..." className="bg-transparent border-none focus:border focus:rounded px-2 py-1 max-w-[150px] text-xs text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-300" />
                        </td>
                        <td className="p-3">
                          <button onClick={() => { setSel(c); setTab('profile'); notify(`Viewing ${c.name} ⚔️`); }} className="px-2 py-1 rounded text-xs bg-blue-500 hover:bg-blue-600 text-white">
                            <Eye className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600 text-center">
                Managing all {chars.length} characters. Changes are saved automatically.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DemplarApp;