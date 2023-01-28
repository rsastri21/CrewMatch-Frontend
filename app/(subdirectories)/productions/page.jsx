"use client";

import { useEffect, useCallback, useState } from "react";
import { BiCameraMovie } from "react-icons/bi";
import { GiDirectorChair } from "react-icons/gi";
import { useRouter } from 'next/navigation';
import { useSession } from '../../SessionContext';

const API_URL = "https://crew-match.herokuapp.com";

export default function Productions() {
    
    const router = useRouter();
    const [productions, setProductions] = useState([]);
    const user = useSession();

    useEffect(() => {
        const get = async () => {
            const res = await fetch(API_URL + '/api/production/get');
            const data = await res.json();

            setProductions(data);
        }

        get().catch(console.error);
    }, []);

    const handleCardClick = (e, index) => {
        router.push(`/productions/${productions[index].id}`)
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
        </div>
    );
}

function ProductionsOverview({ productions, changeIndex }) {
    
    return (
        <div className="w-full h-min grid grid-cols-2 gap-8">
            {productions.length === 0 ? <p className="px-2 py-3 text-xl font-medium text-center my-auto">No productions have been created yet.</p>
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
