"use client";

import { useLayoutEffect, useCallback, useState } from "react";
import { BiCameraMovie } from "react-icons/bi";
import { GiDirectorChair } from "react-icons/gi";
import CandidateTable from "../candidates/CandidateTable.jsx";

export default function Productions() {
    
    const [productions, setProductions] = useState([]);
    const [productionsIndex, setProductionsIndex] = useState(-1);

    useLayoutEffect(() => {
        const get = async () => {
            const res = await fetch('http://localhost:8080/api/production/get');
            const data = await res.json();

            setProductions(data);
        }

        get().catch(console.error);
    }, []);

    const onKeyDown = useCallback((event) => {
        if (event.key === 'Escape') {
            setProductionsIndex(-1);
            document.removeEventListener('keydown', onKeyDown);
        }
     }, []);

    const handleCardClick = (e, index) => {
        setProductionsIndex(index);
        document.addEventListener('keydown', onKeyDown);
    }

    return (
        <div className="bg-gradient-to-r from-green-200 to-emerald-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <div className="w-1/2 h-min min-w-half mx-auto justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                   Productions Home. 
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Create, view, or edit productions — Match candidates and more.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <section className="w-2/3 max-w-3xl min-w-min h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                <h1 className="text-5xl px-8 py-4 font-medium text-center text-gray-800">
                    Current Productions
                </h1>
                <ProductionsOverview productions={productions} changeIndex={handleCardClick} />
            </section>
            <hr className="h-px my-8 mx-auto bg-gray-800 border-0 w-1/3 items-center"></hr>
            <section className="w-2/3 mx-auto h-auto flex flex-col p-4">
                <ProductionModal productions={productions} index={productionsIndex} />
            </section>
            <hr className="h-px my-8 mx-auto bg-gray-800 border-0 w-1/3 items-center"></hr>
        </div>
    );
}

function ProductionsOverview({ productions, changeIndex }) {
    
    return (
        <div className="w-full h-min grid grid-cols-2 gap-8">
            {productions && productions.map((production, index) => (
                <ProductionCard key={production.id} title={production.name} director={production.members[0]} index={index} changeIndex={changeIndex} /> 
            ))}
        </div>
    );
}

function ProductionCard({ title, director, index, changeIndex }) {
    return (
        <div onClick={(event) => changeIndex(event, index)} className="w-auto min-w-fit h-fit bg-white px-2 py-3 rounded-2xl shadow-md flex flex-col items-start space-y-4
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

function ProductionModal({ productions, index }) {
    
    if (index === -1) {
        return (
            <p className="px-2 py-3 text-xl text-center">Select a production above to view more detailed information.</p>
        )
    }

    const [visible, setVisible] = useState(false);

    const toggle = () => {
        setVisible(!visible);
    }
    
    
    return (
        <section className="mx-auto box-border w-full min-w-min h-min bg-white rounded-2xl shadow-md">
            <div className="bg-white z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <BiCameraMovie className="w-12 h-12 p-2 ml-2 mr-1 my-2"/>
                <h1 className="px-1 py-4 font-medium text-2xl">{productions[index].name}</h1>
            </div>

            <section className="box-border p-6 w-full h-min rounded-b-2xl grid grid-cols-2">
                <ProductionInformation productions={productions} index={index} toggle={toggle} />
                {visible ?
                    <CandidateTable fetchURL={"http://localhost:8080/api/candidate/search?assigned=false&actingInterest=false"} mode="assign" /> 
                    : <p className="px-2 py-3 text-xl text-center my-auto">Select an empty slot to assign a member.</p>
                }
            </section>

        </section>
    );
}

function ProductionInformation({ productions, index, toggle }) {
    
    const roles = productions[index].roles;
    const members = productions[index].members;
    
    return (
        <section className="box-border border-2 p-2 w-[95%] max-h-[80vh] overflow-y-scroll border-white shadow-md rounded-2xl flex flex-col items-center space-y-4">
            <div className="flex w-full justify-between px-3 py-1 mx-2 rounded-xl">
                <p className="font-semibold text-2xl">Role</p>
                <p className="font-semibold text-2xl">Member</p>
            </div>
            {roles.map((role, index) => (
                <div key={index} className="flex w-full justify-between box-border border-2 p-3 mx-2 rounded-lg">
                    <p className="p-2 font-semibold text-xl">{role}</p>
                    <button onClick={members[index] === "" ? toggle : null} className={`p-2 rounded-lg ${members[index] === "" 
                     ? "italic font-light text-lg hover:shadow-md hover:scale-105 cursor-pointer active:scale-100 active:bg-slate-100 transition-all"
                     : "text-xl"} `}>{members[index] === "" ? "add member" : members[index]}</button>
                </div>
            ))}
        </section>
    );
}