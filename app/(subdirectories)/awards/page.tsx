'use client';

import { useEffect, useRef, useState } from "react";
import { User, useSession } from "../../SessionContext";
import { countVote, extractAwardCategory, transformCSVFile } from "../../utils/AwardsCSVTransformer";
import { AWARDS, ProcessedAwardsVotingData, VotingResults } from "../../utils/AwardsTypes";
import { BiCameraMovie, BiTrophy } from "react-icons/bi";


export default function Awards(): JSX.Element {

    const user: User = useSession();
    const [votingData, setVotingData] = useState<ProcessedAwardsVotingData>({});
    const [votingResults, setVotingResults] = useState<VotingResults>({});

    const updateVotingData = (newVotingData: ProcessedAwardsVotingData) => {
        setVotingData(newVotingData);
    }

    const updateVotingResult = (newVotingResults: VotingResults) => {
        setVotingResults(newVotingResults);
    }
    
    if (user.role.length === 0) {
        return (
            <div className="bg-orange-200 flex flex-col min-h-screen h-auto w-screen pb-16">
                <div className="w-2/3 h-min min-w-half mx-auto justify-center">
                    <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                        LUXies! 
                    </h1>
                    <p className="px-8 text-2xl text-center text-gray-800">
                        Please login to use this page.
                    </p>
                    <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-orange-200 flex flex-col min-h-screen h-auto w-screen pb-16">
            <div className="w-2/3 h-min min-w-half mx-auto justify-center">
                <h1 className="pt-24 pb-12 px-8 text-8xl text-center text-gray-800">
                    LUXies! 
                </h1>
                <p className="px-8 text-2xl text-center text-gray-800">
                    Tally votes for the LUXies here.
                </p>
                <hr className="h-px mt-8 mx-auto bg-gray-800 border-0 w-2/3 items-center"></hr>
            </div>
            <div className="w-[50%] min-w-min h-min py-4 my-8 mx-auto z-0 flex flex-col space-y-12 items-center">
                <UploadCard setVotingData={updateVotingData} setVotingResults={updateVotingResult} />
                {Object.keys(votingData).length > 0 &&
                    <ProcessVoteCard votingData={votingData} setVotingResults={updateVotingResult} />
                }
                {Object.keys(votingResults).length > 0 &&
                    <VotingResultsGallery votingResults={votingResults} />
                }
            </div>
        </div>
    );
}

interface UploadCardProps {
    setVotingData: (data: ProcessedAwardsVotingData) => void;
    setVotingResults: (results: VotingResults) => void;
}

const UploadCard = ({ setVotingData, setVotingResults }: UploadCardProps): JSX.Element => {
    
    const inputRef: any = useRef(null);
    const [file, setFile] = useState<File>();
    const [loading, setLoading] = useState<boolean>(false);

    const resetInput = () => {
        if (inputRef.current) {
            inputRef.current.value = null;
        }
        setFile(undefined);
        setVotingData({});
        setVotingResults({});
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        event.preventDefault;
        const { files } = event.target;
        if (files && files[0]) {
            setFile(files[0]);
        }
    }

    const handleProcessClick = async () => {
        if (!file) {
            return;
        }
        setLoading(true);
        const csvData = await transformCSVFile(file) as ProcessedAwardsVotingData;
        setVotingData(csvData);
        setLoading(false);
    }

    return (
        <section className="box-border w-full min-w-fit h-min z-0 bg-white rounded-2xl shadow-md flex flex-col space-y-1">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Upload Voting Results by CSV</h1>
            </div>
            <div className="box-border p-4 w-full h-min rounded-b-2xl flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                    Upload the results from the LUXies voting period as a CSV file. After processing the file,
                    options will appear to tally the votes. Click cancel at any time to start over.
                </p>
                <input className="w-full p-2 text-gray-900 bg-white shadow-md
                    rounded-lg cursor-pointer focus:outline-none file:bg-slate-600 file:text-gray-100 file:rounded-md
                    file:p-2 file:font-medium file:border-none file:outline-none hover:file:bg-slate-500
                    active:file:bg-slate-700 file:cursor-pointer " ref={inputRef} id="file_input" type="file" accept="text/csv" 
                    onChange={(e) => handleFileChange(e)} multiple={false}></input>
            </div>
            <div className="w-full px-4 flex items-center justify-center space-x-4">
                    <button onClick={handleProcessClick} className={`p-4 my-4 w-42 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700
                                                                ${loading ? "cursor-wait" : ""}`}>
                        Process File
                    </button>
                    <button onClick={resetInput} className="p-4 w-32 font-medium text-lg text-gray-100 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg shadow-md 
                                                hover:shadow-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-rose-600 
                                                active:bg-gradient-to-r active:from-red-700 active:to-rose-700">
                        Cancel
                    </button>
                </div>
        </section>
    );
}

interface ProcessVoteCardProps {
    votingData: ProcessedAwardsVotingData;
    setVotingResults: (votingResults: VotingResults) => void;
}

const ProcessVoteCard = ({ votingData, setVotingResults }: ProcessVoteCardProps): JSX.Element => {
    
    const handleClick = () => {
        
        if (!votingData) {
            return;
        }

        const results: VotingResults = {};

        Object.values(AWARDS).forEach((award) => {
            const condensedData = extractAwardCategory(votingData, award);
            const categoryResult = countVote(condensedData);
            console.log(award, categoryResult);
            
            let winner = '';
            let maxCount = 0;
            Object.keys(categoryResult).forEach((nominee) => {
                if (categoryResult[nominee] > maxCount) {
                    maxCount = categoryResult[nominee];
                    winner = nominee;
                }
            });
            results[award] = winner;
        });

        setVotingResults(results);
    }


    return (
        <section className="box-border w-full min-w-fit h-min z-0 bg-white rounded-2xl shadow-md flex flex-col space-y-1">
            <div className="bg-white h-fit w-full rounded-t-2xl drop-shadow-md flex">
                <h1 className="px-3 py-4 font-medium text-2xl">Process Voting Results</h1>
            </div>
            <div className="box-border p-4 w-full h-min rounded-b-2xl flex flex-col items-center space-y-6">
                <p className="p-2 text-lg text-gray-900 bg-slate-100 rounded-lg">
                    The votes are now ready to be processed.
                    <span className="font-medium"> Categories to tally: {Object.keys(AWARDS).length}. Voters found: {Object.keys(votingData).length}.</span> 
                    <br/>
                    Voting results will be displayed below once complete.
                </p>
                <button onClick={handleClick} className={`p-4 my-4 w-42 font-medium text-xl text-gray-100 bg-slate-600 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-500 active:bg-slate-700`}>
                        Tally Votes
                </button>
            </div>
        </section>
    );
}

interface VotingResultsGalleryProps {
    votingResults: VotingResults;
}

const VotingResultsGallery = ({ votingResults }: VotingResultsGalleryProps) => {    
    return (
        <div className="w-full h-min grid grid-cols-1 xl:grid-cols-2 gap-8">
            {Object.keys(votingResults).map((award, index) => (
                <ResultCard key={index} award={award} winner={votingResults[award]} />
            ))}
        </div>
    );
}

const ResultCard = ({ award, winner }: { award: string; winner: string }): JSX.Element => {
    return (
        <div className="w-auto min-w-fit h-fit bg-white px-2 py-3 rounded-2xl shadow-md flex flex-col items-start space-y-4">
            <div className="w-full min-w-fit flex justify-start shadow-md rounded-lg p-1">
                <BiTrophy className="w-12 h-12 p-2" />
                <p className="px-2 py-3 font-semibold text-xl">{award === 'People\'s Choice' ? '' : 'Best '} {award}</p>
            </div>
            <div className="w-full min-w-fit flex justify-start p-1">
                <BiCameraMovie className="w-12 h-12 p-2" />
                <p className="px-2 py-2 font-medium text-lg">{winner}</p>
            </div>
        </div>
    );
}