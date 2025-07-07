import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProfileEdit } from './ProfileEdit';

export default function DashboardDropdown() {
  const { auth } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      router.push('/logout');
    } catch (error) {
      console.error('Error redirecting to logout:', error);
    }
  };

  return (
    <div className="py-1">
      <ProfileEdit />
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
} 