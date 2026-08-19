'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/');
  };

  return (
    <Button variant="ghost" className="hidden sm:inline-flex" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
