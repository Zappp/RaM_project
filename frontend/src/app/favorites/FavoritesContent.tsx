import { getFavoriteCharacters } from "@/features/favorites/actions/favoriteCharacters";
import { FavoritesList } from "@/features/favorites/components/FavoritesList";

export async function FavoritesContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page, 10) : 1;
  const favoritesData = await getFavoriteCharacters(page);

  if (!favoritesData || "error" in favoritesData) {
    return (
      <div>
        <p>Failed to load favorites. Please try again later.</p>
      </div>
    );
  }

  return (
    <FavoritesList
      favorites={favoritesData.results}
      pageInfo={favoritesData.info}
      currentPage={page}
    />
  );
}
