import CandidateTable from "./CandidateTable.jsx";

export default function Candidate() {
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
            <div className="w-1/2 max-w-3xl min-w-min h-min py-4 my-8 mx-auto">
                <CandidateTable />
            </div>
        </div>
    );
}