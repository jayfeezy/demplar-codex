export function slugify(name) {
  if (typeof name !== "string") return;
  return name
    .toLowerCase()
    .replace(/\[|\]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
