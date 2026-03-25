import type { Route } from "next";
import Link from "next/link";
import { SignoutButton } from "@/features/auth/components/SignoutButton";

interface NavItem {
  href: Route;
  name: string;
}

const navItems: NavItem[] = [
  { href: "/dashboard", name: "Dashboard" },
  { href: "/favorites", name: "Favorites" },
];

export function Navbar() {
  return (
    <nav className="border-border border-b bg-background" aria-label="Main navigation">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <ul className="flex space-x-4">
            {navItems.map(({ href, name }) => (
              <li key={name}>
                <Link
                  href={href}
                  className="rounded-md px-3 py-2 font-medium text-sm text-text transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>

          <SignoutButton />
        </div>
      </div>
    </nav>
  );
}
