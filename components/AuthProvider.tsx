'use client'

import { handleSignIn, handleSignOut } from '@/lib/auth'
// import { useSession } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react'

import { ReactNode } from 'react'
import type { Session } from 'next-auth'

type Props = {
  children: ReactNode
  session?: Session | null
}

export default function AuthProvider({ children, session }: Props) {
  return (
    <div>
      {session ? (
        <div className="flex min-h-screen flex-col items-end">
          <button
            type="button"
            className="align-self-end absolute bg-red-500 p-2 hover:bg-fuchsia-500"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <SessionProvider>{children}</SessionProvider>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-bold">
            Please sign in to view this data.
          </h2>
          <button
            type="button"
            className="my-2 w-24 bg-sky-500 p-2 hover:bg-fuchsia-500"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}
