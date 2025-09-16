import { defineType } from "sanity";

export const locationType = defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Location Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
    // Add more fields if needed
  ],
});
