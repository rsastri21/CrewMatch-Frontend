"use client";

import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { useSession } from "../../SessionContext";
import SwapForm from "../components/SwapForm";
import SwapTable from "../components/SwapUI";

export default function ProdHeadUI() {
    
    const user = useSession();
    const [productionsWithLead, setProductionsWithLead] = useState([]);
    const [formVisible, setFormVisible] = useState(false);

    const toggleForm = () => {
        setFormVisible(!formVisible);
    }

    useEffect(() => {
        const getManagedProds = async () => {
            const res = await fetch(process.env.API_URL + '/api/production/getLead');
            const data = await res.json();

            setProductionsWithLead(data);
        }

        getManagedProds().catch(console.error);
    }, []);
    
    if (!user || user.role !== "production head") {
        return (
            <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col gap-12 min-h-screen h-auto w-screen pb-16">
                <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center">
                    <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                        Production Head Panel.
                    </h1>
                    <p className="px-8 text-2xl text-center text-gray-800">
                        Please log in with a production head profile to access this page.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col gap-12 min-h-screen h-auto w-screen pb-16">
            
            <Transition show={formVisible} className="z-50">
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
                    <SwapForm visible={formVisible} setVisible={toggleForm} productions={productionsWithLead} />
                </Transition.Child>
            </Transition>
            
            
            <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                    Production Head Panel.
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Manage swap requests for your production here.
                    <br></br>
                    Logged in as <span className="font-medium">{user.username}</span>.
                    <br></br>
                    <br></br>
                    {user.leads && user.leads.length !== 0 ?
                    <>
                        Production head for <span className="font-medium">{user.leads}</span>.
                    </>
                    :
                    <>You are not currently assigned to lead a production. <br></br>The swap menu will become
                    available when you are assigned by an officer. </>
                    }
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            {user.leads &&
                <>
                    <SwapTable outgoing={false} form={formVisible} setForm={toggleForm} />
                    <SwapTable outgoing={true} form={formVisible} setForm={toggleForm} />
                </>
            }
        </div>
    );
}

function BackgroundOverlay() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-screen h-screen p-4 bg-gray-700 bg-opacity-50 flex flex-col justify-center"></div>
    );
}