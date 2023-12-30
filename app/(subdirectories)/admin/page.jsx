"use client";

import { useState, useEffect, Fragment } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { Transition } from "@headlessui/react";
import { useSession, useSessionUpdate } from "../../SessionContext";
import SwapTable from "../components/SwapUI";
import { useRouter } from "next/navigation";
import SwapForm from "../components/SwapForm";

export default function AdminUI() {
    
    const user = useSession();
    const changeUser = useSessionUpdate();
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteCandidateModal, setDeleteCandidateModal] = useState(false);
    const [userIndex, setUserIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [productions, setProductions] = useState([]);
    const [productionsWithLead, setProductionsWithLead] = useState([]);
    const [formVisible, setFormVisible] = useState(false);

    const toggleDelete = () => {
        setDeleteModal(!deleteModal);
    }

    const toggleCandidateDelete = () => {
        setDeleteCandidateModal(!deleteCandidateModal);
    }

    const handleUsernameClick = (event, index) => {
        setUserIndex(index)
        toggle();
    }

    const toggle = () => {
        setVisible(!visible);
    }

    const toggleForm = () => {
        setFormVisible(!formVisible);
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

        const getManagedProds = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/getLead');
            const data = await res.json();

            setProductionsWithLead(data);
        }

        getUsers().catch(console.error);
        getProds().catch(console.error);
        getManagedProds().catch(console.error);
    }, [visible]);

    if (!user || user.role !== "admin") {
        return (
            <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col gap-12 min-h-screen h-auto w-screen pb-16">
                <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center">
                    <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                        Admin Panel.
                    </h1>
                    <p className="px-8 text-2xl text-center text-gray-800">
                        Please log in with an admin profile to access this page.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                </div>
            </div>
        )
    }
    
    return (
        <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col gap-12 min-h-screen h-auto w-screen pb-16">
            
            <Transition show={deleteModal} className="z-50">
                <Transition.Child
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <BackgroundOverlay />
                </Transition.Child>
                
                <Transition.Child
                    enter="transition-all ease-in-out duration-200"
                    enterFrom="translate-y-full scale-50"
                    enterTo="translate-y-0 scale-100"
                    leave="transition-all ease-in-out duration-200"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="translate-y-full scale-50"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <DeleteModal visible={deleteModal} setVisible={toggleDelete} />
                </Transition.Child>
            </Transition>

            <Transition show={deleteCandidateModal} className="z-50">
                <Transition.Child
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <BackgroundOverlay />
                </Transition.Child>
                
                <Transition.Child
                    enter="transition-all ease-in-out duration-200"
                    enterFrom="translate-y-full scale-50"
                    enterTo="translate-y-0 scale-100"
                    leave="transition-all ease-in-out duration-200"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="translate-y-full scale-50"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <DeleteCandidateModal visible={deleteCandidateModal} setVisible={toggleCandidateDelete} />
                </Transition.Child>
            </Transition>

            <Transition show={formVisible} className="z-50">
                <Transition.Child
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <BackgroundOverlay />
                </Transition.Child>
                
                <Transition.Child
                    enter="transition-all ease-in-out duration-200"
                    enterFrom="translate-y-full scale-50"
                    enterTo="translate-y-0 scale-100"
                    leave="transition-all ease-in-out duration-200"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="translate-y-full scale-50"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <SwapForm visible={formVisible} setVisible={toggleForm} productions={productionsWithLead} />
                </Transition.Child>
            </Transition>


            {visible && 
                <>
                    <BackgroundOverlay />
                    <EditUser user={users[userIndex]} productions={productions} visible={visible} toggleVisible={setVisible} />
                </>
            }
            
            <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                    Admin Panel.
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Home for approving swap requests, granting permissions, and resetting <span className="font-medium"> Crew Match</span>.
                    <br></br>
                    Logged in as <span className="font-medium">{user.username}</span>.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <ManageUsers users={users} handleUsernameClick={handleUsernameClick} />
            <ExportCSVUI />
            <MaxProductionSizeUI />
            {user.leads &&
                <>
                    <SwapTable outgoing={false} form={formVisible} setForm={toggleForm} />
                    <SwapTable outgoing={true} form={formVisible} setForm={toggleForm} />
                </>
            }
            <DeleteCandidateBox visible={deleteCandidateModal} setVisible={toggleCandidateDelete} />
            <DeleteProductionBox visible={deleteModal} setVisible={toggleDelete} />
        </div>
    );
}

function ManageUsers({ users, handleUsernameClick }) {
    return (
        <section className="w-1/2 min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Manage Users</h1>
            </div>
            <div className="box-border p-2 w-full max-h-128 overflow-y-scroll">
                <UserTable users={users} handleUsernameClick={handleUsernameClick} />
            </div>
        </section>
    );
}

function UserTable({ users, handleUsernameClick }) {
    
    if (users.length === 0) {
        return (
            <h1 className="px-3 py-4 text-lg">No users registered.</h1>
        );
    }

    return (
        <>
            {/* {visible && 
            <>
                <BackgroundOverlay />
                <EditUser user={users[userIndex]} productions={productions} visible={visible} toggleVisible={setVisible} />
            </>
            } */}
            
            
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
    const [updateRole, setUpdateRole] = useState(true);
    const [updateProdLead, setUpdateProdLead] = useState(user.role !== "user");
    const [message, setMessage] = useState("");
    const [prodMessage, setProdMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const currUser = useSession();
    const changeUser = useSessionUpdate();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleVisible();
        }
    };

    async function handleSubmit(e) {
        async function updateUser() {
            const response = await fetch(process.env.API_URL + `/api/user/update?username=${user.username}&role=${role}`, {
                method: 'PUT'
            });
            if (!response.ok) {
                const error = `An error has occurred: ${response.status}`;
                console.error(error);
                setMessage(error);
            } else {
                const data = await response.text();
                setMessage(data);
            }
        }

        async function assignUser() {
            const response2 = await fetch(process.env.API_URL + `/api/user/assign?username=${user.username}&production=${prodLead}`, {
                method: 'PUT'
            });
            if (!response2.ok) {
                const error2 = `An error has occurred: ${response2.status}`;
                console.error(error2);
                setProdMessage("An error occurred assigning the user.");
            } else {
                const data2 = await response2.text();
                setProdMessage(data2);
                // Update session details if the user being updated is the current user
                if (user.username === currUser.username) {
                    const newUser = {
                        ...currUser,
                        leads: prodLead
                    }
                    changeUser(newUser);
                    localStorage.setItem("user", JSON.stringify(newUser));
                }
            }
        }

        setLoading(true);
        e.preventDefault();

        console.log(user.username);
        console.log(role);
        console.log(prodLead);

        // Update the username if it is not the current user or the site maintainer
        if (user.username === 'rsastri21') {
            setMessage("That users permissions cannot be modified.");
            setUpdateRole(false);
        } else if (user.username === currUser.username && role !== currUser.role) {
            setMessage("The current user's role cannot be modified.");
            setUpdateRole(false);
        }

        // Possible cases
        if (updateRole) {
            await updateUser();
            await assignUser();
        } else {
            await assignUser();
        }
        
        setLoading(false);
    }

    function handleRoleChange(e) {
        setRole(e.target.value);
        setUpdateProdLead(e.target.value !== "user");
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
                                onChange={handleRoleChange}
                            >
                                <option value="user">user</option>
                                <option value="production head">production head</option>
                                <option value="admin">admin</option>
                            </select>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Assign to Lead Production:</label>
                            <select
                                className={`px-2 py-2 ml-6 rounded-lg ${updateProdLead ? "" : "hover:cursor-not-allowed"}`}
                                onChange={(e) => setProdLead(e.target.value)}
                                defaultValue="default"
                                disabled={!updateProdLead}
                            >
                                <option disabled={true} value="default">Select a production</option>
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

function ExportCSVUI() {
    
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [noName, setNoName] = useState(false);
    const [checked, setChecked] = useState(false);

    const handleChange = (event) => {
        if (event.target.value.length === 0) {
            setNoName(true);
        } else {
            setNoName(false);
        }
        setFileName(event.target.value);
    }
    
    const getCSVFile = async () => {
        if (fileName.length === 0) {
            return;
        }
        setLoading(true);

        const res = await fetch(process.env.API_URL + `/api/production/getCSV?filename=${fileName}&includeArchive=${checked}`);
        const data = await res.text();

        setLoading(false);

        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName + '.csv';
        link.href = url;
        link.click();
    }
    
    return (
        <section className="min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Export Productions</h1>
            </div>
            <div className="box-border px-2 pt-2 pb-10 w-full mx-auto h-auto flex flex-col justify-center gap-3">
                <p className="p-2 my-2 w-156 text-lg mx-auto text-gray-900 bg-slate-100 rounded-lg">
                    <span className="font-medium">Crew Match </span> allows the productions to be exported as a CSV file containing each production,
                    its current roles, and current members. A file will not be returned if no productions have been created yet. A name should be provided to title the
                    output file. For best compatibility with other file systems, it is recommended that the file name contain <span className="font-medium">no spaces</span>.
                </p>
                <div className="flex-col justify-center space-y-2 min-w-fit mx-auto bg-white rounded-xl shadow-md p-6">
                    <div className="flex space-x-4 min-w-fit mx-auto">
                        <div className="border p-2 mx-auto min-w-fit h-auto flex space-x-4 rounded-xl border-slate-200">
                            <label className="px-2 py-2 font-medium text-xl text-gray-900">Enter a file name:</label>
                            <input
                                className={`p-2 text-lg rounded-lg bg-slate-50 w-auto ${noName && "outline-red-400 outline outline-1"}`}
                                name="filename"
                                placeholder="File name"
                                onChange={event => handleChange(event)}
                                value={fileName}
                            />
                        </div>
                        <button 
                            onClick={() => getCSVFile()}
                            className={`px-2 py-4 min-w-fit text-lg my-auto rounded-xl font-medium text-slate-100 bg-gradient-to-r from-green-500 to-emerald-500
                                            shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-100 active:shadow-md
                                            ${loading ? "cursor-wait" : ""}`}>
                            Get File
                        </button>
                    </div>
                    <div className="w-fit h-fit bg-white p-2 rounded-xl mx-auto flex space-x-4 justify-center">
                        <input
                            className="ml-2 w-4 h-4 my-auto"
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                        />
                        <label className="my-auto text-lg font-medium">
                            Include archived productions.
                        </label>
                    </div>
                </div>
            </div>
        </section>
    )
}

function MaxProductionSizeUI() {
    
    const [value, setValue] = useState(24);
    const [enabled, setEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + '/api/config/getByName?name=maxCrewSize');
            const data = await res.json();

            setValue(data.value);
        }
        get().catch(console.error)
    }, []);

    const handleButtonClick = () => {

        if (enabled) {
            setLoading(true);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'maxCrewSize',
                    value: value
                })
            }
            fetch(process.env.API_URL + '/api/config/update', requestOptions)
                .then((res) => res.json())
                .then((res) => console.log(res))
                .finally(() => {
                    setLoading(false);
                });
        }

        setEnabled(!enabled);
    }

    return (
        <section className="min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Max Production Size</h1>
            </div>
            <div className="box-border px-2 pt-2 pb-2 w-full mx-auto h-auto flex flex-col justify-center gap-3">
                <p className="p-2 my-2 w-156 text-lg mx-auto text-gray-900 bg-slate-100 rounded-lg">
                    Adjust the maximum number of crew members allowed on a production by unlocking the slider, selecting a value, and clicking save. 
                    This value determines the max size for future creations/edits made and will not shrink current productions over the new limit. 
                </p>
                <div className="w-156 h-fit p-2 flex justify-between bg-white border-2 border-slate-200 rounded-xl shadow-md">
                    <h1 className="p-1 font-medium text-xl">Current Maximum Size: </h1>
                    <h1 className="p-1 font-medium text-xl">{value}</h1>
                </div>
                <div className="w-156 h-fit p-2 flex-col text-center bg-white rounded-xl">
                    <input className="w-full accent-sky-600" disabled={!enabled} type="range" name="slider" value={value} min="15" max="60" onInput={(event) => setValue(event.target.value)}/>
                    <div className="-mt-2 flex w-full justify-between">
                        <span className="text-sm text-gray-600">15</span>
                        <span className="text-sm text-gray-600">60</span>
                    </div>
                    <button 
                        onClick={() => handleButtonClick()}
                        className={`mt-2 px-3 py-4 w-fit text-lg rounded-xl font-medium text-slate-100 bg-gradient-to-r ${enabled ? "from-green-500 to-emerald-500" : "from-red-500 to-rose-500"}
                                        shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-100 active:shadow-md ${loading ? "cursor-wait" : ""}
                                    `}>
                        {!enabled ? "Unlock" : "Save"}
                    </button>
                </div>
            </div>
        </section>
    )
}

function DeleteProductionBox({ visible, setVisible }) {
    return (
        <section className="w-fit min-w-min h-auto shadow-md mx-auto bg-white rounded-2xl flex flex-col">
            <div className="w-full min-w-min h-fit bg-red-300 rounded-t-2xl shadow-md">
                <h1 className="px-3 py-4 text-gray-900 font-medium text-2xl min-w-fit">Reset Crew Match</h1>
            </div>
            <div className="box-border p-4 w-104 h-min rounded-b-2xl bg-red-100 flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-red-50 rounded-lg">
                    Reset <span className="font-medium">Crew Match </span> by deleting all candidates, productions, and swap requests.
                    Users will be persisted for future uses.
                    <br></br>
                    <span className="font-semibold">Warning:</span> This action cannot be undone, so please ensure that this deletion is intentional.
                </p>
                <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                    Reset Crew Match
                </button>
            </div>
        </section>
    )
}

function DeleteCandidateBox({ visible, setVisible }) {
    return (
        <section className="w-fit min-w-min h-auto shadow-md mx-auto bg-white rounded-2xl flex flex-col">
            <div className="w-full min-w-min h-fit bg-orange-300 rounded-t-2xl shadow-md">
                <h1 className="px-3 py-4 text-gray-900 font-medium text-2xl min-w-fit">Delete All Candidates</h1>
            </div>
            <div className="box-border p-4 w-104 h-min rounded-b-2xl bg-orange-100 flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-orange-50 rounded-lg">
                    Delete all candidates to prepare for a future assignment cycle. It is recommended that this action is done 
                    after archiving productions to maintain the previous assignment history. 
                    <br></br>
                    <span className="font-semibold">Warning:</span> This action cannot be undone, so please ensure that this deletion is intentional.
                </p>
                <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                    Delete Candidates
                </button>
            </div>
        </section>
    )
}

function DeleteCandidateModal({ visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = useSession();
    const changeUser = useSessionUpdate();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    const handleDeletePress = (e) => {
        
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'DELETE'
        }

        const deleteAll = async () => {
            await fetch(process.env.API_URL + "/api/candidate/deleteAll", requestOptions);
        }

        deleteAll()
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false);
                router.push("/");
            });
        
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to delete all candidates?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                <div className="w-full h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleDeletePress(e)} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Confirm Delete
                    </button>
                    <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );   
}

function DeleteModal({ visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const user = useSession();
    const changeUser = useSessionUpdate();
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    const handleDeletePress = (e) => {
        
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'DELETE'
        }

        const deleteAll = async () => {
            await Promise.all([
                fetch(process.env.API_URL + "/api/candidate/deleteAll", requestOptions),
                fetch(process.env.API_URL + "/api/production/deleteAll", requestOptions),
                fetch(process.env.API_URL + "/api/swap/deleteAll", requestOptions),
                fetch(process.env.API_URL + "/api/user/reset", {
                    method: 'PUT'
                })
            ]);
        }

        deleteAll()
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false);

                // Update session
                const newUser = {
                    ...user,
                    leads: ""
                };
                changeUser(newUser);
                localStorage.setItem("user", JSON.stringify(newUser));

                router.push("/");
            });
        
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to reset Crew Match?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                <div className="w-full h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleDeletePress(e)} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Confirm Reset
                    </button>
                    <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );   
}