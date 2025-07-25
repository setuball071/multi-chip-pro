"use client"

import { app, auth } from './firebase';
import { AuthProvider } from 'reactfire';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider sdk={auth}>
            {children}
        </AuthProvider>
    );
}
