import { signIn, signOut } from 'next-auth/react';

export const handleSignIn = () => {signIn('google');console.log('hi');}; 
export const handleSignOut = () => signOut();