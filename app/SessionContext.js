"use client";

import React, { useContext, useState } from 'react';

const SessionContext = React.createContext();
const SessionUpdateContext = React.createContext();

export function useSession() {
    return useContext(SessionContext);
}

export function useSessionUpdate() {
    return useContext(SessionUpdateContext);
}

export function SessionProvider({ children }) {
    const [user, setUser] = useState({});

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