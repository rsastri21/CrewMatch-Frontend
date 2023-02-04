"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import CandidateTable from '../../candidates/CandidateTable';
import { FcFilmReel } from "react-icons/fc";
import { useSession } from '../../../SessionContext';

export default function ProductionUI({ params, }) {
    
    const user = useSession(); 
    
    const [production, setProduction] = useState({});
    const [tableVisible, setTableVisible] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/get/' + params.prod);
            const data = await res.json();

            setProduction({...data});
        }

        get().catch(console.error);
    }, [tableVisible]);

    const toggle = (index) => {
        setIndex(index);
        setTableVisible(!tableVisible);
    }

    const toggleDelete = () => {
        setDeleteModal(!deleteModal);
    }
    
    return (
        
        <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <div className="w-1/2 h-min min-w-half mx-auto justify-center">
                <FcFilmReel className="w-48 h-48 pt-12 mx-auto my-2"/>
                <h1 className="pt-8 pb-12 px-8 text-8xl text-center text-gray-800">
                    {production.name}
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Manage the details of <span className="italic font-medium">{production.name}</span> here.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <section className="w-1/2 min-w-fit h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                <h1 className="text-5xl px-8 py-4 font-medium text-center text-gray-800">
                    Crew Members
                </h1>
                {Object.keys(production).length !== 0 && <AvailableCandidateModal production={production.name} visible={tableVisible} toggleModal={toggle} role={production.roles[index]} index={index} prodID={production.id} />}
                <CrewMembers production={production} toggle={toggle} />
            </section>
            <section className="w-1/2 min-w-fit h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                <h1 className="text-5xl px-8 py-4 font-medium text-center text-gray-800">
                    Casting
                </h1>
                {production && <CandidateTable fetchURL={process.env.API_URL + `/api/candidate/search?assigned=false&actingInterest=true&production=${production.name}`} mode="actor" />}
            </section>
            <DeleteProductionBox visible={deleteModal} setVisible={toggleDelete} />

            <Transition show={deleteModal} >
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
                    <DeleteModal id={production.id} visible={deleteModal} setVisible={toggleDelete} />
                </Transition.Child>
                
            </Transition>

        </div>
    );
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}

function CrewMembers({ production, toggle }) {
    
    const roles = production.roles;
    const members = production.members;
    
    return (
        <section className="box-border border-2 p-4 w-full min-w-fit mx-auto max-h-256 overflow-y-scroll border-white bg-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
            <div className="flex w-full min-w-fit justify-between px-3 py-1 mx-2 rounded-xl">
                <p className="font-semibold text-xl xl:text-2xl">Role</p>
                <p className="font-semibold text-xl xl:text-2xl">Member</p>
            </div>
            {roles && roles.map((role, index) => (
                <div key={index} className="flex w-full min-w-fit justify-between box-border border-2 p-3 mx-2 rounded-lg">
                    <p className="p-2 font-semibold min-w-fit text-lg xl:text-xl">{role}</p>
                    <button onClick={members[index] === "" ? () => toggle(index) : null} className={`p-2 min-w-fit rounded-lg ${members[index] === "" 
                     ? "italic font-light text-lg hover:shadow-md hover:scale-105 cursor-pointer active:scale-100 active:bg-slate-100 transition-all"
                     : "cursor-default text-lg lg:text-xl"} `}>{members[index] === "" ? "add member" : members[index]}</button>
                </div>
            ))}
        </section>
    );
}

function AvailableCandidateModal({ production, visible, toggleModal, role, index, prodID }) {
    
    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            toggleModal(0);
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
    
    return (
        visible &&
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center items-center">
            <section className="w-1/2 h-1/2">
                <CandidateTable fetchURL={process.env.API_URL + `/api/candidate/search?assigned=false&actingInterest=false&production=${production}`} mode={'assign'} role={role} index={index} prod={prodID} />
            </section>
        </div>
    );
}

function DeleteProductionBox({ visible, setVisible }) {
    return (
        <section className="w-1/4 min-w-min h-auto shadow-md mx-auto my-16 bg-white rounded-2xl flex flex-col">
            <div className="w-full min-w-min h-16 bg-red-300 rounded-t-2xl shadow-md">
                <h1 className="px-3 py-4 text-gray-900 font-medium text-2xl min-w-fit">Delete Production</h1>
            </div>
            <div className="box-border p-4 w-full h-min rounded-b-2xl bg-red-100 flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-red-50 rounded-lg">
                    If this production was created accidentally, or it needs to be removed from the list of active productions, it can be deleted here.
                    <br></br>
                    <span className="font-semibold">Warning:</span> This action cannot be undone, so please ensure that the deletion of this production is intentional.
                </p>
                <button onClick={() => setVisible()} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                    Delete Production
                </button>
            </div>
        </section>
    )
}

function DeleteModal({ id, visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
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
        fetch(process.env.API_URL + "/api/production/delete/" + id, requestOptions)
            .then((res) => res.text())
            .catch(err => console.error(err))
            .finally((result) => {
                setLoading(false);
                router.push("/productions");
            });
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 flex flex-col justify-center items-center">
            <section className="w-1/4 h-auto bg-white rounded-2xl flex flex-col box-border p-4 shadow-2xl">
                <h1 className="px-3 py-4 font-medium text-2xl text-center">Are you sure you want to delete this production?</h1>
                <p className="text-lg text-center font-normal px-3 py-2 ">This action cannot be undone.</p>
                <div className="w-full h-auto flex space-x-4 justify-center box-border p-4">
                    <button onClick={(e) => handleDeletePress(e)} className="p-4 w-fit font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Confirm Deletion
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