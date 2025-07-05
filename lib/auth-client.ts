import { createAuthClient } from '@better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000',
  callbacks: {
    onError: (error: Error) => {
      console.error('Auth error:', error);
    }
  }
}); 