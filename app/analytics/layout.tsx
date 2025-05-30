'use client'

import AuthProvider from '@/components/AuthProvider'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<Session | null>()
  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession()
      setSession(sessionData)
    }
    fetchSession()
  }, [])
  return <AuthProvider session={session}>{children}</AuthProvider>
}
