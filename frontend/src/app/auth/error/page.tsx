import Link from "next/link";
import { Suspense } from "react";

async function ErrorContent({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams;

  return (
    <div className="space-y-2">
      <h1 className="font-bold text-4xl text-text">Authentication Error</h1>
      <p className="text-text-muted">
        {params?.error ? `${params.error}` : "An authentication error occurred."}
      </p>
    </div>
  );
}

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <main className="w-full max-w-md space-y-6 text-center">
        <Suspense fallback={<div className="text-text-muted">Loading...</div>}>
          <ErrorContent searchParams={searchParams} />
        </Suspense>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Go back
        </Link>
      </main>
    </div>
  );
}
