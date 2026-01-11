import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function Navbar() {
  return (
    <nav className="bg-background border-b border-border" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4" role="list">
            <Link
              href="/dashboard"
              className="text-text hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              role="listitem"
            >
              Dashboard
            </Link>
            <Link
              href="/favorites"
              className="text-text hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              role="listitem"
            >
              Favorites
            </Link>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
