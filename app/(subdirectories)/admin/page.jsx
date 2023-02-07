"use client";

import { useState, useEffect } from "react";

export default function AdminUI() {
    return (
        <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center pb-12">
                <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                    Admin Panel.
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Home for approving swap requests, granting permissions, and resetting <span className="font-medium"> Crew Match</span>.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <ManageUsers />
        </div>
    );
}

function ManageUsers() {
    return (
        <section className="w-1/2 min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Manage Users</h1>
            </div>
            <div className="box-border p-2 w-full min-w-fit h-fit max-h-128 rounded-b-2xl overflow-y-scroll">
                <UserTable />
            </div>
        </section>
    );
}

function UserTable() {
    
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + '/api/user/get');
            const data = await res.json();

            setUsers(data);
        }

        get().catch(console.error);
    }, []);

    if (users.length === 0) {
        return (
            <h1 className="px-3 py-4 text-lg">No users registered.</h1>
        );
    }

    return (
        <table className="table-auto border-separate w-full min-w-fit">
            <thead>
                <tr>
                    <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300 rounded-tl-lg">Username</th>
                    <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Role</th>
                    <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300 rounded-tr-lg">Production Lead For</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td className={`text-center border border-slate-300 transition-all ${index === users.length - 1 ? "rounded-bl-lg" : ""}`}>
                            <button className="p-2 w-full rounded-md bg-white hover:scale-105 hover:shadow-md active:bg-slate-100 transition-all">
                                {user.username}
                            </button>
                        </td>
                        <td className="text-center py-2 px-2 border border-slate-300">
                            <span className={`text-slate-100 px-2 py-1 rounded-lg bg-gradient-to-r
                                ${user.role === "admin" ? "from-green-500 to-emerald-500" : 
                                (user.role === "production head" ? "from-violet-500 to-purple-500" : 
                                "from-red-500 to-rose-500")}`}>{user.role}</span>
                        </td>
                        <td className={`text-center py-2 px-2 border border-slate-300 ${index === users.length - 1 ? "rounded-br-lg" : ""}`}>{user.leads}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}