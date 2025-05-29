   // app/api/auth/[...nextauth]/route.ts
   import NextAuth from 'next-auth';
   import { authConfig } from '@/auth.config';
   import Google from 'next-auth/providers/google';

   export const { handlers, auth, signIn, signOut } = NextAuth({
       ...authConfig,
       providers: [
           Google({
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
           }),
       ],
   });

   export const { GET, POST } = handlers;