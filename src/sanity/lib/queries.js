import { client } from "./client";

export async function getCharacters() {
  return client.fetch(
    `*[_type == "character"]{
      _id,
      name,
      character,
      cardImage,
      level,
      className,
      faction->{_id, name}, 
      location->{_id, name},
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
