import Link from 'next/link';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error || 'An error occurred';

  return (
    <div>
      <h1>Authentication Error</h1>
      <p>{decodeURIComponent(error)}</p>
      <Link href="/">Go back to home</Link>
    </div>
  );
}
