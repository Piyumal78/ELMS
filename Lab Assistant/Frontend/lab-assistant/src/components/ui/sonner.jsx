import { useEffect } from 'react';

export function Toaster() {
  useEffect(() => {
    // This is a simplified version. In a real app, you'd use the actual sonner library
    console.log('Toaster mounted');
  }, []);

  return null;
}

export function toast() {
  // Simplified toast function
  console.log('Toast called');
}