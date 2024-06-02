'use client';

import { useState, useEffect } from 'react';
import { User, useSession } from '../../SessionContext';

function AdminRegistrationStatus({ status, handleClick, loading }: {
    status: number,
    handleClick: () => void,
    loading: boolean,
}): JSX.Element | undefined {
    switch(status) {
        case 0: 
            return (
                <button className={`py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-red-600 to-rose-500
                            rounded-lg text-slate-50 shadow-md hover:scale-105 hover:shadow-md 
                            active:scale-100 transition-all ${loading ? 'cursor-wait' : ''}`} onClick={handleClick}>
                    Closed
                </button>
            );
        case 1:
            return (
                <button className={`py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-emerald-600 to-teal-500
                            rounded-lg text-slate-50 shadow-md hover:scale-105 hover:shadow-md 
                            active:scale-100 transition-all ${loading ? 'cursor-wait' : ''}`} onClick={handleClick}>
                    Open
                </button>
            );
        case 2:
            return (
                <button className={`py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-orange-500 to-amber-500
                            rounded-lg text-slate-50 shadow-md hover:scale-105 hover:shadow-md 
                            active:scale-100 transition-all ${loading ? 'cursor-wait' : ''}`} onClick={handleClick}>
                    Accepting Late
                </button>
            );
        return (
            <></>
        );
        
    }
}

function UserRegistrationStatus({ status }: { status: number }): JSX.Element | undefined {
    switch(status) {
        case 0: 
            return (
                <h3 className="py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-red-600 to-rose-500
                            rounded-lg text-slate-50 shadow-md">
                    Closed
                </h3>
            );
        case 1:
            return (
                <h3 className="py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-emerald-600 to-teal-500
                            rounded-lg text-slate-50 shadow-md">
                    Open
                </h3>
            );
        case 2:
            return (
                <h3 className="py-2 px-3 my-2 font-md text-xl bg-gradient-to-r from-orange-500 to-amber-500
                            rounded-lg text-slate-50 shadow-md">
                    Accepting Late
                </h3>
            );
        return (
            <></>
        );
    }
}

interface IsRegistrationOpenRequest {
    id?: number;
    name: string;
    value: number;
}

export default function RegistrationCard(): JSX.Element {
    
    const [registrationStatus, setRegistrationStatus] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);

    const user: User = useSession();

    useEffect(() => {
        const abortController = new AbortController();

        const getRegistrationStatus = async (): Promise<void> => {
            const res: Response = await fetch(process.env.API_URL + '/api/config/getByName?name=isRegistrationOpen');
            const data: IsRegistrationOpenRequest = await res.json();

            setRegistrationStatus(data.value);
        }

        getRegistrationStatus().catch(console.error);

        return () => {
            abortController.abort();
        };
    }, []);

    const handleButtonClick = () => {
        setLoading(true);

        const newRegistrationStatus: number = (registrationStatus + 1) % 3;

        const registrationStatusRequest: IsRegistrationOpenRequest = {
            name: 'isRegistrationOpen',
            value: newRegistrationStatus
        };
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationStatusRequest)
        }
        fetch(process.env.API_URL + '/api/config/update', requestOptions)
            .then((res: Response) => res.json())
            .then((data: IsRegistrationOpenRequest) => {
                setRegistrationStatus(newRegistrationStatus);
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to update registration status.");
            })
            .finally(() => {
                setLoading(false);
            });
    }
    
    return (
        <div className="w-96 h-fit px-2 bg-white rounded-xl shadow-md flex justify-between">
            <h1 className="px-2 py-4 font-md text-2xl">Registration:</h1>
            {user && user.role === "admin"
                ? <AdminRegistrationStatus status={registrationStatus} handleClick={handleButtonClick} loading={loading} />
                : <UserRegistrationStatus status={registrationStatus} />
            }
        </div>
    );
}
