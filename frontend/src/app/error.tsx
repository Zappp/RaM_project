"use client";

import Link from "next/link";

export default function Error() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="text-center space-y-4" role="alert">
        <h1 className="text-4xl font-bold text-text">Something went wrong!</h1>
        <p className="text-text-muted">An unexpected error occurred</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Go back to home
        </Link>
      </main>
    </div>
  );
}
