"use client";

import { useContext, useState, createContext, useLayoutEffect } from 'react';

const SessionContext = createContext();
const SessionUpdateContext = createContext();

export function useSession() {
    return useContext(SessionContext);
}

export function useSessionUpdate() {
    return useContext(SessionUpdateContext);
}

export function SessionProvider({ children }) {
    
    const [user, setUser] = useState({});

    useLayoutEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser !== null) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    function changeSession(newUser) {
        setUser({...newUser});
    }

    return (
        <SessionContext.Provider value={user}>
            <SessionUpdateContext.Provider value={changeSession}>
                {children}
            </SessionUpdateContext.Provider>
        </SessionContext.Provider>
    )

}