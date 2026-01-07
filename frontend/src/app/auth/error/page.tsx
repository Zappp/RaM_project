import Link from 'next/link';

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error || 'An error occurred';

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{decodeURIComponent(error)}</p>
      <Link href="/">Go back to home</Link>
    </div>
  );
}
