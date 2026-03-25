"use client";

import { useActionState } from "react";
import { signupAction } from "../actions";

export function SignupForm() {
  const [state, formAction] = useActionState(signupAction, null);

  return (
    <form action={formAction} className="flex min-h-60 flex-col justify-between gap-y-5">
      <div>
        <label htmlFor="signup-email" className="mb-1 block font-medium text-sm text-text">
          Email:
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div role="alert" className="text-red-600 text-sm" id="signup-email-error">
          {state?.error?.fieldErrors?.email?.[0]}
        </div>
      </div>

      <div>
        <label htmlFor="signup-password" className="mb-1 block font-medium text-sm text-text">
          Password:
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div role="alert" className="text-red-600 text-sm" id="signup-password-error">
          {state?.error?.fieldErrors?.password?.[0]}
        </div>

        {state?.error?.formErrors?.[0] && (
          <div role="alert" className="text-red-600 text-sm" id="signup-error">
            {state?.error?.formErrors?.[0]}
          </div>
        )}
        {state?.success && (
          <output aria-live="assertive" className="text-primary-dark text-sm" id="signup-success">
            {state.data}
          </output>
        )}
      </div>

      <button
        type="submit"
        aria-describedby={!state ? undefined : state.success ? "signup-success" : "signup-error"}
        className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sign up
      </button>
    </form>
  );
}
