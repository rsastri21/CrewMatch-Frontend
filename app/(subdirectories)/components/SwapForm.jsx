"use client";

import { useState, useEffect, useLayoutEffect, Fragment } from "react";
import { useSession } from "../../SessionContext";
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export default function SwapForm({ visible, setVisible, productions }) {
    
    const session = useSession();
    
    const [page, setPage] = useState(0);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({
        fromLead: "",
        toLead: "",
        production1: "",
        member1: "",
        role1: "",
        production2: "",
        member2: "",
        role2: ""
    });

    const nextPage = () => {
        setPage(page + 1);
    }

    const previousPage = () => {
        setPage(page - 1);
    }

    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(process.env.API_URL + `/api/user/search?username=${session.username}`);
            const data = await res.json();

            setUser(data);
            setFormData({...formData,
                fromLead: data.username,
                production1: data.leads
            });
        }

        getUser().catch(console.error);
    }, []);

    const handleEscPress = (event) => {
        if (visible && event.key === 'Escape') {
            setVisible();
        }
    }
    
    useEffect(() => {
        // Event listener
        document.addEventListener('keydown', handleEscPress);

        // Remove event listener
        return () => {
            document.removeEventListener('keydown', handleEscPress);
        };
    }, [visible]);

    function renderPage() {
        switch (page) {
            case 0:
                return <FirstPage page={page} nextPage={nextPage} />;
            case 1:
                return <SecondPage page={page} nextPage={nextPage} prevPage={previousPage} user={user} form={formData} updateForm={setFormData} />;
            case 2:
                return <ThirdPage page={page} nextPage={nextPage} prevPage={previousPage} user={user} productions={productions} form={formData} updateForm={setFormData} />;
            case 3:
                return <FinalPage page={page} prevPage={previousPage} form={formData} updateForm={setFormData} visible={visible} setVisible={setVisible} />;
        }
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 w-screen h-screen flex flex-col justify-center">
            <section className="mx-auto box-border w-256 h-auto bg-white rounded-2xl shadow-lg flex flex-col">
                <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md">
                    <h1 className="text-center px-3 py-4 font-medium text-2xl">Create a New Swap Request</h1>
                </div>
                <section className="w-full bg-white h-auto max-h-[80vh] overflow-y-scroll rounded-b-2xl flex flex-col justify-center p-4">
                    {renderPage()}
                </section>
            </section>
        </div>
    );
}

export function FirstPage({ page, nextPage }) {
    return (
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col mx-auto w-full h-auto">
            <h1 className="px-3 py-4 text-2xl text-center">Welcome to the <span className="font-medium">Crew Match </span> swap utility!</h1>
            <p className="px-3 py-2 text-lg">
                Creating a swap request involves selecting a member from your crew to trade away and a member from another production to
                take their place. The other production you select must have a delegated production lead who can accept the request.
                <br></br><br></br>
                You will be guided through the process as the following form is completed. Please click next to continue. 
                <br></br><br></br>
                You may press the escape key at any time to cancel the request. 
            </p>
            <button onClick={nextPage} className="p-3 font-medium text-xl bg-slate-200 w-24 mx-auto mt-6 mb-2 rounded-xl shadow-md
                transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                Next
            </button>
        </div>
    );
}

export function SecondPage({ page, nextPage, prevPage, user, form, updateForm }) {
    
    const [production, setProduction] = useState({});

    useEffect(() => {
        const getProduction = async () => {
            const res = await fetch(process.env.API_URL + `/api/production/search?name=${user.leads}`);
            const data = await res.json();

            setProduction(data);
        }

        getProduction().catch(console.error);
    }, []);

    const updateMember = (event) => {
        updateForm({
            ...form,
            member1: production.members[event.target.value],
            role1: production.roles[event.target.value]
        });
    }

    return ( 
        production.members && 
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col space-y-6 mx-auto w-full h-auto">
            <h1 className="px-3 py-2 text-2xl text-center">Step 1: Select a member to trade away.</h1>
            <label className="px-3 py-2 text-xl text-center rounded-lg shadow-md w-fit mx-auto">Your production: <span className="font-medium">{production.name}</span></label>
            <div className="flex py-4 px-4 h-fit mx-auto space-x-4 border border-slate-200 rounded-lg">
                <label className="px-1 text-xl my-auto text-center font-medium">Member:</label>
                <select
                    className="px-2 py-2 my-auto ml-6 mr-2 rounded-lg bg-slate-100"
                    onChange={(e) => updateMember(e)}
                >
                    {production.members.map((member, index) => (
                        <option key={index} value={index}>{member}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col space-y-2 w-fit p-4 mx-auto rounded-xl bg-red-100 border border-gray-300">
                <p className="px-3 text-lg text-center">
                    The member selected to be traded away is            
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.member1 ? form.member1 : "________"}</span>
                </p>
                <p className="px-3 text-lg text-center">
                    from the role of            
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.role1 ? form.role1 : "________"}</span>
                </p>
            </div>
            <p className="px-3 py-2 text-xl text-center">
                If this is your desired selection, please continue to the next step.
            </p>
            <footer className="flex space-x-4 mx-auto">
                <button onClick={prevPage} className="p-3 font-medium text-xl bg-slate-200 w-28 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                    Previous
                </button>
                <button onClick={nextPage} className="p-3 font-medium text-xl bg-slate-200 w-24 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                    Next
                </button>
            </footer>
        </div>
    );
}

export function ThirdPage({ page, nextPage, prevPage, user, productions, form, updateForm }) {

    const [prod, setProd] = useState(null);
    
    const updateProduction = (event) => {
        updateForm({
            ...form,
            production2: productions[event.target.value].name,
            toLead: productions[event.target.value].prodLead
        });
        setProd(productions[event.target.value]);
    }

    const updateMember = (event) => {
        updateForm({
            ...form,
            member2: prod.members[event.target.value],
            role2: prod.roles[event.target.value]
        });
    }
    
    return (
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col space-y-6 mx-auto w-full h-auto">
            <h1 className="px-3 py-2 text-2xl text-center">Step 2: Select a production to request a member from.</h1>
            <div className="flex py-3 px-4 h-fit mx-auto space-x-4 border border-slate-200 rounded-lg">
                <label className="px-1 text-xl my-auto text-center font-medium">Production:</label>
                <select
                    className="px-2 py-2 my-auto ml-6 mr-2 rounded-lg bg-slate-100"
                    onChange={(e) => updateProduction(e)}
                >
                    {productions.map((production, index) => (
                        <option key={index} value={index}>{production.name}</option>
                    ))}
                </select>
            </div>
            {prod &&
                <>
                    <h1 className="px-3 py-2 text-2xl text-center">Step 3: Select a member from <span className="font-medium">{form.production2}</span>.</h1>
                    <div className="flex py-3 px-4 h-fit mx-auto space-x-4 border border-slate-200 rounded-lg">
                        <label className="px-1 text-xl my-auto text-center font-medium">Member:</label>
                        <select
                            className="px-2 py-2 my-auto ml-6 mr-2 rounded-lg bg-slate-100"
                            onChange={(e) => updateMember(e)}
                        >
                            {prod.members.map((member, index) => (
                                <option key={index} value={index}>{member}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col space-y-2 w-fit p-4 mx-auto rounded-xl bg-emerald-100 border border-gray-300">
                        <p className="px-3 text-lg text-center">
                            The member to be requested is             
                        </p>
                        <p className="px-3 py-2 text-lg text-center">
                            <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.member2 ? form.member2 : "________"}</span>
                        </p>
                        <p className="px-3 text-lg text-center">
                            from the role of            
                        </p>
                        <p className="px-3 py-2 text-lg text-center">
                            <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.role2 ? form.role2 : "________"}</span>
                        </p>
                    </div>
                </>
            }
            <p className="px-3 py-2 text-xl text-center">
                If these are your desired selections, view a summary on the next page.
            </p>
            <footer className="flex space-x-4 mx-auto">
                <button onClick={prevPage} className="p-3 font-medium text-xl bg-slate-200 w-28 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                    Previous
                </button>
                <button onClick={nextPage} className="p-3 font-medium text-xl bg-slate-200 w-24 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                    Next
                </button>
            </footer>
            
        </div>
    );

}

export function FinalPage({ page, prevPage, form, updateForm, visible, setVisible }) {
    
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = () => {
        setLoading(true);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        };
        fetch(process.env.API_URL + "/api/swap/create", requestOptions)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false);
                setVisible();
            });
    }
    
    return (
        <div className="border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4 mx-auto w-full h-auto">
            <h1 className="px-3 py-2 text-2xl text-center">Request Summary</h1>
            <div className="flex flex-col space-y-2 w-104 p-4 mx-auto rounded-xl bg-red-100 border border-gray-300">
                <p className="px-3 text-lg text-center">
                    The member selected to be traded away is            
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.member1 ? form.member1 : "________"}</span>
                </p>
                <p className="px-3 text-lg text-center">
                    from the role of            
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.role1 ? form.role1 : "________"}</span>
                </p>
            </div>
            <div className="flex flex-col space-y-2 w-104 p-4 mx-auto rounded-xl bg-emerald-100 border border-gray-300">
                <p className="px-3 text-lg text-center">
                    The member to be requested is             
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.member2 ? form.member2 : "________"}</span>
                </p>
                <p className="px-3 text-lg text-center">
                    from the role of            
                </p>
                <p className="px-3 py-2 text-lg text-center">
                    <span className="font-medium text-xl p-2 rounded-lg shadow-md bg-white">{form.role2 ? form.role2 : "________"}</span>
                </p>
            </div>
            <p className="px-3 py-2 text-lg text-center">
                The production lead for <span className="italic">{form.production2}</span> is <span className="font-medium">{form.toLead}</span>. This request will be sent to them for approval. <br></br> In summary, {form.member2} will become
                your new {form.role1} while {form.member1} will become a(n) {form.role2} for <span className="italic">{form.production2}</span>. <br></br><br></br> To cancel this request, press the escape key.
            </p>
            <footer className="flex space-x-4 mx-auto">
                <button onClick={prevPage} className="p-3 font-medium text-xl bg-slate-200 w-28 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100">
                    Previous
                </button>
                <button onClick={() => handleSubmit()} className={`p-3 font-medium text-xl bg-emerald-500 text-slate-100 w-24 mb-2 rounded-xl shadow-md
                    transition-all hover:scale-105 hover:shadow-lg active:scale-100 ${loading ? "cursor-wait" : ""}`}>
                    Submit
                </button>
            </footer>
        </div>
        
    );
}