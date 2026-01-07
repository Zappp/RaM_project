import { getUser } from '@/lib/utils/user';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Welcome!</h2>
        <div>ID: {user.id}</div>
        <div>Email: {user.email || 'No email'}</div>
        <div>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</div>
      </div>
      <LogoutButton />
    </div>
  );
}

