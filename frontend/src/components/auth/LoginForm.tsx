"use client";

import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginAction } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, null);
  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleAction = (data: LoginFormData) => {
    const formData = new FormData();
    formData.set("email", data.email);
    formData.set("password", data.password);
    formAction(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleAction)}>
      <div>
        <label htmlFor="login-email">Email:</label>
        <input
          id="login-email"
          type="email"
          {...register("email")}
          aria-invalid={formState.errors.email ? "true" : "false"}
        />
        {formState.errors.email && (
          <span>{formState.errors.email.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="login-password">Password:</label>
        <input
          id="login-password"
          type="password"
          {...register("password")}
          aria-invalid={formState.errors.password ? "true" : "false"}
        />
        {formState.errors.password && (
          <span>{formState.errors.password.message}</span>
        )}
      </div>

      {state?.error && <div>{state.error}</div>}

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
