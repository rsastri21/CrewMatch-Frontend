"use client";

import { useState, useEffect, useLayoutEffect } from 'react';
import CandidateTable from '../../candidates/CandidateTable';
import { FcFilmReel } from "react-icons/fc";
import { useSession } from '../../../SessionContext';

const API_URL = "https://crew-match.herokuapp.com";

export default function ProductionUI({ params, }) {
    
    const user = useSession();

    if (user.role !== "admin" && user.role !== "production head") {
        return (alert("You do not have access to this page."));
    } 
    
    const [production, setProduction] = useState({});
    const [tableVisible, setTableVisible] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const get = async () => {
            const res = await fetch(API_URL + '/api/production/get/' + params.prod);
            const data = await res.json();

            setProduction({...data});
        }

        get().catch(console.error);
    }, [tableVisible]);

    const toggle = (index) => {
        setIndex(index);
        setTableVisible(!tableVisible);
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
                {production && <CandidateTable fetchURL={API_URL + `/api/candidate/search?assigned=false&actingInterest=true&production=${production.name}`} mode="actor" />}
            </section>
        </div>
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
                <CandidateTable fetchURL={API_URL + `/api/candidate/search?assigned=false&actingInterest=false&production=${production}`} mode={'assign'} role={role} index={index} prod={prodID} />
            </section>
        </div>
    );
}