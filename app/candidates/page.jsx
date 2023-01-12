"use client";

import React, { useCallback, useEffect, useState } from 'react';
import CandidateTable from "./CandidateTable.jsx";

export default function Candidate() {
    
    const [showHeaderForm, setShowHeaderForm] = useState(false);

    const toggleForm = () => {
        setShowHeaderForm(!showHeaderForm);
    }
    
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
                <HeadersUI toggle={toggleForm} />
                <HeaderForm showHeaderForm={showHeaderForm} toggle={toggleForm} />
            </div>
        </div>
    );
}

function HeadersUI({ toggle }) {
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
                <button onClick={toggle} className="p-4 w-64 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700">
                    Update CSV Headers
                </button>
            </div>
        </section>
    ); 
}

function HeaderForm({ showHeaderForm, toggle }) {
    
    const Headers = ["Name", "Pronouns", "Email Address", "Timestamp", "Years in LUX", "Quarters in LUX",
                    "First Choice in Production", "Second Choice in Production", 
                    "Third Choice in Production", "First Choice in Role", "Second Choice in Role", 
                    "Third Choice in Role", "Production Preference", "Acting Interest",
                    "Production to Audition For"];

    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getHeaders = async () => {
            const res = await fetch('http://localhost:8080/api/headers/get');
            const data = await res.json();

            setFormData(data.csvHeaders);
        }

        getHeaders().catch(console.error);
    }, [showHeaderForm]);

    const handleEscPress = (event) => {
        if (showHeaderForm && event.key === 'Escape') {
            toggle();
        }
    };

    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [showHeaderForm]);

    function updateFormData(e, index) {
        const tempList = [...formData];
        tempList[index] = e.target.value;
        setFormData([...tempList]);
    }

    const submitForm = e => {
        setLoading(true);
        e.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "header",
                                   csvHeaders: [...formData]})
        }
        fetch("http://localhost:8080/api/headers/update", requestOptions)
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
                toggle();
            });

    }
    
    return (
        showHeaderForm && 
            <div className="fixed bottom-0 left-0 right-0 z-10 w-screen h-screen p-4 bg-gray-700 bg-opacity-50">
                <section className="mx-auto box-border w-1/2 min-w-min h-min bg-white rounded-2xl shadow-md">
                    <div className="bg-white z-50 h-fit w-full rounded-t-2xl drop-shadow-md flex">
                        <h1 className="px-3 py-4 font-medium text-2xl">View and Update the Current CSV Headers</h1>
                    </div>
                    
                        <section className="box-border p-4 w-full h-auto max-h-[80vh] overflow-y-scroll rounded-b-2xl flex flex-col">
                            <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">The form below contains the required CSV headers for  
                                <span className="font-medium"> Crew Match</span>. Please ensure each field is filled
                                before submitting the form.
                            </p>
                            <form className="py-2 my-4 border border-separate rounded-lg grid grid-cols-2 grid-rows-15 gap-y-4">
                                {formData.map((form, index) => (
                                    <React.Fragment key={index}><label key={index} className="px-3 py-4 mx-4 w-half font-medium text-lg text-right">
                                        {Headers[index]}
                                    </label><input key={"input-" + index} className="py-4 px-3 w-[90%] rounded-lg bg-slate-200 text-gray-700" type="text" name={Headers[index]} value={form} onChange={e => updateFormData(e, index)} required /></React.Fragment>
                                ))}
                            </form>
                            <footer className="flex justify-end p-4 space-x-4">
                                <button onClick={submitForm} className={`p-4 w-42 font-medium text-lg text-gray-100 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-600 
                                                    active:bg-gradient-to-r active:from-green-700 active:to-emerald-700 ${loading ? "cursor-wait animate-pulse" : ""}`}>
                                    Save Changes
                                </button>
                                <button onClick={toggle} className="p-4 w-32 font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                    hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                    active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                                    Cancel
                                </button>
                            </footer>
                        </section>
                </section>
                
            </div>
    )
}