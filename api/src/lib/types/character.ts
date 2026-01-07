export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  created: string;
}

export type CharacterIdProps = Omit<Pick<Character, "id">, "id"> & {
  id: string;
};

export interface FavoriteCharacter {
  id: string;
  userId: string;
  characterId: number;
  characterName: string;
  characterImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export type FavoriteCharacterIdProps = Pick<FavoriteCharacter, "characterId">;

export type AddFavoriteCharacterProps = Pick<
  FavoriteCharacter,
  "characterId" | "characterName"
> & { characterImage?: string | null };
