import { authorType } from "./authorType";
import { characterType } from "./characterType";
import { factionType } from "./factionType";
import { locationType } from "./locationType";
import { newsType } from "./newsType";

export const schema = {
  types: [characterType, factionType, locationType, newsType, authorType],
};
