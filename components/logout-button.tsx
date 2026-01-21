'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
}