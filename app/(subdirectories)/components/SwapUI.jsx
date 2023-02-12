"use client";

import { useEffect, useState } from "react";
import { useSession, useSessionUpdate } from "../../SessionContext";

export default function SwapTable() {
    
    const user = useSession();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const getRequests = async () => {
            const res = await fetch(process.env.API_URL + `/api/swap/search?to=${user.username}`);
            const data = await res.json();

            setRequests(data);
        }

        getRequests().catch(console.error);
    }, []);

    

    const renderTable = () => {
        if (requests.length === 0) {
            return (
                <h1 className="px-3 py-4 text-lg">No pending requests.</h1>
            )
        } else {
            return (
                <table className="table-auto border-separate w-full min-w-fit">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 font-medium border border-slate-400 bg-slate-300 rounded-tl-lg">From</th>
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Received</th>
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Requested</th>
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300 rounded-tr-lg">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={request.id}>
                                <td className={`text-center border border-slate-300 ${index === requests.length - 1 ? "rounded-bl-lg" : ""}`}>
                                    <button 
                                        className="p-2 w-full rounded-md bg-white"
                                    >
                                        {request.fromLead}
                                    </button>
                                </td>
                                <td className="text-center py-2 px-2 border border-slate-300">{request.member1}</td>
                                <td className="text-center py-2 px-2 border border-slate-300">{request.member2}</td>
                                <td className={`text-center py-2 px-2 border border-slate-300 ${index === requests.length - 1 ? "rounded-br-lg" : ""}`}>
                                    <span 
                                        className={`text-slate-100 bg-gradient-to-r ${requests.completed === null ? "from-red-500 to-rose-500" :
                                            (requests.completed ? "from-green-500 to-emerald-500" : "from-amber-500 to-yellow-500")} px-2 py-1 rounded-lg`}
                                    >
                                        {requests.completed === null ? "rejected" : (requests.completed ? "accepted" : "pending")}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }
    }
    
    return (
        <section className="w-1/2 min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Swap Requests</h1>
            </div>
            <div className="box-border p-2 w-full h-auto max-h-128 overflow-y-scroll">
                {renderTable()}
            </div>
        </section>
    );
}