"use client";

import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Transition } from "@headlessui/react";
import { useSession } from "../../SessionContext";

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
            <div className="box-border p-2 w-full max-h-128 overflow-y-scroll">
                <UserTable />
            </div>
        </section>
    );
}

function UserTable() {
    
    const [users, setUsers] = useState([]);
    const [productions, setProductions] = useState([]);
    const [userIndex, setUserIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    const handleUsernameClick = (event, index) => {
        setUserIndex(index)
        toggle();
    }

    const toggle = () => {
        setVisible(!visible);
    }

    useEffect(() => {
        const getUsers = async () => {
            const res = await fetch(process.env.API_URL + '/api/user/get');
            const data = await res.json();

            setUsers(data);
        }

        const getProds = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/getNoLead');
            const data = await res.json();

            setProductions(data);
        }

        getUsers().catch(console.error);
        getProds().catch(console.error);
    }, [visible]);

    if (users.length === 0) {
        return (
            <h1 className="px-3 py-4 text-lg">No users registered.</h1>
        );
    }

    return (
        <>
            {visible && 
            <>
                <BackgroundOverlay />
                <EditUser user={users[userIndex]} productions={productions} visible={visible} toggleVisible={setVisible} />
            </>
            }
            
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
                                <button
                                    onClick={(event) => handleUsernameClick(event, index)}
                                    className="p-2 w-full rounded-md bg-white hover:scale-105 hover:shadow-md active:bg-slate-100 transition-all"
                                >
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
        </>
    )
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}

function EditUser({ user, productions, visible, toggleVisible }) {
    
    const [role, setRole] = useState(!user.role ? "" : user.role);
    const [prodLead, setProdLead] = useState(!user.leads ? "" : user.leads);
    const [message, setMessage] = useState("");
    const [prodMessage, setProdMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const currUser = useSession();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleVisible();
        }
    };

    const handleSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        console.log(user.username);
        console.log(role);
        console.log(prodLead);

        // Update the username if it is not the current user
        if (user.username !== currUser.username) {
            fetch(process.env.API_URL + `/api/user/update?username=${user.username}&role=${role}`, {
                method: 'PUT'
            })
                .then((res) => res.text())
                .then((data) => setMessage(data))
                .catch((err) => console.error(err));

        } else if (role !== currUser.role) {
            setMessage("The current user's role cannot be modified.");
        }

        fetch(process.env.API_URL + `/api/user/assign?username=${user.username}&production=${prodLead}`, {
            method: 'PUT'
        })
            .then((res) => res.text())
            .then((data) => setProdMessage(data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }
    
    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 flex flex-col justify-center">
            <section className="mx-auto box-border w-fit min-w-fit h-72 bg-white rounded-2xl shadow-md">
                <div className="px-4 bg-white z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex justify-center">
                    <AiOutlineUser className="w-9 h-9 ml-2 mr-1 my-3" />
                    <h1 className="px-3 py-4 font-medium text-2xl">{user.username}</h1>
                </div>
                <section className="box-border p-2 w-full h-fit bg-white rounded-b-2xl flex flex-col items-center">
                    <div className="text-center py-2 px-2">
                        <span className={`px-4 py-8 text-slate-100 text-lg shadow-md bg-gradient-to-r ${(user.role === "production head") ? 'from-violet-500 to-purple-500' : ((user.role === "admin") ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500')} px-2 py-1 rounded-lg`}>
                            {user.role}
                        </span>
                    </div>
                    {!user.leads || user.leads.length > 0 &&
                        <div className="text-center py-2 px-2">
                            <span className="px-2 py-1 text-slate-100 text-lg shadow-md bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                                {user.leads}
                            </span>
                        </div>
                    }
                    <form onSubmit={handleSubmit} className="w-full h-full box-border p-2 columns-sm">
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Update Role:</label>
                            <select 
                                className="px-2 py-2 ml-6 rounded-lg"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="user">user</option>
                                <option value="production head">production head</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Assign to Lead Production:</label>
                            <select
                                className="px-2 py-2 ml-6 rounded-lg"
                                value={prodLead}
                                onChange={(e) => setProdLead(e.target.value)}
                            >
                                <option value=""></option>
                                {productions.map((production) => (
                                    <option key={production.id} value={production.name}>{production.name}</option>
                                ))}
                            </select>
                        </div>
                        {message.length !== 0 && 
                            <h1 className="px-2 py-2 my-1 font-medium text-lg">{message}</h1>
                        }
                        {prodMessage.length !== 0 && 
                            <h1 className="px-2 py-2 my-1 font-medium text-lg">{prodMessage}</h1>
                        }
                        <div className="mx-auto my-4 pt-2 w-full flex justify-center">
                            <button type="submit" className={`px-3 py-3 mr-1 ml-auto rounded-lg shadow-md bg-gradient-to-r from-green-500 to-emerald-500 text-center text-slate-100 font-medium
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all ${loading ? "cursor-wait" : ""}`}>
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => toggleVisible()}
                                className="px-3 py-3 ml-1 mr-auto rounded-lg shadow-md bg-gradient-to-r from-red-500 to-rose-500 text-center text-slate-100 font-medium
                                    hover:scale-105 hover:shadow-lg active:scale-100 transition-all">
                                Close
                            </button>
                        </div>
                    </form>
                </section>
            </section>
        </div>
    );
}