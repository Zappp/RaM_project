import { Suspense } from "react";
import { FavoriteCharactersList } from "@/features/favoriteCharacters/components/FavoriteCharactersList";
import { CharactersTableSkeleton } from "@/shared/components/charactersTable/CharactersTableSkeleton";

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-bold text-3xl text-text">My Favorite Characters</h1>
      <Suspense fallback={<CharactersTableSkeleton />}>
        <FavoriteCharactersList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
