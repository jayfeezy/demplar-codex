import { client } from "./client";

export async function getCharacters() {
  return client.fetch(
    `*[_type == "character"]{
      _id,
      name,
      character,
      cardImage,
      level,
      "className": coalesce(className, "Undecided"),
      "faction": coalesce(
        faction->{_id, name},
        {
          "_id": "311351ad-8f81-4299-912a-287161e5cab1",
          "name": "Undecided"
        }
      ),
      "location": coalesce(
        location->{_id, name},
        {
          "_id": "f00bd95c-8d32-40c3-96ba-4e4e3a1bb9c9",
          "name": "Kingdom"
        }
      ),
      buffs,
      profileUrl,
      twitterHandle,
      skills[]->{_id,name},
      talents[]->{_id,name},
      pondRefCode
    }`
  );
}

export async function getNews() {
  return client.fetch(
    `*[_type == "news"]{
      _id,
      title,
      author->{_id, name},
      publishedAt,
      body
    }`
  );
}
