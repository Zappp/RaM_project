"use client";

import { useActionState } from "react";
import { signInAction } from "../actions";

export function SigninForm() {
  const [state, formAction] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="flex min-h-60 flex-col justify-between gap-y-5">
      <div>
        <label htmlFor="signin-email" className="mb-1 block font-medium text-sm text-text">
          Email:
        </label>
        <input
          id="signin-email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div role="alert" className="text-red-600 text-sm" id="signin-email-error">
          {state?.error?.fieldErrors?.email?.[0]}
        </div>
      </div>

      <div>
        <label htmlFor="signin-password" className="mb-1 block font-medium text-sm text-text">
          Password:
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div role="alert" className="text-red-600 text-sm" id="signin-password-error">
          {state?.error?.fieldErrors?.password?.[0]}
        </div>

        {state?.error?.formErrors?.[0] && (
          <div role="alert" className="text-red-600 text-sm" id="signin-error">
            {state?.error?.formErrors?.[0]}
          </div>
        )}
      </div>

      <button
        type="submit"
        aria-describedby={!state?.success ? "signin-error" : undefined}
        className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sign in
      </button>
    </form>
  );
}
