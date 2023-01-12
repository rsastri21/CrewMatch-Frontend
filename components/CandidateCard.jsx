async function getCandidateCount() {
    
    let candidateCount = 0;

    const res = await fetch('http://localhost:8080/api/candidate/getCount', { cache: "no-store" })
                        .then(response => response.text())
                        .then(result => {
                                    candidateCount = parseInt(result);
                            });

    return candidateCount;

}

async function getPercent(path) {
    
    let percent = 0.0;

    const res = await fetch(`http://localhost:8080/api/candidate/get/percent${path}`,  { cache: "no-store" })
                            .then(response => response.text())
                            .then(result => {
                                percent = parseFloat(result);
                            });
    
    return percent;
}

export default async function CandidateCard() {

    const countData = getCandidateCount();
    const assignedData = getPercent("Assigned");
    const actingData = getPercent("Acting");

    // Waiting for promises to resolve
    const [count, assigned, acting] = await Promise.all([countData, assignedData, actingData]);
    
    return (
        <div className="box-border w-72 h-80 min-w-fit ml-auto mr-4 bg-white rounded-2xl shadow-md">
            {/* Top bar label */}
            <div className="bg-white h-16 w-full rounded-t-2xl drop-shadow-md flex justify-between">
                <h1 className="px-3 py-4 font-md text-2xl">Candidates</h1>
                <h1 className="fixed top-0 right-0 mr-2 mt-2 py-2 px-3 font-md text-2xl bg-gradient-to-r from-emerald-600 to-teal-500
                            rounded-lg text-slate-50 shadow-md">{count}</h1>
            </div>
            <div className="box-border p-2 w-full h-min bg-white rounded-b-2xl flex flex-col items-center">
                <h3 className="px-3 py-3 font-md text-xl font-medium rounded-xl">Percent Assigned:</h3>
                <h3 className="py-2 px-3 my-2 font-md text-2xl bg-gradient-to-r from-emerald-600 to-teal-500
                            rounded-lg text-slate-50 shadow-md">{assigned}%</h3>
                <h3 className="px-3 py-3 font-md text-xl font-medium rounded-xl">Interest in Acting:</h3>
                <h3 className="py-2 px-3 my-2 text-2xl bg-gradient-to-r from-emerald-600 to-teal-500
                            rounded-lg text-slate-50 shadow-md">{acting}%</h3>
            </div>
        </div>
    );
}