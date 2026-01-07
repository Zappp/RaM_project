import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";
import type { CharacterQuery } from "@/lib/types/generated";

type Character = NonNullable<CharacterQuery["character"]>;

interface CharacterDetailProps {
  character: Character;
  isFavorite: boolean;
}

export function CharacterDetail({ character, isFavorite }: CharacterDetailProps) {
  const characterId = parseInt(character.id, 10);

  return (
    <div>
      <Link href="/characters">← Back to Characters</Link>
      <div>
        {character.image && (
          <img
            src={character.image}
            alt={character.name || "Character"}
          />
        )}
        <h1>{character.name}</h1>
        <div>
          <p><strong>Status:</strong> {character.status || "Unknown"}</p>
          <p><strong>Species:</strong> {character.species || "Unknown"}</p>
          <p><strong>Type:</strong> {character.type || "Unknown"}</p>
          <p><strong>Gender:</strong> {character.gender || "Unknown"}</p>
          {character.origin && (
            <p><strong>Origin:</strong> {character.origin.name || "Unknown"}</p>
          )}
          {character.location && (
            <p><strong>Location:</strong> {character.location.name || "Unknown"}</p>
          )}
          {character.episode && character.episode.length > 0 && (
            <p><strong>Episodes:</strong> {character.episode.length}</p>
          )}
          {character.created && (
            <p><strong>Created:</strong> {new Date(character.created).toLocaleDateString()}</p>
          )}
        </div>
        <FavoriteButton
          characterId={characterId}
          characterName={character.name || ""}
          characterImage={character.image || null}
          isFavorite={isFavorite}
        />
      </div>
    </div>
  );
}

