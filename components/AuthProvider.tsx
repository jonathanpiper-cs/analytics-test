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
				<div className="flex flex-col items-end  min-h-screen">
				<button type="button" className="p-2 bg-red-500 hover:bg-fuchsia-500 align-self-end absolute" onClick={handleSignOut}>Sign Out</button>
					<SessionProvider>
						{children}
				</SessionProvider>
				</div>
			) : (
                <div className="p-4">
                <h2 className="text-xl font-bold">Please sign in to view this data.</h2>
				<button type="button" className="my-2 p-2 bg-sky-500 hover:bg-fuchsia-500 w-24" onClick={handleSignIn}>Sign In</button>
                </div>
			)}
		</div>

	);
	}
