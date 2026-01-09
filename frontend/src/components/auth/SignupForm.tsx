"use client";

import { useActionState } from "react";
import { signupAction } from "@/lib/actions/auth";
import type { ActionResult } from "@/lib/types/actions";

export function SignupForm() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    signupAction,
    null
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
        />
      </div>

      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
        />
      </div>

      {state && "error" in state && <div>{state.error}</div>}
      {state && "success" in state && state.message && <div>{state.message}</div>}

      <button type="submit">Signup</button>
    </form>
  );
}
