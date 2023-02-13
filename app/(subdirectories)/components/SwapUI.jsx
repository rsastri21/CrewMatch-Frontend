"use client";

import { useEffect, useState } from "react";
import { useSession, useSessionUpdate } from "../../SessionContext";
import { Transition } from "@headlessui/react";

export default function SwapTable({ outgoing }) {
    
    const user = useSession();
    const [requests, setRequests] = useState([]);
    const [requestIndex, setRequestIndex] = useState(0);
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }

    useEffect(() => {
        const getRequests = async () => {
            const res = await fetch(process.env.API_URL + `/api/swap/search?${outgoing ? "from" : "to"}=${user.username}`);
            const data = await res.json();

            setRequests(data);
        }

        getRequests().catch(console.error);
    }, [modal]);

    

    const renderTable = () => {
        if (requests.length === 0) {
            return (
                <h1 className="px-3 py-4 text-lg">{outgoing ? "No sent requests." : "No incoming requests."}</h1>
            )
        } else {
            return (
                <table className="table-auto border-separate w-full min-w-fit z-0">
                    <thead>
                        <tr>
                            <th className="px-2 py-1 font-medium border border-slate-400 bg-slate-300 rounded-tl-lg">{outgoing ? "To" : "From"}</th>
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
                                        onClick={(event) => {
                                            setRequestIndex(index);
                                            toggleModal();
                                        }}
                                        className="p-2 w-full rounded-md bg-white transition-all hover:scale-105 hover:shadow-md active:bg-slate-100"
                                    >
                                        {outgoing? request.toLead : request.fromLead}
                                    </button>
                                </td>
                                <td className="text-center py-2 px-2 border border-slate-300">{request.member1}</td>
                                <td className="text-center py-2 px-2 border border-slate-300">{request.member2}</td>
                                <td className={`text-center py-2 px-2 border border-slate-300 ${index === requests.length - 1 ? "rounded-br-lg" : ""}`}>
                                    <span 
                                        className={`text-slate-100 bg-gradient-to-r ${request.completed === null ? "from-red-500 to-rose-500" :
                                            (request.completed ? "from-green-500 to-emerald-500" : "from-amber-500 to-yellow-500")} px-2 py-1 rounded-lg`}
                                    >
                                        {request.completed === null ? "rejected" : (request.completed ? "accepted" : "pending")}
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
        <>
            <section className="w-1/2 min-w-fit h-auto mx-auto bg-white rounded-2xl shadow-md">
                <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex z-0">
                    <h1 className="px-3 py-4 font-medium text-2xl">{outgoing ? "Sent Swap Requests" : "Incoming Swap Requests"}</h1>
                </div>
                <div className="box-border p-2 w-full h-auto max-h-128 overflow-y-scroll">
                    {renderTable()}
                </div>
            </section>
            <Transition show={modal} className="z-50">
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
                    enterTo="tranlate-y-0 scale-100"
                    leave="transition-all ease-in-out duration-200"
                    leaveFrom="translate-y-0 scale-100"
                    leaveTo="translate-y-full scale-50"
                    className="fixed bottom-0 left-0 right-0 w-screen h-screen"
                >
                    <RequestModal request={requests[requestIndex]} visible={modal} toggleVisible={toggleModal} outgoing={outgoing} />
                </Transition.Child>

            </Transition>
        </>
    );
}

export function RequestModal({ request, visible, toggleVisible, outgoing }) {
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleVisible();
        }
    };

    const handleAcceptPress = (event) => {
        setLoading(true);
        
        fetch(process.env.API_URL + `/api/swap/accept/${request.id}`, {
            method: 'PUT'
        })
            .then((res) => res.text())
            .then(res => setMessage(res))
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    }

    const handleRejectPress = (event) => {
        setLoading(true);

        fetch(process.env.API_URL + `/api/swap/reject/${request.id}`, {
            method: 'PUT'
        })
            .then(res => res.text())
            .then(res => setMessage(res))
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false);
            });
    }
    
    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    const renderFooter = () => {
        if (outgoing) {
            return (
                <footer className="flex flex-col justify-center w-full">
                    {request.completed === null ?
                        <>
                            <h1 className="px-3 py-2 text-2xl font-medium text-center">This request was rejected.</h1>
                            <div className="flex py-4 mx-auto space-x-4">
                                <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                    hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                    onClick={() => toggleVisible()}>
                                    Back
                                </button>
                            </div>
                        </>
                    : (request.completed ?
                        <>
                            <h1 className="px-3 py-2 text-2xl font-medium text-center">This request was accepted.</h1>
                            <div className="flex py-4 mx-auto space-x-4">
                                <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                    hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                    onClick={() => toggleVisible()}>
                                    Back
                                </button>
                            </div>
                        </>
                    : <>
                        <h1 className="px-3 py-2 text-2xl font-medium text-center">Would you like to withdraw this swap?</h1>
                        <h1 className="px-3 py-2 text-xl font-medium text-center">{message}</h1>
                        <div className="flex py-4 mx-auto space-x-4">
                            <button className={`px-3 py-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg text-lg text-slate-100
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md ${loading ? "cursor-wait" : ""}`}
                                onClick={(event) => handleRejectPress(event)}
                                >
                                Withdraw
                            </button>
                            <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                onClick={() => toggleVisible()}>
                                Back
                            </button>
                        </div>
                    </>)}
                </footer>
            );
        } else {
            return (
                <footer className="flex flex-col justify-center w-full">
                    {request.completed === null ?
                        <>
                            <h1 className="px-3 py-2 text-2xl font-medium text-center">This request was rejected.</h1>
                            <div className="flex py-4 mx-auto space-x-4">
                                <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                    hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                    onClick={() => toggleVisible()}>
                                    Back
                                </button>
                            </div>
                        </>
                    : (request.completed ?
                        <>
                            <h1 className="px-3 py-2 text-2xl font-medium text-center">This request was accepted.</h1>
                            <div className="flex py-4 mx-auto space-x-4">
                                <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                    hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                    onClick={() => toggleVisible()}>
                                    Back
                                </button>
                            </div>
                        </>
                    : <>
                        <h1 className="px-3 py-2 text-2xl font-medium text-center">Would you like to accept this swap?</h1>
                        <h1 className="px-3 py-2 text-xl font-medium text-center">{message}</h1>
                        <div className="flex py-4 mx-auto space-x-4">
                            <button className={`px-3 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-lg text-slate-100
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md ${loading ? "cursor-wait" : ""}`}
                                onClick={(event) => handleAcceptPress(event)}
                                >
                                Accept
                            </button>
                            <button className={`px-3 py-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg text-lg text-slate-100
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md ${loading ? "cursor-wait" : ""}`}
                                onClick={(event) => handleRejectPress(event)}
                                >
                                Reject
                            </button>
                            <button className="px-3 py-3 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg text-lg text-slate-100
                                hover:scale-105 hover:shadow-lg active:scale-100 transition-all shadow-md"
                                onClick={() => toggleVisible()}>
                                Back
                            </button>
                        </div>
                    </>)}
                </footer>
            );
        }
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 w-screen h-screen flex flex-col justify-center">
            <section className="mx-auto box-border w-fit h-fit bg-white rounded-2xl shadow-lg flex flex-col pb-6">
                <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md">
                    <h1 className="text-center px-3 py-4 font-medium text-2xl">Request from {request.fromLead} to {request.toLead}</h1>
                </div>
                <section className="w-full bg-white h-auto rounded-b-2xl flex flex-col justify-center p-2">
                    <label className="px-3 py-4 text-xl text-center font-medium">{request.fromLead} is requesting:</label>
                    <div className="border border-slate-400 rounded-2xl w-fit mx-auto flex justify-center shadow-md">
                        <label className="px-3 py-4 text-lg">
                            {request.role2} {request.member2} move to {request.role1} on <span className="italic">{request.production1}</span>.
                        </label>
                    </div>
                    <label className="px-3 pb-4 pt-8 text-xl text-center font-medium">{request.toLead} will receive:</label>
                    <div className="border border-slate-400 rounded-2xl w-fit mx-auto flex justify-center shadow-md">
                        <label className="px-3 py-4 text-lg">
                            <span className="italic">{request.production1}</span> {request.role1} {request.member1} as {request.role2} on <span className="italic">{request.production2}</span>.
                        </label>
                    </div>
                </section>
                <hr className="my-4"></hr>
                {renderFooter()}
            </section>
        </div>
    );
}

export function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}