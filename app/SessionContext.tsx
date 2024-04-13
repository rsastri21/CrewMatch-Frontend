"use client";

import { useContext, useState, createContext, useLayoutEffect, ReactNode } from 'react';

export interface User {
    username: string;
    name: string;
    role: string;
    leads: string | null;
}

export interface ChangeUser {
    (newUser: User): void; 
}

const SessionContext = createContext<User>(null!);
const SessionUpdateContext = createContext<ChangeUser>(null!);

export function useSession() {
    return useContext(SessionContext);
}

export function useSessionUpdate() {
    return useContext(SessionUpdateContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
    
    const storedUserString: string | null = localStorage.getItem('user');
    const storedUser: User | null = storedUserString ? JSON.parse(storedUserString!) : null;

    const [user, setUser] = useState<User>(storedUser || {
        username: '',
        name: '',
        role: '',
        leads: '',
    });

    function changeSession(newUser: User) {
        setUser({...newUser});
    }

    return (
        <SessionContext.Provider value={user}>
            <SessionUpdateContext.Provider value={changeSession}>
                {children}
            </SessionUpdateContext.Provider>
        </SessionContext.Provider>
    );

}