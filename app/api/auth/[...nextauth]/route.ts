// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
// import { authConfig } from '@/auth.config'
// import Google from 'next-auth/providers/google'
import { authOptions } from '@/lib/auth'

const {
  handlers: { GET, POST },
} = NextAuth(authOptions)

export { GET, POST }
