"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("message");

    if (error) {
      setStatus("error");
      setMessage(error);
      return;
    }

    if (success === "true") {
      setStatus("success");
      setMessage("Email verified successfully!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setStatus("error");
      setMessage("Verification failed");
    }
  }, [searchParams, router]);

  if (status === "loading") {
    return <div>Verifying your email...</div>;
  }

  if (status === "error") {
    return (
      <div>
        <div>Verification Failed</div>
        <div>{message}</div>
        <button onClick={() => router.push("/")}>Go to Home</button>
      </div>
    );
  }

  return (
    <div>
      <div>Email Verified!</div>
      <div>Redirecting to home page...</div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}

