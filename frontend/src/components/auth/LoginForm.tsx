"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import type { ActionResult } from "@/lib/types/actions";

export function LoginForm() {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    loginAction,
    null
  );

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
        />
      </div>

      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
        />
      </div>

      {state && "error" in state && <div>{state.error}</div>}

      <button type="submit">Login</button>
    </form>
  );
}
