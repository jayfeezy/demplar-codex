import { defineType } from "sanity";

export const characterType = defineType({
  name: "character",
  title: "Character",
  type: "document",
  fields: [
    {
      name: "name",

      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
    {
      name: "cardImage",
      title: "Character Card Image",
      type: "image",
      options: {
        hotspot: true,
      },
      //validation: (Rule) => Rule.required(),
    },
    {
      name: "level",
      title: "Level",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "className",
      title: "Class Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
    {
      name: "faction",
      title: "Faction",
      type: "reference",
      to: [{ type: "faction" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "location",
      title: "Location",
      type: "reference",
      to: [{ type: "location" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "buffs",
      title: "Buffs",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "skills",
      title: "Skills",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "talents",
      title: "Talents",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (Rule) => Rule.unique(),
    },
    {
      name: "twitterHandle",
      title: "Twitter Handle",
      type: "string",
      validation: (Rule) => Rule.max(50),
    },
    {
      name: "pondRefCode",
      title: "Pond0x Ref Code",
      type: "string",
      validation: (Rule) => Rule.max(100),
    },
  ],
});
