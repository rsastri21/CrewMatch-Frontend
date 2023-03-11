"use client";

import { useLayoutEffect, useEffect, useState } from "react";
import { useSession, useSessionUpdate } from "../../SessionContext.js";
import { useRouter } from 'next/navigation';
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { Switch, Transition } from "@headlessui/react";

export default function CandidateTable({ fetchURL, mode, role, index, prod, visible, toggleVisible }) {
    
    const [candidates, setCandidates] = useState([]);
    const [candidateIndex, setCandidateIndex] = useState(0);
    const [indexEdit, setIndexEdit] = useState(0);
    const [modal, setModal] = useState(false);
    const [edit, setEdit] = useState(false);
    const [interested, setInterested] = useState(true);


    const user = useSession();

    useEffect(() => {
        const get = async () => {
            const res = await fetch(getFetchURL());
            const data = await res.json();
            
            setCandidates(data);
        }

        get().catch(console.error);
    }, [edit, modal, interested, fetchURL]);

    function getFetchURL() {
        switch (mode) {
            case "assign":
                if (interested) {
                    return fetchURL;
                }
                return process.env.API_URL + '/api/candidate/search?assigned=false&actingInterest=false';
            case "actor":
                if (interested) {
                    return fetchURL;
                }
                return process.env.API_URL + '/api/candidate/search?actingInterest=true';
            default:
                return fetchURL;
        }
    }

    const handleNameClick = (e, index) => {
        setCandidateIndex(index);
        toggle();
    }

    const toggle = () => {
        setModal(!modal);
    }

    const handleEditClick = (event, index) => {
        setIndexEdit(index);
        toggleEdit();
    }

    const toggleEdit = () => {
        setEdit(!edit);
    }

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
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300 rounded-tl-lg">Name</th>
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Pronouns</th>
                            <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Email</th>
                            {(mode !== "assign" && mode !== "actor") && user.role === "admin" ? 
                                <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300">Assigned</th>
                                : <th className="py-2 px-1 font-medium border rounded-tr-lg border-slate-400 bg-slate-300">Assigned</th>
                            }
                            {(mode !== "assign" && mode !== "actor") && user.role === "admin" ?
                                <th className="py-2 px-1 font-medium border border-slate-400 bg-slate-300 rounded-tr-lg">Actions</th>
                                : null 
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((candidate, index) => (
                            <tr key={candidate.id}>
                                <td key={"name-" + candidate.id} className="text-left border border-slate-300 transition-all">
                                    <button onClick={(user.role === "admin" || user.role === "production head") ? (event) => handleNameClick(event, index) : undefined} className={`p-2 w-full rounded-md bg-white ${(user.role === "admin" || user.role === "production head")
                                     ? "hover:shadow-md hover:cursor-pointer hover:scale-105 hover:z-0 transition-all active:bg-slate-100" : "hover:cursor-default"}`}>{candidate.name}</button>
                                </td>
                                <td key={"pro-" + candidate.id} className="text-center py-2 px-2 border border-slate-300">{candidate.pronouns}</td>
                                <td key={"email-" + candidate.id} className="text-center py-2 px-2 border border-slate-300">{candidate.email}</td>
                                <td key= {"a-" + candidate.id} className="text-center py-2 px-2 border border-slate-300">
                                    <span className={`text-slate-100 bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-500 to-purple-500' : (candidate.assigned ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500')} px-2 py-1 rounded-lg`}>
                                        {candidate.actingInterest ? "acting" : (candidate.assigned ? "yes" : "no")}
                                    </span>
                                </td>
                                {(mode !== "assign" && mode !== "actor") && user.role === "admin" ?
                                    <td className="py-2 px-2 border border-slate-300 justify-center">
                                        <button onClick={(event) => handleEditClick(event, index)} className="w-full h-full"><FaUserEdit size={24} className="mx-auto hover:cursor-pointer hover:drop-shadow-lg"/></button>
                                    </td>
                                    : null
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    }

    return (
        <section className="box-border w-full h-full overflow-y-scroll bg-white rounded-2xl shadow-md">
            <Transition show={edit} className="z-50">
                <Transition.Child
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen z-40"
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
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen z-50"
                >
                    <EditCandidate candidate={candidates[indexEdit]} visible={edit} toggleVisible={toggleEdit}/>
                </Transition.Child>
            </Transition>
            
            <Transition show={modal} className="z-50">
                <Transition.Child
                    enter="transition-opacity ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-out duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen z-40"
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
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen z-50"
                >
                    <CandidateModal candidate={candidates[candidateIndex]} visible={modal} toggleModal={toggle} role={role} roleIndex={index} prodID={prod} />
                </Transition.Child>
            </Transition>
            
            <div className={`bg-white ${(mode === "assign" || mode === "actor") ? "max-h-fit" : "h-fit"} w-full rounded-t-2xl drop-shadow-md z-0 flex justify-between`}>
                <h1 className="px-3 py-4 font-medium text-2xl">{mode === "assign" ? "Available to Assign" : (mode === "actor" ? "Interested in Acting" : "Enrolled")}</h1>
                {mode === "assign" || mode === "actor" ?
                    <div className="flex space-x-4 px-4">
                        <label className="pr-0 pl-2 py-4 text-2xl font-medium">Interested Members Only</label>
                        <Switch
                            checked={interested}
                            onChange={setInterested}
                            className={`${
                                interested ? 'bg-emerald-500' : 'bg-gray-200'} my-auto
                                relative inline-flex h-[28px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                        >
                            <span className="sr-only">Use setting</span>
                            <span
                            aria-hidden="true"
                            className={`${interested ? 'translate-x-7' : 'translate-x-0'}
                                pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                            />
                        </Switch>
                    </div>
                :
                null
                }
            </div>
            <div className={`box-border p-2 w-full min-h-4 flex flex-col ${mode === "assign" ? "h-fit" : "max-h-128"} rounded-b-2xl overflow-y-scroll z-0`}>
                {renderTable()}
                {mode === "assign" &&
                    <button onClick={toggleVisible} className="p-4 w-fit my-4 mx-auto font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                        hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                        active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Return to Page
                    </button>
                }
            </div>
        </section>
    );
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}

function CandidateModal({ candidate, visible, toggleModal, role, prodID, roleIndex }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleModal();
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

    const assignCandidate = (e) => {
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
        }
        fetch(process.env.API_URL + `/api/production/assign/${prodID}/${candidate.id}/${roleIndex}`, requestOptions)
            .then((res) => res.text())
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
                toggleModal();
            });
    }

    return (
        candidate &&
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 flex flex-col justify-center">
            <section className="mx-auto box-border w-fit min-w-fit h-min bg-white rounded-2xl shadow-md">
                {candidate && <div className={`px-4 bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-300 to-purple-300' : (candidate.assigned ? 'from-green-300 to-emerald-300' : 'from-red-300 to-rose-300')} z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex justify-center`}>
                    <AiOutlineUser className="w-9 h-9 ml-2 mr-1 my-3" /> 
                    {candidate && <h1 className="px-3 py-4 font-medium text-2xl">{candidate.name} {candidate.pronouns !== null ? (candidate.pronouns.length !== 0 ?`(${candidate.pronouns})`: "") : ""} </h1>}
                </div>}
                <section className={`box-border p-2 w-full h-fit bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-200 to-purple-200' : (candidate.assigned ? 'from-green-200 to-emerald-200' : 'from-red-200 to-rose-200')} rounded-b-2xl flex flex-col items-center`}>
                    <div className="w-full h-full box-border p-2 columns-sm">
                        <div className="text-center py-2 px-2">
                            <span className={`px-4 py-8 text-slate-100 text-lg shadow-md bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-500 to-purple-500' : (candidate.assigned ? 'from-green-500 to-emerald-500' : 'from-red-500 to-rose-500')} px-2 py-1 rounded-lg`}>
                                {candidate.actingInterest ? "acting" : (candidate.assigned ? "assigned" : "not assigned")}
                            </span>
                        </div>
                        <div className="mx-auto my-2 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Contact:</label>
                            <h2 className="px-3 py-2 font-normal text-lg">{candidate.email}</h2>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Quarters in LUX:</label>
                            <h2 className="px-3 py-2 font-normal text-lg">{candidate.quartersInLux}</h2>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Years at UW:</label>
                            <h2 className="px-3 py-2 font-normal text-lg">{candidate.yearsInUW}</h2>
                        </div>
                        {!candidate.actingInterest && candidate.productions.length !== 0 ?
                            <div className="mx-auto my-4 py-2 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg">
                                <label className="px-3 py-2 font-medium text-lg">Productions:</label>
                                <ol className="list-decimal list-inside text-left w-full ml-4 mr-auto">
                                    {candidate.productions.map((production, index) => (
                                        <li key={'pl' + candidate.id + index} className="px-3 py-1 font-normal text-lg">
                                            {production}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        : null}
                        {candidate.roles.length !== 0 ? 
                            <div className="mx-auto my-4 py-2 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg">
                                <label className="px-3 py-2 font-medium text-lg">Roles:</label>
                                <ol className="list-decimal list-inside text-left w-full ml-4 mr-auto">
                                    {candidate.roles.map((role, index) => (
                                        <li key={'rl' + candidate.id + index} className="px-3 py-1 font-normal text-lg">
                                            {role}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        : null}
                        {candidate.actingInterest && 
                            <div className="mx-auto my-4 py-2 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg">
                                <label className="px-3 py-2 font-medium text-lg">Wants to Audition for:</label>
                                <ol className="list-decimal list-inside text-left w-full ml-4 mr-auto">
                                    {candidate.productions.map((production, index) => (
                                        <li key={'prod' + candidate.id + index} className="px-3 py-1 font-normal text-lg">
                                            {production}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        }
                        <div className="w-full flex flex-col justify-center items-center space-y-4">
                            {role && 
                                <button onClick={(e) => assignCandidate(e)} className={`p-2 w-[50%] max-w-fit font-medium text-center text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                active:bg-gradient-to-r active:from-green-700 active:to-emerald-700 ${loading ? "cursor-wait" : ""}`}>
                                    Assign to {role}
                                </button>
                            }
                            <button onClick={toggleModal} className="p-2 w-24 font-medium text-center text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                                Close
                            </button>
                        </div>
                        
                    </div>
                </section>
            </section>
        </div>
    );
}

function EditCandidate({ candidate, visible, toggleVisible }) {
    
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleVisible();
        }
    };

    const toggle = (event) => {
        event.preventDefault();
        toggleVisible();
    }

    useLayoutEffect(() => {
        setFormData({...candidate});
    }, [visible]);

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    function updatePronouns(e) {
        const tempObj = {...formData};
        tempObj.pronouns = e.target.value;
        setFormData(tempObj);
    }

    function updateContact(e) {
        const tempObj = {...formData};
        tempObj.email = e.target.value;
        setFormData(tempObj);
    }

    function updateQuarters(e) {
        const tempObj = {...formData};
        tempObj.quartersInLux = e.target.value;
        setFormData(tempObj);
    }

    function updateYears(e) {
        const tempObj = {...formData};
        tempObj.yearsInUW = e.target.value;
        setFormData(tempObj);
    }

    const submitForm = e => {
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...formData})
        }
        fetch(process.env.API_URL + `/api/candidate/update/${formData.id}`, requestOptions)
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
                toggleVisible();
            });

    }
    
    return ( 
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center">
            <section className="mx-auto box-border w-fit min-w-fit h-min bg-white rounded-2xl shadow-md">
                <div className={`px-4 bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-300 to-purple-300' : (candidate.assigned ? 'from-green-300 to-emerald-300' : 'from-red-300 to-rose-300')} z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex justify-center`}>
                    <AiOutlineEdit className="w-9 h-9 ml-2 mr-1 my-3" /> 
                    <h1 className="px-3 py-4 font-medium text-2xl">Editing {candidate.name}</h1>
                </div>
                <section className={`box-border p-2 w-full h-fit bg-gradient-to-r ${candidate.actingInterest ? 'from-violet-200 to-purple-200' : (candidate.assigned ? 'from-green-200 to-emerald-200' : 'from-red-200 to-rose-200')} rounded-b-2xl flex flex-col items-center`}>
                    <form onSubmit={submitForm} className="w-full h-full box-border p-2 columns-sm">
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Pronouns:</label>
                            <input className="px-3 py-2 font-normal text-lg rounded-lg" type="text" name="email" value={formData.pronouns === null ? "" : formData.pronouns} onChange={e => updatePronouns(e)}></input>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Contact:</label>
                            <input className="px-3 py-2 font-normal text-lg rounded-lg" type="text" name="email" value={formData.email === null ? "" : formData.email} onChange={e => updateContact(e)}></input>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Quarters in LUX:</label>
                            <input className="px-3 py-2 font-normal text-lg rounded-lg" type="text" name="quarters" value={formData.quartersInLux === null ? "" : formData.quartersInLux} onChange={e => updateQuarters(e)}></input>
                        </div>
                        <div className="mx-auto my-4 w-full shadow-sm border border-slate-400 bg-slate-50 bg-opacity-75 rounded-lg flex justify-between">
                            <label className="px-3 py-2 font-medium text-lg">Years at UW:</label>
                            <input className="px-3 py-2 font-normal text-lg rounded-lg" type="text" name="years" value={formData.yearsInUW === null ? "" : formData.yearsInUW} onChange={e => updateYears(e)}></input>
                        </div>
                        <footer className="flex justify-center p-4 space-x-4">
                            <button onClick={submitForm} className={`p-3 w-42 font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                active:bg-gradient-to-r active:from-green-700 active:to-emerald-700 ${loading ? "cursor-wait animate-pulse" : ""}`}>
                                Save Changes
                            </button>
                            <button onClick={(e) => toggle(e)} className="p-3 w-32 font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                                Cancel
                            </button>
                        </footer>
                        
                    </form>
                </section>
            </section>
        </div>
    );
}