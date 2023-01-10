"use client";

import { useEffect, useState } from 'react';
import CandidateTable from "./CandidateTable.jsx";

export default function Candidate() {
    
    const [showHeaderForm, setShowHeaderForm] = useState(false);
    
    return (
        <div className="bg-gradient-to-r from-cyan-200 to-teal-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <div className="w-1/2 h-min min-w-half mx-auto justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                   Candidate Home. 
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    View or edit information about candidates.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <div className="w-1/2 max-w-3xl min-w-min h-min py-4 my-8 mx-auto flex flex-col space-y-12">
                <CandidateTable />
                <HeadersUI />
                <HeaderForm />
            </div>
        </div>
    );
}

function HeadersUI() {
    return (
        <section className="box-border w-full h-min bg-white rounded-2xl shadow-md">
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Update Headers</h1>
            </div>
            <div className="box-border p-3 w-full h-64 rounded-b-2xl flex flex-col items-center space-y-12">
                <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                    <span className="font-medium">Crew Match</span> needs to know what the headers of the CSV file are. This helps correctly store candidates
                    so they can be effectively matched later. Click below to get started.
                </p>
                <button className="p-4 w-64 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700">
                    Update CSV Headers
                </button>
            </div>
        </section>
    ); 
}

function HeaderForm() {
    
    const Headers = ["Name", "Pronouns", "Email Address", "Timestamp", "Years in LUX", "Quarters in LUX",
                    "First Choice in Production", "Second Choice in Production", 
                    "Third Choice in Production", "First Choice in Role", "Second Choice in Role", 
                    "Third Choice in Role", "Production Preference", "Acting Interest",
                    "Production to Audition For"];

    const [currHeaders, setCurrHeaders] = useState([]);
    const listObjs = [];

    useEffect(() => {
        const getHeaders = async () => {
            const res = await fetch('http://localhost:8080/api/headers/get');
            const data = await res.json();

            setCurrHeaders(data.csvHeaders);
        }

        getHeaders().catch(console.error);
    }, []);

    for (let i = 0; i < currHeaders.length; i++) {
        listObjs[i] = { name: Headers[i], header: currHeaders[i] }; 
    }
    
    return (
        /* Dim screen div */
        <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 bg-gray-700 bg-opacity-50">
            <section className="mx-auto box-border w-1/2 h-min bg-white rounded-2xl shadow-md">
                <div className="bg-white z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex">
                    <h1 className="px-3 py-4 font-medium text-2xl">View and Update the Current CSV Headers</h1>
                </div>
                
                    <section className="box-border p-4 w-full h-auto max-h-256 overflow-y-scroll rounded-b-2xl flex flex-col">
                        <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">The form below contains the required CSV headers for  
                            <span className="font-medium"> Crew Match</span>. Please ensure each field is filled
                            before submitting the form.
                        </p>
                        <form className="py-2 my-4 border rounded-lg grid grid-cols-2 grid-rows-15 gap-y-4">
                            {listObjs.map(listObj => (
                                <><label className="px-3 py-4 mx-4 w-half font-medium text-lg text-right">
                                    {listObj.name}
                                </label><input className="py-4 px-3 w-[90%] rounded-lg bg-slate-300 text-gray-600" type="text" id="name" value={listObj.header} required /></>
                            ))}
                        </form>
                    </section>
            </section>
            
        </div>
    )
}