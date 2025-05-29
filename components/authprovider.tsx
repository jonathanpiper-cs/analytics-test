"use client";

import { handleSignIn, handleSignOut } from '@/lib/auth';
// import { useSession } from 'next-auth/react';
import { SessionProvider } from "next-auth/react"

import { ReactNode } from 'react';
import type { Session } from "next-auth";

type Props = {
	children: ReactNode;
	session?: Session | null;
};

export default function AuthProvider({ children, session }: Props) {

	return (
		<div>
			{session ? (
				<div>
				<p>Welcome, {session?.user?.name}!</p>
				<button onClick={handleSignOut}>Sign Out</button>
                				<SessionProvider>
			{children}
				</SessionProvider>
				</div>
			) : (
				<button type="button" className="p-2 bg-sky-500 hover:bg-fuchsia-500" onClick={handleSignIn}>Sign In</button>
			)}
		</div>

	);
	}
