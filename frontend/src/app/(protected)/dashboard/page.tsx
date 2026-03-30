import { Suspense } from "react";
import { CharactersList } from "@/features/characters/components/CharactersList";
import { CharactersTableSkeleton } from "@/shared/components/charactersTable/CharactersTableSkeleton";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 font-bold text-3xl text-text">Dashboard</h1>
      <div>
        <h2 className="mb-4 font-semibold text-text text-xl">Characters</h2>
        <Suspense fallback={<CharactersTableSkeleton withPagination={true} />}>
          <CharactersList searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
