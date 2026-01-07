import { getFavoriteCharacters } from "@/lib/actions/favoriteCharacters";
import { FavoritesList } from "@/components/favorites/FavoritesList";

export default async function FavoritesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const favoritesData = await getFavoriteCharacters(page);

  if (!favoritesData) {
    return (
      <div>
        <h1>My Favorite Characters</h1>
        <p>Failed to load favorites. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>My Favorite Characters</h1>
      <FavoritesList
        favorites={favoritesData.results}
        pageInfo={favoritesData.info}
        currentPage={page}
      />
    </div>
  );
}
