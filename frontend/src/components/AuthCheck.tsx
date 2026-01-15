import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { authToken } from '@/stores/authStore';

export const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const $token = useStore(authToken);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!$token) {
      window.location.href = '/login';
    } else {
      setChecked(true);
    }
  }, [$token]);

  if (!checked) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};
