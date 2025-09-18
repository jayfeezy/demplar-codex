import { defineType } from "sanity";

export const talentType = defineType({
  name: "talent",
  title: "Talent",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Talent Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
  ],
});
