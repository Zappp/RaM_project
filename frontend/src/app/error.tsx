'use client';

import Link from 'next/link';

export default function Error() {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>An unexpected error occurred</p>
      <Link href="/">Go back to home</Link>
    </div>
  );
}

