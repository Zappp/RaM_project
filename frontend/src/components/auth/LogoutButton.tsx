import { logoutAction } from '@/lib/actions/auth';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit">Logout</button>
    </form>
  );
}

