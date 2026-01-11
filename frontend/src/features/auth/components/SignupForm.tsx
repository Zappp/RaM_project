"use client";

import { useActionState } from "react";
import { signupAction } from "../actions/auth";
import type { ActionResult } from "@/lib/types/actions";

export function SignupForm() {
  const [state, formAction] = useActionState<ActionResult, FormData>(signupAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-text mb-1">
          Email:
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-text mb-1">
          Password:
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {state && "error" in state && (
        <div role="alert" aria-live="polite" className="text-red-600 text-sm" id="signup-error">
          {state.error}
        </div>
      )}
      {state && "success" in state && state.message && (
        <div
          role="status"
          aria-live="polite"
          className="text-green-600 text-sm"
          id="signup-success"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        aria-describedby={
          state && "error" in state
            ? "signup-error"
            : state && "success" in state
              ? "signup-success"
              : undefined
        }
        className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Signup
      </button>
    </form>
  );
}
