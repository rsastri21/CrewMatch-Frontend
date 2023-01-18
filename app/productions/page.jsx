"use client";

import { useLayoutEffect, useState } from "react";
import { BiCameraMovie } from "react-icons/bi";
import { GiDirectorChair } from "react-icons/gi";

export default function Productions() {
    
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
            <div className="w-1/2 lg:w-2/3 max-w-3xl min-w-min h-min py-4 my-2 mx-auto flex flex-col space-y-4">
                <p className="text-4xl px-8 py-4 font-medium text-center text-gray-800">
                    Current Productions
                </p>
                <ProductionsOverview />
            </div>
        </div>
    );
}

function ProductionsOverview() {
    
    const [productions, setProductions] = useState([]);

    useLayoutEffect(() => {
        const get = async () => {
            const res = await fetch('http://localhost:8080/api/production/get');
            const data = await res.json();

            setProductions(data);
        }

        get().catch(console.error);
    }, []);
    
    return (
        <div className="w-full h-min grid grid-cols-2 gap-8">
            {productions.map((production) => (
                <ProductionCard key={production.id} title={production.name} director={production.members[0]} /> 
            ))}
        </div>
    );
}

function ProductionCard({ title, director }) {
    return (
        <div className="w-auto min-w-fit h-fit bg-white px-2 py-3 rounded-2xl shadow-md flex flex-col items-start space-y-4
            hover:cursor-pointer hover:scale-105 hover:shadow-lg transition-all">
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