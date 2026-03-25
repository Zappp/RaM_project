import { SigninForm } from "@/features/auth/components/SigninForm";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-start justify-center p-4">
      <main id="main-content" className="w-full max-w-3xl space-y-8">
        <h1 className="text-center font-bold text-4xl text-text">Rick and Morty App</h1>
        <div className="flex flex-wrap items-start gap-6">
          <div className="w-full min-w-75 flex-1 rounded-lg border border-border bg-background p-6 shadow-sm sm:max-w-none sm:flex-1">
            <h2 className="mb-4 text-center font-semibold text-2xl text-text">Sign up</h2>
            <SignupForm />
          </div>
          <div className="w-full min-w-75 flex-1 rounded-lg border border-border bg-background p-6 shadow-sm sm:max-w-none sm:flex-1">
            <h2 className="mb-4 text-center font-semibold text-2xl text-text">Sign in</h2>
            <SigninForm />
          </div>
        </div>
      </main>
    </div>
  );
}
