import fs from "fs";
import { characters } from "./characters.js";

const factionMap = {
  Pork: "04cd8355-f97d-4288-9caf-593c2ca9a9c6",
  Pond: "45897045-c6ba-4d5e-b011-10c6b72f74d3",
  NPC: "d3a2c47b-6c8d-4b9d-8825-0771aa834f3f",
  Demplar: "f95ee7a7-14a0-43a5-8d41-90f96a5cffed",
};

const locationMap = {
  "Exit of Hatenashi": "0088f2bb-8645-4cd1-99a1-05b814727a76",
  "Great Stone Quarry": "05d04424-77f0-4006-95e0-483470a55a4d",
  "Enchanted Forest": "0ee383b0-5c9c-4239-a8a6-2e024de64dfd",
  Labrynth: "2b77cd03-835d-4c8a-8dac-71fe8a836d46",
  Wayameru: "30fff10a-ca86-4653-a20e-97868f1a0349",
  "Empathic Forgotten Water": "3c870f90-15b7-45e0-8d28-7371969d11f9",
  "Sewer 8": "446c87f1-8f5a-4337-84fc-da37f251a0a9",
  "Impala Mountains": "5ae8f4d6-bb57-4e05-8c34-bfab71de324a",
  "Dark Cave of Unknown": "6951f27d-e1aa-4e98-9927-8fd79827947c",
  "Empathic Forgotten Quarry": "6a48cd46-e281-401e-9fba-f62901e01ead",
  "Meltdown Island": "7a94faee-e455-40c6-ae9e-e284c0aa6799",
  Badlands: "b5ca94f0-c1de-4c28-8d46-7f02301d75dc",
  "Thieves Den": "b6f670e0-eab9-4544-9156-40f4c23daef0",
  Library: "bb1882a7-3f58-4ce1-982f-8d79c3220772",
  Watchtower: "d0827d48-ab8f-4f44-8f95-6c23d0d3bd7f",
  Kingdom: "f00bd95c-8d32-40c3-96ba-4e4e3a1bb9c9",
  Tavern: "f3713b73-523b-4097-adfc-b43310a08a01",
  Luminous: "f92babd0-5147-4e08-a563-2884730b4ab5",
  "Compression of Time": "fe70ded4-1657-4b51-a062-933187c549a2",
};

const ndjsonLines = characters.map((char, index) => {
  return JSON.stringify({
    _id: `character-${index + 1}`,
    _type: "character",
    name: char.name,
    level: char.level,
    className: char.className,
    faction: { _type: "reference", _ref: factionMap[char.faction] },
    location: { _type: "reference", _ref: locationMap[char.location] },
    buffs: char.buffs.split(",").map((b) => b.trim()),
    profileUrl: char.profileUrl || "",
    twitterHandle: char.twitterHandle || "",
  });
});

// Write to NDJSON file
fs.writeFileSync("characters.ndjson", ndjsonLines.join("\n"));
console.log("NDJSON file created: characters.ndjson");
