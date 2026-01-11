import { Suspense } from "react";
import { FavoritesContent } from "./FavoritesContent";

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">My Favorite Characters</h1>
      <Suspense
        fallback={
          <div className="text-center py-8 text-text-muted" role="status" aria-live="polite">
            Loading favorites...
          </div>
        }
      >
        <FavoritesContent searchParams={searchParams} />
        </Suspense>
    </main>
  );
}
