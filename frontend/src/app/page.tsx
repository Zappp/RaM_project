import { SignupForm } from "@/features/auth/components/SignupForm";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function HomePage() {
  return (
    <div>
      <h1>RaM App</h1>
      <div>
        <h2>Signup</h2>
        <SignupForm />
      </div>
      <div>
        <h2>Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}
