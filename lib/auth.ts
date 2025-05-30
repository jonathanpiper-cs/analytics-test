import { signIn, signOut } from 'next-auth/react'

export const handleSignIn = () => {
  signIn('google')
  console.log('hi')
}
export const handleSignOut = () => signOut()

import { authConfig } from '@/auth.config'
import Google from 'next-auth/providers/google'

export const authOptions = {
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
}
