import { defineType } from "sanity";

export const factionType = defineType({
  name: "faction",
  title: "Faction",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Faction Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
    // Add more fields if needed
  ],
});
