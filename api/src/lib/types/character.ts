export interface Character {
  id: string;
  name: string;
  status: string | null;
  species: string | null;
  type: string | null;
  gender: string | null;
  origin: { name: string; url: string } | null;
  location: { name: string; url: string } | null;
  image: string | null;
  episode: string[];
  created: string | null;
}

export interface RickAndMortyCharacter {
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

export interface RickAndMortyResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: RickAndMortyCharacter[];
}

