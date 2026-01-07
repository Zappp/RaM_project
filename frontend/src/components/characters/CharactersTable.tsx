import Image from "next/image";
import { FavoriteButton } from "./FavoriteButton";
import type { CharactersQuery } from "@/lib/types/generated";
import type { FavoriteCharactersQuery } from "@/lib/types/generated";

type Character = CharactersQuery["characters"]["results"][0];
type Favorite = FavoriteCharactersQuery["favoriteCharacters"]["results"][0];

type TableItem = (Character & { isFavorite?: boolean }) | Favorite;

interface CharactersTableProps {
  items: TableItem[];
  showFavoriteAction?: boolean;
  canAdd?: boolean;
  canRemove?: boolean;
}

function isFavoriteCharacter(item: TableItem): item is Favorite {
  return "characterId" in item && "characterName" in item;
}

function isCharacter(item: TableItem): item is Character {
  return "id" in item && "name" in item && !isFavoriteCharacter(item);
}

export function CharactersTable({
  items,
  showFavoriteAction = true,
  canAdd = true,
  canRemove = true,
}: CharactersTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Status</th>
          <th>Species</th>
          {showFavoriteAction && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          if (isFavoriteCharacter(item)) {
            return (
              <tr key={item.id}>
                <td>
                  {item.characterImage && (
                    <Image
                      src={item.characterImage}
                      alt={item.characterName}
                      width={100}
                      height={100}
                    />
                  )}
                </td>
                <td>{item.characterName}</td>
                <td>{item.characterStatus || "Unknown"}</td>
                <td>{item.characterSpecies || "Unknown"}</td>
                {showFavoriteAction && (
                  <td>
                    <FavoriteButton
                      characterId={item.characterId}
                      characterName={item.characterName}
                      characterImage={item.characterImage || null}
                      isFavorite={true}
                      canAdd={canAdd}
                      canRemove={canRemove}
                    />
                  </td>
                )}
              </tr>
            );
          }

          if (isCharacter(item)) {
            const characterId = parseInt(item.id, 10);
            return (
              <tr key={item.id}>
                <td>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name || "Character"}
                      width={100}
                      height={100}
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.status || "Unknown"}</td>
                <td>{item.species || "Unknown"}</td>
                {showFavoriteAction && (
                  <td>
                    <FavoriteButton
                      characterId={characterId}
                      characterName={item.name || ""}
                      characterImage={item.image || null}
                      isFavorite={item.isFavorite || false}
                      canAdd={canAdd}
                      canRemove={canRemove}
                    />
                  </td>
                )}
              </tr>
            );
          }

          return null;
        })}
      </tbody>
    </table>
  );
}

