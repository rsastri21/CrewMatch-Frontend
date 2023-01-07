export const revalidate = 10;

import CandidateCard from "../components/CandidateCard";

export default function Page() {
    return (
        <div className="bg-gradient-to-r from-red-100 to-orange-200 flex flex-col min-h-screen h-auto w-screen pb-16">
                <div className="w-1/2 h-min min-w-half mx-auto justify-center">
                    <h1 className="pt-24 pb-12 px-8 text-8xl font-md text-center text-gray-800">
                        Welcome to Crew Match.
                    </h1>
                    <p className="px-8 text-2xl text-center text-gray-800">
                        A new way to manage the crews of LUX Productions.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                    <p className="px-8 py-8 text-4xl text-center text-gray-800">
                        View glanceable information below or login to get started. 
                    </p>
                </div>
                <div className="w-1/2 h-min min-w-half mx-auto">
                    <CandidateCard />
                </div>
        </div>
    );
}