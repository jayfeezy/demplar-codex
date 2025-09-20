import { defineType } from "sanity";

export const newsType = defineType({
  name: "news",
  title: "News Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      //initialValue: "New News Post",
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
});

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
      name: "profileUrl",
      title: "Profile URL",
      type: "url",
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    },
    {
      name: "twitterHandle",
      title: "Twitter Handle",
      type: "string",
      validation: (Rule) => Rule.max(50),
    },
  ],
});
