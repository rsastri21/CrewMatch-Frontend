"use client";

import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { BiCameraMovie } from "react-icons/bi";
import { GiDirectorChair } from "react-icons/gi";
import { FcPlus } from "react-icons/fc";
import { useRouter } from 'next/navigation';
import { useSession } from '../../SessionContext';

export default function Productions() {
    
    const router = useRouter();
    const [productions, setProductions] = useState([]);
    const user = useSession();

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/get');
            const data = await res.json();

            setProductions(data);
        }

        get().catch(console.error);
    }, []);

    const handleCardClick = (e, index) => {
        router.push(`/productions/${productions[index].id}`)
    }

    const handleCreateClick = (e) => {
        router.push("/productions/create");
    }

    if (user.role === undefined) {
        return (
            <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col min-h-screen h-auto w-screen pb-16">
                <section className="w-1/2 h-min min-w-half mx-auto justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                   Productions Home. 
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Please login to use this page. 
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </section>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <section className="w-1/2 h-min min-w-half mx-auto justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                   Productions Home. 
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Create, view, or edit productions — Match candidates and more.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </section>
            <section className="w-2/3 max-w-3xl min-w-min h-min py-4 my-2 mx-auto flex flex-col space-y-6">
                <h1 className="text-5xl px-4 py-2 font-medium text-center text-gray-800">
                    Current Productions
                </h1>
                <p className="text-center text-xl my-2">Select a production to redirect to it's management page.</p>
                <ProductionsOverview productions={productions} changeIndex={handleCardClick} />
                {user.role === "admin" || user.role === "production head" ?
                    <button onClick={(e) => handleCreateClick(e)} className="bg-white flex rounded-xl w-fit mx-auto p-4 text-xl font-medium shadow-md hover:scale-105 hover:shadow-lg active:scale-100 active:bg-slate-200 transition-all">
                        <span className="ml-0 mr-2 my-auto"><FcPlus className="w-6 h-6"/></span>
                        Create a New Production
                    </button>
                : null}
            </section>
            <hr className="h-px my-4 mx-auto bg-gray-800 border-0 w-1/3 items-center"></hr>
            {user.role === "admin" ? <>
                    <RolesUI />
                    <hr className="h-px my-4 mx-auto bg-gray-800 border-0 w-1/3 items-center"></hr>
                </> : null }
            {user.role === "admin" ? <MatchUI /> : null}
        </div>
    );
}

function ProductionsOverview({ productions, changeIndex }) {
    
    return (
        <div className="w-full h-min grid grid-cols-2 gap-8">
            {productions.length === 0 ? <p className="col-span-2 px-2 py-3 text-xl font-medium text-center my-auto">No productions have been created yet.</p>
                : null}
            {productions && productions.map((production, index) => (
                <ProductionCard key={production.id} title={production.name} director={production.members[0]} index={index} changeIndex={changeIndex} /> 
            ))}
        </div>
    );
}

function ProductionCard({ title, director, index, changeIndex }) {
    
    const user = useSession();
    
    return (
        <div onClick={(event) => (user.role === "admin" || user.role === "production head") ? changeIndex(event, index) : alert("Only production heads or admin can modify productions.")} 
            className="w-auto min-w-fit h-fit bg-white px-2 py-3 rounded-2xl shadow-md flex flex-col items-start space-y-4
            hover:cursor-pointer hover:scale-105 hover:shadow-lg active:scale-100 active:bg-slate-100 transition-all">
            <div className="w-full min-w-fit flex justify-start shadow-md rounded-lg p-1">
                <BiCameraMovie className="w-12 h-12 p-2"/>
                <p className="px-2 py-3 font-semibold text-xl">{title}</p>
            </div>
            <div className="w-full min-w-fit flex justify-start p-1">
                <GiDirectorChair className="w-10 h-10 p-1"/>
                <p className="px-2 py-2 font-medium text-lg">Directed by: {director}</p>
            </div>
        </div>
    )
}

function RolesUI() {
    
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + "/api/production/get/roles");
            const data = await res.json();

            setRoles(data);
        }
        get().catch(console.error);
    }, []);
    

    console.log(roles);

    return (
        <section className="w-1/2 min-w-fit h-min py-4 my-2 mx-auto flex flex-col space-y-8">
            <h1 className="text-5xl px-4 py-2 font-medium text-center text-gray-800">
                Retrieve Roles
            </h1>
            <section className="box-border w-2/3 h-min z-0 mx-auto bg-white rounded-2xl shadow-md flex flex-col space-y-1">
                <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                    <h1 className="px-3 py-4 font-medium text-2xl">All Roles from Current Productions</h1>
                </div>
                <div className="box-border p-4 w-full h-min rounded-b-2xl flex flex-col items-center space-y-6 pb-6">
                    <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                        In order to make sure the Role Interest Survey contains the same roles that productions are requesting, <span className="font-medium">Crew Match </span>
                        will find all the unique roles and present them in a list. <br></br><br></br>
                        This ensures that candidates filling out the form are able to be matched to crews most effectively. 
                    </p>
                    <h1 className="px-3 py-4 min-w-fit shadow-md text-center text-xl font-medium rounded-xl">The following roles are requested by productions</h1>
                    <div className="box-border p-2 grid grid-cols-2 gap-4 w-full h-auto shadow-md rounded-2xl">
                        {roles && roles.map(role => (
                            <p key={role} className="p-2 text-lg text-center">{role}</p>
                        ))}
                    </div>
                </div>
            </section>
        </section>
    );
}

function MatchUI() {
    
    const [visible, setVisible] = useState(false);
    const [method, setMethod] = useState("");
    const [methodURL, setMethodURL] = useState("");

    const toggleVisible = () => {
        setVisible(!visible);
    }

    const changeMethod = (method) => {
        setMethod(method);
    }

    const changeMethodURL = (url) => {
        setMethodURL(url);
    }
    
    return (
        <section className="w-1/2 h-min py-4 my-2 mx-auto flex flex-col space-y-8">
            <h1 className="text-5xl px-4 py-2 font-medium text-center text-gray-800">
                Matching Candidates
            </h1>
            <p className="text-center text-xl my-2">View the different candidate matching processes below.</p>

            <MatchWithPreference visible={visible} setVisible={toggleVisible} method={method} setMethod={changeMethod} methodURL={methodURL} setMethodURL={changeMethodURL} />
            <MatchWithoutPreference visible={visible} setVisible={toggleVisible} method={method} setMethod={changeMethod} methodURL={methodURL} setMethodURL={changeMethodURL} />

            <Transition show={visible} >
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
                    <MatchModal visible={visible} setVisible={toggleVisible} method={method} methodURL={methodURL} />
                </Transition.Child>
                
            </Transition>
            
        </section>
    );
}

function MatchWithPreference({ visible, setVisible, method, setMethod, methodURL, setMethodURL }) {
    
    function handleMatchClick(event) {
        setMethod("Match With Preferences");
        setMethodURL("/api/production/match");
        setVisible();
    }

    return (
        <section className="box-border w-2/3 h-min z-0 mx-auto bg-white rounded-2xl shadow-md flex flex-col space-y-1">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Match with Preferences</h1>
            </div>
            <div className="box-border p-4 w-full h-min rounded-b-2xl flex flex-col items-center space-y-6 pb-6">
                <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                    Match with Preferences follows the traditional logic of crew matching. <span className="font-medium">Crew Match </span>
                    will use the standard process of prioritizing candidates who have been in LUX the longest, been at UW the longest, response submission time,
                    and lastly, alphabetically if all else fails. <br></br><br></br>
                    Match with Preferences takes all preferences into account and will not place a candidate if the available role does not satisfy at least one 
                    of their preferences. 
                </p>
                <button onClick={(e) => handleMatchClick(e)} className="p-4 w-64 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700
                    hover:scale-105 transition-all">
                    Match Candidates
                </button>
            </div>
        </section>
    );
}

function MatchWithoutPreference({ visible, setVisible, method, setMethod, methodURL, setMethodURL }) {
    
    function handleMatchClick(event) {
        setMethod("Match Without Preferences");
        setMethodURL("/api/production/matchNoPreference");
        setVisible();
    }
    
    return (
        <section className="box-border w-2/3 h-min z-0 mx-auto bg-white rounded-2xl shadow-md flex flex-col space-y-1">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Match without Preferences</h1>
            </div>
            <div className="box-border p-4 w-full h-min rounded-b-2xl flex flex-col items-center space-y-6 pb-6">
                <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                    Match without Preferences starts with the same logic as Match with Preferences, but it goes further to ensure a role placement
                    if space is available. If a candidate's preferences are not satisfied, <span className="font-medium">Crew Match </span> will place 
                    them on <span className="italic">any</span> production with their top roles, or <span className="italic">any</span> role in their top productions 
                    according to their production/role preference. <br></br><br></br>
                    If there are open roles available, Match without Preferences ensures placement.
                    <br></br><br></br>
                    <span className="font-medium">A Note on Usage: </span> <br></br>
                    This method of matching is best used as a supplement to Match with Preferences. In the normal assignment workflow,
                    candidates will be placed first by the previous method, and then by this method. However, no errors will be encountered
                    if this is used first, though the matching cannot be undone without a site reset. 
                </p>
                <button onClick={(e) => handleMatchClick(e)} className="p-4 w-64 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700
                    hover:scale-105 transition-all">
                    Match Candidates
                </button>
            </div>
        </section>
    );
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center"></div> 
    );
}

function MatchModal({ method, methodURL, visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    };

    const handleConfirmClick = (event) => {
        
        setLoading(true);

        fetch(process.env.API_URL + methodURL)
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((error) => console.error(error))
            .finally((result) => {
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

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Confirm {method}?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                {message.length === 0 ? null : <p className="text-xl text-center font-medium px-3 py-2 ">{message}</p>}
                <div className="w-full h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleConfirmClick(e)} disabled={loading} className={`p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 ${loading ? "cursor-wait" : ""}
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700 hover:scale-105 transition-all`}>
                        Confirm Match
                    </button>
                    <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700 hover:scale-105 transition-all">
                        Return to Page
                    </button>
                </div>
            </section>
        </div>
    );
}