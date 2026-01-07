import { Navbar } from "@/components/layout/Navbar";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}


