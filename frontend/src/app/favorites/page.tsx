import { Suspense } from "react";
import { FavoritesContent } from "./FavoritesContent";

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div>
      <h1>My Favorite Characters</h1>
      <Suspense fallback={<div>Loading favorites...</div>}>
        <FavoritesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
