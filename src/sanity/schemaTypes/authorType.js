import { defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Author Name",
      type: "string",
      validation: (Rule) => Rule.required().min(1).max(100),
    },
  ],
});
