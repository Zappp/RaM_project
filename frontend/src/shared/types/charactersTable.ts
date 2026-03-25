export interface CharacterWithFavorite {
  id?: string;
  remoteId: string;
  name: string;
  status: string | null;
  species: string | null;
  image: string | null;
  isFavorite?: boolean;
}

export enum CHARACTER_ACTION_TYPE {
  ADD = "ADD",
  REMOVE = "REMOVE",
}

export type CharactersTableAction =
  | {
      type: CHARACTER_ACTION_TYPE.ADD;
      payload: { remoteId: CharacterWithFavorite["remoteId"] };
    }
  | {
      type: CHARACTER_ACTION_TYPE.REMOVE;
      payload: { id: CharacterWithFavorite["id"] };
    };
