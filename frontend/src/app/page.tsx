import { SignupForm } from "@/features/auth/components/SignupForm";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main id="main-content" className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-center text-text">RaM App</h1>
        <div className="space-y-6">
          <div className="bg-background rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-text">Signup</h2>
            <SignupForm />
          </div>
          <div className="bg-background rounded-lg border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-text">Login</h2>
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
