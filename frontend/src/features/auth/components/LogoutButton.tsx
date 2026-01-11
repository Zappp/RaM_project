"use client";

import { logoutAction } from "../actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Log out of your account"
        className="px-4 py-2 text-sm font-medium text-text hover:text-primary transition-colors border border-border rounded-md hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Logout
      </button>
    </form>
  );
}
