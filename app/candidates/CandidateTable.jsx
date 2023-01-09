"use client";

import { FaUserEdit } from "react-icons/fa";
import { TiDelete } from "react-icons/ti";

async function getCandidates() {

    let candidateInfo;

    const res = await fetch('http://localhost:8080/api/candidate/get')
                        .then(response => response.json())
                        .then(result => {
                            candidateInfo = result;
                        });
    return candidateInfo;

}


export default function CandidateTable() {
    return (
        <div className="box-border w-full h-min bg-white rounded-2xl shadow-md">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-md text-2xl">Enrolled</h1>
            </div>
            <div className="box-border p-2 w-full min-h-4 h-auto rounded-b-2xl">
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
                        <tr>
                            <td className="text-left py-2 px-2 border border-slate-300">Rohan Sastri</td>
                            <td className="text-center py-2 px-2 border border-slate-300">he/him</td>
                            <td className="text-center py-2 px-2 border border-slate-300">rsastri@uw.edu</td>
                            <td className="text-center py-2 px-2 border border-slate-300">
                                <span className="text-slate-100 bg-gradient-to-r from-red-500 to-rose-500 px-2 py-1 rounded-lg">false</span>
                            </td>
                            <td className="py-2 px-2 border border-slate-300 flex flex-auto justify-center">
                                <FaUserEdit size={24} className="ml-2 mr-1 hover:cursor-pointer hover:shadow-md"/>
                                <TiDelete size={24} className="mr-2 ml-1 hover:cursor-pointer hover:shadow-md"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}