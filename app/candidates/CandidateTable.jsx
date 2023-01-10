"use client";

import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

export default function CandidateTable() {
    
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        const get = async () => {
            const res = await fetch('http://localhost:8080/api/candidate/get');
            const data = await res.json();
            
            setCandidates(data);
        }

        get().catch(console.error);
    }, []);

    const renderTable = () => {
        if (candidates.length === 0) {
            return (
                <h1 className="px-3 py-4 text-lg">No candidates enrolled.</h1>
            );
        } else {
            return (
                <table className="table-auto border-separate w-full">
                    <thead>
                        <tr>
                            <th className="py-2 font-medium border border-slate-400 bg-slate-300 rounded-tl-lg">Name</th>
                            <th className="py-2 font-medium border border-slate-400 bg-slate-300">Pronouns</th>
                            <th className="py-2 font-medium border border-slate-400 bg-slate-300">Email</th>
                            <th className="py-2 font-medium border border-slate-400 bg-slate-300">Assigned</th>
                            <th className="py-2 font-medium border border-slate-400 bg-slate-300 rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map(candidate => (
                            <tr key={candidate.id}>
                                <td className="text-left py-2 px-2 border border-slate-300">{candidate.name}</td>
                                <td className="text-center py-2 px-2 border border-slate-300">{candidate.pronouns}</td>
                                <td className="text-center py-2 px-2 border border-slate-300">{candidate.email}</td>
                                <td className="text-center py-2 px-2 border border-slate-300">
                                    <span className={`text-slate-100 bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-500 to-purple-500' : (candidate.assigned ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500')} px-2 py-1 rounded-lg`}>
                                        {candidate.actingInterest ? "acting" : (candidate.assigned ? "yes" : "no")}
                                    </span>
                                </td>
                                <td className="py-2 px-2 border border-slate-300 flex flex-auto justify-center">
                                    <FaUserEdit size={24} className="mx-auto hover:cursor-pointer hover:shadow-md"/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    }
    
    return (
        <section className="box-border w-full h-min bg-white rounded-2xl shadow-md">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Enrolled</h1>
            </div>
            <div className="box-border p-2 w-full min-h-4 max-h-128 rounded-b-2xl overflow-y-scroll">
                {renderTable()}
            </div>
        </section>
    );
}