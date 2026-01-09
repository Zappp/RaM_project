import { Suspense } from "react";
import { DashboardCharacters } from "./DashboardCharacters";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Characters</h2>
        <Suspense fallback={<div>Loading characters...</div>}>
          <DashboardCharacters searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
