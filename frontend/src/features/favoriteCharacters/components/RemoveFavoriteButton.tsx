import {
  CHARACTER_ACTION_TYPE,
  type CharactersTableAction,
  type CharacterWithFavorite,
} from "@/shared/types/charactersTable";
import { removeFavoriteCharacterByIdAction } from "../actions";

interface RemoveFavoriteButtonProps {
  id: CharacterWithFavorite["id"];
  optimisticAction: (action: CharactersTableAction) => void;
}

export function RemoveFavoriteButton({ id, optimisticAction }: RemoveFavoriteButtonProps) {
  async function action(formData: FormData) {
    optimisticAction({ type: CHARACTER_ACTION_TYPE.REMOVE, payload: { id } });
    await removeFavoriteCharacterByIdAction(null, formData);
  }

  return (
    <div>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button
          className="rounded-md border border-yellow-300 px-3 py-1 text-sm text-yellow-600 transition-colors hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          ★ Remove
        </button>
      </form>
    </div>
  );
}
