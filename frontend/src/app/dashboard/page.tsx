import { Suspense } from "react";
import { DashboardCharacters } from "./DashboardCharacters";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-text mb-6">Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold text-text mb-4">Characters</h2>
        <Suspense
          fallback={
            <div className="text-center py-8 text-text-muted" role="status" aria-live="polite">
              Loading characters...
            </div>
          }
        >
          <DashboardCharacters searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}
