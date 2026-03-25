import { addFavoriteCharacterAction } from "@/features/favoriteCharacters/actions";
import {
  CHARACTER_ACTION_TYPE,
  type CharactersTableAction,
  type CharacterWithFavorite,
} from "@/shared/types/charactersTable";

interface AddFavoriteButtonProps {
  item: CharacterWithFavorite;
  optimisticAction: (action: CharactersTableAction) => void;
}

export function AddFavoriteButton({ item, optimisticAction }: AddFavoriteButtonProps) {
  const { remoteId, name, image, species, status, isFavorite = false } = item;

  if (isFavorite) return <span className="text-sm text-yellow-500">★ Favorite</span>;

  async function action(formData: FormData) {
    optimisticAction({ type: CHARACTER_ACTION_TYPE.ADD, payload: { remoteId } });
    await addFavoriteCharacterAction(null, formData);
  }

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="remoteId" value={remoteId} />
        <input type="hidden" name="name" value={name} />
        {image && <input type="hidden" name="image" value={image} />}
        {species && <input type="hidden" name="species" value={species} />}
        {status && <input type="hidden" name="status" value={status} />}
        <button
          type="submit"
          className="rounded-md border border-border px-3 py-1 text-sm text-text transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ☆ Add
        </button>
      </form>
    </div>
  );
}
