"use client"

import { app, auth } from './firebase';
import { AuthProvider, FirebaseAppProvider } from 'reactfire';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseAppProvider firebaseApp={app}>
            <AuthProvider sdk={auth}>
                {children}
            </AuthProvider>
        </FirebaseAppProvider>
    );
}
