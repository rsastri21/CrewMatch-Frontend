"use client";

import CandidateCard from "./components/CandidateCard";
import ProductionCard from "./components/ProductionCard";

import { useSession, useSessionUpdate } from "../SessionContext.js";

export default function Page() {
    
    const user = useSession();

    const renderText = () => {
        if (Object.keys(user).length === 0) {
            return (
                <p className="px-8 py-8 text-3xl text-center text-gray-800">
                    View glanceable information here or login to get started. 
                </p>
            );
        }
        switch(user.role) {
            case 'user': 
                return (
                    <p className="px-8 py-8 text-3xl text-center text-gray-800">
                        Welcome, {user.username}. View glanceable information here.
                    </p>
                );
            case 'production head':
                return (
                    <p className="px-8 py-8 text-3xl text-center text-gray-800">
                        Welcome, {user.username}. Thank you for leading one of our productions. View glanceable information here.
                    </p>
                );
            case 'admin':
                return (
                    <p className="px-8 py-8 text-3xl text-center text-gray-800">
                        Welcome, admin {user.username}. View glanceable information here.
                    </p>
                );
        }
    }
    
    return (
        <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col min-h-screen h-auto w-screen pb-16">
                <div className="w-1/2 h-min min-w-half mx-auto flex flex-col justify-center">
                    <h1 className="pt-24 pb-12 px-8 text-8xl mx-auto font-md text-center text-gray-800">
                        Welcome to Crew Match.
                    </h1>
                    <p className="px-8 text-2xl text-center text-gray-800">
                        A new way to manage the crews of LUX Productions.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                    {renderText()}
                </div>
                <div className="w-1/2 h-min min-w-half space-y-8 mx-auto md:flex md:justify-center md:space-y-0">
                    <CandidateCard />
                    <ProductionCard />
                </div>
        </div>
    );
}