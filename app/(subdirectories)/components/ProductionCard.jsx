"use client";

import { useState, useLayoutEffect } from 'react';

export default function ProductionCard() {
    
    const [productions, setProductions] = useState([]);
    const [count, setCount] = useState(0);

    useLayoutEffect(() => {
        
        const getProductionCount = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/getCount');
            const data = await res.text();

            setCount(parseFloat(data));
        }

        const getProductions = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/get');
            const data = await res.json();
            

            setProductions(data);
        }

        getProductionCount().catch(console.error);
        getProductions().catch(console.error);

    }, []);
    
    // console.log(productions);

    return (
        <div className="box-border w-96 h-min min-w-fit mx-auto md:ml-4 bg-white rounded-2xl shadow-md">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex justify-between">
                <h1 className="px-3 py-4 font-md text-2xl">Productions</h1>
                <h1 className="fixed top-0 right-0 mr-2 mt-2 py-2 px-4 font-md text-2xl bg-gradient-to-r from-red-600 to-rose-500
                            rounded-lg text-slate-50 shadow-md">{count}</h1>
            </div>
            <div className="box-border p-2 w-full min-h-4 h-auto bg-white rounded-b-2xl flex flex-col items-left">
             {count === 0 ? <h1 className="px-3 py-4 font-md text-lg">No productions created.</h1> :
                productions.map(production => (
                    <h3 key={production.name} className="px-4 py-2 text-md">
                        <span className="italic font-medium">{production.name}</span>, directed by {production.members[0]}
                    </h3>
             ))}
            </div>
        </div>
    );
}