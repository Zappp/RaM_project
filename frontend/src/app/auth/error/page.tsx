import { Suspense } from "react";
import { AuthErrorContent } from "./AuthErrorContent";

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent searchParams={searchParams} />
    </Suspense>
  );
}
