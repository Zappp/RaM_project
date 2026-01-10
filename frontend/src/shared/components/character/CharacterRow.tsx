import Image from "next/image";
import { FavoriteButton } from "./FavoriteButton";
import type { CharactersQuery } from "@/lib/types/generated";
import type { FavoriteCharactersQuery } from "@/lib/types/generated";

type Character = CharactersQuery["characters"]["results"][0] & { isFavorite?: boolean };
type Favorite = FavoriteCharactersQuery["favoriteCharacters"]["results"][0];

type CharacterRowItem = Character | Favorite;

function isFavorite(item: CharacterRowItem): item is Favorite {
  return "characterId" in item && "characterName" in item;
}

interface CharacterRowProps {
  item: CharacterRowItem;
  showFavoriteAction: boolean;
  canAdd: boolean;
  canRemove: boolean;
}

export function CharacterRow({
  item,
  showFavoriteAction,
  canAdd,
  canRemove,
}: CharacterRowProps) {
  const characterId = isFavorite(item) 
    ? item.characterId 
    : parseInt(item.id, 10);
  const name = isFavorite(item) ? item.characterName : (item.name || "");
  const image = isFavorite(item) ? item.characterImage : item.image;
  const status = isFavorite(item) ? item.characterStatus : item.status;
  const species = isFavorite(item) ? item.characterSpecies : item.species;
  const isFavoriteValue = isFavorite(item) ? true : (item.isFavorite || false);
  const itemId = item.id;

  return (
    <tr key={itemId}>
      <td>
        {image && (
          <Image
            src={image}
            alt={name || "Character"}
            width={100}
            height={100}
          />
        )}
      </td>
      <td>{name}</td>
      <td>{status || "Unknown"}</td>
      <td>{species || "Unknown"}</td>
      {showFavoriteAction && (
        <td>
          <FavoriteButton
            characterId={characterId}
            characterName={name}
            characterImage={image || null}
            isFavorite={isFavoriteValue}
            canAdd={canAdd}
            canRemove={canRemove}
          />
        </td>
      )}
    </tr>
  );
}

