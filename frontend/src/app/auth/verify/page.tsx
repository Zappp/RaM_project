import { Suspense } from "react";
import { VerifyContent } from "@/components/verify/VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

