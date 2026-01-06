"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message") || "An error occurred";

  return (
    <div>
      <h1>Authentication Error</h1>
      <div>{message}</div>
      <button onClick={() => router.push("/")}>Go to Home</button>
    </div>
  );
}

