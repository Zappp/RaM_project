"use client";

import Link from "next/link";

// TODO update err pages for consistant ui
// TODO when rate limit hits error button do nothing

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <main className="space-y-4 text-center" role="alert">
        <h1 className="font-bold text-4xl text-text">Something went wrong!</h1>
        <p className="text-text-muted">An unexpected error occurred</p>
        <Link
          href="/"
          className="inline-block rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Go back to home
        </Link>
      </main>
    </div>
  );
}
