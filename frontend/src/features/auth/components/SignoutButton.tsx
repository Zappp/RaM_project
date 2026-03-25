import { signOutAction } from "../actions";

export function SignoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        aria-label="Log out of your account"
        className="rounded-md border border-border px-4 py-2 font-medium text-sm text-text transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Sign out
      </button>
    </form>
  );
}
