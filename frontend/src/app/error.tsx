"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <main className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="font-bold text-4xl text-text">Something went wrong!</h1>
          <p className="text-text-muted">An unexpected error occurred</p>
        </div>
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
