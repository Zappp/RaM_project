export interface FavoriteCharacter {
  id: string;
  userId: string;
  remoteId: string;
  name: string;
  image: string | null;
  status: string | null;
  species: string | null;
  createdAt: string;
  updatedAt: string;
}
