import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function Navbar() {
  return (
    <nav>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/favorites">Favorites</Link>
      <LogoutButton />
    </nav>
  );
}

