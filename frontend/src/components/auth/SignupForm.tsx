"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { signupAction } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, formAction] = useFormState(signupAction, null);
  const { register, handleSubmit, formState, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (state?.message && !state?.error) {
      reset();
    }
  }, [state, reset]);

  const handleAction = (data: SignupFormData) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleAction)}>
      <div>
        <label htmlFor="signup-email">Email:</label>
        <input
          id="signup-email"
          type="email"
          {...register("email")}
          aria-invalid={formState.errors.email ? "true" : "false"}
        />
        {formState.errors.email && (
          <span>{formState.errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="signup-password">Password:</label>
        <input
          id="signup-password"
          type="password"
          {...register("password")}
          aria-invalid={formState.errors.password ? "true" : "false"}
        />
        {formState.errors.password && (
          <span>{formState.errors.password.message}</span>
        )}
      </div>

      {state?.error && <div>{state.error}</div>}
      {state?.message && <div>{state.message}</div>}

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Signing up..." : "Signup"}
      </button>
    </form>
  );
}
